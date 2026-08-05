import React from "react";
import { ArrowLeft, CircleDot, CheckCircle, XCircle, Loader2 } from "lucide-react";

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

export const LogsPage: React.FC<LogsPageProps> = ({ logs, onBack, onClear }) => {
  return (
    <div className="min-h-screen bg-[#0e0e11] text-white px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[26px] border border-white/[0.08] bg-[#131317] p-6 shadow-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Logs</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Live step activity, completion status, and workflow events.
            </p>
          </div>
          <div className="flex gap-3">
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

        {logs.length === 0 ? (
          <div className="rounded-[26px] border border-white/[0.08] bg-[#131317] p-8 text-center text-zinc-400">
            No logs yet. Perform actions to see started checkpoint counts here.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(
              logs.reduce((groups, entry) => {
                const key = entry.providerName || "Unknown";
                if (!groups[key]) {
                  groups[key] = {
                    providerName: entry.providerName || "Unknown",
                    providerIcon: entry.providerIcon,
                    count: 0,
                  };
                }
                groups[key].count += 1;
                return groups;
              }, {} as Record<string, { providerName: string; providerIcon?: string; count: number }>)
            ).map((group) => (
              <div
                key={group.providerName}
                className="rounded-[26px] border border-white/[0.08] bg-[#131317] p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {group.providerIcon ? (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-sm">
                      <img
                        src={group.providerIcon}
                        alt={group.providerName}
                        className="h-10 w-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white shadow-sm">
                      <CircleDot className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                      {group.providerName}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-white">
                      {group.count}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">
                  Started steps detected for this provider.
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4" />
      </div>
    </div>
  );
};
