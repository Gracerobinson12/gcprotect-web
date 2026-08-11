'use client'
import { useState } from 'react'

// Plan feature definitions
const PLANS = {
  individual: {
    name: 'Individual',
    price: '$12/mo',
    color: '#2D6FFF',
    features: [
      { icon: '🛡', label: 'Protection', value: 'Unlimited prompts' },
      { icon: '🤖', label: 'AI Platforms', value: 'ChatGPT, Claude, Gemini, Copilot, Perplexity' },
      { icon: '🔍', label: 'Detection', value: '13+ data types including SSN, emails, API keys, GitHub tokens' },
      { icon: '📊', label: 'Risk scoring', value: 'Every prompt scored 0–100' },
      { icon: '📋', label: 'Audit log', value: 'Full history, CSV export' },
      { icon: '👤', label: 'Seats', value: '1 person' },
    ],
    notIncluded: [
      'Shared team rules',
      'Admin dashboard',
      'Slack alerts',
      'Priority support',
    ],
  },
  team: {
    name: 'Team',
    price: '$49/mo',
    color: '#10B981',
    features: [
      { icon: '🛡', label: 'Protection', value: 'Unlimited prompts for whole team' },
      { icon: '🤖', label: 'AI Platforms', value: 'ChatGPT, Claude, Gemini, Copilot, Perplexity' },
      { icon: '🔍', label: 'Detection', value: '13+ data types including SSN, emails, API keys, GitHub tokens' },
      { icon: '📊', label: 'Risk scoring', value: 'Every prompt scored 0–100' },
      { icon: '📋', label: 'Audit log', value: 'Team-wide history, CSV export' },
      { icon: '👥', label: 'Seats', value: 'Up to 10 people — one bill' },
      { icon: '⚙️', label: 'Shared rules', value: 'Admin sets protection policies for whole team' },
      { icon: '📱', label: 'Slack alerts', value: 'High-risk events sent to your Slack channel' },
      { icon: '🎯', label: 'Support', value: 'Priority email support' },
    ],
    notIncluded: [],
  },
}

// Mock stats — replace with real data from Supabase later
const MOCK_STATS = {
  totalProtected: 0,
  totalEntities: 0,
  criticalBlocked: 0,
  lastActive: 'Never — install the extension to get started',
}

export default function Dashboard() {
  const [activePlan] = useState<'individual' | 'team'>('individual')
  const plan = PLANS[activePlan]

  const s: Record<string, React.CSSProperties> = {
    page: {
      fontFamily: "'Inter', sans-serif",
      background: '#080D1A',
      color: '#E8E8E8',
      minHeight: '100vh',
    },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5vw', height: 64,
      background: 'rgba(8,13,26,0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky' as const, top: 0, zIndex: 100,
    },
    brand: {
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, fontSize: 16, color: '#fff',
      textDecoration: 'none',
    },
    logo: {
      width: 30, height: 30,
      background: 'linear-gradient(135deg, #2D6FFF, #1A57E8)',
      borderRadius: 7,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 15,
    },
    main: {
      maxWidth: 900,
      margin: '0 auto',
      padding: '40px 5vw',
    },
    sectionLabel: {
      fontSize: 11, fontWeight: 600,
      letterSpacing: '.07em', color: '#555',
      marginBottom: 12,
    },
    card: {
      background: '#0E1628',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 16,
    },
    statCard: {
      background: '#0E1628',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: '20px',
      flex: 1,
    },
    statVal: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 32, fontWeight: 700,
      lineHeight: 1, marginBottom: 4,
    },
    statLabel: {
      fontSize: 12, color: '#555',
    },
    installBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#2D6FFF', color: '#fff',
      padding: '12px 24px', borderRadius: 9,
      fontSize: 14, fontWeight: 600,
      textDecoration: 'none', border: 'none',
      cursor: 'pointer', fontFamily: 'inherit',
    },
    featureRow: {
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      fontSize: 14,
    },
  }

  return (
    <div style={s.page}>

      {/* Nav */}
      <nav style={s.nav}>
        <a href="/" style={s.brand}>
          <div style={s.logo}>🛡</div>
          GC Protect
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontSize: 11, fontWeight: 600,
            padding: '3px 10px', borderRadius: 10,
            background: `${plan.color}20`,
            color: plan.color,
            border: `1px solid ${plan.color}40`,
          }}>
            {plan.name} Plan
          </span>
          <a href="mailto:hello@gratiacore.com" style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}>
            Support
          </a>
        </div>
      </nav>

      <div style={s.main}>

        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Your Dashboard
          </h1>
          <p style={{ fontSize: 15, color: '#8B95A8', margin: 0 }}>
            Install the extension to start protecting your AI prompts.
          </p>
        </div>

        {/* Install CTA — shown until extension is installed */}
        <div style={{ ...s.card, border: '1.5px solid #2D6FFF', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>🛡 Install GC Protect Extension</div>
            <div style={{ fontSize: 13, color: '#8B95A8' }}>Takes 30 seconds. Works immediately on ChatGPT, Claude, Gemini, and Copilot.</div>
          </div>
          <a
            href="https://chrome.google.com/webstore/YOUR_EXTENSION_ID"
            style={s.installBtn}
          >
            Add to Chrome — Free
          </a>
        </div>

        {/* Stats */}
        <div style={s.sectionLabel}>YOUR PROTECTION STATS</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' as const }}>
          {[
            { val: MOCK_STATS.totalProtected, label: 'Prompts protected', color: '#10B981' },
            { val: MOCK_STATS.totalEntities, label: 'Data fields secured', color: '#E8E8E8' },
            { val: MOCK_STATS.criticalBlocked, label: 'Critical risks blocked', color: '#EF4444' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Plan details */}
        <div style={s.sectionLabel}>YOUR PLAN — {plan.name.toUpperCase()} · {plan.price}</div>
        <div style={s.card}>
          {plan.features.map((f, i) => (
            <div key={f.label} style={{ ...s.featureRow, ...(i === plan.features.length - 1 ? { borderBottom: 'none' } : {}) }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 2 }}>{f.label.toUpperCase()}</div>
                <div style={{ fontSize: 14, color: '#ccc' }}>{f.value}</div>
              </div>
            </div>
          ))}

          {plan.notIncluded.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', color: '#333', margin: '16px 0 8px' }}>
                NOT INCLUDED — UPGRADE TO TEAM
              </div>
              {plan.notIncluded.map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#333', padding: '5px 0' }}>
                  <span>✕</span>{f}
                </div>
              ))}
              <a
                href="https://buy.stripe.com/test_00w6oJbbag5J7p09TQ5wI01"
                style={{ display: 'inline-flex', marginTop: 16, padding: '9px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Upgrade to Team — $49/mo
              </a>
            </>
          )}
        </div>

        {/* How to use */}
        <div style={s.sectionLabel}>HOW TO USE GC PROTECT</div>
        <div style={s.card}>
          {[
            { step: '1', title: 'Open any AI tool', desc: 'Go to ChatGPT, Claude, Gemini, Copilot, or Perplexity. GC Protect activates automatically.' },
            { step: '2', title: 'Type or paste your prompt', desc: 'Include whatever information you need — customer names, emails, financial data, anything.' },
            { step: '3', title: 'GC Protect intercepts', desc: 'Before it sends, you\'ll see a popup with a risk score and list of sensitive data detected.' },
            { step: '4', title: 'Click Protect & Send', desc: 'Sensitive data is replaced with GC tokens. The AI answers using tokens. Your client\'s identity never leaves your computer.' },
            { step: '5', title: 'Check your audit log', desc: 'Click the GC Protect icon in your browser toolbar anytime to see everything that\'s been protected.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2D6FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#8B95A8', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Support */}
        <div style={{ ...s.card, textAlign: 'center' as const, background: 'transparent', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>Questions? We're here.</div>
          <a href="mailto:hello@gratiacore.com" style={{ color: '#2D6FFF', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            hello@gratiacore.com
          </a>
        </div>

      </div>
    </div>
  )
}