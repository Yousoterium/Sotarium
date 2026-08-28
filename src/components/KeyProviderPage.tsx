import React, { useState, useEffect } from "react";
import { AVAILABLE_PROVIDERS, ProviderItem, WORKINK_SQUARE_ICON } from "./ProviderPage";
import { saveKeyToDatabase } from "../lib/supabase";

const WORKINK_STEP_1 = "https://work.ink/2dbK/sotarium-step-1";
const WORKINK_STEP_2 = "https://work.ink/2dbK/sotarium-step-2";

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

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string>("");
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
    } catch (err) {
      console.error("Key generation error:", err);
      const fallbackKey = generateFinalKeyString();
      setGeneratedKey(fallbackKey);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const path = window.location.pathname;

    const isDirectWorkinkAttempt =
      path === "/workink" &&
      !params.has("t") &&
      !params.has("token") &&
      !params.has("verify") &&
      !params.has("verify1") &&
      !params.has("verify2") &&
      !params.has("step2") &&
      !params.has("complete") &&
      !sessionStorage.getItem("sotarium_step1_token");

    // If player manually typed /workink without a verified token
    if (isDirectWorkinkAttempt) {
      setErrorMessage("Missing Work.ink verification token.");
      window.history.replaceState({}, "", "/key/workink");
      return;
    }

    const hasStep2Token =
      params.has("complete") ||
      params.has("verify2") ||
      params.get("step") === "2" ||
      params.get("ok") === "2";

    const hasStep1Token =
      (params.has("ok") ||
        params.has("verify") ||
        params.has("verify1") ||
        params.has("step1") ||
        params.has("t") ||
        params.has("token")) &&
      sessionStorage.getItem("sotarium_step1_token") !== null;

    const step1Done = sessionStorage.getItem("sotarium_step1_verified") === "true";

    if (hasStep2Token && step1Done) {
      sessionStorage.setItem("sotarium_step2_verified", "true");
      setCompletedSteps([1, 2]);
      handleKeyGeneration();
    } else if (hasStep1Token && !step1Done) {
      sessionStorage.setItem("sotarium_step1_verified", "true");
      setCompletedSteps([1]);
    } else if (step1Done) {
      setCompletedSteps([1]);
    }

    // Clean URL query parameters
    if (window.location.search || window.location.pathname === "/workink") {
      window.history.replaceState({}, "", "/key/workink");
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
      // Secure token seed to prevent back-button bypass without opening Work.ink
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      if (stepNumber === 1) {
        sessionStorage.setItem("sotarium_step1_token", token);
      } else if (stepNumber === 2) {
        sessionStorage.setItem("sotarium_step2_token", token);
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
            onClick={() => {
              sessionStorage.removeItem("sotarium_step1_token");
              sessionStorage.removeItem("sotarium_step1_verified");
              sessionStorage.removeItem("sotarium_step2_token");
              sessionStorage.removeItem("sotarium_step2_verified");
              onGoHome();
            }}
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
          onClick={() => {
            sessionStorage.removeItem("sotarium_step1_token");
            sessionStorage.removeItem("sotarium_step1_verified");
            sessionStorage.removeItem("sotarium_step2_token");
            sessionStorage.removeItem("sotarium_step2_verified");
            onGoHome();
          }}
          className="w-full py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
