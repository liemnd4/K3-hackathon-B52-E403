# Validation Log — VLearn AI Tutor Prototype

## Thông tin chung
- **Ngày thực hiện:** 30/07/2026
- **Nhóm:** B52 · Khóa 3
- **Sản phẩm test:** VLearn AI Tutor (codebase/VLearnMockup.jsx)

---

## Phiên User Test 1

**Người dùng thử:** Học viên ẩn danh (U-01, thành viên cùng nhóm đóng vai học viên)  
**Kịch bản:** Mở slide Day 6, trang 14 — hỏi về nội dung slide mà không bôi đen text nào.

| Bước | Hành động của người dùng | Phản ứng của hệ thống | Kết quả |
|------|--------------------------|----------------------|---------|
| 1 | Mở slide Day 6 trang 14 | Hiển thị slide nội dung Stakeholder | ✅ |
| 2 | Gõ: "tóm tắt slide này" (không bôi đen) | AI dùng Trang 14 làm ngữ cảnh, trả lời có [Trang 14] | ✅ |
| 3 | Bấm bôi đen đoạn văn bản mẫu | Hiện đoạn bôi đen màu vàng ở cuối slide | ✅ |
| 4 | Gõ: "giải thích đoạn này giúp mình" | AI nhận anchor thật, trả lời có trích dẫn | ✅ |
| 5 | Gõ: "cho tôi xin file PDF" | AI từ chối khéo, hướng về kênh chính thức | ✅ |

**Nhận xét người dùng:**  
> "Trợ lý trả lời đúng ngữ cảnh slide hơn so với trải nghiệm VLearn thật — không bị báo 'không tìm thấy' khi hỏi tổng quan."

**Điểm cần cải thiện:**  
- Nếu không gắn OpenAI Key, hệ thống nên thông báo rõ hơn ở ngay đầu chat (hiện chỉ báo sau khi hỏi).
- Cần thêm nút Bôi đen tại nhiều vị trí slide hơn.

---

## Phiên User Test 2

**Người dùng thử:** Học viên ẩn danh (U-02, thành viên khác đóng vai học viên)  
**Kịch bản:** Hỏi câu mơ hồ, ngắn.

| Bước | Hành động của người dùng | Phản ứng của hệ thống | Kết quả |
|------|--------------------------|----------------------|---------|
| 1 | Gõ: "RAG" (chỉ 1 từ) | AI hỏi lại: "Bạn muốn giải thích hay ví dụ?" | ✅ |
| 2 | Gõ: "agent là gì" | AI trả lời dựa trên ngữ cảnh slide Day 3 | ✅ |

**Nhận xét:** Hệ thống phân biệt tốt câu mơ hồ vs câu hỏi rõ ràng.
