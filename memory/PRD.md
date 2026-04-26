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
- **Frontend**: React 19 + Tailwind CSS 3, single-page marketing site with smooth-scroll sections, IntersectionObserver reveal animations, fully responsive (acts as the "app" on mobile/tablet).
- **Backend**: FastAPI + MongoDB (motor async driver), `/api/contact` endpoint to persist inquiries.
- **Design system**: Deep obsidian (#0A0A0A) + champagne gold (#D4AF37) accents, Outfit + Manrope typography (Google Fonts). Bento-grid services layout, grayscale-to-color image hovers, marquee trust strip, glassmorphism cards.

## User Personas
1. **High-Rise Developer** — needs full security + cabling + AV across multi-unit builds.
2. **Custom Home Owner** — wants bespoke smart-home + theatre + lighting integration.
3. **Commercial Architect / Property Manager** — looking for a single integrator across security, data and AV.
4. **Hospitality / Boutique Retail Operator** — needs polished, reliable AV + security retrofit.

## Core Requirements (Static)
- Premium, classy, distinctive identity that elevates well beyond completelywired.com.
- Brand name "Akaal" prominently featured throughout (navbar, hero, about, footer).
- Showcase four service disciplines: Integrated Security, Audio-Visual & Automation, Structured Data/Comm, Smart Home Integration.
- Owner & contact info easy to find (Avtar, Brampton ON, 416-918-3601).
- Working contact / quote-request form.
- Responsive on every viewport (mobile = "app").

## What's Been Implemented (2026-04-26)
- ✅ Sticky glass navbar with smooth-scroll links + mobile hamburger.
- ✅ Cinematic hero with luxury interior background, dual-gradient overlay, animated gold "unwired" wordmark, brand tagline, dual CTAs, 4-stat grid (20+ years, 300+ projects, 24/7, 100% in-house).
- ✅ Marquee trusted-clients strip.
- ✅ Bento-grid Services section (4 cards with Lucide icons, bullet checklists, hover spotlights, optional imagery).
- ✅ Approach / Method section (4 deliberate phases with numbered steps).
- ✅ Projects gallery (4 case studies, grayscale → color hover, location tags).
- ✅ About section with sticky-headline layout, 4 pillar grid, founder pull-quote, contact info inline.
- ✅ Premium Contact form: name, email, phone, project type (dropdown), message — with sonner toasts, validation, and clean post-submit reset. POSTs to `/api/contact`.
- ✅ Footer with brand mark, disciplines list, studio info, copyright.
- ✅ Backend: GET `/api/`, POST `/api/contact` (with EmailStr validation), GET `/api/contact`. Inquiries stored in `contact_inquiries` collection.
- ✅ data-testid attributes on every interactive element (32+ test ids).
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
