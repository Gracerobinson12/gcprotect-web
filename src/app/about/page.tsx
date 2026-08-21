'use client'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
}

export default function About() {
  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,SF Pro Display,Inter,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh' }}>

      {/* Nav */}
      <nav style={{ position:'sticky' as const, top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:17 }}>
          <div style={{ width:32, height:32, background:'#0A84FF', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡</div>
          GC Protect
        </a>
        <a href="/signup" style={{ background:'#0A84FF', color:'#fff', padding:'8px 20px', borderRadius:20, fontSize:14, fontWeight:600, textDecoration:'none' }}>
          Try free — 7 days
        </a>
      </nav>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'80px 5vw' }}>

        {/* Founder photo + intro */}
        <div style={{ display:'flex', gap:32, alignItems:'flex-start', marginBottom:56, flexWrap:'wrap' as const }}>
          <div style={{ flexShrink:0 }}>
            <img
              src="/grace.jpeg"
              alt="Grace Robinson — Founder of GC Protect"
              style={{ width:160, height:160, borderRadius:20, objectFit:'cover' as const, border:'2px solid rgba(255,255,255,0.12)' }}
            />
            <div style={{ marginTop:12, fontSize:13, fontWeight:600, color:'#fff' }}>Grace Robinson</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>Founder, Gratia Core LLC</div>
          </div>

          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.1em', color:'#0A84FF', marginBottom:14 }}>THE REAL STORY</div>
            <h1 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.15, marginBottom:20 }}>
              I built this as a college student who saw the problem firsthand.
            </h1>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.65)', lineHeight:1.8 }}>
              I was in college watching the debate about AI unfold in real time — people arguing about whether it was good or dangerous, whether it helped or hurt. But underneath all of that, I noticed something specific: nobody was talking about what actually happens to your data when you type it into these tools.
            </p>
          </div>
        </div>

        {/* Story */}
        <div style={{ ...glass, padding:'32px', borderRadius:20, marginBottom:16 }}>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9, marginBottom:16 }}>
            I realized it when I did it myself. I put my own information into an AI tool — just testing, just curious — and it hit me: this company now has my data. I didn't think about that before I typed. Most people don't.
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9, marginBottom:16 }}>
            Now imagine that's not your information. It's your client's. Your patient's. Your customer's SSN, their salary, their case details, their email. They trusted you with it. And you just sent it to a third-party AI server without a second thought — because the AI was helpful and the workflow was fast and nobody told you not to.
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9 }}>
            That's the gap I wanted to close. Not with a lecture about AI safety. With something that actually works, invisibly, so the people who need AI to do their jobs can keep using it — without exposing the people who trusted them.
          </p>
        </div>

        {/* Why young founder matters */}
        <div style={{ ...glass, padding:'32px', borderRadius:20, marginBottom:16, border:'1px solid rgba(10,132,255,0.2)', background:'rgba(10,132,255,0.06)' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', color:'#0A84FF', marginBottom:14 }}>WHY THIS MATTERS NOW</div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9, marginBottom:16 }}>
            I'm part of the generation that grew up watching data get mishandled at scale. We watched social media companies quietly monetize personal information. We watched breaches happen and companies apologize with free credit monitoring.
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9 }}>
            AI is moving faster than any of that. The tools are incredible. The adoption is instant. The privacy conversation is lagging far behind. I built GC Protect because I didn't want to wait for someone else to solve it.
          </p>
        </div>

        {/* Honest limitations */}
        <div style={{ ...glass, padding:'32px', borderRadius:20, marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'.08em', color:'rgba(255,255,255,0.4)', marginBottom:14 }}>WHAT I'LL TELL YOU STRAIGHT</div>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9, marginBottom:16 }}>
            GC Protect removes identifying information from AI prompts. That's what it does. It's not a complete HIPAA compliance program. It doesn't replace a legal data handling policy. It's one meaningful layer of protection that makes it significantly harder for your clients' real information to end up on a server they never agreed to.
          </p>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.9 }}>
            I'd rather be honest about that now than have you rely on something I can't fully deliver. The tool works. What it promises, it does. I'm not going to dress it up beyond that.
          </p>
        </div>

        {/* Contact */}
        <div style={{ ...glass, padding:'28px 32px', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>Questions or feedback?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>I read every email personally.</div>
          </div>
          <a href="mailto:intel@gratiacore.com" style={{ background:'#0A84FF', color:'#fff', padding:'10px 22px', borderRadius:10, fontSize:14, fontWeight:600, textDecoration:'none', flexShrink:0 }}>
            intel@gratiacore.com
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'28px 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16, marginTop:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:600 }}>
          <div style={{ width:24, height:24, background:'#0A84FF', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>🛡</div>
          GC Protect by Gratia Core
        </div>
        <div style={{ display:'flex', gap:20 }}>
          {[['Privacy','/privacy'],['Terms','/terms'],['Support','mailto:intel@gratiacore.com']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2025 Gratia Core LLC</div>
      </footer>

    </div>
  )
}