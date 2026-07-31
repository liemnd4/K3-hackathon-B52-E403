import os
import fitz

pdf_path = os.path.join(os.path.dirname(__file__), "..", "codebase", "public", "slides", "d1-slide-hackathon.pdf")
doc = fitz.open(pdf_path)
print(f"Total pages in d1-slide-hackathon.pdf: {len(doc)}")
for i in range(min(6, len(doc))):
    text = doc[i].get_text().strip()
    print(f"\n--- PAGE {i+1} ---")
    print(text[:200])
