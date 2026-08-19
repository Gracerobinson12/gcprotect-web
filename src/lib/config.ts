// ── GC Protect Config ─────────────────────────────────
// Change these values to update trial length, promo codes, pricing etc.

export const CONFIG = {
  // Trial length in days — change this one number to adjust for everyone
  TRIAL_DAYS: 7,

  // Promo codes for first users — add codes here, remove when expired
  PROMO_CODES: [
    { code: 'GCPROTECT20', description: 'First 20 users — extended 60 day trial', extraDays: 30 },
    { code: 'EARLYBIRD',   description: 'Early access — extended 45 day trial',   extraDays: 15 },
  ],

  // Stripe payment link
  STRIPE_INDIVIDUAL: 'https://buy.stripe.com/test_dRm8wR5QQ7zd38K5DA5wI00',

  // Extension download
  DOWNLOAD_URL: '/GCProtect-v2.zip',

  // Pricing
  MONTHLY_PRICE: 12,
  YEARLY_PRICE: 99,
}