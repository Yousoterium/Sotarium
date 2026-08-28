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
            <h2 className="text-base font-bold text-white tracking-tight">
              Select provider
            </h2>
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

        {/* Inner Card Section with Left-to-Right Provider Rows */}
        <div className="w-full rounded-xl bg-[#09090b] border border-white/[0.06] p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-inner">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSelectProvider(provider.id)}
              className="w-full py-3 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-150 flex items-center justify-between group cursor-pointer active:scale-[0.99] text-left shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00B27A] flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
                  W
                </div>
                <span className="font-bold text-sm text-white group-hover:text-white transition-colors">
                  {provider.name}
                </span>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-black hover:bg-neutral-200 transition-all shadow-sm">
                Choose
              </span>
            </button>
          ))}
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
