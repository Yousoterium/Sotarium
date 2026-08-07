import { useState, useEffect } from "react";
import { EarnpasteModal } from "./components/EarnpasteModal";
import { ProductsPage } from "./components/ProductsPage";
import { LogsPage, type LogEntry } from "./components/LogsPage";

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
  const [page, setPage] = useState<"home" | "products" | "logs">("home");
  const [showEarnpaste, setShowEarnpaste] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption>(PROVIDERS[0]);
  const [comebackStep, setComebackStep] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const appendLog = (entry: Omit<LogEntry, "id" | "time">) => {
    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const updated = [{ id, time, ...entry }, ...prev].slice(0, 200);
      try {
        localStorage.setItem("sotarium_logs", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearLogs = () => {
    setLogs([]);
    try {
      localStorage.removeItem("sotarium_logs");
    } catch {}
  };

  useEffect(() => {
    document.title = "Sotarium";

    const path = window.location.pathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (path === "/logs") {
      setPage("logs");
      return;
    }
    if (path === "/products") {
      setPage("products");
      return;
    }

    // Keep Lootlabs verification URLs working (verify, verify1, verify2)
    if (path === "/lootlabs" && (params.has("verify") || params.has("verify1") || params.has("verify2"))) {
      let step = 2;
      if (params.has("verify1")) step = 1;
      else if (params.has("verify2")) step = 2;

      window.history.replaceState({}, "", "/lootlabs?verify");

      setSelectedProvider(PROVIDERS[0]);
      setShowEarnpaste(true);
      setIsModalOpen(true);
      setComebackStep(step);
      return;
    }
  }, []);

  if (page === "products") {
    return <ProductsPage onBack={() => { setPage("home"); window.history.replaceState({}, "", "/"); }} />;
  }

  if (page === "logs") {
    return <LogsPage logs={logs} onBack={() => { setPage("home"); window.history.replaceState({}, "", "/"); }} onClear={clearLogs} />;
  }

  const handleGetKeyClick = () => {
    setSelectedProvider(PROVIDERS[0]);
    setShowEarnpaste(true);
    setIsModalOpen(true);
    setComebackStep(0);
  };

  const openLogs = () => {
    setPage("logs");
    window.history.pushState({}, "", "/logs");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0e0e11] text-white">


      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <img
            src="https://i.imgur.com/qye2L7M.png"
            alt="Sotarium"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />

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
        onLog={appendLog}
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
