import React, { useState, useRef, useEffect } from 'react';

interface AIChatbotProps {
  userType: 'visual' | 'hearing' | 'none';
}

const AIChatbot: React.FC<AIChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ PREDEFINED QUESTIONS & ANSWERS
  const qaData = [
    {
      question: "what is html",
      answer: "HTML stands for Hyper Text Markup Language. It is used to structure web pages."
    },
    {
      question: "what is css",
      answer: "CSS is used to style web pages. It controls colors, layouts, and fonts."
    },
    {
      question: "what is javascript",
      answer: "JavaScript is used to make websites interactive and dynamic."
    },
    {
      question: "what is react",
      answer: "React is a JavaScript library used to build user interfaces."
    },
    {
      question: "what is data science",
      answer: "Data science is the process of analyzing data to extract useful insights."
    },
    {
      question: "what is python",
      answer: "Python is a popular programming language used in data science and AI."
    },
    {
      question: "what is machine learning",
      answer: "Machine learning allows systems to learn from data automatically."
    },
    {
      question: "what is ui ux",
      answer: "UI means user interface and UX means user experience."
    },
    {
      question: "what is cyber security",
      answer: "Cyber security protects systems and data from cyber attacks."
    },
    {
      question: "what is ai",
      answer: "Artificial Intelligence is the simulation of human intelligence by machines."
    }
  ];

  // ✅ BOT RESPONSE LOGIC (NO API)
  const getBotResponse = (input: string) => {
    const text = input.toLowerCase();

    // Greeting
    if (text.includes("hi") || text.includes("hello")) {
      return "Hello! 😊 Ask me about courses like HTML, Python, AI, etc.";
    }

    // Match Q&A
    const match = qaData.find(q => text.includes(q.question));

    if (match) return match.answer;

    // Fallback
    return "Sorry, I only understand limited questions. Try asking about HTML, CSS, Python, AI, etc.";
  };

  // ✅ SEND MESSAGE (LOCAL)
  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userText }
    ]);

    setInput('');
    setLoading(true);

    // Fake delay for realism
    setTimeout(() => {
      const reply = getBotResponse(userText);

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: reply }
      ]);

      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col absolute bottom-20 right-0 overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-bold">
            🤖 AI Tutor (Offline)
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[75%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-gray-500 text-sm">
                Typing...
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border p-2 rounded"
              placeholder="Ask like: What is HTML?"
            />

            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-3 rounded"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AIChatbot;