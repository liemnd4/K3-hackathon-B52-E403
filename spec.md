# AI SPEC — VLearn Tutor Page-Context Fallback (Hỗ trợ ngữ cảnh slide khi không có bôi đen) · Nhóm B52

Hướng: [x] A — VLearn

Loại: [x] Tối ưu tính năng có sẵn

---

## §1. User & Job

**Job executor:**
Học viên đang-trong-buổi-học, xem slide trên VLearn và cần tra cứu lại nội dung đang xem.

**Hành vi/pain quan sát được:** 
Học viên gõ trực tiếp câu hỏi hoặc số trang thay vì bôi đen được đoạn văn bản thật.

**Core JTBD:**
> Khi tôi đang học và muốn xác nhận hoặc tóm tắt lại một nội dung trong slide đang xem, tôi muốn biết chắc câu trả lời có dựa trên đúng nội dung tài liệu hay không, để tôi tiếp tục học mà không mất mạch và không phải tự thao tác tìm lại thủ công.

**Ba job stories:**

| # | When | I want to | So I can |
|---|---|---|---|
| JS1 | Đang xem trang 33, gõ "tóm tắt trang này" mà quên bôi đen | Vẫn nhận được câu trả lời đúng nội dung trang 33 | Không phải dừng lại tự tìm lại đoạn đó |
| JS2 | Hỏi bằng số trang ("slide 37 nói về điều gì") thay vì bôi đen | Được trả lời dựa trên đúng trang đang xem, không bị từ chối | Tiếp tục mạch học không bị ngắt |
| JS3 | Nhận câu trả lời từ tutor | Biết chắc thông tin đó có nguồn trích dẫn hay không | Tin tưởng và không phải tự kiểm tra lại tài liệu gốc |

**Current alternatives:** *

| Alternative | Làm tốt gì? | Fail ở đâu? | Vì sao chưa bỏ |
|---|---|---|---|
| Tự tua lại video bài giảng | Chắc chắn tìm đúng nội dung | Mất thời gian, ngắt mạch học | Không có lựa chọn khác khi tutor từ chối |
| Hỏi lại tutor bằng cách bôi đen thủ công | Có anchor thật, tutor trả lời tốt hơn (0.6% "không tìm thấy" so với 17%) | Phải dừng đọc để thao tác chọn đúng đoạn | Chưa biết đây chính là nguyên nhân khiến tutor hay fail |
| Bỏ qua câu hỏi | Không tốn thời gian | Không giải quyết được thắc mắc, có thể học sai kiến thức | Ngại hỏi lại nhiều lần trong buổi học |

**Nếu sản phẩm không ra đời, user sẽ tiếp tục:** tua video hoặc bỏ qua câu hỏi — tức là vẫn chịu chi phí thời gian/mất mạch học đã đo được ở Evidence bên dưới.

**Problem statement:**
> Khi học viên hỏi mà không có đoạn văn bản thật đứng sau câu hỏi (câu hỏi tổng quan, hỏi bằng số trang, hoặc "bôi đen" thực chất chỉ là câu hỏi lặp lại) — chiếm 71.9% tổng số lượt hỏi — hệ thống hỗ trợ không có căn cứ thật để xử lý. Hậu quả: 17% số lượt này bị từ chối thẳng ("không tìm thấy nội dung"), phần còn lại vẫn nhận được câu trả lời nhưng không rõ nguồn gốc (56.2% không trích trang), và tỷ lệ bị đánh giá tệ cao gấp gần 3 lần so với khi có đoạn văn bản thật (60.7% vs 21.4% down).

**Evidence (Đường B — mining, log đầy đủ trong repo/eval):**

*Nguồn:* `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` — 2.522 dòng, 1.261 turn (student+tutor), 369 user, 585 hội thoại, 22–29/07/2026.

*Phương pháp đếm:* tách `content` theo cấu trúc `(Trang N, đoạn được chọn: "...") <câu hỏi>` bằng regex; so sánh phần "đoạn được chọn" với câu hỏi thật để phân biệt bôi đen thật (nội dung slide) vs bôi đen giả (trùng câu hỏi, không có nội dung thật đứng sau); đối chiếu với `citations` (rỗng = không trích nguồn) và `rating`.

| # | Số liệu | Giá trị |
|---|---|---|
| 1 | Turn tutor không có citation (toàn bộ) | 582/1261 (46.2%) |
| 2 | ...trong đó khi tutor dùng nước đi "trả lời thẳng" (`give_direct_answer`) | 111/146 (76%) |
| 3 | **Turn KHÔNG có anchor thật** (không có đoạn văn bản thật đứng sau câu hỏi — gồm cả "bôi đen" trùng câu hỏi và không bôi đen gì) | **907/1261 (71.9%)** |
| 4 | **Turn CÓ anchor thật** (đoạn văn bản thật, khác câu hỏi, dài >15 ký tự) | **345/1261 (27.4%)** |
| 5 | Trong nhóm KHÔNG anchor thật: tutor báo "không tìm thấy" | 154/907 (17.0%) |
| 6 | Trong nhóm CÓ anchor thật: tutor báo "không tìm thấy" | 2/345 (0.6%) |
| 7 | Trong nhóm KHÔNG anchor thật: không có citation | 510/907 (56.2%) |
| 8 | Trong nhóm CÓ anchor thật: không có citation | 63/345 (18.3%) |
| 9 | Rating down khi KHÔNG anchor thật (n=56 có rating — mẫu nhỏ) | 60.7% |
| 10 | Rating down khi CÓ anchor thật (n=14 có rating — mẫu rất nhỏ) | 21.4% |
| 11 | Yêu cầu tóm tắt phạm vi rộng (toàn bộ/cả ngày/cả file) | 22/1261; 16/22 (72.7%) bị từ chối/không làm được |

*Lưu ý: hàng 9-10 dựa trên mẫu rating rất nhỏ (56 và 14 người) — xu hướng rõ (chênh ~3 lần) nhưng không nên khẳng định là số tuyệt đối chắc chắn nếu TA hỏi lại.*

**≥5 quote nguyên văn (tutor, khi không có căn cứ thật):**
1. "Rất tiếc là tôi đã tra cứu trong tài liệu nhưng chưa tìm thấy nội dung cụ thể của Trang 33..." (M0780)
2. "Rất xin lỗi, tôi không thể tóm tắt toàn bộ slide chỉ trong một câu trả lời vì tài liệu bài giảng ngày hôm nay bao gồm nhiều nội dung chi tiết..."
3. "Rất tiếc, hiện tại tài liệu giảng dạy của ngày học này không chứa một trang tóm tắt tổng hợp cụ thể như bạn đề cập..."
4. "Xin lỗi bạn, tôi không tìm thấy nội dung cụ thể cho slide 37 trong tài liệu hiện có..." (M0949, ví dụ bôi đen giả)
5. "Chào bạn, rất xin lỗi vì hiện tại hệ thống tìm kiếm không tìm thấy nội dung cụ thể cho trang 4 trong tài liệu của bài học hôm nay..."
6. "Rất tiếc, mình đã kiểm tra lại các tài liệu của bài học hôm nay nhưng không thấy trang 25 đề cập đến lưu ý nào như bạn mô tả..."

**AI leverage point:**
- **AI nên vào bước nào của workflow, vai trò gì:** vào đúng bước "trong buổi học, ngay khi học viên gõ câu hỏi" — đóng vai trò quyết định có anchor thật hay không, để chọn giữa trả lời trực tiếp (có trích dẫn) và fallback dùng ngữ cảnh trang hiện tại, thay vì để hệ thống hiện tại tự động từ chối hoặc trả lời không rõ nguồn.
- **Vì sao không phải bước khác:** đây là bước duy nhất có bằng chứng đo được (71.9% turn rơi vào tình huống này) và là nơi lỗi thực sự xảy ra (hệ thống có đủ thông tin — trang đang xem — nhưng không dùng đến).
- **Product hypothesis:** *Nếu giúp học viên nhận được câu trả lời có trích dẫn ngay cả khi không bôi đen đúng đoạn, bằng cách tự động dùng ngữ cảnh trang hiện tại làm fallback, họ sẽ chuyển từ "tự tua video / bỏ qua câu hỏi" sang tiếp tục hỏi tutor, vì không còn bị từ chối oan.*
- **Assumption nguy hiểm nhất** (kiểm bằng vòng validation CP5): giả định rằng nội dung trang hiện tại luôn đủ để trả lời đúng câu hỏi — nếu câu hỏi thực ra liên quan đến trang khác (học viên đang xem trang 14 nhưng hỏi về nội dung trang 10), fallback có thể trả lời sai mà học viên không có cách nào nhận ra để nghi ngờ.

---

## §2. Impact & quyết định chọn

**Bảng impact ≥3 ứng viên:**

| Ứng viên | Bao nhiêu người/turn gặp | Tần suất | Tốn gì mỗi lần | Khả thi build? | Chọn? |
|---|---|---|---|---|---|
| **VLearn Page-Context Fallback** (nhận diện trang slide hiện tại làm ngữ cảnh khi thiếu bôi đen, ép trích dẫn nguồn) | 907/1261 turn (71.9%) không có anchor thật; 582/1261 (46.2%) không citation nói chung | Xảy ra hằng ngày trong suốt 7 ngày data | Học viên mất niềm tin (rating down gấp ~3 lần: 60.7% vs 21.4%), phải tự tra lại tài liệu gốc, bị gián đoạn mạch học | Có — lấy page context tự động khi bôi đen rỗng, test bằng golden set từ chatlog thật | **CHỌN** |
| AI Concept Coach (giải thích khái niệm + quiz hiểu) | ~54% câu hỏi mang ý "giải thích" — nhưng lan toả toàn bộ sản phẩm | Thường xuyên nhưng không tập trung vào 1 concept cụ thể | Không rõ — thiếu bằng chứng "học sai" cụ thể | Khó — rủi ro không kịp evidence chuẩn | Loại |
| Chặn out-of-scope/prompt injection (③) | 7 turn injection rõ + 17 turn hỏi meta hệ thống | Hiếm (24 turn / 1261, ~1.9%) | Rủi ro bảo mật nếu lộ, nhưng tần suất thấp | Có nhưng phạm vi hẹp | Loại |

**Ứng viên chọn + vì sao (bằng số):** VLearn Page-Context Fallback — vì đây là vấn đề tần suất cao nhất (71.9% turn không có anchor thật), có tương quan đo được với rating xấu (~3 lần), thu hẹp được thành đúng MỘT quyết định: *dùng page context hiện tại để giải đáp thay vì từ chối*.

---

## §3. Giải pháp tương tự đã nghiên cứu

- **NotebookLM:** Luôn tự động gắn ngữ cảnh file/trang đang mở và trích dẫn số trang trực tiếp bên cạnh câu trả lời.
- **Khanmigo:** Khi học viên không bôi đen, AI gợi ý lại vị trí trang hiện tại để làm điểm bắt đầu thảo luận.
- **ChatGPT (Study Mode):** Tự đọc lại toàn bộ đoạn văn bản đang active của người dùng thay vì đòi hỏi bôi đen thủ công.

---

## §4. Thiết kế

**Lát cắt MỘT CÂU:**
> Học viên đang ở trang 14 gõ "tóm tắt slide này" mà không bôi đen văn bản → AI Tutor tự động lấy nội dung trang 14 làm ngữ cảnh → trả lời đúng nội dung trang 14 kèm trích dẫn [trang 14], không từ chối và không bắt học viên mô tả lại.

**Non-goals (≥3 thứ KHÔNG build):**
1. Không xử lý tóm tắt toàn bộ tài liệu/cả ngày học (để lại backlog).
2. Không thiết kế lại giao diện bôi đen/UI chọn đoạn (giữ nguyên UI hiện có).
3. Không xây dựng cơ chế chống prompt injection toàn diện.

**Mức prototype nhắm tới:** [x] Mock — phần mock: data slide giả lập, 8 kịch bản phụ (context liên kết bài giảng, tra cứu internet, góp ý giảng viên, forward giảng viên, trực quan hoá sơ đồ/code, đọc hình ảnh, upload file) dùng response mẫu cố định, không gọi AI thật vì nằm ngoài lát cắt chính; phần thật: logic fallback lấy page context và sinh trích dẫn [Trang N] ở đúng quyết định trung tâm (anchor thật/giả).

**Automation:** [x] conditional — lý do theo cost-of-error: khi có anchor thật hoặc suy ra được page context → tự động trả lời; khi không chắc chắn → hỏi lại 1 câu thay vì đoán mò, tránh làm học viên ghi nhớ sai kiến thức.

**§4b. Nguyên tắc đã áp dụng (≥4):**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G10 — Thu hẹp phạm vi khi nghi ngờ | Khi không phát hiện anchor thật -> dùng ngay trang hiện tại làm ngữ cảnh thu hẹp |
| G2 — Làm rõ nó làm tốt đến đâu | Câu trả lời luôn kèm nhãn rõ 📌 Trích dẫn [Trang N] |
| G11 — Giải thích vì sao | Khi từ chối/hỏi lại, giải thích rõ: "Do chưa rõ ý ở Trang 14, bạn có muốn tóm tắt phần X không?" |
| G9 — Sửa dễ dàng | Cho phép gõ lại hoặc chuyển sang trang khác để cập nhật ngữ cảnh tức thì |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| # | Tình huống cụ thể | Lớp | Hành vi mong muốn | Nguyên tắc áp |
|---|---|---|---|---|
| 1 | Học viên bôi đen đúng đoạn thật | Happy path | Trả lời + trích trang | G2 |
| 2 | Học viên gõ "tóm tắt slide này" không bôi đen | ① Nguồn sự thật | Lấy nội dung trang hiện tại trả lời + trích trang | G10, G2 |
| 3 | Học viên yêu cầu tóm tắt cả khóa học | ① Nguồn sự thật | Nói rõ giới hạn (chỉ tóm tắt trang hiện tại), gợi ý hỏi từng phần | G2, G11 |
| 4 | Từ khóa bôi đen quá ngắn (VD "AI") | ② Mơ hồ/thiếu thông tin | Hỏi lại 1 câu để xác nhận ý định dựa trên trang hiện tại | G10 |
| 5 | Câu hỏi trùng với nhiều khái niệm trên trang | ② Mơ hồ/thiếu thông tin | Trả lời ý chính + hỏi thêm phần còn lại | G10 |
| 6 | Hỏi về thông tin hệ thống/API | ③ Ngoài phạm vi | Từ chối, quay lại nội dung bài học | G10 |
| 7 | Thử prompt injection | ③ Ngoài phạm vi | Từ chối thực hiện yêu cầu | G10, G11 |
| 8 | Trang chứa code/công thức phức tạp | ④ Đặc thù domain | Trích dẫn chính xác + báo mức tin cậy nếu không chắc | G2, G11 |
| 9 | Không có anchor thật, tutor có xu hướng tự đoán lý do kỹ thuật không kiểm chứng được (VD "có thể trang này chứa hình ảnh mà hệ thống không trích xuất được") | ① Nguồn sự thật | Không suy đoán nguyên nhân kỹ thuật chưa kiểm chứng — chỉ nói "chưa tìm được nội dung, bạn mô tả lại giúp mình được không?" | G10, G11 |

*(9 kịch bản, phủ đủ 4 lớp — lớp ① có 3 case, ② có 2, ③ có 2, ④ có 1; nên bổ sung thêm 1 case ④ nữa cho đủ ≥2/lớp trước khi nộp CP4.)*

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** Gõ câu hỏi tự do ở trang N → AI dùng ngữ cảnh trang N trả lời kèm `[Trang N]`.
- **Low-confidence (②):** Câu hỏi quá ngắn/mơ hồ → AI đặt 1 câu hỏi làm rõ dựa trên trang hiện tại.
- **Failure/không căn cứ (①):** Đòi hỏi vượt quá tài liệu -> AI báo rõ giới hạn phạm vi trang.
- **Correction (user sửa):** Chuyển trang slide -> AI tự cập nhật ngữ cảnh trang mới ngay lập tức.

---

## §7. Kiểm thử

**Golden set:** 20 case lưu tại `eval/golden-set.json` — cấu trúc: ≥2 case/lớp (4 lớp), 8-10 case thường, 2-4 case hiếm, ≥10 case lấy/phát triển từ chatlog thật (dùng message_id đã trích ở §1, VD M0780, M0949).

**Quality bar:** "Đạt khi ≥ 80% qua bộ, và 100% câu hỏi ở trang N phải có citation [Trang N]".

**Kết quả các lượt chạy:** *(cập nhật tại CP3 — bảng % cho từng lượt, ghi nhận đầy đủ kể cả case fail)*

| Lượt | Ngày | % đạt | Ghi chú |
|---|---|---|---|
| 1 | [ĐIỀN] | | |

---

## §8. Phân công & kế hoạch

**Willing users (≥3 tên):**
1. Nguyễn Văn A (Học viên AI Thực Chiến)
2. Trần Thị B (Học viên AI Thực Chiến)
3. Lê Văn C (Học viên AI Thực Chiến)

**Phân công có tên cụ thể:**
- **Evidence & Mining (Phần bằng chứng §1-§2):** Nguyễn Đình Liêm - 01421, Nguyễn Hồng Yến - 01065
- **Build Prototype (Codebase & UI):** Đỗ Trung Kiên - 01287, Nguyễn Văn Hưng - 01251
- **Prompt & Golden Set (Phần Prompt & Đánh giá §7):** Nguyễn Đình Liêm - 01421, Nguyễn Hồng Yến - 01065
- **Spec & Validation (Viết Spec & Log user test §4, §8, §9):** Đỗ Trung Kiên - 01287, Nguyễn Văn Hưng - 01251
- **Demo & Presentation (Slide & Demo live):** Cả nhóm tham gia trình bày (mỗi thành viên ≥1 phần)

**Kế hoạch vòng validation CP5 (3 câu hỏi, ai log):**
- Thực hiện phỏng vấn/test thử trên 3 Willing Users.
- Người thực hiện log feedback: Đỗ Trung Kiên & Nguyễn Văn Hưng.
- 3 câu hỏi phỏng vấn:
  1. *"Điều gì khó hiểu hoặc khó chịu nhất khi dùng thử?"*
  2. *"Kết quả trích dẫn [Trang N] này bạn có tin không — vì sao?"*
  3. *"Bạn có dùng thật công cụ này trong giờ học không — vì sao/vì sao chưa?"*

---

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| [ĐIỀN — ngày giờ nộp spec] | Bản spec v2 — bổ sung Job stories, Current alternatives, AI leverage point vào §1 theo đúng worksheet JTBD; tách job executor khỏi mô tả hành vi; viết lại Core JTBD bỏ phần mô tả solution | Rà soát lại theo `worksheet-jtbd-day-du.md` |