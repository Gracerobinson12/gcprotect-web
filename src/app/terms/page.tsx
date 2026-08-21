export default function Terms() {
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
        Terms of Service
      </h1>
      <p style={{ ...p, fontSize: 13 }}>Last updated: July 2025 · Gratia Core LLC</p>

      <h2 style={h2}>Acceptance of terms</h2>
      <p style={p}>By installing or using GC Protect, you agree to these terms. If you do not agree, do not use the product.</p>

      <h2 style={h2}>Description of service</h2>
      <p style={p}>GC Protect is a browser extension that helps detect and anonymize sensitive data before it is submitted to AI platforms. It is a protective tool — not a guarantee of complete data security.</p>

      <h2 style={h2}>Subscription and billing</h2>
      <p style={p}>GC Protect offers a 14-day free trial. Your card is saved at signup but not charged until the trial ends. After 14 days your subscription begins automatically at the plan rate you selected. You may cancel at any time before the trial ends to avoid being charged. Refunds are handled on a case-by-case basis — contact support within 7 days of a charge.</p>

      <h2 style={h2}>Acceptable use</h2>
      <p style={p}>You may not use GC Protect for any unlawful purpose, to circumvent security systems, or in ways that violate any third party's rights. You are responsible for how your team uses the product.</p>

      <h2 style={h2}>Disclaimer of warranties</h2>
      <p style={p}>GC Protect is provided "as is." While we work hard to maintain accuracy of our detection engine, we cannot guarantee that all sensitive data will be detected in all cases. You should not rely solely on GC Protect as your only data protection measure.</p>

      <h2 style={h2}>Limitation of liability</h2>
      <p style={p}>Gratia Core LLC's liability to you for any claim arising from use of GC Protect is limited to the amount you paid us in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>

      <h2 style={h2}>Changes to terms</h2>
      <p style={p}>We may update these terms. Continued use of GC Protect after changes constitutes acceptance of the new terms.</p>

      <h2 style={h2}>Governing law</h2>
      <p style={p}>These terms are governed by the laws of the State of Georgia, United States.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions? Email <a href="mailto:intel@gratiacore.com" style={{ color: '#2D6FFF' }}>intel@gratiacore.com</a></p>
    </div>
  )
}