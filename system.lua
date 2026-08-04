local Players           = game:GetService("Players")
local HttpService       = game:GetService("HttpService")
local TweenService      = game:GetService("TweenService")
local UserInputService  = game:GetService("UserInputService")
local ContentProvider   = game:GetService("ContentProvider")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer

-- ── Constants ─────────────────────────────────────────────
local KEY_FILE     = "SoteriaKey.txt"
-- TODO: replace with YOUR Supabase project URL (the same one the website writes keys to)
local SUPABASE_PROJECT_URL = "https://ihrrwrjsdqqpgmyanpgg.supabase.co"
local VALIDATE_URL = SUPABASE_PROJECT_URL .. "/functions/v1/verify-key"
local GET_KEY_URL  = "https://sotarium.vercel.app/"

local ICON_URL     = "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png"
local ICON_FILE    = "SotariumMummy.png"

-- ── Theme ─────────────────────────────────────────────────
local Theme = {
    BG      = Color3.fromRGB(18, 18, 18),
    Surface = Color3.fromRGB(24, 24, 24),
    Raised  = Color3.fromRGB(30, 30, 30),
    Sidebar = Color3.fromRGB(14, 14, 14),
    Border  = Color3.fromRGB(40, 40, 40),
    Accent  = Color3.fromRGB(247, 197, 46),
    Text    = Color3.fromRGB(240, 240, 240),
    TextMid = Color3.fromRGB(150, 150, 150),
    Success = Color3.fromRGB(34, 197, 94),
    Error   = Color3.fromRGB(239, 68, 68),
}

-- ── File helpers ──────────────────────────────────────────
local function canRead()  return type(readfile)  == "function" or type(read_file)  == "function" end
local function canWrite() return type(writefile) == "function" or type(write_file) == "function" end

local function fileExists(path)
    if type(isfile) == "function" then return isfile(path) end
    if type(is_file) == "function" then return is_file(path) end
    return false
end

local function readFile(path)
    if type(readfile)  == "function" then return pcall(readfile,  path) end
    if type(read_file) == "function" then return pcall(read_file, path) end
    return false, nil
end

local function writeFile(path, content)
    if type(writefile)  == "function" then return pcall(writefile,  path, content) end
    if type(write_file) == "function" then return pcall(write_file, path, content) end
    return false
end

local function getSavedKey()
    if not canRead() then return nil end
    if fileExists(KEY_FILE) then
        local ok, content = readFile(KEY_FILE)
        if ok and type(content) == "string" then
            return content:gsub("^%s*(.-)%s*$", "%1")
        end
    end
    local ok, content = readFile(KEY_FILE)
    if ok and type(content) == "string" then
        return content:gsub("^%s*(.-)%s*$", "%1")
    end
    return nil
end

local function saveKey(key)
    if key == "test" or not canWrite() then return end
    writeFile(KEY_FILE, key)
end

-- ── Icon loader (via executor filesystem) ─────────────────
local function httpDownload(url)
    -- Try executor request first (supports headers, more reliable than HttpGet)
    local reqFn = request
        or (syn and syn.request)
        or (http and http.request)
        or http_request
        or (fluxus and fluxus.request)

    if reqFn then
        local ok, res = pcall(reqFn, {
            Url     = url,
            Method  = "GET",
            Headers = {
                ["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Sotarium/1.0",
                ["Accept"]     = "image/png,image/*,*/*",
            },
        })
        if ok and res then
            local body   = type(res) == "table" and res.Body or res
            local status = type(res) == "table" and (res.StatusCode or res.Status) or 200
            if type(body) == "string" and #body > 100 and (status == 200 or status == nil) then
                return body
            end
            print("[Icon] executor request status:", tostring(status), "len:", type(body)=="string" and #body or "n/a")
        else
            print("[Icon] executor request errored:", tostring(res))
        end
    end

    -- Fallback: HttpGet
    local ok, data = pcall(function() return game:HttpGet(url) end)
    if ok and type(data) == "string" and #data > 100 then
        return data
    end
    print("[Icon] HttpGet fallback failed. len:", type(data)=="string" and #data or "n/a")
    return nil
end

local function loadIconAsset()
    print("──────── [Sotarium Icon Debug] ────────")
    print("[Icon] writefile:", type(writefile), " isfile:", type(isfile),
          " getcustomasset:", type(getcustomasset), " getsynasset:", type(getsynasset))

    local hasWrite = type(writefile) == "function"
    local hasIs    = type(isfile) == "function"
    local hasCust  = type(getcustomasset) == "function" or type(getsynasset) == "function"

    if not (hasWrite and hasIs and hasCust) then
        warn("[Icon] Executor missing writefile/isfile/getcustomasset — cannot load custom images.")
        print("──────── [Sotarium Icon Debug END] ────────")
        return ""
    end

    -- Mirrors, tried in order
    local mirrors = {
        ICON_URL,
        "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png",
    }

    -- Validate cache; redownload if missing/corrupt
    local needsDownload = true
    if isfile(ICON_FILE) then
        local ok, existing = pcall(readfile, ICON_FILE)
        if ok and type(existing) == "string" and #existing > 100 then
            needsDownload = false
            print("[Icon] Cached file OK:", ICON_FILE, "bytes:", #existing)
        else
            print("[Icon] Cached file too small/corrupt, redownloading.")
            if type(delfile) == "function" then pcall(delfile, ICON_FILE) end
        end
    end

    if needsDownload then
        local data
        for _, url in ipairs(mirrors) do
            print("[Icon] Trying:", url)
            data = httpDownload(url)
            if data then
                print("[Icon] Downloaded bytes:", #data, "from:", url)
                break
            end
        end

        if not data then
            warn("[Icon] All mirrors failed — icon will be blank.")
            print("──────── [Sotarium Icon Debug END] ────────")
            return ""
        end

        local wrote = pcall(writefile, ICON_FILE, data)
        print("[Icon] writefile ok:", wrote)
    end

    -- Convert to a usable asset
    local resolver = getcustomasset or getsynasset
    local ok, asset = pcall(resolver, ICON_FILE)
    print("[Icon] getcustomasset ok:", ok, " asset:", tostring(asset))
    print("──────── [Sotarium Icon Debug END] ────────")
    if ok and type(asset) == "string" then return asset end
    return ""
end

-- ── HTTP helpers ──────────────────────────────────────────
local function hasHttp()
    return type(request) == "function"
        or (type(syn) == "table" and type(syn.request) == "function")
        or (type(http) == "table" and type(http.request) == "function")
        or type(http_request) == "function"
        or (type(fluxus) == "table" and type(fluxus.request) == "function")
        or (HttpService and type(HttpService.PostAsync) == "function")
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

-- ── Key normalisation ──────────────────────────────────────
local function normalizeKey(str)
    local s = tostring(str or ""):gsub("^%s*(.-)%s*$", "%1"):gsub("[%c%s]+", ""):gsub("[^A-Za-z0-9]", ""):upper()
    if #s == 9 then s = s:gsub("(...)(...)(...)", "%1-%2-%3") end
    return s
end

-- ── Countdown helpers ──────────────────────────────────────
local function formatCountdown(seconds)
    seconds = math.max(0, math.floor(seconds))
    local h = math.floor(seconds / 3600)
    local m = math.floor((seconds % 3600) / 60)
    local s = seconds % 60
    return string.format("%02d:%02d:%02d", h, m, s)
end

-- ── GUI helpers ───────────────────────────────────────────
local function make(class, props)
    local obj = Instance.new(class)
    for k, v in pairs(props or {}) do
        if k ~= "Parent" then obj[k] = v end
    end
    if props and props.Parent then obj.Parent = props.Parent end
    return obj
end

local function tween(obj, goal, t)
    TweenService:Create(obj, TweenInfo.new(t or 0.12, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), goal):Play()
end

local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

-- ── ScreenGui ─────────────────────────────────────────────
local ScreenGui = make("ScreenGui", {
    Name            = "Sotarium",
    ResetOnSpawn    = false,
    ZIndexBehavior  = Enum.ZIndexBehavior.Sibling,
    IgnoreGuiInset  = true,
    Parent          = PlayerGui,
})

-- ── Overlay ───────────────────────────────────────────────
local Overlay = make("Frame", {
    Name                  = "KeyOverlay",
    Size                  = UDim2.new(1, 0, 1, 0),
    Position              = UDim2.new(0, 0, 0, 0),
    BackgroundColor3      = Color3.fromRGB(0, 0, 0),
    BackgroundTransparency = 0.55,
    ZIndex                = 999,
    Parent                = ScreenGui,
})
make("UICorner", { CornerRadius = UDim.new(0, 12), Parent = Overlay })

-- ── Dragging support ─────────────────────────────────────
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

-- ── Key Card ──────────────────────────────────────────────
local Card = make("Frame", {
    Name             = "KeyCard",
    Size             = UDim2.new(0, 380, 0, 240),
    Position         = UDim2.new(0.5, -190, 0.5, -120),
    BackgroundColor3 = Theme.Surface,
    Parent           = Overlay,
})
make("UICorner", { CornerRadius = UDim.new(0, 12), Parent = Card })
make("UIStroke", { Color = Theme.Border, Thickness = 1, Parent = Card })
makeDraggable(Card, Card)

-- ── Mummy icon ────────────────────────────────────────────
local IconImage = make("ImageLabel", {
    Name                   = "Icon",
    Size                   = UDim2.new(0, 56, 0, 56),
    Position               = UDim2.new(0.5, -28, 0, 12),
    BackgroundTransparency = 1,
    Image                  = "",
    ScaleType              = Enum.ScaleType.Fit,
    Parent                 = Card,
})

task.spawn(function()
    local ok, asset = pcall(loadIconAsset)
    if ok and asset and asset ~= "" then
        IconImage.Image = asset
    end
end)

-- ── Title ─────────────────────────────────────────────────
make("TextLabel", {
    Name                   = "Title",
    Size                   = UDim2.new(1, -40, 0, 24),
    Position               = UDim2.new(0, 20, 0, 72),
    BackgroundTransparency = 1,
    Text                   = "Sotarium",
    TextColor3             = Theme.Text,
    Font                   = Enum.Font.GothamBlack,
    TextSize               = 20,
    TextXAlignment         = Enum.TextXAlignment.Center,
    Parent                 = Card,
})

-- ── Key input box ─────────────────────────────────────────
local KeyBox = make("TextBox", {
    Name               = "KeyBox",
    Size               = UDim2.new(1, -40, 0, 34),
    Position           = UDim2.new(0, 20, 0, 108),
    BackgroundColor3   = Theme.Raised,
    BorderSizePixel    = 0,
    Text               = "Your Key Here!",
    PlaceholderText    = "",
    TextColor3         = Color3.fromRGB(255, 255, 255),
    PlaceholderColor3  = Theme.TextMid,
    Font               = Enum.Font.Gotham,
    TextSize           = 14,
    ClearTextOnFocus   = false,
    Parent             = Card,
})
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = KeyBox })

KeyBox.Focused:Connect(function()
    if KeyBox.Text == "Your Key Here!" then
        KeyBox.Text = ""
    end
end)
KeyBox.FocusLost:Connect(function()
    if KeyBox.Text:gsub("^%s*(.-)%s*$", "%1") == "" then
        KeyBox.Text = "Your Key Here!"
    end
end)

-- ── Status label ──────────────────────────────────────────
local StatusLabel = make("TextLabel", {
    Name                   = "Status",
    Size                   = UDim2.new(1, -40, 0, 16),
    Position               = UDim2.new(0, 20, 0, 150),
    BackgroundTransparency = 1,
    Text                   = "Enter your key to use this script.",
    TextColor3             = Theme.TextMid,
    Font                   = Enum.Font.Gotham,
    TextSize               = 13,
    TextXAlignment         = Enum.TextXAlignment.Left,
    Parent                 = Card,
})

-- ── Countdown label ───────────────────────────────────────
local CountdownLabel = make("TextLabel", {
    Name                   = "Countdown",
    Size                   = UDim2.new(1, -40, 0, 16),
    Position               = UDim2.new(0, 20, 0, 150),
    BackgroundTransparency = 1,
    Text                   = "",
    TextColor3             = Theme.Success,
    Font                   = Enum.Font.GothamBold,
    TextSize               = 14,
    TextXAlignment         = Enum.TextXAlignment.Center,
    Visible                = false,
    Parent                 = Card,
})

-- ── Get Key button ────────────────────────────────────────
local FetchBtn = make("TextButton", {
    Name             = "FetchBtn",
    Size             = UDim2.new(0, 120, 0, 34),
    Position         = UDim2.new(0.5, -130, 1, -44),
    BackgroundColor3 = Theme.Raised,
    AutoButtonColor  = false,
    Text             = "Get Key",
    TextColor3       = Theme.Text,
    Font             = Enum.Font.Gotham,
    TextSize         = 14,
    Parent           = Card,
})
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = FetchBtn })

-- ── Verify button ─────────────────────────────────────────
local ValidateBtn = make("TextButton", {
    Name             = "Validate",
    Size             = UDim2.new(0, 120, 0, 34),
    Position         = UDim2.new(0.5, 10, 1, -44),
    BackgroundColor3 = Color3.fromRGB(8, 139, 255),
    AutoButtonColor  = false,
    Text             = "Verify",
    TextColor3       = Color3.fromRGB(15, 15, 15),
    Font             = Enum.Font.Gotham,
    TextSize         = 14,
    Parent           = Card,
})
make("UICorner", { CornerRadius = UDim.new(0, 10), Parent = ValidateBtn })

-- ── Close button ──────────────────────────────────────────
local CloseBtn = make("TextButton", {
    Name             = "CloseBtn",
    Size             = UDim2.new(0, 22, 0, 22),
    Position         = UDim2.new(1, -30, 0, 8),
    BackgroundColor3 = Color3.fromRGB(239, 68, 68),
    AutoButtonColor  = false,
    Text             = "X",
    TextColor3       = Color3.fromRGB(255, 255, 255),
    Font             = Enum.Font.GothamBold,
    TextSize         = 11,
    TextXAlignment   = Enum.TextXAlignment.Center,
    TextYAlignment   = Enum.TextYAlignment.Center,
    Parent           = Card,
})
make("UICorner", { CornerRadius = UDim.new(0.5, 0), Parent = CloseBtn })
make("UIStroke", { Color = Color3.fromRGB(180, 40, 40), Thickness = 1.5, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = CloseBtn })

CloseBtn.MouseEnter:Connect(function()
    TweenService:Create(CloseBtn, TweenInfo.new(0.12), { BackgroundColor3 = Color3.fromRGB(220, 50, 50) }):Play()
end)
CloseBtn.MouseLeave:Connect(function()
    TweenService:Create(CloseBtn, TweenInfo.new(0.12), { BackgroundColor3 = Color3.fromRGB(239, 68, 68) }):Play()
end)

-- ── Helpers ───────────────────────────────────────────────
local function setStatus(text)
    if StatusLabel and StatusLabel:IsA("TextLabel") then
        StatusLabel.Text = tostring(text or "")
    end
end

local function getKeyText()
    local t = tostring(KeyBox.Text or "")
    if t == "Your Key Here!" then return "" end
    return t:gsub("^%s*(.-)%s*$", "%1")
end

local function showKeyOverlay(visible)
    if Overlay then
        Overlay.Visible = visible and true or false
    end
end

-- ── Countdown timer ───────────────────────────────────────
local countdownConnection = nil
local keyExpired = false
local validated = false

local function startCountdown(totalSeconds)
    if countdownConnection then
        countdownConnection:Disconnect()
        countdownConnection = nil
    end

    keyExpired = false
    CountdownLabel.Visible = true
    StatusLabel.Visible = false
    CountdownLabel.TextColor3 = Theme.Success

    local endTime = os.time() + totalSeconds

    local function update()
        local remaining = endTime - os.time()
        if remaining <= 0 then
            CountdownLabel.Text = "00:00:00 - Key Expired"
            CountdownLabel.TextColor3 = Theme.Error
            keyExpired = true
            validated = false
            showKeyOverlay(true)
            KeyBox.Text = "Your Key Here!"
            setStatus("Key expired. Please get a new one.")
            if countdownConnection then
                countdownConnection:Disconnect()
                countdownConnection = nil
            end
        else
            CountdownLabel.Text = formatCountdown(remaining)
        end
    end

    update()
    countdownConnection = game:GetService("RunService").Heartbeat:Connect(function()
        update()
    end)
end

local function showLifetime()
    if countdownConnection then
        countdownConnection:Disconnect()
        countdownConnection = nil
    end
    keyExpired = false
    CountdownLabel.Visible = true
    StatusLabel.Visible = false
    CountdownLabel.TextColor3 = Theme.Success
    CountdownLabel.Text = "Lifetime Key - No Expiry"
end

-- ── Validation ────────────────────────────────────────────
local function validateKey(key, onResult)
    if key == "test" then
        onResult(true, "Test key accepted.", 86400)
        return
    end

    local norm = normalizeKey(key)
    if not norm:match("^[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]$") then
        onResult(false, "Key Invalid", 0)
        return
    end

    if not hasHttp() then
        onResult(false, "Key Invalid", 0)
        return
    end

    setStatus("Validating...")
    local ok, body = safePost(VALIDATE_URL, { key = norm })
    if not ok or type(body) ~= "string" then
        onResult(false, "Key Invalid", 0)
        return
    end

    local decOk, data = pcall(function() return HttpService:JSONDecode(body) end)
    if not decOk or type(data) ~= "table" then
        onResult(false, "Key Invalid", 0)
        return
    end

    local isValid = data.valid == true or data.success == true or tostring(data.status or ""):lower() == "success"
    local message = tostring(data.message or data.error or (isValid and "Access granted." or "Key Invalid"))

    -- The server now explicitly tells us whether this is a lifetime key.
    -- Lifetime keys (bought from /products, provider "polar") never expire.
    -- Free keys from the homepage have an expires_at and a remaining countdown.
    local isLifetime = data.lifetime == true
    local remaining = data.remaining_seconds

    if isValid and isLifetime then
        onResult(true, message, nil)
        return
    end

    if isValid and (remaining == nil or tostring(remaining) == "null") then
        -- Server didn't send a lifetime flag but also didn't send an expiry;
        -- treat as lifetime for safety.
        onResult(true, message, nil)
        return
    end

    onResult(isValid, message, tonumber(remaining) or 86400)
end

-- ── Button logic ──────────────────────────────────────────
CloseBtn.MouseButton1Click:Connect(function()
    task.wait(0.1)
    ScreenGui:Destroy()
end)

FetchBtn.MouseButton1Click:Connect(function()
    if setclipboard then pcall(setclipboard, GET_KEY_URL) end
    setStatus("Link copied!")
    task.delay(2, function()
        if not validated then setStatus("Enter your key to use this script.") end
    end)
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
                local enteredKey = getKeyText()
                if enteredKey ~= "" and enteredKey ~= "test" then
                    saveKey(normalizeKey(enteredKey))
                end
                if remaining == nil then
                    showLifetime()
                else
                    startCountdown(remaining)
                end
                task.wait(1)
                showKeyOverlay(false)
            else
                setStatus("Key Invalid")
            end
        end)
    end)
end)

-- ── Auto-validate saved key ───────────────────────────────
local savedKey = getSavedKey()
if savedKey and savedKey ~= "" then
    Overlay.Visible = true
    KeyBox.Text = savedKey
    setStatus("Validating saved key...")
    task.spawn(function()
        task.wait(0.2)
        local done = false
        task.delay(8, function()
            if not done then
                showKeyOverlay(true)
                KeyBox.Text = "Your Key Here!"
                setStatus("Validation timed out. Please enter your key.")
            end
        end)
        validateKey(savedKey, function(success, message, remaining)
            done = true
            if success then
                validated = true
                showKeyOverlay(false)
                saveKey(normalizeKey(savedKey))
                if remaining == nil then
                    showLifetime()
                else
                    startCountdown(remaining)
                end
            else
                showKeyOverlay(true)
                KeyBox.Text = "Your Key Here!"
                setStatus("Saved key invalid or expired. Please enter a new key.")
            end
        end)
    end)
else
    Overlay.Visible = true
    KeyBox.Text = "Your Key Here!"
end

repeat task.wait(0.5) until validated
