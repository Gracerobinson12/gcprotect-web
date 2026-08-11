'use client'
import { useState } from 'react'

const LINKS = {
  individual: 'https://buy.stripe.com/test_dRm8wR5QQ7zd38K5DA5wI00',
  team: 'https://buy.stripe.com/test_00w6oJbbag5J7p09TQ5wI01',
}

const DEMO_PATTERNS = [
  { type: 'SSN', label: 'Social Security Number', regex: /\b\d{3}-\d{2}-\d{4}\b/g, sev: 'critical', color: '#FF453A' },
  { type: 'EMAIL', label: 'Email Address', regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, sev: 'high', color: '#FF9F0A' },
  { type: 'SALARY', label: 'Salary / Payroll', regex: /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, sev: 'medium', color: '#FFD60A' },
  { type: 'GITHUB', label: 'GitHub Token', regex: /\b(ghp|gho|ghs)_[A-Za-z0-9]{20,}\b/g, sev: 'critical', color: '#FF453A' },
  { type: 'AWS', label: 'AWS Access Key', regex: /\b(AKIA|ASIA)[A-Z0-9]{16}\b/g, sev: 'critical', color: '#FF453A' },
  { type: 'PHONE', label: 'Phone Number', regex: /\b\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}\b/g, sev: 'high', color: '#FF9F0A' },
  { type: 'NAME', label: 'Person Name', regex: /\b([A-Z][a-z]{1,20})\s+([A-Z][a-z]{1,20})\b/g, sev: 'high', color: '#FF9F0A' },
]

const EXCLUDE = new Set(['ChatGPT','Google','Microsoft','Claude','OpenAI','Monday','Tuesday','Wednesday','Thursday','Friday','January','February','March','April','June','July','August','September','October','November','December'])
const TOKEN_PREFIX: Record<string,string> = { SSN:'GC-ID', EMAIL:'GC-EM', SALARY:'GC-SAL', GITHUB:'GC-GH', AWS:'GC-AWS', PHONE:'GC-PH', NAME:'GC-C' }

function tok(type: string) {
  return (TOKEN_PREFIX[type]||'GC-X') + Math.random().toString(36).substring(2,7).toUpperCase()
}

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
    protectedText = protectedText.split(val).join(`\x00${token}\x00`)
  }
  const total = Object.values(found).reduce((s,f) => s+f.count, 0)
  return { found: Object.values(found), protectedText, score: Math.min(total*18,100) }
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20,
      ...style,
    }}>
      {children}
    </div>
  )
}

function LiveDemo() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ReturnType<typeof runScan>|null>(null)

  const scoreColor = result
    ? result.score >= 70 ? '#FF453A' : result.score >= 40 ? '#FF9F0A' : '#FFD60A'
    : '#0A84FF'

  return (
    <GlassCard style={{ width: '100%', maxWidth: 680, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)' }}>
        {['#FF453A','#FFD60A','#30D158'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'SF Mono, monospace' }}>GC Protect — Live Demo</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>PASTE ANY TEXT BELOW</div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'Try: Jane Doe, SSN: 123-45-6789\nEmail: jane@company.com, Salary: $82,000\nGitHub: ghp_abc123def456ghi789'}
          style={{
            width: '100%', minHeight: 88,
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: 12,
            color: '#fff', fontSize: 13, lineHeight: 1.6,
            resize: 'none', outline: 'none',
            fontFamily: 'SF Mono, JetBrains Mono, monospace',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 10px' }}>
          <button onClick={() => input.trim() && setResult(runScan(input))} style={{
            background: '#0A84FF', color: '#fff', border: 'none',
            borderRadius: 10, padding: '9px 18px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Scan & Protect
          </button>
          {result && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}>
              {result.score >= 70 ? 'CRITICAL' : result.score >= 40 ? 'HIGH' : 'MEDIUM'} · {result.score}/100
            </span>
          )}
          <button onClick={() => { setInput(''); setResult(null) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', marginLeft: 'auto', fontFamily: 'inherit' }}>
            Reset
          </button>
        </div>

        {result && result.found.length === 0 && (
          <div style={{ fontSize: 13, color: '#30D158', padding: '8px 0' }}>✓ No sensitive data found</div>
        )}

        {result && result.found.length > 0 && (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>DETECTED</div>
              {result.found.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'rgba(255,255,255,0.8)' }}>{f.label}</span>
                  <span style={{ fontWeight: 600, color: f.color }}>{f.count}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', color: '#30D158', marginBottom: 8 }}>PROTECTED — SAFE FOR AI</div>
            <div style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)', borderRadius: 12, padding: 14, fontFamily: 'SF Mono, JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all' as const }}>
              {result.protectedText.split('\x00').map((part, i) =>
                i % 2 === 1
                  ? <span key={i} style={{ background: 'rgba(48,209,88,0.2)', color: '#30D158', padding: '1px 5px', borderRadius: 5, fontWeight: 600 }}>{part}</span>
                  : <span key={i}>{part.split('\n').map((line, j, arr) => <span key={j}>{line}{j < arr.length-1 && <br/>}</span>)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </GlassCard>
  )
}

export default function Home() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, Inter, sans-serif', color: '#fff', background: '#1C1C1E', minHeight: '100vh' }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, left: '30%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -100, right: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(48,209,88,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5vw', height: 64, background: 'rgba(28,28,30,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: 17 }}>
          <div style={{ width: 32, height: 32, background: '#0A84FF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🛡</div>
          GC Protect
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="#how" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 15 }}>How it works</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 15 }}>Pricing</a>
          <a href={LINKS.individual} style={{ background: '#0A84FF', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Get started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 5vw 60px', textAlign: 'center' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(10,132,255,0.15)', border: '1px solid rgba(10,132,255,0.3)', color: '#0A84FF', fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 20, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, background: '#0A84FF', borderRadius: '50%' }} />
          Real-time AI data protection
        </div>

        <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 820 }}>
          Your team is sending<br />
          <span style={{ color: '#FF453A' }}>real client data</span> to AI.<br />
          GC Protect stops that.
        </h1>

        <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.6)', maxWidth: 520, marginBottom: 40, lineHeight: 1.6 }}>
          Sits between your employees and ChatGPT, Claude, Gemini, and Copilot. Before any prompt goes out, sensitive data is replaced with secure tokens. The AI works. Your clients stay protected.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          <a href={LINKS.individual} style={{ background: '#0A84FF', color: '#fff', padding: '15px 32px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
            Start free trial
          </a>
          <a href="#how" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '15px 32px', borderRadius: 14, fontSize: 16, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
            See how it works
          </a>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 56 }}>
          Card saved · Charged after 14 days · Cancel anytime
        </p>

        <LiveDemo />
      </section>

      {/* STATS */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          { num: '13+', label: 'Data types detected' },
          { num: '5', label: 'AI platforms protected' },
          { num: '<1s', label: 'Time to scan and protect' },
        ].map((s, i) => (
          <div key={s.num} style={{ flex: 1, maxWidth: 240, padding: '32px 20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#0A84FF', letterSpacing: '-0.02em', marginBottom: 6 }}>{s.num}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ position: 'relative', zIndex: 1, padding: '100px 5vw' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: '#0A84FF', marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.15 }}>
            Your team uses AI exactly<br />the same way. Just safely.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginBottom: 56, lineHeight: 1.6, maxWidth: 520 }}>
            GC Protect runs invisibly in the background. The full round trip — from prompt to answer — with your client's identity never leaving your building.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              { icon: '✍️', title: 'Employee pastes customer data into AI', desc: 'Normal workflow — they type their question and paste in customer info to get AI help.', bad: 'Customer: Jane Doe\nSSN: 123-45-6789\nEmail: jane@company.com' },
              { icon: '🛡️', title: 'GC Protect intercepts before it sends', desc: 'In under a second, real identities are swapped for secure GC tokens.', good: 'Customer: GC-C8F2A\nSSN: GC-ID9F83\nEmail: GC-EMB291' },
              { icon: '🤖', title: 'AI answers perfectly using tokens', desc: "ChatGPT or Claude receives the protected version and answers fully. The AI doesn't need real names to do its job.", good: '"GC-C8F2A placed an order last Tuesday. Here\'s a draft email..."' },
              { icon: '✅', title: 'Employee sees real names restored', desc: 'GC Protect swaps tokens back before they read it. They see "Jane Doe" — not a token. Completely invisible.', good: '"Dear Jane Doe, thank you for your order..."' },
              { icon: '📋', title: 'Everything logged automatically', desc: 'Date, platform, risk score, what was protected — recorded without anyone doing anything.', bad: null },
            ].map((step, i) => (
              <GlassCard key={i} style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start', borderRadius: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{step.title}</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0, marginBottom: (step.bad || step.good) ? 12 : 0 }}>{step.desc}</p>
                  {step.bad && (
                    <div style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)', borderRadius: 10, padding: '10px 14px', fontFamily: 'SF Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {step.bad}
                    </div>
                  )}
                  {step.good && (
                    <div style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.2)', borderRadius: 10, padding: '10px 14px', fontFamily: 'SF Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {step.good}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 5vw', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: '#0A84FF', marginBottom: 16 }}>WHO IT'S FOR</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 56, lineHeight: 1.15 }}>
            Built for businesses that handle<br />other people's information.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { icon: '⚖️', title: 'Law firms', desc: 'Client names and case details stay out of AI. Attorney-client privilege protected.' },
              { icon: '🏥', title: 'Healthcare', desc: 'Patient names and medical info tokenized before any AI interaction. HIPAA supported.' },
              { icon: '📊', title: 'Accounting firms', desc: 'SSNs, salaries, and tax info never reach cloud AI. Your clients trust you with their most sensitive data.' },
              { icon: '🏠', title: 'Real estate', desc: 'Buyer and seller info protected across every AI tool your team uses.' },
              { icon: '💼', title: 'Financial advisors', desc: 'Client portfolio data and account numbers stay inside your firm — not inside ChatGPT.' },
              { icon: '💻', title: 'Dev teams', desc: 'GitHub tokens, API keys, database strings, and source code caught before they reach AI.' },
            ].map(a => (
              <GlassCard key={a.title} style={{ padding: 24, borderRadius: 18 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{a.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{a.title}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{a.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '100px 5vw' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: '#0A84FF', marginBottom: 16 }}>PRICING</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.15 }}>One decision.</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginBottom: 48, lineHeight: 1.6 }}>
            14-day free trial. Card required — charged after 14 days. Cancel anytime.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <GlassCard style={{ padding: '28px 24px', borderRadius: 20, position: 'relative' as const }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Just me</div>
              <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>$12</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>per month · or $99/yr</div>
              {['1 person, unlimited prompts', 'ChatGPT, Claude, Gemini, Copilot', 'Real-time PII and token detection', 'Risk scoring on every prompt', 'Full audit log'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#30D158', flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
              <a href={LINKS.individual} style={{ display: 'block', marginTop: 20, padding: 12, borderRadius: 12, textAlign: 'center', fontSize: 15, fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                Start free trial
              </a>
            </GlassCard>

            <GlassCard style={{ padding: '28px 24px', borderRadius: 20, position: 'relative' as const, border: '1.5px solid rgba(10,132,255,0.5)', background: 'rgba(10,132,255,0.08)' }}>
              <div style={{ position: 'absolute', top: -12, left: 20, background: '#0A84FF', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '.04em' }}>BEST FOR BUSINESSES</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>My team</div>
              <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>$49</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>per month · up to 10 people</div>
              {['Up to 10 seats — one bill', 'Everything in Just me', 'Shared protection rules', 'Admin dashboard', 'Team-wide audit log', 'Slack alerts', 'Priority support'].map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.65)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#30D158', flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
              <a href={LINKS.team} style={{ display: 'block', marginTop: 20, padding: 12, borderRadius: 12, textAlign: 'center', fontSize: 15, fontWeight: 600, textDecoration: 'none', background: '#0A84FF', color: '#fff' }}>
                Start free trial
              </a>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 10 }}>$4.90/person — less than a coffee</p>
            </GlassCard>
          </div>

          <p style={{ marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
            Need more than 10 seats? <a href="mailto:hello@gratiacore.com" style={{ color: '#0A84FF', textDecoration: 'none' }}>Contact us</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 5vw', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.25)', color: '#30D158', fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 20, marginBottom: 28 }}>
          🛡 Protected by GC Protect
        </div>
        <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.15, maxWidth: 600, margin: '0 auto 20px' }}>
          Your clients trusted you.<br />Now protect them.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginBottom: 36 }}>
          Install takes 30 seconds. 14-day free trial.
        </p>
        <a href={LINKS.individual} style={{ display: 'inline-block', background: '#0A84FF', color: '#fff', padding: '16px 40px', borderRadius: 14, fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
          Start your free trial
        </a>
        <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>A Gratia Core product</p>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '32px 5vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>
          <div style={{ width: 26, height: 26, background: '#0A84FF', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🛡</div>
          GC Protect by Gratia Core
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Privacy Policy', '/privacy'], ['Terms', '/terms'], ['Support', 'mailto:hello@gratiacore.com']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>© 2025 Gratia Core LLC</div>
      </footer>

    </div>
  )
}