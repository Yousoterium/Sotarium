import React, { useEffect, useState } from "react";
import { ArrowLeft, CircleDot, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { fetchKeysFromDatabase } from "../lib/supabase";

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

const statusIcon = (status: LogStatus) => {
  switch (status) {
    case "pending":
      return <Loader2 className="w-4 h-4 animate-spin text-sky-400" />;
    case "success":
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case "error":
      return <XCircle className="w-4 h-4 text-rose-400" />;
    default:
      return <CircleDot className="w-4 h-4 text-zinc-400" />;
  }
};

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

const DEFAULT_PROVIDERS = [
  { name: "Lootlabs", icon: "https://i.imgur.com/hmJCWhI.png" },
];

const getProviderIcon = (providerName?: string) => {
  if (!providerName) return DEFAULT_PROVIDERS[0].icon;
  const match = DEFAULT_PROVIDERS.find(
    (p) => p.name.toLowerCase() === providerName.toLowerCase()
  );
  return match ? match.icon : DEFAULT_PROVIDERS[0].icon;
};

export const LogsPage: React.FC<LogsPageProps> = ({ logs: propLogs, onBack, onClear }) => {
  const [dbLogs, setDbLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDatabaseLogs = async () => {
    setIsLoading(true);
    const keys = await fetchKeysFromDatabase();
    if (keys && keys.length > 0) {
      const converted: LogEntry[] = keys.map((k: any, idx: number) => {
        const provider = k.provider
          ? k.provider.charAt(0).toUpperCase() + k.provider.slice(1)
          : "Earnpaste";
        
        let msg = `Key generated: ${k.key_string}`;
        if (k.claimed) {
          msg = `Key ${k.key_string} claimed by Roblox user: ${k.owner_username || k.owner_roblox_id || "Unknown"}`;
        }

        return {
          id: k.id ? String(k.id) : `db-key-${idx}`,
          time: k.created_at ? new Date(k.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
          providerName: provider,
          providerIcon: getProviderIcon(provider),
          message: msg,
          status: k.claimed ? ("success" as LogStatus) : ("info" as LogStatus),
        };
      });
      setDbLogs(converted);
    } else {
      setDbLogs([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDatabaseLogs();
  }, []);

  // Merge prop logs (live session) and dbLogs (persisted in Supabase), removing duplicate IDs
  const combinedLogs = [...propLogs];
  for (const log of dbLogs) {
    if (!combinedLogs.some((l) => l.id === log.id)) {
      combinedLogs.push(log);
    }
  }

  const logs = combinedLogs;


  return (
    <div className="min-h-screen bg-[#0e0e11] text-white px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[26px] border border-white/[0.08] bg-[#131317] p-6 shadow-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Logs</h1>
            <p className="mt-1 text-sm text-zinc-400">Live step activity, completion status, and workflow events.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadDatabaseLogs}
              disabled={isLoading}
              className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <ArrowLeft className="inline-block w-4 h-4 mr-2" /> Back
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {DEFAULT_PROVIDERS.map((provider) => {
            const count = logs.filter((l) => (l.providerName || "").toLowerCase() === provider.name.toLowerCase()).length;
            return (
              <div key={provider.name} className="w-full max-w-md rounded-[26px] border border-white/[0.08] bg-[#131317] p-5 shadow-sm">
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

                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">{provider.name}</p>
                    <p className="mt-1 text-3xl font-bold text-white">{count}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">Started steps & generated keys detected.</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <div className="rounded-[18px] border border-white/[0.04] bg-[#0f0f12] p-3 max-h-[48vh] overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm p-6">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading logs from database...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-zinc-500 text-sm p-6 text-center">No log entries yet.</div>
            ) : (
              <div className="space-y-3">
                {logs.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-white/[0.03] bg-[#111114] p-3">
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
                        <span className="text-xs text-zinc-500">{entry.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-300">{entry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
