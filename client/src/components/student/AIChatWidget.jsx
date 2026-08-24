import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import aiBotImg from '../../assets/aibot.png'; 

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! Welcome to FASTSOL. How can I assist you with your learning journey today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/ai/chat`, { message: userMessage });
            setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, something went wrong. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
            {/* Floating Toggle Button with Glassmorphism */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white p-2 rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] transition-all duration-300 flex items-center justify-center group w-12 h-12 sm:w-14 sm:h-14 hover:scale-105 border border-white/20"
                >
                    <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm p-0.5 flex items-center justify-center overflow-hidden shadow-inner">
                        <img src={aiBotImg} alt="AI Bot" className="w-full h-full object-cover rounded-full" />
                    </div>
                </button>
            )}

            {/* Chat Box Window with Frosted Glassmorphism Effect */}
            {isOpen && (
                <div className="w-[82vw] max-w-[310px] sm:w-[370px] bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.15)] flex flex-col h-[380px] sm:h-[460px] border border-white/40 animate-fade-in overflow-hidden">
                    
                    {/* Header with Blur Gradient */}
                    <div className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md text-white p-3 sm:p-4 flex justify-between items-center shadow-sm border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 p-0.5 shadow-sm flex items-center justify-center overflow-hidden">
                                <img src={aiBotImg} alt="AI Bot" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base">FASTSOL AI</h3>
                                <p className="text-[10px] sm:text-[11px] text-blue-100 opacity-90">Always here to help</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-white/70 hover:text-white font-bold text-base sm:text-lg transition p-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-transparent">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 mt-1 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={aiBotImg} alt="AI Bot" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[82%] p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm backdrop-blur-md whitespace-pre-line ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-600/90 text-white rounded-br-none shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                                            : 'bg-white/90 text-gray-800 border border-white/60 rounded-bl-none shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start items-start gap-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 mt-1 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                                    <img src={aiBotImg} alt="AI Bot" className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-white/90 backdrop-blur-md text-gray-500 border border-white/60 p-3 rounded-xl sm:rounded-2xl text-xs shadow-sm animate-pulse flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form with Transparent Glass Effect */}
                    <form onSubmit={sendMessage} className="p-2.5 sm:p-3 border-t border-white/40 bg-white/60 backdrop-blur-md flex items-center gap-2 rounded-b-2xl sm:rounded-b-3xl focus-within:ring-2 focus-within:ring-blue-400/30 transition">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm focus:outline-none placeholder:text-gray-400 text-gray-800"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`p-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                                input.trim() && !loading
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm scale-100'
                                    : 'bg-white/50 text-gray-400 scale-95 cursor-not-allowed border border-white/40'
                            }`}
                        >
                           <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            )}
            
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AIChatWidget;