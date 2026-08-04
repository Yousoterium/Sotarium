import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface CaughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const CaughtModal: React.FC<CaughtModalProps> = ({
  isOpen,
  onClose,
  onRestart,
}) => {
  const [videoError, setVideoError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        className="pointer-events-auto animate-modal-in relative flex w-[440px] max-w-full flex-col items-center text-center gap-5 overflow-hidden rounded-[26px] border border-rose-500/30 bg-[#131317] p-7 shadow-2xl text-white"
      >
        {/* Top ambient red warning glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-[radial-gradient(65%_100%_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)]"
        />

        {/* Warning Icon / Vecteezy Video */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 overflow-hidden mt-2 shrink-0">
          {!videoError ? (
            <video
              src="https://static.vecteezy.com/system/resources/previews/067/258/916/mp4/red-critical-warning-exclamation-mark-in-a-circle-or-hazard-risk-warning-message-trouble-sign-animated-red-warning-icon-with-transparent-background.mp4"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover mix-blend-screen scale-110"
            />
          ) : (
            <AlertTriangle className="w-12 h-12 text-rose-500 animate-bounce" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-rose-500 tracking-tight">
          You Have Been Caught!
        </h2>

        {/* Description */}
        <p className="text-sm font-medium text-zinc-300 leading-relaxed px-2">
          You have been caught trying to bypass. This has resulted in your progress being reset.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onRestart();
            onClose();
          }}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-rose-400/40 bg-gradient-to-b from-rose-600 to-rose-700 px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(225,29,72,0.4)] transition-all duration-200 hover:bg-rose-500 hover:shadow-[0_12px_26px_rgba(225,29,72,0.6)] active:scale-[0.98]"
        >
          Restart Checkpoints
        </button>
      </div>
    </div>
  );
};
