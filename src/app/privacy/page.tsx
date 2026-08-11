export default function Privacy() {
  const s: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    background: '#080D1A',
    color: '#E8E8E8',
    minHeight: '100vh',
    padding: '60px 5vw',
    maxWidth: 720,
    margin: '0 auto',
    lineHeight: 1.7,
  }
  const h2: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 22, fontWeight: 600,
    marginTop: 40, marginBottom: 12,
    color: '#fff',
  }
  const p: React.CSSProperties = { color: '#8B95A8', marginBottom: 16, fontSize: 15 }

  return (
    <div style={s}>
      <a href="/" style={{ color: '#2D6FFF', textDecoration: 'none', fontSize: 14 }}>← Back to GC Protect</a>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, marginTop: 32, marginBottom: 8, color: '#fff' }}>
        Privacy Policy
      </h1>
      <p style={{ ...p, fontSize: 13 }}>Last updated: July 2025 · Gratia Core LLC</p>

      <h2 style={h2}>What GC Protect does</h2>
      <p style={p}>GC Protect is a browser extension that detects sensitive information in text before it is submitted to AI platforms including ChatGPT, Claude, Gemini, and Microsoft Copilot. It replaces detected sensitive data with anonymous tokens and logs metadata about each protection event.</p>

      <h2 style={h2}>What data we collect</h2>
      <p style={p}><strong style={{ color: '#fff' }}>We do NOT collect, transmit, or store the original sensitive content of your prompts.</strong> GC Protect processes all text locally in your browser. The original content of your prompts never leaves your device or is sent to any Gratia Core server.</p>
      <p style={p}>The audit log stored locally in your browser contains: date and time of each protection event, which AI platform was used, the risk score assigned, which categories of sensitive data were detected (e.g. "SSN", "Email" — not the actual values), and the action taken (protected, cancelled, or sent unprotected). This data is stored only on your device using Chrome's local storage API.</p>
      <p style={p}>If you choose to export the audit log, it is downloaded directly to your device. Gratia Core does not receive a copy.</p>

      <h2 style={h2}>Subscription and payment data</h2>
      <p style={p}>Payments are processed by Stripe. When you subscribe, Stripe collects your payment information. Gratia Core receives confirmation of your subscription status but does not store your full card details. Stripe's privacy policy governs how your payment data is handled.</p>

      <h2 style={h2}>Permissions used</h2>
      <p style={p}><strong style={{ color: '#fff' }}>storage</strong> — to save your audit log locally on your device.<br />
      <strong style={{ color: '#fff' }}>activeTab</strong> — to detect which AI platform you are currently using.<br />
      <strong style={{ color: '#fff' }}>scripting</strong> — to inject the protection layer into supported AI websites.<br />
      <strong style={{ color: '#fff' }}>tabs</strong> — to update the extension badge when switching between tabs.<br />
      <strong style={{ color: '#fff' }}>host_permissions</strong> — limited to chat.openai.com, claude.ai, gemini.google.com, copilot.microsoft.com, and perplexity.ai only.</p>

      <h2 style={h2}>Third party services</h2>
      <p style={p}>GC Protect does not send your prompt content to any third party service. The extension operates entirely locally in your browser.</p>

      <h2 style={h2}>Children's privacy</h2>
      <p style={p}>GC Protect is intended for business use and is not directed at children under 13. We do not knowingly collect data from children.</p>

      <h2 style={h2}>Changes to this policy</h2>
      <p style={p}>We may update this policy as the product evolves. We will update the "Last updated" date at the top of this page when changes are made.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions? Email us at <a href="mailto:privacy@gratiacore.com" style={{ color: '#2D6FFF' }}>privacy@gratiacore.com</a></p>
    </div>
  )
}