from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

MODEL_NAME = "unitary/toxic-bert"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

def predict_toxicity(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.sigmoid(outputs.logits).squeeze().tolist()
    
    # Handle single string input case where squeeze might return a scalar if not careful
    if isinstance(probs, float):
        probs = [probs]
        
    labels = ["toxic","severe_toxic","obscene","threat","insult","identity_hate"]
    return dict(zip(labels, probs))
