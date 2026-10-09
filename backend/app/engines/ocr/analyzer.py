import os
import re
from typing import Dict, Any, Optional
import logging
import json
from openai import OpenAI

logger = logging.getLogger(__name__)

# Lazy initialization of OCR
_ocr_instance = None

def get_ocr():
    global _ocr_instance
    if _ocr_instance is None:
        try:
            from paddleocr import PaddleOCR
            _ocr_instance = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {e}")
            _ocr_instance = "FAILED"
    return _ocr_instance

def extract_with_llm(text: str) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"possible_dates": [], "possible_prices": [], "possible_couriers": [], "possible_order_ids": []}
    
    try:
        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
        prompt = f"""
You are a factual data extraction engine for digital evidence. 
Extract key fields from the following raw OCR text taken from a receipt, shipping label, or digital screenshot.
Return ONLY a valid JSON object matching this schema exactly, and nothing else (no markdown tags like ```json):
{{
  "possible_dates": ["YYYY-MM-DD", ...],
  "possible_prices": ["12.99", ...],
  "possible_couriers": ["Amazon", "FedEx", ...],
  "possible_order_ids": ["ORDER123", "1Z9999999999999999", ...]
}}

Text to analyze:
{text}
"""
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        parsed = json.loads(content.strip())
        return {
            "possible_dates": parsed.get("possible_dates", []),
            "possible_prices": parsed.get("possible_prices", []),
            "possible_couriers": parsed.get("possible_couriers", []),
            "possible_order_ids": parsed.get("possible_order_ids", [])
        }
    except Exception as e:
        logger.error(f"LLM Extraction Error: {e}")
        return {"possible_dates": [], "possible_prices": [], "possible_couriers": [], "possible_order_ids": []}

def analyze_ocr(image_path: str) -> Dict[str, Any]:
    """
    Extract text using PaddleOCR and attempt to find key fields using DeepSeek.
    """
    if not os.path.exists(image_path):
        return {"status": "FAILED", "raw_text": "", "extracted_data": {}, "error": "File not found"}

    ocr = get_ocr()
    if ocr == "FAILED":
        return {"status": "NOT_CONFIGURED", "raw_text": "", "extracted_data": {}, "error": "PaddleOCR not installed or failed to init"}

    try:
        results = ocr.ocr(image_path, cls=True)
        if not results or not results[0]:
            return {"status": "COMPLETED", "raw_text": "", "extracted_data": {}, "error": "No text detected"}
            
        lines = []
        for line in results[0]:
            if len(line) >= 2 and len(line[1]) >= 2:
                lines.append(line[1][0])
                
        full_text = " ".join(lines)
        
        # Extract standard entities using LLM
        extracted_data = extract_with_llm(full_text)
        
        return {
            "status": "COMPLETED",
            "raw_text": full_text,
            "extracted_data": extracted_data,
            "error": None
        }
    except Exception as e:
        logger.error(f"OCR Error: {e}")
        return {"status": "FAILED", "raw_text": "", "extracted_data": {}, "error": str(e)}

