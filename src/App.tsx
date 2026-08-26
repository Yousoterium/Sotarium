import { useEffect, useState } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { ScriptsPage } from "./components/ScriptsPage";
import { LogsPage, type LogEntry } from "./components/LogsPage";

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
  const [page, setPage] = useState<"home" | "products" | "scripts" | "logs">(() => {
    const path = window.location.pathname;
    if (path === "/scripts") return "scripts";
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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(null), 2500);
  };


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
    } else if (path === "/workink" && (params.has("ok") || params.has("done") || params.has("good"))) {
      // The existing first Work.ink link returns to ?ok. The second link returns to
      // ?good, so treat only ?good (and the legacy ?done value) as checkpoint two.
      const step = (params.has("done") || params.has("good")) ? 2 : 1;
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
  if (page === "products") return <ProductsPage onBack={() => setPage("home")} />;
  if (page === "logs") return <LogsPage logs={logs} onBack={() => { window.history.replaceState({}, "", "/"); setPage("home"); }} onClear={() => setLogs([])} />;

  return (
    <div className="relative flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-[#09090b] px-6 py-12 font-sans text-white antialiased">
      <div className="fixed inset-0 pointer-events-none opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      {isProviderPickerOpen ? (
        <main className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 text-center">
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
            <p className="max-w-md text-sm text-zinc-400">Complete two verification checkpoints to receive a key.</p>
          </div>
          <div className="grid w-full max-w-sm grid-cols-1 gap-4">
            {VISIBLE_PROVIDERS.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() => openProvider(provider)}
                className="group relative flex min-h-60 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.10] bg-[#141417] p-7 text-center shadow-md transition-all hover:-translate-y-1 hover:border-[#0989F1]/75 hover:bg-[#0989F1]/[0.12] focus:outline-none focus:ring-2 focus:ring-[#0989F1]/70 active:scale-[0.98]"
              >
                <span className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/[0.12] bg-zinc-700/70 shadow-[0_0_38px_rgba(255,255,255,0.05)] transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
                  {provider.id === "workink" ? (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00a37a] text-4xl font-black tracking-[-0.12em] text-white shadow-inner" aria-label="Work.ink">
                      W
                    </span>
                  ) : (
                    <img src={provider.icon} alt="" className="h-16 w-16 rounded-2xl object-contain" referrerPolicy="no-referrer" />
                  )}
                </span>
                <span className="mt-5">
                  <span className="block text-xl font-bold tracking-tight text-white">{provider.name}</span>
                  <span className="mt-2 block text-sm leading-5 text-zinc-400">{provider.description}</span>
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
          <div className="flex w-full max-w-xs flex-col gap-3">
            <button type="button" onClick={() => setIsProviderPickerOpen(true)} className="w-full rounded-full border border-white/[0.12] bg-[#141417] px-6 py-3 text-sm font-bold text-zinc-100 shadow-md transition-all hover:border-white/[0.24] hover:bg-[#1c1c20] hover:text-white active:scale-95">Get Key</button>
            <a href="https://discord.gg/3aghbJBybQ" className="w-full rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-bold text-zinc-300 shadow-sm transition-all hover:border-white/[0.24] hover:bg-white/[0.08] hover:text-white active:scale-95">Join Discord</a>
          </div>
        </main>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-[#18181c] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-bounce">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          {toastMsg}
        </div>
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
