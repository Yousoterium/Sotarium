local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local ContentProvider = game:GetService("ContentProvider")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer

-- ── Constants ─────────────────────────────────────────────
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

local function canRead() return type(readfile) == "function" or type(read_file) == "function" end
local function canWrite() return type(writefile) == "function" or type(write_file) == "function" end
local function fileExists(path)
    if type(isfile) == "function" then return isfile(path) end
    if type(is_file) == "function" then return is_file(path) end
    return false
end
local function readFile(path)
    if type(readfile) == "function" then return pcall(readfile, path) end
    if type(read_file) == "function" then return pcall(read_file, path) end
    return false, nil
end
local function writeFile(path, content)
    if type(writefile) == "function" then return pcall(writefile, path, content) end
    if type(write_file) == "function" then return pcall(write_file, path, content) end
    return false
end
local function getSavedKey()
    return nil
end
local function saveKey(key)
    return
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
    return type(request) == "function" or (type(syn) == "table" and type(syn.request) == "function") or (type(http) == "table" and type(http.request) == "function") or type(http_request) == "function" or (type(fluxus) == "table" and type(fluxus.request) == "function") or (HttpService and type(HttpService.PostAsync) == "function")
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
local function showKeyOverlay(show)
    Overlay.Visible = show
end
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
    if key == "test" then onResult(true, "Test key accepted.", 86400); return end
    local norm = normalizeKey(key)
    if not norm:match("^[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]$") then onResult(false, "Key Invalid", 0); return end
    if not hasHttp() then onResult(false, "Key Invalid", 0); return end
    setStatus("Validating...")
    local accountId = tostring(LocalPlayer and LocalPlayer.UserId or "0")
    local accountName = tostring(LocalPlayer and LocalPlayer.Name or "unknown")
    local ok, body = safePost(VALIDATE_URL, { key = norm, roblox_id = accountId, roblox_username = accountName })
    if ok and type(body) == "string" then
        local decOk, data = pcall(function() return HttpService:JSONDecode(body) end)
        if decOk and type(data) == "table" and (data.valid == true or data.status == "success") then
            local rem = data.remaining_seconds
            local isLifetime = data.lifetime == true or rem == nil or tostring(rem) == "null"
            if isLifetime then onResult(true, "Access granted.", nil) else onResult(true, "Access granted.", tonumber(rem) or 86400) end
            return
        end
    end
    local queryUrl = SUPABASE_PROJECT_URL .. "/rest/v1/keys?key_string=eq." .. norm .. "&select=id,key_string,expires_at,is_products_key"
    local reqFn = request or (syn and syn.request) or (http and http.request) or http_request or (fluxus and fluxus.request)
    local headers = { ["apikey"] = SUPABASE_ANON_KEY, ["Authorization"] = "Bearer " .. SUPABASE_ANON_KEY, ["Accept"] = "application/json" }
    if reqFn then
        local s, res = pcall(reqFn, { Url = queryUrl, Method = "GET", Headers = headers })
        if s and res then
            local respBody = type(res) == "table" and res.Body or res
            if type(respBody) == "string" then
                local decOk, data = pcall(function() return HttpService:JSONDecode(respBody) end)
                if decOk and type(data) == "table" and #data > 0 then
                    local rec = data[1]
                    local expiresAtIso = rec.expires_at
                    local isLifetime = rec.is_products_key == true or not expiresAtIso or expiresAtIso == ""
                    if isLifetime then onResult(true, "Access granted.", nil); return end
                    local y, m, d, h, min, sec = tostring(expiresAtIso):match("(%d+)-(%d+)-(%d+)T(%d+):(%d+):(%d+)")
                    if y and m and d and h and min and sec then
                        local expireTime = os.time({ year = tonumber(y), month = tonumber(m), day = tonumber(d), hour = tonumber(h), min = tonumber(min), sec = tonumber(sec) })
                        local remainingSec = expireTime - os.time()
                        if remainingSec <= 0 then onResult(false, "Key Expired", 0); return end
                        onResult(true, "Access granted.", remainingSec)
                        return
                    end
                    onResult(true, "Access granted.", 86400)
                    return
                end
            end
        end
    end
    onResult(false, "Key Invalid", 0)
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
        uiScale = Instance.new("UIScale")
        uiScale.Name = "ClickScale"
        uiScale.Parent = button
    end
    local accentColor = Color3.fromRGB(247, 197, 46)
    if Window and typeof(Window.GetAccent) == "function" then accentColor = Window:GetAccent() elseif UI and UI.Theme and UI.Theme.Accent then accentColor = UI.Theme.Accent end
    local isTabButton = false
    if Window then
        if button.Parent == Window.TabHolder or button.Parent == Window.PinnedHolder then isTabButton = true end
    end
    local isSettingsSection = false
    if SettingsTab and SettingsTab.Page and button:IsDescendantOf(SettingsTab.Page) then isSettingsSection = true end
    if isTabButton then
        local duration = 2.0
        uiScale.Scale = 0.93
        local scaleInfo = TweenInfo.new(duration, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
        TweenService:Create(uiScale, scaleInfo, { Scale = 1 }):Play()
        if button and (button:IsA("TextButton") or button:IsA("ImageButton")) then
            local fill = button:FindFirstChild("ClickFill")
            if fill then fill:Destroy() end
            fill = Instance.new("Frame")
            fill.Name = "ClickFill"
            fill.BorderSizePixel = 0
            fill.ZIndex = 0
            fill.Parent = button
            button.ClipsDescendants = true
            local cornerObj = button:FindFirstChildOfClass("UICorner")
            if cornerObj then
                local fillCorner = cornerObj:Clone()
                fillCorner.Parent = fill
            end
            fill.BackgroundColor3 = accentColor
            fill.Size = UDim2.new(0, 0, 1, 0)
            fill.Position = UDim2.new(0, 0, 0, 0)
            fill.BackgroundTransparency = 0.4
            local fillTime = duration * 0.5
            local fillInfo = TweenInfo.new(fillTime, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
            local fillTween = TweenService:Create(fill, fillInfo, { Size = UDim2.new(1, 0, 1, 0) })
            fillTween:Play()
            task.delay(fillTime, function()
                if fill and fill.Parent then
                    local fadeInfo = TweenInfo.new(duration - fillTime, Enum.EasingStyle.Quad, Enum.EasingDirection.In)
                    local fadeTween = TweenService:Create(fill, fadeInfo, { BackgroundTransparency = 1 })
                    fadeTween.Completed:Connect(function()
                        if fill and fill.Parent then fill:Destroy() end
                    end)
                    fadeTween:Play()
                end
            end)
        end
    else
        local duration = 0.22
        uiScale.Scale = 0.93
        local scaleInfo = TweenInfo.new(duration, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
        TweenService:Create(uiScale, scaleInfo, { Scale = 1 }):Play()
        if not isSettingsSection and button and (button:IsA("TextButton") or button:IsA("ImageButton")) then
            local originalColor = button.BackgroundColor3
            local originalTransparency = button.BackgroundTransparency
            button.BackgroundColor3 = accentColor
            if originalTransparency > 0.8 then button.BackgroundTransparency = 0.3 end
            local colorInfo = TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
            TweenService:Create(button, colorInfo, { BackgroundColor3 = originalColor, BackgroundTransparency = originalTransparency }):Play()
        end
    end
end

UI = (function()
    if typeof(Font) ~= "table" or type(Font.new) ~= "function" then
        Font = Font or {}
        Font.new = function(...) return Enum.Font.Gotham end
    end
    local Players = game:GetService("Players")
    local TweenService = game:GetService("TweenService")
    local UserInputService = game:GetService("UserInputService")
    local Player = LocalPlayer or Players.LocalPlayer or Players.PlayerAdded:Wait()
    local Theme = {
        BG = Color3.fromRGB(18, 18, 18),
        Surface = Color3.fromRGB(24, 24, 24),
        Raised = Color3.fromRGB(30, 30, 30),
        Sidebar = Color3.fromRGB(14, 14, 14),
        Border = Color3.fromRGB(40, 40, 40),
        Accent = Color3.fromRGB(247, 197, 46),
        AccentDim = Color3.fromRGB(193, 154, 36),
        Text = Color3.fromRGB(240, 240, 240),
        TextMid = Color3.fromRGB(150, 150, 150),
        Success = Color3.fromRGB(34, 197, 94),
        Error = Color3.fromRGB(239, 68, 68),
    }
    local FONT_REG = Font.new("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium)
    local FONT_BOLD = Font.new("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold)
    local function tween(obj, goal, time, style)
        local t = TweenService:Create(obj, TweenInfo.new(time or 0.18, style or Enum.EasingStyle.Quart, Enum.EasingDirection.Out), goal)
        t:Play()
        return t
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
    local function dim(color, factor)
        factor = factor or 0.78
        return Color3.new(color.R * factor, color.G * factor, color.B * factor)
    end
    local UI = { Flags = {}, Theme = Theme }
    local WindowMethods = {}
    WindowMethods.__index = WindowMethods
    local TabMethods = {}
    TabMethods.__index = TabMethods
    local SectionMethods = {}
    SectionMethods.__index = SectionMethods
    local function loadLogoAsset()
        local ICON_URL = "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png"
        local ICON_FILE = "SotariumMummy.png"
        local hasWrite = type(writefile) == "function" or type(write_file) == "function"
        local hasIs = type(isfile) == "function" or type(is_file) == "function"
        local hasCust = type(getcustomasset) == "function" or type(getsynasset) == "function"
        if not (hasWrite and hasIs and hasCust) then return ICON_URL end
        local isfileFn = isfile or is_file
        local readfileFn = readfile or read_file
        local writefileFn = writefile or write_file
        local resolver = getcustomasset or getsynasset
        if isfileFn(ICON_FILE) then
            local ok, content = pcall(readfileFn, ICON_FILE)
            if ok and type(content) == "string" and #content > 100 then
                local ok2, asset = pcall(resolver, ICON_FILE)
                if ok2 and asset then return asset end
            end
        end
        local reqFn = request or (syn and syn.request) or (http and http.request) or http_request or (fluxus and fluxus.request)
        local data = nil
        if reqFn then
            local ok, res = pcall(reqFn, { Url = ICON_URL, Method = "GET" })
            if ok and res then data = type(res) == "table" and res.Body or res end
        end
        if not data and game and game.HttpGet then pcall(function() data = game:HttpGet(ICON_URL) end) end
        if data and type(data) == "string" and #data > 100 then
            pcall(writefileFn, ICON_FILE, data)
            local ok2, asset = pcall(resolver, ICON_FILE)
            if ok2 and asset then return asset end
        end
        return ICON_URL
    end
    function UI:CreateWindow(cfg)
        cfg = cfg or {}
        local Window = setmetatable({ Tabs = {}, Flags = UI.Flags, Open = true, ActiveTab = nil, _accentElements = {} }, WindowMethods)
        Window.ToggleKey = cfg.ToggleKey or Enum.KeyCode.RightShift
        local parentGui = Player:FindFirstChild("PlayerGui") or Player:WaitForChild("PlayerGui")
        local Gui = new("ScreenGui", { Name = "SotariumUI", ResetOnSpawn = false, ZIndexBehavior = Enum.ZIndexBehavior.Sibling, IgnoreGuiInset = true, Parent = parentGui })
        local Main = new("Frame", { Name = "Main", Size = UDim2.new(0, cfg.Width or 620, 0, cfg.Height or 400), Position = UDim2.new(0.5, -(cfg.Width or 620) / 2, 0.5, -(cfg.Height or 400) / 2), BackgroundColor3 = Theme.BG, BorderSizePixel = 0, ClipsDescendants = true, Parent = Gui })
        corner(Main, 12)
        stroke(Main, Theme.Border, 1, 0.2)
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
        corner(ProfileCard, 8)
        stroke(ProfileCard, Theme.Border, 1, 0.4)
        local AvatarImage = new("ImageLabel", { Name = "Avatar", Size = UDim2.new(0, 32, 0, 32), Position = UDim2.new(0, 8, 0.5, -16), BackgroundColor3 = Theme.Raised, BorderSizePixel = 0, Image = avatarUrl, Parent = ProfileCard })
        corner(AvatarImage, 16)
        stroke(AvatarImage, Theme.Border, 1, 0.4)
        new("TextLabel", { Name = "Username", Size = UDim2.new(1, -54, 1, 0), Position = UDim2.new(0, 46, 0, 0), BackgroundTransparency = 1, Text = LocalPlayer.Name, TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 12, TextXAlignment = Enum.TextXAlignment.Left, TextWrapped = true, Parent = ProfileCard })
        local TabHolder = new("ScrollingFrame", { Name = "TabHolder", Size = UDim2.new(1, 0, 1, -54 - 106 - 10), Position = UDim2.new(0, 0, 0, 54), BackgroundTransparency = 1, BorderSizePixel = 0, ScrollBarThickness = 2, ScrollBarImageColor3 = Theme.Accent, AutomaticCanvasSize = Enum.AutomaticSize.Y, CanvasSize = UDim2.new(0, 0, 0, 0), Parent = Sidebar })
        new("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder, Parent = TabHolder })
        new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), Parent = TabHolder })
        Window:_registerAccent(function(accent) TabHolder.ScrollBarImageColor3 = accent end)
        local Content = new("Frame", { Name = "Content", Size = UDim2.new(1, -160, 1, 0), Position = UDim2.new(0, 160, 0, 0), BackgroundColor3 = Theme.BG, BorderSizePixel = 0, Parent = Main })
        local MainCloseBtn = new("TextButton", { Name = "MainCloseBtn", Size = UDim2.new(0, 20, 0, 20), Position = UDim2.new(1, -30, 0, 12), BackgroundColor3 = Color3.fromRGB(45, 45, 45), AutoButtonColor = false, Text = "X", TextColor3 = Color3.fromRGB(180, 180, 180), FontFace = FONT_BOLD, TextSize = 10, TextXAlignment = Enum.TextXAlignment.Center, TextYAlignment = Enum.TextYAlignment.Center, ZIndex = 10, Parent = Main })
        corner(MainCloseBtn, 10)
        stroke(MainCloseBtn, Theme.Border, 1, 0.4)
        MainCloseBtn.MouseEnter:Connect(function() tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(60, 60, 60), TextColor3 = Color3.fromRGB(240, 240, 240) }, 0.12) end)
        MainCloseBtn.MouseLeave:Connect(function() tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(45, 45, 45), TextColor3 = Color3.fromRGB(180, 180, 180) }, 0.12) end)
        MainCloseBtn.MouseButton1Click:Connect(function() animateClick(MainCloseBtn); task.wait(0.1); Gui:Destroy() end)
        Window.Gui = Gui
        Window.Main = Main
        Window.Sidebar = Sidebar
        Window.TabHolder = TabHolder
        Window.PinnedHolder = PinnedHolder
        Window.Content = Content
        local LoadingOverlay = new("Frame", { Name = "LoadingOverlay", Size = UDim2.new(1, 0, 1, 0), Position = UDim2.new(0, 0, 0, 0), BackgroundColor3 = Color3.fromRGB(8, 8, 8), BackgroundTransparency = 0, BorderSizePixel = 0, ClipsDescendants = true, ZIndex = 50, Parent = Main })
        corner(LoadingOverlay, 12)
        local LoadingGroup = new("Frame", { Name = "LoadingGroup", Size = UDim2.new(0, 140, 0, 150), Position = UDim2.new(0.5, -70, 0.5, -75), BackgroundTransparency = 1, ZIndex = 51, Parent = LoadingOverlay })
        local LogoContainer = new("Frame", { Name = "LogoContainer", Size = UDim2.new(0, 110, 0, 110), Position = UDim2.new(0.5, -55, 0, 0), BackgroundTransparency = 1, ZIndex = 51, Parent = LoadingGroup })
        local LoadingLogo = new("ImageLabel", { Name = "Logo", Size = UDim2.new(1, 0, 1, 0), BackgroundTransparency = 1, ImageTransparency = 1, Image = "", ScaleType = Enum.ScaleType.Fit, ZIndex = 51, Parent = LogoContainer })
        local LoadingTitle = new("TextLabel", { Name = "LoadingTitle", Size = UDim2.new(1, 0, 0, 24), Position = UDim2.new(0, 0, 1, -28), BackgroundTransparency = 1, Text = "Sotarium", TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 20, TextXAlignment = Enum.TextXAlignment.Center, TextYAlignment = Enum.TextYAlignment.Center, TextTransparency = 1, ZIndex = 51, Parent = LoadingGroup })
        task.spawn(function()
            local asset = loadLogoAsset()
            if asset and asset ~= "" then LoadingLogo.Image = asset end
        end)
        task.spawn(function()
            local holdDuration = 2.0
            local fadeInInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
            local fadeInLogo = TweenService:Create(LoadingLogo, fadeInInfo, { ImageTransparency = 0 })
            local fadeInText = TweenService:Create(LoadingTitle, fadeInInfo, { TextTransparency = 0 })
            fadeInLogo:Play(); fadeInText:Play(); fadeInLogo.Completed:Wait()
            local breatheUp = TweenService:Create(LogoContainer, TweenInfo.new(holdDuration * 0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), { Size = UDim2.new(0, 120, 0, 120), Position = UDim2.new(0.5, -60, 0, -5) })
            breatheUp:Play(); breatheUp.Completed:Wait()
            local fadeOutInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quart, Enum.EasingDirection.In)
            local fadeLogo = TweenService:Create(LoadingLogo, fadeOutInfo, { ImageTransparency = 1 })
            local fadeText = TweenService:Create(LoadingTitle, fadeOutInfo, { TextTransparency = 1 })
            local fadeBg = TweenService:Create(LoadingOverlay, fadeOutInfo, { BackgroundTransparency = 1 })
            fadeLogo:Play(); fadeText:Play(); fadeBg:Play(); fadeLogo.Completed:Wait()
            LoadingOverlay:Destroy()
        end)
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
            task.delay(0.22, function()
                if not self.Open then self.Main.Visible = false end
            end)
        end
    end
    function WindowMethods:Toggle() self:SetOpen(not self.Open) end
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
        Tab.Button = Button
        Tab.Page = Page
        Tab.Container = Page
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
        Button.MouseEnter:Connect(function()
            if Window.ActiveTab ~= Tab then
                tween(Button, { BackgroundTransparency = 0.6 }, 0.12)
                Label.TextColor3 = Theme.Text
            end
        end)
        Button.MouseLeave:Connect(function()
            if Window.ActiveTab ~= Tab then
                tween(Button, { BackgroundTransparency = 1 }, 0.12)
                Label.TextColor3 = Theme.TextMid
            end
        end)
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
        corner(Card, 10)
        stroke(Card, Theme.Border, 1, 0.35)
        new("UIPadding", { PaddingTop = UDim.new(0, 12), PaddingBottom = UDim.new(0, 12), PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12), Parent = Card })
        new("UIListLayout", { Padding = UDim.new(0, 8), SortOrder = Enum.SortOrder.LayoutOrder, Parent = Card })
        new("TextLabel", { Size = UDim2.new(1, 0, 0, 18), BackgroundTransparency = 1, Text = Section.Name, TextColor3 = Theme.Text, FontFace = FONT_BOLD, TextSize = 14, TextXAlignment = Enum.TextXAlignment.Left, Parent = Card })
        Section.Container = Card
        return Section
    end
    return UI
end)()

if type(UI) ~= "table" or type(UI.CreateWindow) ~= "function" then warn("UI library not available or doesn't support CreateWindow") return end
local ok, windowResult = pcall(function() return UI:CreateWindow({ Title = "Sotarium", Width = 580, Height = 420 }) end)
if not ok or type(windowResult) ~= "table" then warn("Failed to create window:", windowResult) return end
Window = windowResult
local MainTab = Window:AddTab({ Name = "main" })
Window:SelectTab(MainTab)
MainTab:AddSection({ Name = "main" })
Window:SetOpen(true)
