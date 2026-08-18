'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [daysLeft, setDaysLeft] = useState(30)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState({ rating: 0, category: 'general', message: '' })
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [stats, setStats] = useState({ total_protected: 0, total_fields_secured: 0, critical_blocked: 0, safety_flags: 0 })
  const [versions, setVersions] = useState<any[]>([])
  const [latestVersion, setLatestVersion] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)

      // Store auth token in Chrome extension storage
      // Extension uses this to post stats to Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (session && typeof window !== 'undefined' && (window as any).chrome?.runtime) {
        try {
          (window as any).chrome.storage?.local?.set({
            gc_user_id: user.id,
            gc_access_token: session.access_token,
          })
        } catch (e) {}
      }

      if (profile?.trial_ends_at) {
        const end = new Date(profile.trial_ends_at)
        const now = new Date()
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        setDaysLeft(Math.max(0, diff))
      }

      // Load version history
      try {
        const vRes = await fetch('/versions.json')
        const vData = await vRes.json()
        setVersions(vData.versions || [])
        setLatestVersion(vData.latest || '')
      } catch (e) {}

      // Load stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (statsData) setStats(statsData)

      setLoading(false)
    }
    load()
  }, [])

  async function handleDownload() {
    const supabase = createClient()
    await supabase.from('downloads').insert({ user_id: user.id, version: 'v2' })
    window.location.href = '/GCProtect-v2.zip'
  }

  async function handleFeedback(e: React.FormEvent) {
    e.preventDefault()
    if (!feedback.message.trim()) return
    setFeedbackLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('feedback').insert({
        user_id: user.id,
        email: user.email,
        rating: feedback.rating || null,
        category: feedback.category,
        message: feedback.message,
      })
      setFeedbackSent(true)
    } catch (e) {}
    setFeedbackLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const trialColor = daysLeft <= 3 ? '#FF453A' : daysLeft <= 7 ? '#FF9F0A' : '#30D158'

  if (loading) return (
    <div style={{ background:'#1C1C1E', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', fontFamily:'-apple-system,sans-serif', fontSize:14 }}>
      Loading your dashboard...
    </div>
  )

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh' }}>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', position:'sticky' as const, top:0, zIndex:100 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:16 }}>
          <div style={{ width:30, height:30, background:'#0A84FF', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛡</div>
          GC Protect
        </a>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.5)', padding:'6px 14px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 5vw' }}>

        {/* Welcome */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', marginBottom:6 }}>
            Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', margin:0 }}>Your GC Protect dashboard — Individual Plan</p>
        </div>

        {/* Trial countdown */}
        <div style={{ ...glass, padding:'20px 24px', marginBottom:20, border:`1px solid ${trialColor}40`, background:`rgba(${daysLeft<=3?'255,69,58':daysLeft<=7?'255,159,10':'48,209,88'},0.06)`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:12 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:trialColor, marginBottom:4 }}>
              {daysLeft <= 0 ? '⚠️ Trial expired' : `🕐 ${daysLeft} day${daysLeft!==1?'s':''} left in your free trial`}
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>
              {daysLeft <= 0 ? 'Subscribe to continue protecting your AI prompts.' : daysLeft <= 7 ? 'Your trial ends soon — subscribe to keep your protection.' : 'After your trial, $12/month to continue.'}
            </div>
          </div>
          {daysLeft <= 7 && (
            <a href="https://buy.stripe.com/test_dRm8wR5QQ7zd38K5DA5wI00" style={{ background:'#0A84FF', color:'#fff', padding:'10px 22px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none', flexShrink:0 }}>
              Subscribe — $12/mo
            </a>
          )}
        </div>

        {/* Chrome store notice */}
        <div style={{ ...glass, padding:'14px 20px', marginBottom:24, background:'rgba(255,159,10,0.08)', border:'1px solid rgba(255,159,10,0.2)', display:'flex', gap:12, alignItems:'center' }}>
          <span style={{ fontSize:18 }}>⏳</span>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>
            <strong style={{ color:'#FF9F0A' }}>Chrome Web Store — submission in review.</strong> Install manually using the download below while we wait for approval. Same product, zero difference.
          </div>
        </div>

        {/* Download — gated behind account */}
        <div style={{ ...glass, padding:'24px', marginBottom:24, border:'1.5px solid rgba(10,132,255,0.4)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:16 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>🛡 GC Protect V2 — Ready to install</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Download and install in Chrome in under 2 minutes.</div>
            <a href="/install" style={{ fontSize:13, color:'#0A84FF', textDecoration:'none' }}>📖 View step-by-step install guide →</a>
          </div>
          <button onClick={handleDownload} style={{ background:'#30D158', color:'#000', padding:'12px 24px', borderRadius:10, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', flexShrink:0 }}>
            ⬇️ Download GC Protect V2
          </button>
        </div>

        {/* Stats */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>YOUR PROTECTION STATS</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:28 }}>
          {[
            { val: String(stats.total_protected || 0), label:'Prompts protected', color:'#30D158' },
            { val: String(stats.total_fields_secured || 0), label:'Data fields secured', color:'#fff' },
            { val: String(stats.critical_blocked || 0), label:'Critical risks blocked', color:'#FF453A' },
            { val: String(stats.safety_flags || 0), label:'Safety flags logged', color:'#FF9F0A' },
          ].map(stat=>(
            <div key={stat.label} style={{ ...glass, padding:'16px 20px' }}>
              <div style={{ fontSize:28, fontWeight:700, color:stat.color, lineHeight:1, marginBottom:4 }}>{stat.val}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Plan features */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>YOUR PLAN — INDIVIDUAL · $12/MO AFTER TRIAL</div>
        <div style={{ ...glass, padding:'20px 24px', marginBottom:28 }}>
          {[
            { icon:'🛡', label:'Protection', value:'Unlimited prompts — no cap' },
            { icon:'🤖', label:'AI Platforms', value:'ChatGPT, Claude, Gemini, Copilot, DeepSeek, Perplexity, Grok + more' },
            { icon:'🔐', label:'Security', value:'Cryptographic tokens — unique every time, no patterns, no reuse' },
            { icon:'📊', label:'Risk scoring', value:'Every prompt scored 0–100 before it sends' },
            { icon:'✅', label:'V2 Restoration', value:'Real names restored automatically in AI responses' },
            { icon:'🚩', label:'Safety flagging', value:'Harmful content flagged with crisis resources surfaced' },
            { icon:'📋', label:'Audit log', value:'Timestamped history, CSV export for compliance or legal use' },
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

          {/* Team teaser */}
          <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(255,255,255,0.04)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' as const }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>🔒 Team Plan — Coming Soon</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>Shared rules, admin dashboard, team audit log, Slack alerts</div>
            </div>
            <a href="mailto:hello@gratiacore.com?subject=Team Plan Waitlist" style={{ fontSize:12, fontWeight:600, color:'#0A84FF', textDecoration:'none', background:'rgba(10,132,255,0.1)', padding:'7px 14px', borderRadius:8, border:'1px solid rgba(10,132,255,0.2)', flexShrink:0 }}>
              Join Waitlist
            </a>
          </div>
        </div>

        {/* How to use */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>HOW TO USE GC PROTECT</div>
        <div style={{ ...glass, padding:'20px 24px', marginBottom:28 }}>
          {[
            { step:'1', title:'Download and install', desc:<>Click the download button above. Then follow the <a href="/install" style={{ color:'#0A84FF' }}>step-by-step install guide</a> — takes under 2 minutes.</> },
            { step:'2', title:'Open any AI tool', desc:'Go to ChatGPT, Claude, Gemini, Copilot, or DeepSeek. GC Protect activates automatically on all supported platforms.' },
            { step:'3', title:'Type your prompt with customer data', desc:'Include whatever information you need. GC Protect watches the prompt box in real time.' },
            { step:'4', title:'Click Protect & Send', desc:'The overlay shows what was detected and the risk score. One click anonymizes everything and sends the protected version.' },
            { step:'5', title:'Read the AI response — real names restored', desc:'V2 automatically swaps tokens back. You see real names. The AI never did. Completely invisible.' },
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

        {/* Version updates */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>VERSION UPDATES</div>
        <div style={{ ...glass, padding:'20px 24px', marginBottom:28 }}>
          {versions.length === 0 ? (
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Loading updates...</div>
          ) : versions.map((v, i) => (
            <div key={v.version} style={{ paddingBottom: i < versions.length-1 ? 20 : 0, marginBottom: i < versions.length-1 ? 20 : 0, borderBottom: i < versions.length-1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexWrap:'wrap' as const }}>
                <div style={{ fontFamily:'monospace', fontSize:15, fontWeight:700 }}>v{v.version}</div>
                {v.version === latestVersion && (
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:'rgba(48,209,88,0.15)', color:'#30D158', border:'1px solid rgba(48,209,88,0.3)' }}>LATEST</span>
                )}
                {v.type === 'major' && (
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:'rgba(10,132,255,0.15)', color:'#0A84FF', border:'1px solid rgba(10,132,255,0.3)' }}>MAJOR UPDATE</span>
                )}
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginLeft:'auto' }}>{v.date}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column' as const, gap:5, marginBottom:12 }}>
                {v.highlights.map((h: string) => (
                  <div key={h} style={{ display:'flex', gap:8, fontSize:13, color:'rgba(255,255,255,0.6)' }}>
                    <span style={{ color:'#30D158', flexShrink:0 }}>✓</span>{h}
                  </div>
                ))}
              </div>
              {v.download && (
                <button
                  onClick={v.version === latestVersion ? handleDownload : () => window.location.href = v.download}
                  style={{ background: v.version === latestVersion ? '#30D158' : 'rgba(255,255,255,0.08)', color: v.version === latestVersion ? '#000' : 'rgba(255,255,255,0.6)', border:'none', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  {v.version === latestVersion ? '⬇️ Download latest' : `⬇️ Download v${v.version}`}
                </button>
              )}
              {!v.download && (
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>No longer available</div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback form */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.07em', color:'rgba(255,255,255,0.3)', marginBottom:12 }}>TELL US WHAT YOU THINK</div>
        <div style={{ ...glass, padding:'24px', marginBottom:28 }}>
          {feedbackSent ? (
            <div style={{ textAlign:'center', padding:'20px' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🙏</div>
              <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>Thank you for your feedback!</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>We read every response and use it to improve GC Protect.</div>
            </div>
          ) : (
            <form onSubmit={handleFeedback}>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>How is GC Protect working for you?</div>

              {/* Star rating */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8, letterSpacing:'.05em' }}>RATING</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(star=>(
                    <button key={star} type="button" onClick={()=>setFeedback({...feedback, rating:star})}
                      style={{ background:'none', border:'none', cursor:'pointer', fontSize:28, opacity:feedback.rating>=star?1:0.3, transition:'opacity .15s', padding:0 }}>
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8, letterSpacing:'.05em' }}>CATEGORY</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
                  {['general','bug','feature request','question','other'].map(cat=>(
                    <button key={cat} type="button" onClick={()=>setFeedback({...feedback, category:cat})}
                      style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500, border:'1px solid', borderColor:feedback.category===cat?'#0A84FF':'rgba(255,255,255,0.15)', background:feedback.category===cat?'rgba(10,132,255,0.2)':'transparent', color:feedback.category===cat?'#60A5FA':'rgba(255,255,255,0.5)', cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8, letterSpacing:'.05em' }}>YOUR FEEDBACK</div>
                <textarea value={feedback.message} onChange={e=>setFeedback({...feedback, message:e.target.value})}
                  placeholder="Tell us what's working, what's not, or what you'd love to see next..."
                  required
                  style={{ width:'100%', minHeight:100, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:13, lineHeight:1.6, resize:'none', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
                />
              </div>

              <button type="submit" disabled={feedbackLoading} style={{ background:'#0A84FF', color:'#fff', border:'none', borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:600, cursor:feedbackLoading?'not-allowed':'pointer', fontFamily:'inherit' }}>
                {feedbackLoading ? 'Sending...' : 'Send feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Support */}
        <div style={{ ...glass, padding:'20px 24px', textAlign:'center' as const, background:'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Questions or need help installing?</div>
          <a href="mailto:hello@gratiacore.com" style={{ color:'#0A84FF', textDecoration:'none', fontSize:14, fontWeight:500 }}>hello@gratiacore.com</a>
          <span style={{ color:'rgba(255,255,255,0.15)', margin:'0 12px' }}>·</span>
          <a href="/install" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:13 }}>Install guide</a>
          <span style={{ color:'rgba(255,255,255,0.15)', margin:'0 12px' }}>·</span>
          <a href="/privacy" style={{ color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:13 }}>Privacy</a>
        </div>

      </div>
    </div>
  )
}