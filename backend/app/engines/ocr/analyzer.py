import os
import re
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

# Lazy initialization of OCR
_ocr_instance = None

def get_ocr():
    global _ocr_instance
    if _ocr_instance is None:
        try:
            from paddleocr import PaddleOCR
            # use_angle_cls=True allows identifying rotated text
            # show_log=False reduces console spam
            _ocr_instance = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            _ocr_instance = "FAILED"
    return _ocr_instance

def extract_dates(text: str) -> list:
    # Matches dates like YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, Jan 12 2024, etc.
    date_pattern = r'\b(?:\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b'
    dates = re.findall(date_pattern, text, flags=re.IGNORECASE)
    return list(set(dates))

def extract_prices(text: str) -> list:
    # Matches prices like $12.99, 12.99, Rs. 500, ₹ 100.00
    price_pattern = r'\b(?:[$€£₹]|Rs\.?|INR)?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\b'
    prices = re.findall(price_pattern, text, flags=re.IGNORECASE)
    
    # Clean up prices (remove currency symbols to get pure numbers)
    clean_prices = []
    for p in prices:
        clean_p = re.sub(r'[^0-9.]', '', p)
        if clean_p:
            clean_prices.append(clean_p)
    return list(set(clean_prices))

def extract_couriers(text: str) -> list:
    couriers = ["fedex", "ups", "dhl", "usps", "bluedart", "delhivery", "amazon", "flipkart", "zomato", "swiggy", "doordash", "ubereats", "instacart"]
    text_lower = text.lower()
    found = []
    for c in couriers:
        if c in text_lower:
            found.append(c.title())
    return found

def analyze_ocr(image_path: str) -> Dict[str, Any]:
    """
    Extract text using PaddleOCR and attempt to find key fields.
    """
    if not os.path.exists(image_path):
        return {
            "status": "FAILED",
            "raw_text": "",
            "extracted_data": {},
            "error": "File not found"
        }

    ocr = get_ocr()
    if ocr == "FAILED":
        return {
            "status": "NOT_CONFIGURED",
            "raw_text": "",
            "extracted_data": {},
            "error": "PaddleOCR not installed or failed to init"
        }

    try:
        results = ocr.ocr(image_path, cls=True)
        if not results or not results[0]:
            return {
                "status": "COMPLETED",
                "raw_text": "",
                "extracted_data": {},
                "error": "No text detected"
            }
            
        lines = []
        for line in results[0]:
            # line structure: [[box], (text, confidence)]
            if len(line) >= 2 and len(line[1]) >= 2:
                text = line[1][0]
                lines.append(text)
                
        full_text = " ".join(lines)
        
        # 1. Extract standard entities
        dates = extract_dates(full_text)
        prices = extract_prices(full_text)
        couriers = extract_couriers(full_text)
        
        # 2. Extract Order IDs / Tracking Numbers
        order_ids = []
        
        # Look for explicit keywords indicating an order or tracking number
        keyword_pattern = re.compile(r'(?:order|ord|invoice|tracking|trk|awb|waybill)\s*(?:no|num|id|#)?\s*[:#\-]?\s*([a-z0-9\-]+)', re.IGNORECASE)
        matches = keyword_pattern.findall(full_text)
        for m in matches:
            if len(m) >= 5 and any(c.isdigit() for c in m):  # Must contain digits and be decent length
                order_ids.append(m.upper())
                
        # Look for common tracking number formats (UPS: 1Z..., FedEx: 12-15 digits, etc.)
        tracking_pattern = re.compile(r'\b(1Z[A-Z0-9]{16}|\d{12,15}|[A-Z]{2}\d{9}[A-Z]{2})\b', re.IGNORECASE)
        track_matches = tracking_pattern.findall(full_text)
        order_ids.extend([t.upper() for t in track_matches])
        
        # Deduplicate
        order_ids = list(set(order_ids))
        
        return {
            "status": "COMPLETED",
            "raw_text": full_text,
            "extracted_data": {
                "possible_dates": dates,
                "possible_prices": prices,
                "possible_couriers": couriers,
                "possible_order_ids": order_ids
            },
            "error": None
        }
    except Exception as e:
        logger.error(f"OCR Error: {e}")
        return {
            "status": "FAILED",
            "raw_text": "",
            "extracted_data": {},
            "error": str(e)
        }
