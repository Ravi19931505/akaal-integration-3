# Akaal Integrated Solutions — Product Requirements Document

## Original Problem Statement
> "Website and app both" — User wants a modernized, classier rebuild of completelywired.com (a system integrator) under a new brand. The new identity:
> - **Brand**: Akaal Integrated Solutions
> - **Owner**: Avtar
> - **Location**: Brampton, ON (serves Greater Toronto Area)
> - **Phone**: 416-918-3601
> - **Email**: TBD (user will provide later)
> - User stated: *"create a website which will look more classy from that one and highlight my brand name"*

## Architecture
- **Frontend**: React 19 + Tailwind CSS 3, single-page marketing site with smooth-scroll sections, IntersectionObserver reveal animations, fully responsive (acts as the "app" on mobile/tablet). React Router routes: `/` marketing site, `/admin` admin console.
- **Backend**: FastAPI + MongoDB (motor async driver), `/api/contact` endpoint to persist inquiries; admin-only GET / DELETE protected by `X-Admin-Token` header.
- **Design system**: Deep obsidian (#0A0A0A) + champagne gold (#D4AF37) accents, Outfit + Manrope typography (Google Fonts). Bento-grid + uniform 3×3 services layout, grayscale-to-color image hovers, marquee trust strip, glassmorphism cards, ken-burns hero, animated counters, floating gold orbs.

## Business Focus (updated)
**Akaal Integrated Solutions is a network cabling specialist** delivering 9 services to commercial clients across the GTA:
1. Structured Cabling Installation
2. Data & Voice Cabling
3. Fiber Optic Cabling
4. Network Design & Consultation
5. Cable Testing & Certification
6. Wired & Wireless Network Upgrade
7. Warehouse Paging System
8. CCTV & Surveillance
9. Audio-Visual

## User Personas (updated)
1. **Corporate Office / Property Manager** — needs Cat6/6A install, fiber backbone, Wi-Fi upgrade.
2. **Distribution Centre / Warehouse Operator** — needs warehouse paging, wireless coverage, CCTV.
3. **Healthcare / Educational Facility** — needs structured cabling + AV for classrooms/boardrooms + surveillance.
4. **Retail Chain / Hospitality Group** — needs unified data/voice, AV, CCTV across multiple locations.

## Core Requirements (Static)
- Premium, classy, distinctive identity that elevates well beyond completelywired.com.
- Brand name "Akaal" prominently featured throughout (navbar, hero, about, footer).
- Showcase four service disciplines: Integrated Security, Audio-Visual & Automation, Structured Data/Comm, Smart Home Integration.
- Owner & contact info easy to find (Avtar, Brampton ON, 416-918-3601).
- Working contact / quote-request form.
- Responsive on every viewport (mobile = "app").

## What's Been Implemented (2026-04-26)
- ✅ Sticky glass navbar with smooth-scroll links + mobile hamburger + glow-pulse on the gold "A" brand mark.
- ✅ Cinematic hero with **Ken-Burns slow-zoom** background, dual-gradient overlay, animated gold "unwired" wordmark, brand tagline, dual CTAs, **animated stat counters** (count up from 0 when in view).
- ✅ Floating ambient gold orbs drifting in dark sections (Hero, Spaces, Approach, Contact).
- ✅ Marquee trusted-clients strip.
- ✅ Bento-grid Services section — all 4 cards now have imagery (Security cameras, AV smart-panel, Data server rack, Smart Home architectural facade) with image-zoom on hover.
- ✅ **NEW Spaces / Lifestyle Showcase section** — 5-image masonry grid (Residential, Commercial, Automation, Security, Infrastructure) with image-zoom hover and gradient labels.
- ✅ Approach / Method section (4 deliberate phases with numbered steps, gold orb in background).
- ✅ Projects gallery (4 case studies, grayscale → color hover, location tags).
- ✅ About section: 3-image collage above pillar grid (founder visual), sticky-headline layout, 4 pillar grid, founder pull-quote, contact info inline.
- ✅ Premium Contact form with floating gold orbs background, sonner toasts, validation, post-submit reset. POSTs to `/api/contact`.
- ✅ Footer with brand mark, disciplines list, studio info, email link, copyright.
- ✅ **Admin Console** at `/admin` (token-protected via `X-Admin-Token` header) — list, view detail, delete inquiries, click-to-call, click-to-email reply. Token persisted in localStorage.
- ✅ Backend: GET `/api/`, POST `/api/contact`, GET `/api/contact` (admin-only), DELETE `/api/contact/{id}` (admin-only), POST `/api/admin/verify`. Inquiries stored in `contact_inquiries` collection.
- ✅ data-testid attributes on every interactive element (40+ test ids).
- ✅ CSS-only animations (no heavy JS libs): kenBurns, shimmer, glowPulse, orbDrift, floatY, image-zoom, fade-up reveal.
- ✅ Tested: backend 100% (6/6), frontend 89% (16/18) — zero blocking issues.

## Prioritized Backlog
### P0 — Required to go live
- ❗ Receive business email from user → wire up SendGrid/Resend so contact-form submissions email Avtar in real time.
- ❗ Confirm full street address (currently shows "Brampton, ON" only).

### P1 — Strong enhancements
- Add real project photos / case studies once Avtar provides portfolio assets.
- Add custom Akaal logo (currently using stylized "A" mark).
- Add Google Maps embed in contact section once full address is confirmed.
- Image lightbox / detailed case study pages for projects.
- Add Open Graph / favicon / SEO meta tags + sitemap.

### P2 — Future polish
- Blog / news section for industry updates.
- Client testimonials carousel.
- Online appointment-booking widget (Calendly or custom).
- Multi-language support (English / Punjabi).

## Next Tasks
1. User to share business email + full street address.
2. Integrate transactional email (SendGrid or Resend) so inquiries hit inbox.
3. Replace stock Pexels imagery with Avtar's actual project photography when available.
