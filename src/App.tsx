import { useState, useEffect } from "react";
import { 
  Key, 
  ShoppingCart, 
  Code2, 
  Gamepad2, 
  ShieldCheck, 
  Zap, 
  Timer, 
  ArrowRight, 
  Check, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Radio,
  Cpu
} from "lucide-react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage, GameItem } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";

interface ProviderOption {
  name: string;
  icon: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    name: "Lootlabs",
    icon: "https://i.imgur.com/hmJCWhI.png",
  },
];

const DEFAULT_GAMES: GameItem[] = [
  {
    id: "game-1",
    name: "San Diego Border Roleplay",
    imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
    placeId: "136020512003847",
    scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua"
  }
];

function App() {
  const [page, setPage] = useState<"home" | "products" | "add" | "scripts">(() => {
    const p = window.location.pathname;
    if (p === "/scripts") return "scripts";
    if (p === "/add") return "add";
    if (p === "/products") return "products";
    return "home";
  });
  const [showEarnpaste, setShowEarnpaste] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState<number>(0);
  const [showGamesModal, setShowGamesModal] = useState<boolean>(false);

  // Supported Games State
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_supported_games");
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });

  const navigateTo = (newPage: "home" | "products" | "add" | "scripts") => {
    setPage(newPage);
    const targetUrl = newPage === "home" ? "/" : `/${newPage}`;
    window.history.pushState({ page: newPage }, "", targetUrl);
    document.title = newPage === "scripts" ? "Scripts Studio" : newPage === "add" ? "Add Game" : newPage === "products" ? "Products" : "Sotarium";
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/scripts") setPage("scripts");
      else if (p === "/add") setPage("add");
      else if (p === "/products") setPage("products");
      else setPage("home");
    };

    window.addEventListener("popstate", handlePopState);

    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);

    if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      let step = 2;
      if (params.has("verify1")) step = 1;
      else if (params.has("verify2")) step = 2;

      window.history.replaceState({}, "", "/lootlabs?verify");
      setSelectedProvider(PROVIDERS[0]);
      setShowEarnpaste(true);
      setIsModalOpen(true);
      setComebackStep(step);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (page === "scripts") {
    return <ScriptsPage onBack={() => navigateTo("home")} />;
  }

  if (page === "add") {
    return <AddGamePage onBack={() => navigateTo("home")} />;
  }

  if (page === "products") {
    return <ProductsPage onBack={() => navigateTo("home")} />;
  }

  const handleGetKeyClick = () => {
    setSelectedProvider(PROVIDERS[0]);
    setShowEarnpaste(true);
    setIsModalOpen(true);
    setComebackStep(0);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0d] text-white flex flex-col items-center justify-between font-sans select-none selection:bg-white/20">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-white/[0.04] via-emerald-500/[0.02] to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-emerald-500/[0.015] blur-[100px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-zinc-500/[0.02] blur-[100px] rounded-full" />
      </div>

      {/* Main Center Container */}
      <main className="relative z-10 w-full max-w-4xl px-4 py-12 flex flex-col items-center gap-12 my-auto">
        
        {/* Roblox UI Styled Card Window */}
        <div className="w-full max-w-[680px] bg-[#111114]/90 backdrop-blur-xl border border-zinc-800/80 rounded-[22px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300 hover:border-zinc-700/80">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/60 bg-[#16161a]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 tracking-wide">Sotarium Hub · v2.4</span>
            </div>
            
            <div className="flex items-center gap-3.5">
              {/* Window Controls matching Roblox Script */}
              <button 
                type="button"
                className="w-3 h-3 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Minimize"
              >
                <div className="w-2.5 h-[1.5px] bg-current rounded-full" />
              </button>
              <button 
                type="button"
                className="w-3 h-3 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Maximize"
              >
                <div className="w-2.5 h-2.5 border border-current rounded-[2px]" />
              </button>
              <button 
                type="button"
                className="w-3 h-3 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Hub Body */}
          <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-8">
            
            {/* Logo & Headline */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-white/20 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
                <div className="relative w-20 h-20 rounded-2xl bg-[#18181d] border border-zinc-700/60 flex items-center justify-center p-3 shadow-xl">
                  <img
                    src="https://i.imgur.com/qye2L7M.png"
                    alt="Sotarium"
                    className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  Sotarium
                </h1>
                <p className="text-zinc-400 text-sm max-w-sm">
                  Premium execution ecosystem with anti-AFK protection and instant key resolution.
                </p>
              </div>
            </div>

            {/* Action Buttons Matrix */}
            <div className="w-full max-w-md flex flex-col gap-3">
              
              {/* Primary: Get Free Key */}
              <button
                type="button"
                onClick={handleGetKeyClick}
                className="group relative w-full py-4 px-6 rounded-xl font-black text-sm tracking-wide text-zinc-950 bg-white hover:bg-zinc-100 shadow-[0_8px_25px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Key className="w-4 h-4 text-zinc-900 transition-transform group-hover:rotate-12 duration-200" />
                <span>Get Access Key</span>
                <ArrowRight className="w-4 h-4 text-zinc-500 transition-transform group-hover:translate-x-1 duration-200 ml-auto" />
              </button>

              {/* Secondary Row: Buy Key & Supported Games */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo("products")}
                  className="py-3 px-4 rounded-xl font-bold text-xs text-zinc-200 bg-[#19191e] hover:bg-[#22222a] border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Buy Permanent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGamesModal(true)}
                  className="py-3 px-4 rounded-xl font-bold text-xs text-zinc-200 bg-[#19191e] hover:bg-[#22222a] border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Supported Games</span>
                </button>
              </div>

              {/* Studio Admin link */}
              <button
                type="button"
                onClick={() => navigateTo("scripts")}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-zinc-400 hover:text-zinc-200 bg-[#141418]/60 hover:bg-[#1c1c22] border border-zinc-800/50 hover:border-zinc-700/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Scripts Studio & Game Manager</span>
              </button>
            </div>

            {/* In-Game Telemetry Indicators */}
            <div className="w-full pt-4 border-t border-zinc-800/60 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Security</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> Zero-Kick
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-zinc-800/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Anti-AFK</span>
                <span className="font-mono font-bold text-zinc-200 flex items-center gap-1 mt-0.5">
                  <Timer className="w-3 h-3 text-zinc-400" /> 24/7 Live
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Status</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3" /> Undetected
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#121216]/60 border border-zinc-800/60 flex flex-col gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Zero-Downtime Signature Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cryptographically signed tokens verify directly inside Roblox with zero external database dependencies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121216]/60 border border-zinc-800/60 flex flex-col gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Radio className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Integrated Anti-AFK Telemetry</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time FPS and ping tracker with automated movement controller preventing 20-minute idle disconnects.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121216]/60 border border-zinc-800/60 flex flex-col gap-2.5 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-300">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Smart Place ID Detection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-detects the current Roblox game on execution and unlocks tailored payload scripts immediately.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-zinc-600 border-t border-zinc-900">
        <span>© 2026 Sotarium Framework. All rights reserved.</span>
      </footer>

      {/* Supported Games Modal (Interactive Preview matching In-Game GUI) */}
      {showGamesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#131317] border border-zinc-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 max-h-[85vh] overflow-hidden animate-modal-in">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1c1c22] border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Supported Games</h3>
                  <p className="text-xs text-zinc-400">{games.length} titles available with auto-injection</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGamesModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 3-Column Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1 py-1">
              {games.map((g) => (
                <div 
                  key={g.id}
                  className="group relative rounded-xl bg-[#18181e] border border-zinc-800/80 overflow-hidden flex flex-col hover:border-zinc-600 transition-all shadow-md"
                >
                  <div className="relative w-full h-28 bg-[#101014] overflow-hidden">
                    <img 
                      src={g.imageUrl} 
                      alt={g.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181e] via-transparent to-transparent" />
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <span className="font-bold text-xs text-white truncate" title={g.name}>
                      {g.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {g.placeId || "Universal"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGamesModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <EarnpasteModal
        key={selectedProvider.name}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowEarnpaste(false);
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
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default App;
