'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CONFIG } from '@/lib/config'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 20,
}

const inp: React.CSSProperties = {
  width: '100%',
  background: 'rgba(0,0,0,0.25)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '12px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
}

export default function Signup() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName, company: form.company },
          emailRedirectTo: `${window.location.origin}/confirm`,
        }
      })
      if (signupError) throw signupError
      // Move to payment step
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleStripeCheckout() {
    // Use INDIVIDUAL link only — never team
    const url = new URL(CONFIG.STRIPE_INDIVIDUAL)
    url.searchParams.set('prefilled_email', form.email)
    // After payment Stripe redirects to dashboard
    window.location.href = url.toString()
  }

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh', display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', padding:'40px 5vw' }}>
      <div style={{ position:'fixed' as const, inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute' as const, top:-200, left:'30%', width:600, height:600, background:'radial-gradient(circle,rgba(10,132,255,0.1) 0%,transparent 70%)', borderRadius:'50%' }}/>
      </div>

      <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:17, marginBottom:36 }}>
        <div style={{ width:32, height:32, background:'#0A84FF', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🛡</div>
        GC Protect
      </a>

      {/* Progress */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
        {['Create account', 'Add payment', 'Start protecting'].map((label, i) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background: step > i+1 ? '#30D158' : step === i+1 ? '#0A84FF' : 'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff' }}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span style={{ fontSize:12, color: step === i+1 ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: step === i+1 ? 600 : 400 }}>{label}</span>
            </div>
            {i < 2 && <div style={{ width:24, height:1, background:'rgba(255,255,255,0.15)' }}/>}
          </div>
        ))}
      </div>

      {/* ── STEP 1 — Account ── */}
      {step === 1 && (
        <div style={{ ...glass, padding:'36px', width:'100%', maxWidth:440, position:'relative' as const as const, zIndex:1 }}>
          <div style={{ textAlign:'center' as const, marginBottom:24 }}>
            <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8 }}>Create your account</h1>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>
              7 days free — card required next step, not charged until day 7
            </p>
          </div>

          <div style={{ background:'rgba(48,209,88,0.08)', border:'1px solid rgba(48,209,88,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#30D158', marginBottom:8, letterSpacing:'.05em' }}>
              FREE FOR 7 DAYS · THEN ${CONFIG.MONTHLY_PRICE}/MO
            </div>
            {[
              'Unlimited prompt protection on any AI',
              'Cryptographic token security',
              'V2 automatic response restoration',
              'Full audit log — exportable CSV',
            ].map(f=>(
              <div key={f} style={{ display:'flex', gap:8, fontSize:12, color:'rgba(255,255,255,0.65)', padding:'2px 0' }}>
                <span style={{ color:'#30D158', flexShrink:0 }}>✓</span>{f}
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateAccount}>
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

            {error && (
              <div style={{ background:'rgba(255,69,58,0.1)', border:'1px solid rgba(255,69,58,0.25)', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#FF6B6B', marginBottom:16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:'100%', background:loading?'rgba(10,132,255,0.5)':'#0A84FF', color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit' }}>
              {loading ? 'Creating account...' : 'Continue →'}
            </button>
          </form>

          <div style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center' as const, lineHeight:1.6 }}>
            By signing up you agree to our{' '}
            <a href="/terms" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>Terms</a>
            {' '}and{' '}
            <a href="/privacy" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>Privacy Policy</a>.
          </div>

          <div style={{ marginTop:16, textAlign:'center' as const, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color:'#0A84FF', textDecoration:'none', fontWeight:500 }}>Log in</a>
          </div>
        </div>
      )}

      {/* ── STEP 2 — Payment ── */}
      {step === 2 && (
        <div style={{ ...glass, padding:'36px', width:'100%', maxWidth:440, position:'relative' as const as const, zIndex:1 }}>
          <div style={{ textAlign:'center' as const, marginBottom:28 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:8 }}>Account created!</h1>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
              One last step — add your card to start your 7-day free trial.<br/>
              <strong style={{ color:'#fff' }}>You will not be charged today.</strong>
            </p>
          </div>

          {/* Clear trial summary */}
          <div style={{ background:'rgba(10,132,255,0.08)', border:'1px solid rgba(10,132,255,0.2)', borderRadius:12, padding:'16px', marginBottom:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>Plan</span>
              <span style={{ fontSize:13, fontWeight:600 }}>GC Protect Individual</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>Free trial</span>
              <span style={{ fontSize:13, fontWeight:600, color:'#30D158' }}>7 days</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>After trial</span>
              <span style={{ fontSize:13, fontWeight:600 }}>${CONFIG.MONTHLY_PRICE}/month</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0 0' }}>
              <span style={{ fontSize:14, fontWeight:700 }}>Charged today</span>
              <span style={{ fontSize:20, fontWeight:800, color:'#30D158' }}>$0.00</span>
            </div>
          </div>

          <button
            onClick={handleStripeCheckout}
            style={{ width:'100%', background:'#0A84FF', color:'#fff', border:'none', borderRadius:12, padding:'15px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginBottom:14 }}>
            Add card — start free trial →
          </button>

          <div style={{ background:'rgba(255,214,10,0.08)', border:'1px solid rgba(255,214,10,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12, color:'rgba(255,255,255,0.7)', textAlign:'center' as const as const }}>
            🎟 Have a promo code? Enter it on the next page in Stripe checkout.
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center' as const, lineHeight:1.7 }}>
            💳 Card saved securely by Stripe — we never see your card details<br/>
            📧 We email you 2 days before your trial ends<br/>
            ❌ Cancel anytime — no questions asked
          </p>
        </div>
      )}

    </div>
  )
}