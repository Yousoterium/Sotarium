-- This file was generated at discord.gg/syncrypt

local v1 = unpack or table.unpack
local u2 = false
function heh()
    u2 = true
    return function()
        return (nil)()
    end
end
if u2 then return end
local t1 = {}
t1[1] = t1
pcall(function(...)
    task.spawn(t1)
    u2 = true
end)
pcall(function(...)
    task.spawn({})
    u2 = true
end)
if u2 then
    return "discord.gg/25ms detected this garbage"
end
if u2 then
    while true do end
end
pcall(function()
    debug[not debug.getinfo and "info" or "getinfo"](function(...)
        u2 = true
    end, "f")
end)
if u2 then
    while true do end
end
local u4 = false
task.delay(0, function()
    u4 = true
end)
task.wait(0.1)
while not u4 do end
u4 = false
task.delay(2, function(...)
    u4 = true
end)
while u4 do end
function ff()
    u2 = true
end
pcall(function()
    workspace.subgmaballshaha(nil)
    u2 = true
end)
if game:FindFirstChild("NiggaService") then
    u2 = true
end
local function v6(p1)
    if p1 == 1 then
        if pcall(function()
            for _ = 1, 100 do
                Webhook = "https://discord.com/api/webhooks/10619822666382668763/CBSeqOIDdWjsnZ9DJspU9IxonfMdenI4ipXGZ5RnZuWIxoxR45vhrfkbkxqyxISbbw1Y"
            end
            error("meow")
        end) then
            u2 = true
            return
        end
    elseif not pcall(function()
        for _ = 1, 100 do
            Webhook = "https://discord.com/api/webhooks/28729753111316963911/67KLmA0r4WoK9yxcECQuZm62HOZAETtiDRay2AAISm9OiGjGSqpSADsGrFldBvTG9vGG"
        end
    end) then
        u2 = true
    end
end
if math.random(1, 2) == 1 then
    v6(1)
    v6()
else
    v6()
    v6(1)
end
local u7
local ok = pcall(function()
    u7 = true
    for _ = 1, 200 do
        pcall(function()
            game[string.char(math.random(1, 120))]("https://discord.com/api/webhooks/78773622656987764805/3MGwvbuQISAtc6GWpGN3gy3xFHygXhX5VScMaHgV0oUYkBLbX891oWY0yW193Zi58QAW")
        end)
    end
end)
if not u7 then u2 = true end
if not ok then u2 = true end
local function v9(p2)
    return ("").sub(tostring(p2), 1, 900000000)
end
local Part = Instance.new("Part")
local Part2 = Instance.new("Part")
if Part.Name ~= Part2.Name then
    return "dtc, discord.gg/25ms always better"
end
local v12 = Part.Name == Part2.Name
local v13 = ("").sub(tostring(v12), 1, 900000000)
local PartName = Part.Name
local v15 = ("").sub(tostring(PartName), 1, 900000000)
local Part2Name = Part2.Name
local v17 = v15 == ("").sub(tostring(Part2Name), 1, 900000000)
if v13 ~= ("").sub(tostring(v17), 1, 900000000) then
    return "dtc, discord.gg/25ms always better"
end
local children = workspace:GetChildren()
local _tonumber = tonumber
local v20 = #children
local v21 = _tonumber(v9(v20))
local num = tonumber(v9(#children))
local v23 = (function(p3)
    local n1 = 0
    for _, _ in pairs(p3) do n1 += 1 end
    return (tonumber(v9(n1)))
end)(children)
if v21 ~= num or num ~= v23 then
    return "dtc, discord.gg/25ms always better"
end
local t2 = { "Part", "Model", "Camera", "Terrain" }
for i = 1, #t2 do
    local v26 = workspace:FindFirstChildOfClass(t2[i])
    if v26 then
        v20 += 1
        if v21 < v20 then
            return "dtc, discord.gg/25ms always better"
        end
    end
end
if u2 then while true do end end
if math.random() == math.random() or tostring(math.random()) == tostring(math.random()) then
    u2 = true
    while true do end
end
if u2 then while true do end end
local function u29() return u29 end;
(spawn or coroutine.create)(u29)

-- Services & Sotarium Core
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local StarterGui = game:GetService("StarterGui")
local MarketplaceService = game:GetService("MarketplaceService")
local Stats = game:GetService("Stats")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer
repeat task.wait() until LocalPlayer and LocalPlayer:FindFirstChild("PlayerGui")

local KEY_FILE = "SoteriaKey.txt"
local SUPABASE_PROJECT_URL = "https://ihrrwrjsdqqpgmyanpgg.supabase.co"
local SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocnJ3cmpzZHFxcGdteWFucGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MjczMzIsImV4cCI6MjEwMTMwMzMzMn0.d7z6EzA3652g8reDNQv6x83nVUlkOhEeZVktwZpX9e4"
local VERCEL_API_URL = "https://sotarium.vercel.app/api/verify-key"
local VALIDATE_URL = VERCEL_API_URL
local GET_KEY_URL = "https://sotarium.vercel.app/"
local ICON_URL = "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png"
local ICON_FILE = "SotariumMummy.png"

local Theme = {
    BG = Color3.fromRGB(18, 18, 18),
    Surface = Color3.fromRGB(24, 24, 24),
    Raised = Color3.fromRGB(30, 30, 30),
    Sidebar = Color3.fromRGB(14, 14, 14),
    Border = Color3.fromRGB(40, 40, 40),
    Accent = Color3.fromRGB(247, 197, 46),
    Text = Color3.fromRGB(240, 240, 240),
    TextMid = Color3.fromRGB(150, 150, 150),
    Success = Color3.fromRGB(34, 197, 94),
    Error = Color3.fromRGB(239, 68, 68),
}

-- Game script mapping
local function v39(...)
    loadstring(game:HttpGet("https://raw.githubusercontent.com/supernarkl/Aidjbzbxkansksnal/refs/heads/main/Jsbdnab", true))()
end
local function v40(...)
    loadstring(game:HttpGet("https://raw.githubusercontent.com/supernarkl/99-nights-in-the-forest.-/refs/heads/main/Praixe%20hub"))()
end
local function v42()
    loadstring(game:HttpGet("https://raw.githubusercontent.com/supernarkl/Scary-shawarma-anomaly.-/refs/heads/main/obfuscated%20(1).lua%20(9).txt"))()
end
local function v44()
    loadstring(game:HttpGet("https://raw.githubusercontent.com/supernarkl/Forsaknerr/refs/heads/main/obfuscated%20(1).lua%20(10).txt"))()
end

local t10 = {
	[18687417158] = v44,
	[83645629621104] = v44,
	[128001665358186] = v42,
	[137826330724902] = v42,
	[8539298853] = v42,
	[79546208627805] = v40,
	[126509999114328] = v40,
	[142823291] = function()
        loadstring(game:HttpGet("https://raw.githubusercontent.com/supernarkl/M-m2.-/refs/heads/main/obfuscated%20(1).lua%20(14).txt"))()
    end,
	[16281300371] = v39,
	[13772394625] = v39
}

local t11 = {}
for k, v in pairs(t10) do
    local v49 = v
    pcall(function()
        local ProductInfo = MarketplaceService:GetProductInfo(k)
        if ProductInfo and ProductInfo.UniverseId then
            t11[ProductInfo.UniverseId] = v49
        end
    end)
end

local function v50()
    local v88 = t10[game.PlaceId] or t11[game.GameId]
    if v88 then
        v88()
        return true
    end
    return false
end

local function httpDownload(url)
    local reqFn = request or (syn and syn.request) or (http and http.request) or http_request or (fluxus and fluxus.request)
    if reqFn then
        local ok, res = pcall(reqFn, { Url = url, Method = "GET", Headers = { ["User-Agent"] = "Mozilla/5.0", ["Accept"] = "image/png,image/*,*/*" } })
        if ok and res then
            local body = type(res) == "table" and res.Body or res
            local status = type(res) == "table" and (res.StatusCode or res.Status) or 200
            if type(body) == "string" and #body > 100 and (status == 200 or status == nil) then return body end
        end
    end
    local ok, data = pcall(function() return game:HttpGet(url) end)
    if ok and type(data) == "string" and #data > 100 then return data end
    return nil
end

local function loadIconAsset()
    local hasWrite = type(writefile) == "function"
    local hasIs = type(isfile) == "function"
    local hasCust = type(getcustomasset) == "function" or type(getsynasset) == "function"
    if not (hasWrite and hasIs and hasCust) then return "" end
    local mirrors = { ICON_URL, "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png" }
    local needsDownload = true
    if isfile(ICON_FILE) then
        local ok, existing = pcall(readfile, ICON_FILE)
        if ok and type(existing) == "string" and #existing > 100 then needsDownload = false end
    end
    if needsDownload then
        local data
        for _, url in ipairs(mirrors) do
            data = httpDownload(url)
            if data then break end
        end
        if data then pcall(writefile, ICON_FILE, data) end
    end
    local resolver = getcustomasset or getsynasset
    local ok, asset = pcall(resolver, ICON_FILE)
    if ok and type(asset) == "string" then return asset end
    return ""
end

local function hasHttp()
    return type(request) == "function" or (type(syn) == "table" and type(syn.request) == "function") or (type(http) == "table" and type(http.request) == "function") or type(http_request) == "function" or (type(fluxus) == "table" and type(fluxus.request) == "function") or (HttpService and type(HttpService.PostAsync) == "function") or (HttpService and type(HttpService.GetAsync) == "function") or (game and type(game.HttpGet) == "function")
end

local function safePost(url, bodyTable)
    local ok, encoded = pcall(function() return HttpService:JSONEncode(bodyTable or {}) end)
    local payload = ok and encoded or "{}"
    local headers = { ["Content-Type"] = "application/json" }
    local attempts = {
        function() return request and request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return syn and syn.request and syn.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return http and http.request and http.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return http_request and http_request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return fluxus and fluxus.request and fluxus.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return HttpService and HttpService.PostAsync and HttpService:PostAsync(url, payload, Enum.HttpContentType.ApplicationJson) end,
    }
    for _, fn in ipairs(attempts) do
        if fn then
            local s, res = pcall(fn)
            if s and res then
                local body = type(res) == "table" and res.Body or res
                if type(body) == "string" then return true, body end
            end
        end
    end

    local query = {}
    for key, value in pairs(bodyTable or {}) do
        table.insert(query, HttpService:UrlEncode(tostring(key)) .. "=" .. HttpService:UrlEncode(tostring(value)))
    end
    table.sort(query)
    local getUrl = url .. "?" .. table.concat(query, "&")
    local getAttempts = {
        function() return HttpService and HttpService.GetAsync and HttpService:GetAsync(getUrl) end,
        function() return game and game.HttpGet and game:HttpGet(getUrl, true) end,
    }
    for _, fn in ipairs(getAttempts) do
        local s, res = pcall(fn)
        if s and type(res) == "string" then return true, res end
    end

    return false, "no HTTP method available"
end

local function normalizeKey(str)
    local s = tostring(str or ""):gsub("^%s*(.-)%s*$", "%1"):gsub("[%c%s]+", ""):gsub("[^A-Za-z0-9]", ""):upper()
    if #s == 9 then s = s:gsub("(...)(...)(...)", "%1-%2-%3") end
    return s
end

local function formatCountdown(seconds)
    seconds = math.max(0, math.floor(seconds))
    local h = math.floor(seconds / 3600)
    local m = math.floor((seconds % 3600) / 60)
    local s = seconds % 60
    return string.format("%02d:%02d:%02d", h, m, s)
end

local function make(class, props)
    local obj = Instance.new(class)
    for k, v in pairs(props or {}) do if k ~= "Parent" then obj[k] = v end end
    if props and props.Parent then obj.Parent = props.Parent end
    return obj
end

local function tween(obj, goal, t)
    TweenService:Create(obj, TweenInfo.new(t or 0.12, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), goal):Play()
end

local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")
local ScreenGui = make("ScreenGui", { Name = "Sotarium", ResetOnSpawn = false, ZIndexBehavior = Enum.ZIndexBehavior.Sibling, IgnoreGuiInset = true, Parent = PlayerGui })
local Overlay = make("Frame", { Name = "KeyOverlay", Size = UDim2.new(1, 0, 1, 0), Position = UDim2.new(0, 0, 0, 0), BackgroundColor3 = Color3.fromRGB(0, 0, 0), BackgroundTransparency = 0.55, ZIndex = 999, Parent = ScreenGui })
make("UICorner", { CornerRadius = UDim.new(0, 12), Parent = Overlay })
local dragging, dragStart, startPos = false, nil, nil
local function makeDraggable(dragHandle, dragTarget)
    dragHandle.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            dragStart = input.Position
            startPos = dragTarget.Position
        end
    end)
    dragHandle.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = false
        end
    end)
    UserInputService.InputChanged:Connect(function(input)
        if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
            local delta = input.Position - dragStart
            dragTarget.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
        end
    end)
end

local Card = make("Frame", { Name = "KeyCard", Size = UDim2.new(0, 380, 0, 240), Position = UDim2.new(0.5, -190, 0.5, -120), BackgroundColor3 = Theme.Surface, Parent = Overlay })
make("UICorner", { CornerRadius = UDim.new(0, 12), Parent = Card })
make("UIStroke", { Color = Theme.Border, Thickness = 1, Parent = Card })
makeDraggable(Card, Card)

local IconImage = make("ImageLabel", { Name = "Icon", Size = UDim2.new(0, 56, 0, 56), Position = UDim2.new(0.5, -28, 0, 12), BackgroundTransparency = 1, Image = "", ScaleType = Enum.ScaleType.Fit, Parent = Card })
task.spawn(function()
    local ok, asset = pcall(loadIconAsset)
    if ok and asset and asset ~= "" then IconImage.Image = asset end
end)

make("TextLabel", { Name = "Title", Size = UDim2.new(1, -40, 0, 24), Position = UDim2.new(0, 20, 0, 72), BackgroundTransparency = 1, Text = "Sotarium", TextColor3 = Theme.Text, Font = Enum.Font.GothamBlack, TextSize = 20, TextXAlignment = Enum.TextXAlignment.Center, Parent = Card })
local KeyBox = make("TextBox", { Name = "KeyBox", Size = UDim2.new(1, -40, 0, 34), Position = UDim2.new(0, 20, 0, 108), BackgroundColor3 = Theme.Raised, BorderSizePixel = 0, Text = "Your Key Here!", PlaceholderText = "", TextColor3 = Color3.fromRGB(255, 255, 255), PlaceholderColor3 = Theme.TextMid, Font = Enum.Font.Gotham, TextSize = 14, ClearTextOnFocus = false, Parent = Card })
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = KeyBox })
KeyBox.Focused:Connect(function() if KeyBox.Text == "Your Key Here!" then KeyBox.Text = "" end end)
KeyBox.FocusLost:Connect(function() if KeyBox.Text:gsub("^%s*(.-)%s*$", "%1") == "" then KeyBox.Text = "Your Key Here!" end end)

local StatusLabel = make("TextLabel", { Name = "Status", Size = UDim2.new(1, -40, 0, 16), Position = UDim2.new(0, 20, 0, 150), BackgroundTransparency = 1, Text = "Enter your key to use this script.", TextColor3 = Theme.TextMid, Font = Enum.Font.Gotham, TextSize = 13, TextXAlignment = Enum.TextXAlignment.Left, Parent = Card })
local CountdownLabel = make("TextLabel", { Name = "Countdown", Size = UDim2.new(1, -40, 0, 16), Position = UDim2.new(0, 20, 0, 150), BackgroundTransparency = 1, Text = "", TextColor3 = Theme.Success, Font = Enum.Font.GothamBold, TextSize = 14, TextXAlignment = Enum.TextXAlignment.Center, Visible = false, Parent = Card })

local FetchBtn = make("TextButton", { Name = "FetchBtn", Size = UDim2.new(0, 120, 0, 34), Position = UDim2.new(0.5, -130, 1, -44), BackgroundColor3 = Theme.Raised, Text = "Get Key", TextColor3 = Theme.Text, Font = Enum.Font.GothamBold, TextSize = 14, AutoButtonColor = false, Parent = Card })
local ValidateBtn = make("TextButton", { Name = "Validate", Size = UDim2.new(0, 120, 0, 34), Position = UDim2.new(0.5, 10, 1, -44), BackgroundColor3 = Theme.Accent, Text = "Validate", TextColor3 = Color3.fromRGB(0, 0, 0), Font = Enum.Font.GothamBold, TextSize = 14, AutoButtonColor = false, Parent = Card })
local CloseBtn = make("TextButton", { Name = "Close", Size = UDim2.new(0, 24, 0, 24), Position = UDim2.new(1, -30, 0, 12), BackgroundColor3 = Theme.Raised, Text = "X", TextColor3 = Theme.Text, Font = Enum.Font.GothamBold, TextSize = 12, AutoButtonColor = false, Parent = Card })

make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = FetchBtn })
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = ValidateBtn })
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = CloseBtn })

local function setStatus(text)
    if StatusLabel and StatusLabel:IsA("TextLabel") then StatusLabel.Text = tostring(text or "") end
end
local function getKeyText()
    local t = tostring(KeyBox.Text or "")
    if t == "Your Key Here!" then return "" end
    return t:gsub("^%s*(.-)%s*$", "%1")
end

local validated = false
local countdownConnection
local keyExpired = false

local function showKeyOverlay(show) Overlay.Visible = show end

local function startCountdown(seconds)
    local remaining = math.max(0, math.floor(seconds))
    if countdownConnection then countdownConnection:Disconnect(); countdownConnection = nil end
    keyExpired = false
    CountdownLabel.Visible = true
    StatusLabel.Visible = false
    CountdownLabel.TextColor3 = Theme.Success
    CountdownLabel.Text = formatCountdown(remaining)
    local function update()
        if not validated then return end
        if keyExpired then return end
        remaining = remaining - 1
        if remaining <= 0 then
            CountdownLabel.Text = "00:00:00 - Key Expired"
            CountdownLabel.TextColor3 = Theme.Error
            validated = false
            keyExpired = true
            KeyBox.Text = "Your Key Here!"
            setStatus("Key expired. Please enter a new key.")
            if countdownConnection then countdownConnection:Disconnect(); countdownConnection = nil end
            return
        end
        CountdownLabel.Text = formatCountdown(remaining)
    end
    update()
    countdownConnection = game:GetService("RunService").Heartbeat:Connect(function() update() end)
end

local function showLifetime()
    if countdownConnection then countdownConnection:Disconnect(); countdownConnection = nil end
    keyExpired = false
    CountdownLabel.Visible = true
    StatusLabel.Visible = false
    CountdownLabel.TextColor3 = Theme.Success
    CountdownLabel.Text = "Lifetime Key - No Expiry"
end

local function validateKey(key, onResult)
    local norm = normalizeKey(key)
    if not norm:match("^[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]$") then
        onResult(false, "Key Invalid", 0)
        return
    end
    if not hasHttp() then
        onResult(false, "Could not verify key. Please try again.", 0)
        return
    end

    setStatus("Verifying...")
    local accountId = tostring(LocalPlayer and LocalPlayer.UserId or "0")
    local accountName = tostring(LocalPlayer and LocalPlayer.Name or "unknown")
    local ok, body = safePost(VALIDATE_URL, {
        key = norm,
        roblox_id = accountId,
        roblox_username = accountName,
    })

    if ok and type(body) == "string" then
        local decOk, data = pcall(function() return HttpService:JSONDecode(body) end)
        if decOk and type(data) == "table" then
            if data.valid == true then
                local remaining = data.remaining_seconds
                if remaining == nil or tostring(remaining) == "null" then
                    onResult(true, data.message or "Access granted.", nil)
                else
                    onResult(true, data.message or "Access granted.", tonumber(remaining) or 0)
                end
                return
            end
            onResult(false, data.message or "Key Invalid", 0)
            return
        end
    end

    onResult(false, "Could not verify key. Please try again.", 0)
end

CloseBtn.MouseButton1Click:Connect(function() task.wait(0.1); ScreenGui:Destroy() end)
FetchBtn.MouseButton1Click:Connect(function()
    if setclipboard then pcall(setclipboard, GET_KEY_URL) end
    setStatus("Link copied!")
    task.delay(2, function() if not validated then setStatus("Enter your key to use this script.") end end)
end)
ValidateBtn.MouseButton1Click:Connect(function()
    if validated then return end
    local key = getKeyText()
    if key == "" then setStatus("Key Invalid"); return end
    setStatus("Validating...")
    task.spawn(function()
        validateKey(key, function(success, message, remaining)
            if success then
                validated = true
                setStatus(message or "Access granted.")
                if remaining == nil then showLifetime() else startCountdown(remaining) end
                task.wait(1)
                showKeyOverlay(false)
            else
                setStatus("Key Invalid")
            end
        end)
    end)
end)

Overlay.Visible = true
KeyBox.Text = "Your Key Here!"
setStatus("Enter your key to use this script.")

repeat task.wait(0.5) until validated

local function animateClick(button)
    local uiScale = button:FindFirstChild("ClickScale")
    if not uiScale then
        uiScale = Instance.new("UIScale"); uiScale.Name = "ClickScale"; uiScale.Parent = button
    end
    local accentColor = Color3.fromRGB(247, 197, 46)
    if Window and typeof(Window.GetAccent) == "function" then accentColor = Window:GetAccent() elseif UI and UI.Theme and UI.Theme.Accent then accentColor = UI.Theme.Accent end
    local isTabButton = false
    if Window then
        if button.Parent == Window.TabHolder or button.Parent == Window.PinnedHolder then isTabButton = true end
    end
    if isTabButton then
        local duration = 2.0
        uiScale.Scale = 0.93
        TweenService:Create(uiScale, TweenInfo.new(duration, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Scale = 1 }):Play()
        if button and (button:IsA("TextButton") or button:IsA("ImageButton")) then
            local fill = button:FindFirstChild("ClickFill")
            if fill then fill:Destroy() end
            fill = Instance.new("Frame"); fill.Name = "ClickFill"; fill.BorderSizePixel = 0; fill.ZIndex = 0; fill.Parent = button
            button.ClipsDescendants = true
            local cornerObj = button:FindFirstChildOfClass("UICorner")
            if cornerObj then local fillCorner = cornerObj:Clone(); fillCorner.Parent = fill end
            fill.BackgroundColor3 = accentColor
            fill.Size = UDim2.new(0, 0, 1, 0); fill.Position = UDim2.new(0, 0, 0, 0); fill.BackgroundTransparency = 0.4
            local fillTime = duration * 0.5
            local fillTween = TweenService:Create(fill, TweenInfo.new(fillTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Size = UDim2.new(1, 0, 1, 0) })
            fillTween:Play()
            task.delay(fillTime, function()
                if fill and fill.Parent then
                    local fadeTween = TweenService:Create(fill, TweenInfo.new(duration - fillTime, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { BackgroundTransparency = 1 })
                    fadeTween.Completed:Connect(function() if fill and fill.Parent then fill:Destroy() end end)
                    fadeTween:Play()
                end
            end)
        end
    else
        local duration = 0.22
        uiScale.Scale = 0.93
        TweenService:Create(uiScale, TweenInfo.new(duration, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Scale = 1 }):Play()
        if button and (button:IsA("TextButton") or button:IsA("ImageButton")) then
            local originalColor = button.BackgroundColor3
            local originalTransparency = button.BackgroundTransparency
            button.BackgroundColor3 = accentColor
            if originalTransparency > 0.8 then button.BackgroundTransparency = 0.3 end
            TweenService:Create(button, TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { BackgroundColor3 = originalColor, BackgroundTransparency = originalTransparency }):Play()
        end
    end
end

UI = (function()
    if typeof(Font) ~= "table" or type(Font.new) ~= "function" then
        Font = Font or {}
        Font.new = function(...) return Enum.Font.Gotham end
    end

    local FONT_REG = Font.new("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium)
    local FONT_BOLD = Font.new("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold)

    local function tween(obj, goal, time, style)
        local t = TweenService:Create(obj, TweenInfo.new(time or 0.18, style or Enum.EasingStyle.Quart, Enum.EasingDirection.Out), goal)
        t:Play(); return t
    end

    local function new(class, props, children)
        local obj = Instance.new(class)
        for k, v in pairs(props or {}) do if k ~= "Parent" then obj[k] = v end end
        for _, c in ipairs(children or {}) do c.Parent = obj end
        if props and props.Parent then obj.Parent = props.Parent end
        return obj
    end

    local function corner(parent, radius) return new("UICorner", { CornerRadius = UDim.new(0, radius or 6), Parent = parent }) end
    local function stroke(parent, color, thickness, transparency)
        return new("UIStroke", { Color = color or Theme.Border, Thickness = thickness or 1, Transparency = transparency or 0, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = parent })
    end
    local function dim(color, factor) factor = factor or 0.78; return Color3.new(color.R * factor, color.G * factor, color.B * factor) end

    local UI = { Flags = {}, Theme = Theme }
    local WindowMethods = {}; WindowMethods.__index = WindowMethods
    local TabMethods = {}; TabMethods.__index = TabMethods
    local SectionMethods = {}; SectionMethods.__index = SectionMethods

    function UI:CreateWindow(cfg)
        cfg = cfg or {}
        local Window = setmetatable({ Tabs = {}, Flags = UI.Flags, Open = true, ActiveTab = nil, _accentElements = {} }, WindowMethods)
        Window.ToggleKey = cfg.ToggleKey or Enum.KeyCode.RightShift
        local parentGui = LocalPlayer:FindFirstChild("PlayerGui") or LocalPlayer:WaitForChild("PlayerGui")
        local Gui = new("ScreenGui", { Name = "SotariumUI", ResetOnSpawn = false, ZIndexBehavior = Enum.ZIndexBehavior.Sibling, IgnoreGuiInset = true, Parent = parentGui })
        local Main = new("Frame", { Name = "Main", Size = UDim2.new(0, cfg.Width or 620, 0, cfg.Height or 400), Position = UDim2.new(0.5, -(cfg.Width or 620) / 2, 0.5, -(cfg.Height or 400) / 2), BackgroundColor3 = Theme.BG, BorderSizePixel = 0, ClipsDescendants = true, Parent = Gui })
        corner(Main, 12); stroke(Main, Theme.Border, 1, 0.2)
        local Sidebar = new("Frame", { Name = "Sidebar", Size = UDim2.new(0, 160, 1, 0), BackgroundColor3 = Theme.Sidebar, BorderSizePixel = 0, Parent = Main })
        corner(Sidebar, 12)
        new("Frame", { Size = UDim2.new(0, 14, 1, 0), Position = UDim2.new(1, -14, 0, 0), BackgroundColor3 = Theme.Sidebar, BorderSizePixel = 0, Parent = Sidebar })
        local Header = new("Frame", { Name = "Header", Size = UDim2.new(1, 0, 0, 54), BackgroundTransparency = 1, Parent = Sidebar })
        new("TextLabel", { Size = UDim2.new(1, -24, 1, 0), Position = UDim2.new(0, 12, 0, 0), BackgroundTransparency = 1, Text = cfg.Title or "Sotarium", TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 19, TextXAlignment = Enum.TextXAlignment.Left, Parent = Header })
        local PinnedHolder = new("Frame", { Name = "PinnedHolder", Size = UDim2.new(1, 0, 0, 46), Position = UDim2.new(0, 0, 1, -106), BackgroundTransparency = 1, Parent = Sidebar })
        new("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder, VerticalAlignment = Enum.VerticalAlignment.Bottom, Parent = PinnedHolder })
        new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), PaddingBottom = UDim.new(0, 6), Parent = PinnedHolder })
        local avatarUrl = "rbxassetid://0"
        pcall(function() avatarUrl = Players:GetUserThumbnailAsync(LocalPlayer.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size100x100) end)
        local ProfileCard = new("Frame", { Name = "ProfileCard", Size = UDim2.new(1, -20, 0, 46), Position = UDim2.new(0, 10, 1, -56), BackgroundColor3 = Theme.Surface, BorderSizePixel = 0, Parent = Sidebar })
        corner(ProfileCard, 8); stroke(ProfileCard, Theme.Border, 1, 0.4)
        local AvatarImage = new("ImageLabel", { Name = "Avatar", Size = UDim2.new(0, 32, 0, 32), Position = UDim2.new(0, 8, 0.5, -16), BackgroundColor3 = Theme.Raised, BorderSizePixel = 0, Image = avatarUrl, Parent = ProfileCard })
        corner(AvatarImage, 16); stroke(AvatarImage, Theme.Border, 1, 0.4)
        new("TextLabel", { Name = "Username", Size = UDim2.new(1, -54, 1, 0), Position = UDim2.new(0, 46, 0, 0), BackgroundTransparency = 1, Text = LocalPlayer.Name, TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 12, TextXAlignment = Enum.TextXAlignment.Left, TextWrapped = true, Parent = ProfileCard })
        local TabHolder = new("ScrollingFrame", { Name = "TabHolder", Size = UDim2.new(1, 0, 1, -54 - 106 - 10), Position = UDim2.new(0, 0, 0, 54), BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 2, ScrollBarImageColor3 = Theme.Accent, AutomaticCanvasSize = Enum.AutomaticSize.Y, CanvasSize = UDim2.new(0, 0, 0, 0), Parent = Sidebar })
        new("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder, Parent = TabHolder })
        new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), Parent = TabHolder })
        Window:_registerAccent(function(accent) TabHolder.ScrollBarImageColor3 = accent end)
        local Content = new("Frame", { Name = "Content", Size = UDim2.new(1, -160, 1, 0), Position = UDim2.new(0, 160, 0, 0), BackgroundColor3 = Theme.BG, BorderSizePixel = 0, Parent = Main })
        local MainCloseBtn = new("TextButton", { Name = "MainCloseBtn", Size = UDim2.new(0, 20, 0, 20), Position = UDim2.new(1, -30, 0, 12), BackgroundColor3 = Color3.fromRGB(45, 45, 45), AutoButtonColor = false, Text = "X", TextColor3 = Color3.fromRGB(180, 180, 180), FontFace = FONT_BOLD, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Center, TextYAlignment = Enum.TextYAlignment.Center, ZIndex = 10, Parent = Main })
        corner(MainCloseBtn, 10); stroke(MainCloseBtn, Theme.Border, 1, 0.4)
        MainCloseBtn.MouseEnter:Connect(function() tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(60, 60, 60), TextColor3 = Color3.fromRGB(240, 240, 240) }, 0.12) end)
        MainCloseBtn.MouseLeave:Connect(function() tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(45, 45, 45), TextColor3 = Color3.fromRGB(180, 180, 180) }, 0.12) end)
        MainCloseBtn.MouseButton1Click:Connect(function() animateClick(MainCloseBtn); task.wait(0.1); Gui:Destroy() end)
        Window.Gui = Gui
        Window.Main = Main
        Window.Sidebar = Sidebar
        Window.TabHolder = TabHolder
        Window.PinnedHolder = PinnedHolder
        Window.Content = Content
        do
            local dragging, startPos, startInput = false, nil, nil
            Header.InputBegan:Connect(function(i)
                if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then
                    dragging = true; startInput = i.Position; startPos = Main.Position
                end
            end)
            Header.InputEnded:Connect(function(i)
                if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then dragging = false end
            end)
            UserInputService.InputChanged:Connect(function(i)
                if dragging and (i.UserInputType == Enum.UserInputType.MouseMovement or i.UserInputType == Enum.UserInputType.Touch) then
                    local delta = i.Position - startInput
                    Main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
                end
            end)
        end
        UserInputService.InputBegan:Connect(function(input, gpe)
            if gpe then return end
            if input.KeyCode == Window.ToggleKey then Window:Toggle() end
        end)
        return Window
    end

    function WindowMethods:_registerAccent(applyFn)
        table.insert(self._accentElements, applyFn)
        pcall(applyFn, Theme.Accent, Theme.AccentDim)
        return applyFn
    end

    function WindowMethods:SetAccent(color)
        Theme.Accent = color
        Theme.AccentDim = dim(color, 0.78)
        for _, applyFn in ipairs(self._accentElements) do pcall(applyFn, Theme.Accent, Theme.AccentDim) end
        if self.ActiveTab and self.ActiveTab._refresh then self.ActiveTab._refresh() end
    end

    function WindowMethods:GetAccent() return Theme.Accent end
    function WindowMethods:SetOpen(state)
        self.Open = state
        if state then
            self.Main.Visible = true
            tween(self.Main, { Position = self._openPos or self.Main.Position }, 0.22)
        else
            self._openPos = self.Main.Position
            task.delay(0.22, function() if not self.Open then self.Main.Visible = false end end)
        end
    end
    function WindowMethods:Toggle() self:SetOpen(not self.Open) end

    function WindowMethods:Notify(msg, kind, duration)
        if not self.Gui then return end
        local accent = Theme.Accent
        if kind == "success" then accent = Theme.Success
        elseif kind == "error" then accent = Theme.Error end
        local Note = new("Frame", { Size = UDim2.new(0, 300, 0, 52), Position = UDim2.new(0.5, -150, 1, 20), BackgroundColor3 = Theme.Surface, BorderSizePixel = 0, ZIndex = 100, Parent = self.Gui })
        corner(Note, 10); stroke(Note, Theme.Border, 1, 0.35)
        new("Frame", { Size = UDim2.new(0, 3, 1, -16), Position = UDim2.new(0, 8, 0, 8), BackgroundColor3 = accent, BorderSizePixel = 0, ZIndex = 101, Parent = Note })
        new("TextLabel", { Size = UDim2.new(1, -24, 1, -8), Position = UDim2.new(0, 16, 0, 4), BackgroundTransparency = 1, Text = tostring(msg or ""), TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, TextXAlignment = Enum.TextXAlignment.Left, TextYAlignment = Enum.TextYAlignment.Center, TextWrapped = true, ZIndex = 101, Parent = Note })
        tween(Note, { Position = UDim2.new(0.5, -150, 1, -70) }, 0.3)
        task.delay(duration or 3, function()
            tween(Note, { Position = UDim2.new(0.5, -150, 1, 20) }, 0.3)
            task.wait(0.35)
            if Note and Note.Parent then Note:Destroy() end
        end)
    end

    local function buildTab(Window, data, pinned)
        data = data or {}
        local Tab = setmetatable({ Name = data.Name or "Tab", Sections = {}, Window = Window, Pinned = pinned or false }, TabMethods)
        local holder = pinned and Window.PinnedHolder or Window.TabHolder
        local Button = new("TextButton", { Name = Tab.Name, Size = UDim2.new(1, 0, 0, 36), BackgroundColor3 = Theme.Raised, BackgroundTransparency = 1, AutoButtonColor = false, Text = "", Parent = holder })
        corner(Button, 8)
        local bar = new("Frame", { Size = UDim2.new(0, 3, 0.6, 0), Position = UDim2.new(0, 0, 0.2, 0), BackgroundColor3 = Theme.Accent, BackgroundTransparency = 1, BorderSizePixel = 0, Parent = Button })
        corner(bar, 2)
        local Label = new("TextLabel", { Size = UDim2.new(1, -16, 1, 0), Position = UDim2.new(0, 12, 0, 0), BackgroundTransparency = 1, Text = Tab.Name, TextColor3 = Theme.TextMid, FontFace = FONT_REG, TextSize = 14, TextXAlignment = Enum.TextXAlignment.Left, Parent = Button })
        local Page = new("ScrollingFrame", { Name = Tab.Name .. "_Page", Size = UDim2.new(1, -24, 1, -24), Position = UDim2.new(0, 12, 0, 12), BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 3, ScrollBarImageColor3 = Theme.Accent, AutomaticCanvasSize = Enum.AutomaticSize.Y, CanvasSize = UDim2.new(0, 0, 0, 0), Visible = false, Parent = Window.Content })
        new("UIListLayout", { Padding = UDim.new(0, 12), SortOrder = Enum.SortOrder.LayoutOrder, Parent = Page })
        new("UIPadding", { PaddingRight = UDim.new(0, 6), Parent = Page })
        Window:_registerAccent(function(accent) Page.ScrollBarImageColor3 = accent end)
        Tab.Button = Button; Tab.Page = Page; Tab.Container = Page
        Tab._refresh = function()
            local active = (Window.ActiveTab == Tab)
            if active then
                tween(Button, { BackgroundTransparency = 0 }, 0.15)
                tween(bar, { BackgroundTransparency = 0, BackgroundColor3 = Theme.Accent }, 0.15)
                Label.TextColor3 = Theme.Text
            else
                tween(Button, { BackgroundTransparency = 1 }, 0.15)
                tween(bar, { BackgroundTransparency = 1 }, 0.15)
                Label.TextColor3 = Theme.TextMid
            end
        end
        Button.MouseEnter:Connect(function() if Window.ActiveTab ~= Tab then tween(Button, { BackgroundTransparency = 0.6 }, 0.12); Label.TextColor3 = Theme.Text end end)
        Button.MouseLeave:Connect(function() if Window.ActiveTab ~= Tab then tween(Button, { BackgroundTransparency = 1 }, 0.12); Label.TextColor3 = Theme.TextMid end end)
        Button.MouseButton1Click:Connect(function() animateClick(Button); Window:SelectTab(Tab) end)
        table.insert(Window.Tabs, Tab)
        if not Window.ActiveTab then Window:SelectTab(Tab) else Tab._refresh() end
        return Tab
    end

    function WindowMethods:AddTab(data) return buildTab(self, data, false) end
    function WindowMethods:AddPinnedTab(data) return buildTab(self, data, true) end
    function WindowMethods:SelectTab(tab)
        for _, t in ipairs(self.Tabs) do if t.Page then t.Page.Visible = false end end
        self.ActiveTab = tab
        tab.Page.Visible = true
        for _, t in ipairs(self.Tabs) do if t._refresh then t._refresh() end end
    end

    function TabMethods:AddSection(data)
        data = data or {}
        local Section = setmetatable({ Name = data.Name or "Section", Window = self.Window }, SectionMethods)
        local Card = new("Frame", { Name = Section.Name, Size = UDim2.new(1, 0, 0, 0), AutomaticSize = Enum.AutomaticSize.Y, BackgroundColor3 = Theme.Surface, BorderSizePixel = 0, Parent = self.Container })
        corner(Card, 10); stroke(Card, Theme.Border, 1, 0.35)
        new("UIPadding", { PaddingTop = UDim.new(0, 12), PaddingBottom = UDim.new(0, 12), PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12), Parent = Card })
        new("UIListLayout", { Padding = UDim.new(0, 8), SortOrder = Enum.SortOrder.LayoutOrder, Parent = Card })
        new("TextLabel", { Size = UDim2.new(1, 0, 0, 18), BackgroundTransparency = 1, Text = Section.Name, TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 14, TextXAlignment = Enum.TextXAlignment.Left, Parent = Card })
        Section.Container = Card
        return Section
    end

    function SectionMethods:AddLabel(text)
        local lbl = new("TextLabel", { Size = UDim2.new(1, 0, 0, 18), BackgroundTransparency = 1, Text = text or "", TextColor3 = Theme.TextMid, FontFace = FONT_REG, TextSize = 13, TextXAlignment = Enum.TextXAlignment.Left, TextWrapped = true, AutomaticSize = Enum.AutomaticSize.Y, Parent = self.Container })
        return { Set = function(_, t) lbl.Text = t end }
    end

    function SectionMethods:AddButton(c)
        c = c or {}
        local btn = new("TextButton", { Size = UDim2.new(1, 0, 0, 32), BackgroundColor3 = Theme.Raised, AutoButtonColor = false, Text = c.Name or "Button", TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, Parent = self.Container })
        corner(btn, 8); stroke(btn, Theme.Border, 1, 0.4)
        btn.MouseEnter:Connect(function() tween(btn, { BackgroundColor3 = Theme.Surface }, 0.12) end)
        btn.MouseLeave:Connect(function() tween(btn, { BackgroundColor3 = Theme.Raised }, 0.12) end)
        btn.MouseButton1Click:Connect(function()
            if type(animateClick) == "function" then pcall(animateClick, btn) end
            if c.Callback then pcall(c.Callback) end
        end)
        return btn
    end

    function SectionMethods:AddToggle(c)
        c = c or {}
        local flag = c.Flag
        local state = (flag and UI.Flags[flag] ~= nil and UI.Flags[flag]) or c.Default or false
        local Row = new("Frame", { Size = UDim2.new(1, 0, 0, 30), BackgroundTransparency = 1, Parent = self.Container })
        new("TextLabel", { Size = UDim2.new(1, -60, 1, 0), BackgroundTransparency = 1, Text = c.Name or "Toggle", TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, TextXAlignment = Enum.TextXAlignment.Left, Parent = Row })
        local pill = new("Frame", { AnchorPoint = Vector2.new(1, 0.5), Position = UDim2.new(1, 0, 0.5, 0), Size = UDim2.new(0, 40, 0, 20), BackgroundColor3 = state and Theme.Accent or Theme.Raised, Parent = Row })
        corner(pill, 10); stroke(pill, Theme.Border, 1, 0.4)
        local knob = new("Frame", { AnchorPoint = Vector2.new(0, 0.5), Size = UDim2.new(0, 16, 0, 16), Position = state and UDim2.new(1, -18, 0.5, 0) or UDim2.new(0, 2, 0.5, 0), BackgroundColor3 = Theme.Text, Parent = pill })
        corner(knob, 8)
        local btn = new("TextButton", { BackgroundTransparency = 1, Size = UDim2.new(1, 0, 1, 0), Text = "", Parent = Row })
        local function apply(v, fire)
            state = v
            tween(pill, { BackgroundColor3 = v and Theme.Accent or Theme.Raised }, 0.15)
            tween(knob, { Position = v and UDim2.new(1, -18, 0.5, 0) or UDim2.new(0, 2, 0.5, 0) }, 0.15)
            if flag then UI.Flags[flag] = v end
            if fire and c.Callback then pcall(c.Callback, v) end
        end
        btn.MouseButton1Click:Connect(function() apply(not state, true) end)
        self.Window:_registerAccent(function(accent) if state then pill.BackgroundColor3 = accent end end)
        return { Get = function() return state end, Set = function(_, v) apply(v, true) end }
    end

    function SectionMethods:AddDropdown(c)
        c = c or {}
        local items = c.Items or {}
        local selected = c.Default or items[1] or ""
        local Box = new("TextButton", { Size = UDim2.new(1, 0, 0, 32), BackgroundColor3 = Theme.Raised, AutoButtonColor = false, Text = (c.Name or "Dropdown") .. ": " .. tostring(selected), TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, Parent = self.Container })
        corner(Box, 8); stroke(Box, Theme.Border, 1, 0.4)
        local Open = false
        local Holder = new("Frame", { Size = UDim2.new(1, 0, 0, 0), Position = UDim2.new(0, 0, 1, 4), BackgroundColor3 = Theme.Raised, ClipsDescendants = true, ZIndex = 20, Parent = Box })
        corner(Holder, 8); stroke(Holder, Theme.Border, 1, 0.4)
        local Layout = new("UIListLayout", { Parent = Holder })
        Box.MouseButton1Click:Connect(function()
            Open = not Open
            local Size = Open and #items * 28 or 0
            tween(Holder, { Size = UDim2.new(1, 0, 0, Size) }, 0.15)
        end)
        for _, item in ipairs(items) do
            local Option = new("TextButton", { Size = UDim2.new(1, 0, 0, 28), Text = tostring(item), BackgroundTransparency = 1, TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, Parent = Holder })
            Option.MouseButton1Click:Connect(function()
                selected = item
                Box.Text = (c.Name or "Dropdown") .. ": " .. tostring(item)
                if c.Flag then UI.Flags[c.Flag] = item end
                if c.Callback then pcall(c.Callback, item) end
                Open = false
                tween(Holder, { Size = UDim2.new(1, 0, 0, 0) }, 0.15)
            end)
        end
        return { Get = function() return selected end, Set = function(_, v) selected = v; Box.Text = (c.Name or "Dropdown") .. ": " .. tostring(v) end }
    end

    function SectionMethods:AddSlider(c)
        c = c or {}
        local Min = c.Min or 0
        local Max = c.Max or 100
        local Value = c.Default or Min
        local Bar = new("TextButton", { Size = UDim2.new(1, 0, 0, 24), BackgroundColor3 = Theme.Raised, AutoButtonColor = false, Text = "", Parent = self.Container })
        corner(Bar, 6); stroke(Bar, Theme.Border, 1, 0.4)
        local Fill = new("Frame", { Size = UDim2.new((Value - Min) / math.max(Max - Min, 1), 0, 1, 0), BackgroundColor3 = Theme.Accent, Parent = Bar })
        corner(Fill, 6)
        local Label = new("TextLabel", { Size = UDim2.new(1, 0, 1, 0), BackgroundTransparency = 1, Text = (c.Name or "Slider") .. ": " .. tostring(Value), TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 12, Parent = Bar })
        local Dragging = false
        local function setPercent(p)
            p = math.clamp(p, 0, 1)
            Value = math.floor(Min + (Max - Min) * p)
            Fill.Size = UDim2.new(p, 0, 1, 0)
            Label.Text = (c.Name or "Slider") .. ": " .. tostring(Value)
            if c.Flag then UI.Flags[c.Flag] = Value end
            if c.Callback then pcall(c.Callback, Value) end
        end
        Bar.InputBegan:Connect(function(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
                Dragging = true
                setPercent((input.Position.X - Bar.AbsolutePosition.X) / math.max(Bar.AbsoluteSize.X, 1))
            end
        end)
        UserInputService.InputChanged:Connect(function(input)
            if Dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
                setPercent((input.Position.X - Bar.AbsolutePosition.X) / math.max(Bar.AbsoluteSize.X, 1))
            end
        end)
        UserInputService.InputEnded:Connect(function(input)
            if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then Dragging = false end
        end)
        self.Window:_registerAccent(function(accent) Fill.BackgroundColor3 = accent end)
        return { Get = function() return Value end }
    end

    function SectionMethods:AddKeybind(c)
        c = c or {}
        local Key = c.Default or Enum.KeyCode.Unknown
        local Button = new("TextButton", { Size = UDim2.new(1, 0, 0, 30), BackgroundColor3 = Theme.Raised, AutoButtonColor = false, Text = (c.Name or "Keybind") .. " [" .. Key.Name .. "]", TextColor3 = Theme.Text, FontFace = FONT_REG, TextSize = 13, Parent = self.Container })
        corner(Button, 8); stroke(Button, Theme.Border, 1, 0.4)
        local Listening = false
        Button.MouseButton1Click:Connect(function()
            Listening = true
            Button.Text = "Press key..."
        end)
        UserInputService.InputBegan:Connect(function(input, gpe)
            if Listening then
                if input.UserInputType == Enum.UserInputType.Keyboard then
                    Key = input.KeyCode
                    Button.Text = (c.Name or "Keybind") .. " [" .. Key.Name .. "]"
                    Listening = false
                    if c.Flag then UI.Flags[c.Flag] = Key end
                end
            elseif not gpe and input.KeyCode == Key then
                if c.Callback then pcall(c.Callback) end
            end
        end)
    end

    function SectionMethods:AddTextbox(c)
        c = c or {}
        local Box = new("TextBox", { Size = UDim2.new(1, 0, 0, 30), BackgroundColor3 = Theme.Raised, Text = c.Default or "", PlaceholderText = c.Placeholder or (c.Name or "Enter text..."), TextColor3 = Theme.Text, PlaceholderColor3 = Theme.TextMid, FontFace = FONT_REG, TextSize = 13, ClearTextOnFocus = false, Parent = self.Container })
        corner(Box, 8); stroke(Box, Theme.Border, 1, 0.4)
        Box.FocusLost:Connect(function(enterPressed)
            local txt = Box.Text
            if c.Flag then UI.Flags[c.Flag] = txt end
            if c.Callback then pcall(c.Callback, txt, enterPressed) end
        end)
        return { Get = function() return Box.Text end, Set = function(_, v) Box.Text = v end }
    end

    return UI
end)()

if type(UI) ~= "table" or type(UI.CreateWindow) ~= "function" then return end

local gameLoaded = false
pcall(function()
    gameLoaded = v50()
end)

if not gameLoaded then
    local ok, windowResult = pcall(function() return UI:CreateWindow({ Title = "Sotarium", Width = 580, Height = 420 }) end)
    if ok and type(windowResult) == "table" then
        Window = windowResult
        Window:SetOpen(true)

        local MainTab = Window:AddTab({ Name = "Main" })
        local CombatSection = MainTab:AddSection({ Name = "Combat" })

        CombatSection:AddToggle({
            Name = "ESP",
            Flag = "ESP",
            Callback = function(v) print("ESP:", v) end
        })

        CombatSection:AddButton({
            Name = "Execute",
            Callback = function()
                Window:Notify("Executed!", "success")
            end
        })

        CombatSection:AddDropdown({
            Name = "Select Mode",
            Items = { "Default", "Aggressive", "Stealth" },
            Default = "Default",
            Flag = "Mode",
            Callback = function(v) print("Mode:", v) end
        })

        CombatSection:AddSlider({
            Name = "WalkSpeed",
            Min = 16,
            Max = 100,
            Default = 16,
            Flag = "Speed",
            Callback = function(v)
                pcall(function() game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = v end)
            end
        })

        CombatSection:AddTextbox({
            Name = "Target Name",
            Placeholder = "Enter target username...",
            Flag = "Target",
            Callback = function(v) print("Target:", v) end
        })

        CombatSection:AddKeybind({
            Name = "Toggle Key",
            Default = Enum.KeyCode.RightShift,
            Callback = function()
                Window:Toggle()
            end
        })
    end
end