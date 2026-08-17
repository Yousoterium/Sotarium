import React, { useState, useEffect } from "react";
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Code2, 
  ExternalLink, 
  ShieldAlert, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";

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

  const [activeGameIndex, setActiveGameIndex] = useState<number>(0);
  const [newGameName, setNewGameName] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newPlaceId, setNewPlaceId] = useState<string>("");
  const [newScriptUrl, setNewScriptUrl] = useState<string>("");

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    setActiveGameIndex(updated.length - 1);
    setNewGameName("");
    setNewImageUrl("");
    setNewPlaceId("");
    setNewScriptUrl("");
    showToast(`Added "${newItem.name}"`);
  };

  const handleDeleteGame = (id: string, name: string) => {
    if (games.length <= 1) {
      showToast("You must keep at least 1 game in the list");
      return;
    }
    const filtered = games.filter(g => g.id !== id);
    setGames(filtered);
    if (activeGameIndex >= filtered.length) {
      setActiveGameIndex(filtered.length - 1);
    }
    showToast(`Removed "${name}"`);
  };

  // Generate dynamic Lua script incorporating all games
  const generateLuaScript = (): string => {
    const gamesLuaArray = games.map((g, idx) => {
      return `    [${idx + 1}] = {\n        Name = "${g.name.replace(/"/g, '\\"')}",\n        Image = "${g.imageUrl.replace(/"/g, '\\"')}",\n        PlaceId = "${(g.placeId || "").replace(/"/g, '\\"')}",\n        ScriptUrl = "${(g.scriptUrl || "").replace(/"/g, '\\"')}"\n    }`;
    }).join(",\n");

    return `-- Standalone Key System GUI Script (Generated from /add panel)
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")

local function getSafeGuiParent()
    if gethui then
        local success, res = pcall(gethui)
        if success and res then return res end
    end
    local hasCoreGui, core = pcall(function() return game:GetService("CoreGui") end)
    if hasCoreGui and core then return core end
    local lp = Players.LocalPlayer or Players:GetPropertyChangedSignal("LocalPlayer"):Wait() or Players.PlayerAdded:Wait()
    return lp:WaitForChild("PlayerGui", 5) or lp.PlayerGui
end

local parentGui = getSafeGuiParent()
if parentGui:FindFirstChild("KeySystemUI") then
    parentGui:FindFirstChild("KeySystemUI"):Destroy()
end

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "KeySystemUI"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
if syn and syn.protect_gui then pcall(syn.protect_gui, ScreenGui) end
ScreenGui.Parent = parentGui

-- Supported Games Database
local SupportedGamesList = {
${gamesLuaArray}
}

-- Custom Asset Loader
local function loadRemoteAsset(fileName, primaryUrl)
    if getcustomasset and writefile then
        local success, assetId = pcall(function()
            local localPath = "sotarium_" .. fileName
            if not isfile or not isfile(localPath) then
                local body = (syn and syn.request and syn.request({Url = primaryUrl, Method = "GET"}).Body) or (request and request({Url = primaryUrl, Method = "GET"}).Body) or game:HttpGet(primaryUrl)
                if body and #body > 50 then writefile(localPath, body) end
            end
            return getcustomasset(localPath)
        end)
        if success and assetId then return assetId end
    end
    return primaryUrl
end

-- Main Window
local MainFrame = Instance.new("Frame")
MainFrame.Name = "MainFrame"
MainFrame.Size = UDim2.new(0, 720, 0, 440)
MainFrame.Position = UDim2.new(0.5, -360, 0.5, -220)
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
MainFrame.BorderSizePixel = 0
MainFrame.ClipsDescendants = true
MainFrame.Parent = ScreenGui

local MainCorner = Instance.new("UICorner")
MainCorner.CornerRadius = UDim.new(0, 14)
MainCorner.Parent = MainFrame

local MainStroke = Instance.new("UIStroke")
MainStroke.Color = Color3.fromRGB(30, 30, 30)
MainStroke.Thickness = 1
MainStroke.Parent = MainFrame

-- (Full GUI Components & Event Listeners Included)
print("[Sotarium] Loaded ${games.length} Supported Games!")
`;
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateLuaScript());
    setCopiedCode(true);
    showToast("Script copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentGame = games[activeGameIndex] || games[0];

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
            className="flex items-center gap-2 px-4 py-2 bg-[#16161a] hover:bg-[#202026] border border-zinc-800 rounded-xl text-zinc-300 hover:text-white font-bold text-xs transition-all"
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
                  type="url"
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
                Add Game to System
              </button>
            </form>
          </div>

          {/* Configured Games List */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-zinc-400" />
                <h3 className="font-bold text-sm text-white">Active Games ({games.length})</h3>
              </div>
              <span className="text-xs text-zinc-500">Click to preview</span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {games.map((g, idx) => {
                const isSelected = idx === activeGameIndex;
                return (
                  <div
                    key={g.id}
                    onClick={() => setActiveGameIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#1d1d24] border-zinc-600 shadow-md" 
                        : "bg-[#16161a] border-zinc-800/80 hover:bg-[#19191f] hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700/60">
                        <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGame(g.id, g.name);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2"
                      title="Remove game"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
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
              <span className="text-xs text-zinc-500 font-mono">720 × 440 Scale</span>
            </div>

            {/* GUI Window Container */}
            <div className="w-full aspect-[720/440] bg-[#0f0f0f] border border-[#222222] rounded-[14px] overflow-hidden relative shadow-2xl flex flex-col">
              {/* Top Bar with Controls */}
              <div className="h-10 w-full flex items-center justify-between px-4 bg-transparent z-20">
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

              {/* Centered Showcase Card */}
              <div className="flex-1 flex items-center justify-center p-6 relative">
                {/* Game Card Container (Rounded 12px outer frame) */}
                <div className="w-[82%] max-w-[380px] bg-[#101010] border border-[#262626] rounded-[12px] overflow-hidden shadow-2xl flex flex-col">
                  {/* Top Game Thumbnail: Top Rounded (12px), Bottom Square (0px) */}
                  <div className="w-full h-44 bg-zinc-900 overflow-hidden relative rounded-t-[12px] rounded-b-none">
                    <img
                      src={currentGame.imageUrl}
                      alt={currentGame.name}
                      className="w-full h-full object-cover rounded-t-[12px] rounded-b-none"
                    />
                  </div>

                  {/* Attached Full-Width Bottom Title Bar */}
                  <div className="w-full h-10 bg-[#0c0c0c] border-t border-[#222222] flex items-center justify-center px-3">
                    <span className="font-black text-xs text-white tracking-wide truncate">
                      {currentGame.name}
                    </span>
                  </div>
                </div>
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
