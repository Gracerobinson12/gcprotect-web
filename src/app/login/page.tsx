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

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width:'100%', background:'rgba(0,0,0,0.25)',
    border:'1px solid rgba(255,255,255,0.12)', borderRadius:10,
    padding:'12px 14px', color:'#fff', fontSize:14,
    outline:'none', fontFamily:'inherit', boxSizing:'border-box',
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

      <div style={{ ...glass, padding:'36px', width:'100%', maxWidth:400, position:'relative' as const, zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h1 style={{ fontSize:24, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)' }}>Log in to your GC Protect account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', display:'block', marginBottom:6, letterSpacing:'.04em' }}>EMAIL</label>
            <input style={inp} type="email" placeholder="jane@company.com" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'.04em' }}>PASSWORD</label>
              <a href="/forgot-password" style={{ fontSize:12, color:'#0A84FF', textDecoration:'none' }}>Forgot password?</a>
            </div>
            <input style={inp} type="password" placeholder="Your password" required value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          </div>

          {error && <div style={{ background:'rgba(255,69,58,0.1)', border:'1px solid rgba(255,69,58,0.25)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#FF6B6B', marginBottom:16 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width:'100%', background:loading?'rgba(10,132,255,0.5)':'#0A84FF', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div style={{ marginTop:20, textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.4)' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color:'#0A84FF', textDecoration:'none', fontWeight:500 }}>Start free — 30 days</a>
        </div>
      </div>
    </div>
  )
}