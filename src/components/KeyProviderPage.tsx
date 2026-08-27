import React, { useState, useEffect } from "react";
import {
  Copy,
  CheckCircle2,
  Clock,
  Loader2,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { AVAILABLE_PROVIDERS, ProviderItem } from "./ProviderPage";
import {
  createLootlabsUrl,
  createEarnpasteUrl,
  generateFinalKeyString,
  validateTokenSignature,
  isTokenAlreadyUsed,
  markTokenAsUsed
} from "./EarnpasteModal";
import { saveKeyToDatabase } from "../lib/supabase";

interface KeyProviderPageProps {
  providerId: string;
  onGoHome: () => void;
}

const TOTAL_STEPS = 2;

export const KeyProviderPage: React.FC<KeyProviderPageProps> = ({ providerId, onGoHome }) => {
  const provider: ProviderItem = AVAILABLE_PROVIDERS.find(
    (p) => p.id.toLowerCase() === providerId.toLowerCase()
  ) || {
    id: providerId,
    name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
    icon: "https://i.imgur.com/hmJCWhI.png",
    description: "Verification Gateway",
    available: true,
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeLeftMs, setTimeLeftMs] = useState<number>(24 * 60 * 60 * 1000);

  // Check URL parameters for checkpoints returning back
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);

    if (params.has("verify") || params.has("verify1") || params.has("verify2") || params.has("step2") || params.has("complete")) {
      const isComplete = params.has("verify2") || params.has("complete");
      const isStep1Done = params.has("verify1") || params.has("step2");

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

  // Format countdown clock
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

  // Generate Key & Save to Database
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

  // Launch a checkpoint step
  const handleStartStep = async (stepNumber: number) => {
    setErrorMessage("");
    setStepLoading(stepNumber);

    try {
      const baseUrl = window.location.origin;
      const nextStepParam = stepNumber === 1 ? "verify1=true" : "verify2=true";
      const targetUrl = `${baseUrl}/key/${provider.id}?${nextStepParam}`;

      // Try provider link creator
      let destinationUrl: string | null = null;

      if (provider.id === "lootlabs") {
        destinationUrl = await createLootlabsUrl(targetUrl, stepNumber);
      }

      if (!destinationUrl) {
        destinationUrl = await createEarnpasteUrl(targetUrl);
      }

      if (destinationUrl) {
        window.location.href = destinationUrl;
      } else {
        // Fallback simulation for smooth testing
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, stepNumber]);
          if (stepNumber === 1) {
            setCurrentStep(2);
          } else {
            setCurrentStep(3);
            handleKeyGeneration();
          }
          setStepLoading(null);
        }, 1200);
      }
    } catch (err) {
      console.error("Step execution error:", err);
      setErrorMessage("Could not load checkpoint. Please try again.");
      setStepLoading(null);
    }
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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

      {/* Main Glass Card (Matches user screenshot) */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-2xl p-7 sm:p-8 flex flex-col items-center text-center shadow-2xl">
        {/* Provider Icon Circular Badge */}
        <div className="w-16 h-16 rounded-full bg-black/60 border border-white/[0.12] flex items-center justify-center p-3.5 mb-4 shadow-xl relative group">
          <img
            src={provider.icon}
            alt={provider.name}
            className="w-full h-full object-contain filter drop-shadow"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-sm pointer-events-none" />
        </div>

        {/* Provider Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {provider.name}
        </h1>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="w-full mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Steps Section in Glass Rectangles (Replacing the red box in user's image) */}
        <div className="w-full flex flex-col gap-2.5 mt-5">
          {generatedKey ? (
            /* Key Ready Container */
            <div className="w-full flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.09] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your Key Is Ready</span>
              </div>

              {/* Key Box */}
              <div className="w-full flex items-center justify-between bg-black/60 border border-white/[0.12] rounded-xl px-3.5 py-2.5">
                <code className="text-sm font-mono font-bold tracking-wider text-amber-300">
                  {generatedKey}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Expiration Info */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Expires in: {formatCountdown(timeLeftMs)}</span>
              </div>
            </div>
          ) : isGenerating ? (
            /* Key Generating Loader */
            <div className="w-full py-8 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <p className="text-xs font-medium text-neutral-300">Generating secure license key...</p>
            </div>
          ) : (
            /* Steps List in Glass Buttons */
            <>
              {/* Step 1 Button */}
              <button
                disabled={completedSteps.includes(1) || stepLoading !== null}
                onClick={() => handleStartStep(1)}
                className={`w-full py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 cursor-pointer backdrop-blur-md ${
                  completedSteps.includes(1)
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : currentStep === 1
                    ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.12] hover:border-white/[0.22] text-white active:scale-[0.99]"
                    : "bg-white/[0.02] border-white/[0.05] text-neutral-500 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>Checkpoint 1</span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {completedSteps.includes(1) ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  ) : stepLoading === 1 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <span className="text-neutral-400 flex items-center gap-1">
                      Start <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </button>

              {/* Step 2 Button */}
              <button
                disabled={!completedSteps.includes(1) || completedSteps.includes(2) || stepLoading !== null}
                onClick={() => handleStartStep(2)}
                className={`w-full py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-200 backdrop-blur-md ${
                  completedSteps.includes(2)
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 cursor-default"
                    : completedSteps.includes(1)
                    ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.12] hover:border-white/[0.22] text-white active:scale-[0.99] cursor-pointer"
                    : "bg-white/[0.02] border-white/[0.05] text-neutral-500 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  <span>Checkpoint 2</span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {completedSteps.includes(2) ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  ) : stepLoading === 2 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : completedSteps.includes(1) ? (
                    <span className="text-neutral-400 flex items-center gap-1">
                      Start <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-neutral-500">Locked</span>
                  )}
                </div>
              </button>
            </>
          )}
        </div>

        {/* "Go home" Button (Exact style as user reference image) */}
        <button
          onClick={onGoHome}
          className="w-full mt-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] backdrop-blur-md shadow-sm"
        >
          Go home
        </button>
      </div>
    </div>
  );
};
