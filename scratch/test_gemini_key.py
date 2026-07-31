import os
import json
import urllib.request

env_path = "/home/yennguyen/AIInAction/K3-hackathon-B52-E403/codebase/.env"
gemini_key = ""
with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("VITE_GEMINI_API_KEY="):
            gemini_key = line.strip().split("=", 1)[1].strip()

print(f"Gemini Key loaded: '{gemini_key[:10]}...' (Length: {len(gemini_key)})")

models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro"
]

payload = {
    "contents": [
        {
            "parts": [
                {"text": "Hello, respond with JSON: {\"status\": \"ok\"}"}
            ]
        }
    ]
}

data_bytes = json.dumps(payload).encode("utf-8")

for m in models:
    # Test method 1: Query param
    url1 = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={gemini_key}"
    req1 = urllib.request.Request(url1, data=data_bytes, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req1, timeout=10) as resp:
            print(f"✅ Success with model '{m}' (Query param)!")
            print(resp.read().decode("utf-8")[:200])
            break
    except Exception as e:
        print(f"❌ Failed model '{m}' (Query param): {e}")

    # Test method 2: Header
    url2 = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
    req2 = urllib.request.Request(url2, data=data_bytes, headers={"Content-Type": "application/json", "x-goog-api-key": gemini_key})
    try:
        with urllib.request.urlopen(req2, timeout=10) as resp:
            print(f"✅ Success with model '{m}' (Header x-goog-api-key)!")
            print(resp.read().decode("utf-8")[:200])
            break
    except Exception as e:
        print(f"❌ Failed model '{m}' (Header): {e}")
