# Reflection — Nguyễn Văn Hưng (01251)

## Phần tôi đảm nhận
- Cùng build UI/flow trong `codebase/VLearnMockup.jsx` (phần bôi đen văn bản, hiển thị trích dẫn [Trang N], quota/API key trên UI).
- Thực hiện 2 phiên user test nội bộ và ghi log vào `validation/validation-log.md`.
- Hỗ trợ hoàn thiện spec §6 (bốn đường đi trải nghiệm) và §9 (changelog).

## AI hỗ trợ thế nào
Tôi sử dụng ChatGPT để tham khảo cách xây dựng component React, xử lý
state và cải thiện bố cục giao diện. AI giúp tạo nhanh skeleton code và
gợi ý cách triển khai, nhưng tôi tự kiểm tra, sửa logic và điều chỉnh
thiết kế theo mục tiêu sản phẩm.

## Điều tôi học được
Khi tự chạy thử flow "gõ câu hỏi không bôi đen", tôi mới thấy rõ vì sao 71.9% turn thật trong chatlog không có anchor — phần lớn học viên không nghĩ đến việc phải bôi đen trước, họ chỉ gõ thẳng câu hỏi. Việc tự tay chạy qua các case low-confidence và out-of-scope giúp tôi hiểu "hỏi lại 1 câu" (G10) khác với "từ chối" như thế nào trong thực tế, không chỉ trên giấy. *(→ tự viết thêm: có tình huống nào bạn test mà kết quả khác với bạn kỳ vọng ban đầu?)*

## Điều tôi sẽ làm khác đi
Hai phiên test tôi ghi log đều do thành viên trong nhóm đóng vai người dùng — im lặng quan sát và log nguyên văn theo đúng quy trình guide §4.2, nhưng người thử không phải là học viên thật ngoài nhóm. Nếu làm lại, tôi sẽ chủ động đổi chéo với thành viên zone khác hoặc mời đúng 3 willing user đã hứa từ CP1 tham gia sớm hơn, thay vì để validation thật diễn ra sau khi phần lớn thời gian đã dùng cho build.

## Điểm tôi tự chấm
- Prototype (UI/flow): 7/10
- Bốn đường đi trải nghiệm thể hiện trong spec §6: 7/10
- Validation với user thật: 4/10 (cần người ngoài nhóm thật, không chỉ đóng vai)
