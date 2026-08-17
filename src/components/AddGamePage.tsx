import React, { useState, useEffect } from "react";
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Code2, 
  ShieldAlert, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
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
    scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua"
  }
];

export const AddGamePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isIpChecking, setIsIpChecking] = useState<boolean>(true);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  // Games state (stored in localStorage)
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_supported_games");
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });

  const [newGameName, setNewGameName] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newPlaceId, setNewPlaceId] = useState<string>("");
  const [newScriptUrl, setNewScriptUrl] = useState<string>("");

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Helper to convert Roblox web asset IDs or raw URLs into reliable web images
  const resolvePreviewImageUrl = (url: string) => {
    if (!url) return "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png";
    if (url.includes("rbxassetid://")) {
      const id = url.replace("rbxassetid://", "").trim();
      return `https://assetdelivery.roblox.com/v1/asset/?id=${id}`;
    }
    return url;
  };

  // IP Authorization Check
  useEffect(() => {
    const checkIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        if (data && data.ip) {
          const ip = String(data.ip).trim();
          setUserIp(ip);
          if (ip === ALLOWED_IP) setIsAllowed(true);
        }
      } catch {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          if (data && data.ip) {
            const ip = String(data.ip).trim();
            setUserIp(ip);
            if (ip === ALLOWED_IP) setIsAllowed(true);
          }
        } catch {
          // fallback
        }
      }
      setIsIpChecking(false);
    };
    checkIp();
  }, []);

  // Save games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sotarium_supported_games", JSON.stringify(games));
    } catch (e) {
      console.error(e);
    }
  }, [games]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim()) {
      showToast("Please enter a game name");
      return;
    }
    const finalImageUrl = newImageUrl.trim() || "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png";

    const newItem: GameItem = {
      id: `game-${Date.now()}`,
      name: newGameName.trim(),
      imageUrl: finalImageUrl,
      placeId: newPlaceId.trim(),
      scriptUrl: newScriptUrl.trim()
    };

    const updated = [...games, newItem];
    setGames(updated);
    setNewGameName("");
    setNewImageUrl("");
    setNewPlaceId("");
    setNewScriptUrl("");
    showToast(`Added "${newItem.name}" to horizontal list!`);
  };

  const handleDeleteGame = (id: string, name: string) => {
    if (games.length <= 1) {
      showToast("You must keep at least 1 game in the list");
      return;
    }
    const filtered = games.filter(g => g.id !== id);
    setGames(filtered);
    showToast(`Removed "${name}"`);
  };

  // Generate dynamic Lua script incorporating all games
  const generateLuaScript = (): string => {
    return generateFullKeySystemScript(games, games[0], "");
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateLuaScript());
    setCopiedCode(true);
    showToast("Script copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Access Denied Screen
  if (!isIpChecking && !isAllowed) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-md bg-[#131316] border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">Access Restricted</h2>
            <p className="text-zinc-400 text-sm">
              Your IP address <span className="text-red-400 font-mono font-bold">{userIp || "checking..."}</span> is not authorized to access this administration page.
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full py-3 bg-[#1e1e24] hover:bg-[#282830] border border-zinc-700/60 rounded-xl font-bold text-sm transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isIpChecking) {
    return (
      <div className="min-h-screen bg-[#0e0e11] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400">Verifying access rights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white flex flex-col items-center py-8 px-4 font-sans select-none">
      {/* Top Header */}
      <header className="w-full max-w-6xl flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#16161a] hover:bg-[#202026] border border-zinc-800 rounded-xl text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="font-extrabold text-sm tracking-wide text-zinc-200">Sotarium Game Manager</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">IP: {userIp}</span>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold">Authorized</span>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Game Form & Game List */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Add Game Form Box */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Add New Supported Game</h3>
              </div>
              <Sparkles className="w-4 h-4 text-zinc-500" />
            </div>

            <form onSubmit={handleAddGame} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Game Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Diego Border Roleplay"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Image URL / Asset Link
                </label>
                <input
                  type="text"
                  placeholder="https://raw.githubusercontent.com/.../game.png"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Place ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4924922222"
                    value={newPlaceId}
                    onChange={(e) => setNewPlaceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Script URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../script.lua"
                    value={newScriptUrl}
                    onChange={(e) => setNewScriptUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-xl text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Game (Adds Left to Right)
              </button>
            </form>
          </div>

          {/* Configured Games List */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-zinc-400" />
                <h3 className="font-bold text-sm text-white">Active Games List ({games.length})</h3>
              </div>
              <span className="text-xs text-zinc-500">Left to Right Order</span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {games.map((g, idx) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-[#16161a] border-zinc-800/80 hover:bg-[#19191f] hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-4">#{idx + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700/60 flex items-center justify-center">
                      <img 
                        src={resolvePreviewImageUrl(g.imageUrl)} 
                        alt={g.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <Gamepad2 className="w-5 h-5 text-zinc-600 absolute" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-xs text-white truncate">{g.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate font-mono">
                        {g.placeId ? `ID: ${g.placeId}` : "Universal"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteGame(g.id, g.name)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2 cursor-pointer"
                    title="Remove game"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Exact Roblox GUI Live Preview + Script Output */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Roblox GUI Recreation Frame */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <h3 className="font-bold text-sm text-white">Roblox Lua GUI Live Preview</h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">Left to Right Carousel ({games.length} Games)</span>
            </div>

            {/* GUI Window Container (720x440 aspect ratio with matching rounded corners) */}
            <div className="w-full aspect-[720/440] bg-[#0f0f0f] border border-[#222222] rounded-[14px] overflow-hidden relative shadow-2xl flex flex-col">
              {/* Top Bar with Controls */}
              <div className="h-10 w-full flex items-center justify-between px-4 bg-transparent z-20 shrink-0">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-[#161616] border border-[#2a2a2a] rounded-lg text-xs font-bold text-zinc-300 flex items-center gap-1.5 pointer-events-none">
                    <ArrowLeft className="w-3 h-3 text-zinc-400" />
                    Back
                  </button>
                </div>
                {/* Minimize, Maximize, Close */}
                <div className="flex items-center gap-3 text-zinc-500">
                  <div className="w-3 h-0.5 bg-zinc-500 rounded-full" />
                  <div className="w-3 h-3 border border-zinc-500 rounded-[2px]" />
                  <div className="text-xs font-bold">✕</div>
                </div>
              </div>

              {/* Centered Showcase: Left-to-Right Horizontal Scrolling Carousel */}
              <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 gap-5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {games.map((g) => (
                  <div
                    key={g.id}
                    className="w-[280px] sm:w-[320px] shrink-0 bg-[#101010] border border-[#262626] rounded-[12px] shadow-2xl flex flex-col overflow-hidden transition-transform hover:scale-[1.02]"
                  >
                    {/* Top Game Thumbnail: Top 2 Rounded (12px), Bottom 2 Square (0px) */}
                    <div className="w-full h-40 bg-zinc-900 overflow-hidden relative rounded-t-[12px] rounded-b-none flex items-center justify-center">
                      <img
                        src={resolvePreviewImageUrl(g.imageUrl)}
                        alt={g.name}
                        className="w-full h-full object-cover rounded-t-[12px] rounded-b-none z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      {/* Fallback Icon if image cannot be fetched directly */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 text-zinc-500 gap-2">
                        <Gamepad2 className="w-8 h-8 text-zinc-600" />
                        <span className="text-[11px] font-bold text-zinc-500">Game Thumbnail</span>
                      </div>
                    </div>

                    {/* Attached Bottom Title Bar: Top 2 Square (0px), Bottom 2 Rounded (12px) */}
                    <div className="w-full h-11 bg-[#0c0c0c] border-t border-[#222222] flex items-center justify-center px-3 rounded-b-[12px] rounded-t-none">
                      <span className="font-black text-xs text-white tracking-wide truncate text-center">
                        {g.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Lua Script Result Output Box */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Generated Script Result</h3>
              </div>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? "Copied!" : "Copy Result Script"}
              </button>
            </div>

            <div className="relative">
              <pre className="w-full h-44 bg-[#0a0a0d] border border-zinc-800/90 rounded-xl p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto overflow-y-auto select-all leading-relaxed">
                {generateLuaScript()}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#18181c] border border-zinc-700 text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMsg}
        </div>
      )}
    </div>
  );
};
