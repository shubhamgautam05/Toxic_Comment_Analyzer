FROM python:3.10-slim-bookworm

# Install system dependencies for EasyOCR and Torch
RUN apt-get update --fix-missing && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models to make startup faster and avoid runtime downloads
RUN python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; AutoTokenizer.from_pretrained('unitary/toxic-bert'); AutoModelForSequenceClassification.from_pretrained('unitary/toxic-bert')"
RUN python -c "import easyocr; easyocr.Reader(['en'])"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
