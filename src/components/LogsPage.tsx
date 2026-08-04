import React from "react";
import { ArrowLeft, CircleDot, CheckCircle, XCircle, Loader2 } from "lucide-react";

export type LogStatus = "info" | "pending" | "success" | "error";

export interface LogEntry {
  id: string;
  time: string;
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

        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-[26px] border border-white/[0.08] bg-[#131317] p-8 text-center text-zinc-400">
              No logs yet. Perform actions to see real-time step updates here.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[26px] border border-white/[0.08] bg-[#131317] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    {statusIcon(entry.status)}
                    <span className="font-semibold text-white">{statusLabel(entry.status)}</span>
                    {entry.source ? <span className="text-zinc-500">• {entry.source}</span> : null}
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">{entry.time}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-200">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
