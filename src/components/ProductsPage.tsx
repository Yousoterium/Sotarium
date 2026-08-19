import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, Loader2, Star, Clock, Copy, ShieldCheck, Zap, ShoppingCart, Sparkles } from "lucide-react";
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

  const features = [
    "Lifetime permanent access (Zero expiry)",
    "Instant automatic key delivery",
    "Bypasses all linkvertise & checkpoint steps",
    "Auto-injects on all supported games"
  ];
  const hasActiveKey = storedKey !== null && !keyExpired;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0b0e] text-white flex flex-col items-center justify-center px-4 py-12 font-sans select-none antialiased">
      
      {/* Kept Background: Dark Slate with Crisp Dot Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Main Centered RoStake-style Card */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center gap-6 w-full max-w-sm">
        
        {/* Gaming Tier Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141c] border border-[#222533] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-black tracking-widest text-zinc-300 uppercase">PERMANENT VIP ACCESS</span>
        </div>

        {/* Mascot & Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer active:scale-95 transition-transform duration-200">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-[#181a24] to-[#10121a] border border-[#262938] shadow-[0_16px_36px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center p-2.5">
              <img
                src="https://i.imgur.com/qye2L7M.png"
                alt="Sotarium"
                className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                onClick={onBack}
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            Lifetime Key
          </h1>
          <p className="text-xs font-semibold text-zinc-400 max-w-xs leading-relaxed">
            One-time purchase for permanent unrestricted access to all current and future script hubs.
          </p>
        </div>

        {error && (
          <div className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Pricing or Active Key Showcase */}
        {hasActiveKey ? (
          <div className="w-full flex flex-col gap-3.5 items-center">
            <div className="w-full flex items-center justify-between rounded-xl border border-[#10b981]/40 bg-[#12151e] px-4 py-3 font-mono text-base tracking-widest text-[#10b981] shadow-inner">
              <span className="truncate mr-2 font-black select-all">{storedKey!.key}</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-1.5 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] text-xs font-black uppercase transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider text-zinc-100 bg-gradient-to-b from-[#202330] to-[#151722] hover:from-[#262a3a] hover:to-[#1a1d2b] border border-[#2d3244] shadow-[0_4px_0_#0e1017,0_8px_16px_rgba(0,0,0,0.6)] active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : keyExpired ? (
          <div className="w-full flex flex-col gap-3.5 items-center">
            <div className="flex items-center gap-2 text-rose-500 font-black text-sm uppercase">
              <Clock className="w-4 h-4" />
              <span>Key Expired</span>
            </div>

            <button
              type="button"
              onClick={handleGetNewKey}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider text-[#022c22] bg-gradient-to-b from-[#34d399] to-[#10b981] hover:from-[#4ade80] hover:to-[#059669] shadow-[0_4px_0_#047857,0_10px_20px_rgba(16,185,129,0.35)] active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer"
            >
              Buy New Key
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 items-center">
            
            {/* Price Box with Gaming Styling */}
            <div className="w-full p-4 rounded-2xl bg-[#12141c] border border-[#222533] flex items-center justify-between shadow-md">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Price</span>
                <span className="text-xs font-bold text-[#10b981]">One-Time Payment</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">$1.50</span>
                <span className="text-xs font-bold text-zinc-400 uppercase">USD</span>
              </div>
            </div>

            {/* Features List */}
            <div className="flex flex-col gap-2 w-full text-left px-1">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <div className="w-4 h-4 rounded-md bg-[#10b981]/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#10b981]" strokeWidth={3.5} />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons Matrix */}
            <div className="flex items-center gap-3 w-full pt-2">
              {/* Back Button */}
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-zinc-300 bg-gradient-to-b from-[#202330] to-[#151722] hover:from-[#262a3a] hover:to-[#1a1d2b] border border-[#2d3244] shadow-[0_4px_0_#0e1017] active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer"
              >
                Back
              </button>

              {/* Buy Button */}
              <button
                type="button"
                onClick={handleBuy}
                disabled={loading}
                className="flex-2 py-3.5 px-5 rounded-xl font-black text-xs uppercase tracking-wider text-[#022c22] bg-gradient-to-b from-[#34d399] to-[#10b981] hover:from-[#4ade80] hover:to-[#059669] shadow-[0_4px_0_#047857,0_10px_20px_rgba(16,185,129,0.35)] active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#022c22]" /> : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-[#022c22]" strokeWidth={2.5} />
                    <span>Purchase ($1.50)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
