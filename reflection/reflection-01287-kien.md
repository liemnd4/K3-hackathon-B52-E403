# Reflection — Đỗ Trung Kiên (01287)

## Phần tôi đảm nhận
- Build phần lõi `codebase/VLearnMockup.jsx`: tích hợp lời gọi OpenAI (`gpt-4o-mini`) thật khi có API key, kèm fallback câu trả lời mẫu rõ ràng khi chưa cấu hình key hoặc lỗi mạng.
- Xử lý logic quyết định trung tâm trên UI: phát hiện có/không có đoạn bôi đen thật, lấy page context làm ngữ cảnh fallback.
- Tham gia viết spec §4, §8, §9 và log vòng validation.

## AI hỗ trợ thế nào
Tôi dùng AI để triển khai React component, xử lý API call
và thiết kế fallback. Sau khi nhận gợi ý, tôi tự kiểm tra code, hiểu
luồng hoạt động và chỉnh sửa để phù hợp với sản phẩm.

## Điều tôi học được
Cái khó nhất không phải là gọi API thành công, mà là thiết kế **đường lui khi không có anchor thật** — quyết định lấy trang hiện tại làm ngữ cảnh thay vì để tutor trả lời "không tìm thấy" như 17% case thật trong chatlog đang gặp. Đây là chỗ nguyên tắc G10 (thu hẹp phạm vi khi nghi ngờ) trở thành code thật, không chỉ là dòng chữ trong spec. Luồng tôi phải chỉnh sửa nhiều nhất là logic phân biệt giữa bôi đen thật và bôi đen trùng câu hỏi trên UI để fallback đúng ngữ cảnh trang.

## Điều tôi sẽ làm khác đi
Nếu làm lại, tôi sẽ chốt bản demo sớm hơn từ CP3 để test trực tiếp với người dùng ngoài nhóm (đặc biệt là 3 willing user đã đồng ý từ CP1), thay vì dành quá nhiều thời gian hoàn thiện UI để rồi phải test nội bộ ở cuối. Về code, tôi cũng sẽ làm luồng stream chữ từ API cho mượt và dựng sẵn các case giả lập lỗi mạng/hết key để đỡ phải bấm test thủ công nhiều lần.

## Điểm tôi tự chấm
- Prototype chạy được: 8/10 (có AI call thật, có fallback, flow chính bấm hết được)
- Thiết kế/nguyên tắc HAX áp dụng: 7/10