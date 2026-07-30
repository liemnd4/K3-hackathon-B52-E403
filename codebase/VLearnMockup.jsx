import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ArrowLeft, BookOpen, Bot, Sparkles, Sun, Moon, User, ChevronDown,
  ChevronRight, ChevronLeft, Play, PenLine, Highlighter, MoreHorizontal,
  Minus, Plus, Download, Save, Undo2, Eraser, X, Minimize2, Send,
  Paperclip, ThumbsUp, ThumbsDown, Copy, RefreshCw, Trash2, FileText,
  Circle, History, KeyRound, ShieldCheck,
} from "lucide-react";

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
      { id: "d1f1", name: "day01-gioi-thieu-ai-product.pdf", pages: 22, day: "d1" },
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
// Real AI Call Logic (OpenAI & Gemini API Support)
// ---------------------------------------------------------------------------

async function getRealAiReply({ question, pageContext, anchorText, apiKey }) {
  const systemPrompt = `Bạn là VLearn AI Tutor, trợ lý học tập thông minh cho học viên VinUni.
Nhiệm vụ của bạn là giải thích bài học chuẩn xác, ngắn gọn và LUÔN LUÔN kèm theo trích dẫn nguồn [Trang ${pageContext}] ở cuối câu trả lời.

NGUYÊN TẮC QUAN TRỌNG:
1. Nếu học viên có bôi đen văn bản (${anchorText ? `"${anchorText}"` : "không bôi đen"}), hãy tập trung giải thích đoạn bôi đen đó.
2. Nếu học viên KHÔNG bôi đen văn bản (gõ câu hỏi tự do như "tóm tắt slide này" hoặc hỏi bằng số trang), HÃY TỰ ĐỘNG LẤY NỘI DUNG TRANG ${pageContext} LÀM NGỮ CẢNH THAY THẾ để giải đáp. KHÔNG ĐƯỢC TỪ CHỐI "không tìm thấy nội dung".
3. Nếu câu hỏi ngoài phạm vi môn học (như đòi tải file, đòi API key), hãy từ chối khéo.
4. LUÔN LUÔN kết thúc câu trả lời bằng thẻ trích dẫn dạng: [Trang ${pageContext}].`;

  if (apiKey && apiKey.trim().length > 10) {
    const key = apiKey.trim();
    try {
      if (key.startsWith("sk-")) {
        // OpenAI Call (gpt-4o-mini)
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Học viên hỏi: "${question}" tại Trang ${pageContext}` }
            ],
            temperature: 0.3
          })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      } else {
        // Google Gemini Call
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nHọc viên hỏi: "${question}" tại Trang ${pageContext}` }] }]
          })
        });
        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].parts[0].text;
        }
      }
    } catch (err) {
      console.warn("AI API Call failed, falling back to local grounded engine:", err);
    }
  }

  const q = question.toLowerCase();
  if (q.includes("tóm tắt") || q.includes("trang") || q.includes("slide") || q.includes("này")) {
    return `Nội dung chính tại Trang ${pageContext}: Trang này tập trung trình bày các kiến thức cốt lõi về phương pháp thiết kế sản phẩm AI, giúp bạn hình dung quy trình triển khai và tối ưu theo từng bước. [Trang ${pageContext}]`;
  }
  if (anchorText && anchorText.length > 5) {
    return `Giải thích đoạn bôi đen ở Trang ${pageContext} ("${anchorText.slice(0, 30)}..."): Đây là thành phần quan trọng giúp hệ thống vận hành ổn định và tối ưu hiệu năng. [Trang ${pageContext}]`;
  }
  return `Dựa trên ngữ cảnh Trang ${pageContext}, khái niệm bạn đề cập đóng vai trò quan trọng trong việc xây dựng workflow cho AI Agent. [Trang ${pageContext}]`;
}
