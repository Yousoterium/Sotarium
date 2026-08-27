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

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeLeftMs, setTimeLeftMs] = useState<number>(24 * 60 * 60 * 1000);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);

    if (params.has("verify") || params.has("verify1") || params.has("verify2") || params.has("step2") || params.has("complete") || params.has("t")) {
      const isComplete = params.has("verify2") || params.has("complete");
      const isStep1Done = params.has("verify1") || params.has("step2") || params.has("t");

      if (isComplete) {
        setCompletedSteps([1, 2]);
        setCurrentStep(3);
        handleKeyGeneration();
      } else if (isStep1Done) {
        setCompletedSteps([1]);
        setCurrentStep(2);
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

  const handleStartStep = (stepNumber: number) => {
    setErrorMessage("");
    setStepLoading(stepNumber);

    try {
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#000] text-white flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-8">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ultra-Transparent Glass Container (High transparency + Solid gray outline) */}
      <div
        className="relative z-10 w-full max-w-[360px] sm:max-w-[380px] p-7 sm:p-8 flex flex-col items-center text-center transition-all duration-200"
        style={{
          background: "rgba(255, 255, 255, 0.015)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: "20px",
          WebkitBackdropFilter: "blur(12px) saturate(1.2)",
          backdropFilter: "blur(12px) saturate(1.2)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 30px 70px -30px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Floating Work.ink Icon */}
        <div className="mb-3.5 flex items-center justify-center">
          <img
            src={provider.icon}
            alt={provider.name}
            className="w-12 h-12 rounded-[12px] object-cover drop-shadow-md"
          />
        </div>

        {/* Provider Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          {provider.name}
        </h1>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="w-full mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Steps Section in Ultra-Transparent Glass Rectangles with Gray Outline */}
        <div className="w-full flex flex-col gap-2.5">
          {generatedKey ? (
            /* Key Ready Glass Box */
            <div
              className="w-full flex flex-col items-center gap-2.5 p-4 rounded-[14px]"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                WebkitBackdropFilter: "blur(10px)",
                backdropFilter: "blur(10px)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <span className="text-xs font-bold text-emerald-400">
                Key Ready
              </span>

              <div
                className="w-full flex items-center justify-between rounded-xl px-3 py-2"
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                }}
              >
                <code className="text-sm font-mono font-bold text-amber-300 truncate mr-2 select-all">
                  {generatedKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-xs font-bold text-white transition-all cursor-pointer shrink-0"
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
            <div
              className="w-full py-6 flex flex-col items-center justify-center gap-2 rounded-[14px]"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <span className="text-xs font-medium text-neutral-300">Generating key...</span>
            </div>
          ) : (
            /* Steps Rectangular Buttons */
            <>
              {/* Checkpoint 1 */}
              <button
                type="button"
                disabled={completedSteps.includes(1) || stepLoading !== null}
                onClick={() => handleStartStep(1)}
                className={`w-full py-3.5 px-4 rounded-[12px] text-xs sm:text-sm font-medium flex items-center justify-between transition-all duration-150 ${
                  completedSteps.includes(1)
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-default"
                    : currentStep === 1
                    ? "text-white cursor-pointer active:scale-[0.99] hover:bg-white/[0.05] hover:border-white/[0.24]"
                    : "text-neutral-500 cursor-not-allowed"
                }`}
                style={{
                  background: completedSteps.includes(1) ? undefined : "rgba(255, 255, 255, 0.025)",
                  border: completedSteps.includes(1) ? undefined : "1px solid rgba(255, 255, 255, 0.15)",
                  WebkitBackdropFilter: "blur(10px)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="font-semibold">Checkpoint 1</span>
                <span className="text-xs text-neutral-400 font-medium">
                  {completedSteps.includes(1) ? "Done" : stepLoading === 1 ? "Loading..." : "Start"}
                </span>
              </button>

              {/* Checkpoint 2 */}
              <button
                type="button"
                disabled={!completedSteps.includes(1) || completedSteps.includes(2) || stepLoading !== null}
                onClick={() => handleStartStep(2)}
                className={`w-full py-3.5 px-4 rounded-[12px] text-xs sm:text-sm font-medium flex items-center justify-between transition-all duration-150 ${
                  completedSteps.includes(2)
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-default"
                    : completedSteps.includes(1)
                    ? "text-white cursor-pointer active:scale-[0.99] hover:bg-white/[0.05] hover:border-white/[0.24]"
                    : "text-neutral-500 cursor-not-allowed"
                }`}
                style={{
                  background: completedSteps.includes(2) ? undefined : "rgba(255, 255, 255, 0.025)",
                  border: completedSteps.includes(2) ? undefined : "1px solid rgba(255, 255, 255, 0.15)",
                  WebkitBackdropFilter: "blur(10px)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="font-semibold">Checkpoint 2</span>
                <span className="text-xs text-neutral-400 font-medium">
                  {completedSteps.includes(2)
                    ? "Done"
                    : stepLoading === 2
                    ? "Loading..."
                    : completedSteps.includes(1)
                    ? "Start"
                    : "Locked"}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Go home Button */}
        <button
          type="button"
          onClick={onGoHome}
          className="w-full mt-4 py-3 rounded-[12px] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] hover:bg-white/[0.05] hover:border-white/[0.24]"
          style={{
            background: "rgba(255, 255, 255, 0.025)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
          }}
        >
          Go home
        </button>
      </div>
    </div>
  );
};
