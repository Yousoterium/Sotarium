import { useEffect, useState } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";

type ProviderId = "lootlabs" | "earnpaste" | "workink" | "opera";

interface ProviderOption {
  id: ProviderId;
  name: string;
  icon: string;
  secondaryIcon?: string;
  description: string;
}

const EARNPASTE_ICON =
  "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj";

const WORKINK_ICON = "https://favicon.pub/api/work.ink?s=32";
const OPERA_ICON = "https://favicon.pub/api/opera.com?s=32";

const PROVIDERS: ProviderOption[] = [
  { id: "lootlabs", name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png", description: "Complete two Lootlabs checkpoints" },
  { id: "earnpaste", name: "Earnpaste", icon: EARNPASTE_ICON, description: "Complete two Earnpaste checkpoints" },
  {
    id: "workink",
    name: "Work.ink",
    icon: WORKINK_ICON,
    description: "Complete two Work.ink checkpoints",
  },
  {
    id: "opera",
    name: "Download Opera Browser",
    icon: OPERA_ICON,
    description: "One download step to unlock your key",
  },
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
  const [workinkSession, setWorkinkSession] = useState<string | null>(null);
  const [workinkStep, setWorkinkStep] = useState<number | null>(null);
  const [workinkToken, setWorkinkToken] = useState<string | null>(null);

  const closeKeyModal = () => {
    setIsKeyModalOpen(false);
    setEarnpasteAction(null);
    setEarnpasteSession(null);
    setWorkinkSession(null);
    setWorkinkStep(null);
    setWorkinkToken(null);
    setComebackStep(0);
  };

  const openProvider = (provider: ProviderOption) => {
    setSelectedProvider(provider);
    setIsProviderPickerOpen(false);
    setComebackStep(0);
    setEarnpasteAction(null);
    setEarnpasteSession(null);
    setWorkinkSession(null);
    setWorkinkStep(null);
    setWorkinkToken(null);
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
    } else if (path === "/workink" && params.has("verify")) {
      const session = params.get("session");
      const token = params.get("token");
      const step = Number(params.get("step"));
      if (session && token && (step === 1 || step === 2)) {
        setSelectedProvider(PROVIDERS.find((provider) => provider.id === "workink") || PROVIDERS[0]);
        setWorkinkSession(session);
        setWorkinkStep(step);
        setWorkinkToken(token);
        setIsKeyModalOpen(true);
      }
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
      {isProviderPickerOpen ? (
        <main className="relative z-10 flex w-full max-w-md flex-col items-center justify-center gap-7 text-center">
          <div className="w-full text-left">
            <button
              type="button"
              onClick={() => setIsProviderPickerOpen(false)}
              className="rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-300 shadow-sm transition-all hover:border-white/[0.20] hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              Back to home
            </button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Choose a provider to obtain a key</h2>
            <p className="max-w-sm text-sm text-zinc-400">Choose a one-step or two-step method.</p>
          </div>
          <div className="w-full space-y-3">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() => openProvider(provider)}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/[0.10] bg-[#141417] p-4 text-left shadow-md transition-all hover:-translate-y-px hover:border-white/[0.24] hover:bg-[#1c1c20]"
              >
                <span className="relative flex h-12 w-14 shrink-0 items-center" aria-hidden="true">
                  <img src={provider.icon} alt="" className="h-12 w-12 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                  {provider.secondaryIcon && <img src={provider.secondaryIcon} alt="" className="absolute -right-0.5 -bottom-0.5 h-6 w-6 rounded-full border-2 border-[#141417] bg-[#141417] object-cover" referrerPolicy="no-referrer" />}
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">{provider.name}</span>
                  <span className="mt-0.5 block text-xs text-zinc-400">{provider.description}</span>
                </span>
              </button>
            ))}
          </div>
        </main>
      ) : (
        <main className="relative z-10 flex flex-col items-center justify-center gap-9 text-center">
          <div className="flex flex-col items-center gap-4">
            <img src="https://i.imgur.com/qye2L7M.png" alt="Sotarium" className="h-24 w-24 object-contain drop-shadow-md sm:h-28 sm:w-28" />
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Sotarium</h1>
          </div>
          <button type="button" onClick={() => setIsProviderPickerOpen(true)} className="w-full max-w-xs rounded-full border border-white/[0.12] bg-[#141417] px-6 py-3 text-sm font-bold text-zinc-100 shadow-md transition-all hover:border-white/[0.24] hover:bg-[#1c1c20] hover:text-white active:scale-95">Get Key</button>
        </main>
      )}

      <EarnpasteModal
        key={`${selectedProvider.id}-${earnpasteAction || "new"}-${earnpasteSession || ""}-${workinkSession || ""}-${workinkStep || ""}-${workinkToken || ""}`}
        isOpen={isKeyModalOpen}
        onClose={closeKeyModal}
        providerName={selectedProvider.name}
        providerIcon={selectedProvider.icon}
        providerKind={selectedProvider.id}
        initialStep={1}
        comebackStep={comebackStep}
        earnpasteAction={earnpasteAction}
        earnpasteSession={earnpasteSession}
        workinkSession={workinkSession}
        workinkStep={workinkStep}
        workinkToken={workinkToken}
      />
    </div>
  );
}

export default App;
