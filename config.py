import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL_ID = "meta-llama/Llama-3.1-70B-Instruct"

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is not set in your .env file.")

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)


def call_llm(prompt: str, temperature: float = 0.3, max_tokens: int = 2048) -> str:
    """
    Call Llama 3.1 70B Instruct via HuggingFace router (OpenAI-compatible API).
    No model download required — runs entirely on HuggingFace's servers.
    """
    completion = client.chat.completions.create(
        model=HF_MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return completion.choices[0].message.content