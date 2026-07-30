import slideVisionMetadata from "../data/slide_vision_metadata.json";

/**
 * Service gọi API AI thật (OpenAI GPT-4o Vision hoặc Gemini Vision)
 * @param {string} question - Câu hỏi của học viên
 * @param {number} currentPage - Trang slide hiện tại
 * @param {string|null} base64Image - Ảnh base64 của trang slide (nếu có)
 * @param {string|null} customApiKey - API Key nhập từ UI (BYOK)
 */
export async function fetchAiTutorResponse(question, currentPage = 1, base64Image = null, customApiKey = null) {
  const apiKey = customApiKey || import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  const pageData = slideVisionMetadata[`page_${currentPage}`] || {
    title: `Trang ${currentPage}`,
    text_content: "Nội dung bài giảng slide",
    crops: []
  };

  // 1. Nếu có OpenAI API Key -> Gọi API thật của OpenAI (gpt-4o-mini có Vision)
  if (apiKey && apiKey.startsWith("sk-")) {
    try {
      const messages = [
        {
          role: "system",
          content: "Bạn là Trợ lý VLearn AI Tutor. Nhiệm vụ của bạn là giải thích bài giảng, tóm tắt slide và phân tích các sơ đồ/biểu đồ cho học viên. Luôn trả lời súc tích, chính xác và đính kèm thẻ trích dẫn [Trang X] ở cuối câu trả lời."
        }
      ];

      const userContent = [];
      userContent.push({
        type: "text",
        text: `Học viên đang ở Slide Trang ${currentPage} (${pageData.title}).\nNội dung văn bản trang: "${pageData.text_content}".\nCâu hỏi: "${question}"`
      });

      // Nếu có ảnh Base64 của trang slide -> Gửi kèm sang Vision API
      if (base64Image) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: base64Image
          }
        });
      }

      messages.push({ role: "user", content: userContent });

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Lỗi kết nối OpenAI API");
      }

      const data = await res.json();
      let replyText = data.choices[0]?.message?.content || "";
      if (!replyText.includes(`[Trang ${currentPage}]`)) {
        replyText += ` [Trang ${currentPage}]`;
      }
      return replyText;
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local vision RAG:", err);
    }
  }

  // 2. Fallback local Vision RAG (khi chưa dán Key hoặc lỗi kết nối)
  const q = question.toLowerCase();
  
  if (q.includes("tóm tắt") || q.includes("tom tat") || q.includes("trang này") || q.includes("nội dung")) {
    let text = `📌 **Tóm tắt nội dung [Trang ${currentPage}]**:\n- **Tiêu đề**: ${pageData.title}\n- **Ý chính**: ${pageData.text_content}`;
    if (pageData.crops && pageData.crops.length > 0) {
      text += `\n- **Phân tích sơ đồ/biểu đồ**: ${pageData.crops[0].title} — ${pageData.crops[0].description}`;
    }
    return text;
  }

  if (q.includes("ảnh") || q.includes("sơ đồ") || q.includes("biểu đồ") || q.includes("ma trận")) {
    if (pageData.crops && pageData.crops.length > 0) {
      const crop = pageData.crops[0];
      return `📊 **Phân tích Sơ đồ/Biểu đồ [Trang ${currentPage}]**:\n- **Tên sơ đồ**: ${crop.title}\n- **Ý nghĩa**: ${crop.description}\n\n*Nguồn*: Được Vision Model trích xuất từ [Trang ${currentPage}].`;
    }
  }

  return `Dựa trên nội dung [Trang ${currentPage}] (${pageData.title}): ${pageData.text_content}. Hãy dán OpenAI Key vào nút BYOK để kích hoạt Vision AI thật nhé! [Trang ${currentPage}]`;
}
