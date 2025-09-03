from typing import List

def chunk_text(text: str, max_chars=1000, overlap=100) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        chunks.append(text[start:end])
        start = end - overlap
    return chunks
