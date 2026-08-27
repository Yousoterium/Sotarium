import React from "react";
import { ParticleGlobe } from "./ParticleGlobe";

export const WORKINK_SQUARE_ICON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2300B27A"/><path fill-rule="evenodd" clip-rule="evenodd" d="M26 34h9.8l5.2 18.2 5.3-18.2h7.4l5.3 18.2L64.2 34H74l-9.8 32H54.4L49 48.5 43.6 66H33.8L26 34z" fill="%23FFFFFF"/></svg>`;

export interface ProviderItem {
  id: string;
  name: string;
  icon: string;
}

export const AVAILABLE_PROVIDERS: ProviderItem[] = [
  {
    id: "workink",
    name: "Work.ink",
    icon: WORKINK_SQUARE_ICON,
  },
];

interface ProviderPageProps {
  onSelectProvider: (providerId: string) => void;
  onBack: () => void;
}

export const ProviderPage: React.FC<ProviderPageProps> = ({ onSelectProvider, onBack }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#08090a] text-white flex flex-col items-center justify-center font-sans select-none antialiased px-4 py-8">
      {/* 3D Spinning Particle Globe in Background */}
      <ParticleGlobe dotColor="#71717a" particleCount={5000} rotationSpeed={0.0018} />

      {/* Subtle Background Radial Grid (Muted Gray Dots) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(160, 165, 185, 0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Transparent Glass Container */}
      <div
        className="relative z-10 w-full max-w-[360px] sm:max-w-[380px] p-7 sm:p-8 flex flex-col items-center text-center transition-all duration-200"
        style={{
          background: "rgba(10, 10, 14, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: "20px",
          backdropFilter: "blur(14px) saturate(1.2)",
          WebkitBackdropFilter: "blur(14px) saturate(1.2)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 30px 70px -30px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-5">
          Select Provider
        </h1>

        {/* Work.ink Option */}
        <div className="w-full flex flex-col gap-2.5">
          {AVAILABLE_PROVIDERS.map((provider) => (
            <a
              key={provider.id}
              href={`/key/${provider.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectProvider(provider.id);
              }}
              className="w-full py-3.5 px-4 rounded-[14px] transition-all duration-150 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] no-underline text-white group hover:bg-white/[0.06] hover:border-white/[0.25]"
              style={{
                background: "rgba(255, 255, 255, 0.035)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Full Square Work.ink App Icon */}
                <div className="w-8 h-8 rounded-[8px] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-sm text-neutral-100 group-hover:text-white transition-colors">
                  {provider.name}
                </span>
              </div>

              <span className="text-xs text-neutral-300 font-medium group-hover:text-white">
                Choose
              </span>
            </a>
          ))}
        </div>

        {/* Go Home Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full mt-4 py-3 rounded-[12px] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-[0.99] hover:bg-white/[0.06] hover:border-white/[0.25]"
          style={{
            background: "rgba(255, 255, 255, 0.035)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          Go home
        </button>
      </div>
    </div>
  );
};
