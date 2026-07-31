# Reflection — Nguyễn Hồng Yến (MSSV: 2A202601065)

## Phần tôi đảm nhận
- **Phân tích dữ liệu Chatlog & Định hình bài toán (User Insight):** Thực hiện data mining trên 1.261 chatlog thực tế, phát hiện 71.9% lượt tương tác học viên không bôi đen text; thiết kế giải pháp cốt lõi *VLearn Page-Context Fallback* để giải quyết triệt để pain point này.
- **Xây dựng Multimodal Vision Pipeline (Xử lý Slide Ảnh):** Phát triển pipeline xử lý toàn bộ 29 trang slide dạng ảnh/PDF, tích hợp Vision AI (GPT-4o-mini / Gemini-1.5-Flash) để bóc tách sơ đồ, biểu đồ và văn bản phức tạp thành dữ liệu cấu trúc `slide_multimodal_metadata.json`.
- **Phát triển Engine Bám Ngữ Cảnh & RAG Range Query (`VLearnMockup.jsx`):**
  - Xây dựng cơ chế tự động neo ngữ cảnh trang slide hiện tại khi học viên gõ câu hỏi tự do.
  - Phát triển thuật toán nhận diện và trích xuất dải trang (Range Query, ví dụ: "tóm tắt từ trang 2 đến trang 4").
  - Khôi phục lớp chọn văn bản PDF.js, giao diện floating bubble "Hỏi về đoạn này" và giữ trạng thái bôi đen mượt mà.
- **Thiết kế Lớp An toàn & Trích nguồn (AI Safety & HAX):** Ép buộc quy tắc trích dẫn nguồn `📌 Nguồn: Trang N` ở dòng đầu tiên, phân biệt rõ ràng kiến thức bài học vs `📌 Nguồn: Kiến thức mở rộng`, cùng lớp phòng thủ chặn prompt injection / out-of-scope.
- **Đánh giá Eval & Git Security:** Thực hiện chạy tập kiểm thử Golden Set đạt tỷ lệ chính xác **100% (20/20 cases pass)**; quản lý repo Git, tối ưu `.gitignore` và bảo mật các tệp biến môi trường `.env`.

## Điều tôi học được
- Với slide học thuật chứa nhiều biểu đồ và sơ đồ, việc dùng Text-RAG đơn thuần sẽ khiến AI hoàn toàn "mù" trước dữ liệu hình ảnh. Việc kết hợp **Multimodal Vision RAG** biến slide ảnh thành "trí nhớ cấu trúc" giúp AI giải thích chi tiết các mối quan hệ trực quan.
- Tư duy thiết kế sản phẩm AI phải luôn xuất phát từ dữ liệu thực tế (1.261 chatlog) thay vì giả định. Giải quyết đúng 71.9% trường hợp không bôi đen mang lại impact lớn gấp nhiều lần việc thêm các tính năng phụ.
- Tầm quan trọng của tính minh bạch (Transparency): Việc dán nhãn nguồn rõ ràng ở dòng đầu tiên giúp xây dựng niềm tin tuyệt đối với học viên và loại bỏ rủi ro ảo giác (hallucination).

## Điều tôi sẽ làm khác đi
- Ứng dụng mô hình Object Detection (như YOLOv11-Layout) để tự động phân vùng sơ đồ linh hoạt cho mọi tài liệu PDF bất kỳ tải lên thay vì dựa vào định dạng slide cố định.
- Bổ sung bộ nhớ đệm (caching layer) cho các kết quả truy xuất ngữ cảnh để giảm latency và tiết kiệm chi phí gọi API khi người dùng chuyển trang liên tục.

## Điểm tôi tự chấm
- **Nghiên cứu Data & Thiết kế Giải pháp**: 9.5/10 (phát hiện và giải quyết đúng pain point 71.9% từ data thật).
- **Multimodal Vision Pipeline & RAG Engine**: 9.5/10 (bóc tách ảnh chi tiết, xử lý dải trang mượt mà, pass 100% Golden Set).
- **UX UI & AI Safety**: 9.5/10 (giao diện PDFViewer chuyên nghiệp, trích nguồn chuẩn xác, bảo mật an toàn).
- **Tổng thể đóng góp dự án**: 9.5/10.
