import React from "react";

export const WORKINK_SQUARE_ICON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2300B27A"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26 34h9.8l5.2 18.2 5.3-18.2h7.4l5.3 18.2L64.2 34H74l-9.8 32H54.4L49 48.5 43.6 66H33.8L26 34z" fill="%23FFFFFF"/></svg>`;

export interface ProviderItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
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
        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          Select Provider
        </h1>

        {/* Provider Option List */}
        <div className="w-full flex flex-col gap-2.5">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`/key/${provider.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProvider(provider.id);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] hover:border-white/[0.22] transition-all duration-200 flex items-center justify-between group text-left cursor-pointer active:scale-[0.99] backdrop-blur-md no-underline text-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {provider.name}
                    </span>
                    {provider.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${provider.badgeColor}`}>
                        {provider.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs text-neutral-300 font-medium group-hover:text-white transition-colors">
                Choose
              </span>
            </a>
          ))}
        </div>

        {/* Go Home Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] backdrop-blur-md shadow-sm"
        >
          Go home
        </button>
      </div>
    </div>
  );
};
