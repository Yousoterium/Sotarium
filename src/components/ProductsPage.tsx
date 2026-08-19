import React, { useState, useEffect } from "react";
import { Copy, Loader2, Clock, Sparkles, Trophy, ShieldCheck, Zap, ArrowLeft, Key } from "lucide-react";
import { saveKeyToDatabase } from "../lib/supabase";

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

  const hasActiveKey = storedKey !== null && !keyExpired;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center px-4 py-12 font-sans select-none antialiased">
      
      {/* Clean Subtle Dot Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Main Centered Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center gap-7 w-full max-w-lg">
        
        {/* Mascot Logo with Back Navigation */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={onBack}
          />
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Sotarium VIP
          </h1>
        </div>

        {error && (
          <div className="w-full max-w-md flex items-center justify-center px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        {/* ========================================================================= */}
        {/* RoStake-Inspired Hero Promo Card (Wager LB style) */}
        {/* ========================================================================= */}
        <div className="group relative w-full rounded-3xl bg-gradient-to-br from-[#2a2214] via-[#1c1810] to-[#12141c] border border-amber-500/30 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/60 text-left flex flex-col justify-between min-h-[220px]">
          
          {/* Top Pill Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-black text-amber-400 uppercase tracking-wider">
              SOTARIUM.COM/PRODUCTS
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-black text-white">
              <span className="text-amber-400 font-bold">$1.50</span>
              <span className="text-[10px] text-zinc-400 uppercase">USD</span>
            </div>
          </div>

          {/* Card Headline & Subtitle */}
          <div className="relative z-10 flex flex-col gap-1.5 my-3 max-w-[300px]">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight leading-none drop-shadow-md">
              PERMANENT ACCESS KEY
            </h3>
            <p className="text-xs text-zinc-300 font-medium leading-relaxed">
              Skip all linkvertise & checkpoint steps forever with instant lifetime activation on all current and future games.
            </p>
          </div>

          {/* 3D Trophy / Graphic in Card Background on the Right */}
          <div className="absolute right-4 bottom-3 sm:right-6 sm:bottom-4 pointer-events-none select-none">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              <span className="text-7xl sm:text-8xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] transform group-hover:scale-105 group-hover:rotate-6 transition-transform duration-300 inline-block">
                🏆
              </span>
            </div>
          </div>

          {/* Key Feature Chips */}
          <div className="relative z-10 flex items-center gap-3 pt-2 border-t border-amber-500/20 text-[11px] font-bold text-amber-300">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Expiry</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Matrix */}
        {hasActiveKey ? (
          <div className="flex flex-col items-center gap-3.5 w-full">
            <div className="w-full flex items-center justify-between rounded-2xl border border-[#22c55e]/40 bg-[#12151e] px-5 py-3.5 font-mono text-base tracking-widest text-[#22c55e] shadow-md">
              <span className="truncate mr-2 font-black select-all">{storedKey!.key}</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-4 py-1.5 rounded-xl bg-[#22c55e]/20 hover:bg-[#22c55e]/30 text-[#22c55e] text-xs font-black uppercase transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white"
            >
              Back to Home
            </button>
          </div>
        ) : keyExpired ? (
          <div className="flex flex-col items-center gap-3.5 w-full">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Key Expired</span>
            </div>

            <button
              type="button"
              onClick={handleGetNewKey}
              className="w-full py-3.5 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white"
            >
              Buy New Key ($1.50)
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 w-full">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3.5 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white text-center"
            >
              Back
            </button>

            {/* Buy key Button */}
            <button
              type="button"
              onClick={handleBuy}
              disabled={loading}
              className="flex-1 py-3.5 px-6 rounded-full border border-white/[0.12] bg-gradient-to-b from-[#222228] to-[#141417] hover:from-[#2e2e36] hover:to-[#1c1c22] hover:border-amber-400/40 transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-amber-300 hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <>
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Buy key ($1.50)</span>
                </>
              )}
            </button>
          </div>
        )}

      </main>

    </div>
  );
};
