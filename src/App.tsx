import { useState, useEffect } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";

interface ProviderOption {
  name: string;
  icon: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    name: "Earnpaste",
    icon: "https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s88-c-k-c0xffffffff-no-rj-mo",
  },
  {
    name: "Lootlabs",
    icon: "https://i.imgur.com/hmJCWhI.png",
  },
  {
    name: "Lockr",
    icon: "https://favicon.pub/api/lockr.net?s=32",
  },
];

function App() {
  const [page, setPage] = useState<"home" | "products">("home");
  const [showEarnpaste, setShowEarnpaste] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState<number>(0);
  const [showProviderChooser, setShowProviderChooser] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Sotarium";

    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (path === "/products") {
      setPage("products");
      return;
    }

    // LootLabs comeback: ?verify1=step1, ?verify2=step2, ?verify=step3
    if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      let step = 3;
      if (params.has("verify1")) step = 1;
      else if (params.has("verify2")) step = 2;

      window.history.replaceState({}, "", "/lootlabs?verify");

      setSelectedProvider(PROVIDERS[1]);
      setShowEarnpaste(true);
      setIsModalOpen(true);
      setComebackStep(step);
      return;
    }

    // Lockr comeback
    if (path === "/lockr" && params.has("verify")) {
      setSelectedProvider(PROVIDERS[2]);
      setShowEarnpaste(true);
      setIsModalOpen(true);
      return;
    }
  }, []);

  if (page === "products") {
    return <ProductsPage onBack={() => { setPage("home"); window.history.replaceState({}, "", "/"); }} />;
  }

  const handleProviderClick = (provider: ProviderOption) => {
    setSelectedProvider(provider);
    setShowEarnpaste(true);
    setIsModalOpen(true);
    setShowProviderChooser(false);
    setComebackStep(0);
  };

  const handleGetKeyClick = () => {
    setShowProviderChooser((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0e0e11] text-white">
      <nav className="relative z-10 flex items-center justify-between px-8 py-5" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
          <div className="space-y-3">
            <h1 className="text-6xl font-black tracking-tight leading-none text-white">
              Sotarium
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleGetKeyClick}
              className={`px-8 py-3 rounded-full border transition-all duration-200 shadow-lg cursor-pointer active:scale-95 text-white font-bold text-base ${
                showProviderChooser
                  ? "bg-[#26262d] border-[#1AF513]/50 text-white"
                  : "bg-[#1c1c21] border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70"
              }`}
            >
              Get Key
            </button>
            <button
              type="button"
              onClick={() => { setPage("products"); window.history.pushState({}, "", "/products"); }}
              className="px-8 py-3 rounded-full bg-[#1c1c21] border border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg cursor-pointer active:scale-95 text-white font-bold text-base"
            >
              Buy key
            </button>
            <button
              type="button"
              className="px-8 py-3 rounded-full bg-[#1c1c21] border border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg cursor-pointer active:scale-95 text-white font-bold text-base"
            >
              Scripts
            </button>
          </div>

          {showProviderChooser && !showEarnpaste && (
            <div className="flex flex-col items-center gap-4 animate-modal-in mt-4">
              <p className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Choose a provider</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => handleProviderClick(provider)}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#1c1c21] border border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg group cursor-pointer active:scale-95"
                  >
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <span className="text-white text-xl font-bold tracking-wide">{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <EarnpasteModal
        key={selectedProvider.name}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowEarnpaste(false);
          setShowProviderChooser(false);
        }}
        onCaught={() => {}}
        providerName={selectedProvider.name}
        providerIcon={selectedProvider.icon}
        initialStep={1}
        comebackStep={comebackStep}
      />

      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85) translateY(-6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalIn {
          0%   { opacity: 0; transform: scale(0.95) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}

export default App;
