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
    icon: "https://favicon.pub/api/work.ink?s=128",
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

      {/* True Glass Container */}
      <div
        className="relative z-10 w-full max-w-[360px] sm:max-w-[390px] rounded-2xl p-7 sm:p-8 flex flex-col items-center text-center"
        style={{
          background: "rgba(18, 18, 22, 0.4)",
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 30px 70px -30px rgba(0, 0, 0, 0.85)",
        }}
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          Select Provider
        </h1>

        {/* Single Provider Option: Work.ink with full square icon holder */}
        <div className="w-full flex flex-col gap-2.5">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`/key/${provider.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProvider(provider.id);
              }}
              className="w-full py-3 px-4 rounded-xl transition-all duration-150 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] no-underline text-white group hover:bg-white/[0.07]"
              style={{
                background: "rgba(255, 255, 255, 0.035)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Square Holder fully fitted with Work.ink Icon */}
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-full h-full object-cover rounded-lg"
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
          className="w-full mt-4 py-3 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99]"
          style={{
            background: "rgba(255, 255, 255, 0.035)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          Go home
        </button>
      </div>
    </div>
  );
};
