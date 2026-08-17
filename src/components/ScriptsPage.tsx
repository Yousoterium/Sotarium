import React, { useState, useEffect } from "react";
import { 
  Code2, 
  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCw, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Gamepad2, 
  Save, 
  Download, 
  Layers, 
  ShieldAlert,
  Loader2,
  FileCode
} from "lucide-react";
import { GameItem } from "./AddGamePage";
import { generateFullKeySystemScript } from "../lib/scriptGenerator";

const ALLOWED_IP = "24.49.252.230";

const CURRENT_KEY_SYSTEM_VERSION = "2.4.0";

export interface ScriptEntry {
  id: string;
  gameId: string;
  gameName: string;
  payloadCode: string;
  version: string;
  lastUpdated: string;
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

const DEFAULT_SCRIPTS: ScriptEntry[] = [
  {
    id: "script-1",
    gameId: "game-1",
    gameName: "San Diego Border Roleplay",
    payloadCode: `-- [Protected Script Payload - Executed after Key Validation]
local player = game.Players.LocalPlayer

-- Notify player on screen
game:GetService("StarterGui"):SetCore("SendNotification", {
    Title = "Sotarium Hub",
    Text = "San Diego Border Roleplay script loaded successfully!",
    Duration = 5
})

-- Put your custom hub/feature code below:
-- loadstring(game:HttpGet("https://raw.githubusercontent.com/.../hub.lua"))()`,
    version: CURRENT_KEY_SYSTEM_VERSION,
    lastUpdated: new Date().toLocaleDateString()
  }
];

export const ScriptsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [userIp, setUserIp] = useState<string | null>(null);
  const [isIpChecking, setIsIpChecking] = useState<boolean>(true);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  // Load configured games from /add
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_supported_games");
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });

  // Saved scripts per game
  const [scripts, setScripts] = useState<ScriptEntry[]>(() => {
    try {
      const saved = localStorage.getItem("sotarium_user_scripts");
      return saved ? JSON.parse(saved) : DEFAULT_SCRIPTS;
    } catch {
      return DEFAULT_SCRIPTS;
    }
  });

  const [selectedGameId, setSelectedGameId] = useState<string>(() => {
    return games[0] ? games[0].id : "game-1";
  });

  const [currentPayload, setCurrentPayload] = useState<string>("");
  const [isUpdatingAll, setIsUpdatingAll] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // IP Check
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

  // Sync payload when game selection changes
  useEffect(() => {
    const existing = scripts.find(s => s.gameId === selectedGameId);
    if (existing) {
      setCurrentPayload(existing.payloadCode);
    } else {
      const matchedGame = games.find(g => g.id === selectedGameId);
      const name = matchedGame ? matchedGame.name : "Universal";
      const scriptUrl = matchedGame?.scriptUrl?.trim() || "";

      if (scriptUrl) {
        setCurrentPayload(`-- [Protected Payload for ${name}]
-- Loading script from /add:
loadstring(game:HttpGet("${scriptUrl}"))()

-- Features unlocked notification
game:GetService("StarterGui"):SetCore("SendNotification", {
    Title = "Sotarium Hub",
    Text = "${name} script loaded!",
    Duration = 5
})`);
      } else {
        setCurrentPayload(`-- [Protected Payload for ${name}]
game:GetService("StarterGui"):SetCore("SendNotification", {
    Title = "Sotarium Hub",
    Text = "${name} features unlocked!",
    Duration = 5
})`);
      }
    }
  }, [selectedGameId, scripts, games]);

  // Persist scripts
  useEffect(() => {
    try {
      localStorage.setItem("sotarium_user_scripts", JSON.stringify(scripts));
    } catch (e) {
      console.error(e);
    }
  }, [scripts]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSavePayload = () => {
    const matchedGame = games.find(g => g.id === selectedGameId);
    const gameName = matchedGame ? matchedGame.name : "Custom Game";

    const existingIdx = scripts.findIndex(s => s.gameId === selectedGameId);
    let updated: ScriptEntry[];

    if (existingIdx >= 0) {
      updated = [...scripts];
      updated[existingIdx] = {
        ...updated[existingIdx],
        payloadCode: currentPayload,
        version: CURRENT_KEY_SYSTEM_VERSION,
        lastUpdated: new Date().toLocaleDateString()
      };
    } else {
      const newEntry: ScriptEntry = {
        id: `script-${Date.now()}`,
        gameId: selectedGameId,
        gameName,
        payloadCode: currentPayload,
        version: CURRENT_KEY_SYSTEM_VERSION,
        lastUpdated: new Date().toLocaleDateString()
      };
      updated = [...scripts, newEntry];
    }

    setScripts(updated);
    showToast(`Saved unlocked payload for ${gameName}!`);
  };

  // Update All Scripts: Scans all scripts, bumps version to latest, and syncs framework
  const handleUpdateAllScripts = () => {
    setIsUpdatingAll(true);
    setTimeout(() => {
      let count = 0;
      const updated = scripts.map(s => {
        if (s.version !== CURRENT_KEY_SYSTEM_VERSION) {
          count++;
        }
        return {
          ...s,
          version: CURRENT_KEY_SYSTEM_VERSION,
          lastUpdated: new Date().toLocaleDateString()
        };
      });

      setScripts(updated);
      setIsUpdatingAll(false);
      showToast(`Updated ${count > 0 ? count : scripts.length} script(s) to latest key framework v${CURRENT_KEY_SYSTEM_VERSION}!`);
    }, 900);
  };

  // Compiles the entire final executable script with Key System + Injected Unlocked Payload
  const generateFinalUnlockedScript = (): string => {
    const matchedGame = games.find(g => g.id === selectedGameId) || games[0];
    return generateFullKeySystemScript(games, matchedGame, currentPayload);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateFinalUnlockedScript());
    setCopiedCode(true);
    showToast("Full executable script with unlocked payload copied!");
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
              Your IP address <span className="text-red-400 font-mono font-bold">{userIp || "checking..."}</span> is not authorized to access the Scripts Studio.
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
          <span className="text-sm font-medium text-zinc-400">Loading Scripts Studio...</span>
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
            <span className="font-extrabold text-sm tracking-wide text-zinc-200">Sotarium Scripts Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Update All Scripts Button */}
          <button
            onClick={handleUpdateAllScripts}
            disabled={isUpdatingAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b1b22] hover:bg-[#262632] border border-zinc-700/80 hover:border-emerald-500/50 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer active:scale-95"
            title="Scan and upgrade all saved scripts to the latest /add framework"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isUpdatingAll ? "animate-spin" : ""}`} />
            {isUpdatingAll ? "Updating..." : "Update All Scripts"}
          </button>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold font-mono">
            v{CURRENT_KEY_SYSTEM_VERSION}
          </span>
        </div>
      </header>

      {/* Studio Workspace */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Game Target Selector & Payload Script Editor */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Target Game Selector */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Target Game (from /add)</h3>
              </div>
              <span className="text-xs text-zinc-500">{games.length} Available</span>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {games.map((g) => {
                const isSelected = g.id === selectedGameId;
                const scriptEntry = scripts.find(s => s.gameId === g.id);
                const hasCustomPayload = scriptEntry && scriptEntry.payloadCode.trim().length > 0;

                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGameId(g.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#1e1e26] border-zinc-500 shadow-md" 
                        : "bg-[#16161a] border-zinc-800/80 hover:bg-[#1a1a20]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700/60">
                        <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-xs text-white truncate">{g.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {hasCustomPayload ? "Payload Configured" : "Default Payload"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasCustomPayload && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Payload saved" />
                      )}
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                        v{scriptEntry ? scriptEntry.version : CURRENT_KEY_SYSTEM_VERSION}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Protected Script Payload Box */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Unlocked Payload Script</h3>
              </div>
              <span className="text-xs text-zinc-500">Executes on Key Success</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste or write the Lua code below that will automatically run once the user completes the key system from <span className="text-emerald-400 font-mono font-bold">/add</span>:
            </p>

            <textarea
              value={currentPayload}
              onChange={(e) => setCurrentPayload(e.target.value)}
              placeholder="-- Write or paste your Lua script here..."
              rows={9}
              className="w-full p-3.5 bg-[#0a0a0d] border border-zinc-800 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-zinc-500 transition-all resize-y leading-relaxed"
              spellCheck={false}
            />

            <button
              onClick={handleSavePayload}
              className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-xl text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Payload for Target Game
            </button>
          </div>
        </section>

        {/* Right Column: Full Compiled Output Script (Key System + Unlocked Payload) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Final Standalone Executable Script</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? "Copied!" : "Copy Full Script"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#16161a] p-3 rounded-xl border border-zinc-800/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected with Key System + Instant Execution on Success</span>
              </div>
              <span className="font-mono text-zinc-500">v{CURRENT_KEY_SYSTEM_VERSION}</span>
            </div>

            <div className="relative">
              <pre className="w-full h-[460px] bg-[#0a0a0d] border border-zinc-800/90 rounded-xl p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto overflow-y-auto select-all leading-relaxed">
                {generateFinalUnlockedScript()}
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
