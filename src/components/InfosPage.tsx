import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Key,
  Flame,
  Search,
  RefreshCw,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from "lucide-react";

interface PlayerStat {
  roblox_id: string | null;
  username: string;
  total_keys: number;
  active_keys: number;
  expired_keys: number;
  last_claimed: string | null;
  provider_breakdown: Record<string, number>;
  keys_list: Array<{
    key: string;
    expires_at: string | null;
    is_expired: boolean;
    created_at: string;
  }>;
}

interface LeaderboardResponse {
  allowed: boolean;
  stats?: {
    total_keys_claimed: number;
    total_unique_players: number;
    total_active_keys: number;
  };
  leaderboard?: PlayerStat[];
}

const ALLOWED_IP = "24.49.252.230";

export const InfosPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [authStatus, setAuthStatus] = useState<"checking" | "allowed" | "denied">("checking");
  const [leaderboard, setLeaderboard] = useState<PlayerStat[]>([]);
  const [stats, setStats] = useState<{ total_keys_claimed: number; total_unique_players: number; total_active_keys: number }>({
    total_keys_claimed: 0,
    total_unique_players: 0,
    total_active_keys: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  // Strict Dual Client & Server IP Verification
  const verifyAndFetch = async () => {
    try {
      // 1. Try public IP lookup check
      let clientIp = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientIp = ipData.ip;
        }
      } catch {
        // Fallback to direct API check
      }

      // If client IP is known and not allowed (and not localhost)
      if (clientIp && clientIp !== ALLOWED_IP && clientIp !== "127.0.0.1" && clientIp !== "localhost") {
        setAuthStatus("denied");
        return;
      }

      // 2. Fetch server endpoint with IP validation
      const res = await fetch("/api/infos-leaderboard");
      if (!res.ok) {
        if (res.status === 403) {
          setAuthStatus("denied");
          return;
        }
      }

      const data: LeaderboardResponse = await res.json();
      if (!data.allowed) {
        setAuthStatus("denied");
        return;
      }

      setAuthStatus("allowed");
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.stats) setStats(data.stats);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
      // In development fallback check
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        setAuthStatus("allowed");
      } else {
        setAuthStatus("denied");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAndFetch();
  }, []);

  // Live Auto-Refresh every 8 seconds
  useEffect(() => {
    if (!autoRefresh || authStatus !== "allowed") return;
    const interval = setInterval(() => {
      verifyAndFetch();
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, authStatus]);

  // Denied -> Render White Empty Screen
  if (authStatus === "denied") {
    return <div className="fixed inset-0 bg-white w-screen h-screen z-[99999]" />;
  }

  // Checking State
  if (authStatus === "checking") {
    return <div className="fixed inset-0 bg-white w-screen h-screen z-[99999]" />;
  }

  const filteredLeaderboard = leaderboard.filter(
    (p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.roblox_id && p.roblox_id.includes(searchQuery))
  );

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col font-sans select-none antialiased">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-white/[0.08] bg-[#0c0c0e]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shadow-lg shadow-amber-500/10">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Live Redeemer Leaderboard
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </h1>
              <p className="text-xs text-neutral-400">Roblox players with the highest key redemption count</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-white/[0.04] border-white/[0.08] text-neutral-400"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin" : ""}`} />
            <span>{autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}</span>
          </button>

          <button
            onClick={verifyAndFetch}
            disabled={loading}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-neutral-200 transition-all"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#16161a] to-[#101013] border border-white/[0.07] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Total Keys Claimed</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.total_keys_claimed}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Key className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#16161a] to-[#101013] border border-white/[0.07] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Unique Players</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.total_unique_players}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#16161a] to-[#101013] border border-white/[0.07] flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">Active Unexpired Keys</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats.total_active_keys}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Top 3 Podium Highlights */}
        {leaderboard.length >= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Rank 2 (Silver) */}
            {leaderboard[1] ? (
              <div className="order-2 md:order-1 p-5 rounded-2xl bg-[#141418]/90 border border-slate-400/20 flex flex-col items-center text-center relative shadow-lg">
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-400/20 text-slate-300 border border-slate-400/30">
                  #2 Silver
                </div>
                <div className="relative mt-3 mb-2">
                  <img
                    src={
                      leaderboard[1].roblox_id
                        ? `https://www.roblox.com/headshot-thumbnail/image?userId=${leaderboard[1].roblox_id}&width=150&height=150&format=png`
                        : "https://www.roblox.com/headshot-thumbnail/image?userId=1&width=150&height=150&format=png"
                    }
                    alt={leaderboard[1].username}
                    className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-slate-400/40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <h3 className="font-bold text-base text-white">{leaderboard[1].username}</h3>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">ID: {leaderboard[1].roblox_id || "N/A"}</p>
                <div className="mt-3 px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-neutral-200">
                  <span className="text-amber-400 font-bold">{leaderboard[1].total_keys}</span> keys redeemed
                </div>
              </div>
            ) : null}

            {/* Rank 1 (Gold / Champion) */}
            {leaderboard[0] && (
              <div className="order-1 md:order-2 p-6 rounded-2xl bg-gradient-to-b from-[#221c10] to-[#141418] border-2 border-amber-500/40 flex flex-col items-center text-center relative shadow-2xl shadow-amber-500/10 md:-translate-y-2">
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  #1 Champion
                </div>
                <div className="relative mt-3 mb-2">
                  <img
                    src={
                      leaderboard[0].roblox_id
                        ? `https://www.roblox.com/headshot-thumbnail/image?userId=${leaderboard[0].roblox_id}&width=150&height=150&format=png`
                        : "https://www.roblox.com/headshot-thumbnail/image?userId=1&width=150&height=150&format=png"
                    }
                    alt={leaderboard[0].username}
                    className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-amber-400 object-cover shadow-lg shadow-amber-500/20"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-1 rounded-full text-[10px] font-black">
                    👑
                  </div>
                </div>
                <h3 className="font-extrabold text-lg text-white">{leaderboard[0].username}</h3>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">ID: {leaderboard[0].roblox_id || "N/A"}</p>
                <div className="mt-3 px-5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-base font-bold text-amber-300">
                  <span>{leaderboard[0].total_keys}</span> Keys Redeemed
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {leaderboard[2] ? (
              <div className="order-3 p-5 rounded-2xl bg-[#141418]/90 border border-amber-700/20 flex flex-col items-center text-center relative shadow-lg">
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-700/20 text-amber-400 border border-amber-700/30">
                  #3 Bronze
                </div>
                <div className="relative mt-3 mb-2">
                  <img
                    src={
                      leaderboard[2].roblox_id
                        ? `https://www.roblox.com/headshot-thumbnail/image?userId=${leaderboard[2].roblox_id}&width=150&height=150&format=png`
                        : "https://www.roblox.com/headshot-thumbnail/image?userId=1&width=150&height=150&format=png"
                    }
                    alt={leaderboard[2].username}
                    className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-amber-700/40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <h3 className="font-bold text-base text-white">{leaderboard[2].username}</h3>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">ID: {leaderboard[2].roblox_id || "N/A"}</p>
                <div className="mt-3 px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-semibold text-neutral-200">
                  <span className="text-amber-400 font-bold">{leaderboard[2].total_keys}</span> keys redeemed
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Search & Full Leaderboard Table */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Full Player Rankings
            </h2>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search username or Roblox ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#18181d] border border-white/[0.09] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 transition-all"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-neutral-400 uppercase font-semibold tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Roblox Player</th>
                  <th className="py-3 px-4 text-center">Total Keys</th>
                  <th className="py-3 px-4 text-center">Active Keys</th>
                  <th className="py-3 px-4 text-center">Expired Keys</th>
                  <th className="py-3 px-4">Last Claimed</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500 font-medium">
                      {searchQuery ? "No matching Roblox players found." : "No keys have been claimed yet."}
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((player, index) => {
                    const isExpanded = expandedPlayer === (player.roblox_id || player.username);
                    return (
                      <React.Fragment key={player.roblox_id || player.username}>
                        <tr className="hover:bg-white/[0.02] transition-colors group">
                          {/* Rank */}
                          <td className="py-3.5 px-4 font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                                index === 0
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                  : index === 1
                                  ? "bg-slate-400/20 text-slate-300 border border-slate-400/40"
                                  : index === 2
                                  ? "bg-amber-700/20 text-amber-400 border border-amber-700/40"
                                  : "bg-white/[0.04] text-neutral-400"
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </td>

                          {/* Player */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  player.roblox_id
                                    ? `https://www.roblox.com/headshot-thumbnail/image?userId=${player.roblox_id}&width=100&height=100&format=png`
                                    : "https://www.roblox.com/headshot-thumbnail/image?userId=1&width=100&height=100&format=png"
                                }
                                alt={player.username}
                                className="w-8 h-8 rounded-full bg-neutral-800 border border-white/[0.1] object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <div>
                                <a
                                  href={player.roblox_id ? `https://www.roblox.com/users/${player.roblox_id}/profile` : "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-1"
                                >
                                  {player.username}
                                  {player.roblox_id && <ExternalLink className="w-3 h-3 opacity-60" />}
                                </a>
                                <p className="text-[10px] text-neutral-500 font-mono">ID: {player.roblox_id || "Unknown"}</p>
                              </div>
                            </div>
                          </td>

                          {/* Total Keys */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                              {player.total_keys}
                            </span>
                          </td>

                          {/* Active Keys */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                              {player.active_keys}
                            </span>
                          </td>

                          {/* Expired Keys */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                              {player.expired_keys}
                            </span>
                          </td>

                          {/* Last Claimed */}
                          <td className="py-3.5 px-4 text-neutral-400">
                            {player.last_claimed ? new Date(player.last_claimed).toLocaleString() : "N/A"}
                          </td>

                          {/* Details Toggle */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setExpandedPlayer(isExpanded ? null : (player.roblox_id || player.username))}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white transition-all inline-flex items-center gap-1 text-[11px]"
                            >
                              <span>Keys</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Keys Details Row */}
                        {isExpanded && (
                          <tr className="bg-black/30">
                            <td colSpan={7} className="p-4">
                              <div className="p-3.5 rounded-xl bg-[#17171c] border border-white/[0.06] flex flex-col gap-2">
                                <p className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                                  <Key className="w-3.5 h-3.5 text-amber-400" />
                                  Claimed Keys for {player.username} ({player.keys_list.length})
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                                  {player.keys_list.map((k, kIdx) => (
                                    <div
                                      key={kIdx}
                                      className="p-2.5 rounded-lg bg-[#202026] border border-white/[0.04] flex items-center justify-between"
                                    >
                                      <div>
                                        <code className="text-xs font-mono font-bold text-amber-300">{k.key}</code>
                                        <p className="text-[10px] text-neutral-400 mt-0.5">
                                          {k.created_at ? new Date(k.created_at).toLocaleDateString() : ""}
                                        </p>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                          k.is_expired
                                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        }`}
                                      >
                                        {k.is_expired ? "Expired" : "Active"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500">
            <span>Live Sync active with Supabase & verification servers</span>
            <span>Last checked: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </div>
      </main>
    </div>
  );
};
