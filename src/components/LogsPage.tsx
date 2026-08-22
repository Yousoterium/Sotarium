import React, { useEffect, useState } from "react";
import { ArrowLeft, CircleDot, Loader2, RefreshCw, Trash2, ShieldAlert, CheckSquare, Square, X } from "lucide-react";

export type LogStatus = "info" | "pending" | "success" | "error";

export interface LogEntry {
  id: string;
  time: string;
  providerName?: string;
  providerIcon?: string;
  source?: string;
  message: string;
  status: LogStatus;
}

interface LogsPageProps {
  logs: LogEntry[];
  onBack: () => void;
  onClear: () => void;
}

const statusLabel = (status: LogStatus): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "success":
      return "Success";
    case "error":
      return "Error";
    default:
      return "Info";
  }
};

const DEFAULT_PROVIDERS: Array<{ name: string; icon: string; status: "Active" | "SOON"; disabled?: boolean }> = [
  { name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png", status: "Active" },
  { name: "Earnpaste", icon: "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj", status: "Active" },
  { name: "Work.ink", icon: "https://favicon.pub/api/work.ink?s=32", status: "Active" },
  { name: "Download Opera Browser", icon: "https://favicon.pub/api/opera.com?s=32", status: "SOON", disabled: true },
];

const getProviderIcon = (providerName?: string) => {
  if (!providerName) return DEFAULT_PROVIDERS[0].icon;
  const match = DEFAULT_PROVIDERS.find(
    (p) => p.name.toLowerCase() === providerName.toLowerCase()
  );
  return match ? match.icon : DEFAULT_PROVIDERS[0].icon;
};

const formatLogTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
};

const normalizeLogStatus = (status: unknown): LogStatus => {
  return status === "success" || status === "error" || status === "info" || status === "pending"
    ? status
    : "info";
};

export const LogsPage: React.FC<LogsPageProps> = ({ logs: propLogs, onBack, onClear }) => {
  const [dbLogs, setDbLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "success" | "pending" | "error">("all");

  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_deleted_log_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userIp, setUserIp] = useState<string | null>(null);
  const [isIpChecking, setIsIpChecking] = useState<boolean>(true);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [accessError, setAccessError] = useState<string>("");

  const loadDatabaseLogs = async () => {
    setIsLoading(true);
    setIsIpChecking(true);
    setAccessError("");

    try {
      const response = await fetch("/api/logs", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      const authorized = response.ok && payload?.authorized === true;

      setUserIp(typeof payload?.ip === "string" ? payload.ip : null);
      setIsAllowed(authorized);

      if (!authorized) {
        setDbLogs([]);
        setAccessError(payload?.error || "Access denied");
        return;
      }

      const records = Array.isArray(payload?.logs) ? payload.logs : [];
      const converted: LogEntry[] = records.map((record: any, index: number) => {
        const provider = typeof record?.providerName === "string" && record.providerName.trim()
          ? record.providerName.trim()
          : "Unknown";

        return {
          id: typeof record?.id === "string" ? record.id : `history-${index}`,
          time: typeof record?.time === "string" ? record.time : new Date().toISOString(),
          providerName: provider,
          providerIcon: getProviderIcon(provider),
          message: typeof record?.message === "string" ? record.message : "Log entry recorded",
          status: normalizeLogStatus(record?.status),
          source: typeof record?.source === "string" ? record.source : undefined,
        };
      });

      setDbLogs(converted);
    } catch {
      setIsAllowed(false);
      setDbLogs([]);
      setAccessError("Could not load the logs service");
    } finally {
      setIsLoading(false);
      setIsIpChecking(false);
    }
  };

  useEffect(() => {
    void loadDatabaseLogs();
  }, []);

  if (isIpChecking) {
    return (
      <div className="min-h-screen bg-[#0e0e11] text-white flex flex-col items-center justify-center gap-3 px-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#1AF513]" />
        <p className="text-sm font-semibold text-zinc-400">Checking access permissions...</p>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-black px-6 py-5 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_39%,rgba(118,70,255,0.20),transparent_20%),radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.045),transparent_40%)]" />
        <div
          className="pointer-events-none absolute left-1/2 top-[16%] h-[430px] w-[700px] -translate-x-1/2 rounded-[50%] opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_43%,transparent_72%)]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(132, 104, 255, 0.82) 1px, transparent 1.5px)",
            backgroundSize: "11px 11px",
            transform: "translateX(-50%) perspective(700px) rotateX(64deg)",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-[23%] h-72 w-[460px] -translate-x-1/2 rounded-[50%] border border-violet-400/15 bg-violet-400/[0.025] blur-[1px]" />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-75">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-violet-500 text-[11px] text-white">S</span>
            Sotarium
          </button>
          <span className="rounded-full border border-white/[0.10] bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Logs Console</span>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center pb-20 text-center">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-400/10 text-violet-200 shadow-[0_0_42px_rgba(124,92,255,0.18)]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl">Logs are protected.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400 sm:text-[15px]">
            This endpoint is limited to authorized networks. The logs themselves stay private, even when the page is reachable.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Return to home
            </button>
            <button
              type="button"
              onClick={() => void loadDatabaseLogs()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/[0.24] hover:bg-white/[0.07] active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry access
            </button>
          </div>

          <div className="mt-9 flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-black/30 px-4 py-2 font-mono text-[11px] text-zinc-500">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            <span className="uppercase tracking-[0.12em] text-zinc-600">Detected IP</span>
            <span className="max-w-[170px] truncate text-zinc-300">{userIp || "Unavailable"}</span>
          </div>
          {accessError && <p className="mt-3 text-xs text-zinc-600">{accessError}</p>}
        </main>

        <footer className="relative z-10 mx-auto w-full max-w-6xl text-center text-[11px] text-zinc-700">© {new Date().getFullYear()} Sotarium</footer>
      </div>
    );
  }

  // Merge prop logs (live session) and dbLogs (persisted in Supabase), removing duplicate IDs
  const combinedLogs = [...propLogs];
  for (const log of dbLogs) {
    if (!combinedLogs.some((l) => l.id === log.id)) {
      combinedLogs.push(log);
    }
  }

  // Filter out logs marked as deleted
  const logs = combinedLogs.filter((l) => !deletedIds.includes(l.id));

  const filteredLogs = logs.filter((entry) => {
    if (filter === "all") return true;
    return entry.status === filter;
  });

  const toggleLogSelection = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(filteredLogs.map((l) => l.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLogIds.length === 0) return;
    const updated = [...deletedIds, ...selectedLogIds];
    setDeletedIds(updated);
    try {
      localStorage.setItem("sotarium_deleted_log_ids", JSON.stringify(updated));
    } catch {}
    setSelectedLogIds([]);
    setIsSelectMode(false);
  };

  const handleClearAll = () => {
    const allIds = logs.map((l) => l.id);
    const updated = [...deletedIds, ...allIds];
    setDeletedIds(updated);
    try {
      localStorage.setItem("sotarium_deleted_log_ids", JSON.stringify(updated));
    } catch {}
    onClear();
    setSelectedLogIds([]);
    setIsSelectMode(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white px-6 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Floating Top Control Bar (No Card Wrapper) */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            title="Back"
            className="p-2.5 rounded-full border border-white/[0.08] bg-white/5 hover:bg-white/10 text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {isSelectMode ? (
            <div className="flex items-center gap-2 flex-wrap animate-fadeIn">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                {selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-[#1AF513]" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400" />
                )}
                Select All
              </button>

              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={selectedLogIds.length === 0}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-lg"
              >
                Delete Selected ({selectedLogIds.length})
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition cursor-pointer"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedLogIds([]);
                }}
                className="p-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadDatabaseLogs}
                disabled={isLoading}
                title="Refresh"
                className="p-2.5 rounded-full border border-white/[0.08] bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsSelectMode(true)}
                title="Delete Logs"
                className="p-2.5 rounded-full border border-white/[0.08] bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/50 text-white transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-zinc-300 hover:text-rose-400" />
              </button>
            </div>
          )}
        </div>

        {/* Provider overview */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEFAULT_PROVIDERS.map((provider) => {
            const count = logs.filter((l) => (l.providerName || "").toLowerCase() === provider.name.toLowerCase()).length;
            return (
              <div key={provider.name} className={`relative rounded-[22px] border p-5 shadow-sm ${provider.disabled ? "border-white/[0.05] bg-zinc-900/60 opacity-55 grayscale" : "border-white/[0.08] bg-[#131317]"}`}>
                <div className="flex items-center gap-3">
                  {provider.icon ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm">
                      <img src={provider.icon} alt={provider.name} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white shadow-sm">
                      <CircleDot className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm uppercase tracking-[0.16em] text-zinc-400">{provider.name}</p>
                    <p className="mt-1 text-3xl font-bold text-white">{count}</p>
                  </div>
                  <span className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.16em] ${provider.disabled ? "border border-white/10 bg-white/5 text-zinc-300" : "bg-[#1AF513]/15 text-[#1AF513]"}`}>{provider.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category filter buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["all", "success", "pending", "error"] as const).map((cat) => {
            const catCount = logs.filter((l) => cat === "all" || l.status === cat).length;
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  isActive
                    ? "border-2 border-white text-white font-bold bg-white/10 shadow-lg"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat} ({catCount})
              </button>
            );
          })}
        </div>

        {/* Log Entries Container */}
        <div>
          <div className="rounded-[18px] border border-white/[0.04] bg-[#0f0f12] p-3 max-h-[52vh] overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm p-6">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading lifetime logs...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-zinc-500 text-sm p-6 text-center">No {filter !== "all" ? filter : ""} log entries found.</div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((entry) => {
                  const isSelected = selectedLogIds.includes(entry.id);
                  return (
                    <div
                      key={entry.id}
                      onClick={() => {
                        if (isSelectMode) toggleLogSelection(entry.id);
                      }}
                      className={`flex items-start gap-3 rounded-lg border transition-all p-3 ${
                        isSelectMode ? "cursor-pointer select-none" : ""
                      } ${
                        isSelected
                          ? "border-rose-500/50 bg-rose-500/10"
                          : "border-white/[0.03] bg-[#111114] hover:bg-[#15151a]"
                      }`}
                    >
                      {isSelectMode && (
                        <div className="flex items-center justify-center self-center shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLogSelection(entry.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-0 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="flex-shrink-0">
                        {entry.providerIcon ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-white/[0.04] bg-white/5 flex items-center justify-center">
                            <img src={entry.providerIcon} alt={entry.providerName} className="h-10 w-10 object-cover rounded-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                            <CircleDot className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{entry.providerName || "Unknown"}</span>
                            <span className="text-xs text-zinc-400">{statusLabel(entry.status)}</span>
                          </div>
                          <span className="text-xs text-zinc-500">{formatLogTime(entry.time)}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-300">{entry.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
