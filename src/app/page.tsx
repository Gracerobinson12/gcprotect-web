'use client'
import { useState } from 'react'

const DEMO_PATTERNS = [
  { type: 'SSN', label: 'Social Security Number', regex: /\b\d{3}-\d{2}-\d{4}\b/g, color: '#FF453A' },
  { type: 'EMAIL', label: 'Email Address', regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, color: '#FF9F0A' },
  { type: 'SALARY', label: 'Salary / Payroll', regex: /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, color: '#FFD60A' },
  { type: 'GITHUB', label: 'GitHub Token', regex: /\b(ghp|gho|ghs)_[A-Za-z0-9]{20,}\b/g, color: '#FF453A' },
  { type: 'PHONE', label: 'Phone Number', regex: /\b\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}\b/g, color: '#FF9F0A' },
  { type: 'NAME', label: 'Person Name', regex: /\b([A-Z][a-z]{1,20})\s+([A-Z][a-z]{1,20})\b/g, color: '#FF9F0A' },
]
const EXCLUDE = new Set(['ChatGPT','Google','Microsoft','Claude','OpenAI','Monday','Tuesday','Wednesday','Thursday','Friday','January','February','March','April','June','July','August','September','October','November','December'])
const TOKEN_PREFIX: Record<string,string> = { SSN:'GC-ID', EMAIL:'GC-EM', SALARY:'GC-SAL', GITHUB:'GC-GH', PHONE:'GC-PH', NAME:'GC-C' }

function tok(type: string) {
  const array = new Uint8Array(5)
  crypto.getRandomValues(array)
  return (TOKEN_PREFIX[type]||'GC-X') + Array.from(array).map(b=>b.toString(36)).join('').toUpperCase().substring(0,7)
}

interface Found { label: string; color: string; count: number }

function runScan(input: string) {
  const found: Record<string,Found> = {}
  const seen: Record<string,string> = {}
  for (const p of DEMO_PATTERNS) {
    const rx = new RegExp(p.regex.source, p.regex.flags)
    let m
    while ((m = rx.exec(input)) !== null) {
      if (p.type === 'NAME' && (EXCLUDE.has(m[1])||EXCLUDE.has(m[2]))) continue
      if (!found[p.label]) found[p.label] = { label: p.label, color: p.color, count: 0 }
      found[p.label].count++
      if (!seen[m[0]]) seen[m[0]] = tok(p.type)
    }
  }
  let protectedText = input
  for (const [val, token] of Object.entries(seen)) {
    protectedText = protectedText.split(val).join('\x00'+token+'\x00')
  }
  return { found: Object.values(found), protectedText, score: Math.min(Object.values(found).reduce((s,f)=>s+f.count,0)*18,100) }
}

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
}

function LiveDemo() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ReturnType<typeof runScan>|null>(null)
  const scoreColor = result ? (result.score>=70?'#FF453A':result.score>=40?'#FF9F0A':'#FFD60A') : '#0A84FF'
  return (
    <div style={{ ...glass, width:'100%', maxWidth:680, overflow:'hidden', textAlign:'left' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.2)' }}>
        {['#FF453A','#FFD60A','#30D158'].map(c=><div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }}/>)}
        <span style={{ marginLeft:'auto', fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>GC Protect V2 — Try it live</span>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.08em', color:'rgba(255,255,255,0.35)', marginBottom:8 }}>PASTE ANY TEXT WITH SENSITIVE DATA</div>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          placeholder={'Try: Jane Doe, SSN: 123-45-6789\nEmail: jane@company.com, Salary: $82,000'}
          style={{ width:'100%', minHeight:88, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:12, color:'#fff', fontSize:13, lineHeight:1.6, resize:'none', outline:'none', fontFamily:'monospace', boxSizing:'border-box' }}
        />
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'12px 0 10px' }}>
          <button onClick={()=>input.trim()&&setResult(runScan(input))} style={{ background:'#0A84FF', color:'#fff', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>🔍 Scan & Protect</button>
          {result && <span style={{ fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20, background:scoreColor+'20', color:scoreColor, border:`1px solid ${scoreColor}40` }}>{result.score>=70?'CRITICAL':result.score>=40?'HIGH':'MEDIUM'} · {result.score}/100</span>}
          <button onClick={()=>{setInput('');setResult(null)}} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', marginLeft:'auto', fontFamily:'inherit' }}>Reset</button>
        </div>
        {result && result.found.length===0 && <div style={{ fontSize:13, color:'#30D158', padding:'8px 0' }}>✓ No sensitive data found</div>}
        {result && result.found.length>0 && <>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.06em', color:'rgba(255,255,255,0.3)', marginBottom:8 }}>DETECTED & REPLACED</div>
            {result.found.map(f=>(
              <div key={f.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:f.color, flexShrink:0 }}/>
                <span style={{ flex:1, color:'rgba(255,255,255,0.8)' }}>{f.label}</span>
                <span style={{ fontWeight:600, color:f.color }}>{f.count}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.06em', color:'#30D158', marginBottom:8 }}>🛡 PROTECTED — SAFE TO SEND TO AI</div>
          <div style={{ background:'rgba(48,209,88,0.08)', border:'1px solid rgba(48,209,88,0.2)', borderRadius:12, padding:14, fontFamily:'monospace', fontSize:12, lineHeight:1.7, color:'rgba(255,255,255,0.85)', wordBreak:'break-all' as const }}>
            {result.protectedText.split('\x00').map((part,i)=>
              i%2===1 ? <span key={i} style={{ background:'rgba(48,209,88,0.2)', color:'#30D158', padding:'1px 5px', borderRadius:5, fontWeight:600 }}>{part}</span>
              : <span key={i}>{part.split('\n').map((line,j,arr)=><span key={j}>{line}{j<arr.length-1&&<br/>}</span>)}</span>
            )}
          </div>
          <div style={{ marginTop:12, padding:'14px 16px', background:'rgba(10,132,255,0.08)', border:'1px solid rgba(10,132,255,0.2)', borderRadius:10 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:6 }}>Want this on every AI prompt automatically?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', marginBottom:12 }}>GC Protect installs in Chrome and protects ChatGPT, Claude, Gemini, Copilot and more — without changing how you work.</div>
            <a href="/signup" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#0A84FF', color:'#fff', padding:'9px 18px', borderRadius:9, fontSize:13, fontWeight:600, textDecoration:'none' }}>
              🛡 Start free — 7 days →
            </a>
          </div>
        </>}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,SF Pro Display,Inter,sans-serif', color:'#fff', background:'#1C1C1E', minHeight:'100vh' }}>
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:-200, left:'30%', width:600, height:600, background:'radial-gradient(circle,rgba(10,132,255,0.1) 0%,transparent 70%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:-100, right:'20%', width:500, height:500, background:'radial-gradient(circle,rgba(48,209,88,0.07) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:17 }}>
          <div style={{ width:32, height:32, background:'#0A84FF', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡</div>
          GC Protect
        </a>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <a href="#how" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>How it works</a>
          <a href="#pricing" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>Pricing</a>
          <a href="/about" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>About</a>
          <a href="/login" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>Log in</a>
          <a href="/signup" style={{ background:'#0A84FF', color:'#fff', padding:'8px 20px', borderRadius:20, fontSize:14, fontWeight:600, textDecoration:'none' }}>Try free — 30 days</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:1, minHeight:'calc(100vh - 64px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 5vw 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(10,132,255,0.15)', border:'1px solid rgba(10,132,255,0.3)', color:'#60A5FA', fontSize:13, fontWeight:500, padding:'6px 16px', borderRadius:20, marginBottom:28 }}>
          <span style={{ width:6, height:6, background:'#0A84FF', borderRadius:'50%' }}/>
          Real-time AI data protection · V2 now available
        </div>

        <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24, maxWidth:820 }}>
          Your team is sending<br/>
          <span style={{ color:'#FF453A' }}>real client data</span> to AI.<br/>
          GC Protect stops that.
        </h1>

        <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'rgba(255,255,255,0.6)', maxWidth:520, marginBottom:40, lineHeight:1.6 }}>
          GC Protect sits between your employees and ChatGPT, Claude, Gemini, and Copilot. Sensitive data is replaced with secure tokens before anything sends. The AI works. Your clients stay protected.
        </p>

        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:16 }}>
          <a href="/signup" style={{ background:'#0A84FF', color:'#fff', padding:'15px 36px', borderRadius:14, fontSize:16, fontWeight:700, textDecoration:'none' }}>
            🛡 Start free — 7 days
          </a>
          <a href="#how" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', padding:'15px 28px', borderRadius:14, fontSize:16, fontWeight:500, textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)' }}>
            See how it works ↓
          </a>
        </div>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>
          Try the live demo below — no account needed
        </p>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)', marginBottom:48 }}>
          7-day free trial · Card required after signup · $0 charged today
        </p>

        <LiveDemo />
      </section>

      {/* STATS */}
      <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.2)' }}>
        {[{num:'13+',label:'Data types detected'},{num:'10',label:'AI platforms protected'},{num:'<1s',label:'Time to scan & protect'},{num:'V2',label:'Auto response restoration'}].map((s,i)=>(
          <div key={s.num} style={{ flex:1, maxWidth:200, padding:'28px 16px', textAlign:'center', borderRight:i<3?'1px solid rgba(255,255,255,0.07)':'none' }}>
            <div style={{ fontSize:32, fontWeight:700, color:'#0A84FF', letterSpacing:'-0.02em', marginBottom:6 }}>{s.num}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ position:'relative', zIndex:1, padding:'100px 5vw' }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>Your team uses AI exactly<br/>the same way. Just safely.</h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:56, lineHeight:1.6, maxWidth:520 }}>GC Protect runs invisibly. Real names go in as tokens. The AI answers. Real names come back. Your clients never exposed.</p>

          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {[
              { icon:'✍️', title:'Employee types a prompt with customer data', desc:'Normal workflow — they ask AI for help with a summary, email, or analysis and include customer info.', code:{ bad:true, text:'Customer: Jane Doe\nSSN: 123-45-6789\nEmail: jane@company.com\nOrder: $2,840' } },
              { icon:'🛡️', title:'GC Protect intercepts before it sends', desc:'In under a second, every sensitive field is replaced with a cryptographically unique token. Cryptographic tokens unique per session — consistent within a conversation, never reused across sessions.', code:{ bad:false, text:'Customer: GC-C9K2P4M\nSSN: GC-IDX8R2Q1\nEmail: GC-EM3T7K9\nOrder: GC-SAL2M8R' } },
              { icon:'🤖', title:'AI answers using tokens — works perfectly', desc:'The AI receives full context about what each token represents and answers your question completely without ever seeing real identities.', code:{ bad:false, text:'"GC-C9K2P4M placed an order of GC-SAL2M8R. Here\'s a draft follow-up email:\n\nDear GC-C9K2P4M, thank you for..."' } },
              { icon:'✅', title:'V2 — Real names restored automatically', desc:'GC Protect swaps every token back in the AI response before you read it. You see "Jane Doe." The AI never did. Completely invisible.', code:{ bad:false, text:'"Dear Jane Doe, thank you for your order of $2,840. We\'d love to offer you 15% off..."' } },
              { icon:'🚩', title: desc:'Harmful content — self-harm, threats, dangerous requests — is detected, crisis resources surfaced, and the event logged for admin review.', code:null },
              { icon:'📋', title:'Timestamped audit trail', desc:'Every protected interaction logged automatically. Export to CSV. Use in compliance reviews or legal proceedings.', code:null },
            ].map((step,i)=>(
              <div key={i} style={{ ...glass, padding:'22px 24px', display:'flex', gap:18, alignItems:'flex-start', borderRadius:16, marginBottom:2 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{step.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>{step.title}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.6, margin:0, marginBottom:step.code?12:0 }}>{step.desc}</p>
                  {step.code && <div style={{ background:step.code.bad?'rgba(255,69,58,0.08)':'rgba(48,209,88,0.08)', border:`1px solid ${step.code.bad?'rgba(255,69,58,0.2)':'rgba(48,209,88,0.2)'}`, borderRadius:10, padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:'rgba(255,255,255,0.75)', lineHeight:1.7, whiteSpace:'pre-wrap' as const }}>{step.code.text}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 5vw', background:'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>WHO IT'S FOR</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:56, lineHeight:1.15 }}>Built for businesses that handle<br/>other people's information.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
            {[
              { icon:'⚖️', title:'Law firms', desc:'Client names and case details stay out of AI tools. Helps protect privileged communications.' },
              { icon:'🏥', title:'Healthcare', desc:'Patient names and medical info tokenized before reaching AI tools. Supports your HIPAA workflows.' },
              { icon:'📊', title:'Accounting firms', desc:'SSNs, salaries, and tax info stay out of third-party AI tools.' },
              { icon:'🏠', title:'Real estate', desc:'Buyer and seller info protected across every AI tool your team uses.' },
              { icon:'💼', title:'Financial advisors', desc:'Client portfolio data and account numbers stay inside your firm — not inside ChatGPT.' },
              { icon:'💻', title:'Dev teams', desc:'GitHub tokens, API keys, database strings caught before they reach AI.' },
            ].map(a=>(
              <div key={a.title} style={{ ...glass, padding:24, borderRadius:18 }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{a.icon}</div>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{a.title}</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.55, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* TRUST & DATA HANDLING */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 5vw' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>HOW WE HANDLE YOUR DATA</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>
            We built a privacy tool.<br/>We take that seriously.
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:48, lineHeight:1.6, maxWidth:560 }}>
            Here is exactly what happens to your data when you use GC Protect. No vague promises.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12, marginBottom:48 }}>
            {[
              { icon:'🔒', title:'Your prompts never touch our servers', desc:'Tokenization happens entirely in your browser. The original text of your prompts is never sent to Gratia Core. We physically cannot see what you type.' },
              { icon:'🗂', title:'We only store metadata', desc:'Our database records timestamps, which AI platform was used, how many fields were protected, and risk scores — never the actual content of prompts.' },
              { icon:'⚡', title:'Tokens live in memory only', desc:'The token-to-value mapping exists only in your browser session. It is cleared when you close the tab. We have no way to reverse your tokens.' },
              { icon:'🏢', title:'Who we are', desc:'GC Protect is built by Gratia Core LLC, a registered US company. We are a small team building privacy infrastructure for the AI era. Questions? intel@gratiacore.com' },
            ].map(item => (
              <div key={item.title} style={{ ...glass, padding:'24px', borderRadius:18 }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{item.icon}</div>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{item.title}</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.6, margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Security posture statement */}
          <div style={{ ...glass, padding:'24px 28px', borderRadius:18, border:'1px solid rgba(10,132,255,0.2)', background:'rgba(10,132,255,0.06)' }}>
            <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', color:'#0A84FF', marginBottom:12 }}>SECURITY POSTURE</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
              {[
                { label:'Token generation', value:'crypto.getRandomValues() — same standard as banking apps' },
                { label:'Data storage', value:'Metadata only in Supabase — no prompt content, no PII stored server-side' },
                { label:'Token scope', value:'Consistent within a session, never reused across sessions or users' },
                { label:'Audit log', value:'Local to your device — you control it, we cannot access it' },
                { label:'SOC 2', value:'In progress — available to enterprise customers on request' },
                { label:'Open to review', value:'Security questions? Email intel@gratiacore.com' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:4, letterSpacing:'.05em' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER — AI OUTPUT QUALITY */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 5vw', background:'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>DOES IT ACTUALLY WORK?</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>
            The AI still gives you<br/>a perfect answer.
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:48, lineHeight:1.6, maxWidth:520 }}>
            The first thing skeptical buyers ask: does tokenizing data break the AI output? Here is a real before and after.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#FF453A', letterSpacing:'.07em', marginBottom:10 }}>WITHOUT GC PROTECT</div>
              <div style={{ ...glass, padding:20, borderRadius:16, border:'1px solid rgba(255,69,58,0.2)', background:'rgba(255,69,58,0.05)' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>PROMPT SENT TO AI</div>
                <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:16, background:'rgba(255,69,58,0.08)', padding:'10px', borderRadius:8 }}>
                  {'Customer: Jane Doe
Email: jane@acme.com
SSN: 123-45-6789
Salary: $82,000

Write a benefits summary.'}
                </div>
                <div style={{ fontSize:11, color:'#FF453A', fontWeight:600 }}>⚠️ Real data sent to OpenAI servers</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#30D158', letterSpacing:'.07em', marginBottom:10 }}>WITH GC PROTECT</div>
              <div style={{ ...glass, padding:20, borderRadius:16, border:'1px solid rgba(48,209,88,0.2)', background:'rgba(48,209,88,0.05)' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>PROMPT SENT TO AI</div>
                <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:16, background:'rgba(48,209,88,0.08)', padding:'10px', borderRadius:8 }}>
                  {'GC-C9K2P = a person\nGC-EM3T7 = their email\nGC-ID8F2 = their SSN\nGC-SAL4R = a dollar amount\n\nWrite a benefits summary.'}
                </div>
                <div style={{ fontSize:11, color:'#30D158', fontWeight:600 }}>✓ Zero real data reaches AI servers</div>
              </div>
            </div>
          </div>

          <div style={{ ...glass, padding:'24px', borderRadius:16, border:'1px solid rgba(48,209,88,0.2)', background:'rgba(48,209,88,0.05)' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#30D158', letterSpacing:'.07em', marginBottom:12 }}>AI RESPONSE — IDENTICAL QUALITY</div>
            <div style={{ fontFamily:'monospace', fontSize:13, color:'rgba(255,255,255,0.8)', lineHeight:1.8, marginBottom:16 }}>
              {'"Here is a benefits summary for GC-C9K2P:

Based on a salary of GC-SAL4R, GC-C9K2P qualifies for the standard benefits tier including health, dental, and 401k matching at 4%..."'}
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.06)', padding:'4px 10px', borderRadius:20 }}>✓ Correct structure</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.06)', padding:'4px 10px', borderRadius:20 }}>✓ Accurate calculations</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.06)', padding:'4px 10px', borderRadius:20 }}>✓ Real names restored automatically</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.06)', padding:'4px 10px', borderRadius:20 }}>✓ Jane Doe never exposed</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position:'relative', zIndex:1, padding:'100px 5vw' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>PRICING</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>Simple pricing.<br/>Start free for 7 days.</h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:48, lineHeight:1.6 }}>Card required after your 30-day trial. Cancel anytime before then.</p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {/* Individual */}
            <div style={{ ...glass, padding:'28px 24px', borderRadius:20, border:'1.5px solid rgba(10,132,255,0.5)', background:'rgba(10,132,255,0.08)', position:'relative' as const }}>
              <div style={{ position:'absolute', top:-12, left:20, background:'#30D158', color:'#000', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20 }}>AVAILABLE NOW</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Individual</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
                <div style={{ fontSize:40, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1 }}>$12</div>
                <div style={{ fontSize:15, color:'rgba(255,255,255,0.5)' }}>/mo</div>
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>or $99/yr — save $45</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(48,209,88,0.12)', border:'1px solid rgba(48,209,88,0.25)', color:'#30D158', fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:10, marginBottom:20 }}>
                ✓ First 30 days free — card required after trial
              </div>
              {['1 person, unlimited prompts','ChatGPT, Claude, Gemini, Copilot + more','Cryptographic token protection','Risk scoring on every prompt','V2 auto response restoration','Full audit log — CSV export'].map(f=>(
                <div key={f} style={{ display:'flex', gap:10, fontSize:14, color:'rgba(255,255,255,0.65)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color:'#30D158', flexShrink:0, fontWeight:600 }}>✓</span>{f}
                </div>
              ))}
              <a href="/signup" style={{ display:'block', marginTop:20, padding:13, borderRadius:12, textAlign:'center', fontSize:15, fontWeight:700, textDecoration:'none', background:'#0A84FF', color:'#fff' }}>
                Create free account
              </a>
            </div>

            {/* Team coming soon */}
            <div style={{ ...glass, padding:'28px 24px', borderRadius:20, position:'relative' as const, overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-12, left:20, background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20 }}>COMING SOON</div>
              <div style={{ position:'absolute', inset:0, backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(28,28,30,0.6)', borderRadius:20 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔒</div>
                <div style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>Team Plan</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', textAlign:'center', maxWidth:200, lineHeight:1.6 }}>Shared rules, admin dashboard, team audit log, Slack alerts — up to 10 seats</div>
                <a href="mailto:intel@gratiacore.com?subject=Team Plan Waitlist" style={{ marginTop:16, background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', padding:'10px 22px', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                  Join Waitlist
                </a>
              </div>
              <div style={{ opacity:0.2 }}>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Team</div>
                <div style={{ fontSize:40, fontWeight:700, lineHeight:1, marginBottom:4 }}>$49</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>per month · up to 10 people</div>
                {['Up to 10 seats','Everything in Individual','Shared protection rules','Admin dashboard','Team audit log','Slack alerts'].map(f=>(
                  <div key={f} style={{ display:'flex', gap:10, fontSize:14, color:'rgba(255,255,255,0.5)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p style={{ marginTop:24, fontSize:14, color:'rgba(255,255,255,0.3)' }}>
            Enterprise? <a href="mailto:intel@gratiacore.com" style={{ color:'#0A84FF', textDecoration:'none' }}>Contact us</a>
          </p>
        </div>
      </section>

      {/* FEEDBACK CTA */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 5vw', textAlign:'center', background:'rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.2 }}>
          Try it free. Tell us what you think.
        </h2>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:36, maxWidth:480, margin:'0 auto 36px' }}>
          7 days free. Card required — $0 today. We built this to solve a real problem — we want to know if it solves yours.
        </p>
        <a href="/signup" style={{ display:'inline-block', background:'#0A84FF', color:'#fff', padding:'16px 40px', borderRadius:14, fontSize:17, fontWeight:700, textDecoration:'none' }}>
          🛡 Create your free account
        </a>
        <p style={{ marginTop:16, fontSize:13, color:'rgba(255,255,255,0.25)' }}>A Gratia Core product · Built for businesses in the AI era</p>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,0.07)', padding:'32px 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:15, fontWeight:600 }}>
          <div style={{ width:26, height:26, background:'#0A84FF', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🛡</div>
          <div>
            <div>GC Protect</div>
            <a href="/about" style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textDecoration:'none', fontWeight:400 }}>by Gratia Core LLC</a>
          </div>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {[['About','/about'],['Privacy Policy','/privacy'],['Terms','/terms'],['Install Guide','/install'],['Support','mailto:intel@gratiacore.com']].map(([label,href])=>(
            <a key={label} href={href} style={{ fontSize:14, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>{label}</a>
          ))}
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>© 2025 Gratia Core LLC. All rights reserved.</div>
      </footer>
    </div>
  )
}