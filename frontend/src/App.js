import React, { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "@/Admin";
import {
  Shield,
  Cable,
  Speaker,
  Home,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Check,
  Menu,
  X,
  Building2,
  Network,
  Camera,
  Lightbulb,
  Sparkles,
  Zap,
  Wifi,
  Megaphone,
  BadgeCheck,
  PencilRuler,
} from "lucide-react";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ---------------- Animated Counter ---------------- */
const TOAST_OPTIONS = {
  style: {
    background: "#121212",
    border: "1px solid rgba(212,175,55,0.3)",
    color: "#fff",
    borderRadius: 0,
  },
};

function Counter({ end, suffix = "", duration = 1800 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTs = performance.now();
            const target = parseFloat(end);
            const tick = (now) => {
              const p = Math.min(1, (now - startTs) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(target * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const display =
    suffix === "%" || end >= 100
      ? Math.round(val).toString()
      : Math.round(val).toString();
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ---------------- Reveal hook ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- Navbar ---------------- */
const NAV_LINKS = [
  { id: "services", label: "Services" },
  { id: "approach", label: "Approach" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-black/70 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-20">
        <button
          data-testid="brand-home-btn"
          onClick={() => go("hero")}
          className="flex items-center gap-3 group"
        >
          <span className="w-9 h-9 border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-light text-lg glow-border">
            A
          </span>
          <span className="brand-mark text-sm sm:text-base text-white">
            Akaal<span className="text-[#d4af37]"> · </span>Integrated
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-${l.id}-btn`}
              onClick={() => go(l.id)}
              className="text-xs tracking-[0.2em] uppercase text-zinc-300 hover:text-[#d4af37] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            data-testid="navbar-call-btn"
            href="tel:+14169183601"
            className="text-xs tracking-[0.2em] uppercase text-zinc-300 hover:text-[#d4af37]"
          >
            416&middot;918&middot;3601
          </a>
          <button
            data-testid="navbar-quote-btn"
            onClick={() => go("contact")}
            className="akaal-btn-primary !py-3 !px-5 !text-[0.7rem]"
          >
            Request Consult
          </button>
        </div>

        <button
          data-testid="mobile-menu-btn"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu-panel"
          className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5"
        >
          <div className="container-wide py-6 flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`mobile-nav-${l.id}-btn`}
                onClick={() => go(l.id)}
                className="text-left text-base tracking-[0.15em] uppercase text-zinc-200 hover:text-[#d4af37]"
              >
                {l.label}
              </button>
            ))}
            <a
              data-testid="mobile-call-btn"
              href="tel:+14169183601"
              className="text-sm text-[#d4af37] tracking-[0.18em]"
            >
              416 · 918 · 3601
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-[100vh] flex items-center grain overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 ken-burns"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/34989208/pexels-photo-34989208.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

      {/* Ambient orbs */}
      <div className="orb orb-gold w-[420px] h-[420px] -top-32 -right-20 z-10" />
      <div className="orb orb-amber w-[320px] h-[320px] bottom-10 -left-10 z-10" />

      <div className="container-wide relative z-20 pt-28 pb-16">
        <div className="max-w-4xl">
          <div className="reveal kicker mb-8" data-testid="hero-kicker">
            <Sparkles size={14} className="text-[#d4af37]" />
            Brampton · Toronto GTA · Established Excellence
          </div>

          <h1
            className="reveal text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight font-light text-white"
            style={{ transitionDelay: "60ms" }}
            data-testid="hero-headline"
          >
            Timeless systems
            <br />
            for an <span className="akaal-gold-text italic font-extralight">unwired</span>
            <br />
            world.
          </h1>

          <p
            className="reveal mt-8 max-w-xl text-lg sm:text-xl text-zinc-400 leading-relaxed font-light"
            style={{ transitionDelay: "140ms" }}
            data-testid="hero-subhead"
          >
            <span className="brand-mark text-[#d4af37] tracking-[0.25em] text-sm">
              AKAAL
            </span>{" "}
            Integrated Solutions designs, installs and certifies premium
            structured cabling, fiber optic and network infrastructure for
            businesses across the Greater Toronto Area.
          </p>

          <div
            className="reveal mt-12 flex flex-wrap items-center gap-4"
            style={{ transitionDelay: "200ms" }}
          >
            <button
              data-testid="hero-consult-btn"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="akaal-btn-primary"
            >
              Start a Project
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </button>
            <button
              data-testid="hero-services-btn"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="akaal-btn-secondary"
            >
              Our Disciplines
            </button>
          </div>

          <div
            className="reveal mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl"
            style={{ transitionDelay: "260ms" }}
          >
            {[
              { id: "years", k: 10, s: "+", v: "Years of Mastery" },
              { id: "projects", k: 100, s: "+", v: "Projects Delivered" },
              { id: "support", k: 24, s: "/7", v: "Service & Support" },
              { id: "design", k: 100, s: "%", v: "In-House Design" },
            ].map((s) => (
              <div key={s.id} data-testid={`hero-stat-${s.id}`}>
                <div className="text-3xl sm:text-4xl text-white font-light tracking-tight">
                  <Counter end={s.k} suffix={s.s} />
                </div>
                <div className="mt-1 text-[0.7rem] tracking-[0.2em] uppercase text-zinc-500">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-3 opacity-70">
        <span className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-400">
          Scroll
        </span>
        <span className="w-px h-12 bg-gradient-to-b from-[#d4af37] to-transparent" />
      </div>
    </section>
  );
}

/* ---------------- Trusted strip ---------------- */
function TrustedStrip() {
  const items = [
    "Corporate Offices",
    "Distribution Centres",
    "Healthcare Facilities",
    "Educational Campuses",
    "Retail Chains",
    "Warehouses & Logistics",
  ];
  return (
    <section
      data-testid="trusted-strip"
      className="border-y border-white/5 py-8 overflow-hidden"
    >
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="brand-mark text-xs sm:text-sm text-zinc-500 whitespace-nowrap flex items-center gap-4"
          >
            <span className="w-1 h-1 bg-[#d4af37] rounded-full" />
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Services Bento ---------------- */
const SERVICES = [
  {
    id: "structured",
    icon: Network,
    title: "Structured Cabling Installation",
    blurb:
      "End-to-end Cat6/6A and backbone installations engineered for long-term reliability and growth.",
    bullets: ["Cat6 / Cat6A", "Backbone & risers", "Code-compliant", "Future-ready design"],
  },
  {
    id: "datavoice",
    icon: Cable,
    title: "Data & Voice Cabling",
    blurb:
      "Unified data and voice infrastructure that powers modern offices, call centres and campuses.",
    bullets: ["Telecom & VoIP", "Patch panels", "Workstation drops", "MDF / IDF builds"],
  },
  {
    id: "fiber",
    icon: Zap,
    title: "Fiber Optic Cabling",
    blurb:
      "Single-mode and multi-mode fiber for high-performance backbones, data centres and inter-building runs.",
    bullets: ["Single-mode", "Multi-mode (OM3/OM4)", "Splicing & termination", "OTDR testing"],
  },
  {
    id: "design",
    icon: PencilRuler,
    title: "Network Design & Consultation",
    blurb:
      "Strategic network architecture and pre-build consulting to future-proof your infrastructure.",
    bullets: ["Site surveys", "CAD diagrams", "Capacity planning", "Vendor-neutral"],
  },
  {
    id: "testing",
    icon: BadgeCheck,
    title: "Cable Testing & Certification",
    blurb:
      "We certify every Cat6 and fiber optic run with industry-leading Fluke testers — and deliver the full pass/fail results as a branded PDF report.",
    bullets: ["Fluke DSX / Versiv testers", "Cat6 / Cat6A certified", "Fiber OTDR certified", "PDF reports delivered"],
  },
  {
    id: "upgrade",
    icon: Wifi,
    title: "Wired & Wireless Network Upgrade",
    blurb:
      "Modernise legacy wired networks and deploy enterprise Wi-Fi (6 / 6E / 7) seamlessly.",
    bullets: ["Wi-Fi 6 / 6E / 7", "Heat-mapping", "Switch upgrades", "Zero downtime"],
  },
  {
    id: "paging",
    icon: Megaphone,
    title: "Warehouse Paging System",
    blurb:
      "Industrial-grade paging, intercom and zone audio for warehouses, factories and distribution centres.",
    bullets: ["Zone paging", "Intercom integration", "Loudspeaker arrays", "Emergency alerts"],
  },
  {
    id: "cctv",
    icon: Camera,
    title: "CCTV & Surveillance",
    blurb:
      "IP and analog video surveillance with remote monitoring, NVR storage and intelligent analytics.",
    bullets: ["IP & analog cameras", "NVR / DVR systems", "Remote monitoring", "Low-light optics"],
  },
  {
    id: "av",
    icon: Speaker,
    title: "Audio-Visual",
    blurb:
      "Professional AV for boardrooms, training rooms, retail and hospitality — installed and tuned.",
    bullets: ["Boardrooms", "Digital signage", "Distributed audio", "Display walls"],
  },
];

function Services() {
  return (
    <section id="services" data-testid="services-section" className="section-pad relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5 reveal">
            <div className="kicker mb-6">02 / Capabilities</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              Nine disciplines.
              <br />
              <span className="text-zinc-500">One </span>
              <span className="akaal-gold-text italic">seamless</span>
              <span className="text-zinc-500"> network.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="text-lg text-zinc-400 leading-relaxed">
              We are professional network cabling specialists delivering
              end-to-end infrastructure — from first sketch to final
              certification. Every Cat6, every fiber, every wireless access
              point engineered to feel
              <span className="text-white"> invisible </span>
              and behave
              <span className="text-white"> infallible</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className="bento-card reveal p-7 sm:p-8 min-h-[340px] flex flex-col"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div className="w-11 h-11 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-6">
                  <Icon size={20} strokeWidth={1.4} />
                </div>
                <h3 className="text-xl sm:text-2xl text-white font-light tracking-tight leading-snug">
                  {s.title}
                </h3>
                <p className="mt-3 text-zinc-400 leading-relaxed text-sm flex-1">
                  {s.blurb}
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 pt-5 border-t border-white/5">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-xs text-zinc-400 flex items-center gap-2"
                    >
                      <Check size={12} className="text-[#d4af37] flex-shrink-0" strokeWidth={2.2} />
                      <span className="truncate">{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Spaces (Lifestyle Showcase) ---------------- */
const SHOWCASE = [
  {
    src: "https://images.pexels.com/photos/34989208/pexels-photo-34989208.jpeg",
    alt: "Premium hospitality interior",
    label: "AV Environments",
    h: "h-[420px]",
  },
  {
    src: "https://images.pexels.com/photos/32334253/pexels-photo-32334253.jpeg",
    alt: "Smart control panel",
    label: "Network Endpoints",
    h: "h-[300px]",
  },
  {
    src: "https://images.pexels.com/photos/16239257/pexels-photo-16239257.jpeg",
    alt: "Commercial property",
    label: "Commercial",
    h: "h-[360px]",
  },
  {
    src: "https://images.pexels.com/photos/10233086/pexels-photo-10233086.jpeg",
    alt: "CCTV cameras",
    label: "CCTV & Surveillance",
    h: "h-[260px]",
  },
  {
    src: "https://images.pexels.com/photos/6466141/pexels-photo-6466141.jpeg",
    alt: "Server rack and structured cabling",
    label: "Server Rooms · Backbone",
    h: "h-[420px]",
  },
];

function Spaces() {
  return (
    <section
      id="spaces"
      data-testid="spaces-section"
      className="relative section-pad border-t border-white/5 overflow-hidden"
    >
      <div className="orb orb-gold w-[500px] h-[500px] -top-32 -left-40" />
      <div className="orb orb-amber w-[400px] h-[400px] bottom-0 -right-40" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-6 reveal">
            <div className="kicker mb-6">Inside Akaal</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              The spaces we
              <br />
              <span className="akaal-gold-text italic">quietly transform.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="text-lg text-zinc-400 leading-relaxed">
              From penthouses overlooking Lake Ontario to commercial towers in
              the GTA — every Akaal environment is engineered to feel
              effortless, look immaculate and last a generation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="reveal lg:col-span-5 image-zoom relative border border-white/5 group">
            <img
              src={SHOWCASE[0].src}
              alt={SHOWCASE[0].alt}
              loading="lazy"
              className={`w-full ${SHOWCASE[0].h} object-cover`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 text-[0.7rem] tracking-[0.22em] uppercase text-[#d4af37]">
              {SHOWCASE[0].label}
            </div>
          </div>

          <div className="reveal lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6" style={{ transitionDelay: "100ms" }}>
            <div className="image-zoom relative border border-white/5 col-span-2">
              <img
                src={SHOWCASE[2].src}
                alt={SHOWCASE[2].alt}
                loading="lazy"
                className={`w-full ${SHOWCASE[2].h} object-cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-[0.7rem] tracking-[0.22em] uppercase text-[#d4af37]">
                {SHOWCASE[2].label}
              </div>
            </div>
            <div className="image-zoom relative border border-white/5">
              <img
                src={SHOWCASE[1].src}
                alt={SHOWCASE[1].alt}
                loading="lazy"
                className={`w-full ${SHOWCASE[1].h} object-cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 text-[0.65rem] tracking-[0.22em] uppercase text-[#d4af37]">
                {SHOWCASE[1].label}
              </div>
            </div>
            <div className="image-zoom relative border border-white/5">
              <img
                src={SHOWCASE[3].src}
                alt={SHOWCASE[3].alt}
                loading="lazy"
                className={`w-full ${SHOWCASE[3].h} object-cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 text-[0.65rem] tracking-[0.22em] uppercase text-[#d4af37]">
                {SHOWCASE[3].label}
              </div>
            </div>
          </div>

          <div className="reveal lg:col-span-12 image-zoom relative border border-white/5" style={{ transitionDelay: "180ms" }}>
            <img
              src={SHOWCASE[4].src}
              alt={SHOWCASE[4].alt}
              loading="lazy"
              className="w-full h-[280px] sm:h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 sm:left-12">
              <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[#d4af37] mb-2">
                {SHOWCASE[4].label}
              </div>
              <div className="text-2xl sm:text-3xl text-white font-light tracking-tight max-w-md">
                Backbone infrastructure for entire developments — across the GTA.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Approach ---------------- */
const STEPS = [
  {
    n: "01",
    icon: Lightbulb,
    title: "Consult & Design",
    body: "Site walk-through, requirements capture and full in-house CAD specifications tailored to the architecture.",
  },
  {
    n: "02",
    icon: Network,
    title: "Engineer & Specify",
    body: "Selection of best-in-class equipment, infrastructure design and a step-by-step delivery roadmap.",
  },
  {
    n: "03",
    icon: Camera,
    title: "Install & Integrate",
    body: "Certified technicians deliver structured installation across security, AV, networking and automation layers.",
  },
  {
    n: "04",
    icon: Building2,
    title: "Commission & Care",
    body: "Final tuning, client onboarding, documentation and lifelong service & support — by appointment.",
  },
];

function Approach() {
  return (
    <section
      id="approach"
      data-testid="approach-section"
      className="section-pad relative border-t border-white/5 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)",
      }}
    >
      <div className="orb orb-gold w-[400px] h-[400px] top-20 right-0" />
      <div className="container-wide relative">
        <div className="reveal max-w-3xl mb-20">
          <div className="kicker mb-6">03 / Method</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
            A measured, <span className="akaal-gold-text italic">obsessive</span> process.
          </h2>
          <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
            Every Akaal project moves through four deliberate phases — so the
            outcome feels effortless, even when the engineering beneath it is
            extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {STEPS.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.n}
                data-testid={`approach-step-${st.n}`}
                className="reveal bg-[#0a0a0a] p-10 hover:bg-[#101010] transition-colors group min-h-[280px] flex flex-col"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="brand-mark text-xs text-zinc-600 tracking-[0.3em]">
                    {st.n}
                  </span>
                  <Icon
                    size={22}
                    strokeWidth={1.4}
                    className="text-zinc-600 group-hover:text-[#d4af37] transition-colors"
                  />
                </div>
                <h3 className="text-xl text-white font-light tracking-tight mb-3">
                  {st.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{st.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
const PROJECTS = [
  {
    title: "Cat6 Patch Panel Termination",
    cat: "Structured Cabling · Rack Build",
    location: "Corporate HQ · Brampton, ON",
    image:
      "https://customer-assets.emergentagent.com/job_web-app-hub-22/artifacts/a95x9aqo_947c39d2-cadc-4934-82a8-202fa4b7f982.jpeg",
  },
  {
    title: "Overhead Cable Tray Install",
    cat: "Structured Cabling · Pathway",
    location: "Office Fit-Out · Mississauga, ON",
    image:
      "https://customer-assets.emergentagent.com/job_web-app-hub-22/artifacts/clzawqvv_7b8e5a38-a404-4452-a4d2-a7ce07219c6c.jpeg",
  },
  {
    title: "EMT Conduit Pathway",
    cat: "Conduit · Cable Pull",
    location: "Commercial Build · Toronto, ON",
    image:
      "https://customer-assets.emergentagent.com/job_web-app-hub-22/artifacts/ujramdel_20d349dc-0cec-466a-a40a-6f7955dc428b.jpeg",
  },
  {
    title: "Perimeter CCTV Deployment",
    cat: "Surveillance · Outdoor Install",
    location: "Industrial Site · GTA",
    image:
      "https://customer-assets.emergentagent.com/job_web-app-hub-22/artifacts/2o1lveza_0f4dfb9f-2a12-4cdd-a2d4-541c4957812f.jpeg",
  },
  {
    title: "Warehouse Network Rack",
    cat: "Distribution Centre · Network Closet",
    location: "Logistics Facility · GTA",
    image:
      "https://customer-assets.emergentagent.com/job_web-app-hub-22/artifacts/d55avx65_9dd8d15e-c994-49c0-baf3-575ec01d18e3.jpeg",
  },
];

function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="section-pad border-t border-white/5"
    >
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">04 / Recent Projects</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              The craft,
              <br />
              <span className="akaal-gold-text italic">on display.</span>
            </h2>
          </div>
          <p className="reveal text-zinc-400 max-w-md text-lg" style={{ transitionDelay: "120ms" }}>
            Real work from recent Akaal deployments — patch panels, cable
            trays, conduit pathways, surveillance and warehouse network
            closets. Built clean. Documented. Certified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <a
              key={p.title}
              href="#contact"
              data-testid={`project-card-${p.title.replace(/\s+/g, "-").toLowerCase()}`}
              className={`reveal group relative block overflow-hidden border border-white/5 hover:border-[#d4af37]/40 transition-colors ${
                i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1 ? "md:col-span-2" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`${
                i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1 ? "aspect-[21/9]" : "aspect-[4/3]"
              } overflow-hidden`}>
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1200ms] ease-out"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[#d4af37] mb-2">
                    {p.cat}
                  </div>
                  <h3 className="text-2xl text-white font-light tracking-tight">
                    {p.title}
                  </h3>
                  <div className="text-sm text-zinc-400 mt-1">{p.location}</div>
                </div>
                <div className="w-11 h-11 border border-white/30 flex items-center justify-center text-white group-hover:bg-[#d4af37] group-hover:border-[#d4af37] group-hover:text-black transition-all">
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="section-pad border-t border-white/5"
    >
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 reveal sticky top-28">
            <div className="kicker mb-6">05 / Who We Are</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              <span className="akaal-gold-text italic">Akaal.</span>
              <br />
              The timeless backbone.
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              We specialize in providing top-tier network cabling services to
              businesses of all sizes. Whether you need to install new
              infrastructure or upgrade existing systems, our experienced team
              ensures reliable, efficient and scalable solutions tailored to
              meet your unique needs.
            </p>
            <p className="mt-5 text-lg text-zinc-400 leading-relaxed">
              With over <span className="text-white">10 years of experience</span>{" "}
              in the industry, we've built a reputation for delivering
              high-quality cabling services that empower businesses to stay
              connected and perform at their best. Our certified technicians
              use the latest technology and adhere to industry standards,
              ensuring your network operates seamlessly and supports future
              growth.
            </p>
            <div className="hairline my-10" />
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-300">
                <MapPin size={16} className="text-[#d4af37]" />
                <span className="text-sm">Brampton · Serving the Greater Toronto Area</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <Phone size={16} className="text-[#d4af37]" />
                <a
                  href="tel:+14169183601"
                  data-testid="about-phone-link"
                  className="text-sm hover:text-[#d4af37]"
                >
                  416 · 918 · 3601
                </a>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <Mail size={16} className="text-[#d4af37]" />
                <a
                  href="mailto:Admin@akaalintegratedsolutions.ca"
                  data-testid="about-email-link"
                  className="text-sm hover:text-[#d4af37] break-all"
                >
                  Admin@akaalintegratedsolutions.ca
                </a>
              </div>
              <div className="flex items-center gap-4 text-zinc-300">
                <Building2 size={16} className="text-[#d4af37]" />
                <span className="text-sm">Office hours by appointment only</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 reveal" style={{ transitionDelay: "150ms" }}>
            {/* Founder image collage */}
            <div className="grid grid-cols-3 gap-3 mb-10 reveal">
              <div className="image-zoom relative border border-white/5 col-span-2 row-span-2">
                <img
                  src="https://images.pexels.com/photos/34989208/pexels-photo-34989208.jpeg"
                  alt="Refined interior"
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="image-zoom relative border border-white/5">
                <img
                  src="https://images.pexels.com/photos/32334253/pexels-photo-32334253.jpeg"
                  alt="Smart panel detail"
                  loading="lazy"
                  className="w-full h-[155px] sm:h-[195px] object-cover"
                />
              </div>
              <div className="image-zoom relative border border-white/5">
                <img
                  src="https://images.pexels.com/photos/16239257/pexels-photo-16239257.jpeg"
                  alt="Architectural detail"
                  loading="lazy"
                  className="w-full h-[155px] sm:h-[195px] object-cover"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-px bg-white/5">
              {[
                {
                  t: "Certified Technicians",
                  d: "Industry-certified team using the latest tools — Fluke testing, fusion splicing and OTDR diagnostics.",
                },
                {
                  t: "Standards Compliant",
                  d: "Every install adheres to TIA/EIA, BICSI and Canadian electrical code — fully documented for inspections.",
                },
                {
                  t: "Scalable Design",
                  d: "Infrastructure built for growth — capacity headroom, modular pathways and future-ready cable plant.",
                },
                {
                  t: "Lifelong Support",
                  d: "Up to 25-year warranty on certified runs, with continued service, audits and optimization.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="bg-[#0a0a0a] p-8 sm:p-10"
                  data-testid={`about-pillar-${item.t.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <h4 className="text-lg text-white font-medium tracking-tight mb-3">
                    {item.t}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>

            <blockquote className="mt-12 border-l-2 border-[#d4af37] pl-6 sm:pl-8">
              <p className="text-xl sm:text-2xl text-zinc-200 font-light italic leading-relaxed">
                “We don't just pull cable. We engineer the backbone every
                modern business runs on — quietly, precisely, and built to last.”
              </p>
              <footer className="mt-4 text-sm text-zinc-500 brand-mark tracking-[0.2em]">
                — Avtar, Founder
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
const PROJECT_TYPES = [
  "Structured Cabling Installation",
  "Data & Voice Cabling",
  "Fiber Optic Cabling",
  "Network Design & Consultation",
  "Cable Testing & Certification",
  "Wired / Wireless Network Upgrade",
  "Warehouse Paging System",
  "CCTV & Surveillance",
  "Audio-Visual",
  "Other",
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project_type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and a brief message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, {
        ...form,
        project_type: form.project_type || null,
        phone: form.phone || null,
      });
      setSent(true);
      toast.success("Thank you — we'll be in touch within one business day.");
      setForm({ name: "", email: "", phone: "", project_type: "", message: "" });
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "Could not send your inquiry. Please call 416-918-3601.";
      toast.error(typeof detail === "string" ? detail : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="section-pad border-t border-white/5 relative overflow-hidden"
    >
      <div className="orb orb-gold w-[600px] h-[600px] -top-40 -right-40" />
      <div className="orb orb-amber w-[420px] h-[420px] bottom-0 -left-40" />
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 reveal">
            <div className="kicker mb-6">06 / Begin</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              Let's design
              <br />
              something <span className="akaal-gold-text italic">enduring.</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-md">
              Share a few details about your project. Avtar or a senior
              integrator will respond personally within one business day.
            </p>

            <div className="mt-12 space-y-6">
              <a
                data-testid="contact-phone-card"
                href="tel:+14169183601"
                className="flex items-center gap-5 group"
              >
                <span className="w-12 h-12 border border-white/15 flex items-center justify-center text-[#d4af37] group-hover:border-[#d4af37] transition-colors">
                  <Phone size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500">
                    Direct
                  </div>
                  <div className="text-lg text-white group-hover:text-[#d4af37] transition-colors">
                    416 · 918 · 3601
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-5">
                <span className="w-12 h-12 border border-white/15 flex items-center justify-center text-[#d4af37]">
                  <MapPin size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500">
                    Studio
                  </div>
                  <div className="text-lg text-white">Brampton, Ontario</div>
                  <div className="text-sm text-zinc-500">Greater Toronto Area</div>
                </div>
              </div>

              <a
                data-testid="contact-email-card"
                href="mailto:Admin@akaalintegratedsolutions.ca"
                className="flex items-center gap-5 group"
              >
                <span className="w-12 h-12 border border-white/15 flex items-center justify-center text-[#d4af37] group-hover:border-[#d4af37] transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500">
                    Email
                  </div>
                  <div className="text-lg text-white group-hover:text-[#d4af37] transition-colors break-all">
                    Admin@akaalintegratedsolutions.ca
                  </div>
                  <div className="text-sm text-zinc-500">
                    Personal response within one business day
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 reveal" style={{ transitionDelay: "150ms" }}>
            <form
              data-testid="contact-form"
              onSubmit={submit}
              className="bento-card p-8 sm:p-12"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
                    Full Name *
                  </label>
                  <input
                    data-testid="contact-name-input"
                    type="text"
                    className="akaal-input"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
                    Email *
                  </label>
                  <input
                    data-testid="contact-email-input"
                    type="email"
                    className="akaal-input"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="jane@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
                    Phone
                  </label>
                  <input
                    data-testid="contact-phone-input"
                    type="tel"
                    className="akaal-input"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="(416) 555-0100"
                  />
                </div>
                <div>
                  <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
                    Project Type
                  </label>
                  <select
                    data-testid="contact-project-type-select"
                    className="akaal-input"
                    value={form.project_type}
                    onChange={update("project_type")}
                  >
                    <option value="">Select...</option>
                    {PROJECT_TYPES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
                  Tell us about your project *
                </label>
                <textarea
                  data-testid="contact-message-input"
                  rows={5}
                  className="akaal-input resize-none"
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Scope, timeline, location and anything you'd like Akaal to know..."
                  required
                />
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <p className="text-xs text-zinc-500 max-w-sm">
                  By submitting, you'll receive a direct response from our team
                  — never a chatbot, never a form letter.
                </p>
                <button
                  data-testid="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="akaal-btn-primary"
                >
                  {loading ? "Sending..." : sent ? "Sent · Send another" : "Submit Inquiry"}
                  {!loading && <ArrowRight size={16} strokeWidth={1.6} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-white/5 bg-black"
    >
      <div className="container-wide py-16">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-xl font-light">
                A
              </span>
              <div>
                <div className="brand-mark text-white text-base">Akaal</div>
                <div className="text-xs text-zinc-500 tracking-[0.2em] uppercase">
                  Integrated Solutions
                </div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Top-tier network cabling, fiber, CCTV and audio-visual services
              for businesses across the Greater Toronto Area.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-600 mb-5">
              Services
            </div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Structured Cabling</li>
              <li>Fiber Optic Cabling</li>
              <li>Data & Voice Cabling</li>
              <li>Cable Testing & Certification</li>
              <li>Wired & Wireless Upgrade</li>
              <li>CCTV & Audio-Visual</li>
              <li>Warehouse Paging</li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-600 mb-5">
              Studio
            </div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Brampton, Ontario, Canada</li>
              <li>
                <a
                  href="tel:+14169183601"
                  data-testid="footer-phone-link"
                  className="hover:text-[#d4af37]"
                >
                  416 · 918 · 3601
                </a>
              </li>
              <li>
                <a
                  href="mailto:Admin@akaalintegratedsolutions.ca"
                  data-testid="footer-email-link"
                  className="hover:text-[#d4af37] break-all"
                >
                  Admin@akaalintegratedsolutions.ca
                </a>
              </li>
              <li>By appointment only</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-zinc-600">
          <div>
            © {new Date().getFullYear()} Akaal Integrated Solutions. All rights
            reserved.
          </div>
          <div className="brand-mark tracking-[0.25em]">
            Designed in Brampton · Built to last
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */
function MarketingSite() {
  useReveal();

  // Health ping (keeps API warm + verifies connection in console)
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="App">
      <Toaster position="top-right" theme="dark" toastOptions={TOAST_OPTIONS} />
      <Navbar />
      <main>
        <Hero />
        <TrustedStrip />
        <Services />
        <Spaces />
        <Approach />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingSite />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
