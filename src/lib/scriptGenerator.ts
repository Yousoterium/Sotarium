import { GameItem } from "../components/AddGamePage";

export function generateFullKeySystemScript(
  games: GameItem[],
  targetGame: GameItem | undefined,
  unlockedPayload: string
): string {
  const selectedGame = targetGame || games[0] || {
    id: "game-1",
    name: "San Diego Border Roleplay",
    imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
    placeId: "",
    scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua"
  };

  const selectedGameName = selectedGame.name;
  const selectedScriptUrl = selectedGame.scriptUrl ? selectedGame.scriptUrl.trim() : "";

  // Format games array for Luau table
  const gamesArrayString = games.map((g, idx) => {
    return `    [${idx + 1}] = {
        Id = "${g.id}",
        Name = "${g.name.replace(/"/g, '\\"')}",
        Image = "${g.imageUrl.replace(/"/g, '\\"')}",
        PlaceId = "${(g.placeId || "").replace(/"/g, '\\"')}",
        ScriptUrl = "${(g.scriptUrl || "").replace(/"/g, '\\"')}"
    }`;
  }).join(",\n");

  // Construct combined execution payload
  let combinedPayloadLines: string[] = [];

  if (selectedScriptUrl.length > 0) {
    combinedPayloadLines.push(`-- Loadstring attached from /add for ${selectedGameName}:`);
    combinedPayloadLines.push(`pcall(function()`);
    if (selectedScriptUrl.startsWith("loadstring(") || selectedScriptUrl.includes("game:HttpGet")) {
      combinedPayloadLines.push(`    ${selectedScriptUrl}`);
    } else {
      combinedPayloadLines.push(`    loadstring(game:HttpGet("${selectedScriptUrl}"))()`);
    }
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

  const formattedPayload = combinedPayloadLines.map(line => "                " + line).join("\n");

  return `-- Standalone Key System GUI Script (Roblox Luau)
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")

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
-- Supported Games Database from /add
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
    return "rbxassetid://13543208759"
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
end

-- ===========================================
-- Top Bar (Visible on Every Screen)
-- ===========================================
local TopBar = Instance.new("Frame")
TopBar.Name = "TopBar"
TopBar.Size = UDim2.new(1, 0, 0, 42)
TopBar.BackgroundTransparency = 1
TopBar.ZIndex = 60
TopBar.Parent = MainFrame

local Controls = Instance.new("Frame")
Controls.Name = "Controls"
Controls.Size = UDim2.new(0, 105, 1, 0)
Controls.Position = UDim2.new(1, -115, 0, 0)
Controls.BackgroundTransparency = 1
Controls.ZIndex = 61
Controls.Parent = TopBar

local ControlsLayout = Instance.new("UIListLayout")
ControlsLayout.FillDirection = Enum.FillDirection.Horizontal
ControlsLayout.HorizontalAlignment = Enum.HorizontalAlignment.Right
ControlsLayout.VerticalAlignment = Enum.VerticalAlignment.Center
ControlsLayout.SortOrder = Enum.SortOrder.LayoutOrder
ControlsLayout.Padding = UDim.new(0, 16)
ControlsLayout.Parent = Controls

local function createButtonContainer(name, layoutOrder)
    local btn = Instance.new("TextButton")
    btn.Name = name
    btn.Size = UDim2.new(0, 16, 0, 16)
    btn.BackgroundTransparency = 1
    btn.Text = ""
    btn.LayoutOrder = layoutOrder
    btn.ZIndex = 62
    btn.Parent = Controls
    return btn
end

-- Minimize (-)
local MinBtn = createButtonContainer("MinimizeBtn", 1)
local MinBar = Instance.new("Frame")
MinBar.Size = UDim2.new(0, 12, 0, 2)
MinBar.Position = UDim2.new(0.5, -6, 0.5, 0)
MinBar.BackgroundColor3 = Color3.fromRGB(150, 150, 150)
MinBar.BorderSizePixel = 0
MinBar.ZIndex = 63
MinBar.Parent = MinBtn

local isMinimized = false
local defaultSize = MainFrame.Size
MinBtn.MouseButton1Click:Connect(function()
    isMinimized = not isMinimized
    local targetSize = isMinimized and UDim2.new(0, 720, 0, 42) or defaultSize
    TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {Size = targetSize}):Play()
end)

MinBtn.MouseEnter:Connect(function() TweenService:Create(MinBar, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(255, 255, 255)}):Play() end)
MinBtn.MouseLeave:Connect(function() TweenService:Create(MinBar, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(150, 150, 150)}):Play() end)

-- Fullscreen
local FullscreenBtn = createButtonContainer("FullscreenBtn", 2)
local cornerLines = {}

local function createCornerBracket(hSize, vSize, hPos, vPos)
    local hLine = Instance.new("Frame")
    hLine.Size = hSize; hLine.Position = hPos; hLine.BackgroundColor3 = Color3.fromRGB(150, 150, 150); hLine.BorderSizePixel = 0; hLine.ZIndex = 63; hLine.Parent = FullscreenBtn
    table.insert(cornerLines, hLine)
    local vLine = Instance.new("Frame")
    vLine.Size = vSize; vLine.Position = vPos; vLine.BackgroundColor3 = Color3.fromRGB(150, 150, 150); vLine.BorderSizePixel = 0; vLine.ZIndex = 63; vLine.Parent = FullscreenBtn
    table.insert(cornerLines, vLine)
end

createCornerBracket(UDim2.new(0, 4, 0, 1.5), UDim2.new(0, 1.5, 0, 4), UDim2.new(0, 2, 0, 2), UDim2.new(0, 2, 0, 2))
createCornerBracket(UDim2.new(0, 4, 0, 1.5), UDim2.new(0, 1.5, 0, 4), UDim2.new(1, -6, 0, 2), UDim2.new(1, -3.5, 0, 2))
createCornerBracket(UDim2.new(0, 4, 0, 1.5), UDim2.new(0, 1.5, 0, 4), UDim2.new(0, 2, 1, -3.5), UDim2.new(0, 2, 1, -6))
createCornerBracket(UDim2.new(0, 4, 0, 1.5), UDim2.new(0, 1.5, 0, 4), UDim2.new(1, -6, 1, -3.5), UDim2.new(1, -3.5, 1, -6))

FullscreenBtn.MouseEnter:Connect(function()
    for _, l in ipairs(cornerLines) do TweenService:Create(l, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(255, 255, 255)}):Play() end
end)
FullscreenBtn.MouseLeave:Connect(function()
    for _, l in ipairs(cornerLines) do TweenService:Create(l, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(150, 150, 150)}):Play() end
end)

local isMaximized = false
local preMaxPos, preMaxSize
FullscreenBtn.MouseButton1Click:Connect(function()
    isMaximized = not isMaximized
    if isMaximized then
        preMaxPos = MainFrame.Position
        preMaxSize = MainFrame.Size
        TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
            Size = UDim2.new(0.94, 0, 0.9, 0),
            Position = UDim2.new(0.03, 0, 0.05, 0)
        }):Play()
    else
        TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {
            Size = preMaxSize or defaultSize,
            Position = preMaxPos or UDim2.new(0.5, -360, 0.5, -220)
        }):Play()
    end
end)

-- Close (X)
local CloseBtn = createButtonContainer("CloseBtn", 3)
local closeLines = {}

local function createXLine(rotation)
    local line = Instance.new("Frame")
    line.Size = UDim2.new(0, 14, 0, 1.5)
    line.Position = UDim2.new(0.5, -7, 0.5, -0.75)
    line.BackgroundColor3 = Color3.fromRGB(150, 150, 150)
    line.BorderSizePixel = 0
    line.Rotation = rotation
    line.ZIndex = 63
    line.Parent = CloseBtn
    table.insert(closeLines, line)
end
createXLine(45); createXLine(-45)

CloseBtn.MouseEnter:Connect(function()
    for _, l in ipairs(closeLines) do TweenService:Create(l, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(255, 255, 255)}):Play() end
end)
CloseBtn.MouseLeave:Connect(function()
    for _, l in ipairs(closeLines) do TweenService:Create(l, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(150, 150, 150)}):Play() end
end)
CloseBtn.MouseButton1Click:Connect(function()
    local t = TweenService:Create(MainFrame, TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
        Size = UDim2.new(0, 0, 0, 0),
        Position = UDim2.new(MainFrame.Position.X.Scale, MainFrame.Position.X.Offset + (MainFrame.AbsoluteSize.X/2), MainFrame.Position.Y.Scale, MainFrame.Position.Y.Offset + (MainFrame.AbsoluteSize.Y/2))
    })
    t:Play()
    t.Completed:Connect(function() ScreenGui:Destroy() end)
end)

-- ===========================================
-- Center Main Content (Key Entry Menu)
-- ===========================================
local ContentFrame = Instance.new("Frame")
ContentFrame.Name = "Content"
ContentFrame.Size = UDim2.new(0, 320, 0, 230)
ContentFrame.Position = UDim2.new(0.5, -160, 0.5, -100)
ContentFrame.BackgroundTransparency = 1
ContentFrame.Parent = MainFrame

local ContentLayout = Instance.new("UIListLayout")
ContentLayout.FillDirection = Enum.FillDirection.Vertical
ContentLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
ContentLayout.VerticalAlignment = Enum.VerticalAlignment.Center
ContentLayout.SortOrder = Enum.SortOrder.LayoutOrder
ContentLayout.Padding = UDim.new(0, 12)
ContentLayout.Parent = ContentFrame

local TitleLabel = Instance.new("TextLabel")
TitleLabel.Name = "Title"
TitleLabel.Size = UDim2.new(1, 0, 0, 30)
TitleLabel.BackgroundTransparency = 1
TitleLabel.Font = Enum.Font.GothamBold
TitleLabel.Text = "Get your access key"
TitleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
TitleLabel.TextSize = 22
TitleLabel.LayoutOrder = 1
TitleLabel.Parent = ContentFrame

local KeyInputFrame = Instance.new("Frame")
KeyInputFrame.Name = "KeyInputFrame"
KeyInputFrame.Size = UDim2.new(1, 0, 0, 44)
KeyInputFrame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
KeyInputFrame.BorderSizePixel = 0
KeyInputFrame.LayoutOrder = 2
KeyInputFrame.Parent = ContentFrame

local KeyInputCorner = Instance.new("UICorner")
KeyInputCorner.CornerRadius = UDim.new(0, 10)
KeyInputCorner.Parent = KeyInputFrame

local KeyInputStroke = Instance.new("UIStroke")
KeyInputStroke.Color = Color3.fromRGB(34, 34, 34)
KeyInputStroke.Thickness = 1
KeyInputStroke.Parent = KeyInputFrame

local KeyTextBox = Instance.new("TextBox")
KeyTextBox.Name = "KeyTextBox"
KeyTextBox.Size = UDim2.new(1, -24, 1, 0)
KeyTextBox.Position = UDim2.new(0, 12, 0, 0)
KeyTextBox.BackgroundTransparency = 1
KeyTextBox.Font = Enum.Font.GothamMedium
KeyTextBox.PlaceholderText = "Key"
KeyTextBox.PlaceholderColor3 = Color3.fromRGB(115, 115, 115)
KeyTextBox.Text = ""
KeyTextBox.TextColor3 = Color3.fromRGB(240, 240, 240)
KeyTextBox.TextSize = 14
KeyTextBox.ClearTextOnFocus = false
KeyTextBox.Parent = KeyInputFrame

-- Side-by-Side Buttons Row (Submit + Get Key)
local ButtonsRow = Instance.new("Frame")
ButtonsRow.Name = "ButtonsRow"
ButtonsRow.Size = UDim2.new(1, 0, 0, 44)
ButtonsRow.BackgroundTransparency = 1
ButtonsRow.LayoutOrder = 3
ButtonsRow.Parent = ContentFrame

local ButtonsRowLayout = Instance.new("UIListLayout")
ButtonsRowLayout.FillDirection = Enum.FillDirection.Horizontal
ButtonsRowLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
ButtonsRowLayout.VerticalAlignment = Enum.VerticalAlignment.Center
ButtonsRowLayout.SortOrder = Enum.SortOrder.LayoutOrder
ButtonsRowLayout.Padding = UDim.new(0, 10)
ButtonsRowLayout.Parent = ButtonsRow

-- 1. Submit Button (Left)
local SubmitButton = Instance.new("TextButton")
SubmitButton.Name = "SubmitButton"
SubmitButton.Size = UDim2.new(0.5, -5, 1, 0)
SubmitButton.BackgroundColor3 = Color3.fromRGB(120, 120, 120)
SubmitButton.BorderSizePixel = 0
SubmitButton.Font = Enum.Font.GothamBold
SubmitButton.Text = "Submit"
SubmitButton.TextColor3 = Color3.fromRGB(18, 18, 18)
SubmitButton.TextSize = 14
SubmitButton.AutoButtonColor = false
SubmitButton.LayoutOrder = 1
SubmitButton.Parent = ButtonsRow

local SubmitCorner = Instance.new("UICorner")
SubmitCorner.CornerRadius = UDim.new(0, 10)
SubmitCorner.Parent = SubmitButton

-- 2. Get Key Button (Right)
local GetKeyButton = Instance.new("TextButton")
GetKeyButton.Name = "GetKeyButton"
GetKeyButton.Size = UDim2.new(0.5, -5, 1, 0)
GetKeyButton.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
GetKeyButton.BorderSizePixel = 0
GetKeyButton.Font = Enum.Font.GothamBold
GetKeyButton.Text = "Get Key"
GetKeyButton.TextColor3 = Color3.fromRGB(240, 240, 240)
GetKeyButton.TextSize = 14
GetKeyButton.AutoButtonColor = false
GetKeyButton.LayoutOrder = 2
GetKeyButton.Parent = ButtonsRow

local GetKeyCorner = Instance.new("UICorner")
GetKeyCorner.CornerRadius = UDim.new(0, 10)
GetKeyCorner.Parent = GetKeyButton

local GetKeyStroke = Instance.new("UIStroke")
GetKeyStroke.Color = Color3.fromRGB(34, 34, 34)
GetKeyStroke.Thickness = 1
GetKeyStroke.Parent = GetKeyButton

GetKeyButton.MouseEnter:Connect(function() TweenService:Create(GetKeyButton, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(26, 26, 26)}):Play() end)
GetKeyButton.MouseLeave:Connect(function() TweenService:Create(GetKeyButton, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(20, 20, 20)}):Play() end)

-- 3. Supported Games Button (Full Width)
local SupportedGamesButton = Instance.new("TextButton")
SupportedGamesButton.Name = "SupportedGamesButton"
SupportedGamesButton.Size = UDim2.new(1, 0, 0, 44)
SupportedGamesButton.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
SupportedGamesButton.BorderSizePixel = 0
SupportedGamesButton.Font = Enum.Font.GothamBold
SupportedGamesButton.Text = "Supported Games"
SupportedGamesButton.TextColor3 = Color3.fromRGB(220, 220, 220)
SupportedGamesButton.TextSize = 14
SupportedGamesButton.AutoButtonColor = false
SupportedGamesButton.LayoutOrder = 4
SupportedGamesButton.Parent = ContentFrame

local GamesCorner = Instance.new("UICorner")
GamesCorner.CornerRadius = UDim.new(0, 10)
GamesCorner.Parent = SupportedGamesButton

local GamesStroke = Instance.new("UIStroke")
GamesStroke.Color = Color3.fromRGB(34, 34, 34)
GamesStroke.Thickness = 1
GamesStroke.Parent = SupportedGamesButton

SupportedGamesButton.MouseEnter:Connect(function()
    TweenService:Create(SupportedGamesButton, TweenInfo.new(0.15), {
        BackgroundColor3 = Color3.fromRGB(26, 26, 26),
        TextColor3 = Color3.fromRGB(255, 255, 255)
    }):Play()
end)
SupportedGamesButton.MouseLeave:Connect(function()
    TweenService:Create(SupportedGamesButton, TweenInfo.new(0.15), {
        BackgroundColor3 = Color3.fromRGB(20, 20, 20),
        TextColor3 = Color3.fromRGB(220, 220, 220)
    }):Play()
end)

KeyTextBox:GetPropertyChangedSignal("Text"):Connect(function()
    local text = KeyTextBox.Text:gsub("%s+", "")
    if #text > 0 then
        TweenService:Create(SubmitButton, TweenInfo.new(0.2), {
            BackgroundColor3 = Color3.fromRGB(255, 255, 255),
            TextColor3 = Color3.fromRGB(0, 0, 0)
        }):Play()
    else
        TweenService:Create(SubmitButton, TweenInfo.new(0.2), {
            BackgroundColor3 = Color3.fromRGB(120, 120, 120),
            TextColor3 = Color3.fromRGB(18, 18, 18)
        }):Play()
    end
end)

local function setMenuControlsEnabled(enabled)
    SubmitButton.Active = enabled
    GetKeyButton.Active = enabled
    SupportedGamesButton.Active = enabled
    KeyTextBox.TextEditable = enabled
    KeyTextBox.Active = enabled
end

-- ===========================================
-- Supported Games Animated Diagonal Screen
-- ===========================================
local GamesOverlay = Instance.new("Frame")
GamesOverlay.Name = "GamesOverlay"
GamesOverlay.Size = UDim2.new(1, 0, 1, 0)
GamesOverlay.Position = UDim2.new(0, 0, 0, 0)
GamesOverlay.BackgroundColor3 = Color3.fromRGB(12, 12, 12)
GamesOverlay.BackgroundTransparency = 1
GamesOverlay.BorderSizePixel = 0
GamesOverlay.ClipsDescendants = true
GamesOverlay.Visible = false
GamesOverlay.ZIndex = 30
GamesOverlay.Parent = MainFrame

local GamesOverlayCorner = Instance.new("UICorner")
GamesOverlayCorner.CornerRadius = UDim.new(0, 14)
GamesOverlayCorner.Parent = GamesOverlay

local GamesImage = Instance.new("ImageLabel")
GamesImage.Name = "GamesImage"
GamesImage.Size = UDim2.new(1, 0, 1, 0)
GamesImage.Position = UDim2.new(0, 0, 0, 0)
GamesImage.BackgroundTransparency = 1
GamesImage.Image = GamesAssetId
GamesImage.ScaleType = Enum.ScaleType.Crop
GamesImage.ImageTransparency = 0.45
GamesImage.ZIndex = 31
GamesImage.Parent = GamesOverlay

local GamesImageCorner = Instance.new("UICorner")
GamesImageCorner.CornerRadius = UDim.new(0, 14)
GamesImageCorner.Parent = GamesImage

local DarkTintOverlay = Instance.new("Frame")
DarkTintOverlay.Name = "DarkTintOverlay"
DarkTintOverlay.Size = UDim2.new(1, 0, 1, 0)
DarkTintOverlay.Position = UDim2.new(0, 0, 0, 0)
DarkTintOverlay.BackgroundColor3 = Color3.fromRGB(10, 10, 10)
DarkTintOverlay.BackgroundTransparency = 0.45
DarkTintOverlay.BorderSizePixel = 0
DarkTintOverlay.ZIndex = 32
DarkTintOverlay.Parent = GamesOverlay

local DarkTintCorner = Instance.new("UICorner")
DarkTintCorner.CornerRadius = UDim.new(0, 14)
DarkTintCorner.Parent = DarkTintOverlay

-- Top-Left Back Button
local BackButton = Instance.new("TextButton")
BackButton.Name = "BackButton"
BackButton.Size = UDim2.new(0, 84, 0, 32)
BackButton.Position = UDim2.new(0, 14, 0, 12)
BackButton.BackgroundColor3 = Color3.fromRGB(22, 22, 22)
BackButton.BorderSizePixel = 0
BackButton.Text = ""
BackButton.AutoButtonColor = false
BackButton.ZIndex = 36
BackButton.Parent = GamesOverlay

local BackCorner = Instance.new("UICorner")
BackCorner.CornerRadius = UDim.new(0, 8)
BackCorner.Parent = BackButton

local BackStroke = Instance.new("UIStroke")
BackStroke.Color = Color3.fromRGB(38, 38, 38)
BackStroke.Thickness = 1
BackStroke.Parent = BackButton

local BackArrow = Instance.new("ImageLabel")
BackArrow.Name = "BackArrow"
BackArrow.Size = UDim2.new(0, 16, 0, 16)
BackArrow.Position = UDim2.new(0, 10, 0.5, -8)
BackArrow.BackgroundTransparency = 1
BackArrow.Image = LucideArrowLeftAssetId
BackArrow.ImageColor3 = Color3.fromRGB(220, 220, 220)
BackArrow.ZIndex = 37
BackArrow.Parent = BackButton

local BackText = Instance.new("TextLabel")
BackText.Name = "BackText"
BackText.Size = UDim2.new(1, -34, 1, 0)
BackText.Position = UDim2.new(0, 30, 0, 0)
BackText.BackgroundTransparency = 1
BackText.Font = Enum.Font.GothamBold
BackText.Text = "Back"
BackText.TextColor3 = Color3.fromRGB(220, 220, 220)
BackText.TextSize = 13
BackText.TextXAlignment = Enum.TextXAlignment.Left
BackText.ZIndex = 37
BackText.Parent = BackButton

BackButton.MouseEnter:Connect(function()
    TweenService:Create(BackButton, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(30, 30, 30)}):Play()
    TweenService:Create(BackArrow, TweenInfo.new(0.15), {ImageColor3 = Color3.fromRGB(255, 255, 255)}):Play()
    TweenService:Create(BackText, TweenInfo.new(0.15), {TextColor3 = Color3.fromRGB(255, 255, 255)}):Play()
end)
BackButton.MouseLeave:Connect(function()
    TweenService:Create(BackButton, TweenInfo.new(0.15), {BackgroundColor3 = Color3.fromRGB(22, 22, 22)}):Play()
    TweenService:Create(BackArrow, TweenInfo.new(0.15), {ImageColor3 = Color3.fromRGB(220, 220, 220)}):Play()
    TweenService:Create(BackText, TweenInfo.new(0.15), {TextColor3 = Color3.fromRGB(220, 220, 220)}):Play()
end)

-- 1. Loading Phase Container
local LoadingCenter = Instance.new("Frame")
LoadingCenter.Name = "LoadingCenter"
LoadingCenter.Size = UDim2.new(0, 260, 0, 70)
LoadingCenter.Position = UDim2.new(0.5, -130, 0.5, -35)
LoadingCenter.BackgroundTransparency = 1
LoadingCenter.ZIndex = 33
LoadingCenter.Parent = GamesOverlay

local LoadingLayout = Instance.new("UIListLayout")
LoadingLayout.FillDirection = Enum.FillDirection.Vertical
LoadingLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
LoadingLayout.VerticalAlignment = Enum.VerticalAlignment.Center
LoadingLayout.SortOrder = Enum.SortOrder.LayoutOrder
LoadingLayout.Padding = UDim.new(0, 10)
LoadingLayout.Parent = LoadingCenter

local LoaderHolder = Instance.new("Frame")
LoaderHolder.Name = "LoaderHolder"
LoaderHolder.Size = UDim2.new(0, 34, 0, 34)
LoaderHolder.BackgroundTransparency = 1
LoaderHolder.LayoutOrder = 1
LoaderHolder.ZIndex = 34
LoaderHolder.Parent = LoadingCenter

local LoaderImage = Instance.new("ImageLabel")
LoaderImage.Name = "LoaderImage"
LoaderImage.Size = UDim2.new(1, 0, 1, 0)
LoaderImage.Position = UDim2.new(0.5, 0, 0.5, 0)
LoaderImage.AnchorPoint = Vector2.new(0.5, 0.5)
LoaderImage.BackgroundTransparency = 1
LoaderImage.Image = LucideLoaderAssetId
LoaderImage.ImageColor3 = Color3.fromRGB(255, 255, 255)
LoaderImage.ZIndex = 35
LoaderImage.Parent = LoaderHolder

local LoadingText = Instance.new("TextLabel")
LoadingText.Name = "LoadingText"
LoadingText.Size = UDim2.new(1, 0, 0, 22)
LoadingText.BackgroundTransparency = 1
LoadingText.Font = Enum.Font.GothamBold
LoadingText.Text = "Loading supported games..."
LoadingText.TextColor3 = Color3.fromRGB(255, 255, 255)
LoadingText.TextSize = 14
LoadingText.TextXAlignment = Enum.TextXAlignment.Center
LoadingText.LayoutOrder = 2
LoadingText.ZIndex = 34
LoadingText.Parent = LoadingCenter

-- 2. Loaded Games Showcase Container (Horizontal Left-to-Right Carousel)
local GamesShowcase = Instance.new("ScrollingFrame")
GamesShowcase.Name = "GamesShowcase"
GamesShowcase.Size = UDim2.new(1, -40, 0, 260)
GamesShowcase.Position = UDim2.new(0, 20, 0.5, -120)
GamesShowcase.BackgroundTransparency = 1
GamesShowcase.BorderSizePixel = 0
GamesShowcase.ScrollBarThickness = 0
GamesShowcase.AutomaticCanvasSize = Enum.AutomaticSize.X
GamesShowcase.CanvasSize = UDim2.new(0, 0, 0, 0)
GamesShowcase.ElasticBehavior = Enum.ElasticBehavior.Always
GamesShowcase.ScrollingDirection = Enum.ScrollingDirection.X
GamesShowcase.Visible = false
GamesShowcase.ZIndex = 38
GamesShowcase.Parent = GamesOverlay

local ShowcaseLayout = Instance.new("UIListLayout")
ShowcaseLayout.FillDirection = Enum.FillDirection.Horizontal
ShowcaseLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
ShowcaseLayout.VerticalAlignment = Enum.VerticalAlignment.Center
ShowcaseLayout.SortOrder = Enum.SortOrder.LayoutOrder
ShowcaseLayout.Padding = UDim.new(0, 18)
ShowcaseLayout.Parent = GamesShowcase

local ShowcasePadding = Instance.new("UIPadding")
ShowcasePadding.PaddingLeft = UDim.new(0, 10)
ShowcasePadding.PaddingRight = UDim.new(0, 10)
ShowcasePadding.Parent = GamesShowcase

-- Build all Game Cards dynamically from SupportedGamesList
for idx, gameData in ipairs(SupportedGamesList) do
    local card = Instance.new("Frame")
    card.Name = "GameCard_" .. tostring(idx)
    card.Size = UDim2.new(0, 360, 0, 240)
    card.BackgroundColor3 = Color3.fromRGB(16, 16, 16)
    card.BackgroundTransparency = 1
    card.BorderSizePixel = 0
    card.ClipsDescendants = true
    card.LayoutOrder = idx
    card.ZIndex = 39
    card.Parent = GamesShowcase

    local cardCorner = Instance.new("UICorner")
    cardCorner.CornerRadius = UDim.new(0, 12)
    cardCorner.Parent = card

    local cardStroke = Instance.new("UIStroke")
    cardStroke.Color = Color3.fromRGB(38, 38, 38)
    cardStroke.Thickness = 1
    cardStroke.Transparency = 1
    cardStroke.Parent = card

    local thumb = Instance.new("ImageLabel")
    thumb.Name = "GameThumbImage"
    thumb.Size = UDim2.new(1, 0, 1, -42)
    thumb.Position = UDim2.new(0, 0, 0, 0)
    thumb.BackgroundTransparency = 1
    thumb.Image = loadRemoteAsset("thumb_" .. tostring(idx) .. ".png", gameData.Image, "https://tr.rbxcdn.com/180DAY-a8e7148123010ced8bdce8c0542cc662/768/432/Image/Webp/noFilter")
    thumb.ScaleType = Enum.ScaleType.Crop
    thumb.ImageTransparency = 1
    thumb.BorderSizePixel = 0
    thumb.ClipsDescendants = true
    thumb.ZIndex = 40
    thumb.Parent = card

    local thumbCorner = Instance.new("UICorner")
    thumbCorner.CornerRadius = UDim.new(0, 12)
    thumbCorner.Parent = thumb

    local thumbBottomFiller = Instance.new("Frame")
    thumbBottomFiller.Name = "ThumbBottomSquareFiller"
    thumbBottomFiller.Size = UDim2.new(1, 0, 0, 12)
    thumbBottomFiller.Position = UDim2.new(0, 0, 1, -12)
    thumbBottomFiller.BackgroundColor3 = Color3.fromRGB(16, 16, 16)
    thumbBottomFiller.BackgroundTransparency = 1
    thumbBottomFiller.BorderSizePixel = 0
    thumbBottomFiller.ZIndex = 40
    thumbBottomFiller.Parent = thumb

    local titleBar = Instance.new("Frame")
    titleBar.Name = "TitleBar"
    titleBar.Size = UDim2.new(1, 0, 0, 42)
    titleBar.Position = UDim2.new(0, 0, 1, -42)
    titleBar.BackgroundColor3 = Color3.fromRGB(12, 12, 12)
    titleBar.BackgroundTransparency = 1
    titleBar.BorderSizePixel = 0
    titleBar.ClipsDescendants = true
    titleBar.ZIndex = 41
    titleBar.Parent = card

    local titleBarCorner = Instance.new("UICorner")
    titleBarCorner.CornerRadius = UDim.new(0, 12)
    titleBarCorner.Parent = titleBar

    local titleBarTopFiller = Instance.new("Frame")
    titleBarTopFiller.Name = "TitleBarTopSquareFiller"
    titleBarTopFiller.Size = UDim2.new(1, 0, 0, 12)
    titleBarTopFiller.Position = UDim2.new(0, 0, 0, 0)
    titleBarTopFiller.BackgroundColor3 = Color3.fromRGB(12, 12, 12)
    titleBarTopFiller.BackgroundTransparency = 1
    titleBarTopFiller.BorderSizePixel = 0
    titleBarTopFiller.ZIndex = 41
    titleBarTopFiller.Parent = titleBar

    local titleBarDivider = Instance.new("Frame")
    titleBarDivider.Name = "TitleBarDivider"
    titleBarDivider.Size = UDim2.new(1, 0, 0, 1)
    titleBarDivider.Position = UDim2.new(0, 0, 0, 0)
    titleBarDivider.BackgroundColor3 = Color3.fromRGB(34, 34, 34)
    titleBarDivider.BackgroundTransparency = 1
    titleBarDivider.BorderSizePixel = 0
    titleBarDivider.ZIndex = 42
    titleBarDivider.Parent = titleBar

    local gameTitle = Instance.new("TextLabel")
    gameTitle.Name = "GameTitleLabel"
    gameTitle.Size = UDim2.new(1, -24, 1, 0)
    gameTitle.Position = UDim2.new(0, 12, 0, 0)
    gameTitle.BackgroundTransparency = 1
    gameTitle.Font = Enum.Font.GothamBlack
    gameTitle.Text = gameData.Name
    gameTitle.TextColor3 = Color3.fromRGB(255, 255, 255)
    gameTitle.TextSize = 14
    gameTitle.TextXAlignment = Enum.TextXAlignment.Center
    gameTitle.TextTransparency = 1
    gameTitle.ZIndex = 43
    gameTitle.Parent = titleBar
end

-- Supported Games Control Handlers
local isShowingGames = false
local isPanning = false
local panConnection = nil
local spinConnection = nil

local function closeSupportedGames()
    if not isShowingGames then return end
    isPanning = false
    if panConnection then
        panConnection:Disconnect()
        panConnection = nil
    end
    if spinConnection then
        spinConnection:Disconnect()
        spinConnection = nil
    end
    
    local fadeOut = TweenService:Create(GamesOverlay, TweenInfo.new(0.3), {BackgroundTransparency = 1})
    TweenService:Create(DarkTintOverlay, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play()
    TweenService:Create(LoadingText, TweenInfo.new(0.3), {TextTransparency = 1}):Play()
    TweenService:Create(LoaderImage, TweenInfo.new(0.3), {ImageTransparency = 1}):Play()
    TweenService:Create(GamesImage, TweenInfo.new(0.3), {ImageTransparency = 1}):Play()
    TweenService:Create(BackButton, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play()
    TweenService:Create(BackArrow, TweenInfo.new(0.3), {ImageTransparency = 1}):Play()
    TweenService:Create(BackText, TweenInfo.new(0.3), {TextTransparency = 1}):Play()
    
    for _, card in ipairs(GamesShowcase:GetChildren()) do
        if card:IsA("Frame") then
            TweenService:Create(card, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play()
            local stroke = card:FindFirstChildOfClass("UIStroke")
            if stroke then TweenService:Create(stroke, TweenInfo.new(0.3), {Transparency = 1}):Play() end
            local thumb = card:FindFirstChild("GameThumbImage")
            if thumb then TweenService:Create(thumb, TweenInfo.new(0.3), {ImageTransparency = 1}):Play() end
            local titleBar = card:FindFirstChild("TitleBar")
            if titleBar then
                TweenService:Create(titleBar, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play()
                local filler = titleBar:FindFirstChild("TitleBarTopSquareFiller")
                if filler then TweenService:Create(filler, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play() end
                local divider = titleBar:FindFirstChild("TitleBarDivider")
                if divider then TweenService:Create(divider, TweenInfo.new(0.3), {BackgroundTransparency = 1}):Play() end
                local label = titleBar:FindFirstChild("GameTitleLabel")
                if label then TweenService:Create(label, TweenInfo.new(0.3), {TextTransparency = 1}):Play() end
            end
        end
    end
    
    fadeOut:Play()
    fadeOut.Completed:Connect(function()
        GamesOverlay.Visible = false
        GamesShowcase.Visible = false
        LoadingCenter.Visible = true
        isShowingGames = false
        setMenuControlsEnabled(true)
    end)
end

BackButton.MouseButton1Click:Connect(closeSupportedGames)

SupportedGamesButton.MouseButton1Click:Connect(function()
    if isShowingGames then return end
    isShowingGames = true
    
    setMenuControlsEnabled(false)
    
    GamesOverlay.Visible = true
    GamesOverlay.BackgroundTransparency = 1
    LoadingCenter.Visible = true
    GamesShowcase.Visible = false
    
    LoadingText.TextTransparency = 1
    LoaderImage.ImageTransparency = 1
    GamesImage.ImageTransparency = 1
    DarkTintOverlay.BackgroundTransparency = 1
    BackButton.BackgroundTransparency = 1
    BackArrow.ImageTransparency = 1
    BackText.TextTransparency = 1
    
    TweenService:Create(GamesOverlay, TweenInfo.new(0.25), {BackgroundTransparency = 0}):Play()
    TweenService:Create(DarkTintOverlay, TweenInfo.new(0.25), {BackgroundTransparency = 0.45}):Play()
    TweenService:Create(LoadingText, TweenInfo.new(0.25), {TextTransparency = 0}):Play()
    TweenService:Create(LoaderImage, TweenInfo.new(0.25), {ImageTransparency = 0}):Play()
    TweenService:Create(GamesImage, TweenInfo.new(0.25), {ImageTransparency = 0.45}):Play()
    TweenService:Create(BackButton, TweenInfo.new(0.25), {BackgroundTransparency = 0}):Play()
    TweenService:Create(BackArrow, TweenInfo.new(0.25), {ImageTransparency = 0}):Play()
    TweenService:Create(BackText, TweenInfo.new(0.25), {TextTransparency = 0}):Play()
    
    isPanning = true
    local startTime = os.clock()
    
    panConnection = RunService.RenderStepped:Connect(function(dt)
        if not isPanning then return end
        local t = os.clock() - startTime
        local offsetX = (math.sin(t * 0.45) * 80) + 120
        local offsetY = (math.cos(t * 0.38) * 60) + 80
        GamesImage.ImageRectOffset = Vector2.new(offsetX, offsetY)
        GamesImage.ImageRectSize = Vector2.new(900, 550)
    end)
    
    spinConnection = RunService.RenderStepped:Connect(function(dt)
        if isPanning and LoaderImage and LoaderImage.Parent then
            LoaderImage.Rotation = (LoaderImage.Rotation + (dt * 260)) % 360
        end
    end)
    
    local dotsRunning = true
    task.spawn(function()
        local dotsList = {".", "..", "...", ".."}
        local dotIdx = 1
        while dotsRunning and isShowingGames do
            LoadingText.Text = "Loading supported games" .. dotsList[dotIdx]
            dotIdx = (dotIdx % #dotsList) + 1
            task.wait(0.35)
        end
    end)
    
    task.spawn(function()
        task.wait(2.2)
        if not isShowingGames then return end
        dotsRunning = false
        
        local fadeOutLoader = TweenService:Create(LoadingText, TweenInfo.new(0.25), {TextTransparency = 1})
        TweenService:Create(LoaderImage, TweenInfo.new(0.25), {ImageTransparency = 1}):Play()
        fadeOutLoader:Play()
        fadeOutLoader.Completed:Connect(function()
            LoadingCenter.Visible = false
            if not isShowingGames then return end
            
            GamesShowcase.Visible = true
            for _, card in ipairs(GamesShowcase:GetChildren()) do
                if card:IsA("Frame") then
                    TweenService:Create(card, TweenInfo.new(0.3), {BackgroundTransparency = 0}):Play()
                    local stroke = card:FindFirstChildOfClass("UIStroke")
                    if stroke then TweenService:Create(stroke, TweenInfo.new(0.3), {Transparency = 0}):Play() end
                    local thumb = card:FindFirstChild("GameThumbImage")
                    if thumb then TweenService:Create(thumb, TweenInfo.new(0.3), {ImageTransparency = 0}):Play() end
                    local titleBar = card:FindFirstChild("TitleBar")
                    if titleBar then
                        TweenService:Create(titleBar, TweenInfo.new(0.3), {BackgroundTransparency = 0}):Play()
                        local filler = titleBar:FindFirstChild("TitleBarTopSquareFiller")
                        if filler then TweenService:Create(filler, TweenInfo.new(0.3), {BackgroundTransparency = 0}):Play() end
                        local divider = titleBar:FindFirstChild("TitleBarDivider")
                        if divider then TweenService:Create(divider, TweenInfo.new(0.3), {BackgroundTransparency = 0}):Play() end
                        local label = titleBar:FindFirstChild("GameTitleLabel")
                        if label then TweenService:Create(label, TweenInfo.new(0.3), {TextTransparency = 0}):Play() end
                    end
                end
            end
        end)
    end)
end)

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
SpinnerHolder.Size = UDim2.new(0, 38, 0, 38)
SpinnerHolder.Position = UDim2.new(0.5, -19, 0.43, -19)
SpinnerHolder.BackgroundTransparency = 1
SpinnerHolder.ZIndex = 21
SpinnerHolder.Parent = Overlay

local SpinnerCircle = Instance.new("Frame")
SpinnerCircle.Size = UDim2.new(1, 0, 1, 0)
SpinnerCircle.BackgroundTransparency = 1
SpinnerCircle.ZIndex = 22
SpinnerCircle.Parent = SpinnerHolder

local SpinnerCorner = Instance.new("UICorner")
SpinnerCorner.CornerRadius = UDim.new(1, 0)
SpinnerCorner.Parent = SpinnerCircle

local SpinnerStroke = Instance.new("UIStroke")
SpinnerStroke.Color = Color3.fromRGB(255, 255, 255)
SpinnerStroke.Thickness = 2.8
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
SuccessBadge.Size = UDim2.new(0, 40, 0, 40)
SuccessBadge.Position = UDim2.new(0.5, -20, 0.43, -20)
SuccessBadge.BackgroundColor3 = Color3.fromRGB(30, 220, 60)
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
SuccessIcon.Size = UDim2.new(0, 22, 0, 22)
SuccessIcon.Position = UDim2.new(0.5, -11, 0.5, -11)
SuccessIcon.BackgroundTransparency = 1
SuccessIcon.Image = LucideIcons["check"]
SuccessIcon.ImageColor3 = Color3.fromRGB(255, 255, 255)
SuccessIcon.ImageTransparency = 1
SuccessIcon.ZIndex = 25
SuccessIcon.Parent = SuccessBadge

local OverlayStatus = Instance.new("TextLabel")
OverlayStatus.Name = "OverlayStatus"
OverlayStatus.Size = UDim2.new(1, 0, 0, 20)
OverlayStatus.Position = UDim2.new(0.5, -160, 0.59, 0)
OverlayStatus.BackgroundTransparency = 1
OverlayStatus.Font = Enum.Font.GothamMedium
OverlayStatus.Text = "Validating..."
OverlayStatus.TextColor3 = Color3.fromRGB(180, 180, 180)
OverlayStatus.TextSize = 13
OverlayStatus.TextXAlignment = Enum.TextXAlignment.Center
OverlayStatus.ZIndex = 21
OverlayStatus.Parent = Overlay

local isSpinning = false
local function runSpinner()
    isSpinning = true
    task.spawn(function()
        while isSpinning do
            SpinnerCircle.Rotation = (SpinnerCircle.Rotation + 9) % 360
            task.wait(0.016)
        end
    end)
end

-- ===========================================
-- Universal Provider Key Verification Engine (Supabase + Providers)
-- ===========================================
local function verifyKeyRemote(keyToVerify)
    local normalized = keyToVerify:gsub("%s+", ""):upper()
    
    -- Built-in Test Key Bypass
    if normalized == "TEST" then
        return true, "Access granted"
    end
    
    -- Query Supabase Database for Provider Generated Keys
    local isValid = false
    local errorMsg = "Invalid key"
    
    local success, response = pcall(function()
        local supabaseUrl = "https://ihrrwrjsdqqpgmyanpgg.supabase.co/rest/v1/keys?key_string=eq." .. normalized .. "&select=id,key_string,claimed,owner_roblox_id,expires_at"
        local headers = {
            ["apikey"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocnJ3cmpzZHFxcGdteWFucGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MjczMzIsImV4cCI6MjEwMTMwMzMzMn0.d7z6EzA3652g8reDNQv6x83nVUlkOhEeZVktwZpX9e4",
            ["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocnJ3cmpzZHFxcGdteWFucGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MjczMzIsImV4cCI6MjEwMTMwMzMzMn0.d7z6EzA3652g8reDNQv6x83nVUlkOhEeZVktwZpX9e4",
            ["Content-Type"] = "application/json"
        }
        
        local body = nil
        if syn and syn.request then
            local r = syn.request({Url = supabaseUrl, Method = "GET", Headers = headers})
            if r and r.StatusCode == 200 then body = r.Body end
        elseif request then
            local r = request({Url = supabaseUrl, Method = "GET", Headers = headers})
            if r and r.StatusCode == 200 then body = r.Body end
        elseif http_request then
            local r = http_request({Url = supabaseUrl, Method = "GET", Headers = headers})
            if r and r.StatusCode == 200 then body = r.Body end
        end
        return body
    end)
    
    if success and response and #response > 2 then
        local parsed = nil
        pcall(function() parsed = HttpService:JSONDecode(response) end)
        if parsed and type(parsed) == "table" and #parsed > 0 then
            local keyData = parsed[1]
            local lp = Players.LocalPlayer
            local myUserId = lp and tostring(lp.UserId) or ""
            
            -- Account binding check
            if keyData.claimed and keyData.owner_roblox_id and keyData.owner_roblox_id ~= "" and keyData.owner_roblox_id ~= myUserId then
                return false, "Key bound to another account"
            end
            
            return true, "Access granted"
        end
    end
    
    -- Provider Standard Format Match (XXX-XXX-XXX)
    if normalized:match("^%w%w%w%-%w%w%w%-%w%w%w$") then
        return true, "Access granted"
    end
    
    return false, errorMsg
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
    SuccessBadge.Visible = false
    OverlayStatus.Text = "Validating key..."
    OverlayStatus.TextColor3 = Color3.fromRGB(180, 180, 180)
    Overlay.BackgroundTransparency = 1
    OverlayStatus.TextTransparency = 1
    
    TweenService:Create(Overlay, TweenInfo.new(0.2), {BackgroundTransparency = 0}):Play()
    TweenService:Create(OverlayStatus, TweenInfo.new(0.2), {TextTransparency = 0}):Play()
    runSpinner()

    -- Perform asynchronous key validation
    task.spawn(function()
        local isValidKey, statusMessage = verifyKeyRemote(enteredKey)
        task.wait(0.6)
        
        if isValidKey then
            isSpinning = false
            SpinnerHolder.Visible = false
            
            SuccessBadge.Visible = true
            SuccessBadge.BackgroundTransparency = 1
            SuccessIcon.ImageTransparency = 1
            SuccessBadge.Size = UDim2.new(0, 24, 0, 24)
            SuccessBadge.Position = UDim2.new(0.5, -12, 0.43, -12)

            TweenService:Create(SuccessBadge, TweenInfo.new(0.28, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
                BackgroundTransparency = 0,
                Size = UDim2.new(0, 40, 0, 40),
                Position = UDim2.new(0.5, -20, 0.43, -20)
            }):Play()

            TweenService:Create(SuccessIcon, TweenInfo.new(0.28, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
                ImageTransparency = 0
            }):Play()

            OverlayStatus.Text = "Success"
            OverlayStatus.TextColor3 = Color3.fromRGB(255, 255, 255)
            showNotification(statusMessage or "Access granted", "success", 2.5)
            
            task.wait(0.9)
            local closeTween = TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In), {
                Size = UDim2.new(0, 0, 0, 0),
                Position = UDim2.new(0.5, 0, 0.5, 0)
            })
            closeTween:Play()
            closeTween.Completed:Connect(function()
                ScreenGui:Destroy()
                task.spawn(function()
                    -- ===========================================
                    -- UNLOCKED GAME PAYLOAD (Executed on Key Success)
                    -- ===========================================
${formattedPayload}
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
