import React, { useEffect, useState } from "react";
import { Copy, Clock, Loader2 } from "lucide-react";
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
    // Ignore storage errors
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
  const generateGroup = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const firstGroup = generateGroup();
  const secondGroup = generateGroup();
  const signature = computeKeySignature(firstGroup, secondGroup);
  return `${firstGroup}-${secondGroup}-${signature}`;
};

async function createCheckoutSession(productId: string): Promise<string> {
  const response = await fetch("/api/polar-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      successUrl: `${window.location.origin}/products?checkout_success=1`,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error((error as { error?: string }).error ?? "Checkout failed");
  }

  const data = await response.json() as { url?: string; error?: string };
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
  const [keyExpired, setKeyExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("checkout_success")) {
      const key = generateKey();
      const expiry = Date.now() + KEY_DURATION_MS;
      saveStoredKey(key, expiry);
      setStoredKey({ key, expiry });
      void saveKeyToDatabase(key, "polar");
      window.history.replaceState({}, "", "/products");
      return;
    }

    const existing = loadStoredKey();
    if (!existing) return;

    if (existing.expiry <= Date.now()) {
      setKeyExpired(true);
    }
    setStoredKey(existing);
  }, []);

  useEffect(() => {
    if (!storedKey || keyExpired) return;

    const interval = setInterval(() => {
      if (storedKey.expiry <= Date.now()) {
        setKeyExpired(true);
        clearInterval(interval);
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
    } catch (checkoutError) {
      setError((checkoutError as Error).message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (!storedKey) return;
    navigator.clipboard.writeText(storedKey.key).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetNewKey = () => {
    clearStoredKey();
    setStoredKey(null);
    setKeyExpired(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({
      rotateX: (0.5 - y) * 4,
      rotateY: (x - 0.5) * 5,
    });
  };

  const resetHover = () => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const activeKey = storedKey !== null && !keyExpired;
  const transform = `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(${hovered ? -6 : 0}px)`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-sans select-none antialiased">
      
      {/* Clean Subtle Dot Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Centered Card Container */}
      <main className="relative z-10 w-[440px] max-w-full rounded-[26px] border border-white/[0.08] bg-[#121215] p-8 sm:p-9 shadow-2xl flex flex-col items-center justify-center text-center gap-8 animate-modal-in">
        
        {/* Mascot & Title */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={onBack}
          />

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Lifetime Key
          </h1>
        </div>

        {error && (
          <div className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Action Buttons: Back and Buy key Side-by-Side inside Card */}
        {activeKey ? (
          <div className="flex flex-col items-center gap-3.5 w-full">
            <div className="w-full flex items-center justify-between rounded-full border border-white/[0.12] bg-[#18181d] px-5 py-3 font-mono text-sm tracking-widest text-[#1AF513] shadow-md">
              <span className="truncate mr-2 font-bold select-all">{storedKey!.key}</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-1 rounded-full bg-[#1AF513]/20 hover:bg-[#1AF513]/30 text-[#1AF513] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-6 rounded-full border border-white/[0.12] bg-[#18181d] hover:bg-[#222228] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white"
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
              className="w-full py-3.5 px-6 rounded-full border border-white/[0.12] bg-[#18181d] hover:bg-[#222228] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white"
            >
              Buy New Key ($1.50)
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-6 rounded-full border border-white/[0.12] bg-[#18181d] hover:bg-[#222228] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white text-center"
            >
              Back
            </button>

            {/* Buy key Button */}
            <button
              type="button"
              onClick={handleBuy}
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-full border border-white/[0.12] bg-[#18181d] hover:bg-[#222228] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-300" /> : "Buy key ($1.50)"}
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
