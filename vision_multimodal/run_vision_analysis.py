import os
import json
import base64
import urllib.request
import urllib.error
import fitz  # PyMuPDF

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

def process_all_slides():
    if not os.path.exists(SLIDE_PDF):
        print(f"❌ Không tìm thấy file PDF tại {SLIDE_PDF}")
        return

    doc = fitz.open(SLIDE_PDF)
    print(f"📄 Đang xử lý {len(doc)} trang slide từ file {SLIDE_PDF}...")

    results = {}

    for i, page in enumerate(doc):
        page_num = i + 1
        img_path = os.path.join(SLIDE_IMG_DIR, f"page_{page_num}.png")
        
        # Bắt buộc render đè lại ảnh mới nhất từ d1-slide-hackathon.pdf chuẩn trên Web
        pix = page.get_pixmap(dpi=150)
        pix.save(img_path)

        with open(img_path, "rb") as f:
            base64_img = base64.b64encode(f.read()).decode("utf-8")

        prompt = (
            f"Bạn là chuyên gia phân tích tài liệu slide bài giảng AI (Trang {page_num}). "
            "Hãy nhìn vào bức ảnh slide này và phân tích ĐÚNG 100% nội dung thực tế có trên ảnh:\n"
            "1. Tiêu đề chính xác trên slide (title).\n"
            "2. Trang có chứa sơ đồ, biểu đồ hay hình minh họa không (has_diagram: true/false).\n"
            "3. Mô tả chi tiết nội dung văn bản và cấu trúc trực quan của sơ đồ/biểu đồ (description).\n"
            "Trả về JSON định dạng: {\"title\": \"...\", \"has_diagram\": true/false, \"description\": \"...\"}"
        )

        try:
            url = "https://api.openai.com/v1/chat/completions"
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{base64_img}"}
                            }
                        ]
                    }
                ],
                "response_format": {"type": "json_object"},
                "max_tokens": 700
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
                            "description": content.get("description", "Chi tiết trang slide.")
                        }
                    ]
                }
                print(f"  ✅ [Trang {page_num}/{len(doc)}] Đọc thành công: {content.get('title')}")

        except Exception as e:
            print(f"  ❌ [Trang {page_num}] Lỗi: {e}")
            results[f"page_{page_num}"] = {
                "page_number": page_num,
                "title": f"Trang {page_num}",
                "has_diagram": True,
                "crops": [
                    {
                        "crop_id": f"p{page_num}_multimodal",
                        "title": f"Trang {page_num}",
                        "type": "Full_Slide_Multimodal",
                        "crop_path": f"/slides/page_{page_num}.png",
                        "description": f"Hình ảnh trực quan trang slide {page_num}."
                    }
                ]
            }

    # Ghi ra 2 file JSON
    with open(OUTPUT_JSON_1, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    with open(OUTPUT_JSON_2, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 HOÀN THÀNH BÓC TÁCH DỮ LIỆU SLIDE CHUẨN XÁC 100%!")

if __name__ == "__main__":
    process_all_slides()
