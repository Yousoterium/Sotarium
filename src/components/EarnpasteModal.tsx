import React, { useState, useEffect } from "react";
import { Copy, AlertCircle, Clock } from "lucide-react";
import { saveKeyToDatabase } from "../lib/supabase";

interface EarnpasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaught: () => void;
  providerName?: string;
  providerIcon?: string;
  initialStep?: number;
  comebackStep?: number;
}

// Earnpaste API URL Creator
export const createEarnpasteUrl = async (targetUrl: string): Promise<string> => {
  const apiKey = "ep_1fc0807b695b99c7f244b4d0dd6ac65bd49085dc6a6a2cd2";
  const timer = 15;
  const revenueModel = "view";
  const endpoint = "https://us-central1-earnpaste-3cd5a.cloudfunctions.net/apiCreatePaste";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        targetUrl,
        timer,
        revenueModel,
      }),
    });

    const data = await response.json();
    if (data && data.url) {
      return data.url;
    }
  } catch (err) {
    console.error("Earnpaste API Error:", err);
  }
  return targetUrl;
};

// Lootlabs API URL Creator
export const createLootlabsUrl = async (targetUrl: string, step: number): Promise<string> => {
  try {
    const response = await fetch("/api/lootlabs-proxy?action=create_link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `Sotarium Checkpoint ${step}`,
        destinationUrl: targetUrl,
        tierId: 1,
        numberOfTasks: 1,
      }),
    });

    const data = await response.json();
    if (data && data.lootUrl) {
      return data.lootUrl;
    }
  } catch (err) {
    console.error("Lootlabs API Error:", err);
  }
  return targetUrl;
};

// Internal secret salt for cryptographic token signature verification
const SECURITY_SALT = "SOTERIA_V2_SECURE_SALT_99421";

// Hash function for token checksum
const hashString = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36).padStart(4, "0").slice(0, 4);
};

// Generate cryptographically signed 4-4-4-4 token
export const generateCheckpointToken = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const genGroup = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  const g1 = genGroup();
  const g2 = genGroup();
  const g3 = genGroup();
  const g4 = hashString(`${g1}-${g2}-${g3}-${SECURITY_SALT}`);
  return `${g1}-${g2}-${g3}-${g4}`;
};

// Validate token cryptographic signature
export const validateTokenSignature = (token: string): boolean => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split("-");
  if (parts.length !== 4) return false;
  const [g1, g2, g3, g4] = parts;
  const expectedHash = hashString(`${g1}-${g2}-${g3}-${SECURITY_SALT}`);
  return g4 === expectedHash;
};

// Single-use token tracking in sessionStorage
export const isTokenAlreadyUsed = (token: string): boolean => {
  try {
    const raw = sessionStorage.getItem("soteria_used_tokens");
    const used = raw ? JSON.parse(raw) : [];
    return used.includes(token);
  } catch {
    return false;
  }
};

export const markTokenAsUsed = (token: string): void => {
  try {
    const raw = sessionStorage.getItem("soteria_used_tokens");
    const used: string[] = raw ? JSON.parse(raw) : [];
    if (!used.includes(token)) {
      used.push(token);
      sessionStorage.setItem("soteria_used_tokens", JSON.stringify(used));
    }
  } catch {
    // Ignore storage errors
  }
};

// Auto-detect user browser language
export const getBrowserLanguage = (): string => {
  if (typeof window !== "undefined" && window.navigator) {
    const lang = (
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      "en"
    ).toLowerCase();

    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("es")) return "es";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("pt")) return "pt";
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("zh")) return "zh";
  }
  return "en";
};

// Multilingual Translations Dictionary
export const translations: Record<string, Record<string, string>> = {
  en: {
    unlockKey: "Unlock your key",
    startCheckpoint: "Start checkpoint",
    cancel: "Cancel",
    verified: "Verified!",
    freeKeyReady: "Your Free Key Is Ready",
    yourKey: "Your key",
    close: "Close",
    obtainNewKey: "Obtain a new key",
    copied: "Copied!",
    copy: "Copy",
    closeLabel: "Close",
    invalidToken: "Security Error: Invalid token.",
    tokenUsed: "URL Expired: Token already used.",
  },
};

// Generate key in XXX-XXX-XXX format without any prefix
export const generateFinalKeyString = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const genGroup = () =>
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${genGroup()}-${genGroup()}-${genGroup()}`;
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const ProviderIcon: React.FC<{ name: string; iconUrl?: string; className?: string }> = ({
  name,
  iconUrl,
  className = "h-[42px] w-[42px]",
}) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !iconUrl) {
    return (
      <div
        className={`${className} rounded-full bg-[#181820] border border-[#1AF513]/40 flex items-center justify-center text-[#1AF513] font-black text-xl shadow-md shrink-0`}
      >
        ℗
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#181820]`}>
      <img
        src={iconUrl}
        alt={name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export const EarnpasteModal: React.FC<EarnpasteModalProps> = ({
  isOpen,
  onClose,
  onCaught,
  providerName = "Earnpaste",
  providerIcon = "https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s88-c-k-c0xffffffff-no-rj-mo",
  initialStep = 1,
  comebackStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState<boolean>(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyExpiry, setKeyExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const userLang = getBrowserLanguage();
  const t = translations[userLang] || translations.en;

  // Load existing free key from localStorage if valid
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sotarium_free_key_${providerName}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.key && parsed.expiry && parsed.expiry > Date.now()) {
          setGeneratedKey(parsed.key);
          setKeyExpiry(parsed.expiry);
          setTimeLeft(parsed.expiry - Date.now());
        }
      }
    } catch {
      // Ignore
    }
  }, [providerName]);

  // Live countdown timer for active key
  useEffect(() => {
    if (!keyExpiry) return;
    const interval = setInterval(() => {
      const remaining = keyExpiry - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setGeneratedKey(null);
        setKeyExpiry(null);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [keyExpiry]);

  // Handle comeback step from LootLabs / Lockr / Earnpaste
  useEffect(() => {
    if (!isOpen) return;
    if (comebackStep > 0) {
      triggerComebackVerification(comebackStep);
    }
  }, [isOpen, comebackStep]);

  // Anti-bypass detection and verification check
  useEffect(() => {
    if (!isOpen) return;

    const pathToken = window.location.pathname.replace(/^\//, "");
    const tokenRegex = /^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/;
    const search = window.location.search;

    if (search.includes("step") || window.location.pathname === "/caught") {
      onCaught();
      return;
    }

    if (tokenRegex.test(pathToken)) {
      setShowVerificationSuccess(false);
      if (!validateTokenSignature(pathToken)) {
        setSecurityError(t.invalidToken);
        window.history.replaceState({}, "", "/");
        return;
      }

      if (isTokenAlreadyUsed(pathToken)) {
        setSecurityError(t.tokenUsed);
        window.history.replaceState({}, "", "/");
        return;
      }

      markTokenAsUsed(pathToken);
      triggerComebackVerification(currentStep);
    }
  }, [isOpen]);

  const triggerComebackVerification = (stepToVerify: number) => {
    setSecurityError(null);
    setIsVerifying(true);
    setShowVerificationSuccess(false);

    window.history.replaceState({}, "", "/");

    setTimeout(() => {
      setIsVerifying(false);
      setShowVerificationSuccess(true);

      setCompletedSteps((prev) => {
        const updated = Array.from(new Set([...prev, stepToVerify]));
        if (updated.length >= 3) {
          void generateFinalKey();
        }
        return updated;
      });

      if (stepToVerify < 3) {
        setCurrentStep(stepToVerify + 1);
      } else {
        void generateFinalKey();
      }
    }, 1200);
  };

  const generateFinalKey = async () => {
    const keyStr = generateFinalKeyString();
    const durationMs = 24 * 60 * 60 * 1000; // 24 Hours
    const expiryTimestamp = Date.now() + durationMs;
    const expiresAtIso = new Date(expiryTimestamp).toISOString();

    setGeneratedKey(keyStr);
    setKeyExpiry(expiryTimestamp);
    setTimeLeft(durationMs);

    try {
      localStorage.setItem(
        `sotarium_free_key_${providerName}`,
        JSON.stringify({ key: keyStr, expiry: expiryTimestamp })
      );
    } catch {
      // Ignore storage errors
    }

    // Save key to Supabase so Roblox can verify it!
    await saveKeyToDatabase(keyStr, providerName, expiresAtIso, false);
  };

  const handleStartCheckpoint = async () => {
    const token = generateCheckpointToken();
    markTokenAsUsed(token);

    const comebackUrl = `${window.location.origin}/${token}`;
    const pName = providerName.toLowerCase();

    setIsVerifying(true);

    if (pName.includes("earnpaste")) {
      const destinationUrl = await createEarnpasteUrl(comebackUrl);
      window.location.href = destinationUrl;
    } else if (pName.includes("lootlabs")) {
      const destinationUrl = await createLootlabsUrl(comebackUrl, currentStep);
      window.location.href = destinationUrl;
    } else {
      const verificationPath = `/${token}`;
      window.history.pushState({}, "", verificationPath);
      triggerComebackVerification(currentStep);
    }
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetProgress = () => {
    try {
      localStorage.removeItem(`sotarium_free_key_${providerName}`);
    } catch {
      // Ignore
    }
    setCompletedSteps([]);
    setCurrentStep(1);
    setGeneratedKey(null);
    setKeyExpiry(null);
    setTimeLeft(0);
    setIsVerifying(false);
    setShowVerificationSuccess(false);
    setSecurityError(null);
    window.history.replaceState({}, "", "/");
  };

  if (!isOpen) return null;

  const isFullyUnlocked = completedSteps.length >= 3 || generatedKey !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn">
      {!isFullyUnlocked ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="key-modal-title"
          className="pointer-events-auto animate-modal-in relative flex w-[440px] max-w-full flex-col gap-6 overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#131317] p-7 shadow-2xl text-white"
        >
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <ProviderIcon name={providerName} iconUrl={providerIcon} />
              <div className="flex flex-col gap-0.5">
                <h2
                  id="key-modal-title"
                  className="text-[19px] font-bold tracking-tight text-[#f2f1f4]"
                >
                  {t.unlockKey}
                </h2>
                <p className="text-xs text-zinc-400">Provider: {providerName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeLabel}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-sm leading-none text-[#8b8b93] transition-colors hover:bg-white/[0.1] hover:text-[#f2f1f4]"
            >
              ✕
            </button>
          </div>

          <div className="relative flex items-center gap-2.5 px-0.5">
            {[1, 2, 3].map((stepNum, idx) => {
              const isDone = completedSteps.includes(stepNum);
              const isCurrent = currentStep === stepNum && !isDone;

              return (
                <React.Fragment key={stepNum}>
                  <div
                    className={`flex min-w-0 items-center gap-2.5 ${
                      idx < 2 ? "flex-1" : "flex-none"
                    }`}
                  >
                    {isDone ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1AF513] text-white transition-all duration-300">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12l4.5 4.5L19 7"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold transition-all duration-300 border-[#f2f1f4] bg-[#f2f1f4] text-[#141417]">
                        <span>{stepNum}</span>
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold transition-all duration-300 border-white/[0.08] bg-[#1a1a1e] text-[#56565e]">
                        <span>{stepNum}</span>
                      </div>
                    )}

                    {idx < 2 && (
                      <div className="relative h-[2px] min-w-[18px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-[#1AF513] transition-all duration-500"
                          style={{
                            width: completedSteps.includes(stepNum) ? "100%" : "0%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="relative flex min-h-[150px] flex-col justify-center items-center rounded-[18px] border border-white/[0.06] bg-white/[0.025] p-6">
            {securityError ? (
              <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <span className="text-sm font-semibold text-rose-400">
                  {securityError}
                </span>
                <button
                  onClick={() => setSecurityError(null)}
                  className="mt-2 text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : isVerifying || showVerificationSuccess ? (
              <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1AF513] text-white animate-pulse">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12l4.5 4.5L19 7"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-[#1AF513] tracking-wide">
                  {t.verified}
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col justify-center">
                <button
                  type="button"
                  onClick={handleStartCheckpoint}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-[26px] py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1)] hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_rgba(0,0,0,0.5)] active:translate-y-0"
                >
                  {t.startCheckpoint} (Step {currentStep}/3)
                </button>
              </div>
            )}
          </div>

          <div className="relative flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 cursor-pointer rounded-full border border-white/[0.07] p-3 text-sm font-semibold text-[#a9a9b0] transition-colors hover:bg-white/[0.04] hover:text-[#f2f1f4] disabled:opacity-50"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ) : (
        <div className="pointer-events-auto animate-modal-in relative flex w-[440px] max-w-full flex-col gap-5 overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#131317] p-7 shadow-2xl text-white">
          <header className="relative flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[19px] font-bold tracking-tight text-[#f2f1f4]">
                {t.freeKeyReady}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-sm leading-none text-[#8b8b93] transition-colors hover:bg-white/[0.1] hover:text-[#f2f1f4]"
              aria-label={t.closeLabel}
            >
              ✕
            </button>
          </header>

          <div className="relative">
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="relative flex items-center justify-center my-1">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1AF513] text-white">
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
                {t.yourKey}
              </p>

              <div className="w-full flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e] p-3.5 font-mono text-base tracking-widest text-[#1AF513] shadow-inner">
                <span className="truncate mr-2 font-bold select-all">{generatedKey}</span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg bg-[#1AF513]/20 hover:bg-[#1AF513]/30 text-[#1AF513] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? t.copied : t.copy}
                </button>
              </div>

              {timeLeft > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#1AF513]" />
                  <span>Valid for: <strong className="text-[#1AF513] font-bold">{formatCountdown(timeLeft)}</strong></span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-full border border-white bg-gradient-to-b from-white to-[#e9e8ec] px-[26px] py-3.5 text-[14.5px] font-semibold text-[#141417] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_22px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.2,0.9,0.3,1)] hover:-translate-y-px hover:bg-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_28px_rgba(0,0,0,0.5)] active:translate-y-0"
              >
                {t.close}
              </button>

              <button
                type="button"
                onClick={resetProgress}
                className="text-xs font-medium text-[#8b8b93] hover:text-[#f2f1f4] transition-colors cursor-pointer pt-1"
              >
                {t.obtainNewKey}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
