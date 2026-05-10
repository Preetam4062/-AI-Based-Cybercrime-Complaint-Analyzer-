import React, { useContext, useState, useRef } from 'react';
import { AppContext, AI_MAPPING } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';

function typewrite(el, texts, cb) {
  if (!el) return;
  let i = 0, j = 0;
  el.textContent = '';
  function type() {
    if (!el) return;
    if (j < texts[i].length) { el.textContent += texts[i][j++]; setTimeout(type, 28); }
    else { setTimeout(() => { el.textContent = ''; j = 0; i++; if (i < texts.length) type(); else cb?.(); }, 700); }
  }
  type();
}

export default function ChatSidebar() {
  const { chatOpen, setChatOpen } = useContext(AppContext);
  const { showToast }             = useContext(ToastContext);
  const [messages, setMessages]   = useState([{ sender: 'ai', text: 'Hello! I\'m the CyberSense Assistant. How can I help with your case today?' }]);
  const [input, setInput]         = useState('');
  const twRef   = useRef(null);
  const listRef = useRef(null);

  const AI_RESPONSES = [
    'Based on the pattern, I recommend you immediately call 1930 and provide all the incident details.',
    'I understand. Have you already reported this to your bank? That\'s a critical first step.',
    'You can track your case progress on the Tracker page using the Case ID provided after submission.',
    'For phishing emails, forward the suspicious message to report@phishing.gov.in as evidence.',
    'Recovery timelines depend on the complexity. Most financial fraud cases are reviewed within 72 hours.',
  ];

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const responseText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
      
      // Typewriter for last message
      setTimeout(() => {
        if (twRef.current) {
          typewrite(twRef.current, [responseText], () => {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { sender: 'ai', text: responseText };
              return updated;
            });
          });
        }
      }, 100);
    }, 600);
  };

  return (
    <aside className={`chat-sidebar${chatOpen ? ' open' : ''}`}>
      <div className="chat-header">
        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-messages" /> AI Assistant
          <div className="pulse-dot" style={{ marginLeft: '4px' }} />
        </div>
        <button className="icon-btn" onClick={() => setChatOpen(false)}><i className="ti ti-x" /></button>
      </div>

      <div className="chat-messages" ref={listRef}>
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1 && m.sender === 'ai' && m.text === '';
          return (
            <div key={i} className={`msg ${m.sender}`}>
              {isLast ? <span ref={twRef} /> : m.text}
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your case..."
        />
        <button className="btn" style={{ width: 'auto', padding: '0 16px' }} onClick={send}>
          <i className="ti ti-send" />
        </button>
      </div>
    </aside>
  );
}
