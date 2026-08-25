import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Gamepad2,
  Layers3,
  Loader2,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { generateFullKeySystemScript } from "../lib/scriptGenerator";

const ALLOWED_IP = "24.49.252.230";

export interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
  placeId?: string;
  scriptUrl?: string;
}

const DEFAULT_GAMES: GameItem[] = [
  {
    id: "game-1",
    name: "San Diego Border Roleplay",
    imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
    placeId: "123456789",
    scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua",
  },
];

/**
 * Midnight Game Index: image-led charcoal cards, integrated lower overlays,
 * sparse Signal Green status cues, and an editorial game-shelf hierarchy.
 */
export const AddGamePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isIpChecking, setIsIpChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_supported_games");
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });
  const [newGameName, setNewGameName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newPlaceId, setNewPlaceId] = useState("");
  const [newScriptUrl, setNewScriptUrl] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const resolvePreviewImageUrl = (url: string) => {
    if (!url) return DEFAULT_GAMES[0].imageUrl;
    if (url.includes("rbxassetid://")) {
      return `https://assetdelivery.roblox.com/v1/asset/?id=${url.replace("rbxassetid://", "").trim()}`;
    }
    return url;
  };

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

  useEffect(() => {
    try {
      localStorage.setItem("sotarium_supported_games", JSON.stringify(games));
    } catch (error) {
      console.error(error);
    }
  }, [games]);

  const showToast = (message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAddGame = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newGameName.trim()) {
      showToast("Please enter a game name");
      return;
    }

    const source = newPlaceId.trim();
    const idMatch = source.match(/\/games\/(\d+)/) || source.match(/roblox\.com\/.*?(\d{5,})/) || source.match(/(\d{5,})/);
    const game: GameItem = {
      id: `game-${Date.now()}`,
      name: newGameName.trim(),
      imageUrl: newImageUrl.trim() || DEFAULT_GAMES[0].imageUrl,
      placeId: idMatch?.[1] || source,
      scriptUrl: newScriptUrl.trim(),
    };

    setGames((currentGames) => [...currentGames, game]);
    setNewGameName("");
    setNewImageUrl("");
    setNewPlaceId("");
    setNewScriptUrl("");
    showToast(`Added “${game.name}” to the supported-games shelf`);
  };

  const handleDeleteGame = (id: string, name: string) => {
    if (games.length <= 1) {
      showToast("You must keep at least one game in the list");
      return;
    }
    setGames((currentGames) => currentGames.filter((game) => game.id !== id));
    showToast(`Removed “${name}”`);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generateFullKeySystemScript(games, games[0], ""));
    setCopiedCode(true);
    showToast("Script copied to clipboard");
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isIpChecking && !isAllowed) {
    return (
      <div className="flex min-h-screen select-none flex-col items-center justify-center bg-[#0a0a0c] p-6 text-white">
        <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-2xl border border-red-500/20 bg-[#131316] p-8 text-center shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Access Restricted</h2>
            <p className="text-sm text-zinc-400">
              Your IP address <span className="font-mono font-bold text-red-400">{userIp || "checking..."}</span> is not authorized to access this administration page.
            </p>
          </div>
          <button onClick={onBack} className="w-full rounded-xl border border-zinc-700/60 bg-[#1e1e24] py-3 text-sm font-bold transition-all hover:bg-[#282830]">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#09090b] font-sans text-white select-none">
      <div className="pointer-events-none fixed inset-0 opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8">
        <header className="mb-7 flex w-full max-w-6xl items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-white/[0.10] bg-white/[0.035] px-3.5 py-2 text-xs font-bold text-zinc-300 transition-all hover:border-white/[0.20] hover:bg-white/[0.07] hover:text-white active:scale-[0.97]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <div className="mx-1 hidden h-4 w-px bg-white/[0.10] sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <img src="/Sotarium.png" alt="" className="h-7 w-7 object-contain" />
              <div>
                <span className="block text-sm font-extrabold tracking-wide text-zinc-100">Sotarium Game Manager</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Supported games index</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-zinc-500 md:block">IP: {userIp}</span>
            <span className="flex items-center gap-1.5 rounded-md border border-[#8DF2A3]/25 bg-[#8DF2A3]/[0.08] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8DF2A3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8DF2A3]" />
              Authorized
            </span>
          </div>
        </header>

        <main className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <section className="flex flex-col gap-6 lg:col-span-5">
            <div className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div className="flex items-center gap-2.5">
                  <Plus className="h-4 w-4 text-[#8DF2A3]" />
                  <h3 className="text-sm font-bold text-white">Add New Supported Game</h3>
                </div>
                <Sparkles className="h-4 w-4 text-zinc-500" />
              </div>

              <form onSubmit={handleAddGame} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Game Name <span className="text-red-400">*</span></span>
                  <input type="text" placeholder="e.g. San Diego Border Roleplay" value={newGameName} onChange={(event) => setNewGameName(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#18181c] px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 transition-all focus:border-zinc-500 focus:outline-none" required />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Image URL / Asset Link</span>
                  <input type="text" placeholder="https://raw.githubusercontent.com/.../game.png" value={newImageUrl} onChange={(event) => setNewImageUrl(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#18181c] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 transition-all focus:border-zinc-500 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Roblox Game URL or Place ID</span>
                  <input type="text" placeholder="https://www.roblox.com/games/136020512003847/..." value={newPlaceId} onChange={(event) => setNewPlaceId(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#18181c] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 transition-all focus:border-zinc-500 focus:outline-none" />
                  <span className="mt-1 block text-[10px] text-zinc-500">Place IDs are extracted automatically from Roblox URLs.</span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400">Script URL or Loadstring</span>
                  <input type="text" placeholder="loadstring(game:HttpGet('https://...'))()" value={newScriptUrl} onChange={(event) => setNewScriptUrl(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#18181c] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 transition-all focus:border-zinc-500 focus:outline-none" />
                </label>
                <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-extrabold text-black shadow-lg transition-all hover:bg-zinc-200 active:scale-[0.98]">
                  <Plus className="h-4 w-4" />
                  Add to Supported Games
                </button>
              </form>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white">Active Games List ({games.length})</h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Shelf order</span>
              </div>

              <div className="grid max-h-[310px] grid-cols-1 gap-2.5 overflow-y-auto pr-1">
                {games.map((game, index) => (
                  <div key={game.id} className="group relative flex min-h-[84px] items-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#15161b] p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-[#191a20]">
                    <span className="pointer-events-none absolute -bottom-5 -right-1 select-none font-mono text-6xl font-bold tracking-tighter text-white/[0.035]">{String(index + 1).padStart(2, "0")}</span>
                    <div className="relative z-10 flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-[74px] shrink-0 overflow-hidden rounded-lg border border-white/[0.10] bg-[linear-gradient(135deg,#1b1d24_0%,#101115_45%,#0b0c0f_100%)]">
                        <img src={resolvePreviewImageUrl(game.imageUrl)} alt={game.name} className="relative z-10 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" onError={(event) => { event.currentTarget.style.opacity = "0"; }} />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8DF2A3]" />
                          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8DF2A3]">Supported</span>
                        </div>
                        <p className="truncate text-xs font-bold text-white">{game.name}</p>
                        <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500">{game.placeId ? `Place ${game.placeId}` : "Universal access"}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleDeleteGame(game.id, game.name)} className="relative z-10 ml-auto rounded-lg p-2 text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400" title={`Remove ${game.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6 lg:col-span-7">
            <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-[#8DF2A3]" />
                  <h3 className="text-sm font-bold text-white">Supported Games Live Preview</h3>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#8DF2A3]">Responsive shelf · {games.length}</span>
              </div>

              <div className="relative flex aspect-[720/440] w-full flex-col overflow-hidden rounded-[14px] border border-white/[0.10] bg-[#09090b] shadow-2xl">
                <div className="pointer-events-none absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="z-20 flex h-11 w-full shrink-0 items-center justify-between border-b border-white/[0.07] bg-black/10 px-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-md border border-white/[0.10] bg-black/25 px-3 py-1 text-xs font-bold text-zinc-300"><ArrowLeft className="h-3 w-3 text-zinc-400" />Back</span>
                    <span className="hidden border-l border-white/[0.10] pl-3 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500 sm:block">Supported titles</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500"><div className="h-0.5 w-3 rounded-full bg-zinc-500" /><div className="h-3 w-3 rounded-[2px] border border-zinc-500" /><div className="text-xs font-bold">✕</div></div>
                </div>

                <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto px-4 py-4 sm:grid-cols-2 sm:px-5">
                  {games.map((game, index) => (
                    <article key={game.id} className="group relative min-h-[132px] overflow-hidden rounded-[10px] border border-white/[0.12] bg-[#15161b] shadow-[0_16px_32px_rgba(0,0,0,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.24] hover:shadow-[0_20px_36px_rgba(0,0,0,0.42)]">
                      <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#1b1d24_0%,#101115_45%,#0b0c0f_100%)]">
                        <img src={resolvePreviewImageUrl(game.imageUrl)} alt={game.name} className="relative z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.055]" onError={(event) => { event.currentTarget.style.opacity = "0"; }} />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                      <span className="absolute left-3 top-3 rounded border border-white/[0.13] bg-black/35 px-1.5 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-zinc-300">{String(index + 1).padStart(2, "0")}</span>
                      <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8DF2A3]"><span className="h-1.5 w-1.5 rounded-full bg-[#8DF2A3]" />Supported</div>
                      <div className="absolute inset-x-0 bottom-0 p-3.5">
                        <h4 className="max-w-[85%] text-left text-sm font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">{game.name}</h4>
                      </div>
                      <span className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-45" />
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#111217]/90 p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-[#8DF2A3]" /><h3 className="text-sm font-bold text-white">Generated Script Result</h3></div>
                <button onClick={copyScript} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-black shadow-md transition-all hover:bg-zinc-200 active:scale-95">
                  {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copiedCode ? "Copied" : "Copy Result Script"}
                </button>
              </div>
              <pre className="h-44 w-full overflow-x-auto overflow-y-auto rounded-xl border border-zinc-800/90 bg-[#0a0a0d] p-4 font-mono text-xs leading-relaxed text-[#8DF2A3]/90 select-all">{generateFullKeySystemScript(games, games[0], "")}</pre>
            </div>
          </section>
        </main>

        {toastMsg && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#8DF2A3]/25 bg-[#16171c] px-4 py-3 text-xs font-bold text-white shadow-2xl"><div className="h-2 w-2 rounded-full bg-[#8DF2A3]" />{toastMsg}</div>}
      </div>
    </div>
  );
};
