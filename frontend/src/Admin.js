import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Lock,
  Trash2,
  Mail,
  Phone,
  ArrowLeft,
  RefreshCw,
  Inbox,
  Calendar,
  Building2,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TOAST_OPTIONS = {
  style: {
    background: "#121212",
    border: "1px solid rgba(212,175,55,0.3)",
    color: "#fff",
    borderRadius: 0,
  },
};

/* ---------------- Utilities ---------------- */
function fmtDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    console.warn("[admin] fmtDate failed for", iso, err);
    return iso;
  }
}

/* ---------------- Data hook ---------------- */
function useInquiries(token, onUnauth) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => ({ "X-Admin-Token": token }), [token]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/contact`, { headers });
      const data = res.data || [];
      setItems(data);
      setActive((curr) => curr || data[0] || null);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
        onUnauth();
      } else {
        console.error("[admin] failed to load inquiries", err);
        toast.error("Failed to load inquiries.");
      }
    } finally {
      setLoading(false);
    }
  }, [headers, onUnauth]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id) => {
      if (!window.confirm("Delete this inquiry permanently?")) return;
      try {
        await axios.delete(`${API}/contact/${id}`, { headers });
        toast.success("Inquiry deleted.");
        setItems((curr) => {
          const next = curr.filter((i) => i.id !== id);
          setActive((a) => (a?.id === id ? next[0] || null : a));
          return next;
        });
      } catch (err) {
        console.error("[admin] failed to delete inquiry", err);
        toast.error("Could not delete inquiry.");
      }
    },
    [headers]
  );

  return { items, active, setActive, loading, refresh, remove };
}

/* ---------------- Sub-components ---------------- */
function BrandMark({ subtitle = "Admin Console", size = "sm" }) {
  const box = size === "lg" ? "w-12 h-12 text-xl" : "w-8 h-8 text-base";
  return (
    <div className="flex items-center gap-3">
      <span
        className={`${box} border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-light`}
      >
        A
      </span>
      <div>
        <div className="brand-mark text-white text-base">Akaal</div>
        <div className="text-xs text-zinc-500 tracking-[0.2em] uppercase">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function AdminHeader({ onRefresh, onLogout, loading }) {
  return (
    <header className="border-b border-white/5 backdrop-blur-xl bg-black/60 sticky top-0 z-30">
      <div className="container-wide flex items-center justify-between h-20">
        <a href="/" className="flex items-center gap-3" data-testid="admin-brand-home">
          <span className="w-8 h-8 border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-light">
            A
          </span>
          <span className="brand-mark text-sm text-white">
            Akaal<span className="text-[#d4af37]"> · </span>Console
          </span>
        </a>
        <div className="flex items-center gap-4">
          <button
            data-testid="admin-refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            className="akaal-btn-secondary !py-2 !px-4 !text-[0.7rem]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            data-testid="admin-logout-btn"
            onClick={onLogout}
            className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-[#d4af37]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="bento-card p-16 text-center" data-testid="admin-empty-state">
      <Inbox size={32} className="mx-auto text-zinc-600 mb-4" />
      <h2 className="text-xl text-white font-light mb-2">No inquiries yet</h2>
      <p className="text-sm text-zinc-500">
        When someone submits the contact form, you'll see it here.
      </p>
    </div>
  );
}

function InquiryListItem({ item, isActive, onSelect }) {
  return (
    <button
      data-testid={`admin-inquiry-${item.id}`}
      onClick={() => onSelect(item)}
      className={`w-full text-left p-5 border transition-all ${
        isActive
          ? "border-[#d4af37]/60 bg-zinc-900/80"
          : "border-white/5 bg-zinc-900/30 hover:border-white/15"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-white font-medium">{item.name}</div>
        <div className="text-[0.65rem] text-zinc-500 tracking-wider uppercase whitespace-nowrap">
          {fmtDate(item.created_at)}
        </div>
      </div>
      <div className="text-xs text-zinc-400 mb-2">{item.email}</div>
      {item.project_type && (
        <div className="inline-block text-[0.65rem] tracking-[0.18em] uppercase text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 mb-2">
          {item.project_type}
        </div>
      )}
      <p className="text-sm text-zinc-500 line-clamp-2">{item.message}</p>
    </button>
  );
}

function InquiryDetail({ inquiry, onDelete }) {
  return (
    <div
      className="bento-card p-8 sm:p-10 lg:sticky lg:top-28"
      data-testid="admin-inquiry-detail"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl text-white font-light tracking-tight">
            {inquiry.name}
          </h2>
          <div className="text-xs text-zinc-500 tracking-wider uppercase mt-2 flex items-center gap-2">
            <Calendar size={12} /> {fmtDate(inquiry.created_at)}
          </div>
        </div>
        <button
          data-testid="admin-delete-btn"
          onClick={() => onDelete(inquiry.id)}
          className="text-zinc-500 hover:text-red-400 p-2"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3 mb-8">
        <a
          href={`mailto:${inquiry.email}`}
          className="flex items-center gap-3 text-sm text-zinc-300 hover:text-[#d4af37]"
        >
          <Mail size={14} className="text-[#d4af37]" />
          {inquiry.email}
        </a>
        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone}`}
            className="flex items-center gap-3 text-sm text-zinc-300 hover:text-[#d4af37]"
          >
            <Phone size={14} className="text-[#d4af37]" />
            {inquiry.phone}
          </a>
        )}
        {inquiry.project_type && (
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <Building2 size={14} className="text-[#d4af37]" />
            {inquiry.project_type}
          </div>
        )}
      </div>

      <div className="hairline mb-6" />

      <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-3">
        Message
      </div>
      <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
        {inquiry.message}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${inquiry.email}?subject=Re: Akaal Integrated Solutions inquiry`}
          data-testid="admin-reply-btn"
          className="akaal-btn-primary !py-3"
        >
          <Mail size={14} /> Reply via Email
        </a>
        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone}`}
            data-testid="admin-call-btn"
            className="akaal-btn-secondary !py-3"
          >
            <Phone size={14} /> Call
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------- Login screen ---------------- */
function Login({ onAuthed }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!pw) {
      toast.error("Enter the admin token.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API}/admin/verify`,
        {},
        { headers: { "X-Admin-Token": pw } }
      );
      toast.success("Welcome back, Avtar.");
      onAuthed(pw);
    } catch (err) {
      console.warn("[admin] login failed", err);
      toast.error(
        err?.response?.status === 401
          ? "Invalid token."
          : "Could not verify. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md">
        <a
          href="/"
          data-testid="admin-back-home"
          className="inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-zinc-500 hover:text-[#d4af37] mb-10"
        >
          <ArrowLeft size={14} /> Back to site
        </a>
        <div className="mb-8">
          <BrandMark size="lg" subtitle="Admin Console" />
        </div>
        <h1 className="text-3xl text-white font-light tracking-tight mb-3">
          Sign in.
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          Enter your admin token to view contact inquiries.
        </p>

        <form onSubmit={submit} data-testid="admin-login-form" className="bento-card p-8">
          <label className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-2 block">
            Admin Token
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              data-testid="admin-token-input"
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter token"
              className="akaal-input pl-10"
            />
          </div>
          <button
            data-testid="admin-login-btn"
            type="submit"
            disabled={loading}
            className="akaal-btn-primary w-full mt-6"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
          <p className="mt-6 text-xs text-zinc-600 leading-relaxed">
            This is a private console for Akaal Integrated Solutions
            administration. Token is held in memory only — you'll be signed out
            on refresh for security.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Inquiries screen ---------------- */
function Inquiries({ token, onLogout }) {
  const { items, active, setActive, loading, refresh, remove } = useInquiries(
    token,
    onLogout
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminHeader onRefresh={refresh} onLogout={onLogout} loading={loading} />

      <main className="container-wide py-10">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="kicker mb-3">Inbox</div>
            <h1 className="text-3xl sm:text-4xl text-white font-light tracking-tight">
              Contact Inquiries
              <span className="ml-3 text-zinc-500 text-2xl">({items.length})</span>
            </h1>
          </div>
        </div>

        {loading && items.length === 0 && (
          <div className="text-zinc-500 text-sm">Loading...</div>
        )}

        {!loading && items.length === 0 && <EmptyState />}

        {items.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3" data-testid="admin-inquiry-list">
              {items.map((it) => (
                <InquiryListItem
                  key={it.id}
                  item={it}
                  isActive={active?.id === it.id}
                  onSelect={setActive}
                />
              ))}
            </div>
            <div className="lg:col-span-7">
              {active && <InquiryDetail inquiry={active} onDelete={remove} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- Root ---------------- */
export default function Admin() {
  // Token is held in React state ONLY (memory-only). On any reload, the user
  // must sign in again — eliminating localStorage / sessionStorage XSS risk
  // for this shared-token admin console.
  const [token, setToken] = useState("");

  const logout = useCallback(() => setToken(""), []);

  return (
    <>
      <Toaster position="top-right" theme="dark" toastOptions={TOAST_OPTIONS} />
      {token ? (
        <Inquiries token={token} onLogout={logout} />
      ) : (
        <Login onAuthed={setToken} />
      )}
    </>
  );
}
