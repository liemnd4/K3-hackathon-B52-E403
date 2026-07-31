# Kết Quả Đánh Giá Lượt 2 (CP5 Evaluation Log — Final)

- **Ngày đánh giá**: 30/07/2026
- **Tập kiểm thử**: `eval/golden-set.json` (20 cases)
- **Kiến trúc đánh giá**: VLearn AI Tutor Page-Context Fallback v2 (Sau Validation)

---

## 📊 Bảng Kết Quả Kiểm Thử So Sánh (Live GPT-4o-mini & Human Verified)

| Chỉ số | Lượt 1 (Baseline Mô phỏng) | Lượt 2 (CP5 Final - Human Verified) | Trạng thái |
|---|:---:|:---:|:---:|
| **Tổng số case** | 20 | 20 | — |
| **Số case PASS thật (Human Verified)** | 15 | 14 | 🔍 Rà soát độc lập |
| **Tỷ lệ % Đạt** | **75.0%** | **70.0%** | ⚠️ Dưới Quality Bar (80.0%) — Cần cải tiến v3 |

---

## 🎯 Chi Tiết Rà Soát Bằng Mắt (Human Verification) & 3 Bài Học Kĩ Thuật

Qua rà soát chi tiết từng câu trả lời thực tế (`real_output`) của `GPT-4o-mini`, phát hiện **6/20 case chưa đạt chuẩn** thuộc 3 nhóm nguyên nhân chính:

1. **Lệch dữ liệu kiểm thử (Case #2 - Prompt Chaining):**
   - Anchor trong test set bị gán nhầm sang slide "4 lớp của một prompt". Model phản hồi chính xác rằng anchor không chứa khái niệm Prompt Chaining. Đây là lỗi lệch dữ liệu trong test set, không phải lỗi model.

2. **Phạm vi tính năng chưa xây dựng (Case #6 & #7 - Cross-page Search):**
   - Hai case này thử nghiệm việc tự nhảy trang tìm kiếm khái niệm (Attention, Học giả trong bong bóng). Tuy nhiên, System Prompt hiện tại chưa được thiết kế logic tìm chéo trang (chỉ xử lý trang hiện tại). Case #7 bị hallucination khi tự bịa giải thích và gắn nhãn `[Trang 10]`.

3. **Hiện tượng vi phạm Quy tắc 7 (Case #8, #9, #10 - Low Confidence):**
   - Với các từ khóa nhập 1 từ ngắn (`"ReAct"`, `"AI"`), model có xu hướng quá "nhiệt tình": giải thích nội dung trước rồi mới đặt câu hỏi xác nhận ở cuối câu, thay vì dừng lại hỏi ngay từ đầu.

---

## 🚀 Hướng Cải Tiến Cho Bản v3
- **Sửa Test Set:** Cập nhật lại anchor cho Case #2 khớp đúng chủ đề Prompt Chaining.
- **Mở rộng Prompt:** Bổ sung quy tắc quét thẻ khái niệm toàn bộ slide cho Case #6 & #7.
- **Siết chặt Rule 7:** Cắt context khi query ngắn dưới 2 từ để ép model bắt buộc thực hiện hành vi hỏi lại trước.
