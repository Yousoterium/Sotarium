import React from "react";

export const WORKINK_SQUARE_ICON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2300B27A"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26 34h9.8l5.2 18.2 5.3-18.2h7.4l5.3 18.2L64.2 34H74l-9.8 32H54.4L49 48.5 43.6 66H33.8L26 34z" fill="%23FFFFFF"/></svg>`;

export interface ProviderItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export const AVAILABLE_PROVIDERS: ProviderItem[] = [
  {
    id: "workink",
    name: "Work.ink",
    icon: WORKINK_SQUARE_ICON,
    description: "Fast 2-step verification with instant key generation",
  },
];

interface ProviderPageProps {
  onSelectProvider: (providerId: string) => void;
  onBack: () => void;
}

export const ProviderPage: React.FC<ProviderPageProps> = ({ onSelectProvider, onBack }) => {
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

      {/* Main Select Provider Modal Container (Same as /key/ modal GUI) */}
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
                Select provider
              </h2>
              <span className="text-xs text-neutral-400 font-medium leading-tight">
                Choose verification method
              </span>
            </div>
          </div>

          {/* Close (X) Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Inner Card Section (Dark recessed container) */}
        <div className="w-full rounded-xl bg-[#09090b] border border-white/[0.06] p-5 flex flex-col items-center text-center gap-4 shadow-inner">
          <p className="text-xs text-neutral-300 whitespace-nowrap">
            Choose Work.ink to start your 2-step verification.
          </p>

          <button
            type="button"
            onClick={() => onSelectProvider("workink")}
            className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all duration-150 shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue with Work.ink</span>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 rounded-full border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer active:scale-[0.99]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
