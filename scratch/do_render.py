import os
import glob
import fitz  # PyMuPDF

slide_dir = "/home/yennguyen/AIInAction/K3-hackathon-B52-E403/codebase/public/slides"
pdf_path = os.path.join(slide_dir, "d1-slide-hackathon.pdf")

# 1. Xóa toàn bộ ảnh cũ
old_pngs = glob.glob(os.path.join(slide_dir, "page_*.png"))
for p in old_pngs:
    try:
        os.remove(p)
    except Exception as e:
        print(f"Error removing {p}: {e}")

print(f"✅ Đã xóa {len(old_pngs)} file ảnh cũ!")

# 2. Render đè lại 100% ảnh mới từ d1-slide-hackathon.pdf
doc = fitz.open(pdf_path)
print(f"📸 Đang render {len(doc)} trang từ {pdf_path}...")
for i, page in enumerate(doc):
    page_num = i + 1
    img_path = os.path.join(slide_dir, f"page_{page_num}.png")
    pix = page.get_pixmap(dpi=150)
    pix.save(img_path)
    print(f"  ✅ Rendered page {page_num}: {img_path}")

print("🎉 Hoàn tất render đè lại ảnh PNG chuẩn 100%!")
