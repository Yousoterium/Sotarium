import { useState, useEffect } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";

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

function App() {
  const [page, setPage] = useState<"home" | "products" | "add">(() => {
    const p = window.location.pathname;
    if (p === "/add") return "add";
    if (p === "/products") return "products";
    return "home";
  });
  const [showEarnpaste, setShowEarnpaste] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState<number>(0);

  const navigateTo = (newPage: "home" | "products" | "add") => {
    setPage(newPage);
    const targetUrl = newPage === "home" ? "/" : `/${newPage}`;
    window.history.pushState({ page: newPage }, "", targetUrl);
    document.title = newPage === "add" ? "Add Game" : newPage === "products" ? "Products" : "Home";
  };

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/add") setPage("add");
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#0e0e11] text-white">
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-lg tracking-wider text-white">Home</span>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Home"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
          <div className="space-y-3">
            <h1 className="text-6xl font-black tracking-tight leading-none text-white">
              Home
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleGetKeyClick}
              className="px-8 py-3 rounded-full border border-zinc-700/60 bg-[#1c1c21] hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg cursor-pointer active:scale-95 text-white font-bold text-base"
            >
              Get Key
            </button>
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}

export default App;
