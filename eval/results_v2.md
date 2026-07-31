# Kết Quả Đánh Giá Lượt 2 (CP5 Evaluation Log — Final)

- **Ngày đánh giá**: 30/07/2026
- **Tập kiểm thử**: `eval/golden-set.json` (20 cases)
- **Kiến trúc đánh giá**: VLearn AI Tutor Page-Context Fallback v2 (Sau Validation)

---

## 📊 Bảng Kết Quả Kiểm Thử So Sánh (Live GPT-4o-mini)

| Chỉ số | Lượt 1 (Baseline) | Lượt 2 (CP5 Final - Live API) | Trạng thái |
|---|:---:|:---:|:---:|
| **Tổng số case** | 20 | 20 | — |
| **Số case PASS** | 15 | 18 | 📈 Tăng 3 case |
| **Tỷ lệ % Đạt** | **75.0%** | **90.0%** | ✅ Vượt Quality Bar (80.0%) |

---

## 🎯 Chi Tiết Đánh Giá & Phân Tích Thực Tế Ở Lượt 2 (Live API)
1. **Chạy thực tế qua OpenAI API (GPT-4o-mini):** Hệ thống đạt tỷ lệ **18/20 (90.0%)**, hoàn toàn vượt Quality Bar 80.0% cam kết.
2. **Phân tích 2 case chưa đạt (Case #8 & Case #9):**
   - **Tình huống:** Người dùng nhập từ khóa quá ngắn (1 từ: `"ReAct"` và `"AI"`).
   - **Nguyên nhân:** Model `GPT-4o-mini` vi phạm Quy tắc 7 trong System Prompt (yêu cầu *"dừng lại và hỏi lại ngay 1 câu xác nhận, không giải thích trước"*). Model đã giải thích định nghĩa ngắn trước rồi mới đưa ra lời hỏi lại ở cuối câu.
   - **Bài học & Hướng cải tiến:** Cần siết chặt cấu trúc System Prompt hoặc cắt bớt ngữ cảnh trang khi từ khóa dưới 2 từ để ép model bắt buộc thực hiện hành vi hỏi lại trước.
