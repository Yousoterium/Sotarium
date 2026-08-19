import React, { useEffect, useState } from "react";
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0c0c0e] px-5 py-10 font-sans text-white antialiased sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div
          className="group w-full [transform-style:preserve-3d]"
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetHover}
          style={{
            transform,
            transition: hovered ? "transform 100ms ease-out" : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.14] bg-[#121215] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.42)] transition-shadow duration-500 group-hover:shadow-[0_34px_80px_rgba(0,0,0,0.66)] sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

            <header className="flex items-center justify-between text-[11px] font-bold tracking-[0.18em] text-zinc-500">
              <span>SOTARIUM</span>
              <span>01</span>
            </header>

            <div className="my-8 h-px bg-white/[0.11]" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Permanent access</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white sm:text-5xl">Lifetime Key</h1>
              <p className="mt-3 text-base font-medium text-zinc-400">$1.50 · One payment</p>
              <p className="mt-6 max-w-xs text-sm leading-6 text-zinc-500">A single key for uninterrupted access. No subscriptions or renewals.</p>
            </div>

            <div className="my-8 h-px bg-white/[0.11]" />

            {error && (
              <p className="mb-4 border border-white/[0.14] bg-white/[0.04] px-4 py-3 text-center text-xs text-zinc-300">
                {error}
              </p>
            )}

            {activeKey ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 border border-white/[0.12] bg-black/20 px-4 py-3 font-mono text-sm tracking-widest text-zinc-100">
                  <span className="truncate font-bold select-all">{storedKey!.key}</span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="shrink-0 text-xs font-bold text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full border border-white/[0.16] bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/[0.09] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Back to Home
                </button>
              </div>
            ) : keyExpired ? (
              <div className="space-y-3">
                <p className="border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-zinc-300">Key Expired</p>
                <button
                  type="button"
                  onClick={handleGetNewKey}
                  className="w-full border border-white bg-white px-5 py-3.5 text-sm font-extrabold text-black transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Buy New Key · $1.50
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[0.82fr_1.18fr] gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="border border-white/[0.16] bg-white/[0.04] px-4 py-3.5 text-sm font-bold text-zinc-200 transition-colors hover:bg-white/[0.09] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={loading}
                  className="border border-white bg-white px-4 py-3.5 text-sm font-extrabold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {loading ? "Opening checkout" : "Buy key · $1.50"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};
