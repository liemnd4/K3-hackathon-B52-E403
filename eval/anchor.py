import csv, re, collections

path = r'd:\CODE\AITHUCCHIEN\LABS\B2-Batch03-K3\data\vlearn-pack\chatlog\chat_history_anonymized_for_hackathon.csv'
rows = []
with open(path, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# Build turn structure
turns = {}
for r in rows:
    tid = r['turn_id']
    if tid not in turns:
        turns[tid] = {}
    turns[tid][r['role']] = r

# -------------------------------------------------------
# Parse student message: tách "đoạn được chọn" và "câu hỏi thực"
# Format: (Trang X, đoạn được chọn: "...")\n<câu hỏi thực>
# -------------------------------------------------------
def parse_student_msg(content):
    content = content.strip()
    # Lấy phần trong dấu ngoặc kép sau "đoạn được chọn:"
    anchor_match = re.search(r'đoạn được chọn:\s*"([^"]*)"', content, re.DOTALL)
    # Lấy phần sau dòng header (câu hỏi thực)
    body_match = re.search(r'\)\s*\n(.*)', content, re.DOTALL)

    anchor = anchor_match.group(1).strip() if anchor_match else ''
    question = body_match.group(1).strip() if body_match else content

    return anchor, question

def is_real_anchor(anchor, question):
    """
    'Phao thật' khi đoạn được chọn KHÁC với câu hỏi và đủ dài (có nội dung slide thật).
    'Không có phao' khi:
      - anchor rỗng
      - anchor == question (học viên gõ câu hỏi vào ô bôi đen)
      - anchor rất ngắn (< 10 ký tự) — chỉ bôi 1 chữ
    """
    if not anchor:
        return False
    # Normalize để so sánh
    a = re.sub(r'\s+', ' ', anchor.lower().strip())
    q = re.sub(r'\s+', ' ', question.lower().strip())
    # Nếu anchor chứa câu hỏi hoặc ngược lại → không phải phao thật
    if a == q:
        return False
    if a in q or q in a:
        return False
    # Nếu anchor quá ngắn
    if len(anchor) < 15:
        return False
    return True

# -------------------------------------------------------
# Phân loại tất cả turns
# -------------------------------------------------------
real_anchor_turns = []    # có phao thật
no_anchor_turns = []      # không có phao thật

for tid, t in turns.items():
    if not (t.get('student') and t.get('tutor')):
        continue
    stu_content = t['student']['content']
    anchor, question = parse_student_msg(stu_content)
    has_anchor = is_real_anchor(anchor, question)

    entry = {
        'tid': tid,
        'anchor': anchor,
        'question': question,
        'stu_content': stu_content,
        'tutor_content': t['tutor']['content'],
        'citations': t['tutor'].get('citations', '[]'),
        'rating': t['tutor'].get('rating', ''),
        'move': t['tutor'].get('move_used', ''),
        'uid': t['student'].get('user_id', ''),
    }

    if has_anchor:
        real_anchor_turns.append(entry)
    else:
        no_anchor_turns.append(entry)

total = len(real_anchor_turns) + len(no_anchor_turns)
print(f'=== PHÂN LOẠI TURNS ===')
print(f'Tổng turns: {total}')
print(f'Có phao thật (đoạn slide thật): {len(real_anchor_turns)} ({100*len(real_anchor_turns)/total:.1f}%)')
print(f'Không có phao (câu hỏi lặp/rỗng): {len(no_anchor_turns)} ({100*len(no_anchor_turns)/total:.1f}%)')

# -------------------------------------------------------
# So sánh performance
# -------------------------------------------------------
def analyze_group(turns_list, name):
    n = len(turns_list)
    if n == 0:
        return
    # Citation rate
    has_citation = sum(1 for t in turns_list
                       if t['citations'].strip() not in ['[]', '', 'null'])
    # Down rate
    down = sum(1 for t in turns_list if t['rating'] == 'down')
    up = sum(1 for t in turns_list if t['rating'] == 'up')
    rated = down + up
    # "Không tìm thấy" in tutor response
    cant_find_kw = ['không tìm thấy', 'chưa tìm thấy', 'không thể truy cập',
                    'không bao gồm', 'không có dữ liệu', 'không khớp',
                    'không thể truy xuất', 'chưa tìm thấy kết quả']
    cant_find = sum(1 for t in turns_list
                    if any(kw in t['tutor_content'].lower() for kw in cant_find_kw))

    print(f'\n--- {name} (n={n}) ---')
    print(f'  Có citation:         {has_citation}/{n} = {100*has_citation/n:.1f}%')
    print(f'  KHÔNG có citation:   {n-has_citation}/{n} = {100*(n-has_citation)/n:.1f}%')
    print(f'  Tutor "không tìm thấy": {cant_find}/{n} = {100*cant_find/n:.1f}%')
    print(f'  Down-rated:          {down} lần (trong {rated} lần có rating)')
    if rated > 0:
        print(f'  Down/(down+up):      {100*down/rated:.1f}%')

analyze_group(real_anchor_turns, 'CÓ PHAO THẬT (anchor = đoạn slide thật)')
analyze_group(no_anchor_turns,   'KHÔNG CÓ PHAO (anchor = câu hỏi lặp / rỗng)')

# -------------------------------------------------------
# Ví dụ nguyên văn — "có phao thật" làm tốt
# -------------------------------------------------------
print('\n\n=== VÍ DỤ: CÓ PHAO THẬT → TUTOR LÀM TỐT ===')
good_examples = [t for t in real_anchor_turns
                 if t['citations'].strip() not in ['[]', '', 'null']
                 and t['rating'] != 'down'][:5]
for i, t in enumerate(good_examples):
    print(f'\n[{i+1}] Anchor: {t["anchor"][:120]}')
    print(f'    Question: {t["question"][:100]}')
    print(f'    Citations: {t["citations"]} | Move: {t["move"]}')
    print(f'    Tutor: {t["tutor_content"][:150]}')

# -------------------------------------------------------
# Ví dụ nguyên văn — "không có phao" → tutor trượt
# -------------------------------------------------------
print('\n\n=== VÍ DỤ: KHÔNG CÓ PHAO → TUTOR TRƯỢT ===')
cant_find_kw = ['không tìm thấy', 'chưa tìm thấy', 'không thể truy cập',
                'không bao gồm', 'không có dữ liệu', 'không khớp',
                'không thể truy xuất']
fail_examples = [t for t in no_anchor_turns
                 if any(kw in t['tutor_content'].lower() for kw in cant_find_kw)][:8]
for i, t in enumerate(fail_examples):
    print(f'\n[{i+1}] Anchor (chính là câu hỏi): {t["anchor"][:100]}')
    print(f'    Question: {t["question"][:100]}')
    print(f'    Citations: {t["citations"]} | Rating: {t["rating"]} | Move: {t["move"]}')
    print(f'    Tutor: {t["tutor_content"][:200]}')

# -------------------------------------------------------
# Cross-check: down-rated nào có phao thật vs không?
# -------------------------------------------------------
print('\n\n=== DOWN-RATED BREAKDOWN ===')
down_real = [t for t in real_anchor_turns if t['rating'] == 'down']
down_no   = [t for t in no_anchor_turns   if t['rating'] == 'down']
print(f'Down-rated CÓ phao thật:   {len(down_real)}/37')
print(f'Down-rated KHÔNG có phao:  {len(down_no)}/37')

print('\nDown-rated có phao thật (cases đáng xem):')
for t in down_real:
    print(f'  [{t["uid"]}] anchor={t["anchor"][:80]} | cit={t["citations"]}')
    print(f'    Q: {t["question"][:100]}')
    print(f'    Tutor: {t["tutor_content"][:150]}\n')
