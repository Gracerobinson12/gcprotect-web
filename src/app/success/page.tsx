'use client'
import { useEffect, useState } from 'react'

export default function Success() {
  const [trialEnd, setTrialEnd] = useState('')

  useEffect(() => {
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    setTrialEnd(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
  }, [])

  const s: Record<string, React.CSSProperties> = {
    page: { fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 5vw', textAlign:'center' },
    glass: { background:'rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20 },
  }

  return (
    <div style={s.page}>
      <div style={{ width:72, height:72, background:'rgba(48,209,88,0.15)', border:'2px solid rgba(48,209,88,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginBottom:24 }}>🛡</div>

      <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:12 }}>You're protected.</h1>
      <p style={{ fontSize:17, color:'rgba(255,255,255,0.6)', maxWidth:480, lineHeight:1.6, marginBottom:48 }}>
        Your 14-day free trial has started. No charge until {trialEnd}. Cancel anytime before then and pay nothing.
      </p>

      {/* Plan summary */}
      <div style={{ ...s.glass, padding:'28px', maxWidth:520, width:'100%', marginBottom:20, textAlign:'left' }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'#0A84FF', marginBottom:14 }}>YOUR PLAN — INDIVIDUAL · $12/MO</div>
        {['1 person, unlimited prompts','ChatGPT, Claude, Gemini, Copilot, DeepSeek + more','Real-time PII & token detection','Risk scoring on every prompt','V2 response restoration — real names restored automatically','Safety flagging built in','Full audit log — CSV export'].map(f=>(
          <div key={f} style={{ display:'flex', gap:10, fontSize:14, color:'rgba(255,255,255,0.7)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color:'#30D158', fontWeight:600, flexShrink:0 }}>✓</span>{f}
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div style={{ ...s.glass, padding:'24px', maxWidth:520, width:'100%', marginBottom:28, textAlign:'left' }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.4)', marginBottom:14 }}>NEXT STEPS</div>
        {[
          { title:'Download GC Protect V2', desc:'Click below to download. Unzip the folder anywhere on your computer.' },
          { title:'Load in Chrome', desc:'Go to chrome://extensions → Enable Developer Mode → Load unpacked → select the folder.' },
          { title:'Open any AI tool', desc:'Go to ChatGPT, Claude, or Gemini. GC Protect activates automatically.' },
          { title:'Test it', desc:'Paste: "Jane Doe, SSN: 123-45-6789, Email: jane@company.com" and press Enter. Watch GC Protect intercept it.' },
        ].map((step,i)=>(
          <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:i<3?'1px solid rgba(255,255,255,0.06)':'none', alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, marginTop:2 }}>{i+1}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{step.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <a href="/GCProtect-v2.zip" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#30D158', color:'#000', padding:'14px 28px', borderRadius:12, fontSize:15, fontWeight:700, textDecoration:'none', marginBottom:14 }}>
        ⬇️ Download GC Protect V2
      </a>
      <a href="/dashboard" style={{ fontSize:14, color:'#0A84FF', textDecoration:'none' }}>Go to my dashboard →</a>
    </div>
  )
}