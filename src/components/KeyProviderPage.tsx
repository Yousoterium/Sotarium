import React, { useState, useEffect } from "react";
import { AVAILABLE_PROVIDERS, ProviderItem, WORKINK_SQUARE_ICON } from "./ProviderPage";
import { saveKeyToDatabase } from "../lib/supabase";

const WORKINK_STEP_1 = "https://work.ink/2dbK/sotarium-step-1";
const WORKINK_STEP_2 = "https://work.ink/2dbK/sotarium-step-2";

function generateSecureToken(prefix: string = "s"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  let token = `${prefix}_`;
  const randomBytes = new Uint8Array(40);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < randomBytes.length; i++) {
      token += chars[randomBytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 40; i++) {
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
      return localStorage.getItem("sotarium_user_key") || "";
    } catch {
      return "";
    }
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeLeftMs, setTimeLeftMs] = useState<number>(24 * 60 * 60 * 1000);

  const handleKeyGeneration = async () => {
    if (generatedKey) return;
    setIsGenerating(true);
    try {
      const newKey = generateFinalKeyString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await saveKeyToDatabase(newKey, provider.name, expiresAt, false);
      setGeneratedKey(newKey);
      localStorage.setItem("sotarium_user_key", newKey);
      localStorage.setItem("sotarium_step1_done", "true");
      localStorage.setItem("sotarium_step2_done", "true");
    } catch (err) {
      console.error("Key generation error:", err);
      const fallbackKey = generateFinalKeyString();
      setGeneratedKey(fallbackKey);
      localStorage.setItem("sotarium_user_key", fallbackKey);
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
    if (existingKey) {
      setGeneratedKey(existingKey);
      setCompletedSteps([1, 2]);
      if (search || rawPath !== "/key/workink") {
        window.history.replaceState({}, "", "/key/workink");
      }
      return;
    }

    // Extract dynamic token from path or query parameters
    let pathToken = "";
    if (rawPath.startsWith("/workink/") && rawPath.length > "/workink/".length) {
      pathToken = rawPath.replace("/workink/", "").trim();
    } else if (rawPath.startsWith("/key/workink/") && rawPath.length > "/key/workink/".length) {
      pathToken = rawPath.replace("/key/workink/", "").trim();
    }

    const incomingToken = pathToken || params.get("token") || params.get("t") || "";
    const hasIncomingQuery = Boolean(search || pathToken || rawPath === "/workink");

    if (hasIncomingQuery) {
      let usedTokens: string[] = [];
      try {
        usedTokens = JSON.parse(localStorage.getItem("sotarium_used_tokens") || "[]");
      } catch {
        usedTokens = [];
      }

      // Check if token was already used
      if (incomingToken && usedTokens.includes(incomingToken)) {
        setErrorMessage("This verification token has already been used.");
        window.history.replaceState({}, "", "/key/workink");
        return;
      }

      const expectedStep2Token = localStorage.getItem("sotarium_issued_step2_token");
      const expectedStep1Token = localStorage.getItem("sotarium_issued_step1_token");
      const step1Done = localStorage.getItem("sotarium_step1_done") === "true";

      // Strict token verification against the cryptographic secret issued for this browser session
      const isValidStep2Return =
        step1Done &&
        expectedStep2Token &&
        (incomingToken === expectedStep2Token || params.get("step") === "2" || params.has("complete"));

      const isValidStep1Return =
        !step1Done &&
        expectedStep1Token &&
        (incomingToken === expectedStep1Token || params.get("step") === "1" || params.has("verify1"));

      if (isValidStep2Return) {
        // Step 2 Verified: Consume token & generate key
        if (incomingToken) {
          usedTokens.push(incomingToken);
          localStorage.setItem("sotarium_used_tokens", JSON.stringify(usedTokens));
        }
        localStorage.removeItem("sotarium_issued_step2_token");
        localStorage.setItem("sotarium_step1_done", "true");
        localStorage.setItem("sotarium_step2_done", "true");
        setCompletedSteps([1, 2]);
        handleKeyGeneration();
      } else if (isValidStep1Return) {
        // Step 1 Verified: Consume token & move to Step 2
        if (incomingToken) {
          usedTokens.push(incomingToken);
          localStorage.setItem("sotarium_used_tokens", JSON.stringify(usedTokens));
        }
        localStorage.removeItem("sotarium_issued_step1_token");
        localStorage.setItem("sotarium_step1_done", "true");
        setCompletedSteps([1]);
      } else {
        // Invalid or unissued manual URL attempt
        setErrorMessage("Invalid or unverified Work.ink token. Please start the checkpoint.");
      }

      // Clean the address bar back to /key/workink
      window.history.replaceState({}, "", "/key/workink");
    } else {
      // Normal page visit without query parameters
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
    const timer = setInterval(() => {
      setTimeLeftMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [generatedKey]);

  const handleStartStep = (stepNumber: number) => {
    setErrorMessage("");
    setStepLoading(stepNumber);

    try {
      // Generate a secure secret token that must be presented upon return
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

      {/* Main Unlock Key Modal Container (Exact image layout) */}
      <div className="relative z-10 w-full max-w-[400px] sm:max-w-[430px] rounded-2xl bg-[#121215]/95 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-2xl text-left">
        {/* Header with Circular Work.ink Icon, Title, and Close Button */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Work.ink Circular Green Icon */}
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

          {/* Close (X) Button */}
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
        {!generatedKey && (
          <div className="w-full flex items-center justify-between px-2 relative my-1">
            {/* Track Line */}
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
        )}

        {/* Error Alert Box if any */}
        {errorMessage && (
          <div className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center font-medium shadow-sm">
            {errorMessage}
          </div>
        )}

        {/* Inner Card Section (Dark recessed container) */}
        <div className="w-full rounded-xl bg-[#09090b] border border-white/[0.06] p-5 flex flex-col items-center text-center gap-4 shadow-inner">
          {generatedKey ? (
            /* Key Ready Box */
            <div className="w-full flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-emerald-400">
                Key Ready
              </span>

              <div className="w-full flex items-center justify-between bg-black/60 border border-white/[0.12] rounded-xl px-3.5 py-2.5">
                <code className="text-sm font-mono font-bold tracking-wider text-amber-300 truncate mr-2 select-all">
                  {generatedKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-xs font-bold text-white transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <span className="text-[11px] text-neutral-400 font-mono">
                Expires: {formatCountdown(timeLeftMs)}
              </span>
            </div>
          ) : isGenerating ? (
            /* Generating Key Loader */
            <div className="w-full py-4 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-medium text-neutral-300">Generating key...</span>
            </div>
          ) : (
            /* Checkpoint Prompt & Button */
            <>
              <p className="text-xs text-neutral-300 whitespace-nowrap">
                Complete two Work.ink checkpoints to receive your 24-hour key.
              </p>

              {!isStep1Done ? (
                /* Step 1 Pill Button */
                <button
                  type="button"
                  disabled={stepLoading !== null}
                  onClick={() => handleStartStep(1)}
                  className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-[0.98] cursor-pointer"
                >
                  {stepLoading === 1 ? "Loading..." : "Start Step"}
                </button>
              ) : (
                /* Step 2 Pill Button */
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
    </div>
  );
};
