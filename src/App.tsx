import { useEffect, useState } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";

interface ProviderOption {
  name: "Lootlabs" | "Earnpaste";
  icon: string;
  description: string;
}

const EARNPASTE_ICON =
  "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj";

const PROVIDERS: ProviderOption[] = [
  { name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png", description: "Complete two Lootlabs checkpoints" },
  { name: "Earnpaste", icon: EARNPASTE_ICON, description: "Complete two Earnpaste checkpoints" },
];

function App() {
  const [page, setPage] = useState<"home" | "products" | "add" | "scripts">(() => {
    const path = window.location.pathname;
    if (path === "/scripts") return "scripts";
    if (path === "/add") return "add";
    if (path === "/products") return "products";
    return "home";
  });
  const [isProviderPickerOpen, setIsProviderPickerOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState(0);
  const [earnpasteAction, setEarnpasteAction] = useState<"upgrade" | "completed" | null>(null);
  const [earnpasteSession, setEarnpasteSession] = useState<string | null>(null);

  const closeKeyModal = () => {
    setIsKeyModalOpen(false);
    setEarnpasteAction(null);
    setEarnpasteSession(null);
    setComebackStep(0);
  };

  const openProvider = (provider: ProviderOption) => {
    setSelectedProvider(provider);
    setIsProviderPickerOpen(false);
    setComebackStep(0);
    setEarnpasteAction(null);
    setEarnpasteSession(null);
    setIsKeyModalOpen(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/scripts") setPage("scripts");
      else if (path === "/add") setPage("add");
      else if (path === "/products") setPage("products");
      else setPage("home");
    };
    window.addEventListener("popstate", handlePopState);

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    if (path === "/earnpaste" && (params.has("upgrade") || params.has("completed"))) {
      const action = params.has("completed") ? "completed" : "upgrade";
      const session = params.get("session");
      setSelectedProvider(PROVIDERS[1]);
      setEarnpasteAction(action);
      setEarnpasteSession(session);
      setIsKeyModalOpen(true);
    } else if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      setSelectedProvider(PROVIDERS[0]);
      setComebackStep(params.has("verify1") ? 1 : 2);
      setIsKeyModalOpen(true);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (page === "scripts") return <ScriptsPage onBack={() => setPage("home")} />;
  if (page === "add") return <AddGamePage onBack={() => setPage("home")} />;
  if (page === "products") return <ProductsPage onBack={() => setPage("home")} />;

  return (
    <div className="relative flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6 py-12 font-sans text-white antialiased">
      <div className="fixed inset-0 pointer-events-none opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <main className="relative z-10 flex flex-col items-center justify-center gap-9 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="https://i.imgur.com/qye2L7M.png" alt="Sotarium" className="h-24 w-24 object-contain drop-shadow-md sm:h-28 sm:w-28" />
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Sotarium</h1>
          <p className="max-w-sm text-sm text-zinc-400">Choose a key method, complete two steps, and receive a key verified by Sotarium.</p>
        </div>
        <button type="button" onClick={() => setIsProviderPickerOpen(true)} className="w-full max-w-xs rounded-full border border-white/[0.12] bg-[#141417] px-6 py-3 text-sm font-bold text-zinc-100 shadow-md transition-all hover:border-white/[0.24] hover:bg-[#1c1c20] hover:text-white active:scale-95">Get Key</button>
      </main>

      {isProviderPickerOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#09090b]/90 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-[26px] border border-white/[0.08] bg-[#121215] p-7 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold">Choose a key method</h2><p className="mt-1 text-sm text-zinc-400">Each method uses two verification steps.</p></div><button type="button" onClick={() => setIsProviderPickerOpen(false)} className="text-zinc-400 hover:text-white">✕</button></div>
            <div className="space-y-3">
              {PROVIDERS.map((provider) => (
                <button key={provider.name} type="button" onClick={() => openProvider(provider)} className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-colors hover:border-white/[0.18] hover:bg-white/[0.06]">
                  <img src={provider.icon} alt="" className="h-11 w-11 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                  <span><span className="block text-sm font-bold text-white">{provider.name}</span><span className="mt-0.5 block text-xs text-zinc-400">{provider.description}</span></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <EarnpasteModal
        key={`${selectedProvider.name}-${earnpasteAction || "new"}-${earnpasteSession || ""}`}
        isOpen={isKeyModalOpen}
        onClose={closeKeyModal}
        onCaught={() => {}}
        providerName={selectedProvider.name}
        providerIcon={selectedProvider.icon}
        initialStep={1}
        comebackStep={comebackStep}
        earnpasteAction={earnpasteAction}
        earnpasteSession={earnpasteSession}
      />
    </div>
  );
}

export default App;
