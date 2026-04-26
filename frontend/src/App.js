import React, { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
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
} from "lucide-react";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
          <span className="w-8 h-8 border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-light text-lg">
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
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/34989208/pexels-photo-34989208.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0a]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

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
            Integrated Solutions designs, installs and integrates premium
            security, audio-visual, structured cabling and smart-home systems
            for high-rise developments, commercial spaces and custom homes.
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
              { k: "20+", v: "Years of Mastery" },
              { k: "300+", v: "Projects Delivered" },
              { k: "24/7", v: "Service & Support" },
              { k: "100%", v: "In-House Design" },
            ].map((s, i) => (
              <div key={i} data-testid={`hero-stat-${i}`}>
                <div className="text-3xl sm:text-4xl text-white font-light tracking-tight">
                  {s.k}
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
    "High-Rise Developers",
    "Commercial Architects",
    "Custom Home Builders",
    "Property Managers",
    "Hospitality Groups",
    "Boutique Retail",
  ];
  return (
    <section
      data-testid="trusted-strip"
      className="border-y border-white/5 py-8 overflow-hidden"
    >
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
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
    id: "security",
    icon: Shield,
    title: "Integrated Security",
    blurb:
      "Access control, intrusion, IP/analog video surveillance and 24/7 monitoring — engineered for high-rise and commercial assets.",
    bullets: [
      "Building access control",
      "IP & analog CCTV",
      "Intrusion & alarm systems",
      "Visitor management",
    ],
    image:
      "https://images.pexels.com/photos/10233086/pexels-photo-10233086.jpeg",
    span: "lg:col-span-7",
  },
  {
    id: "av",
    icon: Speaker,
    title: "Audio-Visual & Automation",
    blurb:
      "State-of-the-art home theatre, distributed audio, lighting, shading and full-residence automation.",
    bullets: ["Home theatre", "Whole-home audio", "Lighting & shades", "Control4 / Crestron"],
    image: null,
    span: "lg:col-span-5",
  },
  {
    id: "data",
    icon: Cable,
    title: "Structured Data & Comm",
    blurb:
      "Telecom, fiber and Cat6/6A networks delivering reliable foundations for every modern building.",
    bullets: ["Cat6 / Cat6A", "Single & multi-mode fiber", "Telecom & VoIP", "Server room build-outs"],
    image:
      "https://images.pexels.com/photos/6466141/pexels-photo-6466141.jpeg",
    span: "lg:col-span-5",
  },
  {
    id: "smart",
    icon: Home,
    title: "Smart Home Integration",
    blurb:
      "One refined ecosystem — security, climate, audio, lighting and entertainment, controlled effortlessly.",
    bullets: ["Unified control", "Voice & app interfaces", "Energy & climate", "Bespoke design"],
    image: null,
    span: "lg:col-span-7",
  },
];

function Services() {
  return (
    <section id="services" data-testid="services-section" className="section-pad relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5 reveal">
            <div className="kicker mb-6">02 / Disciplines</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              Four disciplines.
              <br />
              <span className="text-zinc-500">One </span>
              <span className="akaal-gold-text italic">seamless</span>
              <span className="text-zinc-500"> system.</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="text-lg text-zinc-400 leading-relaxed">
              We are professional system integrators delivering end-to-end
              technical environments. From first sketch to final commissioning,
              every cable, camera and control surface is engineered to feel
              <span className="text-white"> invisible </span>
              and behave
              <span className="text-white"> infallible</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className={`bento-card reveal p-8 sm:p-10 ${s.span} min-h-[360px] flex flex-col justify-between`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="w-11 h-11 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-6">
                      <Icon size={20} strokeWidth={1.4} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl text-white font-light tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-4 text-zinc-400 leading-relaxed max-w-md">
                      {s.blurb}
                    </p>
                  </div>
                  {s.image && (
                    <div className="hidden md:block w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0 overflow-hidden border border-white/10">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm text-zinc-400 flex items-center gap-2"
                    >
                      <Check size={14} className="text-[#d4af37]" strokeWidth={2} />
                      {b}
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
      className="section-pad relative border-t border-white/5"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)",
      }}
    >
      <div className="container-wide">
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
    title: "High-Rise Residential Tower",
    cat: "Security · Access · CCTV",
    location: "Mississauga, ON",
    image:
      "https://images.pexels.com/photos/16239257/pexels-photo-16239257.jpeg",
  },
  {
    title: "Custom Smart Estate",
    cat: "AV · Automation · Lighting",
    location: "Brampton, ON",
    image:
      "https://images.pexels.com/photos/32334253/pexels-photo-32334253.jpeg",
  },
  {
    title: "Commercial Headquarters",
    cat: "Structured Cabling · Fiber",
    location: "Toronto, ON",
    image:
      "https://images.pexels.com/photos/6466141/pexels-photo-6466141.jpeg",
  },
  {
    title: "Boutique Hospitality Suite",
    cat: "Integrated Security & AV",
    location: "Vaughan, ON",
    image:
      "https://images.pexels.com/photos/10233086/pexels-photo-10233086.jpeg",
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
            <div className="kicker mb-6">04 / Selected Work</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              Quiet excellence,
              <br />
              <span className="akaal-gold-text italic">across the GTA.</span>
            </h2>
          </div>
          <p className="reveal text-zinc-400 max-w-md text-lg" style={{ transitionDelay: "120ms" }}>
            A glimpse of recent integrations — from luxury residences to
            full-stack commercial deployments. Detailed case studies available
            upon request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <a
              key={i}
              href="#contact"
              data-testid={`project-card-${i}`}
              className="reveal group relative block overflow-hidden border border-white/5 hover:border-[#d4af37]/40 transition-colors"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
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
            <div className="kicker mb-6">05 / The House of Akaal</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight font-light">
              <span className="akaal-gold-text italic">Akaal.</span>
              <br />
              The timeless.
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              Founded by <span className="text-white">Avtar</span> and proudly
              based in Brampton, Ontario, Akaal Integrated Solutions is built on
              one principle — that great technology should outlast trends and
              quietly elevate every space it inhabits.
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
                <Building2 size={16} className="text-[#d4af37]" />
                <span className="text-sm">Office hours by appointment only</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 reveal" style={{ transitionDelay: "150ms" }}>
            <div className="grid sm:grid-cols-2 gap-px bg-white/5">
              {[
                {
                  t: "In-House Design",
                  d: "Complete design solutions and CAD specifications crafted under one roof — no outsourced surprises.",
                },
                {
                  t: "Master Installers",
                  d: "Certified technicians with decades of field experience across Canada's most demanding builds.",
                },
                {
                  t: "Bespoke Integration",
                  d: "Tailored security, AV and networking ecosystems engineered for the way each client lives and works.",
                },
                {
                  t: "Lifelong Support",
                  d: "Dedicated post-installation service, training and continuous system optimisation.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0a] p-8 sm:p-10"
                  data-testid={`about-pillar-${i}`}
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
                “We don't sell systems. We deliver environments — engineered
                quietly, lived in loudly.”
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
  "High-Rise Development",
  "Commercial Build-Out",
  "Custom Home",
  "Smart Home Upgrade",
  "Security Retrofit",
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
      <div
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />
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

              <div className="flex items-center gap-5">
                <span className="w-12 h-12 border border-white/15 flex items-center justify-center text-[#d4af37]">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500">
                    Email
                  </div>
                  <div className="text-lg text-white">Available on request</div>
                  <div className="text-sm text-zinc-500">
                    Submit the form or call directly
                  </div>
                </div>
              </div>
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
              Premium system integration for high-rise developments, commercial
              spaces and custom homes across the Greater Toronto Area.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-600 mb-5">
              Disciplines
            </div>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Integrated Security</li>
              <li>Audio-Visual & Automation</li>
              <li>Structured Cabling</li>
              <li>Smart Home Integration</li>
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
function App() {
  useReveal();

  // Health ping (keeps API warm + verifies connection in console)
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="App">
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#121212",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#fff",
            borderRadius: 0,
          },
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustedStrip />
        <Services />
        <Approach />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
