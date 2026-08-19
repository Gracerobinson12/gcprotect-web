'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
}

export default function InstallGuide() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setAuthed(!!user)
      setChecking(false)
    }
    check()
  }, [])

  function handleDownload(e: React.MouseEvent) {
    if (!authed) {
      e.preventDefault()
      window.location.href = '/signup?next=/install'
    }
    // if authed, the href to /GCProtect-v2.zip fires normally
  }

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,SF Pro Display,Inter,sans-serif', background:'#1C1C1E', color:'#fff', minHeight:'100vh' }}>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', height:64, background:'rgba(28,28,30,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.08)', position:'sticky' as const, top:0, zIndex:100 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:'#fff', fontWeight:700, fontSize:16 }}>
          <div style={{ width:30, height:30, background:'#0A84FF', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🛡</div>
          GC Protect
        </a>
        <a href="/#download" style={{ background:'#0A84FF', color:'#fff', padding:'8px 18px', borderRadius:20, fontSize:14, fontWeight:600, textDecoration:'none' }}>⬇️ Download V2</a>
      </nav>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'60px 5vw' }}>

        <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.4)', textDecoration:'none', fontSize:14, marginBottom:32 }}>← Back</a>

        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(48,209,88,0.12)', border:'1px solid rgba(48,209,88,0.25)', color:'#30D158', fontSize:12, fontWeight:600, padding:'5px 14px', borderRadius:20, marginBottom:20 }}>
          ⏳ Chrome Web Store coming soon — install manually for now
        </div>

        <h1 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:12, lineHeight:1.15 }}>How to install GC Protect<br/>in Chrome manually</h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', marginBottom:48, lineHeight:1.6 }}>Takes under 2 minutes. Works exactly the same as the Chrome Web Store version.</p>

        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>

          {/* Step 1 */}
          <div style={{ ...glass, padding:'28px', borderRadius:18 }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>1</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Download GC Protect V2</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:16 }}>Click the button below to download. Save it somewhere easy to find — your Desktop works great.</p>
                <a
                  href={authed ? '/GCProtect-v2.zip' : '/signup?next=/install'}
                  onClick={handleDownload}
                  style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#30D158', color:'#000', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none' }}>
                  {checking ? '...' : authed ? '⬇️ Download GCProtect-v2.zip' : '🔑 Sign up to download'}
                </a>
                {!authed && !checking && (
                  <div style={{ marginTop:10, fontSize:13, color:'rgba(255,255,255,0.4)' }}>
                    Free account required · 7-day trial · Card charged after trial
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ ...glass, padding:'28px', borderRadius:18 }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>2</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Unzip the downloaded file</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:16 }}>Find <code style={{ background:'rgba(255,255,255,0.1)', padding:'2px 7px', borderRadius:6, fontSize:13 }}>GCProtect-v2.zip</code> and unzip it.</p>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const, marginBottom:14 }}>
                  <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', flex:1, minWidth:180 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>🍎 MAC</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>Double-click the .zip file. A folder called <strong>gc-protect-extension</strong> appears.</div>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', flex:1, minWidth:180 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>🪟 WINDOWS</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>Right-click → "Extract All" → Extract. A folder appears.</div>
                  </div>
                </div>
                <div style={{ background:'rgba(255,159,10,0.08)', border:'1px solid rgba(255,159,10,0.2)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'rgba(255,255,255,0.6)' }}>
                  ⚠️ Keep this folder on your computer permanently — if you delete or move it, the extension stops working.
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ ...glass, padding:'28px', borderRadius:18 }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>3</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Open Chrome Extensions page</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:12 }}>In Chrome, click the address bar, type this exactly, and press Enter:</p>
                <div style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'12px 16px', fontFamily:'monospace', fontSize:15, color:'#0A84FF', letterSpacing:'0.02em', marginBottom:12 }}>
                  chrome://extensions
                </div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>The Extensions page opens. You'll see your installed extensions listed here.</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ ...glass, padding:'28px', borderRadius:18 }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>4</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Turn on Developer Mode</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:14 }}>
                  Look at the <strong style={{ color:'#fff' }}>top right corner</strong> of the Extensions page. Toggle <strong style={{ color:'#fff' }}>"Developer mode"</strong> to ON. It turns blue.
                </p>
                <div style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'14px 16px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:14, color:'rgba(255,255,255,0.7)' }}>Developer mode</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:44, height:24, background:'#30D158', borderRadius:12, position:'relative' as const }}>
                        <div style={{ position:'absolute', right:2, top:2, width:20, height:20, background:'#fff', borderRadius:'50%' }}/>
                      </div>
                      <span style={{ fontSize:12, color:'#30D158', fontWeight:600 }}>ON</span>
                    </div>
                  </div>
                </div>
                <div style={{ background:'rgba(10,132,255,0.08)', border:'1px solid rgba(10,132,255,0.15)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'rgba(255,255,255,0.6)' }}>
                  💡 Developer mode is built into Chrome for exactly this — installing private extensions safely. It does not compromise your security.
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div style={{ ...glass, padding:'28px', borderRadius:18 }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0 }}>5</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Click "Load unpacked"</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:14 }}>Three buttons now appear at the top left. Click <strong style={{ color:'#fff' }}>"Load unpacked"</strong>.</p>
                <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' as const }}>
                  {['Load unpacked','Pack extension','Update'].map((btn,i)=>(
                    <div key={btn} style={{ padding:'8px 14px', borderRadius:8, fontSize:13, fontWeight:600, background:i===0?'#0A84FF':'rgba(255,255,255,0.08)', color:i===0?'#fff':'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)' }}>{btn}</div>
                  ))}
                </div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                  A file picker opens. Navigate to and select the <strong style={{ color:'#fff' }}>gc-protect-extension</strong> folder you unzipped.<br/><br/>
                  <strong style={{ color:'rgba(255,255,255,0.8)' }}>Mac:</strong> Click "Open"<br/>
                  <strong style={{ color:'rgba(255,255,255,0.8)' }}>Windows:</strong> Click "Select Folder"
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 — Done */}
          <div style={{ ...glass, padding:'28px', borderRadius:18, border:'1.5px solid rgba(48,209,88,0.35)', background:'rgba(48,209,88,0.06)' }}>
            <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#30D158', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0, color:'#000' }}>✓</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>You're protected!</div>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:16 }}>
                  The GC Protect 🛡 icon appears in your Chrome toolbar. Don't see it? Click the puzzle piece 🧩 in Chrome's toolbar and pin GC Protect.
                </p>

                <div style={{ background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'16px', marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:10, letterSpacing:'.06em' }}>TEST IT RIGHT NOW</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.8 }}>
                    1. Go to <a href="https://chatgpt.com" target="_blank" rel="noreferrer" style={{ color:'#0A84FF' }}>chatgpt.com</a> or <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{ color:'#0A84FF' }}>claude.ai</a><br/>
                    2. Open a new chat<br/>
                    3. Paste this into the message box:
                  </div>
                  <code style={{ display:'block', background:'rgba(0,0,0,0.3)', padding:'10px 14px', borderRadius:8, marginTop:10, fontSize:12, color:'#30D158', lineHeight:1.6 }}>
                    Jane Doe, SSN: 123-45-6789, Email: jane@company.com, Salary: $82,000
                  </code>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.8, marginTop:10 }}>
                    4. Press Enter<br/>
                    5. GC Protect intercepts it — you'll see the protection overlay ✓
                  </div>
                </div>

                <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
                  <a href="/dashboard" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#0A84FF', color:'#fff', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none' }}>
                    Go to my dashboard →
                  </a>
                  <a href="mailto:hello@gratiacore.com?subject=GC Protect Install Help" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.7)', padding:'11px 22px', borderRadius:10, fontSize:14, fontWeight:500, textDecoration:'none', border:'1px solid rgba(255,255,255,0.1)' }}>
                    Need help?
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ */}
        <div style={{ marginTop:56 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.08em', color:'rgba(255,255,255,0.3)', marginBottom:16 }}>COMMON QUESTIONS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {[
              { q:'Is this safe to install manually?', a:'Yes. Chrome\'s Developer mode is built for exactly this. GC Protect runs entirely on your device — nothing is sent to external servers.' },
              { q:'Why isn\'t it on the Chrome Web Store yet?', a:'We submitted GC Protect for Google\'s review process, which typically takes 3–7 days. We\'ll email you when it\'s live.' },
              { q:'Will I need to reinstall when the store version launches?', a:'No, the manual version works identically. When the store version launches you can switch over, but there\'s no rush.' },
              { q:'What if I move or delete the folder?', a:'Chrome loads the extension directly from that folder. If you move or delete it, the extension will stop working. Keep it where it is.' },
              { q:'Does it work on Microsoft Edge?', a:'Yes — go to edge://extensions and follow the exact same steps. Firefox support is coming soon.' },
              { q:'GC Protect isn\'t intercepting my prompts.', a:'Try: 1) Go to chrome://extensions and click the refresh icon on GC Protect. 2) Open a brand new chat tab. 3) Make sure you\'re logged into the AI platform. Still not working? Email hello@gratiacore.com.' },
            ].map((faq,i)=>(
              <div key={i} style={{ ...glass, padding:'20px 24px', borderRadius:14 }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>{faq.q}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:48, ...glass, padding:'24px', borderRadius:16, textAlign:'center' as const }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Still stuck? We'll help.</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>Response within a few hours.</div>
          <a href="mailto:hello@gratiacore.com?subject=GC Protect Install Help" style={{ color:'#0A84FF', textDecoration:'none', fontSize:14, fontWeight:600 }}>hello@gratiacore.com</a>
        </div>

      </div>

      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'28px 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' as const, gap:12, marginTop:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:600 }}>
          <div style={{ width:24, height:24, background:'#0A84FF', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>🛡</div>
          GC Protect by Gratia Core
        </div>
        <div style={{ display:'flex', gap:20 }}>
          {[['Privacy','/privacy'],['Terms','/terms'],['Support','mailto:hello@gratiacore.com']].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:'rgba(255,255,255,0.35)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>© 2025 Gratia Core LLC</div>
      </footer>

    </div>
  )
}