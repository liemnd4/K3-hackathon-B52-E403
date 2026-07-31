import os
import json
import base64
import urllib.request

api_key = os.getenv("OPENAI_API_KEY", "YOUR_API_KEY_HERE")
img_path = "/home/yennguyen/AIInAction/K3-hackathon-B52-E403/codebase/public/slides/page_4.png"

with open(img_path, "rb") as f:
    base64_img = base64.b64encode(f.read()).decode("utf-8")

payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Phân tích tiêu đề và nội dung slide này dưới dạng JSON: {\"title\": \"...\", \"description\": \"...\"}"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_img}"
                    }
                }
            ]
        }
    ],
    "response_format": {"type": "json_object"}
}

req = urllib.request.Request(
    "https://api.openai.com/v1/chat/completions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("RESULT:")
        print(res["choices"][0]["message"]["content"])
except Exception as e:
    print(f"Error: {e}")
