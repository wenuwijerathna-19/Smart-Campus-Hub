import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import api from '../services/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'bot', text: 'Hi! I am your Smart Campus Assistant. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = message;
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg });
            setChatHistory(prev => [...prev, { role: 'bot', text: res.data.response }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 10000 }}>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        backgroundColor: 'var(--primary)', color: 'white',
                        border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px', height: '520px', backgroundColor: 'white',
                    borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)', animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a5f 100%)',
                        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '10px' }}>
                                <Bot size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Campus Assistant</h4>
                                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>AI Powered</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} style={{
                        flex: 1, padding: '1.25rem', overflowY: 'auto',
                        display: 'flex', flexDirection: 'column', gap: '1rem',
                        backgroundColor: '#f8fafc'
                    }}>
                        {chatHistory.map((chat, index) => (
                            <div key={index} style={{
                                alignSelf: chat.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%', display: 'flex', flexDirection: 'column',
                                alignItems: chat.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '0.8rem 1rem', borderRadius: chat.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                    backgroundColor: chat.role === 'user' ? 'var(--primary)' : 'white',
                                    color: chat.role === 'user' ? 'white' : 'var(--text-primary)',
                                    fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    lineHeight: '1.5'
                                }}>
                                    {chat.text}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>
                                    {chat.role === 'bot' ? 'Assistant' : 'You'}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8' }}>
                                <Loader2 size={16} className="animate-spin" />
                                <span style={{ fontSize: '0.8rem' }}>Thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={{
                        padding: '1.25rem', borderTop: '1px solid #f1f5f9',
                        display: 'flex', gap: '0.75rem', backgroundColor: 'white'
                    }}>
                        <input 
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            style={{
                                flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem'
                            }}
                        />
                        <button 
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            style={{
                                backgroundColor: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '12px', width: '42px', height: '42px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', opacity: message.trim() ? 1 : 0.5
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ChatBot;
