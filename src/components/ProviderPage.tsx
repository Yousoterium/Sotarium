import React from "react";
import { AsciiCanvas } from "./AsciiCanvas";

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-8">
      {/* Main Select Provider Modal Container with edge, star-border, panel-glow */}
      <div className="relative z-10 w-full max-w-[400px] sm:max-w-[430px] rounded-2xl edge panel-glow star-border p-6 sm:p-7 flex flex-col gap-5 shadow-2xl text-left">
        {/* Header with Circular Work.ink Icon, Title, and Close Button */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Work.ink Circular Icon */}
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-md shrink-0 bg-[#00B27A]">
              <img src={WORKINK_SQUARE_ICON} alt="Work.ink" className="w-full h-full object-cover" />
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
        <div className="w-full rounded-xl bg-[#08090d]/80 border border-white/[0.06] p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-inner">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSelectProvider(provider.id)}
              className="w-full py-3 px-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#0099ff]/40 transition-all duration-150 flex items-center justify-between group cursor-pointer active:scale-[0.99] text-left shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0 bg-[#00B27A]">
                  <img src={provider.icon} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-sm text-white group-hover:text-white transition-colors">
                  {provider.name}
                </span>
              </div>

              <span className="text-xs font-semibold px-3.5 py-1.5 rounded-lg btn-zebra cursor-pointer">
                Choose
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 rounded-xl btn-zebra text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
