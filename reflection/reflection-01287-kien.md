# Reflection — Đỗ Trung Kiên (01287)

## Phần tôi đảm nhận
- Build phần lõi `codebase/VLearnMockup.jsx`: tích hợp lời gọi OpenAI (`gpt-4o-mini`) thật khi có API key, kèm fallback câu trả lời mẫu rõ ràng khi chưa cấu hình key hoặc lỗi mạng.
- Xử lý logic quyết định trung tâm trên UI: phát hiện có/không có đoạn bôi đen thật, lấy page context làm ngữ cảnh fallback.
- Tham gia viết spec §4, §8, §9 và log vòng validation.

## AI hỗ trợ thế nào
Tôi dùng AI để tham khảo cách triển khai React component, xử lý API call
và thiết kế fallback. Sau khi nhận gợi ý, tôi tự kiểm tra code, hiểu
luồng hoạt động và chỉnh sửa để phù hợp với sản phẩm.

## Điều tôi học được
Cái khó nhất không phải là gọi API thành công, mà là thiết kế **đường lui khi không có anchor thật** — quyết định lấy trang hiện tại làm ngữ cảnh thay vì để tutor trả lời "không tìm thấy" như 17% case thật trong chatlog đang gặp. Đây là chỗ nguyên tắc G10 (thu hẹp phạm vi khi nghi ngờ) trở thành code thật, không chỉ là dòng chữ trong spec. *(→ tự viết thêm: đoạn code/luồng nào bạn từng phải sửa đi sửa lại nhiều lần nhất?)*

## Điều tôi sẽ làm khác đi
Vòng validation (`validation/validation-log.md`) hiện chỉ có 2 phiên, và cả hai người thử đều là thành viên trong nhóm đóng vai học viên, chưa có người dùng thật ngoài nhóm. Rubric yêu cầu ≥5 người ngoài nhóm với tên/vai thật + ≥2 người trong số 3 willing user đã khai ở CP1 (Nguyễn Văn A, Trần Thị B, Lê Văn C — hiện chưa thấy log của 3 người này). Nếu làm lại, tôi sẽ ưu tiên chốt lịch test với 3 willing user thật ngay từ CP3, thay vì để dồn vào cuối và phải tự đóng vai thay.

## Điểm tôi tự chấm
- Prototype chạy được: 8/10 (có AI call thật, có fallback, flow chính bấm hết được)
- Thiết kế/nguyên tắc HAX áp dụng: 7/10
- Validation với user thật: 4/10 (chưa có người ngoài nhóm test thật — đây là phần yếu nhất của nhóm)
