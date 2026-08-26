import { useEffect, useState } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { AddGamePage } from "./components/AddGamePage";
import { ScriptsPage } from "./components/ScriptsPage";
import { LogsPage, type LogEntry } from "./components/LogsPage";

// Operator Glass: a compact, left-anchored provider rack on graphite surfaces; Work.ink teal is reserved for the live route.
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
    <div className="relative flex min-h-screen w-full select-none flex-col items-center justify-center overflow-hidden bg-[#08090b] px-5 py-8 font-sans text-white antialiased sm:px-8">
      <div className="fixed inset-0 pointer-events-none opacity-[0.2]" style={{ backgroundImage: "radial-gradient(rgba(101,183,255,0.22) 1px,transparent 1px)", backgroundSize: "30px 30px", maskImage: "radial-gradient(ellipse at center, black 0%, transparent 68%)" }} />
      {isProviderPickerOpen ? (
        <main className="relative z-10 flex w-full max-w-6xl flex-col gap-7">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#65B7FF]/75">Sotarium / player access</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Choose your provider</h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">Select an available provider to start your key verification flow.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsProviderPickerOpen(false)}
              className="w-fit rounded-lg border border-white/[0.1] bg-white/[0.035] px-4 py-2 text-sm font-semibold text-zinc-300 shadow-sm transition duration-180 hover:border-white/[0.22] hover:bg-white/[0.075] hover:text-white active:scale-[0.97]"
            >
              ← Back home
            </button>
          </header>

          <section className="auth-card rounded-[18px] border border-white/[0.1] bg-[#0d0e10]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-6">
            <div className="auth-head flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-white">Available</h2>
                <p className="mt-1 text-xs text-zinc-500">Providers ready for player verification</p>
              </div>
              <span className="rounded-full border border-[#00a37a]/20 bg-[#00a37a]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6de2c4]">1 live</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:max-w-[390px]">
            {VISIBLE_PROVIDERS.map((provider) => (
              <button
                key={provider.name}
                type="button"
                onClick={() => openProvider(provider)}
                className="group relative flex min-h-[74px] items-center gap-3 overflow-hidden rounded-xl border border-white/[0.075] bg-[#0b0c0e] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-180 hover:-translate-y-0.5 hover:border-[#00a37a]/45 hover:bg-[#101315] focus:outline-none focus:ring-2 focus:ring-[#00a37a]/50 active:scale-[0.985]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#141619] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" aria-hidden="true">
                  {provider.id === "workink" ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00a37a] text-[17px] font-black tracking-[-0.15em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]" aria-label="Work.ink">
                      w
                    </span>
                  ) : (
                    <img src={provider.icon} alt="" className="h-7 w-7 rounded-lg object-contain" referrerPolicy="no-referrer" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold tracking-tight text-white">{provider.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500">Ready to start</span>
                </span>
                <span className="text-xl font-light text-zinc-600 transition duration-180 group-hover:text-[#6de2c4]" aria-hidden="true">+</span>
              </button>
            ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-9 text-center">
          <div className="flex flex-col items-center gap-4">
            <img src="/logo.svg" alt="Sotarium" className="h-20 w-20 object-contain drop-shadow-[0_0_24px_rgba(101,183,255,0.2)] sm:h-24 sm:w-24" />
            <div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Sotarium</h1>
              <p className="mt-3 text-sm text-zinc-500">Player access gateway</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsProviderPickerOpen(true)} className="w-full rounded-xl border border-white/[0.12] bg-white/[0.065] px-6 py-3.5 text-sm font-bold text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.25)] transition duration-180 hover:border-[#65B7FF]/45 hover:bg-white/[0.1] hover:text-white active:scale-[0.98]">Get key</button>
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
