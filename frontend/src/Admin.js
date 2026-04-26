import React, { useEffect, useState } from "react";
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
const TOKEN_KEY = "akaal_admin_token";

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

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
      localStorage.setItem(TOKEN_KEY, pw);
      toast.success("Welcome back, Avtar.");
      onAuthed(pw);
    } catch (err) {
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
        <div className="flex items-center gap-3 mb-8">
          <span className="w-12 h-12 border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-xl font-light">
            A
          </span>
          <div>
            <div className="brand-mark text-white text-base">Akaal</div>
            <div className="text-xs text-zinc-500 tracking-[0.2em] uppercase">
              Admin Console
            </div>
          </div>
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
            administration. Unauthorized access is prohibited.
          </p>
        </form>
      </div>
    </div>
  );
}

function Inquiries({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);

  const headers = { "X-Admin-Token": token };

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/contact`, { headers });
      setItems(res.data || []);
      if (res.data?.[0] && !active) setActive(res.data[0]);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
        onLogout();
      } else {
        toast.error("Failed to load inquiries.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      await axios.delete(`${API}/contact/${id}`, { headers });
      toast.success("Inquiry deleted.");
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      if (active?.id === id) setActive(next[0] || null);
    } catch {
      toast.error("Could not delete inquiry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
              onClick={load}
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

      <main className="container-wide py-10">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="kicker mb-3">Inbox</div>
            <h1 className="text-3xl sm:text-4xl text-white font-light tracking-tight">
              Contact Inquiries
              <span className="ml-3 text-zinc-500 text-2xl">
                ({items.length})
              </span>
            </h1>
          </div>
        </div>

        {loading && items.length === 0 && (
          <div className="text-zinc-500 text-sm">Loading...</div>
        )}

        {!loading && items.length === 0 && (
          <div className="bento-card p-16 text-center" data-testid="admin-empty-state">
            <Inbox size={32} className="mx-auto text-zinc-600 mb-4" />
            <h2 className="text-xl text-white font-light mb-2">No inquiries yet</h2>
            <p className="text-sm text-zinc-500">
              When someone submits the contact form, you'll see it here.
            </p>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-3" data-testid="admin-inquiry-list">
              {items.map((it) => {
                const isActive = active?.id === it.id;
                return (
                  <button
                    key={it.id}
                    data-testid={`admin-inquiry-${it.id}`}
                    onClick={() => setActive(it)}
                    className={`w-full text-left p-5 border transition-all ${
                      isActive
                        ? "border-[#d4af37]/60 bg-zinc-900/80"
                        : "border-white/5 bg-zinc-900/30 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="text-white font-medium">{it.name}</div>
                      <div className="text-[0.65rem] text-zinc-500 tracking-wider uppercase whitespace-nowrap">
                        {fmtDate(it.created_at)}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400 mb-2">{it.email}</div>
                    {it.project_type && (
                      <div className="inline-block text-[0.65rem] tracking-[0.18em] uppercase text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 mb-2">
                        {it.project_type}
                      </div>
                    )}
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {it.message}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Detail */}
            <div className="lg:col-span-7">
              {active && (
                <div
                  className="bento-card p-8 sm:p-10 sticky top-28"
                  data-testid="admin-inquiry-detail"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl text-white font-light tracking-tight">
                        {active.name}
                      </h2>
                      <div className="text-xs text-zinc-500 tracking-wider uppercase mt-2 flex items-center gap-2">
                        <Calendar size={12} /> {fmtDate(active.created_at)}
                      </div>
                    </div>
                    <button
                      data-testid="admin-delete-btn"
                      onClick={() => remove(active.id)}
                      className="text-zinc-500 hover:text-red-400 p-2"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3 mb-8">
                    <a
                      href={`mailto:${active.email}`}
                      className="flex items-center gap-3 text-sm text-zinc-300 hover:text-[#d4af37]"
                    >
                      <Mail size={14} className="text-[#d4af37]" />
                      {active.email}
                    </a>
                    {active.phone && (
                      <a
                        href={`tel:${active.phone}`}
                        className="flex items-center gap-3 text-sm text-zinc-300 hover:text-[#d4af37]"
                      >
                        <Phone size={14} className="text-[#d4af37]" />
                        {active.phone}
                      </a>
                    )}
                    {active.project_type && (
                      <div className="flex items-center gap-3 text-sm text-zinc-300">
                        <Building2 size={14} className="text-[#d4af37]" />
                        {active.project_type}
                      </div>
                    )}
                  </div>

                  <div className="hairline mb-6" />

                  <div className="text-[0.7rem] tracking-[0.22em] uppercase text-zinc-500 mb-3">
                    Message
                  </div>
                  <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {active.message}
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${active.email}?subject=Re: Akaal Integrated Solutions inquiry`}
                      data-testid="admin-reply-btn"
                      className="akaal-btn-primary !py-3"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                    {active.phone && (
                      <a
                        href={`tel:${active.phone}`}
                        data-testid="admin-call-btn"
                        className="akaal-btn-secondary !py-3"
                      >
                        <Phone size={14} /> Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");

  // Re-verify the cached token on mount; clear it if invalid
  useEffect(() => {
    if (!token) return;
    axios
      .post(`${API}/admin/verify`, {}, { headers: { "X-Admin-Token": token } })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
      });
  }, [token]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  return (
    <>
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
      {token ? (
        <Inquiries token={token} onLogout={logout} />
      ) : (
        <Login onAuthed={setToken} />
      )}
    </>
  );
}
