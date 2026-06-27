import re
import contractions

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Expand contractions
    text = contractions.fix(text)
    
    # Remove special characters (except spaces and basic punctuation if needed)
    # Keeping it simple for toxicity: remove most non-alphanumeric
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize by splitting (for our use case in highlight.py)
    tokens = text.split()
    
    return tokens

def get_clean_text(text):
    tokens = preprocess_text(text)
    return " ".join(tokens)
