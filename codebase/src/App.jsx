import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ArrowLeft, BookOpen, Bot, Sparkles, Sun, Moon, User, ChevronDown,
  ChevronRight, ChevronLeft, Play, PenLine, Highlighter, MoreHorizontal,
  Minus, Plus, Download, Save, Undo2, Eraser, X, Minimize2, Send,
  Paperclip, ThumbsUp, ThumbsDown, Copy, RefreshCw, Trash2, FileText,
  Circle, History, KeyRound, ShieldCheck,
} from "lucide-react";
import { fetchAiTutorResponse } from "./services/aiService";

// ---------------------------------------------------------------------------
// Mock data — course structure
// ---------------------------------------------------------------------------

const DAY_META = {
  d1: { title: "Giới Thiệu AI Product", code: "AICB-P1 · Ngày 1", topics: [
    "Tổng Quan AI Product", "Vòng Đời Phát Triển Sản Phẩm AI", "Vai Trò Của AI PM",
    "Công Cụ & Môi Trường Làm Việc", "Case Study Thực Tế", "Thảo Luận Nhóm",
  ], think: "Bạn sẽ ưu tiên tính năng nào trước khi có đủ dữ liệu huấn luyện?" },
  d2: { title: "Prompt Engineering Cơ Bản", code: "AICB-P1 · Ngày 2", topics: [
    "Prompt Là Gì", "Zero-shot vs Few-shot", "Chain-of-Thought",
    "Prompt Template", "Đánh Giá Chất Lượng Prompt", "Bài Tập Thực Hành",
  ], think: "Vì sao hai người dùng cùng một câu hỏi có thể nhận hai câu trả lời khác nhau?" },
  d3: { title: "Từ Chatbot Đến Agentic Agent", code: "AICB-P1 · Ngày 3", topics: [
    "3 Kiểu Hệ Thống AI", "Agentic Fit Framework", "Kiến Trúc Agent", "ReAct Pattern",
    "Agent Loop: Code Anatomy", "Live Demo & Debug", "Chatbot vs Agent", "Lab 3",
  ], think: "Khi nào một chatbot đơn giản là đủ, khi nào bạn thật sự cần một agent?" },
  d4: { title: "RAG & Vector Database", code: "AICB-P1 · Ngày 4", topics: [
    "Vì Sao Cần RAG", "Embedding Là Gì", "Kiến Trúc Vector Database",
    "Chunking Strategy", "Retrieval + Re-ranking", "Lab: Xây RAG Pipeline",
  ], think: "Điều gì xảy ra nếu tài liệu nguồn của bạn thay đổi mỗi ngày?" },
  d5: { title: "Multi-Agent Systems", code: "AICB-P1 · Ngày 5", topics: [
    "Vì Sao Cần Nhiều Agent", "Mô Hình Orchestrator", "Giao Tiếp Giữa Các Agent",
    "Phân Chia Vai Trò", "Case Study: Đội Agent Bán Hàng", "Bài Tập Nhóm",
  ], think: "Ai chịu trách nhiệm khi hai agent đưa ra hai quyết định trái ngược nhau?" },
  d6: { title: "AI Product & Project Management", code: "AICB-P1 · Ngày 6", topics: [
    "Vai Trò PM Trong Dự Án AI", "Quản Lý Thay Đổi Yêu Cầu", "Ước Lượng Thời Gian & Rủi Ro",
    "Làm Việc Với Stakeholder", "Đo Lường Thành Công Sản Phẩm AI", "Retro & Bài Học Kinh Nghiệm",
  ], think: "Team đã build 3 tuần. Nhưng stakeholder muốn đổi requirements. Làm sao xử lý?" },
};

const COURSE_DATA = [
  { id: "d1", label: "Day 1", count: 2, status: "ACTIVE", files: [
      { id: "d1f1", name: "day01-slide-blue-v0.pdf", pages: 23, day: "d1" },
      { id: "d1f2", name: "day01-cong-cu-va-moi-truong.pdf", pages: 14, day: "d1" },
  ]},
  { id: "d2", label: "Day 2", count: 1, status: "ACTIVE", files: [
      { id: "d2f1", name: "day02-prompt-engineering-co-ban.pdf", pages: 31, day: "d2" },
  ]},
  { id: "d3", label: "Day 3", count: 2, status: "ACTIVE", files: [
      { id: "d3f1", name: "day03-tu-chatbot-den-agentic-agent.pdf", pages: 46, day: "d3" },
      { id: "d3f2", name: "Day03-D302-tu-chatbot-den-agent.pdf", pages: 60, day: "d3" },
  ]},
  { id: "d4", label: "Day 4", count: 3, status: "ACTIVE", files: [
      { id: "d4f1", name: "day04-rag-va-vector-database.pdf", pages: 28, day: "d4" },
      { id: "d4f2", name: "day04-lab-thuc-hanh.pdf", pages: 12, day: "d4" },
      { id: "d4f3", name: "day04-tai-lieu-tham-khao.pdf", pages: 9, day: "d4" },
  ]},
  { id: "d5", label: "Day 5", count: 3, status: "ACTIVE", files: [
      { id: "d5f1", name: "day05-multi-agent-systems.pdf", pages: 33, day: "d5" },
      { id: "d5f2", name: "day05-case-study.pdf", pages: 18, day: "d5" },
      { id: "d5f3", name: "day05-bai-tap-nhom.pdf", pages: 6, day: "d5" },
  ]},
  { id: "d6", label: "Day 6", count: 1, status: "STUDYING", files: [
      { id: "d6f1", name: "day06-ai-product-project-management.pdf", pages: 37, day: "d6" },
  ]},
];

// ---------------------------------------------------------------------------
// Slide content generator — real, per-day content instead of one generic slide
// ---------------------------------------------------------------------------

const BULLET_BANK = [
  "Xác định rõ mục tiêu trước khi bắt tay vào chi tiết kỹ thuật.",
  "So sánh ưu / nhược điểm giữa các cách tiếp cận khác nhau.",
  "Ví dụ thực tế giúp khái niệm trừu tượng trở nên dễ hình dung.",
  "Luôn kiểm chứng lại giả định bằng dữ liệu thật.",
  "Ghi chú lại rủi ro tiềm ẩn để xử lý sớm thay vì để đến cuối.",
  "Trao đổi thường xuyên với các bên liên quan để tránh lệch hướng.",
  "Đo lường bằng số liệu cụ thể thay vì cảm tính.",
  "Chia nhỏ vấn đề lớn thành các bước có thể kiểm soát được.",
];

function hashPage(day, page) {
  let h = 0;
  const str = `${day}-${page}`;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function humanizeFileName(name) {
  return name
    .replace(/\.pdf$/i, "")
    .split(/[-_]/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function buildSlide(dayId, fileId, page, totalPages, fileName) {
  const meta = DAY_META[dayId];
  const seed = hashPage(`${dayId}-${fileId}`, page);
  if (page === 1) {
    return { type: "cover", title: meta.title, code: meta.code, fileLabel: fileName ? humanizeFileName(fileName) : null };
  }
  if (page === 2) {
    return { type: "think", question: meta.think };
  }
  if (page === 3) {
    return { type: "outline", topics: meta.topics };
  }
  const topic = meta.topics[seed % meta.topics.length];
  const bullets = [0, 1, 2].map((i) => BULLET_BANK[(seed + i * 7) % BULLET_BANK.length]);
  const isLastPage = page === totalPages;
  return { type: "content", topic, bullets, isLastPage };
}

// ---------------------------------------------------------------------------
// Chat mock logic
// ---------------------------------------------------------------------------

const SUGGESTED_QUESTIONS = [
  "Tóm tắt trang này",
  "Giải thích nội dung dễ hiểu hơn",
  "Cho tôi một ví dụ thực tế",
  "Tạo 3 câu hỏi ôn tập",
];

import slideVisionMetadata from "./data/slide_vision_metadata.json";

const CANNED_ANSWERS = [
  { keys: ["stakeholder"], text: "Stakeholder là bất kỳ cá nhân hoặc nhóm nào có lợi ích, ảnh hưởng hoặc bị ảnh hưởng bởi kết quả của dự án — ví dụ: khách hàng, ban lãnh đạo, đội vận hành hoặc người dùng cuối. Hiểu rõ ưu tiên của từng stakeholder giúp team đưa ra quyết định đánh đổi hợp lý khi yêu cầu thay đổi." },
  { keys: ["tóm tắt", "tom tat"], text: "Nội dung trang này xoay quanh chủ đề chính của slide đang mở: các ý được trình bày theo từng gạch đầu dòng, kèm ví dụ minh hoạ để dễ hình dung. Bạn có thể hỏi sâu hơn vào từng ý nếu cần." },
  { keys: ["ví dụ", "vi du"], text: "Một ví dụ thực tế: khi áp dụng đúng nguyên tắc trong slide này, team có thể tránh được sai sót thường gặp và tiết kiệm thời gian xử lý về sau. Ví dụ cụ thể phụ thuộc vào ngữ cảnh dự án bạn đang làm — bạn có thể mô tả thêm để mình đưa ví dụ sát hơn." },
  { keys: ["câu hỏi ôn tập", "cau hoi on tap"], text: "3 câu hỏi ôn tập cho bạn:\n1. Ý chính của slide này là gì?\n2. Vì sao thứ tự các bước lại quan trọng?\n3. Bạn sẽ áp dụng nội dung này vào dự án của mình như thế nào?" },
  { keys: ["dễ hiểu", "de hieu"], text: "Nói đơn giản: hãy hình dung nội dung này như một quy trình từng bước — làm rõ mục tiêu, thu thập thông tin, rồi mới đưa ra quyết định. Cách này giúp giảm sai sót và dễ giải thích lại cho người khác." },
  { keys: ["python", "code", "hàm", "ham"], text: "Đoạn code trong slide định nghĩa các hàm với kiểu dữ liệu tường minh (type hint) để dễ kiểm tra đầu vào/đầu ra. Mỗi hàm thường có một nhiệm vụ duy nhất — điều này giúp hệ thống dễ mở rộng và gỡ lỗi hơn khi tích hợp với agent." },
];

const FALLBACK_ANSWERS = [
  "Tôi được thiết kế để không tự bịa đặt hoặc suy diễn thông tin ngoài phạm vi tài liệu được cấp. Nếu có phần nào bạn muốn làm rõ dựa trên slide, bạn cứ đưa ra câu hỏi, tôi sẽ hỗ trợ bạn tìm kiếm và giải thích ngay.",
  "Dựa trên nội dung slide đang mở, đây là phần liên quan trực tiếp đến câu hỏi của bạn. Nếu bạn cần mình đi sâu hơn vào một ý cụ thể, hãy cho mình biết nhé.",
  "Mình chưa thấy chi tiết này được nêu rõ trong slide hiện tại. Bạn có thể chuyển sang trang khác hoặc mô tả thêm để mình tìm đúng phần tài liệu liên quan.",
];

function getAiReply(question, currentPage = 1) {
  const pageData = slideVisionMetadata[`page_${currentPage}`];
  const q = question.toLowerCase();

  // If question is about summarizing current slide or asking about chart/diagram on current slide:
  if (pageData) {
    let responseText = "";
    if (q.includes("tóm tắt") || q.includes("tom tat") || q.includes("trang này") || q.includes("trang nay") || q.includes("nội dung")) {
      responseText = `📌 **Tóm tắt nội dung [Trang ${currentPage}]**:\n- **Tiêu đề**: ${pageData.title}\n- **Ý chính**: ${pageData.text_content}`;
      if (pageData.has_diagram && pageData.crops.length > 0) {
        const crop = pageData.crops[0];
        responseText += `\n- **Phân tích sơ đồ/biểu đồ**: ${crop.title} — ${crop.description}`;
      }
      return responseText;
    }

    if (q.includes("ảnh") || q.includes("anh") || q.includes("sơ đồ") || q.includes("so do") || q.includes("biểu đồ") || q.includes("bieu do") || q.includes("ma trận") || q.includes("ma tran")) {
      if (pageData.has_diagram && pageData.crops.length > 0) {
        const crop = pageData.crops[0];
        return `📊 **Phân tích chi tiết Sơ đồ/Biểu đồ [Trang ${currentPage}]**:\n- **Tên sơ đồ**: ${crop.title}\n- **Loại**: ${crop.type}\n- **Ý nghĩa trực quan**: ${crop.description}\n\n*Trích dẫn nguồn*: Nguồn dữ liệu hình ảnh được Gemini Vision trích xuất từ [Trang ${currentPage}].`;
      } else {
        return `Trang ${currentPage} hiện chỉ chứa nội dung văn bản thuần túy và không có hình ảnh/biểu đồ trực quan [Trang ${currentPage}].`;
      }
    }
  }

  const match = CANNED_ANSWERS.find((a) => a.keys.some((k) => q.includes(k)));
  if (match) return `${match.text} [Trang ${currentPage}]`;
  
  if (pageData) {
    return `Dựa trên nội dung [Trang ${currentPage}] (${pageData.title}): ${pageData.text_content}. Nếu bạn muốn phân tích sâu hơn về phần này, hãy cho VLearn Tutor biết nhé!`;
  }

  const h = hashPage("fallback", question.length + question.charCodeAt(0) || 1);
  return `${FALLBACK_ANSWERS[h % FALLBACK_ANSWERS.length]} [Trang ${currentPage}]`;
}

const CONFIDENCE_LEVELS = [
  { max: 40, label: "Thấp", color: "bg-red-400" },
  { max: 75, label: "Trung bình", color: "bg-amber-400" },
  { max: 100, label: "Cao", color: "bg-emerald-500" },
];
function confidenceFor(seed) {
  const pct = 40 + (seed % 55);
  const level = CONFIDENCE_LEVELS.find((l) => pct <= l.max) || CONFIDENCE_LEVELS[2];
  return { pct, ...level };
}

const INITIAL_MESSAGES = [
  { id: "m0", role: "assistant", text: "Xin chào! Mình là VLearn Tutor. Mình có thể giúp bạn giải thích nội dung slide, tóm tắt bài học và trả lời câu hỏi liên quan đến tài liệu đang xem." },
  { id: "m1", role: "user", text: "Stakeholder muốn thay đổi yêu cầu sau 3 tuần thì nên xử lý thế nào?" },
  { id: "m2", role: "assistant", contextPage: 2, text: "Nhóm không nên từ chối ngay hoặc thay đổi ngay lập tức. Trước tiên cần làm rõ lý do thay đổi, đánh giá mức độ ảnh hưởng đến phạm vi, thời gian và nguồn lực. Sau đó, team trao đổi với stakeholder để thống nhất ưu tiên và cập nhật lại kế hoạch.", source: "Trang 2 – AI Product Project Management", confidence: confidenceFor(6), answered: true },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function Toast({ message, show }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
      <div className="bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg shadow-slate-900/20 whitespace-nowrap">
        {message}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header({ currentFile, onToggleSidebar, dark, onToggleDark, onToggleAssistant, assistantOpen }) {
  const [lang, setLang] = useState("VI");
  return (
    <header className="h-[84px] shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-5 relative z-30 overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 shrink-0 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          title="Ẩn/hiện sidebar"
        >
          <ArrowLeft className="w-4.5 h-4.5" size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">VLearn</span>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0" />

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="w-4.5 h-4.5 text-blue-600" size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[260px] lg:max-w-[380px]">
              {currentFile.name}
            </p>
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              COMP2010 · Lecture_material_ms204yc9_gxpg9y
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onToggleAssistant}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-10 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-600/25 shrink-0 ${
            assistantOpen ? "bg-blue-700 text-white shadow-md shadow-blue-600/25" : "bg-blue-600 text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" size={16} />
          <span className="hidden xs:inline">Trợ lý AI</span>
        </button>

        <button
          onClick={() => setLang(lang === "VI" ? "EN" : "VI")}
          className="hidden md:block h-10 px-3 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
        >
          {lang} / {lang === "VI" ? "EN" : "VI"}
        </button>

        <button
          onClick={onToggleDark}
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
        >
          {dark ? <Sun className="w-4.5 h-4.5" size={18} /> : <Moon className="w-4.5 h-4.5" size={18} />}
        </button>

        <button className="hidden lg:flex items-center gap-2 h-10 pl-2 pr-3.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shrink-0">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-slate-500" size={14} />
          </div>
          <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Sinh viên ẩn danh</span>
        </button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function CourseSidebar({ open, days, expandedDay, onToggleDay, selectedFile, onSelectFile, overlay, onClose, isDesktop }) {
  const widthPx = open ? 380 : 0;
  return (
    <>
      {overlay && open && !isDesktop && (
        <div onClick={onClose} className="fixed inset-0 bg-slate-900/30 z-30" />
      )}
      <aside
        className="shrink-0 bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 z-40"
        style={
          isDesktop
            ? { position: "relative", width: widthPx }
            : { position: "fixed", top: 84, bottom: 0, left: 0, width: Math.min(widthPx, typeof window !== "undefined" ? window.innerWidth * 0.85 : widthPx) }
        }
      >
        <div className="w-[380px] max-w-[85vw] h-full flex flex-col">
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900">
              <BookOpen className="w-5 h-5 text-blue-600" size={20} />
              <h2 className="font-bold text-base">Học liệu môn học</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chương, slide và tài liệu đã upload</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {days.map((day) => {
              const isExpanded = expandedDay === day.id;
              const isStudying = day.status === "STUDYING";
              return (
                <div key={day.id} className={`rounded-2xl border transition-colors ${isExpanded ? "border-slate-200 bg-slate-50/60" : "border-slate-100"}`}>
                  <button onClick={() => onToggleDay(day.id)} className="w-full flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" size={14} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">{day.label}</span>
                          {isStudying && (
                            <span className="text-[10px] font-bold tracking-wide bg-blue-600 text-white px-2 py-0.5 rounded-full">STUDYING</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{DAY_META[day.id].title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {day.count} TÀI LIỆU · <span className="text-emerald-600 font-medium">ACTIVE</span>
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} size={16} />
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1.5">
                      {day.files.map((file) => {
                        const isSelected = selectedFile.id === file.id;
                        return (
                          <button
                            key={file.id}
                            onClick={() => onSelectFile(day.id, file)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-colors ${isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-transparent hover:bg-slate-50"}`}
                          >
                            <Play className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-blue-600 fill-blue-600" : "text-slate-300 fill-slate-300"}`} size={14} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm truncate ${isSelected ? "text-blue-700 font-semibold" : "text-slate-700 font-medium"}`}>{file.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{file.pages} trang</p>
                            </div>
                            {isSelected && <Circle className="w-2 h-2 fill-blue-600 text-blue-600 shrink-0" size={8} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Document Toolbar
// ---------------------------------------------------------------------------

function DocumentToolbar({ activeTool, onToolChange, page, notes, zoom, onZoom, onDownload, onSave, onUndo, onEraseNotes }) {
  const [showPicker, setShowPicker] = useState(false);
  const colors = ["#2563eb", "#dc2626", "#f59e0b", "#16a34a", "#0f172a"];
  const [activeColor, setActiveColor] = useState(colors[0]);

  const handleTool = (tool) => {
    onToolChange(tool);
    setShowPicker(tool === "pen" || tool === "highlight");
  };

  return (
    <div className="relative bg-white rounded-2xl sm:rounded-full shadow-sm border border-slate-200 px-2 py-2 overflow-x-auto">
      <div className="flex items-center gap-3 min-w-max sm:min-w-0 sm:justify-between">
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => handleTool("read")} className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTool === "read" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>Đọc</button>
          <button onClick={() => handleTool("pen")} className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTool === "pen" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}><PenLine className="w-3.5 h-3.5" size={14} /> Bút</button>
          <button onClick={() => handleTool("highlight")} className={`flex items-center gap-1.5 px-3 h-9 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTool === "highlight" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:bg-slate-50"}`}><Highlighter className="w-3.5 h-3.5" size={14} /> Highlight</button>
          <button className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 flex items-center justify-center shrink-0"><MoreHorizontal className="w-4 h-4" size={16} /></button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium shrink-0 whitespace-nowrap px-2">
          <span>Trang {page} · {notes} note{notes !== 1 ? "s" : ""}</span>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button onClick={() => onZoom(-10)} className="w-7 h-7 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500"><Minus className="w-3.5 h-3.5" size={14} /></button>
          <span className="w-11 text-center">{zoom}%</span>
          <button onClick={() => onZoom(10)} className="w-7 h-7 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500"><Plus className="w-3.5 h-3.5" size={14} /></button>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onDownload} title="Tải xuống" className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 flex items-center justify-center"><Download className="w-4 h-4" size={16} /></button>
          <button onClick={onSave} title="Lưu tài liệu" className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 flex items-center justify-center"><Save className="w-4 h-4" size={16} /></button>
          <button onClick={onUndo} title="Undo" className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 flex items-center justify-center"><Undo2 className="w-4 h-4" size={16} /></button>
          <button onClick={onEraseNotes} title="Xóa ghi chú" className="w-9 h-9 rounded-full text-slate-400 hover:bg-slate-50 flex items-center justify-center"><Eraser className="w-4 h-4" size={16} /></button>
        </div>
      </div>

      {showPicker && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-4 z-20">
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button key={c} onClick={() => setActiveColor(c)} className={`w-6 h-6 rounded-full border-2 transition-transform ${activeColor === c ? "scale-110 border-slate-800" : "border-transparent"}`} style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            {[2, 4, 6].map((w) => (
              <button key={w} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center">
                <span className="rounded-full bg-slate-700 block" style={{ width: w, height: w }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDF Viewer — generated slide content per day
// ---------------------------------------------------------------------------

function SlideCover({ slide }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl flex flex-col items-center justify-center text-white text-center px-6 sm:px-10">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-6">
        <span className="font-bold text-lg">V</span>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold">{slide.title}</h3>
      <p className="text-slate-300 mt-3 text-sm">{slide.code}</p>
      <div className="w-16 h-0.5 bg-red-500 mt-4" />
      {slide.fileLabel && <p className="text-slate-400 mt-4 text-xs">{slide.fileLabel}</p>}
    </div>
  );
}

function SlideThink({ slide }) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl overflow-hidden flex flex-col px-6 sm:px-10 py-6 sm:py-8 border-b-4 border-red-500">
      <span className="absolute -bottom-10 right-6 text-[140px] sm:text-[220px] leading-none font-black text-white/5 select-none">?</span>
      <div className="relative">
        <span className="text-red-400 font-bold text-sm tracking-wide underline decoration-2 underline-offset-4">HÃY SUY NGHĨ...</span>
      </div>
      <div className="relative flex-1 flex items-center">
        <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-snug max-w-xl">{slide.question}</p>
      </div>
      <p className="relative text-slate-300 text-sm">Giữ câu hỏi này trong đầu khi học bài hôm nay</p>
    </div>
  );
}

function SlideOutline({ slide }) {
  const mid = Math.ceil(slide.topics.length / 2);
  const left = slide.topics.slice(0, mid);
  const right = slide.topics.slice(mid);
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-100">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-base sm:text-lg">Nội Dung Bài Học</span>
        <span className="text-xs font-semibold text-white/70 hidden sm:block">VinUniversity</span>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 px-6 sm:px-10 py-6 sm:py-8 content-center">
        <ol className="space-y-2.5 list-decimal list-inside text-slate-700 text-sm sm:text-base font-medium">
          {left.map((t) => <li key={t}>{t}</li>)}
        </ol>
        <ol className="space-y-2.5 list-inside text-slate-700 text-sm sm:text-base font-medium" start={mid + 1}>
          {right.map((t, i) => <li key={t} className="list-decimal">{t}</li>)}
        </ol>
      </div>
      <div className="bg-slate-900 text-white/70 text-xs px-5 sm:px-8 py-2.5 flex items-center justify-between">
        <span>Giảng viên (VinUni)</span>
        <span>17/03/2026</span>
      </div>
    </div>
  );
}

function SlideContent({ slide, page }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl flex flex-col justify-center text-white px-6 sm:px-10 py-8">
      <span className="text-blue-300 text-xs font-bold tracking-widest mb-3">SLIDE {page}</span>
      <h4 className="text-xl sm:text-2xl font-bold mb-5">{slide.topic}</h4>
      <ul className="space-y-2.5 text-sm sm:text-base text-slate-200 max-w-lg">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="text-blue-400 mt-0.5">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {slide.isLastPage && <p className="mt-6 text-xs text-slate-400">— Hết nội dung tài liệu —</p>}
    </div>
  );
}

function PDFViewer({ dayId, file, page, zoom }) {
  const isRealSlide = file.name.includes("day01-slide-blue-v0");
  const slide = useMemo(() => buildSlide(dayId, file.id, page, file.pages, file.name), [dayId, file.id, page, file.pages, file.name]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isRealSlide) return;
    // Use PDF.js from CDN to render the real PDF
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    if (!pdfjsLib) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    const renderPage = async () => {
      const pdf = await pdfjsLib.getDocument(`/day01-slide-blue-v0.pdf`).promise;
      const pdfPage = await pdf.getPage(page);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const viewport = pdfPage.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await pdfPage.render({ canvasContext: ctx, viewport }).promise;
    };

    renderPage().catch(console.error);
  }, [isRealSlide, page]);

  if (isRealSlide) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6 py-6 overflow-hidden">
        <div
          className="relative rounded-[20px] border border-blue-100 shadow-lg shadow-slate-200/60 w-full max-w-3xl overflow-hidden bg-slate-900"
          style={{ transform: `scale(${zoom / 100})`, aspectRatio: "16 / 10" }}
        >
          <div className="absolute top-2 left-4 z-10 text-white text-xs font-semibold bg-slate-900/70 px-2 py-0.5 rounded">
            Trang {page} / {file.pages}
          </div>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ background: "#fff" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6 py-6 overflow-hidden">
      <div
        className="relative bg-[#fdfcf8] rounded-[20px] border border-blue-100 shadow-lg shadow-slate-200/60 w-full max-w-3xl overflow-hidden transition-transform duration-200 origin-center"
        style={{ transform: `scale(${zoom / 100})`, aspectRatio: "16 / 10" }}
      >
        <div className="absolute top-4 left-5 text-xs font-medium text-slate-400 z-10">Trang {page} / {file.pages}</div>
        <div className="absolute top-4 right-5 text-xs font-medium text-slate-400 z-10 truncate max-w-[45%]">{file.name}</div>
        <div className="absolute inset-4 sm:inset-6 top-12">
          {slide.type === "cover" && <SlideCover slide={slide} />}
          {slide.type === "think" && <SlideThink slide={slide} />}
          {slide.type === "outline" && <SlideOutline slide={slide} />}
          {slide.type === "content" && <SlideContent slide={slide} page={page} />}
        </div>
      </div>
    </div>
  );
}

function PageNavigation({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center gap-4 pb-6 shrink-0">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors">
        <ChevronLeft className="w-4 h-4" size={16} />
      </button>
      <span className="text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-1.5">Trang {page} / {totalPages}</span>
      <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors">
        <ChevronRight className="w-4 h-4" size={16} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

function ChatMessage({ message, onCopy, onRegenerate, onFeedback }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
          {message.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[92%]">
        {message.contextPage != null && (
          <p className="text-[11px] text-slate-400 mb-1.5 px-1">Ngữ cảnh: Slide trang {message.contextPage}</p>
        )}
        <div className="bg-slate-50 text-slate-700 rounded-2xl rounded-bl-md border border-slate-100 px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
          {message.text}
        </div>

        {message.source && (
          <p className="text-[11px] text-slate-400 mt-1.5 px-1 truncate">Nguồn: {message.source}</p>
        )}

        {message.answered && (
          <div className="mt-2 space-y-2">
            {message.feedback == null ? (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <span className="text-xs text-slate-500">Phản hồi này có hữu ích không?</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => onFeedback(message.id, "up")} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                    <ThumbsUp className="w-3.5 h-3.5" size={14} />
                  </button>
                  <button onClick={() => onFeedback(message.id, "down")} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                    <ThumbsDown className="w-3.5 h-3.5" size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 px-1">Cảm ơn phản hồi của bạn!</p>
            )}

            {message.confidence && (
              <div className="flex items-center gap-3 px-1">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${message.confidence.color}`} style={{ width: `${message.confidence.pct}%` }} />
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">{message.confidence.pct}% · {message.confidence.label}</span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ĐÃ TRẢ LỜI
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 px-1">
              <button onClick={() => onCopy(message.text)} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <Copy className="w-3.5 h-3.5" size={14} />
              </button>
              <button onClick={() => onRegenerate(message.id)} className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <RefreshCw className="w-3.5 h-3.5" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SuggestedQuestions({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {SUGGESTED_QUESTIONS.map((q) => (
        <button key={q} onClick={() => onPick(q)} className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full px-3.5 py-2 transition-colors">
          {q}
        </button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3.5 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

function QuotaBar({ used, total, byok, onToggleByok }) {
  const pct = Math.min(100, (used / total) * 100);
  return (
    <div className="px-5 py-3 border-b border-slate-100 shrink-0">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-500 font-medium">Quota Tutor trong ngày</span>
        <span className="text-slate-700 font-semibold">{byok ? "Không giới hạn" : `${used} / ${total} câu`}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${byok ? "bg-emerald-500 w-full" : "bg-blue-500"}`} style={!byok ? { width: `${pct}%` } : undefined} />
        </div>
        <button
          onClick={onToggleByok}
          className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 transition-colors ${
            byok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {byok ? <ShieldCheck className="w-3 h-3" size={12} /> : <KeyRound className="w-3 h-3" size={12} />}
          BYOK
        </button>
      </div>
    </div>
  );
}

function AIChatPanel({ open, minimized, currentPage, dayId, fileName, onClose, onMinimizeToggle }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(8);
  const [byok, setByok] = useState(false);
  const scrollRef = useRef(null);
  const quotaTotal = 15;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!byok && quotaUsed >= quotaTotal) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    if (!byok) setQuotaUsed((q) => Math.min(quotaTotal, q + 1));
    
    try {
      const seed = hashPage(dayId, currentPage) + trimmed.length;
      const responseText = await fetchAiTutorResponse(trimmed, currentPage, null, null);
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        contextPage: currentPage,
        text: responseText,
        source: `Trang ${currentPage} – ${fileName.replace(".pdf", "")}`,
        confidence: confidenceFor(seed),
        answered: true,
        feedback: null,
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  }, [byok, quotaUsed, quotaTotal, dayId, currentPage, fileName]);

  const handleCopy = (text) => { if (navigator?.clipboard) navigator.clipboard.writeText(text).catch(() => {}); };

  const handleRegenerate = (id) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx < 1) return prev;
      const priorUser = [...prev.slice(0, idx)].reverse().find((m) => m.role === "user");
      const q = priorUser ? priorUser.text : "";
      const updated = [...prev];
      updated[idx] = { ...updated[idx], text: getAiReply(q + " ", currentPage), feedback: null, confidence: confidenceFor(hashPage(dayId, currentPage) + Date.now() % 97) };
      return updated;
    });
  };

  const handleFeedback = (id, value) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback: value } : m)));
  };

  const clearChat = () => { setMessages(INITIAL_MESSAGES); setQuotaUsed(8); };

  if (!open) return null;

  if (minimized) {
    return (
      <button onClick={onMinimizeToggle} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 text-white pl-3 pr-4 h-12 rounded-full shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-transform">
        <Bot className="w-5 h-5" size={20} />
        <span className="text-sm font-semibold">VLearn Tutor</span>
      </button>
    );
  }

  const quotaReached = !byok && quotaUsed >= quotaTotal;

  return (
    <aside
      className="bg-white border-l border-slate-200 flex flex-col shadow-2xl shadow-slate-900/10 animate-[slidein_0.25s_ease-out]"
      style={{ position: "fixed", top: 84, right: 0, bottom: 0, zIndex: 40, width: "min(420px, 100vw)" }}
    >
      <style>{`@keyframes slidein { from { transform: translateX(24px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
            <Bot className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">VLearn Tutor</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đang trực tuyến
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="hidden sm:flex items-center h-7 px-2.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Trang slide: {currentPage}
          </span>
          <button onClick={onMinimizeToggle} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400"><Minimize2 className="w-4 h-4" size={16} /></button>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400"><X className="w-4 h-4" size={16} /></button>
        </div>
      </div>

      <QuotaBar used={quotaUsed} total={quotaTotal} byok={byok} onToggleByok={() => setByok((b) => !b)} />

      <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
        <p className="text-xs text-slate-500">
          Đang hỗ trợ dựa trên nội dung <span className="font-semibold text-slate-700">trang {currentPage}</span>
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} onCopy={handleCopy} onRegenerate={handleRegenerate} onFeedback={handleFeedback} />
        ))}
        {typing && <TypingIndicator />}
        <SuggestedQuestions onPick={sendMessage} />
      </div>

      <div className="px-4 py-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-2 px-1">
          <button onClick={clearChat} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" size={14} /> Xóa cuộc trò chuyện
          </button>
          {quotaReached && <span className="text-[11px] text-red-500 font-medium">Hết quota hôm nay</span>}
        </div>
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:border-blue-300 transition-colors">
          <button className="w-7 h-7 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
            <Paperclip className="w-4 h-4" size={16} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            rows={1}
            disabled={quotaReached}
            placeholder={quotaReached ? "Bật BYOK để tiếp tục hỏi..." : "Hỏi VLearn Tutor về tài liệu này..."}
            className="flex-1 bg-transparent resize-none outline-none text-sm py-1.5 max-h-24 placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || quotaReached}
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 hover:bg-blue-700 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedDay, setExpandedDay] = useState("d1");
  const [selectedDay, setSelectedDay] = useState("d1");
  const [selectedFile, setSelectedFile] = useState(COURSE_DATA[0].files[0]);
  const [dark, setDark] = useState(false);

  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 768 : true));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [page, setPage] = useState(2);
  const [zoom, setZoom] = useState(111);
  const [activeTool, setActiveTool] = useState("read");
  const [notesByPage, setNotesByPage] = useState({ 2: 1 });

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMinimized, setAssistantMinimized] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "" });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 1800);
  };

  const handleToggleDay = (dayId) => setExpandedDay((prev) => (prev === dayId ? null : dayId));

  const handleSelectFile = (dayId, file) => {
    setExpandedDay(dayId);
    setSelectedDay(dayId);
    setSelectedFile(file);
    setPage(1);
    setNotesByPage({});
  };

  const handleZoom = (delta) => setZoom((z) => Math.min(200, Math.max(50, z + delta)));

  const handleUndo = () => showToast("Đã hoàn tác thao tác gần nhất");
  const handleEraseNotes = () => { setNotesByPage((prev) => ({ ...prev, [page]: 0 })); showToast("Đã xóa ghi chú trang này"); };
  const handleDownload = () => showToast("Đã tải tài liệu");
  const handleSave = () => showToast("Đã lưu tài liệu");

  const notesForPage = notesByPage[page] ?? 0;

  return (
    <div className={`h-screen w-full flex flex-col font-sans overflow-hidden ${dark ? "dark" : ""}`}>
      <Toast show={toast.show} message={toast.message} />

      <Header
        currentFile={selectedFile}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        onToggleAssistant={() => {
          setAssistantOpen((o) => {
            const next = !o;
            if (next && !isDesktop) {
              setSidebarOpen(false);
            }
            return next;
          });
          setAssistantMinimized(false);
        }}
        assistantOpen={assistantOpen}
      />

      <div
        className="flex-1 min-h-0 flex bg-slate-100 overflow-hidden relative transition-all duration-300"
        style={{ marginRight: assistantOpen && !assistantMinimized && isDesktop ? "min(420px, 100vw)" : 0 }}
      >
        <CourseSidebar
          open={sidebarOpen}
          overlay
          isDesktop={isDesktop}
          onClose={() => setSidebarOpen(false)}
          days={COURSE_DATA}
          expandedDay={expandedDay}
          onToggleDay={handleToggleDay}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
        />

        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="px-3 sm:px-6 pt-5 shrink-0">
            <DocumentToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              page={page}
              notes={notesForPage}
              zoom={zoom}
              onZoom={handleZoom}
              onDownload={handleDownload}
              onSave={handleSave}
              onUndo={handleUndo}
              onEraseNotes={handleEraseNotes}
            />
          </div>

          <PDFViewer dayId={selectedDay} file={selectedFile} page={page} zoom={zoom} />
          <PageNavigation page={page} totalPages={selectedFile.pages} onChange={setPage} />
        </main>
      </div>

      {assistantOpen && (
        <AIChatPanel
          open={assistantOpen}
          minimized={assistantMinimized}
          currentPage={page}
          dayId={selectedDay}
          fileName={selectedFile.name}
          onClose={() => setAssistantOpen(false)}
          onMinimizeToggle={() => setAssistantMinimized((m) => !m)}
        />
      )}
    </div>
  );
}
