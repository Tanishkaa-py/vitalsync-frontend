import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const QUICK_PROMPTS = [
  { label: 'Explain my prescription', prompt: 'What should I know about taking medication regularly?', context: 'medication' },
  { label: 'Prepare for my appointment', prompt: 'What questions should I ask my doctor at my next appointment?', context: 'appointment' },
  { label: 'Understand a symptom', prompt: 'What are common causes of headaches and when should I see a doctor?', context: 'symptoms' },
  { label: 'Healthy habits', prompt: 'What are the most important daily habits for heart health?', context: 'general' },
];

const s = {
  page: { minHeight: '100vh', background: '#f4f6f4', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', gap: 10 },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, cursor: 'pointer' },
  container: { maxWidth: 780, margin: '0 auto', width: '100%', padding: '24px 24px 100px', display: 'flex', flexDirection: 'column', gap: 20 },
  header: { textAlign: 'center', paddingTop: 8 },
  aiIcon: { width: 56, height: 56, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 12px' },
  title: { fontSize: 22, fontWeight: 700, color: '#111211', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#4a4f4b', lineHeight: 1.5 },
  disclaimer: { background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#92400E', display: 'flex', gap: 8, alignItems: 'flex-start' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 },
  quickBtn: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', fontSize: 12, color: '#111211', fontWeight: 500 },
  quickSub: { fontSize: 11, color: '#4a4f4b', marginTop: 3, fontWeight: 400 },
  chat: { display: 'flex', flexDirection: 'column', gap: 14 },
  msgUser: { display: 'flex', justifyContent: 'flex-end' },
  msgAI: { display: 'flex', justifyContent: 'flex-start', gap: 10 },
  bubbleUser: { background: '#0F6E56', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', maxWidth: '75%', fontSize: 13, lineHeight: 1.5 },
  bubbleAI: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: '16px 16px 16px 4px', padding: '14px 16px', maxWidth: '80%', fontSize: 13, lineHeight: 1.7, color: '#111211' },
  aiAvatar: { width: 32, height: 32, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginTop: 2 },
  disclaimerChip: { fontSize: 10, color: '#4a4f4b', marginTop: 8, padding: '3px 8px', background: '#f4f6f4', borderRadius: 10, display: 'inline-block' },
  typingDot: { width: 7, height: 7, borderRadius: '50%', background: '#0F6E56', display: 'inline-block', margin: '0 2px', animation: 'bounce 1.2s infinite' },
  inputBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2e6e2', padding: '14px 24px', display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'center' },
  inputWrap: { flex: 1, maxWidth: 780, display: 'flex', gap: 10, alignItems: 'flex-end' },
  contextSelect: { border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 10px', fontSize: 12, color: '#4a4f4b', background: '#f4f6f4', outline: 'none', flexShrink: 0 },
  textarea: { flex: 1, border: '1px solid #e2e6e2', borderRadius: 10, padding: '10px 14px', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 100, minHeight: 42 },
  sendBtn: { background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0, height: 42 },
  sendBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  errorBubble: { background: '#FEE2E2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#991B1B', maxWidth: '80%' },
};

export default function AIAssistant() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('general');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (promptText = input, promptContext = context) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed, context: promptContext };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/suggest', {
        prompt: trimmed,
        context: promptContext,
      });

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.data.response,
        disclaimer: data.data.disclaimer,
      }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'AI service unavailable. Please try again.';
      setMessages(prev => [...prev, { role: 'error', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (qp) => {
    setContext(qp.context);
    sendMessage(qp.prompt, qp.context);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .quick-btn:hover { border-color: #0F6E56 !important; background: #E1F5EE !important; }
      `}</style>

      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync AI Assistant</span>
        <div style={s.navRight}>
          <button style={s.backBtn} onClick={() => navigate('/patient/dashboard')}>← Dashboard</button>
          <button style={s.backBtn} onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.aiIcon}>🤖</div>
          <h1 style={s.title}>VitalSync AI Health Assistant</h1>
          <p style={s.subtitle}>Ask me about symptoms, medications, appointments, or general wellness.<br />Powered by Google Gemini — securely via your backend.</p>
        </div>

        <div style={s.disclaimer}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <span>This AI provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor.</span>
        </div>

        {messages.length === 0 && (
          <>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#4a4f4b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick questions</p>
            <div style={s.quickGrid}>
              {QUICK_PROMPTS.map(qp => (
                <button key={qp.label} className="quick-btn" style={s.quickBtn} onClick={() => handleQuick(qp)}>
                  {qp.label}
                  <div style={s.quickSub}>{qp.prompt.slice(0, 50)}...</div>
                </button>
              ))}
            </div>
          </>
        )}

        <div style={s.chat}>
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <div key={i} style={s.msgUser}>
                  <div style={s.bubbleUser}>{msg.text}</div>
                </div>
              );
            }
            if (msg.role === 'error') {
              return (
                <div key={i} style={s.msgAI}>
                  <div style={s.aiAvatar}>⚠️</div>
                  <div style={s.errorBubble}>{msg.text}</div>
                </div>
              );
            }
            return (
              <div key={i} style={s.msgAI}>
                <div style={s.aiAvatar}>🤖</div>
                <div style={s.bubbleAI}>
                  {msg.text}
                  {msg.disclaimer && (
                    <div style={s.disclaimerChip}>ℹ️ {msg.disclaimer}</div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={s.msgAI}>
              <div style={s.aiAvatar}>🤖</div>
              <div style={{ ...s.bubbleAI, padding: '14px 18px' }}>
                <span style={s.typingDot} />
                <span style={{ ...s.typingDot, animationDelay: '0.2s' }} />
                <span style={{ ...s.typingDot, animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={s.inputBar}>
        <div style={s.inputWrap}>
          <select style={s.contextSelect} value={context} onChange={e => setContext(e.target.value)}>
            <option value="general">General</option>
            <option value="symptoms">Symptoms</option>
            <option value="medication">Medication</option>
            <option value="appointment">Appointment</option>
          </select>
          <textarea
            style={s.textarea}
            placeholder="Ask a health question... (Enter to send, Shift+Enter for new line)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            style={{ ...s.sendBtn, ...(loading || !input.trim() ? s.sendBtnDisabled : {}) }}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}
