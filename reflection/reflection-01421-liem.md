# Reflection — Nguyễn Đình Liêm (01421)

## Phần tôi đảm nhận
- Phân tích dữ liệu chatlog (mining 1.261 lượt hỏi/đáp)
- Xây dựng bộ Golden Set 20 câu kiểm thử (eval/golden-set.json)
- Viết System Prompt và thiết kế quyết định trung tâm (anchor thật/giả)
- Cập nhật spec.md §1–§9

## Điều tôi học được
Trước đây tôi nghĩ AI tệ là do model yếu. Sau khi phân tích chatlog thật, tôi thấy vấn đề thực ra là **thiếu ngữ cảnh (anchor)** — không phải do model. 79.5% lượt hỏi không bôi đen text nào, và 100% lượt bị đánh giá thấp đến từ nhóm này.

## Điều tôi sẽ làm khác đi
Nếu làm lại, tôi sẽ dành nhiều thời gian hơn cho bước **User Test thật** với người dùng thực sự, thay vì chỉ test nội bộ trong nhóm. Kết quả đo 95% trên golden set tự xây không hoàn toàn phản ánh trải nghiệm người dùng thật.

## Điểm tôi tự chấm
- Bằng chứng & Mining: 9/10 (có số liệu thật từ 1.261 turns)
- Quyết định trung tâm: 8/10 (logic rõ, nhưng cần edge case tốt hơn)
- Kiểm thử: 7/10 (19/20 nhưng cần nhiều case từ user thật hơn)
