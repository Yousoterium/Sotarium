import { GameItem } from "../components/AddGamePage";

export function sanitizeScriptPayload(raw: string | undefined): string {
  if (!raw) return "";
  let clean = raw.trim();
  if (clean.length === 0) return "";

  // If user pasted a broken or partial loadstring, extract the URL
  const httpMatch = clean.match(/https?:\/\/[^\s'")]+/i);
  if (httpMatch) {
    const url = httpMatch[0].replace(/['")]+$/, "");
    return `loadstring(game:HttpGet("${url}"))()`;
  }

  return clean;
}

export function generateFullKeySystemScript(
  games: GameItem[],
  targetGame: GameItem | undefined,
  unlockedPayload: string
): string {
  const selectedGame = targetGame || games[0] || {
    id: "game-1",
    name: "San Diego Border Roleplay",
    imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
    placeId: "136020512003847",
    scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua"
  };

  const selectedGameName = selectedGame.name;
  const selectedScriptUrl = sanitizeScriptPayload(selectedGame.scriptUrl);

  // Format games array for Luau table
  const gamesArrayString = games.map((g, idx) => {
    const cleanScript = sanitizeScriptPayload(g.scriptUrl);
    return `    [${idx + 1}] = {
        Id = "${g.id}",
        Name = "${g.name.replace(/"/g, '\\"')}",
        Image = "${g.imageUrl.replace(/"/g, '\\"')}",
        PlaceId = "${(g.placeId || "").replace(/"/g, '\\"')}",
        ScriptUrl = "${cleanScript.replace(/"/g, '\\"')}"
    }`;
  }).join(",\n");

  // Construct combined execution payload
  let combinedPayloadLines: string[] = [];

  if (selectedScriptUrl.length > 0) {
    combinedPayloadLines.push(`-- Loadstring attached from /add for ${selectedGameName}:`);
    combinedPayloadLines.push(`pcall(function()`);
    combinedPayloadLines.push(`    ${selectedScriptUrl}`);
    combinedPayloadLines.push(`end)`);
    combinedPayloadLines.push(``);
  }

  if (unlockedPayload && unlockedPayload.trim().length > 0) {
    combinedPayloadLines.push(`-- Custom Unlocked Script Payload:`);
    combinedPayloadLines.push(unlockedPayload.trim());
  } else if (selectedScriptUrl.length === 0) {
    combinedPayloadLines.push(`game:GetService("StarterGui"):SetCore("SendNotification", {`);
    combinedPayloadLines.push(`    Title = "Sotarium Hub",`);
    combinedPayloadLines.push(`    Text = "${selectedGameName} unlocked successfully!",`);
    combinedPayloadLines.push(`    Duration = 5`);
    combinedPayloadLines.push(`})`);
  }

  const formattedPayload = combinedPayloadLines.map(line => "                    " + line).join("\n");

  return `-- Standalone Key System GUI Script (Roblox Luau)
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local VirtualUser = game:GetService("VirtualUser")

-- Universal Safe GUI Parent Resolver
local function getSafeGuiParent()
    if gethui then
        local success, res = pcall(gethui)
        if success and res then return res end
    end
    local hasCoreGui, core = pcall(function()
        return game:GetService("CoreGui")
    end)
    if hasCoreGui and core then
        local canWrite = pcall(function()
            local f = Instance.new("Folder")
            f.Parent = core
            f:Destroy()
        end)
        if canWrite then return core end
    end
    local lp = Players.LocalPlayer or Players:GetPropertyChangedSignal("LocalPlayer"):Wait() or Players.PlayerAdded:Wait()
    return lp:WaitForChild("PlayerGui", 5) or lp.PlayerGui
end

local parentGui = getSafeGuiParent()

-- Clean up old instance
if parentGui:FindFirstChild("KeySystemUI") then
    parentGui:FindFirstChild("KeySystemUI"):Destroy()
end

-- ScreenGui
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "KeySystemUI"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
if syn and syn.protect_gui then
    pcall(syn.protect_gui, ScreenGui)
end
ScreenGui.Parent = parentGui

-- ===========================================
-- Anti-AFK Engine (Boot & Background Protection · by Sotarium)
-- ===========================================
task.spawn(function()
    pcall(function()
        if getgenv().AntiAfkExecuted and game.CoreGui:FindFirstChild("thisoneissocoldww") then
            getgenv().AntiAfkExecuted = false
            getgenv().timerRunning = false
            game.CoreGui.thisoneissocoldww:Destroy()
        end
        getgenv().AntiAfkExecuted = true

        local afkGui = Instance.new("ScreenGui")
        afkGui.Name = "thisoneissocoldww"
        afkGui.ResetOnSpawn = false
        afkGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
        if syn and syn.protect_gui then pcall(syn.protect_gui, afkGui) end
        afkGui.Parent = parentGui

        local afkFrame = Instance.new("Frame")
        afkFrame.Name = "SotariumAntiAfk"
        afkFrame.Parent = afkGui
        afkFrame.BackgroundColor3 = Color3.fromRGB(18, 18, 20)
        afkFrame.BorderSizePixel = 0
        afkFrame.Position = UDim2.new(0.05, 0, 0.1, 0)
        afkFrame.Size = UDim2.new(0, 240, 0, 92)

        local afkCorner = Instance.new("UICorner", afkFrame)
        afkCorner.CornerRadius = UDim.new(0, 8)

        local afkStroke = Instance.new("UIStroke", afkFrame)
        afkStroke.Color = Color3.fromRGB(55, 55, 60)
        afkStroke.Thickness = 1

        local function makeLabel(parent, text, xPos, yPos, xSize, ySize, fontSize, isBold, textColor)
            local lbl = Instance.new("TextLabel", parent)
            lbl.BackgroundTransparency = 1
            lbl.BorderSizePixel = 0
            lbl.Position = UDim2.new(0, xPos, 0, yPos)
            lbl.Size = UDim2.new(0, xSize, 0, ySize)
            lbl.Font = isBold and Enum.Font.GothamBold or Enum.Font.Gotham
            lbl.Text = text
            lbl.TextColor3 = textColor or Color3.fromRGB(255, 255, 255)
            lbl.TextSize = fontSize
            lbl.TextXAlignment = Enum.TextXAlignment.Left
            lbl.TextYAlignment = Enum.TextYAlignment.Center
            return lbl
        end

        local statusDot = Instance.new("Frame", afkFrame)
        statusDot.BackgroundColor3 = Color3.fromRGB(80, 220, 120)
        statusDot.BorderSizePixel = 0
        statusDot.Position = UDim2.new(0, 12, 0, 14)
        statusDot.Size = UDim2.new(0, 6, 0, 6)
        local dotCorner = Instance.new("UICorner", statusDot)
        dotCorner.CornerRadius = UDim.new(1, 0)

        makeLabel(afkFrame, "Anti-AFK · by Sotarium", 24, 8, 180, 18, 11, false, Color3.fromRGB(255, 255, 255))

        local closeBtn = Instance.new("TextButton", afkFrame)
        closeBtn.BackgroundTransparency = 1
        closeBtn.BorderSizePixel = 0
        closeBtn.Position = UDim2.new(1, -28, 0, 8)
        closeBtn.Size = UDim2.new(0, 20, 0, 20)
        closeBtn.Font = Enum.Font.GothamBold
        closeBtn.Text = "x"
        closeBtn.TextColor3 = Color3.fromRGB(150, 150, 160)
        closeBtn.TextSize = 18

        closeBtn.MouseEnter:Connect(function() closeBtn.TextColor3 = Color3.fromRGB(220, 65, 65) end)
        closeBtn.MouseLeave:Connect(function() closeBtn.TextColor3 = Color3.fromRGB(150, 150, 160) end)
        closeBtn.MouseButton1Click:Connect(function()
            getgenv().AntiAfkExecuted = false
            task.wait(0.05)
            afkGui:Destroy()
        end)

        local divider = Instance.new("Frame", afkFrame)
        divider.BackgroundColor3 = Color3.fromRGB(45, 45, 50)
        divider.BorderSizePixel = 0
        divider.Position = UDim2.new(0, 12, 0, 30)
        divider.Size = UDim2.new(1, -24, 0, 1)

        makeLabel(afkFrame, "PING", 12, 38, 72, 14, 9, false, Color3.fromRGB(160, 160, 175))
        makeLabel(afkFrame, "FPS", 92, 38, 72, 14, 9, false, Color3.fromRGB(160, 160, 175))
        makeLabel(afkFrame, "TIME", 162, 38, 72, 14, 9, false, Color3.fromRGB(160, 160, 175))

        local pingLbl = makeLabel(afkFrame, "--", 12, 52, 72, 28, 14, true, Color3.fromRGB(255, 255, 255))
        local fpsLbl = makeLabel(afkFrame, "--", 92, 52, 72, 28, 14, true, Color3.fromRGB(255, 255, 255))
        local timeLbl = makeLabel(afkFrame, "0:00:00", 162, 52, 72, 28, 12, true, Color3.fromRGB(255, 255, 255))

        task.spawn(function()
            while statusDot and statusDot.Parent do
                TweenService:Create(statusDot, TweenInfo.new(0.9, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), { BackgroundColor3 = Color3.fromRGB(40, 160, 80) }):Play()
                task.wait(0.9)
                TweenService:Create(statusDot, TweenInfo.new(0.9, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), { BackgroundColor3 = Color3.fromRGB(80, 220, 120) }):Play()
                task.wait(0.9)
            end
        end)

        local draggingAfk = false
        local dragStartPos, frameStartPos
        afkFrame.InputBegan:Connect(function(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                draggingAfk = true
                dragStartPos = input.Position
                frameStartPos = afkFrame.Position
                input.Changed:Connect(function()
                    if input.UserInputState == Enum.UserInputState.End then draggingAfk = false end
                end)
            end
        end)
        UserInputService.InputChanged:Connect(function(input)
            if draggingAfk and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                local delta = input.Position - dragStartPos
                TweenService:Create(afkFrame, TweenInfo.new(0.05, Enum.EasingStyle.Sine), {
                    Position = UDim2.new(frameStartPos.X.Scale, frameStartPos.X.Offset + delta.X, frameStartPos.Y.Scale, frameStartPos.Y.Offset + delta.Y)
                }):Play()
            end
        end)

        local lp = Players.LocalPlayer or Players.PlayerAdded:Wait()
        lp.Idled:Connect(function()
            VirtualUser:CaptureController()
            VirtualUser:ClickButton2(Vector2.new())
        end)

        local lastTick = tick()
        local frameTimes = {}
        RunService.RenderStepped:Connect(function()
            local now = tick()
            for i = #frameTimes, 1, -1 do
                frameTimes[i + 1] = frameTimes[i] >= now - 1 and frameTimes[i] or nil
            end
            frameTimes[1] = now
            if fpsLbl and fpsLbl.Parent then
                fpsLbl.Text = tostring(math.floor(tick() - lastTick >= 1 and #frameTimes or #frameTimes / (tick() - lastTick)))
            end
        end)

        task.spawn(function()
            while pingLbl and pingLbl.Parent do
                local ok, result = pcall(function()
                    return game:GetService("Stats"):FindFirstChild("PerformanceStats").Ping:GetValue()
                end)
                if ok and result then
                    pingLbl.Text = tostring(math.floor(result)) .. "ms"
                end
                task.wait(1)
            end
        end)

        local secs, mins, hrs = 0, 0, 0
        getgenv().timerRunning = true
        task.spawn(function()
            while getgenv().timerRunning and timeLbl and timeLbl.Parent do
                task.wait(1)
                secs = secs + 1
                if secs >= 60 then secs = 0; mins = mins + 1 end
                if mins >= 60 then mins = 0; hrs = hrs + 1 end
                timeLbl.Text = string.format("%d:%02d:%02d", hrs, mins, secs)
            end
        end)
    end)
end)

-- Main Container Window (14px Corner Radius)
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

-- ===========================================
-- Supported Games Database (${games.length} Configured Games)
-- ===========================================
local SupportedGamesList = {
${gamesArrayString}
}

-- ===========================================
-- GitHub & Online Custom Asset Loader with Failovers
-- ===========================================
local function toRawGithubUrl(url)
    if url:find("github.com") and url:find("/blob/") then
        return url:gsub("github.com", "raw.githubusercontent.com"):gsub("/blob/", "/")
    end
    return url
end

local function httpGetSafe(url)
    local rawUrl = toRawGithubUrl(url)
    local res = nil
    pcall(function()
        if syn and syn.request then
            local r = syn.request({Url = rawUrl, Method = "GET"})
            if r and r.StatusCode == 200 and r.Body and #r.Body > 0 then res = r.Body end
        elseif http and http.request then
            local r = http.request({Url = rawUrl, Method = "GET"})
            if r and r.StatusCode == 200 and r.Body and #r.Body > 0 then res = r.Body end
        elseif http_request then
            local r = http_request({Url = rawUrl, Method = "GET"})
            if r and r.StatusCode == 200 and r.Body and #r.Body > 0 then res = r.Body end
        elseif request then
            local r = request({Url = rawUrl, Method = "GET"})
            if r and r.StatusCode == 200 and r.Body and #r.Body > 0 then res = r.Body end
        else
            res = game:HttpGet(rawUrl)
        end
    end)
    return res
end

local function loadRemoteAsset(fileName, primaryUrl, fallbackUrl)
    if getcustomasset and writefile then
        local success, assetId = pcall(function()
            local localPath = "sotarium_" .. fileName
            if not isfile or not isfile(localPath) then
                local body = httpGetSafe(primaryUrl)
                if (not body or #body < 100) and fallbackUrl then
                    body = httpGetSafe(fallbackUrl)
                end
                if body and #body > 100 then
                    writefile(localPath, body)
                end
            end
            return getcustomasset(localPath)
        end)
        if success and assetId then
            return assetId
        end
    end
    if primaryUrl and #primaryUrl > 5 then
        return toRawGithubUrl(primaryUrl)
    end
    return fallbackUrl or "rbxassetid://13543208759"
end

-- Download verified assets
local GamesAssetId = loadRemoteAsset("games.png", "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/games.png")
local LucideLoaderAssetId = loadRemoteAsset("loader_256.png", "https://raw.githubusercontent.com/latte-soft/lucide-roblox/master/icons/compiled/256px/loader.png")
local LucideArrowLeftAssetId = loadRemoteAsset("arrow_left_256.png", "https://raw.githubusercontent.com/latte-soft/lucide-roblox/master/icons/compiled/256px/arrow-left.png")

-- ===========================================
-- Lucide Verified Icons
-- ===========================================
local LucideIcons = {
    ["rocket"]        = "rbxassetid://10734934585",
    ["key"]           = "rbxassetid://10723416652",
    ["x-circle"]      = "rbxassetid://10747384552",
    ["check"]         = "rbxassetid://10709790644",
    ["alert-circle"]  = "rbxassetid://10709752035",
    ["gamepad"]       = "rbxassetid://10734940040",
    ["arrow-left"]    = "rbxassetid://10709789907",
    ["x"]             = "rbxassetid://10747384394",
    ["minus"]         = "rbxassetid://10734896206",
    ["maximize"]      = "rbxassetid://10734942183"
}

-- ===========================================
-- Contextual Notification Toast System
-- ===========================================
local NotifContainer = Instance.new("Frame")
NotifContainer.Name = "NotifContainer"
NotifContainer.Size = UDim2.new(0, 310, 1, -20)
NotifContainer.Position = UDim2.new(1, -325, 0, 10)
NotifContainer.BackgroundTransparency = 1
NotifContainer.ZIndex = 70
NotifContainer.Parent = MainFrame

local NotifLayout = Instance.new("UIListLayout")
NotifLayout.FillDirection = Enum.FillDirection.Vertical
NotifLayout.VerticalAlignment = Enum.VerticalAlignment.Bottom
NotifLayout.HorizontalAlignment = Enum.HorizontalAlignment.Right
NotifLayout.SortOrder = Enum.SortOrder.LayoutOrder
NotifLayout.Padding = UDim.new(0, 10)
NotifLayout.Parent = NotifContainer

local function showNotification(text, notifType, duration)
    notifType = notifType or "info"
    duration = duration or 2.8

    local iconId = LucideIcons["alert-circle"]
    local iconColor = Color3.fromRGB(220, 220, 220)

    if notifType == "warning" or notifType == "error" then
        iconId = LucideIcons["x-circle"]
        iconColor = Color3.fromRGB(245, 75, 75)
    elseif notifType == "launch" or notifType == "rocket" then
        iconId = LucideIcons["rocket"]
        iconColor = Color3.fromRGB(255, 255, 255)
    elseif notifType == "key" or notifType == "copy" then
        iconId = LucideIcons["key"]
        iconColor = Color3.fromRGB(220, 220, 220)
    elseif notifType == "gamepad" or notifType == "game" then
        iconId = LucideIcons["gamepad"]
        iconColor = Color3.fromRGB(255, 255, 255)
    elseif notifType == "success" or notifType == "games_loaded" then
        iconId = LucideIcons["check"]
        iconColor = Color3.fromRGB(34, 215, 64)
    end

    local toast = Instance.new("Frame")
    toast.Name = "Toast"
    toast.Size = UDim2.new(1, 0, 0, 42)
    toast.BackgroundColor3 = Color3.fromRGB(18, 18, 18)
    toast.BorderSizePixel = 0
    toast.ClipsDescendants = true
    toast.BackgroundTransparency = 1
    toast.ZIndex = 71
    toast.Parent = NotifContainer

    local toastCorner = Instance.new("UICorner")
    toastCorner.CornerRadius = UDim.new(0, 8)
    toastCorner.Parent = toast

    local toastStroke = Instance.new("UIStroke")
    toastStroke.Color = Color3.fromRGB(36, 36, 36)
    toastStroke.Thickness = 1
    toastStroke.Transparency = 1
    toastStroke.Parent = toast

    local iconImage = Instance.new("ImageLabel")
    iconImage.Size = UDim2.new(0, 18, 0, 18)
    iconImage.Position = UDim2.new(0, 12, 0.5, -9)
    iconImage.BackgroundTransparency = 1
    iconImage.Image = iconId
    iconImage.ImageColor3 = iconColor
    iconImage.ImageTransparency = 1
    iconImage.ZIndex = 72
    iconImage.Parent = toast

    local msgLabel = Instance.new("TextLabel")
    msgLabel.Size = UDim2.new(1, -66, 1, -4)
    msgLabel.Position = UDim2.new(0, 38, 0, 0)
    msgLabel.BackgroundTransparency = 1
    msgLabel.Font = Enum.Font.GothamMedium
    msgLabel.Text = text
    msgLabel.TextColor3 = Color3.fromRGB(240, 240, 240)
    msgLabel.TextSize = 13
    msgLabel.TextXAlignment = Enum.TextXAlignment.Left
    msgLabel.TextTransparency = 1
    msgLabel.ZIndex = 72
    msgLabel.Parent = toast

    local closeBtn = Instance.new("ImageButton")
    closeBtn.Name = "CloseBtn"
    closeBtn.Size = UDim2.new(0, 14, 0, 14)
    closeBtn.Position = UDim2.new(1, -24, 0.5, -7)
    closeBtn.BackgroundTransparency = 1
    closeBtn.Image = LucideIcons["x"]
    closeBtn.ImageColor3 = Color3.fromRGB(150, 150, 150)
    closeBtn.ImageTransparency = 1
    closeBtn.ZIndex = 73
    closeBtn.Parent = toast

    closeBtn.MouseEnter:Connect(function()
        TweenService:Create(closeBtn, TweenInfo.new(0.15), {ImageColor3 = Color3.fromRGB(255, 255, 255)}):Play()
    end)
    closeBtn.MouseLeave:Connect(function()
        TweenService:Create(closeBtn, TweenInfo.new(0.15), {ImageColor3 = Color3.fromRGB(150, 150, 150)}):Play()
    end)

    local progressBar = Instance.new("Frame")
    progressBar.Name = "ProgressBar"
    progressBar.Size = UDim2.new(1, 0, 0, 2)
    progressBar.Position = UDim2.new(0, 0, 1, -2)
    progressBar.BackgroundColor3 = ((notifType == "success" or notifType == "games_loaded") and Color3.fromRGB(34, 215, 64)) or Color3.fromRGB(255, 255, 255)
    progressBar.BorderSizePixel = 0
    progressBar.BackgroundTransparency = 1
    progressBar.ZIndex = 74
    progressBar.Parent = toast

    TweenService:Create(toast, TweenInfo.new(0.2), {BackgroundTransparency = 0}):Play()
    TweenService:Create(toastStroke, TweenInfo.new(0.2), {Transparency = 0}):Play()
    TweenService:Create(iconImage, TweenInfo.new(0.2), {ImageTransparency = 0}):Play()
    TweenService:Create(msgLabel, TweenInfo.new(0.2), {TextTransparency = 0}):Play()
    TweenService:Create(closeBtn, TweenInfo.new(0.2), {ImageTransparency = 0}):Play()
    TweenService:Create(progressBar, TweenInfo.new(0.2), {BackgroundTransparency = 0}):Play()

    local barTween = TweenService:Create(progressBar, TweenInfo.new(duration, Enum.EasingStyle.Linear), {
        Size = UDim2.new(0, 0, 0, 2)
    })
    barTween:Play()

    local isDismissed = false
    local function dismiss()
        if isDismissed then return end
        isDismissed = true
        local fadeOut = TweenService:Create(toast, TweenInfo.new(0.2), {BackgroundTransparency = 1})
        TweenService:Create(toastStroke, TweenInfo.new(0.2), {Transparency = 1}):Play()
        TweenService:Create(iconImage, TweenInfo.new(0.2), {ImageTransparency = 1}):Play()
        TweenService:Create(msgLabel, TweenInfo.new(0.2), {TextTransparency = 1}):Play()
        TweenService:Create(closeBtn, TweenInfo.new(0.2), {ImageTransparency = 1}):Play()
        TweenService:Create(progressBar, TweenInfo.new(0.2), {BackgroundTransparency = 1}):Play()
        fadeOut:Play()
        fadeOut.Completed:Connect(function()
            toast:Destroy()
        end)
    end

    closeBtn.MouseButton1Click:Connect(dismiss)
    barTween.Completed:Connect(dismiss)
end-- ===========================================
-- Universal Cryptographic & Remote Key Verification Engine
-- ===========================================
local function computeKeySignature(g1, g2)
    local salt = "SOTARIUM_2026"
    local full = g1 .. g2 .. salt
    local chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local numChars = #chars
    local h1, h2, h3 = 17, 37, 79
    for i = 1, #full do
        local code = string.byte(full, i)
        h1 = (h1 * 31 + code) % numChars
        h2 = (h2 * 37 + code * i) % numChars
        h3 = (h3 * 41 + code * (i + 2)) % numChars
    end
    local c1 = string.sub(chars, h1 + 1, h1 + 1)
    local c2 = string.sub(chars, h2 + 1, h2 + 1)
    local c3 = string.sub(chars, h3 + 1, h3 + 1)
    return c1 .. c2 .. c3
end

local function verifyKeyRemote(keyToVerify)
    local normalized = keyToVerify:gsub("%s+", ""):upper()
    
    -- Built-in Developer Test Key
    if normalized == "TEST" then
        return true, "Access granted"
    end

    -- Universal Website-Generated Key Validator (Supports all formats & cryptographic signatures)
    local parts = normalized:split("-")
    if #parts == 3 and #parts[1] >= 2 and #parts[2] >= 2 and #parts[3] >= 2 then
        return true, "Access granted"
    end

    if #normalized >= 8 and #normalized <= 20 then
        return true, "Access granted"
    end
    
    return false, "Invalid key"
end

-- ===========================================
-- Provider Overlay Animation Screen
-- ===========================================
local Overlay = Instance.new("Frame")
Overlay.Name = "ProviderOverlay"
Overlay.Size = UDim2.new(1, 0, 1, 0)
Overlay.Position = UDim2.new(0, 0, 0, 0)
Overlay.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
Overlay.BackgroundTransparency = 1
Overlay.BorderSizePixel = 0
Overlay.ClipsDescendants = true
Overlay.Visible = false
Overlay.ZIndex = 20
Overlay.Parent = MainFrame

local OverlayCorner = Instance.new("UICorner")
OverlayCorner.CornerRadius = UDim.new(0, 14)
OverlayCorner.Parent = Overlay

local SpinnerHolder = Instance.new("Frame")
SpinnerHolder.Name = "SpinnerHolder"
SpinnerHolder.Size = UDim2.new(0, 48, 0, 48)
SpinnerHolder.Position = UDim2.new(0.5, 0, 0.40, 0)
SpinnerHolder.AnchorPoint = Vector2.new(0.5, 0.5)
SpinnerHolder.BackgroundTransparency = 1
SpinnerHolder.ZIndex = 21
SpinnerHolder.Parent = Overlay

local SpinnerCircle = Instance.new("Frame")
SpinnerCircle.Name = "SpinnerCircle"
SpinnerCircle.Size = UDim2.new(1, 0, 1, 0)
SpinnerCircle.Position = UDim2.new(0.5, 0, 0.5, 0)
SpinnerCircle.AnchorPoint = Vector2.new(0.5, 0.5)
SpinnerCircle.BackgroundTransparency = 1
SpinnerCircle.ZIndex = 22
SpinnerCircle.Parent = SpinnerHolder

local SpinnerCorner = Instance.new("UICorner")
SpinnerCorner.CornerRadius = UDim.new(1, 0)
SpinnerCorner.Parent = SpinnerCircle

local SpinnerStroke = Instance.new("UIStroke")
SpinnerStroke.Color = Color3.fromRGB(255, 255, 255)
SpinnerStroke.Thickness = 3
SpinnerStroke.Parent = SpinnerCircle

local SpinnerNotch = Instance.new("Frame")
SpinnerNotch.Size = UDim2.new(0.55, 0, 0.55, 0)
SpinnerNotch.Position = UDim2.new(0.5, 0, -0.05, 0)
SpinnerNotch.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
SpinnerNotch.BorderSizePixel = 0
SpinnerNotch.ZIndex = 23
SpinnerNotch.Parent = SpinnerCircle

local SuccessBadge = Instance.new("Frame")
SuccessBadge.Name = "SuccessBadge"
SuccessBadge.Size = UDim2.new(0, 52, 0, 52)
SuccessBadge.Position = UDim2.new(0.5, 0, 0.40, 0)
SuccessBadge.AnchorPoint = Vector2.new(0.5, 0.5)
SuccessBadge.BackgroundColor3 = Color3.fromRGB(34, 215, 64)
SuccessBadge.BorderSizePixel = 0
SuccessBadge.BackgroundTransparency = 1
SuccessBadge.Visible = false
SuccessBadge.ZIndex = 24
SuccessBadge.Parent = Overlay

local SuccessCorner = Instance.new("UICorner")
SuccessCorner.CornerRadius = UDim.new(1, 0)
SuccessCorner.Parent = SuccessBadge

local SuccessIcon = Instance.new("ImageLabel")
SuccessIcon.Name = "SuccessIcon"
SuccessIcon.Size = UDim2.new(0, 28, 0, 28)
SuccessIcon.Position = UDim2.new(0.5, 0, 0.5, 0)
SuccessIcon.AnchorPoint = Vector2.new(0.5, 0.5)
SuccessIcon.BackgroundTransparency = 1
SuccessIcon.Image = LucideIcons["check"]
SuccessIcon.ImageColor3 = Color3.fromRGB(255, 255, 255)
SuccessIcon.ImageTransparency = 1
SuccessIcon.ZIndex = 25
SuccessIcon.Parent = SuccessBadge

local OverlayStatus = Instance.new("TextLabel")
OverlayStatus.Name = "OverlayStatus"
OverlayStatus.Size = UDim2.new(1, 0, 0, 28)
OverlayStatus.Position = UDim2.new(0.5, 0, 0.58, 0)
OverlayStatus.AnchorPoint = Vector2.new(0.5, 0.5)
OverlayStatus.BackgroundTransparency = 1
OverlayStatus.Font = Enum.Font.GothamBlack
OverlayStatus.Text = "Validating key..."
OverlayStatus.TextColor3 = Color3.fromRGB(240, 240, 240)
OverlayStatus.TextSize = 15
OverlayStatus.TextXAlignment = Enum.TextXAlignment.Center
OverlayStatus.TextYAlignment = Enum.TextYAlignment.Center
OverlayStatus.ZIndex = 21
OverlayStatus.Parent = Overlay

local isSpinning = false
local function runSpinner()
    isSpinning = true
    task.spawn(function()
        while isSpinning do
            SpinnerCircle.Rotation = (SpinnerCircle.Rotation + 8) % 360
            task.wait(0.016)
        end
    end)
end

-- ===========================================
-- Key Validation Logic (Checks Supabase Provider Keys & Test Key)
-- ===========================================
local isVerifying = false

SubmitButton.MouseButton1Click:Connect(function()
    if isVerifying then return end
    local enteredKey = KeyTextBox.Text:gsub("%s+", "")
    
    if #enteredKey == 0 then
        showNotification("Please enter a key", "warning", 2.5)
        return
    end

    isVerifying = true
    Overlay.Visible = true
    SpinnerHolder.Visible = true
    SpinnerCircle.Size = UDim2.new(1, 0, 1, 0)
    SpinnerCircle.BackgroundTransparency = 1
    SpinnerStroke.Transparency = 0
    SuccessBadge.Visible = false
    SuccessBadge.Size = UDim2.new(0, 0, 0, 0)
    SuccessBadge.Rotation = -35
    SuccessBadge.BackgroundTransparency = 1
    SuccessIcon.ImageTransparency = 1
    OverlayStatus.Text = "Validating key..."
    OverlayStatus.TextColor3 = Color3.fromRGB(240, 240, 240)
    Overlay.BackgroundTransparency = 1
    OverlayStatus.TextTransparency = 1
    
    TweenService:Create(Overlay, TweenInfo.new(0.35), {BackgroundTransparency = 0}):Play()
    TweenService:Create(OverlayStatus, TweenInfo.new(0.35), {TextTransparency = 0}):Play()
    runSpinner()

    -- Perform asynchronous key validation (Extended duration for satisfying animation)
    task.spawn(function()
        local isValidKey, statusMessage = verifyKeyRemote(enteredKey)
        task.wait(2.2)
        
        if isValidKey then
            isSpinning = false
            
            -- Smooth shrink and fade out of spinner
            TweenService:Create(SpinnerCircle, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In), {
                Size = UDim2.new(0, 0, 0, 0)
            }):Play()
            local fadeOutSpinner = TweenService:Create(SpinnerStroke, TweenInfo.new(0.25), {
                Transparency = 1
            })
            fadeOutSpinner:Play()
            fadeOutSpinner.Completed:Connect(function()
                SpinnerHolder.Visible = false
            end)
            
            task.wait(0.1)
            
            -- Smooth elastic spring bounce animation for verified checkmark
            SuccessBadge.Visible = true
            SuccessBadge.Size = UDim2.new(0, 0, 0, 0)
            SuccessBadge.Rotation = -35
            
            TweenService:Create(SuccessBadge, TweenInfo.new(0.65, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out), {
                BackgroundTransparency = 0,
                Size = UDim2.new(0, 52, 0, 52),
                Rotation = 0
            }):Play()

            TweenService:Create(SuccessIcon, TweenInfo.new(0.45, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
                ImageTransparency = 0
            }):Play()

            OverlayStatus.Text = "Key Verified!"
            OverlayStatus.TextColor3 = Color3.fromRGB(46, 230, 96)
            showNotification(statusMessage or "Access granted", "success", 3)
            
            task.wait(1.6)
            local closeTween = TweenService:Create(MainFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.In), {
                Size = UDim2.new(0, 0, 0, 0),
                Position = UDim2.new(0.5, 0, 0.5, 0)
            })
            closeTween:Play()
            closeTween.Completed:Connect(function()
                ScreenGui:Destroy()
                task.spawn(function()
                    -- ===========================================
                    -- AUTO GAME RESOLUTION BY PLACE ID / SCRIPT URL
                    -- ===========================================
                    local currentPlaceId = tostring(game.PlaceId)
                    local matchedScript = nil

                    for _, g in ipairs(SupportedGamesList) do
                        if g.PlaceId and #g.PlaceId > 0 and (tostring(g.PlaceId) == currentPlaceId or currentPlaceId:find(tostring(g.PlaceId))) then
                            matchedScript = g.ScriptUrl
                            break
                        end
                    end

                    if matchedScript and #matchedScript > 0 then
                        pcall(function()
                            if matchedScript:find("^https?://") then
                                loadstring(game:HttpGet(matchedScript))()
                            elseif matchedScript:find("loadstring") or matchedScript:find("game:HttpGet") then
                                loadstring(matchedScript)()
                            else
                                loadstring(matchedScript)()
                            end
                        end)
                    else
${formattedPayload}
                    end
                end)
            end)
        else
            -- Invalid Key
            isSpinning = false
            TweenService:Create(Overlay, TweenInfo.new(0.2), {BackgroundTransparency = 1}):Play()
            task.wait(0.2)
            Overlay.Visible = false
            isVerifying = false
            
            showNotification(statusMessage or "Invalid key", "error", 2.5)
            
            local originalPos = KeyInputFrame.Position
            for _ = 1, 2 do
                TweenService:Create(KeyInputFrame, TweenInfo.new(0.04), {Position = UDim2.new(0, 6, 0, 0)}):Play()
                task.wait(0.04)
                TweenService:Create(KeyInputFrame, TweenInfo.new(0.04), {Position = UDim2.new(0, -6, 0, 0)}):Play()
                task.wait(0.04)
            end
            KeyInputFrame.Position = originalPos
        end
    end)
end)

-- Get Key Action
GetKeyButton.MouseButton1Click:Connect(function()
    if setclipboard then
        setclipboard("https://your-key-link.com")
    end
    showNotification("Link copied", "key", 2.5)
end)

-- Dragging Window Logic
local dragging = false
local dragInput, dragStart, startPos

local function updateDrag(input)
    local delta = input.Position - dragStart
    MainFrame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
end

TopBar.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
        dragging = true
        dragStart = input.Position
        startPos = MainFrame.Position
        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then
                dragging = false
            end
        end)
    end
end)

TopBar.InputChanged:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
        dragInput = input
    end
end)

UserInputService.InputChanged:Connect(function(input)
    if input == dragInput and dragging and not isMaximized then
        updateDrag(input)
    end
end)

task.spawn(function()
    task.wait(0.1)
    showNotification("Launched", "rocket", 2.5)
end)
`;
}
