import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Clock, Copy, Loader2 } from "lucide-react";
import { saveKeyToDatabase } from "../lib/supabase";
import type { LogEntry } from "./LogsPage";

type ProviderKind = "lootlabs" | "earnpaste" | "workink";

interface EarnpasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName?: string;
  providerIcon?: string;
  providerKind?: ProviderKind;
  initialStep?: number;
  comebackStep?: number;
  earnpasteAction?: "upgrade" | "completed" | null;
  earnpasteSession?: string | null;
  workinkSession?: string | null;
  workinkStep?: number | null;
  workinkToken?: string | null;
}

interface ProviderApiResponse {
  url?: string;
  session?: string;
  step?: number;
  accepted?: boolean;
  error?: string;
  retry_after?: number;
}

const TOTAL_STEPS = 2;
const EARNPASTE_ICON =
  "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj";

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const generateFinalKeyString = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const group = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${group()}-${group()}-${group()}`;
};

const createLootlabsUrl = async (destinationUrl: string, step: number): Promise<string | null> => {
  try {
    const response = await fetch("/api/lootlabs-proxy?action=create_link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Sotarium Checkpoint ${step}`,
        destinationUrl,
        tierId: 1,
        numberOfTasks: 1,
      }),
    });
    const data = await response.json();
    return typeof data?.lootUrl === "string" && data.lootUrl.startsWith("http") ? data.lootUrl : null;
  } catch {
    return null;
  }
};

const callEarnpasteApi = async (
  action: "start" | "rotate" | "complete",
  session?: string,
): Promise<ProviderApiResponse> => {
  const response = await fetch(`/api/earnpaste?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session ? { session } : {}),
  });
  const data = (await response.json().catch(() => ({}))) as ProviderApiResponse;
  if (!response.ok) {
    throw new Error(data.error || "Earnpaste could not complete this request.");
  }
  return data;
};

const callWorkinkApi = async (
  action: "start" | "verify",
  payload: Record<string, string | number> = {},
): Promise<ProviderApiResponse> => {
  const response = await fetch(`/api/workink?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as ProviderApiResponse;
  if (!response.ok) {
    throw new Error(data.error || "Work.ink could not complete this request.");
  }
  return data;
};

const ProviderIcon: React.FC<{ name: string; iconUrl?: string; className?: string }> = ({
  name,
  iconUrl,
  className = "h-[42px] w-[42px]",
}) => {
  const [failed, setFailed] = useState(false);
  if (!iconUrl || failed) {
    return <div className={`${className} rounded-full bg-[#181820] border border-white/10 flex items-center justify-center text-white font-black`}>{name.slice(0, 1)}</div>;
  }
  return (
    <div className={`${className} rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#181820]`}>
      <img src={iconUrl} alt={name} className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    </div>
  );
};

export const EarnpasteModal: React.FC<EarnpasteModalProps> = ({
  isOpen,
  onClose,
  providerName = "Earnpaste",
  providerIcon = EARNPASTE_ICON,
  providerKind = "earnpaste",
  initialStep = 1,
  comebackStep = 0,
  earnpasteAction = null,
  earnpasteSession = null,
  workinkSession = null,
  workinkStep = null,
  workinkToken = null,
}) => {
  const isEarnpaste = providerKind === "earnpaste";
  const isWorkink = providerKind === "workink";
  const hasWorkinkReturn = Boolean(workinkSession && workinkToken && (workinkStep === 1 || workinkStep === 2));
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [adBlockerAcknowledged, setAdBlockerAcknowledged] = useState(!isWorkink || hasWorkinkReturn);
  const handledWorkinkReturn = useRef<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyExpiry, setKeyExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  const resetUrl = () => window.history.replaceState({}, "", "/");

  const generateFinalKey = async () => {
    const key = generateFinalKeyString();
    const lifetime = 24 * 60 * 60 * 1000;
    const expiresAt = Date.now() + lifetime;
    setGeneratedKey(key);
    setKeyExpiry(expiresAt);
    setTimeLeft(lifetime);
    await saveKeyToDatabase(key, providerName, new Date(expiresAt).toISOString(), false);
  };

  const finishStep = async (step: number) => {
    setCompletedSteps((previous) => Array.from(new Set([...previous, step])));
    setStatusMessage(`Step ${step} verified.`);
    if (step >= TOTAL_STEPS) {
      await generateFinalKey();
      return;
    }
    setCurrentStep(step + 1);
  };

  const handleEarnpasteReturn = async (action: "upgrade" | "completed", session: string) => {
    setIsRedirecting(false);
    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);
    resetUrl();

    try {
      if (action === "upgrade") {
        const result = await callEarnpasteApi("rotate", session);
        if (!result.url) throw new Error("Earnpaste did not return the step 2 link.");
        sessionStorage.setItem("sotarium_earnpaste_session", session);
        setStatusMessage("Step 1 verified. Rotating to step 2...");
        setIsVerifying(false);
        setIsRedirecting(true);
        window.location.assign(result.url);
        return;
      }

      await callEarnpasteApi("complete", session);
      sessionStorage.removeItem("sotarium_earnpaste_session");
      await finishStep(2);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not verify the Earnpaste step.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleWorkinkReturn = async (session: string, step: number, token: string) => {
    setIsRedirecting(false);
    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);
    resetUrl();

    try {
      const result = await callWorkinkApi("verify", { session, step, token });
      if (step === 1) {
        if (!result.url) throw new Error("Work.ink did not return the step 2 link.");
        sessionStorage.setItem("sotarium_workink_session", session);
        setCompletedSteps([1]);
        setCurrentStep(2);
        setStatusMessage("Step 1 verified. Opening step 2...");
        setIsVerifying(false);
        setIsRedirecting(true);
        window.location.assign(result.url);
        return;
      }

      sessionStorage.removeItem("sotarium_workink_session");
      setCompletedSteps([1]);
      await finishStep(2);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not verify the Work.ink checkpoint.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !isEarnpaste || !earnpasteAction || !earnpasteSession) return;
    void handleEarnpasteReturn(earnpasteAction, earnpasteSession);
  }, [isOpen, isEarnpaste, earnpasteAction, earnpasteSession]);

  useEffect(() => {
    if (!isOpen || !isWorkink || !workinkSession || !workinkToken || (workinkStep !== 1 && workinkStep !== 2)) return;
    const returnKey = `${workinkSession}:${workinkStep}:${workinkToken}`;
    if (handledWorkinkReturn.current === returnKey) return;
    handledWorkinkReturn.current = returnKey;
    setAdBlockerAcknowledged(true);
    void handleWorkinkReturn(workinkSession, workinkStep, workinkToken);
  }, [isOpen, isWorkink, workinkSession, workinkStep, workinkToken]);

  useEffect(() => {
    if (!isOpen || isEarnpaste || isWorkink || comebackStep < 1) return;
    setIsVerifying(true);
    setErrorMessage(null);
    resetUrl();
    const timer = window.setTimeout(() => {
      void finishStep(comebackStep);
      setIsVerifying(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [isOpen, isEarnpaste, isWorkink, comebackStep]);

  useEffect(() => {
    if (!keyExpiry) return;
    const interval = window.setInterval(() => {
      const remaining = keyExpiry - Date.now();
      setTimeLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        setGeneratedKey(null);
        setKeyExpiry(null);
        window.clearInterval(interval);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [keyExpiry]);

  const startCheckpoint = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsRedirecting(true);

    try {
      if (isEarnpaste) {
        const result = await callEarnpasteApi("start");
        if (!result.url || !result.session) throw new Error("Earnpaste did not return a step 1 link.");
        sessionStorage.setItem("sotarium_earnpaste_session", result.session);
        window.location.assign(result.url);
        return;
      }

      if (isWorkink) {
        if (!adBlockerAcknowledged) {
          setIsRedirecting(false);
          return;
        }
        const result = await callWorkinkApi("start");
        if (!result.url || !result.session) throw new Error("Work.ink did not return a step 1 link.");
        sessionStorage.setItem("sotarium_workink_session", result.session);
        window.location.assign(result.url);
        return;
      }

      const returnUrl = `${window.location.origin}/lootlabs?verify${currentStep}`;
      const lootUrl = await createLootlabsUrl(returnUrl, currentStep);
      if (!lootUrl) throw new Error("Could not create the Lootlabs link. Please try again.");
      window.location.assign(lootUrl);
    } catch (error) {
      setIsRedirecting(false);
      setErrorMessage(error instanceof Error ? error.message : "Could not start the checkpoint.");
    }
  };

  const resetProgress = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setIsRedirecting(false);
    setIsVerifying(false);
    setStatusMessage(null);
    setErrorMessage(null);
    setGeneratedKey(null);
    setKeyExpiry(null);
    setTimeLeft(0);
    handledWorkinkReturn.current = null;
    sessionStorage.removeItem("sotarium_earnpaste_session");
    sessionStorage.removeItem("sotarium_workink_session");
    if (isWorkink && !hasWorkinkReturn) setAdBlockerAcknowledged(false);
    resetUrl();
  };

  const copyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const isUnlocked = generatedKey !== null;
  const showAdBlockerNotice = isWorkink && !adBlockerAcknowledged && !hasWorkinkReturn && !isUnlocked;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b] text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      {!isUnlocked ? (
        <div role="dialog" aria-modal="true" className="relative z-10 flex w-[440px] max-w-full flex-col gap-6 rounded-[26px] border border-white/[0.08] bg-[#121215] p-7 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <ProviderIcon name={providerName} iconUrl={providerIcon} />
              <div>
                <h2 className="text-[19px] font-bold tracking-tight">Unlock your key</h2>
                <p className="text-xs text-zinc-400">Method: {providerName}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1] hover:text-white">✕</button>
          </div>

          <div className="flex items-center gap-2.5 px-0.5">
            {[1, 2].map((step) => {
              const complete = completedSteps.includes(step);
              const active = currentStep === step && !complete;
              return (
                <React.Fragment key={step}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${complete ? "bg-[#1AF513] text-white" : active ? "bg-white text-[#141417]" : "border border-white/[0.08] bg-[#1a1a1e] text-zinc-500"}`}>
                    {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
                  </div>
                  {step < TOTAL_STEPS && <div className={`h-[2px] flex-1 rounded-full ${complete ? "bg-[#1AF513]" : "bg-white/[0.08]"}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-[18px] border border-white/[0.06] bg-white/[0.025] p-6 text-center">
            {errorMessage ? (
              <div className="flex flex-col items-center gap-3 text-rose-400">
                <AlertCircle className="h-8 w-8" />
                <p className="text-sm font-semibold">{errorMessage}</p>
                <button type="button" onClick={resetProgress} className="text-xs text-zinc-300 underline hover:text-white">Start again</button>
              </div>
            ) : isRedirecting || isVerifying ? (
              <div className="flex flex-col items-center gap-3 text-zinc-300">
                <Loader2 className="h-8 w-8 animate-spin text-[#1AF513]" />
                <p className="text-sm font-semibold">{statusMessage || (isRedirecting ? `Opening ${providerName}...` : "Verifying your completed step...")}</p>
              </div>
            ) : statusMessage ? (
              <div className="flex flex-col items-center gap-3 text-[#1AF513]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1AF513]"><Check className="h-6 w-6 text-white" strokeWidth={3} /></div>
                <p className="text-sm font-bold">{statusMessage}</p>
                <button type="button" onClick={startCheckpoint} className="w-full rounded-full border border-white bg-white px-5 py-3 text-sm font-semibold text-[#141417] hover:bg-zinc-100">Start step {currentStep} of {TOTAL_STEPS}</button>
              </div>
            ) : (
              <div className="w-full">
                <p className="mb-4 text-sm text-zinc-300">Complete two {providerName} checkpoints to receive your 24-hour key.</p>
                <button type="button" onClick={startCheckpoint} className="w-full rounded-full border border-white bg-white px-5 py-3.5 text-sm font-semibold text-[#141417] shadow-lg hover:bg-zinc-100">Start checkpoint (Step {currentStep}/{TOTAL_STEPS})</button>
              </div>
            )}
          </div>

            <button type="button" onClick={onClose} disabled={isRedirecting || isVerifying} className="rounded-full border border-white/[0.07] p-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50">Cancel</button>

            {showAdBlockerNotice && (
              <div role="alertdialog" aria-modal="true" aria-labelledby="adblocker-title" className="absolute inset-0 z-30 flex flex-col justify-center rounded-[26px] bg-[#121215]/[0.98] p-7 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
                  <AlertCircle className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h3 id="adblocker-title" className="text-xl font-black tracking-tight">Universal Ad Blocker</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">To load the Work.ink Opera Browser offer, please temporarily disable any ad blocker for Work.ink. Then return here and confirm before you start the checkpoint.</p>
                <p className="mt-3 text-xs leading-5 text-zinc-500">This notice does not install anything or change your browser settings. You choose whether to continue.</p>
                <button type="button" onClick={() => setAdBlockerAcknowledged(true)} className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-[#141417] hover:bg-zinc-100">I’ve disabled my ad blocker</button>
                <button type="button" onClick={onClose} className="mt-3 w-full rounded-full border border-white/[0.10] px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/[0.05] hover:text-white">Cancel</button>
              </div>
            )}
          </div>
      ) : (
        <div className="relative z-10 flex w-[440px] max-w-full flex-col gap-5 rounded-[26px] border border-white/[0.08] bg-[#121215] p-7 text-white shadow-2xl">
          <header className="flex items-center justify-between"><h3 className="text-[19px] font-bold">Your Free Key Is Ready</h3><button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">✕</button></header>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1AF513]"><Check className="h-7 w-7" strokeWidth={3} /></div>
            <p className="text-sm font-semibold text-zinc-400">Your key</p>
            <div className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e] p-3.5 font-mono text-base font-bold tracking-widest text-[#1AF513]"><span className="truncate mr-2 select-all">{generatedKey}</span><button type="button" onClick={copyKey} className="flex items-center gap-1 rounded-lg bg-[#1AF513]/20 px-3 py-1.5 text-xs font-bold text-[#1AF513] hover:bg-[#1AF513]/30"><Copy className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}</button></div>
            {timeLeft > 0 && <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400"><Clock className="h-3.5 w-3.5 text-[#1AF513]" />Valid for: <strong className="text-[#1AF513]">{formatCountdown(timeLeft)}</strong></div>}
            <button type="button" onClick={onClose} className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#141417] hover:bg-zinc-100">Close</button>
            <button type="button" onClick={resetProgress} className="text-xs text-zinc-400 hover:text-white">Obtain a new key</button>
          </div>
        </div>
      )}
    </div>
  );
};
