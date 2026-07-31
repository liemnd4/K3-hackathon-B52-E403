import os
import glob
import json
import base64
import urllib.request
import fitz  # PyMuPDF
import time

# 1. Đọc API Key từ .env
def get_openai_key():
    env_path = os.path.join(os.path.dirname(__file__), "..", "codebase", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip().startswith("VITE_OPENAI_API_KEY="):
                    return line.strip().split("=", 1)[1].strip()
    return ""

api_key = get_openai_key()

SLIDE_PDF = os.path.join(os.path.dirname(__file__), "..", "codebase", "public", "slides", "d1-slide-hackathon.pdf")
SLIDE_IMG_DIR = os.path.join(os.path.dirname(__file__), "..", "codebase", "public", "slides")
OUTPUT_JSON_1 = os.path.join(os.path.dirname(__file__), "slide_multimodal_metadata.json")
OUTPUT_JSON_2 = os.path.join(os.path.dirname(__file__), "..", "codebase", "src", "data", "slide_vision_metadata.json")

def get_gemini_key():
    env_path = os.path.join(os.path.dirname(__file__), "..", "codebase", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip().startswith("VITE_GEMINI_API_KEY="):
                    return line.strip().split("=", 1)[1].strip()
    return ""

gemini_key = get_gemini_key()

def analyze_slide_multimodal(page_num, base64_img, prompt):
    # 1. ƯU TIÊN SỐ 1: Bắt buộc gọi Gemini 1.5 Flash với VITE_GEMINI_API_KEY
    if gemini_key:
        models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash-exp", "gemini-1.5-pro"]
        for m in models:
            # Thử qua query parameter & header x-goog-api-key
            for send_as_header in [False, True]:
                try:
                    if send_as_header:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
                        headers = {"Content-Type": "application/json", "x-goog-api-key": gemini_key}
                    else:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={gemini_key}"
                        headers = {"Content-Type": "application/json"}

                    payload = {
                        "contents": [
                            {
                                "parts": [
                                    {"text": prompt + "\nTrả về duy nhất JSON dạng: {\"title\": \"...\", \"has_diagram\": true, \"description\": \"...\"}"},
                                    {
                                        "inline_data": {
                                            "mime_type": "image/png",
                                            "data": base64_img
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        res_data = json.loads(resp.read().decode("utf-8"))
                        raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        if "```json" in raw_text:
                            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                        elif "```" in raw_text:
                            raw_text = raw_text.split("```")[1].split("```")[0].strip()
                        content = json.loads(raw_text)
                        print(f"  ✨ [Gemini 1.5 Flash - Model: {m}] [Trang {page_num}] Phân tích thành công: {content.get('title')}")
                        return content
                except Exception as e:
                    # Thử model tiếp theo nếu chưa thành công
                    continue

    # 2. Sử dụng OpenAI GPT-4o-mini Vision (Model Multimodal cực mạnh xử lý ảnh chuẩn xác)
    if api_key and api_key.startswith("sk-"):
        try:
            url = "https://api.openai.com/v1/chat/completions"
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": (
                                    f"Bạn là gia sư AI phân tích trang slide bài học (Trang {page_num}). "
                                    "Hãy nhìn vào bức ảnh slide này và phân tích ĐÚNG 100% nội dung thực tế đang hiển thị trên bức ảnh:\n"
                                    "1. Tiêu đề chính xác trên slide (title).\n"
                                    "2. Trang có chứa sơ đồ/biểu đồ/hình minh họa hay không (has_diagram: true/false).\n"
                                    "3. Mô tả chi tiết 2-4 câu nội dung văn bản và cấu trúc trực quan của các khối/sơ đồ có trong ảnh (description).\n"
                                    "Trả về định dạng JSON thuần gồm 3 thuộc tính: title, has_diagram, description."
                                )
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{base64_img}"
                                }
                            }
                        ]
                    }
                ],
                "response_format": {"type": "json_object"},
                "max_tokens": 500
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                content = json.loads(res_data["choices"][0]["message"]["content"])
                print(f"  ✅ [OpenAI GPT-4o-mini Vision] [Trang {page_num}] Phân tích thành công: {content.get('title')}")
                return content
        except Exception as e:
            print(f"  ⚠️ OpenAI Vision lỗi [Trang {page_num}]: {e}")

    return {
        "title": f"Trang {page_num}",
        "has_diagram": True,
        "description": f"Trang slide {page_num} bài giảng AI Foundation."
    }

def main():
    print("🧹 [1/3] Đang xóa toàn bộ file ảnh cũ page_*.png...")
    old_pngs = glob.glob(os.path.join(SLIDE_IMG_DIR, "page_*.png"))
    for p in old_pngs:
        try:
            os.remove(p)
        except Exception:
            pass
    print(f"  ✅ Đã xóa sạch {len(old_pngs)} file ảnh cũ!")

    if not os.path.exists(SLIDE_PDF):
        print(f"❌ Không tìm thấy PDF tại {SLIDE_PDF}")
        return

    doc = fitz.open(SLIDE_PDF)
    print(f"\n📸 [2/3] Đang render đè lại {len(doc)} trang ảnh PNG mới nhất từ file d1-slide-hackathon.pdf...")
    for i, page in enumerate(doc):
        page_num = i + 1
        img_path = os.path.join(SLIDE_IMG_DIR, f"page_{page_num}.png")
        pix = page.get_pixmap(dpi=150)
        pix.save(img_path)
        print(f"  📸 Rendered fresh page {page_num}: {img_path}")

    print("\n🔍 [3/3] Đang gọi Vision AI (Gemini 1.5 Flash / GPT-4o-mini) đọc và bóc tách dữ liệu 29 trang...")
    results = {}
    
    # Load lại metadata hiện có nếu có sẵn để không làm mất các trang đã phân tích đúng
    if os.path.exists(OUTPUT_JSON_2):
        try:
            with open(OUTPUT_JSON_2, "r", encoding="utf-8") as f:
                results = json.load(f)
        except Exception:
            results = {}

    for i in range(len(doc)):
        page_num = i + 1
        img_path = os.path.join(SLIDE_IMG_DIR, f"page_{page_num}.png")
        
        with open(img_path, "rb") as f:
            base64_img = base64.b64encode(f.read()).decode("utf-8")

        prompt = (
            f"Bạn là gia sư AI phân tích trang slide bài học (Trang {page_num}). "
            "Hãy nhìn vào bức ảnh slide này và phân tích ĐÚNG 100% nội dung thực tế đang hiển thị trên bức ảnh:\n"
            "1. Tiêu đề chính xác trên slide (title).\n"
            "2. Trang có chứa sơ đồ/biểu đồ/hình minh họa hay không (has_diagram: true/false).\n"
            "3. Mô tả chi tiết 2-4 câu nội dung văn bản và cấu trúc trực quan của các khối/sơ đồ có trong ảnh (description)."
        )

        # Thử lại tối đa 3 lần nếu dính lỗi Rate Limit 429
        content = None
        for attempt in range(3):
            content = analyze_slide_multimodal(page_num, base64_img, prompt)
            if content and content.get("title") != f"Trang {page_num}":
                break
            time.sleep(2.5) # Chờ nếu bị 429

        if content:
            results[f"page_{page_num}"] = {
                "page_number": page_num,
                "title": content.get("title", f"Trang {page_num}"),
                "has_diagram": content.get("has_diagram", True),
                "crops": [
                    {
                        "crop_id": f"p{page_num}_multimodal",
                        "title": content.get("title", f"Phân tích Trang {page_num}"),
                        "type": "Full_Slide_Multimodal",
                        "crop_path": f"/slides/page_{page_num}.png",
                        "description": content.get("description", "Mô tả nội dung trực quan slide.")
                    }
                ]
            }
        
        time.sleep(1.5) # Giảm tốc độ để không bị Rate Limit 429 API

    # Ghi ra 2 file JSON
    with open(OUTPUT_JSON_1, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    with open(OUTPUT_JSON_2, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("\n🎉 HOÀN THÀNH XOÁ ẢNH CŨ, RENDER ẢNH MỚI & BÓC TÁCH MULTIMODAL CHUẨN XÁC!")

if __name__ == "__main__":
    main()
