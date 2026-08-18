import React, { useState, useEffect, useRef } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage, GameItem } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";
import { computeKeySignature } from "./components/EarnpasteModal";

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState<number>(0);

  // Key system simulator state
  const [enteredKey, setEnteredKey] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isShowingGames, setIsShowingGames] = useState<boolean>(false);
  const [gamesLoading, setGamesLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "key" | "rocket" } | null>(null);

  // Window states
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  // Games state
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_supported_games");
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });

  const showToast = (text: string, type: "success" | "error" | "key" | "rocket" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 2800);
  };

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

  const handleOpenSupportedGames = () => {
    setIsShowingGames(true);
    setGamesLoading(true);
    setTimeout(() => {
      setGamesLoading(false);
    }, 1800);
  };

  const handleCloseSupportedGames = () => {
    setIsShowingGames(false);
    setGamesLoading(false);
  };

  const handleSubmitKey = () => {
    const trimmed = enteredKey.trim().toUpperCase();
    if (trimmed.length === 0) {
      showToast("Please enter a key", "error");
      return;
    }

    setIsVerifying(true);
    setVerificationSuccess(false);
    setVerificationError(null);

    // Validate key
    setTimeout(() => {
      let isValid = false;
      if (trimmed === "TEST") {
        isValid = true;
      } else {
        const parts = trimmed.split("-");
        if (parts.length === 3 && parts[0].length >= 2 && parts[1].length >= 2 && parts[2].length >= 2) {
          isValid = true;
        } else if (trimmed.length >= 8 && trimmed.length <= 20) {
          isValid = true;
        }
      }

      if (isValid) {
        setVerificationSuccess(true);
        showToast("Access granted", "success");
        setTimeout(() => {
          setIsVerifying(false);
          setVerificationSuccess(false);
          showToast("Roblox Hub Loaded!", "rocket");
        }, 1800);
      } else {
        setIsVerifying(false);
        showToast("Invalid key", "error");
      }
    }, 2200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0c] text-white flex flex-col items-center justify-center font-sans select-none">
      
      {/* Toast Notification Container matching Roblox UI */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none animate-slide-in">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#141416] border border-zinc-800 shadow-2xl text-sm font-semibold">
            {toastMessage.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">✓</div>
            ) : toastMessage.type === "error" ? (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-black">✕</div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-black">🔑</div>
            )}
            <span className="text-zinc-200">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Exact Replica Window (720px by 440px) */}
      {!isClosed ? (
        <div 
          className={`relative w-[720px] max-w-[94vw] bg-[#0f0f11] border border-zinc-800/90 rounded-[14px] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 ${
            isMaximized ? "w-[96vw] h-[92vh] max-w-none rounded-2xl" : isMinimized ? "h-[42px]" : "h-[440px]"
          }`}
        >
          {/* Top Control Bar */}
          <div className="relative z-40 w-full h-[42px] px-4 flex items-center justify-between border-b border-transparent">
            {/* Title / Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider text-zinc-500 uppercase">Sotarium</span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-4 text-zinc-400">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-4 h-4 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
                title="Minimize"
              >
                <div className="w-3 h-[2px] bg-current rounded-full" />
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-4 h-4 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <div className="w-3 h-3 border-[1.5px] border-current rounded-[2px]" />
              </button>
              <button
                type="button"
                onClick={() => setIsClosed(true)}
                className="w-4 h-4 flex items-center justify-center hover:text-red-400 text-sm font-bold transition-colors cursor-pointer leading-none"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Center Content (Identical to in-game screenshot) */}
          {!isMinimized && (
            <div className="relative w-full h-[calc(100%-42px)] flex flex-col items-center justify-center p-6">
              
              <div className="w-[320px] max-w-full flex flex-col items-center text-center gap-3.5">
                
                {/* Title */}
                <h1 className="text-[22px] font-black tracking-tight text-white mb-1">
                  Get your access key
                </h1>

                {/* Key Input Box */}
                <div className="w-full h-11 bg-[#141416] border border-[#222225] rounded-[10px] flex items-center px-3.5 focus-within:border-zinc-500 transition-colors">
                  <input
                    type="text"
                    placeholder="Key"
                    value={enteredKey}
                    onChange={(e) => setEnteredKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitKey()}
                    className="w-full bg-transparent text-sm font-medium text-zinc-100 placeholder-zinc-500 outline-none"
                  />
                </div>

                {/* Side-by-side Buttons: Submit + Get Key */}
                <div className="w-full flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSubmitKey}
                    className={`flex-1 h-11 rounded-[10px] font-black text-sm transition-all duration-200 cursor-pointer ${
                      enteredKey.trim().length > 0
                        ? "bg-white text-black hover:bg-zinc-100 shadow-md"
                        : "bg-[#4a4a50] text-[#141416] hover:bg-[#585860]"
                    }`}
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider(PROVIDERS[0]);
                      setIsModalOpen(true);
                      setComebackStep(0);
                    }}
                    className="flex-1 h-11 rounded-[10px] font-black text-sm bg-[#141416] hover:bg-[#1c1c20] border border-[#26262a] text-zinc-200 transition-all cursor-pointer shadow-sm"
                  >
                    Get Key
                  </button>
                </div>

                {/* Full Width Button: Supported Games */}
                <button
                  type="button"
                  onClick={handleOpenSupportedGames}
                  className="w-full h-11 rounded-[10px] font-black text-sm bg-[#141416] hover:bg-[#1c1c20] border border-[#26262a] text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  Supported Games
                </button>
              </div>

              {/* Validation Animation Overlay (100% Identical to in-game) */}
              {isVerifying && (
                <div className="absolute inset-0 z-30 bg-[#0f0f11] flex flex-col items-center justify-center animate-fade-in select-none">
                  
                  {/* Spinner or Success Checkmark */}
                  {!verificationSuccess ? (
                    <div className="relative w-12 h-12 flex items-center justify-center mb-5">
                      <div className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="relative w-13 h-13 rounded-full bg-[#22d740] flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(34,215,64,0.5)] animate-spring-pop">
                      <span className="text-white font-black text-2xl">✓</span>
                    </div>
                  )}

                  {/* Centered Bold Gotham Black Status Text */}
                  <span className={`text-[15px] font-black tracking-wide transition-colors ${
                    verificationSuccess ? "text-[#2ee660]" : "text-zinc-200"
                  }`}>
                    {verificationSuccess ? "Key Verified!" : "Validating key..."}
                  </span>
                </div>
              )}

              {/* Supported Games Screen Overlay */}
              {isShowingGames && (
                <div className="absolute inset-0 z-30 bg-[#0c0c0e] flex flex-col p-4 animate-fade-in">
                  
                  {/* Top-Left Back Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                    <button
                      type="button"
                      onClick={handleCloseSupportedGames}
                      className="px-4 py-1.5 rounded-lg bg-[#16161a] hover:bg-[#222228] border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>←</span> Back
                    </button>
                    <span className="text-xs font-bold text-zinc-400">Supported Games</span>
                  </div>

                  {/* Loading Phase */}
                  {gamesLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-[2.5px] border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-sm font-bold text-zinc-300">Loading supported games...</span>
                    </div>
                  ) : (
                    /* 3-Column Games Showcase Grid matching in-game script */
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 overflow-y-auto mt-2">
                      {games.map((g) => (
                        <div
                          key={g.id}
                          className="rounded-xl bg-[#141418] border border-zinc-800 overflow-hidden flex flex-col shadow-md"
                        >
                          <div className="w-full h-24 bg-[#0a0a0c] overflow-hidden">
                            <img
                              src={g.imageUrl}
                              alt={g.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                          <div className="p-2.5 flex flex-col bg-[#101014] border-t border-zinc-800">
                            <span className="text-xs font-bold text-white truncate text-center">
                              {g.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        /* Reopen Window Button */
        <button
          type="button"
          onClick={() => setIsClosed(false)}
          className="px-6 py-3 rounded-xl bg-[#141418] hover:bg-[#1e1e24] border border-zinc-800 font-bold text-sm text-zinc-300 hover:text-white transition-all shadow-xl cursor-pointer"
        >
          Open Sotarium Hub UI
        </button>
      )}

      {/* Navigation Quick Links (Buy Key & Scripts) */}
      <div className="fixed bottom-6 flex items-center gap-3 text-xs font-bold text-zinc-500">
        <button
          type="button"
          onClick={() => navigateTo("products")}
          className="px-4 py-2 rounded-full bg-[#121215] hover:bg-[#1a1a20] border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          Buy Permanent Key
        </button>
        <button
          type="button"
          onClick={() => navigateTo("scripts")}
          className="px-4 py-2 rounded-full bg-[#121215] hover:bg-[#1a1a20] border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          Scripts Studio
        </button>
      </div>

      {/* Earnpaste / Lootlabs Checkpoint Modal */}
      <EarnpasteModal
        key={selectedProvider.name}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onCaught={() => {}}
        providerName={selectedProvider.name}
        providerIcon={selectedProvider.icon}
        initialStep={1}
        comebackStep={comebackStep}
      />

      <style>{`
        @keyframes springPop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideIn {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-spring-pop {
          animation: springPop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out both;
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default App;
