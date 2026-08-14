'use client'
import { useState } from 'react'

const LINKS = {
  individual: 'https://buy.stripe.com/test_dRm8wR5QQ7zd38K5DA5wI00',
  download: '/GCProtect-v2.zip',
}

const DEMO_PATTERNS = [
  { type: 'SSN', label: 'Social Security Number', regex: /\b\d{3}-\d{2}-\d{4}\b/g, color: '#FF453A' },
  { type: 'EMAIL', label: 'Email Address', regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, color: '#FF9F0A' },
  { type: 'SALARY', label: 'Salary / Payroll', regex: /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, color: '#FFD60A' },
  { type: 'GITHUB', label: 'GitHub Token', regex: /\b(ghp|gho|ghs)_[A-Za-z0-9]{20,}\b/g, color: '#FF453A' },
  { type: 'AWS', label: 'AWS Access Key', regex: /\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, color: '#FF453A' },
  { type: 'PHONE', label: 'Phone Number', regex: /\b\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}\b/g, color: '#FF9F0A' },
  { type: 'NAME', label: 'Person Name', regex: /\b([A-Z][a-z]{1,20})\s+([A-Z][a-z]{1,20})\b/g, color: '#FF9F0A' },
]
const EXCLUDE = new Set(['ChatGPT','Google','Microsoft','Claude','OpenAI','Monday','Tuesday','Wednesday','Thursday','Friday','January','February','March','April','June','July','August','September','October','November','December'])
const TOKEN_PREFIX: Record<string,string> = { SSN:'GC-ID', EMAIL:'GC-EM', SALARY:'GC-SAL', GITHUB:'GC-GH', AWS:'GC-AWS', PHONE:'GC-PH', NAME:'GC-C' }
const tok = (t: string) => (TOKEN_PREFIX[t]||'GC-X') + Math.random().toString(36).substring(2,7).toUpperCase()

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
  const total = Object.values(found).reduce((s,f)=>s+f.count,0)
  return { found: Object.values(found), protectedText, score: Math.min(total*18,100) }
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
    <div style={{ ...glass, width: '100%', maxWidth: 680, overflow: 'hidden', textAlign: 'left' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 18px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.2)' }}>
        {['#FF453A','#FFD60A','#30D158'].map(c=><div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }}/>)}
        <span style={{ marginLeft:'auto', fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>GC Protect V2 — Live Demo</span>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.08em', color:'rgba(255,255,255,0.35)', marginBottom:8 }}>PASTE ANY TEXT BELOW</div>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          placeholder={'Try: Jane Doe, SSN: 123-45-6789\nEmail: jane@company.com, Salary: $82,000\nGitHub: ghp_abc123def456ghi789'}
          style={{ width:'100%', minHeight:88, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:12, color:'#fff', fontSize:13, lineHeight:1.6, resize:'none', outline:'none', fontFamily:'monospace', boxSizing:'border-box' }}
        />
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'12px 0 10px' }}>
          <button onClick={()=>input.trim()&&setResult(runScan(input))} style={{ background:'#0A84FF', color:'#fff', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            🔍 Scan & Protect
          </button>
          {result && <span style={{ fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20, background:scoreColor+'20', color:scoreColor, border:`1px solid ${scoreColor}40` }}>
            {result.score>=70?'CRITICAL':result.score>=40?'HIGH':'MEDIUM'} · {result.score}/100
          </span>}
          <button onClick={()=>{setInput('');setResult(null)}} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer', marginLeft:'auto', fontFamily:'inherit' }}>Reset</button>
        </div>
        {result && result.found.length===0 && <div style={{ fontSize:13, color:'#30D158', padding:'8px 0' }}>✓ No sensitive data found</div>}
        {result && result.found.length>0 && <>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.06em', color:'rgba(255,255,255,0.35)', marginBottom:8 }}>DETECTED</div>
            {result.found.map(f=>(
              <div key={f.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:f.color, flexShrink:0 }}/>
                <span style={{ flex:1, color:'rgba(255,255,255,0.8)' }}>{f.label}</span>
                <span style={{ fontWeight:600, color:f.color }}>{f.count}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.06em', color:'#30D158', marginBottom:8 }}>🛡 PROTECTED — SAFE FOR AI</div>
          <div style={{ background:'rgba(48,209,88,0.08)', border:'1px solid rgba(48,209,88,0.2)', borderRadius:12, padding:14, fontFamily:'monospace', fontSize:12, lineHeight:1.7, color:'rgba(255,255,255,0.85)', wordBreak:'break-all' as const }}>
            {result.protectedText.split('\x00').map((part,i)=>
              i%2===1 ? <span key={i} style={{ background:'rgba(48,209,88,0.2)', color:'#30D158', padding:'1px 5px', borderRadius:5, fontWeight:600 }}>{part}</span>
              : <span key={i}>{part.split('\n').map((line,j,arr)=><span key={j}>{line}{j<arr.length-1&&<br/>}</span>)}</span>
            )}
          </div>
        </>}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,SF Pro Display,Inter,sans-serif', color:'#fff', background:'#1C1C1E', minHeight:'100vh' }}>

      {/* Background orbs */}
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:-200, left:'30%', width:600, height:600, background:'radial-gradient(circle,rgba(10,132,255,0.1) 0%,transparent 70%)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', bottom:-100, right:'20%', width:500, height:500, background:'radial-gradient(circle,rgba(48,209,88,0.07) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:17 }}>
          <div style={{ width:32, height:32, background:'#0A84FF', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡</div>
          GC Protect
        </a>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <a href="#how" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>How it works</a>
          <a href="#pricing" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none', fontSize:15 }}>Pricing</a>
          <a href="#download" style={{ background:'#0A84FF', color:'#fff', padding:'8px 20px', borderRadius:20, fontSize:14, fontWeight:600, textDecoration:'none' }}>Download V2</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:1, minHeight:'calc(100vh - 64px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 5vw 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(48,209,88,0.12)', border:'1px solid rgba(48,209,88,0.3)', color:'#30D158', fontSize:13, fontWeight:600, padding:'6px 16px', borderRadius:20, marginBottom:24 }}>
          <span style={{ width:6, height:6, background:'#30D158', borderRadius:'50%' }}/>
          V2 Now Available — Download Free
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>

        <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24, maxWidth:820 }}>
          Your team is sending<br/>
          <span style={{ color:'#FF453A' }}>real client data</span> to AI.<br/>
          GC Protect stops that.
        </h1>

        <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'rgba(255,255,255,0.6)', maxWidth:520, marginBottom:40, lineHeight:1.6 }}>
          GC Protect sits between your employees and ChatGPT, Claude, Gemini, Copilot, and DeepSeek. Before any prompt goes out, sensitive data is replaced with secure tokens. The AI works. Your clients stay protected.
        </p>

        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center', marginBottom:16 }}>
          <a href="#download" style={{ background:'#0A84FF', color:'#fff', padding:'15px 32px', borderRadius:14, fontSize:16, fontWeight:600, textDecoration:'none' }}>
            ⬇️ Download GC Protect V2 — Free
          </a>
          <a href="#how" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', padding:'15px 32px', borderRadius:14, fontSize:16, fontWeight:500, textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)' }}>
            See how it works ↓
          </a>
        </div>

        <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginBottom:16 }}>Free to download · No account needed to try · Chrome Web Store coming soon</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,159,10,0.12)', border:'1px solid rgba(255,159,10,0.3)', color:'#FF9F0A', fontSize:12, fontWeight:500, padding:'5px 14px', borderRadius:20, marginBottom:56 }}>
          ⏳ Chrome Web Store submission in review — available for manual install now
        </div>

        <LiveDemo />
      </section>

      {/* DOWNLOAD SECTION */}
      <section id="download" style={{ position:'relative', zIndex:1, padding:'80px 5vw', background:'rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#30D158', marginBottom:16 }}>DOWNLOAD</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>Install GC Protect V2<br/>in 3 steps.</h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:24, lineHeight:1.6 }}>
            While we wait for Chrome Web Store approval, you can install directly. Takes under 2 minutes. Works exactly the same.
          </p>
          <a href='/install' style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:14, color:'#0A84FF', textDecoration:'none', marginBottom:36, fontWeight:500 }}>📖 View full install guide with screenshots →</a>

          <div style={{ display:'flex', flexDirection:'column', gap:3, marginBottom:40 }}>
            {[
              { step:'1', title:'Download and unzip', desc:'Click the button below to download GC Protect V2. Unzip the folder anywhere on your computer — Desktop works fine.', action:true },
              { step:'2', title:'Open Chrome Extensions', desc:'In Chrome, go to chrome://extensions in your address bar. Toggle on "Developer mode" in the top right corner.' },
              { step:'3', title:'Load the extension', desc:'Click "Load unpacked" and select the gc-protect-extension folder you just unzipped. The GC Protect shield icon will appear in your toolbar immediately.' },
            ].map((s,i)=>(
              <div key={i} style={{ ...glass, padding:'22px 24px', display:'flex', gap:16, alignItems:'flex-start', borderRadius:16, marginBottom:2 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, flexShrink:0, marginTop:2 }}>{s.step}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>{s.title}</div>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.6, margin:0 }}>{s.desc}</p>
                  {s.action && (
                    <a href={LINKS.download} style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:14, background:'#30D158', color:'#000', padding:'10px 20px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none' }}>
                      ⬇️ Download GC Protect V2 (.zip)
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Platforms */}
          <div style={{ ...glass, padding:'20px 24px', borderRadius:16 }}>
            <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', color:'rgba(255,255,255,0.4)', marginBottom:14 }}>WORKS ON ALL MAJOR AI PLATFORMS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {['ChatGPT','Claude','Gemini','Copilot','DeepSeek','Perplexity','Grok','Poe'].map(p=>(
                <div key={p} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 14px', fontSize:13, color:'rgba(255,255,255,0.7)' }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        {[{num:'13+',label:'Data types detected'},{num:'10',label:'AI platforms protected'},{num:'<1s',label:'Time to scan & protect'},{num:'V2',label:'Response restoration'}].map((s,i)=>(
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
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:56, lineHeight:1.6, maxWidth:520 }}>GC Protect runs invisibly in the background. Real names go in — tokens come out. The AI works. Responses come back with real names restored.</p>

          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {[
              { icon:'✍️', title:'Employee pastes customer data into AI', desc:'Normal workflow — they paste in customer info and ask AI for help.', code:{ bad:true, text:'Customer: Jane Doe\nSSN: 123-45-6789\nEmail: jane@company.com' } },
              { icon:'🛡️', title:'GC Protect intercepts before it sends', desc:'Real identities replaced with GC tokens in under a second.', code:{ bad:false, text:'Customer: GC-C8F2A\nSSN: GC-ID9F83\nEmail: GC-EMB291' } },
              { icon:'🤖', title:'AI answers using tokens', desc:"ChatGPT or Claude answers fully using the tokens — works perfectly.", code:{ bad:false, text:'"GC-C8F2A qualifies for a refund. Here\'s the draft email..."' } },
              { icon:'✅', title:'V2 — Real names restored automatically', desc:'GC Protect swaps tokens back before the employee reads the response. They see "Jane Doe" — not a token. Completely invisible.', code:{ bad:false, text:'"Dear Jane Doe, your refund has been approved..."' } },
              { icon:'🚩', title:'Safety flagging built in', desc:'If a prompt contains content flagging self-harm or harm to others, GC Protect surfaces crisis resources and logs the event for admin review.', code:null },
              { icon:'📋', title:'Everything logged automatically', desc:'Timestamped audit trail of every protected interaction. Export to CSV for compliance or legal review.', code:null },
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
              { icon:'⚖️', title:'Law firms', desc:'Client names and case details stay out of AI. Attorney-client privilege protected.' },
              { icon:'🏥', title:'Healthcare', desc:'Patient names and medical info tokenized before any AI interaction. HIPAA supported.' },
              { icon:'📊', title:'Accounting firms', desc:'SSNs, salaries, and tax info never reach cloud AI.' },
              { icon:'🏠', title:'Real estate', desc:'Buyer and seller info protected across every AI tool your team uses.' },
              { icon:'💼', title:'Financial advisors', desc:'Client portfolio data stays inside your firm — not inside ChatGPT.' },
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

      {/* PRICING */}
      <section id="pricing" style={{ position:'relative', zIndex:1, padding:'100px 5vw' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:16 }}>PRICING</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>Simple pricing.<br/>Start free today.</h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:48, lineHeight:1.6 }}>14-day free trial. Card required — charged after 14 days. Cancel anytime.</p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>

            {/* Individual — Active */}
            <div style={{ ...glass, padding:'28px 24px', borderRadius:20, border:'1.5px solid rgba(10,132,255,0.5)', background:'rgba(10,132,255,0.08)', position:'relative' as const }}>
              <div style={{ position:'absolute', top:-12, left:20, background:'#30D158', color:'#000', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20 }}>AVAILABLE NOW</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Individual</div>
              <div style={{ fontSize:40, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, marginBottom:4 }}>$12</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>per month · or $99/yr — save $45</div>
              {['1 person, unlimited prompts','ChatGPT, Claude, Gemini, Copilot + more','Real-time PII & token detection','Risk scoring on every prompt','Full audit log — CSV export','V2 response restoration','Safety flagging built in','Works on Shopify admin too'].map(f=>(
                <div key={f} style={{ display:'flex', gap:10, fontSize:14, color:'rgba(255,255,255,0.65)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color:'#30D158', flexShrink:0, fontWeight:600 }}>✓</span>{f}
                </div>
              ))}
              <a href={LINKS.individual} style={{ display:'block', marginTop:20, padding:13, borderRadius:12, textAlign:'center', fontSize:15, fontWeight:600, textDecoration:'none', background:'#0A84FF', color:'#fff' }}>
                Start Free Trial — 14 Days
              </a>
            </div>

            {/* Team — Coming Soon — Blurred */}
            <div style={{ ...glass, padding:'28px 24px', borderRadius:20, position:'relative' as const, overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-12, left:20, background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20 }}>COMING SOON</div>

              {/* Blurred content overlay */}
              <div style={{ position:'absolute', inset:0, backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(28,28,30,0.6)', borderRadius:20 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔒</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Team Plan</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', textAlign:'center', maxWidth:200, lineHeight:1.5 }}>Team features launching soon. Join the waitlist to be notified first.</div>
                <a href="mailto:hello@gratiacore.com?subject=Team Plan Waitlist" style={{ marginTop:16, background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                  Join Waitlist
                </a>
              </div>

              {/* Behind the blur — faded content */}
              <div style={{ opacity:0.3 }}>
                <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Team</div>
                <div style={{ fontSize:40, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1, marginBottom:4 }}>$49</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>per month · up to 10 people</div>
                {['Up to 10 seats','Everything in Individual','Shared protection rules','Admin dashboard','Team audit log','Slack alerts','Priority support'].map(f=>(
                  <div key={f} style={{ display:'flex', gap:10, fontSize:14, color:'rgba(255,255,255,0.65)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color:'#30D158' }}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <p style={{ marginTop:24, fontSize:14, color:'rgba(255,255,255,0.3)' }}>
            Enterprise pricing available. <a href="mailto:hello@gratiacore.com" style={{ color:'#0A84FF', textDecoration:'none' }}>Contact us</a>
          </p>
        </div>
      </section>

      {/* CHROME STORE COMING SOON BANNER */}
      <section style={{ position:'relative', zIndex:1, padding:'60px 5vw', background:'rgba(255,159,10,0.06)', borderTop:'1px solid rgba(255,159,10,0.15)', borderBottom:'1px solid rgba(255,159,10,0.15)' }}>
        <div style={{ maxWidth:700, margin:'0 auto', display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' as const }}>
          <div style={{ fontSize:40 }}>⏳</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Chrome Web Store — Submission in Review</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>
              We've submitted GC Protect to the Chrome Web Store. While Google reviews it (typically 3–7 days), you can install directly using the download above — same product, same protection, zero difference.
            </div>
          </div>
          <a href="#download" style={{ background:'#FF9F0A', color:'#000', padding:'12px 24px', borderRadius:12, fontSize:14, fontWeight:700, textDecoration:'none', flexShrink:0 }}>
            Install Now ↓
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 5vw', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(48,209,88,0.12)', border:'1px solid rgba(48,209,88,0.25)', color:'#30D158', fontSize:13, fontWeight:500, padding:'6px 16px', borderRadius:20, marginBottom:28 }}>
          🛡 Protected by GC Protect
        </div>
        <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:20, lineHeight:1.15, maxWidth:600, margin:'0 auto 20px' }}>
          Your clients trusted you.<br/>Now you can protect them.
        </h2>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:36 }}>Download takes 30 seconds. Free to try. 14-day trial.</p>
        <a href="#download" style={{ display:'inline-block', background:'#0A84FF', color:'#fff', padding:'16px 40px', borderRadius:14, fontSize:17, fontWeight:600, textDecoration:'none' }}>
          ⬇️ Download GC Protect V2
        </a>
        <p style={{ marginTop:16, fontSize:13, color:'rgba(255,255,255,0.25)' }}>A Gratia Core product · Built for businesses in the AI era</p>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,0.07)', padding:'32px 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:15, fontWeight:600 }}>
          <div style={{ width:26, height:26, background:'#0A84FF', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🛡</div>
          GC Protect by Gratia Core
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {[['Privacy Policy','/privacy'],['Terms','/terms'],['Support','mailto:hello@gratiacore.com'],['Gratia Core','https://gratiacore.com']].map(([label,href])=>(
            <a key={label} href={href} style={{ fontSize:14, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>{label}</a>
          ))}
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>© 2025 Gratia Core LLC. All rights reserved.</div>
      </footer>

    </div>
  )
}