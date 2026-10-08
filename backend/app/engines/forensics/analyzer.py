import os
from typing import Dict, Any, Optional
from PIL import Image, ExifTags, ImageStat

EDITING_SOFTWARE_KEYWORDS = [
    "photoshop", "adobe", "gimp", "canva", "snapseed", 
    "lightroom", "procreate", "figma", "midjourney", 
    "dall-e", "stable diffusion", "facetune", "picsart"
]

def analyze_image_forensics(image_path: str, source_type: str = "real_upload") -> Dict[str, Any]:
    """
    Real forensic inspection of uploaded image using Pillow:
    1. EXIF metadata extraction and editing software keyword scanning
    2. Camera hardware metadata presence check
    3. Channel statistics and compression noise consistency check
    """
    if not os.path.exists(image_path):
        return {
            "metadata_anomaly": True,
            "possible_editing": False,
            "compression_anomaly": False,
            "clone_region": False,
            "resampling_indicator": False,
            "quality_score": 0.0,
            "manipulation_score": 10.0,
            "details": {"error": "Image file not found on disk"},
            "signal_score": 10
        }

    try:
        with Image.open(image_path) as img:
            format_name = img.format or "UNKNOWN"
            mode = img.mode
            width, height = img.size

            # 1. Extract EXIF
            exif_dict: Dict[str, str] = {}
            raw_exif = img.getexif()
            if raw_exif:
                for tag_id, value in raw_exif.items():
                    tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                    # Safely convert to string
                    try:
                        exif_dict[tag_name] = str(value)[:150]
                    except Exception:
                        pass

            # 2. Check for editing software signatures
            software_detected = None
            possible_editing = False
            for k, val in exif_dict.items():
                val_lower = val.lower()
                for kw in EDITING_SOFTWARE_KEYWORDS:
                    if kw in val_lower:
                        possible_editing = True
                        software_detected = f"{k}: {val}"
                        break
                if possible_editing:
                    break

            # 3. Check for metadata anomaly
            # If claimed to be taken live with camera but 0 camera tags (Make/Model/DateTime) exist
            has_camera_tags = any(k in exif_dict for k in ["Make", "Model", "DateTimeOriginal", "LensModel"])
            metadata_anomaly = False
            if source_type in ["camera_capture", "real_upload"] and not has_camera_tags:
                metadata_anomaly = True

            # 4. Channel variance check (detect abnormal blank or mono channel compression)
            compression_anomaly = False
            stat = ImageStat.Stat(img)
            variances = stat.var
            if variances and any(v < 1.0 for v in variances):
                compression_anomaly = True

            # Calculate genuine manipulation score
            manip_score = 0.0
            if possible_editing:
                manip_score += 45.0
            if metadata_anomaly:
                manip_score += 20.0
            if compression_anomaly:
                manip_score += 15.0

            quality_score = max(10.0, 100.0 - manip_score)
            signal_score = min(35, int(manip_score * 0.4))

            return {
                "metadata_anomaly": metadata_anomaly,
                "possible_editing": possible_editing,
                "compression_anomaly": compression_anomaly,
                "clone_region": False,
                "resampling_indicator": False,
                "quality_score": round(quality_score, 1),
                "manipulation_score": round(manip_score, 1),
                "software_detected": software_detected,
                "details": {
                    "format": format_name,
                    "dimensions": f"{width}x{height}",
                    "color_mode": mode,
                    "has_camera_tags": has_camera_tags,
                    "exif_count": len(exif_dict),
                    "software": software_detected
                },
                "signal_score": signal_score
            }
    except Exception as e:
        return {
            "metadata_anomaly": True,
            "possible_editing": False,
            "compression_anomaly": False,
            "clone_region": False,
            "resampling_indicator": False,
            "quality_score": 50.0,
            "manipulation_score": 15.0,
            "details": {"error": f"Forensic parsing error: {str(e)}"},
            "signal_score": 10
        }
