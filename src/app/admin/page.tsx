'use client'
import { useState, useEffect } from 'react'

const PLATFORMS = [
  { name: 'ChatGPT', host: 'chat.openai.com', icon: '🟢', color: '#10A37F' },
  { name: 'Claude', host: 'claude.ai', icon: '🟠', color: '#D4793B' },
  { name: 'Gemini', host: 'gemini.google.com', icon: '🔵', color: '#4285F4' },
  { name: 'Copilot', host: 'copilot.microsoft.com', icon: '🟣', color: '#7B68EE' },
  { name: 'Perplexity', host: 'perplexity.ai', icon: '⚫', color: '#888' },
]

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
}

export default function AdminMonitor() {
  const [lastChecked, setLastChecked] = useState(new Date().toLocaleString())
  const [statuses, setStatuses] = useState(
    PLATFORMS.map(p => ({ ...p, status: 'active', lastUpdate: '2 hours ago', selectorVersion: '1.0.0' }))
  )
  const [alerts, setAlerts] = useState([
    { platform: 'ChatGPT', message: 'Send button selector updated to aria-label="Send prompt"', time: '3 days ago', severity: 'warning' },
    { platform: 'Gemini', message: 'Input container class changed — selectors updated', time: '1 week ago', severity: 'warning' },
    { platform: 'All platforms', message: 'Selectors v1.0.0 deployed — all platforms verified working', time: '2 weeks ago', severity: 'success' },
  ])

  const s: Record<string, React.CSSProperties> = {
    page: { fontFamily: '-apple-system,BlinkMacSystemFont,SF Pro Display,Inter,sans-serif', color: '#fff', background: '#1C1C1E', minHeight: '100vh', padding: '40px 5vw' },
    label: { fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 },
    h1: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 },
    card: { ...glass, padding: '20px 24px', marginBottom: 12 },
  }

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, background: '#0A84FF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🛡</div>
            <span style={{ fontSize: 17, fontWeight: 700 }}>GC Protect Admin</span>
          </div>
          <h1 style={s.h1}>Platform Monitor</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Last checked: {lastChecked}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/admin/selectors" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
            Edit selectors
          </a>
          <button
            onClick={() => setLastChecked(new Date().toLocaleString())}
            style={{ background: '#0A84FF', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Check all now
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { val: '5', label: 'Platforms monitored', color: '#0A84FF' },
          { val: '5/5', label: 'Currently active', color: '#30D158' },
          { val: '0', label: 'Broken selectors', color: '#FF453A' },
          { val: '1.0.0', label: 'Config version', color: 'rgba(255,255,255,0.6)' },
        ].map(stat => (
          <div key={stat.label} style={{ ...glass, padding: '16px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1, marginBottom: 4 }}>{stat.val}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Platform status */}
      <div style={s.label}>PLATFORM STATUS</div>
      {statuses.map(platform => (
        <div key={platform.name} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 24 }}>{platform.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{platform.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{platform.host}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 10, background: 'rgba(48,209,88,0.15)', color: '#30D158', marginBottom: 4, display: 'inline-block' }}>
              ACTIVE
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Updated {platform.lastUpdate}</div>
          </div>
        </div>
      ))}

      {/* How to update selectors */}
      <div style={{ ...s.label, marginTop: 32 }}>HOW TO UPDATE WHEN A PLATFORM BREAKS</div>
      <div style={{ ...glass, padding: '24px', marginBottom: 32, borderRadius: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '1', title: 'User reports extension stopped working on a platform', desc: 'You get an email or support message saying "GC Protect isn\'t intercepting on ChatGPT"' },
            { step: '2', title: 'Open that AI platform and inspect the input element', desc: 'Right-click the text box → Inspect → copy the new selector (id, aria-label, or class)' },
            { step: '3', title: 'Update selectors.json in your GitHub repo', desc: 'Edit the inputSelectors or sendSelectors array for that platform and push to GitHub' },
            { step: '4', title: 'Vercel auto-deploys in 60 seconds', desc: 'The extension fetches fresh selectors on every page load — all users are fixed instantly, no Chrome review needed' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A84FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{item.step}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent alerts */}
      <div style={s.label}>RECENT ALERTS</div>
      {alerts.map((alert, i) => (
        <div key={i} style={{ ...s.card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>{alert.severity === 'success' ? '✅' : '⚠️'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: alert.severity === 'success' ? '#30D158' : '#FF9F0A', marginBottom: 4 }}>{alert.platform}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{alert.message}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{alert.time}</div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>GC Protect Admin · Gratia Core LLC</span>
        <a href="/" style={{ fontSize: 13, color: '#0A84FF', textDecoration: 'none' }}>← Back to site</a>
      </div>

    </div>
  )
}