import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleDot,
  Loader2,
  RefreshCw,
  Trash2,
  CheckSquare,
  Square,
  X,
  ExternalLink,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AsciiCanvas } from "./AsciiCanvas";

export type LogStatus = "info" | "pending" | "processing" | "success" | "expired" | "error";

export interface LogEntry {
  id: string;
  time: string;
  providerName?: string;
  providerIcon?: string;
  source?: string;
  message: string;
  status: LogStatus;
  url?: string;
  step?: number;
  sessionId?: string;
  expiresAt?: string;
}

interface LogsPageProps {
  logs: LogEntry[];
  onBack: () => void;
  onClear: () => void;
}

const SIXTEEN_MINUTES_MS = 16 * 60 * 1000;

const DEFAULT_PROVIDERS: Array<{ name: string; icon: string; status: "Active" | "SOON"; disabled?: boolean }> = [
  { name: "Work.ink", icon: "https://favicon.pub/api/work.ink?s=32", status: "Active" },
  { name: "Earnpaste", icon: "https://images.socialblade.com/128x,q75/https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s192-c-k-c0x00ffffff-no-rj", status: "Active" },
  { name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png", status: "Active" },
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

const normalizeLogStatus = (status: unknown, timeStr?: string): LogStatus => {
  if (status === "success") return "success";
  if (status === "expired") return "expired";
  if (status === "error") return "error";
  if (status === "info") return "info";

  // Check 16 minute expiration for pending / processing
  if (status === "pending" || status === "processing") {
    if (timeStr) {
      const timeMs = new Date(timeStr).getTime();
      if (!Number.isNaN(timeMs) && Date.now() - timeMs > SIXTEEN_MINUTES_MS) {
        return "expired";
      }
    }
    return "processing";
  }

  return "info";
};

export const LogsPage: React.FC<LogsPageProps> = ({ logs: propLogs, onBack, onClear }) => {
  const [dbLogs, setDbLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "processing" | "success" | "expired" | "error">("all");
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

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

  const [isIpChecking, setIsIpChecking] = useState<boolean>(true);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [accessError, setAccessError] = useState<string>("");
  const [, setTick] = useState<number>(0);

  // Live timer tick to update relative expiration times every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadDatabaseLogs = async () => {
    setIsLoading(true);
    setIsIpChecking(true);
    setAccessError("");

    try {
      const response = await fetch("/api/logs", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      const authorized = response.ok && payload?.authorized === true;

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
          : "Work.ink";

        const time = typeof record?.time === "string" ? record.time : new Date().toISOString();

        return {
          id: typeof record?.id === "string" ? record.id : `history-${index}`,
          time,
          providerName: provider,
          providerIcon: getProviderIcon(provider),
          message: typeof record?.message === "string" ? record.message : "Log entry recorded",
          status: normalizeLogStatus(record?.status, time),
          source: typeof record?.source === "string" ? record.source : undefined,
          url: typeof record?.url === "string" ? record.url : undefined,
          step: typeof record?.step === "number" ? record.step : undefined,
          sessionId: typeof record?.sessionId === "string" ? record.sessionId : undefined,
          expiresAt: typeof record?.expiresAt === "string" ? record.expiresAt : undefined,
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
      <div className="relative flex min-h-screen w-full select-none items-center justify-center overflow-hidden bg-[#09090b] px-6 py-12 font-sans text-white antialiased">
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.28]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl text-white">You cannot access this page!</h1>
          <p className="text-sm text-zinc-400 max-w-md">{accessError || "Your IP address is not authorized to view the system logs."}</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold text-zinc-200 transition cursor-pointer"
          >
            Return to Home
          </button>
        </div>
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

  // Normalize statuses dynamically (including 16-minute auto-expiry for processing items)
  const normalizedLogs = combinedLogs.map((l) => {
    return {
      ...l,
      status: normalizeLogStatus(l.status, l.time),
    };
  });

  // Filter out logs marked as deleted
  const logs = normalizedLogs.filter((l) => !deletedIds.includes(l.id));

  const filteredLogs = logs.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "processing") return entry.status === "processing" || entry.status === "pending";
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

  const handleCopyUrl = async (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const countByStatus = (status: "processing" | "success" | "expired" | "error") => {
    return logs.filter((l) => {
      if (status === "processing") return l.status === "processing" || l.status === "pending";
      return l.status === status;
    }).length;
  };

  const renderStatusBadge = (status: LogStatus) => {
    switch (status) {
      case "processing":
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Processing
          </span>
        );
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-500/15 text-[#1AF513] border border-emerald-500/30 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-[#1AF513]" />
            Success
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm">
            <Clock className="w-3 h-3 text-rose-400" />
            Expired
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-red-500/15 text-red-400 border border-red-500/30 shadow-sm">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-zinc-400 border border-white/10">
            Info
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-8 select-none font-sans overflow-hidden">

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Floating Top Control Bar */}
        <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              title="Back"
              className="p-2.5 rounded-full border border-white/[0.08] bg-[#131317] hover:bg-white/10 text-white transition cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Verification URL Logs
              </h1>
              <p className="text-xs text-zinc-400">Live Work.ink URL states, 16-minute timeouts, and key issuance</p>
            </div>
          </div>

          {isSelectMode ? (
            <div className="flex items-center gap-2 flex-wrap animate-fadeIn">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[#131317] hover:bg-white/10 text-xs font-semibold text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
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
                className="p-1.5 rounded-full border border-white/10 bg-[#131317] hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
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
                title="Refresh logs"
                className="p-2.5 rounded-full border border-white/[0.08] bg-[#131317] hover:bg-white/10 text-white transition disabled:opacity-50 cursor-pointer shadow-md"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsSelectMode(true)}
                title="Delete logs"
                className="p-2.5 rounded-full border border-white/[0.08] bg-[#131317] hover:bg-rose-500/20 hover:border-rose-500/50 text-white transition cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4 text-zinc-300 hover:text-rose-400" />
              </button>
            </div>
          )}
        </div>

        {/* Provider overview */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEFAULT_PROVIDERS.map((provider) => {
            const count = logs.filter((l) => (l.providerName || "").toLowerCase() === provider.name.toLowerCase()).length;
            return (
              <div
                key={provider.name}
                className={`relative rounded-[22px] border p-4 sm:p-5 shadow-sm transition ${
                  provider.disabled ? "border-white/[0.05] bg-zinc-900/60 opacity-55 grayscale" : "border-white/[0.08] bg-[#131317]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {provider.icon ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm overflow-hidden shrink-0">
                      <img src={provider.icon} alt={provider.name} className="h-9 w-9 object-cover rounded-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white shadow-sm shrink-0">
                      <CircleDot className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs uppercase tracking-[0.16em] text-zinc-400 font-semibold">{provider.name}</p>
                    <p className="mt-0.5 text-2xl sm:text-3xl font-black text-white">{count}</p>
                  </div>
                  <span
                    className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.16em] ${
                      provider.disabled ? "border border-white/10 bg-white/5 text-zinc-300" : "bg-[#1AF513]/15 text-[#1AF513] border border-[#1AF513]/30"
                    }`}
                  >
                    {provider.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
          {[
            { id: "all", label: "All", count: logs.length },
            { id: "processing", label: "Processing", count: countByStatus("processing") },
            { id: "success", label: "Success", count: countByStatus("success") },
            { id: "expired", label: "Expired", count: countByStatus("expired") },
            { id: "error", label: "Error", count: countByStatus("error") },
          ].map((cat) => {
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "border-2 border-white text-white font-bold bg-white/10 shadow-lg scale-105"
                    : "bg-[#131317] border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-white text-black font-bold" : "bg-white/10 text-zinc-300"}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Log Entries Container */}
        <div>
          <div className="rounded-[22px] border border-white/[0.08] bg-[#121215] p-3 sm:p-4 max-h-[58vh] overflow-y-auto shadow-2xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-zinc-400 text-sm p-12">
                <Loader2 className="w-7 h-7 animate-spin text-[#1AF513]" />
                <p className="font-semibold text-zinc-400">Loading Work.ink verification logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-zinc-500 text-sm p-12 text-center flex flex-col items-center gap-2">
                <CircleDot className="w-8 h-8 text-zinc-600 mb-1" />
                <p className="font-semibold text-zinc-400">No {filter !== "all" ? filter : ""} log entries found.</p>
                <p className="text-xs text-zinc-500">When users start checkpoints via Work.ink, their generated verification URLs and states will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((entry) => {
                  const isSelected = selectedLogIds.includes(entry.id);
                  const isProcessing = entry.status === "processing" || entry.status === "pending";
                  const isExpired = entry.status === "expired";
                  const isSuccess = entry.status === "success";

                  return (
                    <div
                      key={entry.id}
                      onClick={() => {
                        if (isSelectMode) toggleLogSelection(entry.id);
                      }}
                      className={`relative rounded-xl border transition-all p-4 flex flex-col gap-3 ${
                        isSelectMode ? "cursor-pointer select-none" : ""
                      } ${
                        isSelected
                          ? "border-rose-500/50 bg-rose-500/10"
                          : isProcessing
                          ? "border-amber-500/25 bg-[#171612] hover:bg-[#1c1a14]"
                          : isExpired
                          ? "border-rose-500/20 bg-[#171214] hover:bg-[#1c1417]"
                          : "border-white/[0.06] bg-[#15151a] hover:bg-[#181820]"
                      }`}
                    >
                      {/* Top Header Row: Provider, Step Badge, Status Badge, Time */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          {isSelectMode && (
                            <div className="flex items-center justify-center shrink-0 mr-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLogSelection(entry.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-0 cursor-pointer"
                              />
                            </div>
                          )}

                          {entry.providerIcon ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                              <img src={entry.providerIcon} alt={entry.providerName} className="h-8 w-8 object-cover rounded-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <CircleDot className="h-4 w-4 text-zinc-400" />
                            </div>
                          )}

                          <span className="text-sm font-bold text-white tracking-tight">{entry.providerName || "Work.ink"}</span>

                          {entry.step && (
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-bold border border-white/10">
                              Step {entry.step}
                            </span>
                          )}

                          {renderStatusBadge(entry.status)}
                        </div>

                        <span className="text-xs text-zinc-400 font-medium">
                          {formatLogTime(entry.time)}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className="text-sm text-zinc-300 font-medium">
                        {entry.message}
                      </div>

                      {/* Verification URL Card Box if present */}
                      {entry.url && (
                        <div className="w-full flex items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-[#0c0c0f] p-2.5 font-mono text-xs text-zinc-300">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-zinc-500 select-none text-[10px] uppercase font-bold tracking-wider shrink-0">URL:</span>
                            <span className="truncate text-zinc-200 select-all font-mono">
                              {entry.url}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleCopyUrl(entry.id, entry.url!, e)}
                              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95"
                              title="Copy URL"
                            >
                              {copiedUrlId === entry.id ? (
                                <>
                                  <Check className="w-3 h-3 text-[#1AF513]" />
                                  <span className="text-[#1AF513]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition cursor-pointer"
                              title="Open URL in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Expiration Note Footer */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                        {isProcessing && (
                          <span className="text-amber-400/90 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active checkpoint · Will expire if user does not return within 16 minutes
                          </span>
                        )}
                        {isExpired && (
                          <span className="text-rose-400/90 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expired · User did not return within 16 minutes
                          </span>
                        )}
                        {isSuccess && (
                          <span className="text-[#1AF513]/90 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Completed · Verification successful & key unlocked
                          </span>
                        )}

                        {entry.sessionId && (
                          <span className="text-zinc-600 font-mono text-[10px] ml-auto">
                            ID: {entry.sessionId.slice(0, 8)}...
                          </span>
                        )}
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

