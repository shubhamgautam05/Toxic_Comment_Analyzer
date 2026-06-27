import easyocr
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import io

# Initialize reader globally or on first call
# For efficiency in a real dev server, we'll initialize it here.
reader = None

def get_reader():
    global reader
    if reader is None:
        reader = easyocr.Reader(['en'])
    return reader

def extract_text_from_image(image_bytes):
    # Use PIL to load the image
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if not already
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # We'll use the raw image for EasyOCR as it handles its own preprocessing
    # and sometimes manual filters like MedianFilter blur the text too much.
    ocr_reader = get_reader()
    
    # Using paragraph=True helps in joining words into meaningful sentences
    # and avoiding random fragments.
    results = ocr_reader.readtext(np.array(img), detail=0, paragraph=True)
    
    # Join with space and clean up any double spaces
    text = " ".join(results)
    text = " ".join(text.split())
    
    return text
