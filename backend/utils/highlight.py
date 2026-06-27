from models.text_model import predict_toxicity

def get_highlighted_tokens(text):
    # We use the raw text for tokens to preserve original wording for UI
    # but maybe we should use clean tokens? 
    # Specification says: "Split text into tokens... Return per-token scores".
    
    words = text.split()
    if not words:
        return []

    # Get baseline toxicity (multi-label, but we'll focus on 'toxic' for highlighting)
    baseline_results = predict_toxicity(text)
    baseline_score = baseline_results['toxic']
    
    highlighted_tokens = []
    
    for i in range(len(words)):
        # Create text without the current word
        masked_words = words[:i] + words[i+1:]
        masked_text = " ".join(masked_words)
        
        if not masked_text.strip():
            # If it's a single word text, the delta is just its score
            token_score = baseline_score
        else:
            masked_results = predict_toxicity(masked_text)
            masked_score = masked_results['toxic']
            token_score = baseline_score - masked_score
            
        highlighted_tokens.append({
            "word": words[i],
            "score": float(token_score),
            "toxic": token_score > 0.1 # Threshold for UI waving red line
        })
        
    return highlighted_tokens
