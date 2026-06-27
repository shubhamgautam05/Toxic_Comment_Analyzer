from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

from database import Analysis, get_db, engine
from models.text_model import predict_toxicity
from models.ocr_model import extract_text_from_image
from utils.preprocess import get_clean_text
from utils.highlight import get_highlighted_tokens

app = FastAPI(title="Toxic Detector API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze/text")
def analyze_text(payload: dict, db: Session = Depends(get_db)):
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    # Process text
    clean_text = get_clean_text(text)
    categories = predict_toxicity(clean_text)
    toxicity_score = categories['toxic']
    highlighted_tokens = get_highlighted_tokens(text) # Use original text for visualization
    
    verdict = "TOXIC" if toxicity_score > 0.5 else "CLEAN"
    
    # Save to history
    new_analysis = Analysis(
        input_type="text",
        original_text=text,
        toxicity_score=toxicity_score,
        categories_json=categories,
        verdict=verdict
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    
    return {
        "id": new_analysis.id,
        "original_text": text,
        "is_toxic": toxicity_score > 0.5,
        "toxicity_score": toxicity_score,
        "categories": categories,
        "highlighted_tokens": highlighted_tokens,
        "verdict": verdict,
        "model_used": "toxic-bert"
    }

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        extracted_text = extract_text_from_image(contents)
        
        if not extracted_text.strip():
            return {
                "error": "No text detected in image",
                "extracted_text": ""
            }
            
        # Same logic as text analysis
        categories = predict_toxicity(extracted_text)
        toxicity_score = categories['toxic']
        highlighted_tokens = get_highlighted_tokens(extracted_text)
        
        verdict = "TOXIC" if toxicity_score > 0.5 else "CLEAN"
        
        new_analysis = Analysis(
            input_type="image",
            original_text=extracted_text,
            toxicity_score=toxicity_score,
            categories_json=categories,
            verdict=verdict
        )
        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)
        
        return {
            "id": new_analysis.id,
            "original_text": extracted_text,
            "is_toxic": toxicity_score > 0.5,
            "toxicity_score": toxicity_score,
            "categories": categories,
            "highlighted_tokens": highlighted_tokens,
            "verdict": verdict,
            "model_used": "toxic-bert"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).limit(10).all()
    return analyses

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
