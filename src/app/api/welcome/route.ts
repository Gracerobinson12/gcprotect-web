import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email) return NextResponse.json({ error: 'No email' }, { status: 400 })

    // Use Supabase to send a custom email
    // For now we log it — connect to Resend or SendGrid later
    console.log(`Welcome email triggered for ${email}`)

    // TODO: Connect to Resend.com for transactional emails
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'GC Protect <intel@gratiacore.com>',
    //   to: email,
    //   subject: 'Welcome to GC Protect 🛡',
    //   html: welcomeEmailHtml(name),
    // })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function welcomeEmailHtml(name: string) {
  const firstName = name?.split(' ')[0] || 'there'
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f7;">
<div style="max-width:560px;margin:40px auto;background:#1C1C1E;border-radius:16px;overflow:hidden;">

  <div style="background:#0A84FF;padding:32px;text-align:center;">
    <div style="font-size:48px;margin-bottom:8px;">🛡</div>
    <div style="font-size:24px;font-weight:700;color:#fff;">Welcome to GC Protect</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:4px;">by Gratia Core</div>
  </div>

  <div style="padding:36px;">
    <h1 style="font-size:22px;font-weight:700;color:#fff;margin-bottom:12px;">
      Hey ${firstName} 👋
    </h1>
    <p style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:24px;">
      Your GC Protect account is active and your 7-day free trial has started. 
      You won't be charged until day 7 — and you can cancel anytime before then.
    </p>

    <div style="background:rgba(10,132,255,0.1);border:1px solid rgba(10,132,255,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:600;color:#0A84FF;margin-bottom:12px;letter-spacing:.05em;">GETTING STARTED — 3 STEPS</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.8);line-height:2;">
        1️⃣ Download GC Protect V2 from your dashboard<br/>
        2️⃣ Load it in Chrome (takes 2 minutes)<br/>
        3️⃣ Open ChatGPT or Claude and paste any text with client data
      </div>
    </div>

    <a href="https://www.gcprotect.tech/dashboard" 
       style="display:block;background:#0A84FF;color:#fff;text-align:center;padding:15px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;margin-bottom:24px;">
      Go to my dashboard →
    </a>

    <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;">
      Questions? Just reply to this email or reach us at 
      <a href="mailto:intel@gratiacore.com" style="color:#0A84FF;">intel@gratiacore.com</a>.
      We read every message.
    </p>
  </div>

  <div style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;">
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0;">
      GC Protect by Gratia Core LLC
    </p>
    <div style="display:flex;gap:16px;">
      <a href="https://www.gcprotect.tech/privacy" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;">Privacy</a>
      <a href="https://www.gcprotect.tech/terms" style="font-size:12px;color:rgba(255,255,255,0.3);text-decoration:none;">Terms</a>
    </div>
  </div>

</div>
</body>
</html>`
}