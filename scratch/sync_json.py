import json

src_path = "/home/yennguyen/AIInAction/K3-hackathon-B52-E403/vision_multimodal/slide_multimodal_metadata.json"
dst_path = "/home/yennguyen/AIInAction/K3-hackathon-B52-E403/codebase/src/data/slide_vision_metadata.json"

with open(src_path, "r", encoding="utf-8") as f:
    data = json.load(f)

with open(dst_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Synchronized JSON files successfully!")
