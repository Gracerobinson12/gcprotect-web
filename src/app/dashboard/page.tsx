'use client'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
}

export default function Dashboard() {
  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', position:'sticky' as const, top:0, zIndex:100 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:16 }}>
          <div style={{ width:30, height:30, background:'#0A84FF', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛡</div>
          GC Protect
        </a>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:10, background:'rgba(10,132,255,0.2)', color:'#0A84FF', border:'1px solid rgba(10,132,255,0.3)' }}>
            Individual Plan
          </span>
          <a href="mailto:hello@gratiacore.com" style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>Support</a>
        </div>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 5vw' }}>

        <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8 }}>Your Dashboard</h1>
        <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:32 }}>Individual Plan · Protected by GC Protect V2</p>

        {/* Install CTA */}
        <div style={{ ...glass, padding:'20px 24px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16, border:'1.5px solid rgba(10,132,255,0.4)' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>🛡 Install GC Protect V2</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Takes 2 minutes. Works on ChatGPT, Claude, Gemini, Copilot, DeepSeek and more.</div>
          </div>
          <a href="/GCProtect-v2.zip" style={{ background:'#30D158', color:'#000', padding:'10px 22px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none', flexShrink:0 }}>
            ⬇️ Download V2
          </a>
        </div>

        {/* Chrome store notice */}
        <div style={{ ...glass, padding:'14px 20px', marginBottom:28, background:'rgba(255,159,10,0.08)', border:'1px solid rgba(255,159,10,0.2)', display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:20 }}>⏳</span>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>
            <strong style={{ color:'#FF9F0A' }}>Chrome Web Store submission in review.</strong> While Google reviews it, install directly using the download above — identical product, zero difference.
          </div>
        </div>

        {/* Stats */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>YOUR PROTECTION STATS</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:28 }}>
          {[
            { val:'0', label:'Prompts protected', color:'#30D158' },
            { val:'0', label:'Data fields secured', color:'#fff' },
            { val:'0', label:'Critical risks blocked', color:'#FF453A' },
            { val:'0', label:'Safety flags logged', color:'#FF9F0A' },
          ].map(stat=>(
            <div key={stat.label} style={{ ...glass, padding:'16px 20px' }}>
              <div style={{ fontSize:28, fontWeight:700, color:stat.color, lineHeight:1, marginBottom:4 }}>{stat.val}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Plan features */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>INDIVIDUAL PLAN — $12/MO</div>
        <div style={{ ...glass, padding:'20px 24px', marginBottom:28 }}>
          {[
            { icon:'🛡', label:'Protection', value:'Unlimited prompts — no cap' },
            { icon:'🤖', label:'AI Platforms', value:'ChatGPT, Claude, Gemini, Copilot, DeepSeek, Perplexity, Grok, Poe + more' },
            { icon:'🔍', label:'Detection', value:'13+ data types: SSN, emails, API keys, GitHub tokens, passwords, DB strings' },
            { icon:'📊', label:'Risk scoring', value:'Every prompt scored 0–100 before it sends' },
            { icon:'✅', label:'V2 Restoration', value:'Real names restored automatically in AI responses' },
            { icon:'🚩', label:'Safety flagging', value:'Harmful content flagged with crisis resources surfaced' },
            { icon:'📋', label:'Audit log', value:'Full timestamped history, CSV export for compliance' },
            { icon:'👤', label:'Seats', value:'1 person — Team plan coming soon' },
          ].map((f,i,arr)=>(
            <div key={f.label} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'10px 0', borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
              <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.35)', marginBottom:2 }}>{f.label.toUpperCase()}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)' }}>{f.value}</div>
              </div>
            </div>
          ))}

          {/* Team coming soon teaser */}
          <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(255,255,255,0.04)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' as const }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:3 }}>🔒 Team Plan — Coming Soon</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Shared rules, admin dashboard, team audit log, Slack alerts — up to 10 seats</div>
            </div>
            <a href="mailto:hello@gratiacore.com?subject=Team Plan Waitlist" style={{ fontSize:12, fontWeight:600, color:'#0A84FF', textDecoration:'none', flexShrink:0, background:'rgba(10,132,255,0.1)', padding:'7px 14px', borderRadius:8, border:'1px solid rgba(10,132,255,0.2)' }}>
              Join Waitlist
            </a>
          </div>
        </div>

        {/* How to use */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>HOW TO USE GC PROTECT</div>
        <div style={{ ...glass, padding:'20px 24px', marginBottom:28 }}>
          {[
            { step:'1', title:'Open any AI tool', desc:'Go to ChatGPT, Claude, Gemini, Copilot, or DeepSeek. GC Protect activates automatically.' },
            { step:'2', title:'Type or paste your prompt with customer data', desc:'Include whatever information you need — names, emails, SSNs, financial data.' },
            { step:'3', title:'GC Protect intercepts before it sends', desc:"A popup shows the risk score and what was detected. Click 'Protect & Send' to anonymize and submit." },
            { step:'4', title:'AI answers — real names restored automatically', desc:'V2 automatically swaps tokens back in the response. You see real names. The AI never did.' },
            { step:'5', title:'Check your audit log anytime', desc:'Click the GC Protect icon in Chrome toolbar to see everything protected, flagged, or sent unprotected.' },
          ].map((item,i)=>(
            <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:i<4?'1px solid rgba(255,255,255,0.06)':'none', alignItems:'flex-start' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, marginTop:2 }}>{item.step}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Support */}
        <div style={{ ...glass, padding:'20px 24px', textAlign:'center' as const, background:'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Questions, issues, or feature requests?</div>
          <a href="mailto:hello@gratiacore.com" style={{ color:'#0A84FF', textDecoration:'none', fontSize:14, fontWeight:500 }}>hello@gratiacore.com</a>
          <span style={{ color:'rgba(255,255,255,0.2)', margin:'0 12px' }}>·</span>
          <a href="/privacy" style={{ color:'rgba(255,255,255,0.3)', textDecoration:'none', fontSize:13 }}>Privacy Policy</a>
          <span style={{ color:'rgba(255,255,255,0.2)', margin:'0 12px' }}>·</span>
          <a href="/terms" style={{ color:'rgba(255,255,255,0.3)', textDecoration:'none', fontSize:13 }}>Terms</a>
        </div>

      </div>
    </div>
  )
}