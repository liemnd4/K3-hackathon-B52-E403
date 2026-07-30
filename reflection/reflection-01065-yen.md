# Reflection — Nguyễn Hồng Yến 

## Phần tôi đảm nhận
- Xây dựng pipeline Vision-RAG tự động sử dụng `PyMuPDF` để trích xuất và kết xuất hình ảnh chất lượng cao từ slide PDF (`yolo_vision_pipeline.py`).
- Thiết kế thuật toán định vị và cắt chính xác (crop) vùng sơ đồ/biểu đồ bài học cốt lõi (các trang 4, 5, 12, 13, 14, 16, 17, 18, 19), loại bỏ hoàn toàn các ảnh chân dung nhỏ và icon rác gây loãng dữ liệu.
- Tích hợp OpenAI GPT-4o-mini Vision API để tự động chuyển đổi thông tin trực quan từ sơ đồ (như trục lịch sử AI, mạng AlexNet, vòng lặp Reinforcement Learning của AlphaGo) thành mô tả chi tiết bằng tiếng Việt.
- Đồng bộ hóa dữ liệu mô tả trực quan vào file cấu trúc JSON (`codebase/src/data/slide_vision_metadata.json`) để làm giàu ngữ cảnh cho AI Chatbot.
- Quản lý và làm sạch kho lưu trữ Git: cấu hình tối ưu file `.gitignore` để bỏ qua các tệp tin build cache Vite (`.vite/`), ảnh sinh tự động (`crops/`, `slides/`), file PDF nặng và bảo mật tuyệt đối các file `.env`.

## Điều tôi học được
- Với slide bài giảng học thuật, biểu đồ và sơ đồ (như kiến trúc AlexNet hay cơ chế Self-Attention) chứa lượng tri thức cốt lõi nhất. Nếu chỉ sử dụng RAG văn bản thuần túy (Text RAG), AI sẽ hoàn toàn "mù" trước các hình vẽ trực quan này. Việc tích hợp **Vision RAG** giúp AI Tutor có khả năng "nhìn" và giải thích chính xác các mối quan hệ đồ họa mà text extraction không thể diễn đạt được.
- Xử lý tọa độ crop ảnh trên PDF cần tính toán tỉ lệ chính xác theo DPI (Dotted Per Inch) để đảm bảo ảnh cắt ra sắc nét, không bị vỡ chữ và không bị lệch khung hình.

## Điều tôi sẽ làm khác đi
- Nếu làm lại từ đầu, tôi sẽ nghiên cứu sâu hơn giải pháp tự động nhận diện vùng sơ đồ bằng mô hình Object Detection (như YOLOv11-Layout) thay vì định cấu hình tọa độ vùng crop, giúp hệ thống hoạt động linh hoạt với mọi file PDF slide tải lên bất kỳ mà không cần cấu hình cứng.
- Triển khai cơ chế bộ nhớ đệm (caching) cho các mô tả sơ đồ đã được AI phân tích để giảm thiểu số lượt gọi API OpenAI Vision, tiết kiệm chi phí và tăng tốc độ xử lý khi người dùng chuyển trang.

## Điểm tôi tự chấm
- **Xử lý ảnh & Pipeline**: 9.5/10 (cắt sơ đồ nguyên bản nét căng, phân loại trang chính xác).
- **Tích hợp & Làm giàu dữ liệu (Vision RAG)**: 9/10 (kết nối mượt mà vào tệp dữ liệu chung để chatbot UI sử dụng).
- **Tổ chức Repo & Git Security**: 9.5/10 (cấu hình .gitignore chuẩn chỉ, loại bỏ file rác hoàn hảo).
