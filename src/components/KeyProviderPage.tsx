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

    const hasCompleteParam =
      params.has("complete") ||
      params.has("verify2") ||
      params.get("step") === "2" ||
      params.get("ok") === "2" ||
      params.has("step2");

    const hasStepParam =
      params.has("ok") ||
      params.has("verify") ||
      params.has("verify1") ||
      params.has("step1") ||
      params.has("step") ||
      params.has("t") ||
      params.has("token") ||
      path.includes("ok");

    const step1WasDone = localStorage.getItem("sotarium_step1_done") === "true";

    if (hasCompleteParam || (hasStepParam && step1WasDone)) {
      localStorage.setItem("sotarium_step1_done", "true");
      localStorage.setItem("sotarium_step2_done", "true");
      setCompletedSteps([1, 2]);
      handleKeyGeneration();
    } else if (hasStepParam) {
      localStorage.setItem("sotarium_step1_done", "true");
      setCompletedSteps([1]);
    } else if (step1WasDone) {
      setCompletedSteps([1]);
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
      if (stepNumber === 1) {
        localStorage.setItem("sotarium_step1_started", "true");
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
      {/* Clean Subtle Dot Grid Background (Same as homepage) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main EarnPaste Glass Card */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-2xl p-7 sm:p-8 flex flex-col items-center text-center shadow-2xl">
        {/* Progress Step Bar on Top */}
        {!generatedKey && (
          <div className="w-full flex items-center justify-between px-6 mb-6 relative">
            {/* Connecting Line Track */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1.5px] bg-white/[0.12] z-0">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: isStep1Done ? "100%" : "0%" }}
              />
            </div>

            {/* Step 1 Circle */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300 ${
                !isStep1Done
                  ? "bg-white text-black shadow-md scale-105"
                  : "bg-white text-black"
              }`}
            >
              1
            </div>

            {/* Step 2 Circle */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300 ${
                isStep1Done && !isStep2Done
                  ? "bg-white text-black shadow-md scale-105"
                  : isStep2Done
                  ? "bg-white text-black"
                  : "bg-[#18181b] text-neutral-500 border border-white/[0.08]"
              }`}
            >
              2
            </div>
          </div>
        )}

        {/* Provider Icon Circular Badge */}
        <div className="w-16 h-16 rounded-full bg-black/60 border border-white/[0.12] flex items-center justify-center p-3 mb-4 shadow-xl relative group">
          <img
            src={provider.icon}
            alt={provider.name}
            className="w-full h-full object-contain rounded-lg drop-shadow"
          />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-sm pointer-events-none" />
        </div>

        {/* Provider Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          {provider.name}
        </h1>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="w-full mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Steps Section in EarnPaste Glass Container */}
        <div className="w-full flex flex-col gap-2.5">
          {generatedKey ? (
            /* Key Ready Box */
            <div className="w-full flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.09] backdrop-blur-md shadow-sm">
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
            /* Generating State */
            <div className="w-full py-6 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-xs font-medium text-neutral-300">Generating key...</span>
            </div>
          ) : !isStep1Done ? (
            /* Checkpoint 1 Button */
            <button
              type="button"
              disabled={stepLoading !== null}
              onClick={() => handleStartStep(1)}
              className="w-full py-3.5 px-4 rounded-xl border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.05] hover:bg-white/[0.1] text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 text-white cursor-pointer active:scale-[0.99] backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.1] flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Checkpoint 1</span>
              </div>
              <span className="text-xs text-neutral-300 font-medium">
                {stepLoading === 1 ? "Loading..." : "Start"}
              </span>
            </button>
          ) : (
            /* Checkpoint 2 Button (Replaces Checkpoint 1 when completed) */
            <button
              type="button"
              disabled={stepLoading !== null}
              onClick={() => handleStartStep(2)}
              className="w-full py-3.5 px-4 rounded-xl border border-white/[0.12] hover:border-white/[0.25] bg-white/[0.05] hover:bg-white/[0.1] text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 text-white cursor-pointer active:scale-[0.99] backdrop-blur-md shadow-sm animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.1] flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>Checkpoint 2</span>
              </div>
              <span className="text-xs text-neutral-300 font-medium">
                {stepLoading === 2 ? "Loading..." : "Start"}
              </span>
            </button>
          )}
        </div>

        {/* Go home Button */}
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("sotarium_step1_done");
            localStorage.removeItem("sotarium_step2_done");
            onGoHome();
          }}
          className="w-full mt-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] backdrop-blur-md shadow-sm"
        >
          Go home
        </button>
      </div>
    </div>
  );
};
