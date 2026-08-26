import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  FileCode,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { generateFullKeySystemScript } from "../lib/scriptGenerator";

const ALLOWED_IP = "24.49.252.230";
const STORAGE_KEY = "sotarium_game_loadstrings";
const LEGACY_STORAGE_KEY = "sotarium_supported_games";

interface GameLoadstringEntry {
  id: string;
  name: string;
  placeId: string;
  loadstringUrl: string;
}

const DEFAULT_GAMES: GameLoadstringEntry[] = [
  {
    id: "game-1",
    name: "San Diego Border Roleplay",
    placeId: "136020512003847",
    loadstringUrl: "",
  },
];

function loadStoredGames(): GameLoadstringEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GameLoadstringEntry[];
      if (Array.isArray(parsed)) {
        return parsed.filter((game) => game && game.id && game.name).map((game) => ({
          id: String(game.id),
          name: String(game.name),
          placeId: String(game.placeId || ""),
          loadstringUrl: String(game.loadstringUrl || ""),
        }));
      }
    }

    // One-time migration from the retired /add page.
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as Array<{ id?: string; name?: string; placeId?: string; scriptUrl?: string }>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((game, index) => ({
          id: game.id || `game-${index + 1}`,
          name: game.name || `Game ${index + 1}`,
          placeId: game.placeId || "",
          loadstringUrl: game.scriptUrl || "",
        }));
      }
    }
  } catch {
    // Use the starter entry if browser storage is unavailable or malformed.
  }

  return DEFAULT_GAMES;
}

export const ScriptsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isIpChecking, setIsIpChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [games, setGames] = useState<GameLoadstringEntry[]>(loadStoredGames);
  const [draftName, setDraftName] = useState("");
  const [draftPlaceId, setDraftPlaceId] = useState("");
  const [draftLoadstring, setDraftLoadstring] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ip = data?.ip ? String(data.ip).trim() : null;
        setUserIp(ip);
        setIsAllowed(ip === ALLOWED_IP);
      } catch {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const ip = data?.ip ? String(data.ip).trim() : null;
          setUserIp(ip);
          setIsAllowed(ip === ALLOWED_IP);
        } catch {
          setIsAllowed(false);
        }
      } finally {
        setIsIpChecking(false);
      }
    };

    checkIp();
  }, []);

  const showToast = (message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(null), 2500);
  };

  const generatorGames = useMemo(
    () =>
      games.map((game) => ({
        id: game.id,
        name: game.name,
        imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
        placeId: game.placeId,
        scriptUrl: game.loadstringUrl,
      })),
    [games]
  );

  const generatedScript = useMemo(
    () => generateFullKeySystemScript(generatorGames, generatorGames[0], ""),
    [generatorGames]
  );

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
      showToast("Game loadstring URLs saved");
    } catch {
      showToast("Could not save browser storage");
    }
  };

  const handleAddGame = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draftName.trim()) {
      showToast("Enter a game name first");
      return;
    }

    const placeMatch = draftPlaceId.match(/\/games\/(\d+)/) || draftPlaceId.match(/(\d{5,})/);
    setGames((current) => [
      ...current,
      {
        id: `game-${Date.now()}`,
        name: draftName.trim(),
        placeId: placeMatch?.[1] || draftPlaceId.trim(),
        loadstringUrl: draftLoadstring.trim(),
      },
    ]);
    setDraftName("");
    setDraftPlaceId("");
    setDraftLoadstring("");
    showToast("Game added — save when you are ready");
  };

  const updateGame = (id: string, patch: Partial<GameLoadstringEntry>) => {
    setGames((current) => current.map((game) => (game.id === id ? { ...game, ...patch } : game)));
  };

  const removeGame = (id: string) => {
    setGames((current) => current.filter((game) => game.id !== id));
    showToast("Game removed — save to keep the change");
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopiedCode(true);
      showToast("Full home GUI script copied");
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      showToast("Could not copy the generated script");
    }
  };

  if (isIpChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e11] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400">Verifying access rights...</span>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen select-none flex-col items-center justify-center bg-[#0a0a0c] p-6 text-white">
        <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-2xl border border-red-500/20 bg-[#131316] p-8 text-center shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Access Restricted</h2>
            <p className="text-sm text-zinc-400">Your IP address <span className="font-mono font-bold text-red-400">{userIp || "checking..."}</span> is not authorized to access Scripts.</p>
          </div>
          <button onClick={onBack} className="w-full rounded-xl border border-zinc-700/60 bg-[#1e1e24] py-3 text-sm font-bold transition-all hover:bg-[#282830]">Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#09090b] font-sans text-white select-none">
      <div className="pointer-events-none fixed inset-0 opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8">
        <header className="mb-8 flex w-full max-w-6xl items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.035] px-3.5 py-2 text-xs font-bold text-zinc-300 transition-all hover:border-white/[0.20] hover:bg-white/[0.07] hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <div className="hidden h-4 w-px bg-white/[0.10] sm:block" />
            <div>
              <span className="block text-sm font-extrabold tracking-wide text-zinc-100">Sotarium Scripts</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 sm:block">Game loadstring registry</span>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-md border border-[#8DF2A3]/25 bg-[#8DF2A3]/[0.08] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8DF2A3] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#8DF2A3]" />Authorized</span>
        </header>

        <main className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <div className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-4">
                <div className="flex gap-2.5"><Link2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8DF2A3]" /><div><h2 className="text-sm font-bold text-white">Game Loadstring URLs</h2><p className="mt-1 max-w-xl text-xs leading-5 text-zinc-400">Store each game’s Roblox place ID and loadstring URL here. The generated key GUI stays on its home screen and matches the player’s place after successful key verification.</p></div></div>
                <button onClick={handleSave} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-black shadow-md transition-all hover:bg-zinc-200 active:scale-95"><Save className="h-3.5 w-3.5" />Save URLs</button>
              </div>

              <div className="space-y-3">
                {games.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-700 bg-black/10 px-4 py-8 text-center text-sm text-zinc-500">No game URLs stored yet. Add a game below.</div>
                ) : (
                  games.map((game, index) => (
                    <article key={game.id} className="rounded-xl border border-white/[0.08] bg-[#15161b] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#8DF2A3]/10 font-mono text-[10px] font-bold text-[#8DF2A3]">{index + 1}</span><input value={game.name} onChange={(event) => updateGame(game.id, { name: event.target.value })} aria-label="Game name" className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-zinc-600" placeholder="Game name" /></div><button onClick={() => removeGame(game.id)} className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label={`Remove ${game.name || "game"}`}><Trash2 className="h-4 w-4" /></button></div>
                      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                        <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><MapPin className="h-3 w-3" />Place ID</span><input value={game.placeId} onChange={(event) => updateGame(game.id, { placeId: event.target.value })} placeholder="136020512003847" className="w-full rounded-lg border border-zinc-800 bg-[#0b0b0e] px-3 py-2 text-xs font-mono text-white outline-none transition-colors focus:border-zinc-600" /></label>
                        <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500"><FileCode className="h-3 w-3" />Loadstring URL or expression</span><input value={game.loadstringUrl} onChange={(event) => updateGame(game.id, { loadstringUrl: event.target.value })} placeholder="https://raw.githubusercontent.com/.../script.lua" className="w-full rounded-lg border border-zinc-800 bg-[#0b0b0e] px-3 py-2 text-xs font-mono text-white outline-none transition-colors focus:border-zinc-600" /></label>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleAddGame} className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/[0.07] pb-3"><Plus className="h-4 w-4 text-[#8DF2A3]" /><h2 className="text-sm font-bold text-white">Add Game URL</h2></div>
              <div className="grid gap-3 md:grid-cols-2"><input required value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Game name" className="rounded-lg border border-zinc-800 bg-[#0b0b0e] px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-600" /><input value={draftPlaceId} onChange={(event) => setDraftPlaceId(event.target.value)} placeholder="Roblox place ID or game URL" className="rounded-lg border border-zinc-800 bg-[#0b0b0e] px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-zinc-600" /></div>
              <input value={draftLoadstring} onChange={(event) => setDraftLoadstring(event.target.value)} placeholder="Loadstring URL or loadstring(...)()" className="w-full rounded-lg border border-zinc-800 bg-[#0b0b0e] px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-zinc-600" />
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e1f24] py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#292a31]"><Plus className="h-4 w-4" />Add Game</button>
            </form>
          </section>

          <section className="space-y-6 lg:col-span-5">
            <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3"><div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#8DF2A3]" /><h2 className="text-sm font-bold text-white">Generated Home GUI</h2></div><button onClick={handleCopyScript} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-black shadow-md transition-all hover:bg-zinc-200 active:scale-95">{copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copiedCode ? "Copied" : "Copy Script"}</button></div>
              <div className="flex items-start gap-2 rounded-xl border border-[#8DF2A3]/20 bg-[#8DF2A3]/[0.06] p-3 text-xs leading-5 text-zinc-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#8DF2A3]" /><span>No Supported Games page is included. The GUI opens directly on the key home screen; saved URLs are used only for post-verification place matching.</span></div>
              <pre className="h-[500px] overflow-auto rounded-xl border border-zinc-800/90 bg-[#0a0a0d] p-4 font-mono text-xs leading-relaxed text-[#8DF2A3]/90 select-all">{generatedScript}</pre>
            </div>
          </section>
        </main>

        {toastMsg && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#8DF2A3]/25 bg-[#16171c] px-4 py-3 text-xs font-bold text-white shadow-2xl"><div className="h-2 w-2 rounded-full bg-[#8DF2A3]" />{toastMsg}</div>}
      </div>
    </div>
  );
};
