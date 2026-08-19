import React, { useState, useEffect } from "react";
import { 
  Key, 
  ShoppingCart, 
  Gamepad2, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  ExternalLink,
  Code2,
  Lock,
  Search,
  Settings,
  Bell,
  ChevronRight,
  Radio,
  Copy,
  Plus,
  ArrowRight,
  Monitor,
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

  // Quick Key Verification
  const [inputKey, setInputKey] = useState<string>("");
  const [keyStatusMsg, setKeyStatusMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Games
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

  const handleValidateQuickKey = () => {
    const trimmed = inputKey.trim().toUpperCase();
    if (!trimmed) return;
    setIsValidating(true);
    setKeyStatusMsg(null);

    setTimeout(() => {
      setIsValidating(false);
      let isValid = false;
      if (trimmed === "TEST") isValid = true;
      else {
        const parts = trimmed.split("-");
        if (parts.length === 3 && parts[0].length >= 2 && parts[1].length >= 2 && parts[2].length >= 2) isValid = true;
        else if (trimmed.length >= 8 && trimmed.length <= 20) isValid = true;
      }

      if (isValid) {
        setKeyStatusMsg({ text: "Key Verified · Access Granted", success: true });
      } else {
        setKeyStatusMsg({ text: "Invalid Key Format", success: false });
      }
    }, 1500);
  };

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
    <div className="min-h-screen bg-[#0e1015] text-[#dcdfe6] font-sans flex flex-col antialiased selection:bg-[#22c55e]/30 selection:text-white">
      
      {/* ========================================================================= */}
      {/* TOPBAR (RoStake Style) */}
      {/* ========================================================================= */}
      <header className="h-16 bg-[#141720] border-b border-[#1f2330] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
        
        {/* Left Branding */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => navigateTo("home")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#161922] to-[#222736] border border-[#2b3144] p-1.5 flex items-center justify-center shadow-md group-hover:border-[#22c55e]/50 transition-colors">
              <img src="https://i.imgur.com/qye2L7M.png" alt="Sotarium" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black italic tracking-wider text-lg text-white group-hover:text-[#22c55e] transition-colors leading-none">
                SOTARIUM
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">
                EXECUTION HUB
              </span>
            </div>
          </div>

          {/* Quick Telemetry Ticker */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1d28] border border-[#232736]">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[11px] font-black text-emerald-400">UNDETECTED</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1d28] border border-[#232736]">
              <span className="text-xs">🛡️</span>
              <span className="text-[11px] font-black text-cyan-400">ANTI-AFK ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1d28] border border-[#232736]">
              <span className="text-xs">🎮</span>
              <span className="text-[11px] font-black text-amber-400">{games.length} GAMES SUPPORTED</span>
            </div>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-3">
          
          {/* Primary Action Button: GET FREE KEY */}
          <button
            type="button"
            onClick={handleGetKeyClick}
            className="px-5 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-[#022c22] bg-gradient-to-b from-[#4ade80] to-[#22c55e] hover:from-[#86efac] hover:to-[#16a34a] shadow-[0_3px_0_#15803d,0_8px_16px_rgba(34,197,94,0.35)] active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-[#022c22]" strokeWidth={3} />
            <span>Get Free Key</span>
          </button>

          {/* Secondary Buy Key Action */}
          <button
            type="button"
            onClick={() => navigateTo("products")}
            className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-zinc-100 bg-gradient-to-b from-[#252a3a] to-[#1a1d28] hover:from-[#2e3448] hover:to-[#202432] border border-[#32394e] shadow-[0_3px_0_#12141c] active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Buy Lifetime ($1.50)</span>
            <span className="sm:hidden">Buy ($1.50)</span>
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2-COLUMN ROSTAKE DASHBOARD LAYOUT */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (RoStake Style) */}
        {/* ========================================================================= */}
        <aside className="w-64 bg-[#12141c] border-r border-[#1f2330] p-4 hidden md:flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="flex flex-col gap-6">
            
            {/* Nav Group 1: HUBS & SCRIPTS */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-3">
                HUB DIRECTORY
              </span>
              
              <button
                type="button"
                onClick={() => navigateTo("home")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a1d28] border border-[#262b3a] shadow-sm cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-[#22c55e]" />
                <span>Supported Games</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo("scripts")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Scripts Studio</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo("add")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Custom Game</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo("products")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                <span>Lifetime VIP Store</span>
              </button>
            </div>

            {/* RoStake-style Promo Card */}
            <div 
              onClick={() => navigateTo("products")}
              className="relative p-4 rounded-2xl bg-gradient-to-br from-[#1e1b12] via-[#161510] to-[#12141c] border border-amber-500/30 overflow-hidden cursor-pointer hover:border-amber-400 transition-colors group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[9px] font-black text-amber-400 uppercase tracking-wide">
                  VIP LIFETIME
                </span>
                <span className="text-xs font-black text-white">$1.50</span>
              </div>
              <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                Skip All Checkpoints Forever
              </h4>
              <p className="text-[10px] text-zinc-400 mt-1">Instant automatic activation key.</p>
            </div>

            {/* Nav Group 2: COMMUNITY */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-3">
                COMMUNITY & INTEGRITY
              </span>
              
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-[#181b24] transition-colors"
              >
                <Terminal className="w-4 h-4 text-[#5865F2]" />
                <span>Discord Community</span>
              </a>

              <div className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-[#181b24] transition-colors cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Anti-Ban Protection</span>
              </div>
            </div>

          </div>

          {/* Bottom Version */}
          <div className="pt-4 border-t border-[#1f2330] flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>© 2026 Sotarium</span>
            <span className="text-emerald-400 font-mono">v2.4</span>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 max-w-6xl">
          
          {/* Welcome User Hero Bar */}
          <div className="p-5 rounded-2xl bg-[#141720] border border-[#202534] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1d28] to-[#12141c] border border-[#282d3e] p-2 flex items-center justify-center shadow-inner">
                <img src="https://i.imgur.com/qye2L7M.png" alt="Sotarium" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">Sotarium Universal Hub</h2>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#22c55e] text-[10px] font-black uppercase">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">Automatic Place ID game resolution with built-in Anti-AFK engine</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleGetKeyClick}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#22c55e] hover:bg-[#4ade80] text-[#022c22] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Get Free Key
              </button>
              <button
                type="button"
                onClick={() => navigateTo("products")}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1a1d28] hover:bg-[#222736] border border-[#2b3144] text-zinc-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Buy Lifetime ($1.50)
              </button>
            </div>
          </div>

          {/* 3 RoStake-style 3D Feature Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Banner 1: FREE KEY CHECKPOINT */}
            <div 
              onClick={handleGetKeyClick}
              className="relative p-5 rounded-2xl bg-gradient-to-br from-[#122822] via-[#0e1c18] to-[#12141c] border border-[#22c55e]/30 overflow-hidden shadow-lg cursor-pointer hover:border-[#22c55e] transition-all group flex flex-col justify-between min-h-[140px]"
            >
              <div className="relative z-10 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">FREE ACCESS</span>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors uppercase leading-tight">
                  GET FREE ACCESS KEY
                </h3>
                <p className="text-[11px] text-zinc-400">Complete quick checkpoint & unlock all games.</p>
              </div>
              <div className="relative z-10 pt-2 flex items-center text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>UNLOCK KEY NOW</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                🔑
              </div>
            </div>

            {/* Banner 2: LIFETIME STORE */}
            <div 
              onClick={() => navigateTo("products")}
              className="relative p-5 rounded-2xl bg-gradient-to-br from-[#2a2416] via-[#1a1710] to-[#12141c] border border-amber-500/30 overflow-hidden shadow-lg cursor-pointer hover:border-amber-400 transition-all group flex flex-col justify-between min-h-[140px]"
            >
              <div className="relative z-10 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">PERMANENT VIP ACCESS</span>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors uppercase leading-tight">
                  GET LIFETIME KEY
                </h3>
                <p className="text-[11px] text-zinc-400">Never do another checkpoint step forever ($1.50).</p>
              </div>
              <div className="relative z-10 pt-2 flex items-center text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>BUY VIP ACCESS</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                ⭐
              </div>
            </div>

            {/* Banner 3: SCRIPTS STUDIO */}
            <div 
              onClick={() => navigateTo("scripts")}
              className="relative p-5 rounded-2xl bg-gradient-to-br from-[#181c2e] via-[#121524] to-[#12141c] border border-indigo-500/30 overflow-hidden shadow-lg cursor-pointer hover:border-indigo-400 transition-all group flex flex-col justify-between min-h-[140px]"
            >
              <div className="relative z-10 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">SCRIPT CREATOR</span>
                <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors uppercase leading-tight">
                  SCRIPTS STUDIO
                </h3>
                <p className="text-[11px] text-zinc-400">Generate clean Luau payloads with instant copy.</p>
              </div>
              <div className="relative z-10 pt-2 flex items-center text-xs font-black text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>OPEN STUDIO</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                ⚡
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SUPPORTED GAMES SHOWCASE GRID */}
          {/* ========================================================================= */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#22c55e]" />
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Supported Games Directory
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-500">Auto-Detects Game by Place ID</span>
            </div>

            {/* Game Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((g) => (
                <div
                  key={g.id}
                  onClick={handleGetKeyClick}
                  className="group relative rounded-2xl bg-[#141720] border border-[#202534] hover:border-[#22c55e]/60 overflow-hidden flex flex-col shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-full h-36 bg-[#0c0d12] overflow-hidden relative">
                    <img
                      src={g.imageUrl}
                      alt={g.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-black text-[#22c55e] uppercase">
                      ACTIVE & WORKING
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col gap-1.5 bg-[#161922]">
                    <span className="font-extrabold text-sm text-white truncate group-hover:text-[#22c55e] transition-colors">
                      {g.name}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>Place ID: {g.placeId || "136020512003847"}</span>
                      <span className="text-[#22c55e] font-bold">Auto-Inject</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Custom Game Card */}
              <div
                onClick={() => navigateTo("add")}
                className="group rounded-2xl bg-[#141720]/60 border border-dashed border-[#282e40] hover:border-[#22c55e] p-6 flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all min-h-[180px]"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#1a1d28] border border-[#262b3a] flex items-center justify-center text-zinc-400 group-hover:text-[#22c55e] group-hover:border-[#22c55e] transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-zinc-300 group-hover:text-white uppercase tracking-wider">
                    Add Custom Game
                  </span>
                  <span className="text-[11px] text-zinc-500">Configure Place ID & script payload</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SYSTEM ARCHITECTURE & INTEGRITY CARDS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#141720] border border-[#202534] flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                <h4 className="text-xs font-black text-white uppercase">Cryptographic Signature</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Zero external database dependencies. Instant dual-channel token validation directly inside Roblox Luau.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141720] border border-[#202534] flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-black text-white uppercase">Anti-AFK & Telemetry</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Automated idle movement prevents the 20-minute Roblox kick with live telemetry tracking.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141720] border border-[#202534] flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black text-white uppercase">Multi-Place Injection</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Resolves the executing game's Place ID in real-time and loads the exact target script payload seamlessly.
              </p>
            </div>
          </div>

        </main>

      </div>

      {/* ========================================================================= */}
      {/* EARNPASTE / LOOTLABS MODAL */}
      {/* ========================================================================= */}
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

    </div>
  );
}

export default App;
