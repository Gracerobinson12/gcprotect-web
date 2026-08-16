'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
}

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName, company: form.company },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
    padding: '12px 14px', color: '#fff', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 5vw' }}>
      <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:-200, left:'30%', width:600, height:600, background:'radial-gradient(circle,rgba(10,132,255,0.1) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:17, marginBottom:40 }}>
        <div style={{ width:32, height:32, background:'#0A84FF', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡</div>
        GC Protect
      </a>

      <div style={{ ...glass, padding:'36px', width:'100%', maxWidth:440, position:'relative' as const, zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8 }}>Create your free account</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>30 days free. Card required after 30-day trial.<br/>Start protecting your AI prompts today.</p>
        </div>

        {/* What you get */}
        <div style={{ background:'rgba(48,209,88,0.08)', border:'1px solid rgba(48,209,88,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'#30D158', marginBottom:8, letterSpacing:'.05em' }}>WHAT YOU GET — FREE FOR 30 DAYS THEN $12/MO</div>
          {['Unlimited prompt protection on any AI','Cryptographic token security — no patterns, no reuse','V2 automatic response restoration','Safety flagging with crisis resources','Full audit log — exportable CSV'].map(f=>(
            <div key={f} style={{ display:'flex', gap:8, fontSize:12, color:'rgba(255,255,255,0.65)', padding:'3px 0' }}>
              <span style={{ color:'#30D158', flexShrink:0 }}>✓</span>{f}
            </div>
          ))}
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:6, letterSpacing:'.04em' }}>FULL NAME</label>
            <input style={inp} type="text" placeholder="Jane Doe" required value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:6, letterSpacing:'.04em' }}>WORK EMAIL</label>
            <input style={inp} type="email" placeholder="jane@company.com" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:6, letterSpacing:'.04em' }}>COMPANY (OPTIONAL)</label>
            <input style={inp} type="text" placeholder="Acme Law Firm" value={form.company} onChange={e=>setForm({...form, company:e.target.value})}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:6, letterSpacing:'.04em' }}>PASSWORD</label>
            <input style={inp} type="password" placeholder="At least 8 characters" required minLength={8} value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          </div>

          {error && <div style={{ background:'rgba(255,69,58,0.1)', border:'1px solid rgba(255,69,58,0.25)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#FF6B6B', marginBottom:16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width:'100%', background:loading?'rgba(10,132,255,0.5)':'#0A84FF', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
            {loading ? 'Creating your account...' : '🛡 Create free account'}
          </button>
        </form>

        <div style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center', lineHeight:1.6 }}>
          By signing up you agree to our{' '}
          <a href="/terms" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>Privacy Policy</a>.
          <br/>Your data is protected by GC Protect itself.
        </div>

        <div style={{ marginTop:20, textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color:'#0A84FF', textDecoration:'none', fontWeight:500 }}>Log in</a>
        </div>
      </div>
    </div>
  )
}