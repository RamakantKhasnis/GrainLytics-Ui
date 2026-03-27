import React, { useState } from "react";
import { chatService } from "@/services/api";
import { Bot, User, Send } from "lucide-react";

export default function AIChatPage() {
  const [history, setHistory] = useState([
      { role: "bot", content: "Hello! I am your AI Grain Intelligence Assistant. Ask me anything about your warehouses, risks, or actions to take." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
      if (!input.trim()) return;
      const msg = input.trim();
      setHistory(prev => [...prev, { role: "user", content: msg }]);
      setInput("");
      setLoading(true);

      try {
          const res = await chatService.sendMessage(msg);
          setHistory(prev => [...prev, { role: "bot", content: res.data.reply }]);
      } catch (e) {
          setHistory(prev => [...prev, { role: "bot", content: "Sorry, I am having trouble connecting to the intelligence engine right now." }]);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto h-[80vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>
      
      <div className="flex-1 bg-card rounded-xl border shadow-sm p-4 overflow-y-auto mb-4 flex flex-col gap-4">
        {history.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Bot size={16} className="text-primary" /></div>}
                
                <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'}`}>
                    <p className="text-sm">{msg.content}</p>
                </div>

                {msg.role === 'user' && <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0"><User size={16}/></div>}
            </div>
        ))}
        {loading && <div className="flex gap-3 items-center text-muted-foreground"><Bot size={16} className="animate-pulse"/><span className="text-xs animate-pulse">Computing insights...</span></div>}
      </div>

      <div className="flex gap-2">
          <input 
             className="flex-1 bg-card border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
             placeholder="e.g. Which district is most at risk?"
          />
          <button 
             onClick={sendMessage}
             className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
             disabled={loading}
          >
              <Send size={16} />
          </button>
      </div>
    </div>
  );
}
