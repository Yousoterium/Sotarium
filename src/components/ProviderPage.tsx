import React from "react";
import { ArrowLeft, Sparkles, CheckCircle2, ChevronRight, Shield } from "lucide-react";

export interface ProviderItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  available: boolean;
}

export const AVAILABLE_PROVIDERS: ProviderItem[] = [
  {
    id: "lootlabs",
    name: "Lootlabs",
    icon: "https://i.imgur.com/hmJCWhI.png",
    description: "Fast 2-step verification with instant key generation",
    badge: "Recommended",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    available: true,
  },
  {
    id: "linkvertise",
    name: "Linkvertise",
    icon: "https://i.imgur.com/hmJCWhI.png",
    description: "Direct sponsored checkpoint unlock",
    badge: "Fast",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    available: true,
  },
  {
    id: "workink",
    name: "Work.ink",
    icon: "https://i.imgur.com/hmJCWhI.png",
    description: "Simple task & captcha checkpoint",
    available: true,
  },
  {
    id: "platoboost",
    name: "Platoboost",
    icon: "https://i.imgur.com/hmJCWhI.png",
    description: "Alternative bypass-free gateway",
    available: true,
  },
];

interface ProviderPageProps {
  onSelectProvider: (providerId: string) => void;
  onBack: () => void;
}

export const ProviderPage: React.FC<ProviderPageProps> = ({ onSelectProvider, onBack }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-12">
      {/* Clean Subtle Dot Grid Background (Same as homepage) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-lg w-full rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl p-7 sm:p-9 flex flex-col items-center text-center shadow-2xl">
        {/* Back Button */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Gateways</span>
          </div>
        </div>

        {/* Header Badge & Title */}
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3 shadow-inner">
          <Sparkles className="w-7 h-7 text-amber-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Select Provider
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-sm">
          Choose your preferred verification method to generate your free 24h key.
        </p>

        {/* Provider List */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`/key/${provider.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProvider(provider.id);
              }}
              className="w-full p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.18] transition-all duration-200 flex items-center justify-between group text-left cursor-pointer active:scale-[0.99] backdrop-blur-md no-underline"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/[0.08] flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
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
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{provider.description}</p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Footer Info */}
        <p className="text-[11px] text-neutral-500 mt-6 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>All providers grant full 24-hour instant key access</span>
        </p>
      </div>
    </div>
  );
};
