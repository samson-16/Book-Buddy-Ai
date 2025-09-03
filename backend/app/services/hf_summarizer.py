import aiohttp
import os
from app.config import HF_API_KEY, HF_MODEL
from functools import lru_cache

HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}

@lru_cache(maxsize=128)
async def summarize_text(text: str) -> str:
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

    payload = {
        "inputs": text,
        "parameters": {
            "do_sample": False,
            "min_length": 25,
            "max_length": 150,
        }
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=HEADERS, json=payload, timeout=aiohttp.ClientTimeout(total=120)) as response:
            response.raise_for_status()
            data = await response.json()
            if isinstance(data, list) and "summary_text" in data[0]:
                return data[0]["summary_text"]
            return str(data)