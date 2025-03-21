import { useState, useEffect } from "react";
import { MessageCircle, X, User, Bot } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          content:
            "Hello! I'm Adam. You can tell me your symptoms, and I'll help predict possible diseases.",
        },
      ]);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Unexpected response format from API." },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: Unable to process request." },
      ]);
    }
  };

  return (
    <div>
  {/* Floating Chat Button */}
  <button
    className="fixed bottom-4 right-4 bg-[#FF7676] hover:bg-[#ff6262] text-white p-3 rounded-full shadow-lg transition cursor-pointer"
    onClick={() => setOpen(!open)}
  >
    {open ? <X size={24} /> : <MessageCircle size={24} />}
  </button>

  {/* Chat Window */}
  {open && (
    <div className="fixed bottom-16 right-4 w-80 mb-4 bg-white shadow-xl border border-[#E6FAFA] rounded-xl flex flex-col">
      {/* Top Bar with Bot Name & DP */}
      <div className="flex items-center gap-3 p-3 bg-[#0CAAAB] text-white rounded-t-xl">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <Bot size={18} className="text-[#0CAAAB]" />
        </div>
        <span className="font-semibold">Adam</span>
      </div>

      {/* Chat Messages */}
      <div className="h-60 overflow-y-auto p-3 flex flex-col gap-2 bg-[#F0F7F7]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "bot" && (
              <div className="w-8 h-8 bg-[#E6FAFA] rounded-full flex items-center justify-center">
                <Bot size={16} className="text-[#0CAAAB]" />
              </div>
            )}
            <div
              className={`p-2 rounded-lg text-sm max-w-[75%] ${
                msg.role === "user"
                  ? "bg-[#08E8DE] text-white self-end"
                  : "bg-white text-[#404040] border border-[#5BC7C8] self-start"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 flex gap-2 bg-white border-t border-[#E6FAFA] rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-[#5BC7C8] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#08E8DE]"
          placeholder="Describe your symptoms..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#FF7676] hover:bg-[#ff6262] text-white px-4 py-2 rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
  )}
</div>
  );
}
