from models.text_model import predict_toxicity_batch


def get_highlighted_tokens(text: str, baseline_score: float | None = None) -> list[dict]:
    """
    Compute per-word attribution scores using a SINGLE batched model call.

    Previously this called predict_toxicity() once per word (N+1 calls).
    Now it builds all masked texts upfront and runs ONE batched forward pass,
    making it ~10-20x faster for typical sentences.

    Args:
        text: Original text to highlight.
        baseline_score: Pre-computed baseline toxic score. If provided,
                        saves one extra model call (already computed in /analyze/text).
    """
    words = text.split()
    if not words:
        return []

    # Build all masked texts in one go
    masked_texts = []
    for i in range(len(words)):
        masked = words[:i] + words[i + 1:]
        masked_texts.append(" ".join(masked) if masked else "")

    # Resolve baseline — reuse caller's score if available, else include in batch
    if baseline_score is None:
        all_texts = [text] + masked_texts
        all_results = predict_toxicity_batch(all_texts)
        baseline_score = all_results[0]["toxic"]
        masked_results = all_results[1:]
    else:
        # Only run masked texts — baseline already known
        masked_results = predict_toxicity_batch(masked_texts) if masked_texts else []

    # Compute attribution per word
    highlighted_tokens = []
    for i, word in enumerate(words):
        if not masked_texts[i].strip():
            # Single-word input — attribution IS the baseline score
            token_score = baseline_score
        else:
            token_score = baseline_score - masked_results[i]["toxic"]

        highlighted_tokens.append({
            "word": word,
            "score": float(token_score),
            "toxic": token_score > 0.1,
        })

    return highlighted_tokens
