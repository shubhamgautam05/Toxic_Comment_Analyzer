from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

MODEL_NAME = "unitary/toxic-bert"

# --- Load model once at startup ---
print("⏳ Loading Toxic-BERT model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()  # Set to eval mode — disables dropout, speeds up inference

# Use half-precision (float16) on CPU for faster inference if supported
# Falls back to float32 if not
try:
    model = model.half()
    _use_fp16 = True
except Exception:
    _use_fp16 = False

print("✅ Toxic-BERT model loaded!")

LABELS = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]


def predict_toxicity(text: str) -> dict:
    """Run a single forward pass and return label→score dict."""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128,   # Reduced from 512 — toxic comments are rarely long
        padding=True,
    )
    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.sigmoid(outputs.logits).squeeze().float().tolist()

    if isinstance(probs, float):
        probs = [probs]

    return dict(zip(LABELS, probs))


def predict_toxicity_batch(texts: list[str]) -> list[dict]:
    """
    Run a SINGLE batched forward pass for multiple texts.
    ~10x faster than calling predict_toxicity() in a loop.
    """
    if not texts:
        return []

    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding=True,
    )
    with torch.no_grad():
        outputs = model(**inputs)

    probs_batch = torch.sigmoid(outputs.logits).float().tolist()
    return [dict(zip(LABELS, probs)) for probs in probs_batch]
