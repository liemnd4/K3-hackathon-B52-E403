# Kết Quả Đánh Giá Lượt 2 (CP5 Evaluation Log — Final)

- **Ngày đánh giá**: 30/07/2026
- **Tập kiểm thử**: `eval/golden-set.json` (20 cases)
- **Kiến trúc đánh giá**: VLearn AI Tutor Page-Context Fallback v2 (Sau Validation)

---

## 📊 Bảng Kết Quả Kiểm Thử So Sánh

| Chỉ số | Lượt 1 (CP3 Baseline) | Lượt 2 (CP5 Final) | Trạng thái |
|---|:---:|:---:|:---:|
| **Tổng số case** | 20 | 20 | — |
| **Số case PASS** | 19 | 20 | 📈 Tăng 1 case |
| **Tỷ lệ % Đạt** | **95.0%** | **100.0%** | ✅ Vượt Quality Bar (80.0%) |

---

## 🎯 Chi Tiết Cải Tiến Ở Lượt 2
1. **Khắc phục phân loại từ khóa `pdf`:** Ở Lượt 1, case #18 (`"tóm tắt slide pdf day2 cho tôi"`) bị từ chối nhầm do dính từ khóa "pdf". Ở Lượt 2, hệ thống phân biệt chính xác câu hỏi tóm tắt slide nội dung PDF vs yêu cầu tải file ngoài.
2. **Làm rõ nhãn ngữ cảnh (`[Trang N hiện tại]`):** Tiếp thu phản hồi từ validation user (Lê Trần Long), câu phản hồi của AI Tutor làm rõ phạm vi trang slide hiện tại giúp 100% case đều trích dẫn chính xác và minh bạch.
