import { useEffect, useRef, useState } from 'react'
import { FaPlus, FaPaperPlane, FaChartLine, FaBox } from 'react-icons/fa6'
import { AI_RESPONSES, CHAT_HISTORY, QUICK_PROMPTS } from '../data'

const INITIAL_MESSAGES = [
  { role: 'ai', html: "Hi Sarah! I've reviewed your Q3 campaign data. Your overall ROAS is 3.8x — solid, but TikTok is pulling it down at 2.1x. Instagram and Email are your top performers right now.<br><br>What would you like to focus on today?" },
  { role: 'user', text: 'What should I do about the TikTok ROAS drop?' },
  { role: 'ai', html: "Based on the data, the drop is creative fatigue — your top TikTok ad has been running 41 days.<br><br><strong>Short-term:</strong> Pause the 3 underperforming ad sets (0.8x ROAS) and shift budget to Instagram at 5.2x.<br><br><strong>Medium-term:</strong> Brief 2–3 UGC creators for fresh content. Want me to draft the brief?" },
]

export default function StrategistAI() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [activeChat, setActiveChat] = useState(0)
  const respIdx = useRef(0)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, typing])

  function send() {
    const msg = input.trim()
    if (!msg) return
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', html: AI_RESPONSES[respIdx.current % AI_RESPONSES.length] }])
      respIdx.current += 1
    }, 1400)
  }

  function keyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function newChat() {
    setMessages([{ role: 'ai', html: 'New session started. What would you like to work on today, Sarah?' }])
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', marginBottom: 4 }}>Strategist AI</h1>
          <p style={{ color: 'var(--t2)', fontSize: 14 }}>Your AI-powered marketing advisor. Ask anything, get actionable strategy.</p>
        </div>
        <button className="btn btn-p" onClick={newChat}><FaPlus /> New Chat</button>
      </div>

      <div className="chat-layout">
        <div className="chist">
          <div className="sec" style={{ marginBottom: 10 }}>Chat History</div>
          {CHAT_HISTORY.map((c, i) => (
            <div key={i} className={'chi' + (activeChat === i ? ' active' : '')} onClick={() => setActiveChat(i)}>
              <div className="chi-t">{c.t}</div>
              <div className="chi-d">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="cmain">
          <div className="cmsgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div className={'msg ' + m.role} key={i}>
                <div className={'mav ' + (m.role === 'ai' ? 'aiav' : 'usav')}>{m.role === 'ai' ? 'AI' : 'SC'}</div>
                <div className="mbub">
                  {m.html ? <span dangerouslySetInnerHTML={{ __html: m.html }} /> : m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg ai">
                <div className="mav aiav">AI</div>
                <div className="mbub">
                  <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                </div>
              </div>
            )}
          </div>
          <div className="cinput-area">
            <div className="cinput-row">
              <textarea
                className="cinput"
                rows={1}
                placeholder="Ask your Strategist AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={keyDown}
              />
              <button className="btn btn-p" onClick={send}><FaPaperPlane /></button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8, display: 'flex', gap: 12 }}>
              <span><FaChartLine style={{ fontSize: 10 }} /> Connected to live data</span>
              <span><FaBox style={{ fontSize: 10 }} /> Product catalog synced</span>
            </div>
          </div>
        </div>

        <div className="qap">
          <div className="sec" style={{ marginBottom: 10 }}>Quick Prompts</div>
          {QUICK_PROMPTS.map((p, i) => (
            <button className="qab" key={i} onClick={() => setInput(p)}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
