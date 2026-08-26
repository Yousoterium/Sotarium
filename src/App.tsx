import { useEffect, useState } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";
import { LogsPage, type LogEntry } from "./components/LogsPage";

// Reference-matched provider flow: preserve the original homepage; use a compact dark service rack only after Get Key is selected.
type ProviderId = "lootlabs" | "earnpaste" | "workink";

interface ProviderOption {
  id: ProviderId;
  name: string;
  icon: string;
  secondaryIcon?: string;
  description: string;
  disabled?: boolean;
  badge?: string;
}

const EARNPASTE_ICON =
  "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj";

const WORKINK_ICON = "https://favicon.pub/api/work.ink?s=32";

const PROVIDERS: ProviderOption[] = [
  { id: "lootlabs", name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png", description: "Complete two Lootlabs checkpoints" },
  { id: "earnpaste", name: "Earnpaste", icon: EARNPASTE_ICON, description: "Complete two Earnpaste checkpoints" },
  {
    id: "workink",
    name: "Work.ink",
    icon: WORKINK_ICON,
    description: "Complete two Work.ink checkpoints",
  },
];

// Temporary picker configuration: keep all provider definitions intact, but only show Work.ink.
const VISIBLE_PROVIDER_IDS: ProviderId[] = ["workink"];
const VISIBLE_PROVIDERS = PROVIDERS.filter((provider) => VISIBLE_PROVIDER_IDS.includes(provider.id));

function App() {
  const [page, setPage] = useState<"home" | "products" | "add" | "scripts" | "logs">(() => {
    const path = window.location.pathname;
    if (path === "/scripts") return "scripts";
    if (path === "/add") return "add";
    if (path === "/products") return "products";
    if (path === "/logs") return "logs";
    return "home";
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProviderPickerOpen, setIsProviderPickerOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS.find((provider) => provider.id === "workink") || PROVIDERS[0]);
  const [lootlabsSession, setLootlabsSession] = useState<string | null>(null);
  const [lootlabsStep, setLootlabsStep] = useState<number | null>(null);
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
    setLootlabsSession(null);
    setLootlabsStep(null);
  };

  const openProvider = (provider: ProviderOption) => {
    if (provider.disabled) return;
    setSelectedProvider(provider);
    setIsProviderPickerOpen(false);
    setLootlabsSession(null);
    setLootlabsStep(null);
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
      else if (path === "/logs") setPage("logs");
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
    } else if (path === "/workink" && (params.has("ok") || params.has("done"))) {
      const step = params.has("done") ? 2 : 1;
      setSelectedProvider(PROVIDERS.find((provider) => provider.id === "workink") || PROVIDERS[0]);
      setWorkinkSession(null);
      setWorkinkStep(step);
      setWorkinkToken(null);
      setIsKeyModalOpen(true);
    } else if (path === "/lootlabs") {
      const session = params.get("session");
      const step = Number(params.get("step"));
      if (session && (step === 1 || step === 2)) {
        setSelectedProvider(PROVIDERS[0]);
        setLootlabsSession(session);
        setLootlabsStep(step);
        setIsKeyModalOpen(true);
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (page === "scripts") return <ScriptsPage onBack={() => setPage("home")} />;
  if (page === "add") return <AddGamePage onBack={() => setPage("home")} />;
  if (page === "products") return <ProductsPage onBack={() => setPage("home")} />;
  if (page === "logs") return <LogsPage logs={logs} onBack={() => { window.history.replaceState({}, "", "/"); setPage("home"); }} onClear={() => setLogs([])} />;

  return (
    <div className="relative flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6 py-12 font-sans text-white antialiased">
      <div className="fixed inset-0 pointer-events-none opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      {isProviderPickerOpen ? (
        <main className="relative z-10 w-full max-w-6xl">
          <section className="auth-card rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-[18px] backdrop-saturate-150 sm:p-6">
            <div className="auth-head">
              <h2 className="text-base font-bold tracking-tight text-white">Available</h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {VISIBLE_PROVIDERS.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() => openProvider(provider)}
                className="group relative flex min-h-[70px] items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] transition duration-180 hover:border-white/[0.18] hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/[0.24] active:scale-[0.985]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#121316]" aria-hidden="true">
                  {provider.id === "workink" ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#138b70] text-[17px] font-black tracking-[-0.15em] text-white" aria-label="Work.ink">
                      w
                    </span>
                  ) : (
                    <img src={provider.icon} alt="" className="h-7 w-7 rounded-lg object-contain" referrerPolicy="no-referrer" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold tracking-tight text-white">{provider.name}</span>
                </span>
              </button>
            ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="relative z-10 flex flex-col items-center justify-center gap-9 text-center">
          <div className="flex flex-col items-center gap-4">
            <img src="https://i.imgur.com/qye2L7M.png" alt="Sotarium" className="h-24 w-24 object-contain drop-shadow-md sm:h-28 sm:w-28" />
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Sotarium</h1>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <button type="button" onClick={() => setIsProviderPickerOpen(true)} className="w-full rounded-full border border-white/[0.12] bg-[#141417] px-6 py-3 text-sm font-bold text-zinc-100 shadow-md transition-all hover:border-white/[0.24] hover:bg-[#1c1c20] hover:text-white active:scale-95">Get Key</button>
          </div>
        </main>
      )}

      <EarnpasteModal
        key={`${selectedProvider.id}-${lootlabsSession || ""}-${lootlabsStep || ""}-${earnpasteAction || "new"}-${earnpasteSession || ""}-${workinkSession || ""}-${workinkStep || ""}-${workinkToken || ""}`}
        isOpen={isKeyModalOpen}
        onClose={closeKeyModal}
        providerName={selectedProvider.name}
        providerIcon={selectedProvider.icon}
        providerKind={selectedProvider.id}
        initialStep={1}
        lootlabsSession={lootlabsSession}
        lootlabsStep={lootlabsStep}
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
