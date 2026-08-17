import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Loader2, Star, Clock, Copy } from "lucide-react";
import { saveKeyToDatabase } from "../lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const POLAR_PRODUCT_ID = "1b890555-420e-4ca2-9d00-c59f3b38d67a";
const KEY_DURATION_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "sotarium_polar_key";

interface StoredKey {
  key: string;
  expiry: number;
}

const loadStoredKey = (): StoredKey | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredKey;
  } catch {
    return null;
  }
};

const saveStoredKey = (key: string, expiry: number): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, expiry }));
  } catch {
    // Ignore storage errors
  }
};

const clearStoredKey = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
};

export function computeKeySignature(g1: string, g2: string): string {
  const salt = "SOTARIUM_2026";
  const full = `${g1}${g2}${salt}`;
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let h1 = 17, h2 = 37, h3 = 79;
  for (let i = 0; i < full.length; i++) {
    const code = full.charCodeAt(i);
    h1 = (h1 * 31 + code) % chars.length;
    h2 = (h2 * 37 + code * (i + 1)) % chars.length;
    h3 = (h3 * 41 + code * (i + 3)) % chars.length;
  }
  return `${chars[h1]}${chars[h2]}${chars[h3]}`;
}

const generateKey = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const genGroup = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const g1 = genGroup();
  const g2 = genGroup();
  const g3 = computeKeySignature(g1, g2);
  return `${g1}-${g2}-${g3}`;
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

async function createCheckoutSession(productId: string): Promise<string> {
  const res = await fetch(`/api/polar-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      successUrl: `${window.location.origin}/products?checkout_success=1`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error((err as { error?: string }).error ?? "Checkout failed");
  }

  const data = await res.json() as { url?: string; error?: string };
  if (data.error) throw new Error(data.error);
  if (!data.url) throw new Error("No checkout URL returned");
  return data.url;
}

interface ProductsPageProps {
  onBack: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedKey, setStoredKey] = useState<StoredKey | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [keyExpired, setKeyExpired] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("checkout_success")) {
      const key = generateKey();
      const expiry = Date.now() + KEY_DURATION_MS;
      saveStoredKey(key, expiry);
      setStoredKey({ key, expiry });
      setTimeLeft(KEY_DURATION_MS);
      void saveKeyToDatabase(key, "polar");
      window.history.replaceState({}, "", "/products");
    } else {
      const existing = loadStoredKey();
      if (existing) {
        const remaining = existing.expiry - Date.now();
        if (remaining <= 0) {
          setKeyExpired(true);
          setStoredKey(existing);
        } else {
          setStoredKey(existing);
          setTimeLeft(remaining);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!storedKey || keyExpired) return;
    const interval = setInterval(() => {
      const remaining = storedKey.expiry - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setKeyExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [storedKey, keyExpired]);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await createCheckoutSession(POLAR_PRODUCT_ID);
      window.location.href = url;
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (storedKey) {
      navigator.clipboard.writeText(storedKey.key).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetNewKey = () => {
    clearStoredKey();
    setStoredKey(null);
    setKeyExpired(false);
    setTimeLeft(0);
  };

  const features = ["Lifetime access", "Never expires"];
  const hasActiveKey = storedKey !== null && !keyExpired;

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col items-center">
        {error && (
          <div className="mb-4 w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-20 h-20 object-contain rounded-lg drop-shadow-lg"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Sotarium
          </h1>
        </div>

        <div className="relative w-full flex flex-col gap-6 overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#131317] p-7 shadow-2xl text-white">
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#181820]">
                <Star className="w-5 h-5 text-[#f2f1f4]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[19px] font-bold tracking-tight text-[#f2f1f4]">
                  {hasActiveKey ? "Your Key" : "Lifetime"}
                </h2>
                <p className="text-zinc-500 text-xs">
                  {hasActiveKey ? "Never expires" : "Pay once, own forever"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {hasActiveKey ? (
            <>
              <div className="w-full flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e] p-3.5 font-mono text-base tracking-widest text-[#1AF513] shadow-inner">
                <span className="truncate mr-2 font-bold select-all">{storedKey!.key}</span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg bg-[#1AF513]/20 hover:bg-[#1AF513]/30 text-[#1AF513] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="w-full flex items-center justify-center gap-2 py-1">
                <span className="text-sm font-bold tracking-wide text-[#1AF513]">
                  Lifetime key
                </span>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-[26px] py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1)] hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_rgba(0,0,0,0.5)] active:translate-y-0"
              >
                Go to homepage
              </button>
            </>
          ) : keyExpired ? (
            <>
              <div className="w-full flex items-center justify-center gap-2 py-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="font-mono text-sm font-bold tracking-wider text-rose-500">
                  Key Expired
                </span>
              </div>

              <button
                type="button"
                onClick={handleGetNewKey}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-[26px] py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1)] hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_rgba(0,0,0,0.5)] active:translate-y-0"
              >
                Buy New Key
              </button>
            </>
          ) : (
            <>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-white">$1.50</span>
                <span className="text-zinc-500 text-sm mb-2">one-time</span>
              </div>

              <div className="h-px bg-white/[0.07]" />

              <ul className="flex flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-3.5 h-3.5 text-[#1AF513] shrink-0" strokeWidth={3} />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleBuy}
                disabled={loading}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-[26px] py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1)] hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_rgba(0,0,0,0.5)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
