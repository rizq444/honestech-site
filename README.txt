
HONESTECH findings fix — 2025-11-11

What changed
1) Standardized all nav buttons to "Book" everywhere.
2) Removed the broken "Admin" link from the navigation on /app/. Added /app/admin.html placeholder (not linked) to avoid 404s.
3) Added Ocean County to /locations.html in the same style as Middlesex/Monmouth.
4) Unified Stripe fee wording across /pay.html and /terms.html:
   "Note: Stripe card payments include a 3% processing fee."
5) Ensured all "Call" links use tel:+17329373734 consistently.
6) Added defensive hamburger script so the panel closes automatically after clicking a link (fixes the 'stays open' behavior).

How to deploy
- Back up your current pages.
- Replace the corresponding files with these:
  /index.html, /about.html, /services.html, /locations.html, /blogs.html, /terms.html, /pay.html
  /app/index.html, /app/admin.html
  /styles.css (optional if you prefer your existing style; this one enforces yellow buttons/nav)
- Verify links on mobile and desktop.

Rollback
- If any style conflicts, keep your original styles.css and only copy the HTML files.
