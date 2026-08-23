import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Clock, Copy, Loader2 } from "lucide-react";

type ProviderKind = "lootlabs" | "earnpaste" | "workink" | "opera";
type AdBlockerStatus = "checking" | "clear" | "detected";

interface EarnpasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName?: string;
  providerIcon?: string;
  providerKind?: ProviderKind;
  initialStep?: number;
  lootlabsSession?: string | null;
  lootlabsStep?: number | null;
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
  key?: string;
  expires_at?: string;
  error?: string;
  retry_after?: number;
}

const EARNPASTE_ICON =
  "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj";
const AD_BLOCKER_TEST_URL = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const OPERA_DIRECT_INSTALLER_URL = "https://download.opera.com/download/get/?partner=www&opsys=Windows&download_url=&arch=x64&nothanks=yes";

const formatCountdown = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const callLootlabsApi = async (
  action: "start" | "complete",
  payload: Record<string, string | number> = {},
): Promise<ProviderApiResponse> => {
  const response = await fetch(`/api/lootlabs-proxy?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as ProviderApiResponse;
  if (!response.ok) {
    throw new Error(data.error || "Lootlabs could not complete this request.");
  }
  return data;
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
  action: "start" | "advance",
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
  lootlabsSession = null,
  lootlabsStep = null,
  earnpasteAction = null,
  earnpasteSession = null,
  workinkSession = null,
  workinkStep = null,
  workinkToken = null,
}) => {
  const isEarnpaste = providerKind === "earnpaste";
  const isWorkink = providerKind === "workink";
  const isOpera = providerKind === "opera";
  const totalSteps = isOpera ? 1 : 2;
  const hasWorkinkReturn = Boolean(workinkStep === 1 || workinkStep === 2);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [adBlockerStatus, setAdBlockerStatus] = useState<AdBlockerStatus>(() => (isOpera ? "checking" : "clear"));
  const [adBlockerCheckVersion, setAdBlockerCheckVersion] = useState(0);
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

  const unlockVerifiedKey = (result: ProviderApiResponse) => {
    const key = typeof result.key === "string" ? result.key.trim().toUpperCase() : "";
    const expiresAt = result.expires_at ? new Date(result.expires_at).getTime() : Number.NaN;
    if (!key || !/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(key) || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      throw new Error("The provider verified the checkpoint but did not return a valid key.");
    }

    setGeneratedKey(key);
    setKeyExpiry(expiresAt);
    setTimeLeft(expiresAt - Date.now());
  };

  const finishStep = async (step: number) => {
    setCompletedSteps((previous) => Array.from(new Set([...previous, step])));
    setStatusMessage(`Step ${step} verified.`);
    if (step >= totalSteps) {
      setStatusMessage("All required checkpoints were verified.");
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

      const result = await callEarnpasteApi("complete", session);
      sessionStorage.removeItem("sotarium_earnpaste_session");
      await finishStep(2);
      unlockVerifiedKey(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not verify the Earnpaste step.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLootlabsReturn = async (session: string, step: number) => {
    setIsRedirecting(false);
    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);
    resetUrl();

    try {
      const result = await callLootlabsApi("complete", { session, step });
      if (step === 1) {
        if (!result.url) throw new Error("Lootlabs did not return the second checkpoint link.");
        setCompletedSteps([1]);
        setCurrentStep(2);
        setStatusMessage("Step 1 verified. Opening step 2...");
        setIsVerifying(false);
        setIsRedirecting(true);
        window.location.assign(result.url);
        return;
      }

      await finishStep(2);
      unlockVerifiedKey(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not verify the Lootlabs checkpoint.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleWorkinkReturn = async (step: number) => {
    setIsRedirecting(false);
    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);
    resetUrl();

    try {
      const result = await callWorkinkApi("advance", { step });
      if (step === 1) {
        if (!result.url) throw new Error("Work.ink did not return the step 2 link.");
        setCompletedSteps([1]);
        setCurrentStep(2);
        setStatusMessage("Step 1 verified. Opening step 2...");
        setIsVerifying(false);
        setIsRedirecting(true);
        window.location.assign(result.url);
        return;
      }

      setCompletedSteps([1]);
      await finishStep(2);
      unlockVerifiedKey(result);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not complete the Work.ink checkpoint.");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !isEarnpaste || !earnpasteAction || !earnpasteSession) return;
    void handleEarnpasteReturn(earnpasteAction, earnpasteSession);
  }, [isOpen, isEarnpaste, earnpasteAction, earnpasteSession]);

  useEffect(() => {
    if (!isOpen || !isWorkink || (workinkStep !== 1 && workinkStep !== 2)) return;
    const returnKey = `workink:${workinkStep}`;
    if (handledWorkinkReturn.current === returnKey) return;
    handledWorkinkReturn.current = returnKey;
    void handleWorkinkReturn(workinkStep);
  }, [isOpen, isWorkink, workinkStep]);

  useEffect(() => {
    if (!isOpen || !isOpera || hasWorkinkReturn) {
      setAdBlockerStatus("clear");
      return;
    }

    let cancelled = false;
    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner ad-unit ad-slot adsbygoogle";
    bait.setAttribute("aria-hidden", "true");
    bait.style.cssText = "position:absolute!important;left:-10000px!important;top:-10000px!important;width:1px!important;height:1px!important;pointer-events:none!important;";
    document.body.appendChild(bait);

    const check = async () => {
      setAdBlockerStatus("checking");
      let networkBlocked = false;
      try {
        await fetch(`${AD_BLOCKER_TEST_URL}?sotarium=${Date.now()}`, { mode: "no-cors", cache: "no-store" });
      } catch {
        networkBlocked = true;
      }

      const baitStyle = window.getComputedStyle(bait);
      const baitBlocked = baitStyle.display === "none" || baitStyle.visibility === "hidden" || bait.offsetHeight === 0 || bait.offsetWidth === 0;
      bait.remove();
      if (!cancelled) setAdBlockerStatus(networkBlocked || baitBlocked ? "detected" : "clear");
    };

    void check();
    return () => {
      cancelled = true;
      bait.remove();
    };
  }, [isOpen, isOpera, hasWorkinkReturn, adBlockerCheckVersion]);

  useEffect(() => {
    if (!isOpen || providerKind !== "lootlabs" || !lootlabsSession || (lootlabsStep !== 1 && lootlabsStep !== 2)) return;
    void handleLootlabsReturn(lootlabsSession, lootlabsStep);
  }, [isOpen, providerKind, lootlabsSession, lootlabsStep]);

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
        const result = await callWorkinkApi("start");
        if (!result.url) throw new Error("Work.ink did not return a step 1 link.");
        window.location.assign(result.url);
        return;
      }

      if (isOpera) {
        if (adBlockerStatus !== "clear") {
          setIsRedirecting(false);
          return;
        }
        const result = await callWorkinkApi("start", { flow: "opera" });
        if (!result.url || !result.session) throw new Error("Work.ink did not return the Opera offer link.");
        sessionStorage.setItem("sotarium_opera_session", result.session);
        window.location.assign(result.url);
        return;
      }

      const result = await callLootlabsApi("start");
      if (!result.url || !result.session) throw new Error("Lootlabs did not return the first checkpoint link.");
      sessionStorage.setItem("sotarium_lootlabs_session", result.session);
      window.location.assign(result.url);
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
    sessionStorage.removeItem("sotarium_lootlabs_session");
    sessionStorage.removeItem("sotarium_earnpaste_session");
    sessionStorage.removeItem("sotarium_workink_session");
    sessionStorage.removeItem("sotarium_opera_session");
    if (isOpera) {
      setAdBlockerStatus("checking");
      setAdBlockerCheckVersion((version) => version + 1);
    }
    resetUrl();
  };

  const copyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const isUnlocked = generatedKey !== null;
  const isCheckingAdBlocker = isOpera && adBlockerStatus === "checking" && !isUnlocked;
  const showAdBlockerNotice = isOpera && adBlockerStatus === "detected" && !isUnlocked;
  const checkpointDescription = isOpera
    ? "Complete the Work.ink Opera Browser offer. After Work.ink verifies it, the Opera installer downloads and your 24-hour key unlocks."
    : `Complete two ${providerName} checkpoints to receive your 24-hour key.`;
  const checkpointButtonText = isOpera
    ? "Open Work.ink Opera link (Step 1/1)"
    : `Start checkpoint (Step ${currentStep}/${totalSteps})`;
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
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => {
              const complete = completedSteps.includes(step);
              const active = currentStep === step && !complete;
              return (
                <React.Fragment key={step}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${complete ? "bg-[#1AF513] text-white" : active ? "bg-white text-[#141417]" : "border border-white/[0.08] bg-[#1a1a1e] text-zinc-500"}`}>
                    {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
                  </div>
                  {step < totalSteps && <div className={`h-[2px] flex-1 rounded-full ${complete ? "bg-[#1AF513]" : "bg-white/[0.08]"}`} />}
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
                <button type="button" onClick={startCheckpoint} className="w-full rounded-full border border-white bg-white px-5 py-3 text-sm font-semibold text-[#141417] hover:bg-zinc-100">Start step {currentStep} of {totalSteps}</button>
              </div>
            ) : (
              <div className="w-full">
                <p className="mb-4 text-sm text-zinc-300">{checkpointDescription}</p>
                <button type="button" onClick={startCheckpoint} disabled={isCheckingAdBlocker} className="w-full rounded-full border border-white bg-white px-5 py-3.5 text-sm font-semibold text-[#141417] shadow-lg hover:bg-zinc-100 disabled:cursor-wait disabled:opacity-60">{isCheckingAdBlocker ? "Checking for ad blocker..." : checkpointButtonText}</button>
              </div>
            )}
          </div>

            <button type="button" onClick={onClose} disabled={isRedirecting || isVerifying} className="rounded-full border border-white/[0.07] p-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50">Cancel</button>

            {showAdBlockerNotice && (
              <div role="alertdialog" aria-modal="true" aria-labelledby="adblocker-title" className="absolute inset-0 z-30 flex flex-col justify-center rounded-[26px] bg-[#121215]/[0.98] p-7 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
                  <AlertCircle className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h3 id="adblocker-title" className="text-xl font-black tracking-tight">Ad blocker detected</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">A real browser check found that an ad resource or ad placeholder is being blocked. The Work.ink Opera Browser offer cannot start until the blocker is disabled for Work.ink.</p>
                <p className="mt-3 text-xs leading-5 text-zinc-500">This detector does not install anything or change browser settings. Disable the blocker if you choose, then run the check again.</p>
                <button type="button" onClick={() => setAdBlockerCheckVersion((version) => version + 1)} className="mt-6 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-[#141417] hover:bg-zinc-100">Check again</button>
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
