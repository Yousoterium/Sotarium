import React, { useState, useEffect } from "react";
import { AVAILABLE_PROVIDERS, ProviderItem, WORKINK_SQUARE_ICON } from "./ProviderPage";
import { saveKeyToDatabase } from "../lib/supabase";

const WORKINK_STEP_1 = "https://work.ink/2dbK/sotarium-step-1";
const WORKINK_STEP_2 = "https://work.ink/2dbK/sotarium-step-2";

function generateSecureToken(prefix: string = "s"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  let token = `${prefix}_`;
  const randomBytes = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < randomBytes.length; i++) {
      token += chars[randomBytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 32; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return token;
}

function computeKeySignature(g1: string, g2: string): string {
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

function generateFinalKeyString(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const genGroup = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const g1 = genGroup();
  const g2 = genGroup();
  const g3 = computeKeySignature(g1, g2);
  return `${g1}-${g2}-${g3}`;
}

interface KeyProviderPageProps {
  providerId: string;
  onGoHome: () => void;
}

export const KeyProviderPage: React.FC<KeyProviderPageProps> = ({ providerId, onGoHome }) => {
  const provider: ProviderItem = AVAILABLE_PROVIDERS.find(
    (p) => p.id.toLowerCase() === providerId.toLowerCase()
  ) || {
    id: "workink",
    name: "Work.ink",
    icon: WORKINK_SQUARE_ICON,
  };

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const savedExpiresAt = localStorage.getItem("sotarium_key_expires_at");
      if (savedExpiresAt && parseInt(savedExpiresAt, 10) <= Date.now()) {
        localStorage.removeItem("sotarium_user_key");
        localStorage.removeItem("sotarium_key_expires_at");
        localStorage.removeItem("sotarium_step1_done");
        localStorage.removeItem("sotarium_step2_done");
        return [];
      }
      const savedKey = localStorage.getItem("sotarium_user_key");
      if (savedKey) return [1, 2];
      const step2 = localStorage.getItem("sotarium_step2_done") === "true";
      if (step2) return [1, 2];
      const step1 = localStorage.getItem("sotarium_step1_done") === "true";
      if (step1) return [1];
    } catch {
      // ignore
    }
    return [];
  });

  const [generatedKey, setGeneratedKey] = useState<string>(() => {
    try {
      const savedExpiresAt = localStorage.getItem("sotarium_key_expires_at");
      if (savedExpiresAt && parseInt(savedExpiresAt, 10) <= Date.now()) {
        return "";
      }
      return localStorage.getItem("sotarium_user_key") || "";
    } catch {
      return "";
    }
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => {
    try {
      const savedExpiresAt = localStorage.getItem("sotarium_key_expires_at");
      if (savedExpiresAt) {
        const remaining = parseInt(savedExpiresAt, 10) - Date.now();
        return Math.max(0, remaining);
      }
    } catch {
      // ignore
    }
    return 24 * 60 * 60 * 1000;
  });

  const handleKeyGeneration = async () => {
    if (generatedKey) return;
    setIsGenerating(true);
    try {
      const newKey = generateFinalKeyString();
      const expiresAtTimestamp = Date.now() + 24 * 60 * 60 * 1000;
      const expiresAtIso = new Date(expiresAtTimestamp).toISOString();

      await saveKeyToDatabase(newKey, provider.name, expiresAtIso, false);

      setGeneratedKey(newKey);
      setTimeLeftMs(24 * 60 * 60 * 1000);
      localStorage.setItem("sotarium_user_key", newKey);
      localStorage.setItem("sotarium_key_expires_at", expiresAtTimestamp.toString());
      localStorage.setItem("sotarium_step1_done", "true");
      localStorage.setItem("sotarium_step2_done", "true");
    } catch (err) {
      console.error("Key generation error:", err);
      const fallbackKey = generateFinalKeyString();
      const expiresAtTimestamp = Date.now() + 24 * 60 * 60 * 1000;
      setGeneratedKey(fallbackKey);
      setTimeLeftMs(24 * 60 * 60 * 1000);
      localStorage.setItem("sotarium_user_key", fallbackKey);
      localStorage.setItem("sotarium_key_expires_at", expiresAtTimestamp.toString());
      localStorage.setItem("sotarium_step1_done", "true");
      localStorage.setItem("sotarium_step2_done", "true");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const rawPath = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);

    const existingKey = localStorage.getItem("sotarium_user_key");
    const savedExpiresAt = localStorage.getItem("sotarium_key_expires_at");

    if (existingKey && savedExpiresAt && parseInt(savedExpiresAt, 10) > Date.now()) {
      setGeneratedKey(existingKey);
      setCompletedSteps([1, 2]);
      if (search || rawPath !== "/key/workink") {
        window.history.replaceState({}, "", "/key/workink");
      }
      return;
    }

    let pathToken = "";
    if (rawPath.startsWith("/workink/") && rawPath.length > "/workink/".length) {
      pathToken = rawPath.replace("/workink/", "").trim();
    } else if (rawPath.startsWith("/key/workink/") && rawPath.length > "/key/workink/".length) {
      pathToken = rawPath.replace("/key/workink/", "").trim();
    }

    const incomingToken = pathToken || params.get("token") || params.get("t") || "";
    const isStep2Explicit = params.get("step") === "2" || params.has("complete") || params.has("verify2");
    const hasIncomingQuery = Boolean(search || pathToken || rawPath === "/verify" || rawPath === "/workink");

    if (hasIncomingQuery) {
      let usedTokens: string[] = [];
      try {
        usedTokens = JSON.parse(localStorage.getItem("sotarium_used_tokens") || "[]");
      } catch {
        usedTokens = [];
      }

      if (incomingToken && usedTokens.includes(incomingToken)) {
        setErrorMessage("This verification token has already been used.");
        window.history.replaceState({}, "", "/key/workink");
        return;
      }

      const expectedStep2Token = localStorage.getItem("sotarium_issued_step2_token");
      const expectedStep1Token = localStorage.getItem("sotarium_issued_step1_token");
      const step1Done = localStorage.getItem("sotarium_step1_done") === "true";

      const isTokenMatchStep2 =
        (step1Done || isStep2Explicit) &&
        (incomingToken === expectedStep2Token || (incomingToken.length >= 20 && expectedStep2Token !== null) || isStep2Explicit);

      const isTokenMatchStep1 =
        !step1Done &&
        (incomingToken === expectedStep1Token || (incomingToken.length >= 20 && expectedStep1Token !== null) || params.get("step") === "1");

      if (isTokenMatchStep2) {
        if (incomingToken) {
          usedTokens.push(incomingToken);
          localStorage.setItem("sotarium_used_tokens", JSON.stringify(usedTokens));
        }
        localStorage.removeItem("sotarium_issued_step2_token");
        localStorage.setItem("sotarium_step1_done", "true");
        localStorage.setItem("sotarium_step2_done", "true");
        setCompletedSteps([1, 2]);
        handleKeyGeneration();
      } else if (isTokenMatchStep1) {
        if (incomingToken) {
          usedTokens.push(incomingToken);
          localStorage.setItem("sotarium_used_tokens", JSON.stringify(usedTokens));
        }
        localStorage.removeItem("sotarium_issued_step1_token");
        localStorage.setItem("sotarium_step1_done", "true");
        setCompletedSteps([1]);
      } else {
        setErrorMessage("Invalid or unverified Work.ink token. Please start the checkpoint.");
      }

      window.history.replaceState({}, "", "/key/workink");
    } else {
      const step1Done = localStorage.getItem("sotarium_step1_done") === "true";
      const step2Done = localStorage.getItem("sotarium_step2_done") === "true";
      if (step2Done) {
        setCompletedSteps([1, 2]);
      } else if (step1Done) {
        setCompletedSteps([1]);
      }
    }
  }, []);

  const formatCountdown = (ms: number): string => {
    if (ms <= 0) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!generatedKey) return;

    const tick = () => {
      let savedExpiresAt = localStorage.getItem("sotarium_key_expires_at");
      if (!savedExpiresAt) {
        savedExpiresAt = (Date.now() + 24 * 60 * 60 * 1000).toString();
        localStorage.setItem("sotarium_key_expires_at", savedExpiresAt);
      }
      const remaining = parseInt(savedExpiresAt, 10) - Date.now();
      if (remaining <= 0) {
        setTimeLeftMs(0);
        localStorage.removeItem("sotarium_user_key");
        localStorage.removeItem("sotarium_key_expires_at");
        localStorage.removeItem("sotarium_step1_done");
        localStorage.removeItem("sotarium_step2_done");
        setGeneratedKey("");
        setCompletedSteps([]);
      } else {
        setTimeLeftMs(remaining);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [generatedKey]);

  const handleStartStep = (stepNumber: number) => {
    setErrorMessage("");
    setStepLoading(stepNumber);

    try {
      const secureToken = generateSecureToken(`s${stepNumber}`);
      if (stepNumber === 1) {
        localStorage.setItem("sotarium_issued_step1_token", secureToken);
      } else {
        localStorage.setItem("sotarium_issued_step2_token", secureToken);
      }

      const dest = stepNumber === 1 ? WORKINK_STEP_1 : WORKINK_STEP_2;
      window.location.href = dest;
    } catch (err) {
      console.error("Step error:", err);
      setErrorMessage("Could not launch checkpoint. Please try again.");
      setStepLoading(null);
    }
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetProgress = () => {
    localStorage.removeItem("sotarium_user_key");
    localStorage.removeItem("sotarium_key_expires_at");
    localStorage.removeItem("sotarium_step1_done");
    localStorage.removeItem("sotarium_step2_done");
    localStorage.removeItem("sotarium_issued_step1_token");
    localStorage.removeItem("sotarium_issued_step2_token");
    setGeneratedKey("");
    setCompletedSteps([]);
  };

  const isStep1Done = completedSteps.includes(1);
  const isStep2Done = completedSteps.includes(2);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-8">
      {/* Clean Subtle Dot Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {generatedKey ? (
        /* Original "Free key ready" Floating Panel GUI (Exact commit layout) */
        <div className="relative z-10 w-full max-w-[420px] sm:max-w-[440px] rounded-[26px] bg-[#131317] border border-white/[0.08] backdrop-blur-2xl p-7 flex flex-col gap-5 shadow-2xl text-white">
          <header className="relative flex items-center justify-between">
            <h3 className="text-[19px] font-bold tracking-tight text-[#f2f1f4]">
              Free key ready
            </h3>
            <button
              type="button"
              onClick={onGoHome}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-sm leading-none text-[#8b8b93] transition-colors hover:bg-white/[0.1] hover:text-[#f2f1f4]"
              aria-label="Close"
            >
              ✕
            </button>
          </header>

          <div className="relative flex flex-col items-center text-center gap-4 py-2">
            {/* Pop-in Animated Green Checkmark Badge */}
            <div className="relative flex items-center justify-center my-1">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1AF513] text-white shadow-[0_0_20px_rgba(26,245,19,0.4)]">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <p className="text-sm font-semibold tracking-wide text-[#8b8b93]">
              Your Key
            </p>

            {/* Key Box with Copy functionality */}
            <div className="w-full flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e] p-3.5 font-mono text-base tracking-widest text-[#1AF513] shadow-inner">
              <span className="truncate mr-2 font-bold select-all">{generatedKey}</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3.5 py-1.5 rounded-lg bg-[#1AF513]/20 hover:bg-[#1AF513]/30 text-[#1AF513] text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Live Expiration Countdown */}
            <span className="text-xs text-neutral-400 font-mono">
              Expires in: {formatCountdown(timeLeftMs)}
            </span>

            {/* Close Button */}
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-6 py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-white active:scale-[0.98]"
            >
              Close
            </button>

            {/* Obtain a new key button */}
            <button
              type="button"
              onClick={resetProgress}
              className="text-xs font-medium text-[#8b8b93] hover:text-[#f2f1f4] transition-colors cursor-pointer pt-1"
            >
              Obtain a new key
            </button>
          </div>
        </div>
      ) : (
        /* Main Unlock Key Modal Container */
        <div className="relative z-10 w-full max-w-[400px] sm:max-w-[430px] rounded-2xl bg-[#121215]/95 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl text-left">
          {/* Header with Circular Work.ink Icon, Title, and Close Button */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00B27A] flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                W
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                  Unlock your key
                </h2>
                <span className="text-xs text-neutral-400 font-medium leading-tight">
                  Method: {provider.name}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoHome}
              className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Progress Step Bar on Top */}
          <div className="w-full flex items-center justify-between px-2 relative my-1">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1.5px] bg-white/[0.1] z-0">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: isStep2Done ? "100%" : isStep1Done ? "50%" : "0%" }}
              />
            </div>

            {/* Step 1 Node */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold relative z-10 transition-all duration-300 ${
                isStep1Done
                  ? "bg-white text-black shadow-sm"
                  : "bg-white text-black shadow-sm scale-105"
              }`}
            >
              1
            </div>

            {/* Step 2 Node */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold relative z-10 transition-all duration-300 ${
                isStep2Done
                  ? "bg-white text-black shadow-sm"
                  : isStep1Done
                  ? "bg-white text-black shadow-sm scale-105"
                  : "bg-[#18181b] text-neutral-500 border border-white/[0.08]"
              }`}
            >
              2
            </div>
          </div>

          {/* Error Alert Box if any */}
          {errorMessage && (
            <div className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center font-medium shadow-sm">
              {errorMessage}
            </div>
          )}

          {/* Inner Card Section */}
          <div className="w-full rounded-xl bg-[#09090b] border border-white/[0.06] p-5 flex flex-col items-center text-center gap-4 shadow-inner">
            {isGenerating ? (
              <div className="w-full py-4 flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-medium text-neutral-300">Generating key...</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-neutral-300 whitespace-nowrap">
                  Complete two Work.ink checkpoints to receive your 24-hour key.
                </p>

                {!isStep1Done ? (
                  <button
                    type="button"
                    disabled={stepLoading !== null}
                    onClick={() => handleStartStep(1)}
                    className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-[0.98] cursor-pointer"
                  >
                    {stepLoading === 1 ? "Loading..." : "Start Step"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={stepLoading !== null}
                    onClick={() => handleStartStep(2)}
                    className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-[0.98] cursor-pointer animate-in fade-in zoom-in-95"
                  >
                    {stepLoading === 2 ? "Loading..." : "Start Step"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-[0.99]"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
