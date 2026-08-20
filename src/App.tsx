import { useState, useEffect } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b] text-white flex flex-col items-center justify-center font-sans select-none antialiased">
      
      {/* Clean Subtle Dot Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Main Centered Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 text-center gap-9 py-12">
        
        {/* Mascot & Title */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md"
          />

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
            Sotarium
          </h1>
        </div>

        {/* Action Buttons: Get Key and Buy key Side-by-Side */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          {/* Get Key Button */}
          <button
            type="button"
            onClick={handleGetKeyClick}
            className="flex-1 py-3 px-6 rounded-full border border-white/[0.12] bg-[#141417] hover:bg-[#1c1c20] hover:border-white/[0.24] transition-all duration-200 shadow-md active:scale-95 cursor-pointer font-bold text-sm text-zinc-100 hover:text-white"
          >
            Get Key
          </button>

          {/* Buy key Button */}
          <button
            type="button"
            disabled
            className="flex-1 py-3 px-6 rounded-full border border-white/[0.08] bg-[#141417]/70 shadow-md font-bold text-sm text-zinc-500 cursor-not-allowed"
          >
            Soon
          </button>
        </div>

      </main>

      {/* Earnpaste / Lootlabs Checkpoint Modal */}
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
