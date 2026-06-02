import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";

export default function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở khung chat
  const [inputValue, setInputValue] = useState(""); // Nội dung ô nhập liệu
  const messagesEndRef = useRef(null);

  // Dữ liệu giả lập cuộc hội thoại mặc định ban đầu
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Xin chào! Tôi là VieclamPro AI Assistant. Tôi có thể giúp bạn tìm kiếm việc làm, tối ưu CV hoặc gợi ý kĩ năng phù hợp. Bạn cần trợ giúp gì hôm nay?",
      time: "Vừa xong"
    }
  ]);

  // Tự động cuộn xuống tin nhắn mới nhất khi có thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Giả lập AI phản hồi sau 1 giây (Sau này hai đứa gọi API kết nối OpenAI/Gemini ở đây nhé)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: `Cảm ơn bạn đã hỏi về "${userMessage.text}". Tính năng kết nối dữ liệu tuyển dụng thời gian thực với AI đang được xử lý. Tôi có thể gợi ý cho bạn các việc làm React hoặc Nodejs nổi bật hiện tại!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased text-slate-800">
      
      {/* 🔮 1. BONG BÓNG CHAT (FLOATING BUTTON) - CHỈ HIỆN KHI ĐANG ĐÓNG */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        >
          {/* Hiệu ứng sóng radar nhấp nháy thu hút sự chú ý */}
          <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping opacity-75" />
          <MessageSquare size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
          
          {/* Badge nhỏ thông báo */}
          <span className="absolute -top-1 -right-1 bg-amber-500 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center" />
        </button>
      )}

      {/* 📦 2. KHUNG CHAT CỦA BOT AI - HIỆN KHI ISOPEN === TRUE */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-white rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* 🟦 HEADER KHUNG CHAT */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/10 shadow-inner relative">
                <Bot size={18} className="text-white" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-blue-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-tight flex items-center gap-1">
                  VieclamPro AI <Sparkles size={11} className="text-amber-300 fill-amber-300" />
                </h3>
                <p className="text-[10px] text-blue-100 font-medium">Trợ lý ảo thông minh</p>
              </div>
            </div>
            
            {/* Nút đóng khung chat */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-blue-100 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* ⬜ BODY: VÙNG CUỘN HIỂN THỊ NỘI DUNG TIN NHẮN */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FFFDF9]/60 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => {
              const isAI = msg.sender === "ai";
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar của từng bên */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs ${
                    isAI ? "bg-blue-50 border border-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                  }`}>
                    {isAI ? <Bot size={13} /> : <User size={13} />}
                  </div>

                  {/* Bong bóng nội dung tin nhắn */}
                  <div className="space-y-0.5">
                    <div className={`px-3 py-2 text-xs font-medium rounded-2xl shadow-2xs leading-relaxed ${
                      isAI 
                        ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none text-left" 
                        : "bg-blue-600 text-white rounded-tr-none text-left"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[9px] text-slate-400 font-medium px-1 ${!isAI && "text-right"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Thẻ neo phục vụ việc cuộn tự động */}
            <div ref={messagesEndRef} />
          </div>

          {/* 🟨 FOOTER: THANH GÕ TIN NHẮN GỬI ĐI */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi AI Pro về kĩ năng, viết CV..."
              className="flex-1 text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                inputValue.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <Send size={13} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}