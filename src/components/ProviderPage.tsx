import React from "react";

export interface ProviderItem {
  id: string;
  name: string;
  icon: string;
}

export const AVAILABLE_PROVIDERS: ProviderItem[] = [
  {
    id: "workink",
    name: "Work.ink",
    icon: "https://favicon.pub/api/work.ink?s=64",
  },
];

interface ProviderPageProps {
  onSelectProvider: (providerId: string) => void;
  onBack: () => void;
}

export const ProviderPage: React.FC<ProviderPageProps> = ({ onSelectProvider, onBack }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-8">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glass Card Container */}
      <div className="relative z-10 w-full max-w-[360px] sm:max-w-[390px] rounded-2xl bg-[#121215]/60 border border-white/[0.08] backdrop-blur-2xl p-7 sm:p-8 flex flex-col items-center text-center shadow-2xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          Select Provider
        </h1>

        {/* Single Provider Option: Work.ink */}
        <div className="w-full flex flex-col gap-2.5">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`/key/${provider.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProvider(provider.id);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-150 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] backdrop-blur-md no-underline text-white group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/[0.08] flex items-center justify-center p-1">
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="font-semibold text-sm text-neutral-100 group-hover:text-white transition-colors">
                  {provider.name}
                </span>
              </div>

              <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-200">
                Choose
              </span>
            </a>
          ))}
        </div>

        {/* Go Home Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] backdrop-blur-md"
        >
          Go home
        </button>
      </div>
    </div>
  );
};
