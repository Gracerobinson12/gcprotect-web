import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GC Protect — AI Data Protection for Businesses',
  description: 'Protect sensitive client and customer data before it reaches ChatGPT, Claude, Gemini, or Copilot.',
  metadataBase: new URL('https://gcprotect.online'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}