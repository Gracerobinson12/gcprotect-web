'use client'
import { useEffect, useState } from 'react'

export default function Success() {
  const [plan, setPlan] = useState<'individual' | 'team'>('individual')

  useEffect(() => {
    // Detect plan from URL param Stripe passes back
    const params = new URLSearchParams(window.location.search)
    const p = params.get('plan')
    if (p === 'team') setPlan('team')
  }, [])

  const s: Record<string, React.CSSProperties> = {
    page: {
      fontFamily: "'Inter', sans-serif",
      background: '#080D1A',
      color: '#E8E8E8',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 5vw',
      textAlign: 'center',
    },
    badge: {
      width: 72, height: 72,
      background: 'rgba(16,185,129,0.15)',
      border: '2px solid rgba(16,185,129,0.3)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 32,
      marginBottom: 24,
    },
    h1: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 'clamp(28px, 5vw, 48px)',
      fontWeight: 700,
      marginBottom: 12,
      letterSpacing: '-0.02em',
    },
    sub: {
      fontSize: 17,
      color: '#8B95A8',
      maxWidth: 480,
      lineHeight: 1.6,
      marginBottom: 48,
    },
    card: {
      background: '#0E1628',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '32px',
      maxWidth: 520,
      width: '100%',
      marginBottom: 24,
      textAlign: 'left',
    },
    stepRow: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
      padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    stepNum: {
      width: 28, height: 28,
      background: '#2D6FFF',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700,
      flexShrink: 0,
      marginTop: 1,
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: '#2D6FFF',
      color: '#fff',
      padding: '14px 28px',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      marginBottom: 16,
    },
  }

  const PLAN_FEATURES = {
    individual: [
      '1 person, unlimited prompts protected',
      'ChatGPT, Claude, Gemini, Copilot, Perplexity',
      'Real-time PII and token detection',
      'Risk scoring on every prompt',
      'Full audit log — exportable anytime',
      'GitHub tokens, AWS keys, SSNs, emails and more',
    ],
    team: [
      'Up to 10 seats — one bill',
      'Everything in the Individual plan',
      'Shared protection rules across your team',
      'Admin dashboard with team-wide audit log',
      'Slack alerts for high-risk events',
      'Priority support',
    ],
  }

  return (
    <div style={s.page}>
      <div style={s.badge}>🛡</div>

      <h1 style={s.h1}>You're protected.</h1>
      <p style={s.sub}>
        Your 14-day free trial has started. No charge until{' '}
        {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
        Cancel anytime before then.
      </p>

      {/* Plan summary */}
      <div style={s.card}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.07em', color: '#2D6FFF', marginBottom: 12 }}>
          YOUR PLAN — {plan === 'team' ? 'TEAM · $49/MO' : 'INDIVIDUAL · $12/MO'}
        </div>
        {PLAN_FEATURES[plan].map(f => (
          <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#8B95A8', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: '#10B981', fontWeight: 600, flexShrink: 0 }}>✓</span>
            {f}
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div style={s.card}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.07em', color: '#8B95A8', marginBottom: 4 }}>
          NEXT STEPS
        </div>
        {[
          { title: 'Install GC Protect in Chrome', desc: 'Click below to add the extension. Takes 30 seconds.' },
          { title: 'Open ChatGPT or Claude', desc: 'GC Protect activates automatically on supported AI platforms.' },
          { title: 'Paste any text with sensitive info', desc: 'Watch GC Protect catch it before it sends. Try it with a name and email.' },
          plan === 'team'
            ? { title: 'Invite your team', desc: 'Share the extension link with up to 9 teammates. One subscription covers everyone.' }
            : { title: 'Check your audit log', desc: 'Click the extension icon anytime to see what\'s been protected.' },
        ].map((step, i) => (
          <div key={i} style={{ ...s.stepRow, ...(i === 3 ? { borderBottom: 'none' } : {}) }}>
            <div style={s.stepNum}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#8B95A8' }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://chrome.google.com/webstore/YOUR_EXTENSION_ID"
        style={s.btn}
      >
        🛡 Install GC Protect — Chrome
      </a>

      <a href="/dashboard" style={{ fontSize: 14, color: '#2D6FFF', textDecoration: 'none' }}>
        Go to my dashboard →
      </a>
    </div>
  )
}