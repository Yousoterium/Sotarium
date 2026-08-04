
if getgenv().Library then
    getgenv().Library:Unload()
end

do
    local cache = {}
    local baseFolder = "assets/ids"
    local githubBase = "https://raw.githubusercontent.com/dano0011/12/refs/heads/main/ids/"

    if not isfolder("assets") then makefolder("assets") end
    if not isfolder(baseFolder) then makefolder(baseFolder) end

    getgenv().getAsset = function(filename)
        assert(type(filename) == "string", "filename must be string")
        local path = baseFolder .. "/" .. filename
        if cache[path] then return cache[path] end
        if not isfile(path) then
            local url = githubBase .. filename
            local data = game:HttpGet(url, true)
            writefile(path, data)
        end
        local assetUrl = getcustomasset(path)
        cache[path] = assetUrl
        return assetUrl
    end
end

local Library do
    local cloneref = cloneref or function(x) return x end

    local Workspace = cloneref(game:GetService("Workspace"))
    local UserInputService = cloneref(game:GetService("UserInputService"))
    local Players = cloneref(game:GetService("Players"))
    local HttpService = cloneref(game:GetService("HttpService"))
    local RunService = cloneref(game:GetService("RunService"))
    local CoreGui = cloneref(game:GetService("CoreGui"))
    local TweenService = cloneref(game:GetService("TweenService"))
    local MarketplaceService = cloneref(game:GetService("MarketplaceService"))
    local Lighting = cloneref(game:GetService("Lighting"))
    local StarterGui = cloneref(game:GetService("StarterGui"))
    local TeleportService = cloneref(game:GetService("TeleportService"))
    local Stats = cloneref(game:GetService("Stats"))

    local gethui = gethui or function() return CoreGui end
    local LocalPlayer = cloneref(Players.LocalPlayer)
    local Camera = cloneref(Workspace.CurrentCamera)
    local Mouse = cloneref(LocalPlayer:GetMouse())

    local Content = Players:GetUserThumbnailAsync(LocalPlayer.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size420x420)
    local StreamerContent = "rbxassetid://80377955535798"
    local StreamerName = "Anonymous"

    local FromRGB = Color3.fromRGB
    local FromHSV = Color3.fromHSV
    local FromHex = Color3.fromHex
    local RGBSequence = ColorSequence.new
    local RGBSequenceKeypoint = ColorSequenceKeypoint.new
    local NumSequence = NumberSequence.new
    local NumSequenceKeypoint = NumberSequenceKeypoint.new

    local UDim2New = UDim2.new
    local UDim2FromOffset = UDim2.fromOffset
    local UDim2FromScale = UDim2.fromScale
    local UDimNew = UDim.new

    local Vector2New = Vector2.new
    local Vector3New = Vector3.new

    local MathClamp = math.clamp
    local MathFloor = math.floor
    local MathRandom = math.random
    local MathAbs = math.abs
    local MathSin = math.sin

    local OsDate = os.date
    local OsClock = os.clock

    local TableInsert = table.insert
    local TableFind = table.find
    local TableRemove = table.remove
    local TableConcat = table.concat
    local TableClone = table.clone
    local TableUnpack = table.unpack

    local StringFormat = string.format
    local StringFind = string.find
    local StringGSub = string.gsub
    local StringLower = string.lower
    local StringSub = string.sub
    local StringLen = string.len

    local InstanceNew = Instance.new
    local RectNew = Rect.new

    local UPDATE_REJOIN_SCRIPT = 'loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/d8824b23a4d9f2e0d62b4e69397d206b.lua"))()'

    local IsMobile = false
    local UseTouchEvents = false

    if UserInputService.TouchEnabled and not UserInputService.KeyboardEnabled and not UserInputService.MouseEnabled then
        IsMobile = true
    elseif UserInputService.TouchEnabled and UserInputService.KeyboardEnabled and UserInputService.MouseEnabled then
        IsMobile = true
    end

    UseTouchEvents = IsMobile and not UserInputService.MouseEnabled

    Library = {
        Theme = {},
        GlobalChat = {
            HttpUrl = "http://109.199.111.222:3000",
            WsUrl = "ws://109.199.111.222:3000/ws",
            Token = "gchat_live_e3f8a2d5b9c10476",
            PollInterval = 3,
            MessageLimit = 50,
            PresenceInterval = 5,
            RetryDelay = 5,
            AutoConnect = true,
            AutoCreate = true,
            TabName = "Global Chat",
            SubTabName = "Chat",
            InitialStatusText = "Connecting...",
            SlowModeTimer = 1,
            AdminIds = {4298535268, 7660640471},
            FilterEnabled = true,
            FilterUrl = "https://raw.githubusercontent.com/dano0011/orion-moded/main/bll",
            MessagesCountDeletionInterval = 30,
            AnonymousMode = true
        },
        TrialManager = {
            HttpUrl = "http://109.199.111.222:3000",
            Token = "gchat_live_e3f8a2d5b9c10476",
            Cached = false,
            CachedTrialActive = false,
            CachedRemainingMs = 0,
            CachedClaimed = false,
            CachedExpired = false,
            LastKnownTrialActive = false,
            LastKnownRemainingMs = 0,
            LastKnownSyncedAt = 0,
            CachedDefaultMinutes = nil
        },
        MenuKeybind = tostring(Enum.KeyCode.Z),
        Flags = {},
        FadeSpeed = 0.25,
        Tween = {
            Time = 0.25,
            Style = Enum.EasingStyle.Cubic,
            Direction = Enum.EasingDirection.Out
        },
        Folders = {
            Directory = "Express Hub",
            Configs = "Express Hub/Configs",
            Assets = "Express Hub/Assets",
            Cache = "Express Hub/Cache"
        },
        Snowing = false,
        HideTooltips = false,
        ToggleStyle = "Toggle",
        ToggleSide = "Right",
        ExpressExtraSettings = {
            Toggle = true,
            ShowFPS = true,
            ShowPing = true,
            ShowButton = true
        },
        MarqueStyle = {
            HoverDelay = 0.7,
            PixelsPerSecond = 60
        },
        Images = {
            ["Saturation"] = {"Saturation.png", "https://github.com/sametexe001/images/blob/main/saturation.png?raw=true"},
            ["Value"] = {"Value.png", "https://github.com/sametexe001/images/blob/main/value.png?raw=true"},
            ["Hue"] = {"Hue.png", "https://github.com/sametexe001/images/blob/main/horizontalhue.png?raw=true"}
        },
        Pages = {},
        Sections = {},
        Connections = {},
        CleanupCallbacks = {},
        Threads = {},
        ThemeMap = {},
        ThemeItems = {},
        OpenFrames = {},
        SearchItems = {},
        CurrentPage = nil,
        SetFlags = {},
        DefaultFlags = {},
        AutoSaveExcludedFlags = {
            ConfigsList = true,
            ConfigName = true,
            ConfigAutoload = true,
            SharedConfigText = true,
            AutoSaveConfig = true
        },
        AutoSaveReady = false,
        AutoSaveApplying = false,
        UnnamedConnections = 0,
        UnnamedFlags = 0,
        Holder = nil,
        NotifHolder = nil,
        UnusedHolder = nil,
        Font = nil,
        Elements = {},
        Subfont = nil,
        ToggleStyleCallbacks = {}
    }

    Library.__index = Library
    Library.Pages.__index = Library.Pages
    Library.Sections.__index = Library.Sections

    Library.RegisterToggleStyleCallback = function(self, Callback)
        TableInsert(self.ToggleStyleCallbacks, Callback)
    end

    Library.SetToggleStyle = function(self, Style)
        local NewStyle = Style == "Checkbox" and "Checkbox" or "Toggle"
        if self.ToggleStyle == NewStyle then return end
        self.ToggleStyle = NewStyle
        for _, Callback in self.ToggleStyleCallbacks do Callback(NewStyle) end
    end

    Library.SetToggleSide = function(self, Side)
        local NewSide = Side == "Left" and "Left" or "Right"
        if self.ToggleSide == NewSide then return end
        self.ToggleSide = NewSide
        for _, Callback in self.ToggleStyleCallbacks do Callback(NewSide) end
    end

    local RequestFunction = request or http_request or (syn and syn.request) or (http and http.request)

    local WebSocketFunction = nil
    for _, Provider in ipairs({WebSocket, websocket, syn and syn.websocket}) do
        local Connect = Provider and Provider.connect
        if type(Connect) == "function" then
            WebSocketFunction = function(Url) return Connect(Url) end
            break
        end
    end

    local SocketSendMethods = {"Send", "send"}
    local SocketCloseMethods = {"Close", "close"}

    local function TrySocketMethod(Socket, Methods, ...)
        if not Socket then return false end
        for _, MethodName in ipairs(Methods) do
            local Method = Socket[MethodName]
            if type(Method) == "function" then
                return pcall(Method, Socket, ...)
            end
        end
        return false
    end

    local function ConnectSocketSignal(Signal, Callback, Socket)
        if not Signal or type(Callback) ~= "function" then return nil end
        local SignalType = typeof(Signal)
        if SignalType == "RBXScriptSignal" then
            return Signal:Connect(Callback)
        end
        if type(Signal) == "table" and type(Signal.Connect) == "function" then
            return Signal:Connect(Callback)
        end
        if type(Signal) == "function" then
            local Success, Result = pcall(function() return Signal(Socket, Callback) end)
            if Success then return Result end
            Success, Result = pcall(function() return Signal(Callback) end)
            if Success then return Result end
        end
        return nil
    end

    local function SocketSend(Socket, Payload)
        return TrySocketMethod(Socket, SocketSendMethods, Payload)
    end

    local function SocketClose(Socket)
        TrySocketMethod(Socket, SocketCloseMethods)
    end

    local function MergeTable(Base, Extra)
        local NewTable = TableClone(Base)
        if type(Extra) ~= "table" then return NewTable end
        for Index, Value in Extra do NewTable[Index] = Value end
        return NewTable
    end

    local function JsonEncode(Data)
        local Success, Result = pcall(function() return HttpService:JSONEncode(Data) end)
        if not Success then return nil end
        return Result
    end

    local function JsonDecode(Data)
        if type(Data) ~= "string" or Data == "" then return nil end
        local Success, Result = pcall(function() return HttpService:JSONDecode(Data) end)
        if not Success then return nil end
        return Result
    end

    local CachedPlaceName = tostring(game.Name or "This Experience")
    local PlaceNameLookupStarted = false
    local PlaceNameResolved = false
    local PlaceNameCallbacks = {}

    local function ResolvePlaceName(Callback)
        if type(Callback) == "function" then
            if PlaceNameResolved then
                pcall(Callback, CachedPlaceName)
            else
                TableInsert(PlaceNameCallbacks, Callback)
            end
        end
        if PlaceNameLookupStarted then return CachedPlaceName end
        PlaceNameLookupStarted = true
        task.defer(function()
            local ResolvedName = CachedPlaceName
            pcall(function()
                local Info = MarketplaceService:GetProductInfo(game.PlaceId)
                local Name = tostring(Info and Info.Name or "")
                if Name ~= "" then ResolvedName = Name end
            end)
            CachedPlaceName = ResolvedName ~= "" and ResolvedName or tostring(game.Name or "This Experience")
            PlaceNameResolved = true
            local Callbacks = PlaceNameCallbacks
            PlaceNameCallbacks = {}
            for _, PendingCallback in Callbacks do pcall(PendingCallback, CachedPlaceName) end
        end)
        return CachedPlaceName
    end

    local function BuildUrl(BaseUrl, Query)
        if type(Query) ~= "table" then return BaseUrl end
        local Segments = {}
        for Index, Value in Query do
            if Value ~= nil and Value ~= "" then
                TableInsert(Segments, HttpService:UrlEncode(tostring(Index)) .. "=" .. HttpService:UrlEncode(tostring(Value)))
            end
        end
        if #Segments == 0 then return BaseUrl end
        return BaseUrl .. (StringFind(BaseUrl, "?", 1, true) and "&" or "?") .. TableConcat(Segments, "&")
    end

    Library.RegisterCleanupCallback = function(self, Callback)
        if type(Callback) ~= "function" then return end
        TableInsert(self.CleanupCallbacks, Callback)
    end

    local Themes = {
        ["Preset"] = {
            ["Background"] = FromRGB(17, 16, 20),
            ["Inline"] = FromRGB(26, 25, 31),
            ["Accent"] = FromRGB(255, 0, 255),
            ["Text"] = FromRGB(255, 255, 255),
            ["Element"] = FromRGB(41, 40, 49),
            ["Hovered Element"] = FromRGB(51, 50, 59),
            ["Border"] = FromRGB(36, 33, 42),
            ["Gradient"] = FromRGB(218, 218, 218)
        }
    }

    Library.Theme = TableClone(Themes["Preset"])

    local Keys = {
        ["Unknown"] = "Unknown", ["Backspace"] = "Back", ["Tab"] = "Tab",
        ["Clear"] = "Clear", ["Return"] = "Return", ["Pause"] = "Pause",
        ["Escape"] = "Escape", ["Space"] = "Space", ["QuotedDouble"] = '"',
        ["Hash"] = "#", ["Dollar"] = "$", ["Percent"] = "%",
        ["Ampersand"] = "&", ["Quote"] = "'", ["LeftParenthesis"] = "(",
        ["RightParenthesis"] = " )", ["Asterisk"] = "*", ["Plus"] = "+",
        ["Comma"] = ",", ["Minus"] = "-", ["Period"] = ".",
        ["Slash"] = "`", ["Three"] = "3", ["Seven"] = "7", ["Eight"] = "8",
        ["Colon"] = ":", ["Semicolon"] = ";", ["LessThan"] = "<",
        ["GreaterThan"] = ">", ["Question"] = "?", ["Equals"] = "=",
        ["At"] = "@", ["LeftBracket"] = "LeftBracket", ["RightBracket"] = "RightBracked",
        ["BackSlash"] = "BackSlash", ["Caret"] = "^", ["Underscore"] = "_",
        ["Backquote"] = "`", ["LeftCurly"] = "{", ["Pipe"] = "|",
        ["RightCurly"] = "}", ["Tilde"] = "~", ["Delete"] = "Delete",
        ["End"] = "End", ["KeypadZero"] = "Keypad0", ["KeypadOne"] = "Keypad1",
        ["KeypadTwo"] = "Keypad2", ["KeypadThree"] = "Keypad3",
        ["KeypadFour"] = "Keypad4", ["KeypadFive"] = "Keypad5",
        ["KeypadSix"] = "Keypad6", ["KeypadSeven"] = "Keypad7",
        ["KeypadEight"] = "Keypad8", ["KeypadNine"] = "Keypad9",
        ["KeypadPeriod"] = "KeypadP", ["KeypadDivide"] = "KeypadD",
        ["KeypadMultiply"] = "KeypadM", ["KeypadMinus"] = "KeypadM",
        ["KeypadPlus"] = "KeypadP", ["KeypadEnter"] = "KeypadE",
        ["KeypadEquals"] = "KeypadE", ["Insert"] = "Insert", ["Home"] = "Home",
        ["PageUp"] = "PageUp", ["PageDown"] = "PageDown",
        ["RightShift"] = "RightShift", ["LeftShift"] = "LeftShift",
        ["RightControl"] = "RightControl", ["LeftControl"] = "LeftControl",
        ["LeftAlt"] = "LeftAlt", ["RightAlt"] = "RightAlt"
    }

    for Index, Value in Library.Folders do
        if not isfolder(Value) then makefolder(Value) end
    end

    for Index, Value in Library.Images do
        local ImageData = Value
        local ImageName = ImageData[1]
        local ImageLink = ImageData[2]
        if not isfile(Library.Folders.Assets .. "/" .. ImageName) then
            writefile(Library.Folders.Assets .. "/" .. ImageName, game:HttpGet(ImageLink))
        end
    end

    local Tween = {}
    do
        Tween.__index = Tween

        Tween.Create = function(self, Item, Info, Goal, IsRawItem)
            if not Library then return end
            Item = IsRawItem and Item or Item.Instance
            Info = Info or TweenInfo.new(Library.Tween.Time, Library.Tween.Style, Library.Tween.Direction)
            local NewTween = {
                Tween = TweenService:Create(Item, Info, Goal),
                Info = Info,
                Goal = Goal,
                Item = Item
            }
            NewTween.Tween:Play()
            setmetatable(NewTween, Tween)
            return NewTween
        end

        Tween.GetProperty = function(self, Item)
            Item = Item or self.Item
            if Item:IsA("Frame") then
                return {"BackgroundTransparency"}
            elseif Item:IsA("TextLabel") or Item:IsA("TextButton") then
                return {"TextTransparency", "BackgroundTransparency"}
            elseif Item:IsA("ImageLabel") or Item:IsA("ImageButton") then
                return {"BackgroundTransparency", "ImageTransparency"}
            elseif Item:IsA("ScrollingFrame") then
                return {"BackgroundTransparency", "ScrollBarImageTransparency"}
            elseif Item:IsA("TextBox") then
                return {"TextTransparency", "BackgroundTransparency"}
            elseif Item:IsA("UIStroke") then
                return {"Transparency"}
            end
        end

        Tween.FadeItem = function(self, Item, Property, Visibility, Speed)
            local Item = Item or self.Item
            local OldTransparency = Item[Property]
            Item[Property] = Visibility and 1 or OldTransparency
            local NewTween = Tween:Create(Item, TweenInfo.new(Speed or Library.FadeSpeed, Library.Tween.Style, Library.Tween.Direction), {[Property] = Visibility and OldTransparency or 1}, true)
            NewTween.Tween.Completed:Once(function()
                if not Visibility then
                    task.wait()
                    Item[Property] = OldTransparency
                end
            end)
            return NewTween
        end

        Tween.Get = function(self)
            if not self.Tween then return end
            return self.Tween, self.Info, self.Goal
        end

        Tween.Pause = function(self)
            if not self.Tween then return end
            self.Tween:Pause()
        end

        Tween.Play = function(self)
            if not self.Tween then return end
            self.Tween:Play()
        end

        Tween.Clean = function(self)
            if not self.Tween then return end
            Tween:Pause()
            self = nil
        end
    end

    local Instances = {}
    do
        Instances.__index = Instances

        Instances.Create = function(self, Class, Properties)
            local NewItem = {
                Instance = InstanceNew(Class),
                Properties = Properties,
                Class = Class
            }
            setmetatable(NewItem, Instances)
            for Property, Value in NewItem.Properties do
                NewItem.Instance[Property] = Value
            end
            return NewItem
        end

        Instances.AddToTheme = function(self, Properties)
            if not self.Instance then return end
            Library:AddToTheme(self, Properties)
        end

        Instances.ChangeItemTheme = function(self, Properties)
            if not self.Instance then return end
            Library:ChangeItemTheme(self, Properties)
        end

        Instances.Connect = function(self, Event, Callback, Name)
            if not self.Instance then return end
            if not self.Instance[Event] then return end
            if Event == "MouseButton1Down" or Event == "MouseButton1Click" then
                if UseTouchEvents then Event = "TouchTap" end
            elseif Event == "MouseButton2Down" or Event == "MouseButton2Click" then
                if UseTouchEvents then Event = "TouchLongPress" end
            end
            return Library:Connect(self.Instance[Event], Callback, Name)
        end

        Instances.Tween = function(self, Info, Goal)
            if not self.Instance then return end
            return Tween:Create(self, Info, Goal)
        end

        Instances.Disconnect = function(self, Name)
            if not self.Instance then return end
            return Library:Disconnect(Name)
        end

        Instances.Tooltip = function(self, Text)
            if not self.Instance then return end
            if Text == nil then return end
            if type(Text) ~= "string" then return end
            local Gui = self.Instance
            local MouseLocation = UserInputService:GetMouseLocation()
            local InputChangedConnection
            local Items = {}

            local function UpdateTooltipPosition()
                MouseLocation = UserInputService:GetMouseLocation()
                Items["Tooltip"].Instance.Position = UDim2New(0, MouseLocation.X + 8, 0, MouseLocation.Y - 35)
            end

            do
                Items["Tooltip"] = Instances:Create("Frame", {
                    Parent = Library.Holder.Instance,
                    Name = "\0",
                    BackgroundColor3 = FromRGB(15, 12, 16),
                    BorderSizePixel = 0,
                    Position = UDim2New(0, Gui.AbsolutePosition.X, 0, Gui.AbsolutePosition.Y),
                    Size = UDim2New(0, 0, 0, 0),
                    BackgroundTransparency = 1,
                    Visible = true,
                    AutomaticSize = Enum.AutomaticSize.XY,
                    ZIndex = 103
                })
                Items["Tooltip"]:AddToTheme({BackgroundColor3 = "Background"})
                Instances:Create("UISizeConstraint", {
                    Parent = Items["Tooltip"].Instance,
                    Name = "\0",
                    MinSize = Vector2New(0, 0),
                    MaxSize = Vector2New(235, math.huge)
                })
                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Tooltip"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Text,
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 1, 0),
                    ClipsDescendants = true,
                    ZIndex = 103,
                    Position = UDim2New(0, 0, 0, 0),
                    TextTransparency = 1,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextWrapped = true,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(15, 12, 16)
                })
                Items["Text"]:AddToTheme({TextColor3 = "Text"})
                Instances:Create("UIPadding", {
                    Parent = Items["Text"].Instance,
                    Name = "\0",
                    PaddingBottom = UDimNew(0, 6),
                    PaddingLeft = UDimNew(0, 6),
                    PaddingRight = UDimNew(0, 6),
                    PaddingTop = UDimNew(0, 6)
                })
                Items["UIStroke"] = Instances:Create("UIStroke", {
                    Parent = Items["Tooltip"].Instance,
                    Color = Library.Theme.Accent,
                    Name = "\0",
                    Transparency = 1,
                    Thickness = 1.2,
                    LineJoinMode = Enum.LineJoinMode.Round,
                    ApplyStrokeMode = Enum.ApplyStrokeMode.Border
                })
                Items["UIStroke"]:AddToTheme({Color = "Accent"})
                Instances:Create("UICorner", {
                    Parent = Items["Tooltip"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 5)
                })
            end

            local function HideTooltip()
                Items["Tooltip"]:Tween(nil, {BackgroundTransparency = 1})
                Items["Text"]:Tween(nil, {TextTransparency = 1})
                Items["UIStroke"]:Tween(nil, {Transparency = 1})
            end

            Library:Connect(Gui.MouseEnter, function()
                if Library.HideTooltips then return end
                UpdateTooltipPosition()
                Items["Tooltip"]:Tween(nil, {BackgroundTransparency = 0})
                Items["Text"]:Tween(nil, {TextTransparency = 0})
                Items["UIStroke"]:Tween(nil, {Transparency = 0})
                if InputChangedConnection then InputChangedConnection:Disconnect() end
                InputChangedConnection = UserInputService.InputChanged:Connect(function(Input)
                    if Input.UserInputType == Enum.UserInputType.MouseMovement or Input.UserInputType == Enum.UserInputType.Touch then
                        UpdateTooltipPosition()
                    end
                end)
            end)

            Library:Connect(Gui.MouseLeave, function()
                HideTooltip()
                if InputChangedConnection then
                    InputChangedConnection:Disconnect()
                    InputChangedConnection = nil
                end
            end)

            if IsMobile then
                Library:Connect(UserInputService.InputBegan, function(Input)
                    if Input.UserInputType == Enum.UserInputType.Touch then
                        if not Library:IsMouseOverFrame(Items["Tooltip"]) then
                            HideTooltip()
                            if InputChangedConnection then
                                InputChangedConnection:Disconnect()
                                InputChangedConnection = nil
                            end
                        end
                    end
                end)
            end
        end

        Instances.Clean = function(self)
            if not self.Instance then return end
            Library:RemoveFromTheme(self)
            self.Instance:Destroy()
            self = nil
        end

        Instances.MakeDraggable = function(self, Target)
            if not self.Instance then return end
            local DragArea = self.Instance
            local Gui = Target and Target.Instance or self.Instance
            local Dragging = false
            local DragStart
            local StartPosition
            local InputChanged

            local IsWithin = function(Position)
                local AbsolutePosition = DragArea.AbsolutePosition
                local AbsoluteSize = DragArea.AbsoluteSize
                return Position.X >= AbsolutePosition.X and Position.X <= AbsolutePosition.X + AbsoluteSize.X and Position.Y >= AbsolutePosition.Y and Position.Y <= AbsolutePosition.Y + AbsoluteSize.Y
            end

            local Set = function(Position)
                local DragDelta = Position - DragStart
                Gui.Position = UDim2New(StartPosition.X.Scale, StartPosition.X.Offset + DragDelta.X, StartPosition.Y.Scale, StartPosition.Y.Offset + DragDelta.Y)
            end

            local BeginDrag = function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    Dragging = true
                    DragStart = Input.Position
                    StartPosition = Gui.Position
                    if InputChanged then InputChanged:Disconnect() end
                    InputChanged = Input.Changed:Connect(function()
                        if Input.UserInputState == Enum.UserInputState.End then
                            Dragging = false
                            if InputChanged then
                                InputChanged:Disconnect()
                                InputChanged = nil
                            end
                        end
                    end)
                end
            end

            Library:Connect(UserInputService.InputBegan, function(Input)
                if IsWithin(Input.Position) then BeginDrag(Input) end
            end)

            Library:Connect(UserInputService.InputChanged, function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseMovement or Input.UserInputType == Enum.UserInputType.Touch then
                    if Dragging then Set(Input.Position) end
                end
            end)

            return Dragging
        end

        Instances.MakeResizeable = function(self, Minimum, Maximum)
            if not self.Instance then return end
            local Gui = self.Instance
            local Resizing = false
            local Start = UDim2New()
            local Delta = UDim2New()
            local ResizeMax = Gui.Parent.AbsoluteSize - Gui.AbsoluteSize
            local InputChanged

            local ResizeButton = Instances:Create("ImageButton", {
                Parent = Gui,
                Image = "rbxassetid://7368471234",
                AnchorPoint = Vector2New(1, 1),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 13, 0, 13),
                Position = UDim2New(1, -3, 1, -3),
                Name = "\0",
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                ZIndex = 5,
                AutoButtonColor = false,
                Visible = true
            })
            ResizeButton:AddToTheme({ImageColor3 = "Accent"})
            ResizeButton:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    Resizing = true
                    Start = Gui.Size - UDim2New(0, Input.Position.X, 0, Input.Position.Y)
                    if InputChanged then return end
                    InputChanged = Input.Changed:Connect(function()
                        if Input.UserInputState == Enum.UserInputState.End then
                            Resizing = false
                            if InputChanged then
                                InputChanged:Disconnect()
                                InputChanged = nil
                            end
                        end
                    end)
                end
            end)

            Library:Connect(UserInputService.InputChanged, function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseMovement or Input.UserInputType == Enum.UserInputType.Touch then
                    if Resizing then
                        ResizeMax = Maximum or Gui.Parent.AbsoluteSize - Gui.AbsoluteSize
                        Delta = Start + UDim2New(0, Input.Position.X, 0, Input.Position.Y)
                        Delta = UDim2New(0, math.clamp(Delta.X.Offset, Minimum.X, ResizeMax.X), 0, math.clamp(Delta.Y.Offset, Minimum.Y, ResizeMax.Y))
                        Tween:Create(Gui, TweenInfo.new(0.17, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), {Size = Delta}, true)
                    end
                end
            end)

            return ResizeButton
        end

        Instances.OnHover = function(self, Function)
            if not self.Instance then return end
            return Library:Connect(self.Instance.MouseEnter, Function)
        end

        Instances.OnHoverLeave = function(self, Function)
            if not self.Instance then return end
            return Library:Connect(self.Instance.MouseLeave, Function)
        end
    end

    local CustomFont = {}
    do
        function CustomFont:New(Name, Weight, Style, Data)
            if not isfile(Data.Id) then
                writefile(Data.Id, game:HttpGet(Data.Url))
            end
            local Data = {
                name = Name,
                faces = {{
                    name = Name,
                    weight = Weight,
                    style = Style,
                    assetId = getcustomasset(Data.Id)
                }}
            }
            writefile(Library.Folders.Assets .. "/" .. Name .. ".font", HttpService:JSONEncode(Data))
            return Font.new(getcustomasset(Library.Folders.Assets .. "/" .. Name .. ".font"))
        end

        Library.Font = CustomFont:New("Inter", 400, "Regular", {
            Id = "InterSemibold",
            Url = "https://github.com/sametexe001/luas/raw/refs/heads/main/fonts/InterSemibold.ttf"
        })
        Library.Subfont = CustomFont:New("InterMedium", 400, "Regular", {
            Id = "InterMedium",
            Url = "https://github.com/sametexe001/luas/raw/refs/heads/main/fonts/InterMedium.ttf"
        })
    end

    Library.Holder = Instances:Create("ScreenGui", {
        Parent = gethui(),
        Name = "Orion",
        ZIndexBehavior = Enum.ZIndexBehavior.Global,
        DisplayOrder = 2,
        ResetOnSpawn = false
    })
    Library.UnusedHolder = Instances:Create("ScreenGui", {
        Parent = gethui(),
        Name = "\0",
        ZIndexBehavior = Enum.ZIndexBehavior.Global,
        Enabled = false
    })
    Library.NotifHolder = Instances:Create("Frame", {
        Parent = Library.Holder.Instance,
        Name = "\0",
        BorderColor3 = FromRGB(0, 0, 0),
        AnchorPoint = Vector2New(1, 0),
        BackgroundTransparency = 1,
        Position = UDim2New(1, 0, 0, 0),
        Size = UDim2New(0, 0, 1, 0),
        BorderSizePixel = 0,
        AutomaticSize = Enum.AutomaticSize.X,
        BackgroundColor3 = FromRGB(255, 255, 255)
    })
    Instances:Create("UIListLayout", {
        Parent = Library.NotifHolder.Instance,
        Name = "\0",
        VerticalAlignment = Enum.VerticalAlignment.Bottom,
        SortOrder = Enum.SortOrder.LayoutOrder,
        Padding = UDimNew(0, 12),
        HorizontalAlignment = Enum.HorizontalAlignment.Right
    })
    Instances:Create("UIPadding", {
        Parent = Library.NotifHolder.Instance,
        Name = "\0",
        PaddingTop = UDimNew(0, 12),
        PaddingBottom = UDimNew(0, 12),
        PaddingRight = UDimNew(0, 12),
        PaddingLeft = UDimNew(0, 12)
    })
    Library.AnnouncementHolder = Instances:Create("Frame", {
        Parent = Library.Holder.Instance,
        Name = "\0",
        BorderColor3 = FromRGB(0, 0, 0),
        AnchorPoint = Vector2New(0.5, 0),
        BackgroundTransparency = 1,
        Position = UDim2New(0.5, 0, 0, 0),
        Size = UDim2New(1, 0, 1, 0),
        BorderSizePixel = 0,
        BackgroundColor3 = FromRGB(255, 255, 255),
        ClipsDescendants = false
    })

    Library.Unload = function(self)
        pcall(function() if HideContextMenu then HideContextMenu() end end)
        for _, Callback in self.CleanupCallbacks do self:SafeCall(Callback) end
        for Index, Value in self.Connections do Value.Connection:Disconnect() end
        for Index, Value in self.Threads do coroutine.close(Value) end
        if self.Holder then self.Holder:Clean() end
        if self.UnusedHolder then self.UnusedHolder:Clean() end
        Library._Unloaded = true
        Library = nil
        getgenv().Library = nil
    end

    Library.GetImage = function(self, Image)
        local ImageData = self.Images[Image]
        if not ImageData then return end
        return getcustomasset(self.Folders.Assets .. "/" .. ImageData[1])
    end

    Library.Round = function(self, Number, Float)
        local Multiplier = 1 / (Float or 1)
        return MathFloor(Number * Multiplier) / Multiplier
    end

    Library.Thread = function(self, Function)
        local NewThread = coroutine.create(Function)
        coroutine.wrap(function() coroutine.resume(NewThread) end)()
        TableInsert(self.Threads, NewThread)
        return NewThread
    end

    setmetatable(Library.Threads, {__mode = "v"})

    Library.SafeCall = function(self, Function, ...)
        local Arguements = {...}
        local Success, Result = pcall(Function, TableUnpack(Arguements))
        if not Success then return false end
        return Success
    end

    Library.Connect = function(self, Event, Callback, Name)
        if not Name then
            self.UnnamedConnections = self.UnnamedConnections + 1
            Name = StringFormat("Connection%d", self.UnnamedConnections)
        end
        local NewConnection = {
            Event = Event,
            Callback = Callback,
            Name = Name,
            Connection = Event:Connect(Callback)
        }
        TableInsert(self.Connections, NewConnection)
        return NewConnection
    end

    Library.Disconnect = function(self, Name)
        for I, Connection in self.Connections do
            if Connection.Name == Name then
                Connection.Connection:Disconnect()
                TableRemove(self.Connections, I)
                break
            end
        end
    end

    Library.NextFlag = function(self)
        self.UnnamedFlags = self.UnnamedFlags + 1
        return StringFormat("flag_%d", self.UnnamedFlags)
    end

    Library.ResolveElementFlag = function(self, Flag, Name)
        if type(Flag) == "string" and StringGSub(Flag, "%s+", "") ~= "" then return Flag end
        if Flag ~= nil and type(Flag) ~= "string" then return Flag end
        if type(Name) == "string" and StringGSub(Name, "%s+", "") ~= "" then
            if self.Elements[Name] == nil and self.SetFlags[Name] == nil then return Name end
        end
        return self:NextFlag()
    end

    Library.AddToTheme = function(self, Item, Properties)
        Item = Item.Instance or Item
        local ThemeData = {Item = Item, Properties = Properties}
        for Property, Value in ThemeData.Properties do
            if type(Value) == "string" then
                Item[Property] = self.Theme[Value]
            else
                Item[Property] = Value()
            end
        end
        TableInsert(self.ThemeItems, ThemeData)
        self.ThemeMap[Item] = ThemeData
    end

    Library.RemoveFromTheme = function(self, Item)
        Item = Item.Instance or Item
        if not self.ThemeMap[Item] then return end
        self.ThemeMap[Item].Properties = nil
        self.ThemeMap[Item] = nil
        self._ThemeRemoveCount = (self._ThemeRemoveCount or 0) + 1
        if self._ThemeRemoveCount >= 200 then
            self._ThemeRemoveCount = 0
            local Compacted = {}
            for _, Entry in self.ThemeItems do
                if Entry.Properties then Compacted[#Compacted + 1] = Entry end
            end
            self.ThemeItems = Compacted
        end
    end

    Library.ChangeItemTheme = function(self, Item, Properties)
        Item = Item.Instance or Item
        if not self.ThemeMap[Item] then return end
        self.ThemeMap[Item].Properties = Properties
        self.ThemeMap[Item] = self.ThemeMap[Item]
    end

    Library.ChangeTheme = function(self, Theme, Color)
        self.Theme[Theme] = Color
        for _, Item in self.ThemeItems do
            if not Item.Properties then continue end
            for Property, Value in Item.Properties do
                if type(Value) == "string" and Value == Theme then
                    Item.Item[Property] = Color
                elseif type(Value) == "function" then
                    Item.Item[Property] = Value()
                end
            end
        end
    end

    Library.GetConfig = function(self)
        local Config = {}
        local Success, Result = Library:SafeCall(function()
            for Index, Value in Library.Flags do
                if type(Value) == "table" and Value.Key then
                    Config[Index] = {Key = tostring(Value.Key), Mode = Value.Mode}
                elseif type(Value) == "table" and Value.Color then
                    Config[Index] = {Color = "#" .. Value.Color, Alpha = Value.Alpha}
                else
                    Config[Index] = Value
                end
            end
        end)
        return HttpService:JSONEncode(Config)
    end

    Library.LoadConfig = function(self, Config)
        local Decoded = JsonDecode(Config)
        if not Decoded then return false, "Invalid config format" end
        local FailedLoads = 0

        local NormalizeConfigValue = function(Flag, Value)
            local CurrentValue = self.Flags[Flag]
            local DefaultValue = self.DefaultFlags[Flag]
            local ExpectedValue = CurrentValue ~= nil and CurrentValue or DefaultValue

            if type(Value) == "table" then
                if Value.Key then
                    if type(Value.Key) ~= "string" then return nil end
                    Value.Mode = type(Value.Mode) == "string" and Value.Mode or "Toggle"
                    return Value
                end
                if Value.Color then
                    if type(Value.Color) ~= "string" then return nil end
                    if Value.Alpha ~= nil and type(Value.Alpha) ~= "number" then Value.Alpha = tonumber(Value.Alpha) end
                    if Value.Alpha == nil or type(Value.Alpha) == "number" then return Value end
                    return nil
                end
                if type(ExpectedValue) == "table" then return Value end
                return nil
            end
            if type(ExpectedValue) == "number" then return tonumber(Value) end
            if type(ExpectedValue) == "boolean" then return type(Value) == "boolean" and Value or nil end
            if type(ExpectedValue) == "string" then return type(Value) == "string" and Value or nil end
            return Value
        end

        for Index, Value in next, Decoded do
            local SetFunction = Library.SetFlags[Index]
            if SetFunction then
                local NormalizedValue = NormalizeConfigValue(Index, Value)
                if NormalizedValue == nil then
                    FailedLoads = FailedLoads + 1
                    continue
                end
                local Success = pcall(function()
                    if type(NormalizedValue) == "table" then
                        if NormalizedValue.Key then
                            SetFunction(NormalizedValue)
                        elseif NormalizedValue.Color then
                            SetFunction(NormalizedValue.Color, NormalizedValue.Alpha)
                        else
                            SetFunction(NormalizedValue)
                        end
                    else
                        SetFunction(NormalizedValue)
                    end
                end)
                if not Success then FailedLoads = FailedLoads + 1 end
            else
                FailedLoads = FailedLoads + 1
            end
        end

        if FailedLoads > 0 then return true, "Some settings did not load because this config is outdated" end
        return true
    end

    Library.DeleteConfig = function(self, Config)
        if isfile(Library.Folders.Configs .. "/" .. Config) then delfile(Library.Folders.Configs .. "/" .. Config) end
    end

    Library.RefreshConfigsList = function(self, Element)
        local List = {}
        local ReturnList = {}
        List = listfiles(Library.Folders.Configs)
        for Index = 1, #List do
            local File = List[Index]
            if File:sub(-5) == ".json" then
                local Position = File:find(".json", 1, true)
                local StartPosition = Position
                local Character = File:sub(Position, Position)
                while Character ~= "/" and Character ~= "\\" and Character ~= "" do
                    Position = Position - 1
                    Character = File:sub(Position, Position)
                end
                if Character == "/" or Character == "\\" then
                    local Name = File:sub(Position + 1, StartPosition - 1)
                    if Name:sub(1, 1) ~= "_" then
                        TableInsert(ReturnList, Name)
                    end
                end
            end
        end
        Element:Refresh(ReturnList)
    end

    local ConfigStateFile = Library.Folders.Configs .. "/_autoload.txt"
    local AutoSaveStateFile = Library.Folders.Configs .. "/_autosave_enabled.txt"
    local AutoSaveConfigFile = Library.Folders.Configs .. "/_autosave.json"

    local function CloneConfigValue(Value)
        if type(Value) ~= "table" then return Value end
        local NewValue = {}
        for Index, Item in next, Value do NewValue[Index] = CloneConfigValue(Item) end
        return NewValue
    end

    local function CompareConfigValues(Left, Right)
        if Left == Right then return true end
        if type(Left) ~= type(Right) then return false end
        if type(Left) ~= "table" then return false end
        for Index, Value in next, Left do
            if not CompareConfigValues(Value, Right[Index]) then return false end
        end
        for Index in next, Right do if Left[Index] == nil then return false end end
        return true
    end

    local function getAutoConfig()
        if isfile(ConfigStateFile) then
            local name = readfile(ConfigStateFile)
            return name:gsub("%.json", "")
        end
    end

    local function setAutoConfig(name)
        name = name:gsub("%.json", "")
        writefile(ConfigStateFile, name)
    end

    Library.SerializeConfigValue = function(self, Value)
        if type(Value) == "table" and Value.Key then
            return {Key = tostring(Value.Key), Mode = Value.Mode, Toggled = Value.Toggled}
        elseif type(Value) == "table" and Value.Color then
            return {Color = "#" .. Value.Color, Alpha = Value.Alpha}
        end
        return CloneConfigValue(Value)
    end

    Library.RegisterDefaultFlag = function(self, Flag, Value)
        if not Flag then return end
        self.DefaultFlags[Flag] = self:SerializeConfigValue(Value)
    end

    Library.GetAutoSaveConfig = function(self)
        local Config = {}
        for Flag in next, self.SetFlags do
            if not self.AutoSaveExcludedFlags[Flag] then
                local Value = self:SerializeConfigValue(self.Flags[Flag])
                local DefaultValue = self.DefaultFlags[Flag]
                if not CompareConfigValues(Value, DefaultValue) and Value ~= nil then
                    Config[Flag] = Value
                end
            end
        end
        return JsonEncode(Config) or "{}"
    end

    Library.IsAutoSaveEnabled = function(self)
        return isfile(AutoSaveStateFile)
    end

    Library.SetAutoSaveEnabled = function(self, Enabled)
        if Enabled then
            writefile(AutoSaveStateFile, "1")
        elseif isfile(AutoSaveStateFile) then
            delfile(AutoSaveStateFile)
        end
    end

    Library.WriteAutoSaveConfig = function(self)
        if not self:IsAutoSaveEnabled() then return false end
        local Config = self:GetAutoSaveConfig()
        if Config == self._LastAutoSaveConfig and isfile(AutoSaveConfigFile) then return true end
        writefile(AutoSaveConfigFile, Config)
        self._LastAutoSaveConfig = Config
        return true
    end

    Library.QueueAutoSave = function(self)
        if not self.AutoSaveReady or self.AutoSaveApplying or not self:IsAutoSaveEnabled() then return end
        self._AutoSaveQueuedAt = OsClock()
        if self._AutoSaveQueued then return end
        self._AutoSaveQueued = true
        task.spawn(function()
            while Library and Library._AutoSaveQueued do
                if OsClock() - (Library._AutoSaveQueuedAt or 0) >= 0.35 then break end
                task.wait(0.1)
            end
            if not Library then return end
            Library._AutoSaveQueued = false
            if not Library.AutoSaveReady or Library.AutoSaveApplying or not Library:IsAutoSaveEnabled() then return end
            pcall(function() Library:WriteAutoSaveConfig() end)
        end)
    end

    Library.LoadAutoSaveConfig = function(self)
        if not self:IsAutoSaveEnabled() or not isfile(AutoSaveConfigFile) then return false end
        self.AutoSaveApplying = true
        local Success, LoadSuccess, Error = pcall(function() return self:LoadConfig(readfile(AutoSaveConfigFile)) end)
        self.AutoSaveApplying = false
        if not Success then return false, LoadSuccess end
        if LoadSuccess then self._LastAutoSaveConfig = readfile(AutoSaveConfigFile) end
        return LoadSuccess, Error
    end

    function Library:GetAutoloadConfig()
        return getAutoConfig()
    end

    Library.SetAutoload = function(self, name, enabled)
        if enabled then
            setAutoConfig(name)
        else
            if getAutoConfig() == name then
                if isfile(ConfigStateFile) then delfile(ConfigStateFile) end
            end
        end
    end

    Library.IsAutoloadEnabled = function(self, name)
        return getAutoConfig() == name
    end

    Library.IsMouseOverFrame = function(self, Frame)
        Frame = Frame.Instance
        local MousePosition = Vector2New(Mouse.X, Mouse.Y)
        local AbsolutePosition = Frame.AbsolutePosition
        local AbsoluteSize = Frame.AbsoluteSize
        return MousePosition.X >= AbsolutePosition.X and MousePosition.X <= AbsolutePosition.X + AbsoluteSize.X and MousePosition.Y >= AbsolutePosition.Y and MousePosition.Y <= AbsolutePosition.Y + AbsoluteSize.Y
    end

    Library.GetLighterColor = function(self, Color, Increment)
        local Hue, Saturation, Value = Color:ToHSV()
        return FromHSV(Hue, Saturation, Value * Increment)
    end

    Library.CompareVectors = function(self, PointA, PointB)
        return (PointA.X < PointB.X) or (PointA.Y < PointB.Y)
    end

    Library.IsClipped = function(self, Object, Column)
        local Parent = Column
        local BoundryTop = Parent.AbsolutePosition
        local BoundryBottom = BoundryTop + Parent.AbsoluteSize
        local Top = Object.AbsolutePosition
        local Bottom = Top + Object.AbsoluteSize
        return Library:CompareVectors(Top, BoundryTop) or Library:CompareVectors(BoundryBottom, Bottom)
    end

    Library.ApplyPageSearch = function(self, Page, Query)
        if not Page then return end
        local NormalizedQuery = StringLower(tostring(Query or ""))
        local HasQuery = NormalizedQuery ~= ""
        local SearchEntries = Library.SearchItems[Page] or {}
        local MatchedSections = {}

        for _, SearchData in SearchEntries do
            local Section = SearchData.Section
            local SearchName = StringLower(tostring(SearchData.Name or ""))
            local SectionName = Section and StringLower(tostring(Section.Name or "")) or ""
            local Matches = not HasQuery or StringFind(SearchName, NormalizedQuery, 1, true) ~= nil or (SectionName ~= "" and StringFind(SectionName, NormalizedQuery, 1, true) ~= nil)
            if SearchData.Item and SearchData.Item.Instance then SearchData.Item.Instance.Visible = Matches end
            if Matches and Section then MatchedSections[Section] = true end
        end

        local Sections = Page.Sections or {}
        for _, Section in Sections do
            if Section.SetVisibility then
                local SectionName = StringLower(tostring(Section.Name or ""))
                local SectionMatches = HasQuery and StringFind(SectionName, NormalizedQuery, 1, true) ~= nil
                Section:SetVisibility(not HasQuery or SectionMatches or MatchedSections[Section] == true)
            end
        end

        Page.SearchQuery = Query or ""
    end

    local HoverPadding = 5

    Library.AddMarqueStyleHoverThing = function(self, Text, ContainerFrame)
        local OriginalAnchorPoint = Text.Instance.AnchorPoint
        local OriginalXOffset = Text.Instance.Position.X.Offset
        local HoverID = 0
        local ActiveTween = nil

        ContainerFrame:OnHover(function()
            HoverID = HoverID + 1
            local CurrentID = HoverID
            local TextWidth = Text.Instance.TextBounds.X
            local FrameWidth = ContainerFrame.Instance.AbsoluteSize.X
            local VisibleWidth = FrameWidth * 0.85 - OriginalXOffset
            local Overflow = TextWidth - VisibleWidth
            if Overflow <= 0 then return end
            local TargetX = OriginalXOffset - Overflow - HoverPadding
            local SlideDuration = (Overflow + HoverPadding) / Library.MarqueStyle.PixelsPerSecond
            task.delay(Library.MarqueStyle.HoverDelay, function()
                if HoverID ~= CurrentID then return end
                local SlideInfo = TweenInfo.new(SlideDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out)
                ActiveTween = Tween:Create(Text, SlideInfo, {Position = UDim2New(0, TargetX, OriginalAnchorPoint.Y, 0)}, false, false)
                ActiveTween:Play()
            end)
        end)

        ContainerFrame:OnHoverLeave(function()
            HoverID = HoverID + 1
            if ActiveTween then ActiveTween:Pause() ActiveTween = nil end
            local ResetTween = Tween:Create(Text, nil, {Position = UDim2New(0, OriginalXOffset, OriginalAnchorPoint.Y, 0)}, false, false)
            ResetTween:Play()
        end)
    end

    Library.CreateColorpicker = function(self, Data)
        local Colorpicker = {
            Flag = Data.Flag,
            IsOpen = false,
            Hue = 0,
            Saturation = 0,
            Value = 0,
            Color = FromRGB(255, 255, 255),
            HexValue = "#ffffff"
        }
        local Items = {}

        do
            Items["ColorpickerButton"] = Instances:Create("TextButton", {
                Parent = Data.Parent.Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                Size = UDim2New(0, 26, 1, 0),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(169, 225, 255)
            })
            Instances:Create("UIGradient", {
                Parent = Items["ColorpickerButton"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })
            Instances:Create("UICorner", {
                Parent = Items["ColorpickerButton"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 4)
            })

            Items["ColorpickerWindow"] = Instances:Create("TextButton", {
                Parent = Library.UnusedHolder.Instance,
                Name = "\0",
                Position = UDim2New(0, 8, 0, 7),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 223, 0, 265),
                Text = "",
                AutoButtonColor = false,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(17, 16, 20)
            })
            Items["ColorpickerWindow"]:AddToTheme({ BackgroundColor3 = "Background" })

            Items["DragHandle"] = Instances:Create("TextButton", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                Text = "",
                AutoButtonColor = false,
                Size = UDim2New(1, 0, 0, 22),
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["DragHandle"]:MakeDraggable(Items["ColorpickerWindow"])

            Items["CloseButton"] = Instances:Create("ImageButton", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                ScaleType = Enum.ScaleType.Fit,
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 17, 0, 17),
                AutoButtonColor = false,
                AnchorPoint = Vector2New(1, 0),
                Image = "rbxassetid://76001605964586",
                BackgroundTransparency = 1,
                Position = UDim2New(1, -4, 0, 4),
                ZIndex = 2,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["CloseButton"]:AddToTheme({ ImageColor3 = "Text" })

            Items["RainbowToggle"] = Instances:Create("TextButton", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                AnchorPoint = Vector2New(0, 1),
                BackgroundTransparency = 1,
                Position = UDim2New(0, 8, 1, -8),
                Size = UDim2New(1, -16, 0, 18),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })

            Items["Indicator"] = Instances:Create("Frame", {
                Parent = Items["RainbowToggle"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 0, 0.5, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 18, 0, 18),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(41, 40, 49)
            })
            Items["Indicator"]:AddToTheme({ BackgroundColor3 = "Element" })
            Instances:Create("UICorner", {
                Parent = Items["Indicator"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["RgbInput"] = Instances:Create("TextBox", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                BorderSizePixel = 0,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "169, 225, 255",
                ZIndex = 2,
                Size = UDim2New(1, -16, 0, 25),
                AnchorPoint = Vector2New(0, 1),
                Position = UDim2New(0, 8, 1, -32),
                TextXAlignment = Enum.TextXAlignment.Left,
                CursorPosition = -1,
                ClearTextOnFocus = false,
                TextSize = 14,
                BackgroundColor3 = FromRGB(41, 40, 49)
            })
            Items["RgbInput"]:AddToTheme({ BackgroundColor3 = "Element" })
            Instances:Create("UICorner", {
                Parent = Items["RgbInput"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })
            Instances:Create("UIPadding", {
                Parent = Items["RgbInput"].Instance,
                Name = "\0",
                PaddingLeft = UDimNew(0, 5)
            })

            Instances:Create("UIGradient", {
                Parent = Items["Indicator"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

            Items["Check"] = Instances:Create("ImageLabel", {
                Parent = Items["Indicator"].Instance,
                Name = "\0",
                ImageColor3 = FromRGB(0, 0, 0),
                ScaleType = Enum.ScaleType.Fit,
                ImageTransparency = 1,
                BorderColor3 = FromRGB(0, 0, 0),
                AnchorPoint = Vector2New(0.5, 0.5),
                Image = "rbxassetid://116048588333795",
                BackgroundTransparency = 1,
                Position = UDim2New(0.5, 0, 0.5, 0),
                Size = UDim2New(0, 0, 0, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })

            Items["Text"] = Instances:Create("TextLabel", {
                Parent = Items["RainbowToggle"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "Rainbow",
                Size = UDim2New(0, 0, 0, 15),
                AnchorPoint = Vector2New(0, 0.5),
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                Position = UDim2New(0, 26, 0.5, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                AutomaticSize = Enum.AutomaticSize.X,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["Text"]:AddToTheme({ TextColor3 = "Text" })

            Instances:Create("UICorner", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["Palette"] = Instances:Create("TextButton", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                Position = UDim2New(0, 8, 0, 22),
                Size = UDim2New(1, -16, 1, -115),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(169, 225, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["Palette"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["Saturation"] = Instances:Create("ImageLabel", {
                Parent = Items["Palette"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Image = Library:GetImage("Saturation"),
                BackgroundTransparency = 1,
                Size = UDim2New(1, 0, 1, 0),
                ZIndex = 3,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["Saturation"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["Value"] = Instances:Create("ImageLabel", {
                Parent = Items["Palette"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, 2, 1, 0),
                Image = Library:GetImage("Value"),
                BackgroundTransparency = 1,
                Position = UDim2New(0, -1, 0, 0),
                ZIndex = 3,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["Value"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["PaletteDragger"] = Instances:Create("Frame", {
                Parent = Items["Palette"].Instance,
                Name = "\0",
                Size = UDim2New(0, 3, 0, 3),
                Position = UDim2New(0, 5, 0, 5),
                BorderColor3 = FromRGB(0, 0, 0),
                ZIndex = 3,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["PaletteDragger"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(1, 0)
            })
            Instances:Create("UIStroke", {
                Parent = Items["PaletteDragger"].Instance,
                Name = "\0",
                Color = FromRGB(120, 120, 120),
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })

            Items["Hue"] = Instances:Create("Frame", {
                Parent = Items["ColorpickerWindow"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 1),
                Position = UDim2New(0, 8, 1, -65),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -16, 0, 18),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["Hue"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["HueInline"] = Instances:Create("TextButton", {
                Parent = Items["Hue"].Instance,
                Text = "",
                AutoButtonColor = false,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, 0, 1, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UIGradient", {
                Parent = Items["HueInline"].Instance,
                Name = "\0",
                Color = RGBSequence{
                    RGBSequenceKeypoint(0, FromRGB(255, 0, 0)),
                    RGBSequenceKeypoint(0.17, FromRGB(255, 255, 0)),
                    RGBSequenceKeypoint(0.33, FromRGB(0, 255, 0)),
                    RGBSequenceKeypoint(0.5, FromRGB(0, 255, 255)),
                    RGBSequenceKeypoint(0.67, FromRGB(0, 0, 255)),
                    RGBSequenceKeypoint(0.83, FromRGB(255, 0, 255)),
                    RGBSequenceKeypoint(1, FromRGB(255, 0, 0))
                }
            })
            Instances:Create("UICorner", {
                Parent = Items["HueInline"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["HueDragger"] = Instances:Create("Frame", {
                Parent = Items["Hue"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 8, 0.5, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 2, 1, -6),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Instances:Create("UICorner", {
                Parent = Items["HueDragger"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })
            Instances:Create("UIStroke", {
                Parent = Items["HueDragger"].Instance,
                Name = "\0",
                Color = FromRGB(120, 120, 120),
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })
        end

        local IsRainbowToggled = false
        local OldColor = Colorpicker.Color
        local SlidingPalette = false
        local PaletteChanged
        local SlidingHue = false
        local HueChanged
        local ConnectionId = HttpService:GenerateGUID(false)
        local SlideConnectionName = "ColorpickerSlide_" .. ConnectionId
        local OutsideConnectionName = "ColorpickerOutside_" .. ConnectionId
        local SlideInputConnection
        local OutsideClickConnection

        local function DisconnectSlideConnection()
            if SlideInputConnection then
                Library:Disconnect(SlideConnectionName)
                SlideInputConnection = nil
            end
        end

        local function DisconnectOutsideClickConnection()
            if OutsideClickConnection then
                Library:Disconnect(OutsideConnectionName)
                OutsideClickConnection = nil
            end
        end

        local function EnsureSlideConnection()
            if SlideInputConnection then return end
            SlideInputConnection = Library:Connect(UserInputService.InputChanged, function(Input)
                if Input.UserInputType ~= Enum.UserInputType.MouseMovement and Input.UserInputType ~= Enum.UserInputType.Touch then return end
                if Data.Premium then return end
                if SlidingPalette then Colorpicker:SlidePalette(Input) end
                if SlidingHue then Colorpicker:SlideHue(Input) end
                if not SlidingPalette and not SlidingHue then DisconnectSlideConnection() end
            end, SlideConnectionName)
        end

        local SetRainbow = function(Bool)
            IsRainbowToggled = Bool
            Library.Flags[Colorpicker.Flag .. "RainbowToggled"] = IsRainbowToggled
            if IsRainbowToggled then
                Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Accent" })
                Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Accent })
                Items["Text"]:Tween(nil, { TextTransparency = 0 })
                Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 0, Size = UDim2New(0, 8, 0, 8) })
                OldColor = Colorpicker.Color
                Library:Thread(function()
                    while true do
                        if Data.IsTogglePicker then
                            if Data.IsTogglePicker.Value then
                                local RainbowHue = MathAbs(MathSin(tick() * 0.32))
                                local Color = FromHSV(RainbowHue, 1, 1)
                                Colorpicker:Set(Color)
                                if not IsRainbowToggled then Colorpicker:Set(OldColor) break end
                                task.wait()
                            else
                                Colorpicker:Set(OldColor)
                                task.wait(1)
                            end
                        else
                            local RainbowHue = MathAbs(MathSin(tick() * 0.32))
                            local Color = FromHSV(RainbowHue, 1, 1)
                            Colorpicker:Set(Color)
                            if not IsRainbowToggled then Colorpicker:Set(OldColor) break end
                            task.wait()
                        end
                    end
                end)
            else
                Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Element })
                Items["Text"]:Tween(nil, { TextTransparency = 0.4 })
                Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 1, Size = UDim2New(0, 0, 0, 0) })
            end
        end

        Items["RainbowToggle"]:Connect("MouseButton1Click", function()
            SetRainbow(not IsRainbowToggled)
        end)

        local Debounce = false

        function Colorpicker:SetOpen(Bool)
            if Debounce then return end
            self.IsOpen = Bool
            Debounce = true
            Items["ColorpickerWindow"].Instance.Parent = Bool and Library.Holder.Instance or Library.UnusedHolder.Instance
            Items["ColorpickerWindow"].Instance.Visible = Bool

            if self.IsOpen then
                Items["ColorpickerWindow"].Instance.Position = UDim2New(0, Items["ColorpickerButton"].Instance.AbsolutePosition.X, 0, Items["ColorpickerButton"].Instance.AbsolutePosition.Y + 25)
                if not OutsideClickConnection then
                    OutsideClickConnection = Library:Connect(UserInputService.InputBegan, function(Input)
                        if Input.UserInputType ~= Enum.UserInputType.MouseButton1 and Input.UserInputType ~= Enum.UserInputType.Touch then return end
                        if not Colorpicker.IsOpen then return end
                        if Library:IsMouseOverFrame(Items["ColorpickerWindow"]) then return end
                        Colorpicker:SetOpen(false)
                    end, OutsideConnectionName)
                end
                for Index, Value in Library.OpenFrames do
                    if Value ~= self then Value:SetOpen(false) end
                end
                Library.OpenFrames[self] = self
            else
                if Library.OpenFrames[self] then Library.OpenFrames[self] = nil end
                SlidingPalette = false
                SlidingHue = false
                DisconnectSlideConnection()
                DisconnectOutsideClickConnection()
            end

            local Descendants = Items["ColorpickerWindow"].Instance:GetDescendants()
            TableInsert(Descendants, Items["ColorpickerWindow"].Instance)
            local NewTween
            for Index, Value in Descendants do
                local TransparencyProperty = Tween:GetProperty(Value)
                if not TransparencyProperty then continue end
                if not StringFind(Value.ClassName, "UI") then Value.ZIndex = Bool and 100004 or 0 end
                if type(TransparencyProperty) == "table" then
                    for _, Property in TransparencyProperty do
                        NewTween = Tween:FadeItem(Value, Property, Bool, Library.FadeSpeed)
                    end
                else
                    NewTween = Tween:FadeItem(Value, TransparencyProperty, Bool, Library.FadeSpeed)
                end
            end
            if NewTween and NewTween.Tween then
                NewTween.Tween.Completed:Once(function() Debounce = false end)
            else
                Debounce = false
            end
        end

        Items["ColorpickerButton"]:Connect("MouseButton1Click", function()
            if Data.Premium then return end
            Colorpicker:SetOpen(not Colorpicker.IsOpen)
        end)

        function Colorpicker:Get()
            return self.Color
        end

        function Colorpicker:SetVisibility(Bool)
            Items["ColorpickerButton"].Instance.Visible = Bool
        end

        function Colorpicker:SlidePalette(Input)
            if Data.Premium then return end
            if not Input then return end
            if not SlidingPalette then return end
            local ValueX = MathClamp(1 - (Input.Position.X - Items["Palette"].Instance.AbsolutePosition.X) / Items["Palette"].Instance.AbsoluteSize.X, 0, 1)
            local ValueY = MathClamp(1 - (Input.Position.Y - Items["Palette"].Instance.AbsolutePosition.Y) / Items["Palette"].Instance.AbsoluteSize.Y, 0, 1)
            self.Saturation = ValueX
            self.Value = ValueY
            local SlideX = MathClamp((Input.Position.X - Items["Palette"].Instance.AbsolutePosition.X) / Items["Palette"].Instance.AbsoluteSize.X, 0, 0.985)
            local SlideY = MathClamp((Input.Position.Y - Items["Palette"].Instance.AbsolutePosition.Y) / Items["Palette"].Instance.AbsoluteSize.Y, 0, 0.985)
            Items["PaletteDragger"].Instance.Position = UDim2New(SlideX, 0, SlideY, 0)
            self:Update()
        end

        function Colorpicker:SlideHue(Input)
            if Data.Premium then return end
            if not Input then return end
            if not SlidingHue then return end
            local ValueX = MathClamp((Input.Position.X - Items["Hue"].Instance.AbsolutePosition.X) / Items["Hue"].Instance.AbsoluteSize.X, 0, 1)
            self.Hue = ValueX
            local SlideX = MathClamp((Input.Position.X - Items["Hue"].Instance.AbsolutePosition.X) / Items["Hue"].Instance.AbsoluteSize.X, 0, 0.985)
            Items["HueDragger"].Instance.Position = UDim2New(SlideX, 0, 0.5, 0)
            self:Update()
        end

        function Colorpicker:Update(Debounce)
            if Data.Premium then return end
            local Hue, Saturation, Value = self.Hue, self.Saturation, self.Value
            self.Color = FromHSV(Hue, Saturation, Value)
            self.HexValue = Colorpicker.Color:ToHex()
            Library.Flags[self.Flag] = { Color = self.HexValue }
            Library:QueueAutoSave()
            if not Debounce then
                local Red, Green, Blue = MathFloor(Colorpicker.Color.R * 255), MathFloor(Colorpicker.Color.G * 255), MathFloor(Colorpicker.Color.B * 255)
                Items["RgbInput"].Instance.Text = Red .. ", " .. Green .. ", " .. Blue
            end
            Items["ColorpickerButton"].Instance.BackgroundColor3 = self.Color
            Items["Palette"].Instance.BackgroundColor3 = FromHSV(Hue, 1, 1)
            if Data.Callback then
                if Data.IsTogglePicker then
                    Library:SafeCall(Data.Callback, Colorpicker.Color, Data.IsTogglePicker.Value)
                else
                    Library:SafeCall(Data.Callback, Colorpicker.Color)
                end
            end
        end

        function Colorpicker:Set(Color, Debounce)
            if type(Color) == "table" then
                Color = FromRGB(Color[1], Color[2], Color[3])
            elseif type(Color) == "string" then
                Color = FromHex(Color)
            else
                Color = Color
            end
            Colorpicker.Hue, Colorpicker.Saturation, Colorpicker.Value = Color:ToHSV()
            local PaletteValueX = MathClamp(1 - Colorpicker.Saturation, 0, 0.985)
            local PaletteValueY = MathClamp(1 - Colorpicker.Value, 0, 0.985)
            local HuePositionX = MathClamp(Colorpicker.Hue, 0, 0.985)
            Items["PaletteDragger"].Instance.Position = UDim2New(PaletteValueX, 0, PaletteValueY, 0)
            Items["HueDragger"].Instance.Position = UDim2New(HuePositionX, 0, 0.5, 0)
            Colorpicker:Update(Debounce)
        end

        Items["Palette"]:Connect("InputBegan", function(Input)
            if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                if Data.Premium then return end
                SlidingPalette = true
                Colorpicker:SlidePalette(Input)
                EnsureSlideConnection()
                if PaletteChanged then return end
                PaletteChanged = Input.Changed:Connect(function()
                    if Input.UserInputState == Enum.UserInputState.End then
                        SlidingPalette = false
                        if not SlidingHue then DisconnectSlideConnection() end
                        PaletteChanged:Disconnect()
                        PaletteChanged = nil
                    end
                end)
            end
        end)

        Items["HueInline"]:Connect("InputBegan", function(Input)
            if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                if Data.Premium then return end
                SlidingHue = true
                Colorpicker:SlideHue(Input)
                EnsureSlideConnection()
                if HueChanged then return end
                HueChanged = Input.Changed:Connect(function()
                    if Input.UserInputState == Enum.UserInputState.End then
                        SlidingHue = false
                        if not SlidingPalette then DisconnectSlideConnection() end
                        HueChanged:Disconnect()
                        HueChanged = nil
                    end
                end)
            end
        end)

        local RgbStepped
        Items["RgbInput"]:Connect("Focused", function()
            if Data.Premium then return end
            local function ApplyRgb()
                local RgbText = Items["RgbInput"].Instance.Text
                local Red, Green, Blue = RgbText:match("(%d+),%s*(%d+),%s*(%d+)")
                Red, Green, Blue = tonumber(Red), tonumber(Green), tonumber(Blue)
                Colorpicker:Set({Red, Green, Blue}, true)
            end
            RgbStepped = Items["RgbInput"].Instance:GetPropertyChangedSignal("Text"):Connect(ApplyRgb)
        end)

        Items["RgbInput"]:Connect("FocusLost", function()
            if Data.Premium then return end
            if RgbStepped then
                RgbStepped:Disconnect()
                RgbStepped = nil
            end
        end)

        Items["CloseButton"]:Connect("InputBegan", function(Input)
            if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                Colorpicker:SetOpen(false)
            end
        end)

        if Data.Default then Colorpicker:Set(Data.Default) end
        Library:RegisterDefaultFlag(Colorpicker.Flag, Library.Flags[Colorpicker.Flag])
        Library.SetFlags[Colorpicker.Flag] = function(Value) Colorpicker:Set(Value) end

        return Colorpicker, Items
    end

    Library.CreateKeybind = function(self, Data)
        local Keybind = {
            Value = "",
            IsOpen = false,
            Key = "",
            Toggled = false,
            Mode = "",
            Picking = false,
            Flag = Data.Flag
        }
        local Items = {}

        do
            Items["KeyButton"] = Instances:Create("TextButton", {
                Parent = Data.Parent.Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "None",
                AutoButtonColor = false,
                Size = UDim2New(0, 0, 1, 0),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                BorderColor3 = FromRGB(0, 0, 0),
                AutomaticSize = Enum.AutomaticSize.X,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })

            Items["KeybindWindow"] = Instances:Create("Frame", {
                Parent = Library.Holder.Instance,
                Name = "\0",
                Position = UDim2New(0, 0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Visible = false,
                Size = UDim2New(0, 80, 0, 90),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(17, 16, 20)
            })
            Items["KeybindWindow"]:AddToTheme({ BackgroundColor3 = "Background" })
            Instances:Create("UICorner", {
                Parent = Items["KeybindWindow"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["Toggle"] = Instances:Create("TextButton", {
                Parent = Items["KeybindWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                BorderSizePixel = 0,
                Position = UDim2New(0, 8, 0, 8),
                Size = UDim2New(1, -16, 0, 25),
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(26, 25, 31)
            })
            Items["Toggle"]:AddToTheme({ BackgroundColor3 = "Inline" })
            Instances:Create("UICorner", {
                Parent = Items["Toggle"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["ToggleText"] = Instances:Create("TextLabel", {
                Parent = Items["Toggle"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Toggle",
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                Position = UDim2New(0, 8, 0, 0),
                Size = UDim2New(1, -15, 1, 0),
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["ToggleText"]:AddToTheme({ TextColor3 = "Text" })

            Items["Hold"] = Instances:Create("TextButton", {
                Parent = Items["KeybindWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                Position = UDim2New(0, 8, 0, 33),
                Size = UDim2New(1, -16, 0, 25),
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(26, 25, 31)
            })
            Items["Hold"]:AddToTheme({ BackgroundColor3 = "Inline" })
            Instances:Create("UICorner", {
                Parent = Items["Hold"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["HoldText"] = Instances:Create("TextLabel", {
                Parent = Items["Hold"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "Hold",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -15, 1, 0),
                BackgroundTransparency = 1,
                Position = UDim2New(0, 4, 0, 0),
                BorderSizePixel = 0,
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["HoldText"]:AddToTheme({ TextColor3 = "Text" })

            Items["Always"] = Instances:Create("TextButton", {
                Parent = Items["KeybindWindow"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                Position = UDim2New(0, 8, 0, 58),
                Size = UDim2New(1, -16, 0, 25),
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(26, 25, 31)
            })
            Items["Always"]:AddToTheme({ BackgroundColor3 = "Inline" })
            Instances:Create("UICorner", {
                Parent = Items["Always"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["AlwaysText"] = Instances:Create("TextLabel", {
                Parent = Items["Always"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "Always",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -15, 1, 0),
                BackgroundTransparency = 1,
                Position = UDim2New(0, 4, 0, 0),
                BorderSizePixel = 0,
                ZIndex = 2,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["AlwaysText"]:AddToTheme({ TextColor3 = "Text" })
        end

        local Modes = {
            ["Toggle"] = { Items["Toggle"], Items["ToggleText"] },
            ["Hold"] = { Items["Hold"], Items["HoldText"] },
            ["Always"] = { Items["Always"], Items["AlwaysText"] }
        }

        function Keybind:Get()
            return self.Key, self.Toggled
        end

        function Keybind:Set(Key)
            if StringFind(tostring(Key), "Enum") then
                self.Key = tostring(Key)
                Key = Key.Name == "Backspace" and "None" or Key.Name
                local KeyString = Keys[self.Key] or StringGSub(Key, "Enum.", "") or "None"
                local TextToDisplay = StringGSub(StringGSub(KeyString, "KeyCode.", ""), "UserInputType.", "") or "None"
                self.Value = TextToDisplay
                Items["KeyButton"].Instance.Text = TextToDisplay
                Library.Flags[Keybind.Flag] = { Mode = self.Mode, Key = self.Key, Toggled = self.Toggled }
                Library:QueueAutoSave()
                if Data.Callback then Library:SafeCall(Data.Callback, self.Toggled) end
            elseif type(Key) == "table" then
                local RealKey = Key.Key == "Backspace" and "None" or Key.Key
                self.Key = tostring(Key.Key)
                if Key.Mode then
                    self.Mode = Key.Mode
                    self:SetMode(Key.Mode)
                else
                    self.Mode = "toggle"
                    self:SetMode("toggle")
                end
                local KeyString = Keys[self.Key] or StringGSub(tostring(RealKey), "Enum.", "") or RealKey
                local TextToDisplay = KeyString and StringGSub(StringGSub(KeyString, "KeyCode.", ""), "UserInputType.", "") or "None"
                TextToDisplay = StringGSub(StringGSub(KeyString, "KeyCode.", ""), "UserInputType.", "")
                self.Value = TextToDisplay
                Items["KeyButton"].Instance.Text = TextToDisplay
                if Data.Callback then Library:SafeCall(Data.Callback, self.Toggled) end
            elseif TableFind({"Toggle", "Hold", "Always"}, Key) then
                self.Mode = Key
                self:SetMode(Keybind.Mode)
                if Data.Callback then Library:SafeCall(Data.Callback, self.Toggled) end
            end
            self.Picking = false
        end

        function Keybind:SetMode(Mode)
            for Index, Value in Modes do
                if Index == Mode then
                    Value[1]:Tween(nil, { BackgroundTransparency = 0 })
                    Value[2]:Tween(nil, { TextTransparency = 0 })
                else
                    Value[1]:Tween(nil, { BackgroundTransparency = 1 })
                    Value[2]:Tween(nil, { TextTransparency = 0.4 })
                end
            end
            Library.Flags[self.Flag] = { Mode = self.Mode, Key = self.Key, Toggled = self.Toggled }
            Library:QueueAutoSave()
            if Data.Callback then Library:SafeCall(Data.Callback, self.Toggled) end
        end

        function Keybind:Press(Bool)
            if self.Mode == "Toggle" then
                self.Toggled = not self.Toggled
            elseif self.Mode == "Hold" then
                self.Toggled = Bool
            elseif Keybind.Mode == "Always" then
                self.Toggled = true
            end
            Library.Flags[Data.Flag] = { Mode = self.Mode, Key = self.Key, Toggled = self.Toggled }
            Library:QueueAutoSave()
            if Data.Callback then Library:SafeCall(Data.Callback, self.Toggled) end
        end

        Items["KeyButton"]:Connect("MouseButton1Click", function()
            if Data.Premium then return end
            Keybind.Picking = true
            Items["KeyButton"].Instance.Text = "."
            Library:Thread(function()
                local Count = 1
                while true do
                    if not Keybind.Picking then break end
                    if Count == 4 then Count = 1 end
                    Items["KeyButton"].Instance.Text = Count == 1 and "." or Count == 2 and ".." or Count == 3 and "..."
                    Count = Count + 1
                    task.wait(0.5)
                end
            end)
            local InputBegan
            InputBegan = UserInputService.InputBegan:Connect(function(Input)
                if Input.UserInputType == Enum.UserInputType.Keyboard then
                    Keybind:Set(Input.KeyCode)
                else
                    Keybind:Set(Input.UserInputType)
                end
                InputBegan:Disconnect()
                InputBegan = nil
            end)
        end)

        local Debounce = false

        function Keybind:SetOpen(Bool)
            if Debounce then return end
            self.IsOpen = Bool
            Debounce = true
            Items["KeybindWindow"].Instance.Position = UDim2New(0, Items["KeyButton"].Instance.AbsolutePosition.X, 0, Items["KeyButton"].Instance.AbsolutePosition.Y + 25)
            Items["KeybindWindow"].Instance.Visible = Bool

            if self.IsOpen then
                for Index, Value in Library.OpenFrames do
                    if Value ~= self then Value:SetOpen(false) end
                end
                Library.OpenFrames[self] = self
            else
                if Library.OpenFrames[self] then Library.OpenFrames[self] = nil end
            end

            local Descendants = Items["KeybindWindow"].Instance:GetDescendants()
            TableInsert(Descendants, Items["KeybindWindow"].Instance)
            local NewTween
            for Index, Value in Descendants do
                local TransparencyProperty = Tween:GetProperty(Value)
                if not TransparencyProperty then continue end
                if not StringFind(Value.ClassName, "UI") then Value.ZIndex = Bool and 104 or 0 end
                if type(TransparencyProperty) == "table" then
                    for _, Property in TransparencyProperty do
                        NewTween = Tween:FadeItem(Value, Property, Bool, Library.FadeSpeed)
                    end
                else
                    NewTween = Tween:FadeItem(Value, TransparencyProperty, Bool, Library.FadeSpeed)
                end
            end
            if NewTween and NewTween.Tween then
                NewTween.Tween.Completed:Once(function() Debounce = false end)
            else
                Debounce = false
            end
        end

        Items["KeyButton"]:Connect("MouseButton2Down", function()
            if Data.Premium then return end
            Keybind:SetOpen(not Keybind.IsOpen)
        end)

        Library:Connect(UserInputService.InputBegan, function(Input)
            if tostring(Input.KeyCode) == Keybind.Key or tostring(Input.UserInputType) == Keybind.Key and not Keybind.Value == "None" then
                if Data.Premium then return end
                if Keybind.Mode == "Toggle" then
                    Keybind:Press()
                elseif Keybind.Mode == "Hold" then
                    Keybind:Press(true)
                elseif Keybind.Mode == "Always" then
                    Keybind:Press(true)
                end
            end
            if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                if not Keybind.IsOpen then return end
                if Library:IsMouseOverFrame(Items["KeybindWindow"]) then return end
                Keybind:SetOpen(false)
            end
        end)

        Library:Connect(UserInputService.InputEnded, function(Input)
            if tostring(Input.KeyCode) == Keybind.Key or tostring(Input.UserInputType) == Keybind.Key and not Keybind.Value == "None" then
                if Data.Premium then return end
                if Keybind.Mode == "Hold" then
                    Keybind:Press(false)
                elseif Keybind.Mode == "Always" then
                    Keybind:Press(true)
                end
            end
        end)

        Items["Toggle"]:Connect("MouseButton1Click", function()
            Keybind.Mode = "Toggle"
            Keybind:SetMode("Toggle")
        end)

        Items["Always"]:Connect("MouseButton1Click", function()
            Keybind.Mode = "Always"
            Keybind:SetMode("Always")
        end)

        Items["Hold"]:Connect("MouseButton1Click", function()
            Keybind.Mode = "Hold"
            Keybind:SetMode("Hold")
        end)

        if Data.Default then
            Keybind:Set({ Key = Data.Default, Mode = Data.Mode or "Toggle" })
        end

        Library:RegisterDefaultFlag(Keybind.Flag, Library.Flags[Keybind.Flag])
        Library.SetFlags[Keybind.Flag] = function(Key) Keybind:Set(Key) end

        return Keybind, Items
    end

    Library.MakeNotification = function(self, Data)
        local Items = {}

        do
            Items["Notification"] = Instances:Create("Frame", {
                Parent = self.NotifHolder.Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                BorderSizePixel = 0,
                Size = UDim2New(0, 235, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                BackgroundColor3 = FromRGB(17, 16, 20)
            })
            Items["Notification"]:AddToTheme({ BackgroundColor3 = "Background" })

            Instances:Create("UIPadding", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                PaddingTop = UDimNew(0, 8),
                PaddingBottom = UDimNew(0, 8),
                PaddingRight = UDimNew(0, 0),
                PaddingLeft = UDimNew(0, 0)
            })

            Items["Title"] = Instances:Create("TextLabel", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = Data.Name,
                Size = UDim2New(1, -16, 0, 15),
                Position = UDim2New(0, 8, 0, 0),
                BackgroundTransparency = 1,
                TextWrapped = true,
                TextXAlignment = Enum.TextXAlignment.Left,
                BorderSizePixel = 0,
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 16,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["Title"]:AddToTheme({ TextColor3 = "Text" })

            Items["Description"] = Instances:Create("TextLabel", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = Data.Content,
                TextWrapped = true,
                Size = UDim2New(1, -16, 0, 15),
                Position = UDim2New(0, 8, 0, 18),
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                BorderColor3 = FromRGB(0, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["Description"]:AddToTheme({ TextColor3 = "Text" })

            Instances:Create("UICorner", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["CloseButton"] = Instances:Create("ImageButton", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                ScaleType = Enum.ScaleType.Fit,
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 17, 0, 17),
                AutoButtonColor = false,
                AnchorPoint = Vector2New(1, 0),
                Image = "rbxassetid://76001605964586",
                BackgroundTransparency = 1,
                Position = UDim2New(1, -4, 0, -4),
                ZIndex = 2,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["CloseButton"]:AddToTheme({ ImageColor3 = "Text" })

            Items["Liner"] = Instances:Create("Frame", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                Position = UDim2New(0, 8, 0, Items["Description"].Instance.TextBounds.Y + Items["Title"].Instance.TextBounds.Y + 9),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -16, 0, 6),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            })
            Items["Liner"]:AddToTheme({ BackgroundColor3 = "Inline" })

            Instances:Create("UIGradient", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

            Instances:Create("UICorner", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["UIStroke"] = Instances:Create("UIStroke", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                Color = FromRGB(36, 33, 42),
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })
            Items["UIStroke"]:AddToTheme({ Color = "Border" })

            Items["Accent"] = Instances:Create("Frame", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, 0, 1, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(246, 178, 255)
            })
            Items["Accent"]:AddToTheme({ BackgroundColor3 = "Accent" })

            Instances:Create("UIGradient", {
                Parent = Items["Accent"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

            Instances:Create("UICorner", {
                Parent = Items["Accent"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })
        end

        local Size = Items["Notification"].Instance.AbsoluteSize

        for Index, Value in Items do
            if Value.Instance:IsA("Frame") or Value.Instance:IsA("TextButton") then
                Value.Instance.BackgroundTransparency = 1
            elseif Value.Instance:IsA("TextLabel") then
                Value.Instance.TextTransparency = 1
            elseif Value.Instance:IsA("UIStroke") then
                Value.Instance.Transparency = 1
            elseif Value.Instance:IsA("ImageButton") then
                Value.Instance.ImageTransparency = 1
            end
        end

        Items["Notification"].Instance.AutomaticSize = Enum.AutomaticSize.None

        Library:Thread(function()
            for Index, Value in Items do
                if Value.Instance:IsA("Frame") or Value.Instance:IsA("TextButton") then
                    Value:Tween(nil, { BackgroundTransparency = 0 })
                elseif Value.Instance:IsA("TextLabel") and Index ~= "Description" then
                    Value:Tween(nil, { TextTransparency = 0 })
                elseif Value.Instance:IsA("TextLabel") and Index == "Description" then
                    Value:Tween(nil, { TextTransparency = 0.4 })
                elseif Value.Instance:IsA("UIStroke") then
                    Value:Tween(nil, { Transparency = 0 })
                elseif Value.Instance:IsA("ImageButton") then
                    Value:Tween(nil, { ImageTransparency = 0 })
                end
            end

            Items["Notification"]:Tween(nil, { Size = UDim2New(0, Size.X, 0, Size.Y) })
            Items["Accent"]:Tween(TweenInfo.new(Data.Time, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), { Size = UDim2New(0, 0, 1, 0) })

            task.delay(Data.Time, function()
                for Index, Value in Items do
                    if Value.Instance:IsA("Frame") or Value.Instance:IsA("TextButton") then
                        Value:Tween(nil, { BackgroundTransparency = 1 })
                    elseif Value.Instance:IsA("TextLabel") then
                        Value:Tween(nil, { TextTransparency = 1 })
                    elseif Value.Instance:IsA("UIStroke") then
                        Value:Tween(nil, { Transparency = 1 })
                    elseif Value.Instance:IsA("ImageButton") then
                        Value:Tween(nil, { ImageTransparency = 1 })
                    end
                end
                Items["Notification"]:Tween(nil, { Size = UDim2New(0, 0, 0, 0) })
                task.wait(0.5)
                Items["Notification"]:Clean()
            end)
        end)

        Items["CloseButton"]:Connect("InputBegan", function(Input)
            if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                for Index, Value in Items do
                    if Value.Instance:IsA("Frame") or Value.Instance:IsA("TextButton") then
                        Value:Tween(nil, { BackgroundTransparency = 1 })
                    elseif Value.Instance:IsA("TextLabel") then
                        Value:Tween(nil, { TextTransparency = 1 })
                    elseif Value.Instance:IsA("UIStroke") then
                        Value:Tween(nil, { Transparency = 1 })
                    elseif Value.Instance:IsA("ImageButton") then
                        Value:Tween(nil, { ImageTransparency = 1 })
                    end
                end
                Items["Notification"]:Tween(nil, { Size = UDim2New(0, 0, 0, 0) })
                task.wait(0.5)
                Items["Notification"]:Clean()
            end
        end)
    end

    Library.MakeGlobalAnnouncement = function(self, Data)
        Data = Data or {}
        if self.ActiveGlobalAnnouncement and self.ActiveGlobalAnnouncement.Notification then
            pcall(function() self.ActiveGlobalAnnouncement.Notification:Clean() end)
            self.ActiveGlobalAnnouncement = nil
        end

        local Duration = tonumber(Data.Time) or 7
        if Duration < 1 then Duration = 1 end

        local Items = {}

        do
            Items["Notification"] = Instances:Create("Frame", {
                Parent = self.AnnouncementHolder.Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                BorderSizePixel = 0,
                AnchorPoint = Vector2New(0.5, 0),
                Position = UDim2New(0.5, 0, 0, -140),
                Size = UDim2New(1, -24, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                BackgroundColor3 = FromRGB(17, 16, 20),
                ClipsDescendants = true,
                ZIndex = 200
            })
            Items["Notification"]:AddToTheme({ BackgroundColor3 = "Background" })

            Instances:Create("UISizeConstraint", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                MaxSize = Vector2New(560, 220),
                MinSize = Vector2New(260, 0)
            })

            Instances:Create("UIPadding", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                PaddingTop = UDimNew(0, 12),
                PaddingBottom = UDimNew(0, 12),
                PaddingRight = UDimNew(0, 14),
                PaddingLeft = UDimNew(0, 14)
            })

            Instances:Create("UICorner", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 8)
            })

            Items["Stroke"] = Instances:Create("UIStroke", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                Color = FromRGB(36, 33, 42),
                Transparency = 0.08,
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })
            Items["Stroke"]:AddToTheme({ Color = "Border" })

            local AnnouncementLayout = InstanceNew("UIListLayout")
            AnnouncementLayout.FillDirection = Enum.FillDirection.Vertical
            AnnouncementLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
            AnnouncementLayout.SortOrder = Enum.SortOrder.LayoutOrder
            AnnouncementLayout.Padding = UDimNew(0, 8)
            AnnouncementLayout.Parent = Items["Notification"].Instance

            Items["Badge"] = Instances:Create("TextLabel", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 214, 120),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "GLOBAL ANNOUNCEMENT",
                Size = UDim2New(1, 0, 0, 14),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                TextWrapped = true,
                TextXAlignment = Enum.TextXAlignment.Center,
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 13,
                ZIndex = 201,
                LayoutOrder = 1
            })

            Items["Title"] = Instances:Create("TextLabel", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = tostring(Data.Name or "ExpressHub"),
                Size = UDim2New(1, 0, 0, 20),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                TextWrapped = true,
                TextXAlignment = Enum.TextXAlignment.Center,
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 22,
                ZIndex = 201,
                LayoutOrder = 2
            })
            Items["Title"]:AddToTheme({ TextColor3 = "Text" })

            Items["Description"] = Instances:Create("TextLabel", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.28,
                Text = tostring(Data.Content or ""),
                TextWrapped = true,
                Size = UDim2New(1, 0, 0, 18),
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Center,
                BorderColor3 = FromRGB(0, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 16,
                ZIndex = 201,
                LayoutOrder = 3
            })
            Items["Description"]:AddToTheme({ TextColor3 = "Text" })

            Items["Spacer"] = Instances:Create("Frame", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                BorderSizePixel = 0,
                Size = UDim2New(1, 0, 0, 2),
                BackgroundTransparency = 1,
                LayoutOrder = 4
            })

            Items["Liner"] = Instances:Create("Frame", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, 0, 0, 6),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31),
                ZIndex = 201,
                LayoutOrder = 5
            })
            Items["Liner"]:AddToTheme({ BackgroundColor3 = "Inline" })

            Instances:Create("UIGradient", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

            Instances:Create("UICorner", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })

            Items["Accent"] = Instances:Create("Frame", {
                Parent = Items["Liner"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, 0, 1, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(246, 178, 255),
                ZIndex = 202
            })
            Items["Accent"]:AddToTheme({ BackgroundColor3 = "Accent" })

            Instances:Create("UIGradient", {
                Parent = Items["Accent"].Instance,
                Name = "\0",
                Rotation = 90,
                Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
            }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

            Instances:Create("UICorner", {
                Parent = Items["Accent"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 6)
            })
        end

        self.ActiveGlobalAnnouncement = Items

        local SlideInTweenInfo = TweenInfo.new(0.42, Enum.EasingStyle.Quint, Enum.EasingDirection.Out)
        local SlideOutTweenInfo = TweenInfo.new(0.26, Enum.EasingStyle.Quad, Enum.EasingDirection.In)

        for _, Value in Items do
            if Value.Instance:IsA("Frame") then
                Value.Instance.BackgroundTransparency = 1
            elseif Value.Instance:IsA("TextLabel") then
                Value.Instance.TextTransparency = 1
            elseif Value.Instance:IsA("UIStroke") then
                Value.Instance.Transparency = 1
            end
        end

        Library:Thread(function()
            for _, Value in Items do
                if Value.Instance:IsA("Frame") then
                    Value:Tween(nil, { BackgroundTransparency = 0 })
                elseif Value == Items["Badge"] then
                    Value:Tween(nil, { TextTransparency = 0.12 })
                elseif Value.Instance:IsA("TextLabel") and Value == Items["Description"] then
                    Value:Tween(nil, { TextTransparency = 0.28 })
                elseif Value.Instance:IsA("TextLabel") then
                    Value:Tween(nil, { TextTransparency = 0 })
                elseif Value.Instance:IsA("UIStroke") then
                    Value:Tween(nil, { Transparency = 0.08 })
                end
            end

            local SlideIn = TweenService:Create(Items["Notification"].Instance, SlideInTweenInfo, { Position = UDim2New(0.5, 0, 0, 18) })
            SlideIn:Play()
            Items["Accent"]:Tween(TweenInfo.new(Duration, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), { Size = UDim2New(0, 0, 1, 0) })

            task.delay(Duration, function()
                if self.ActiveGlobalAnnouncement ~= Items then return end
                for _, Value in Items do
                    if Value.Instance:IsA("Frame") then
                        Value:Tween(nil, { BackgroundTransparency = 1 })
                    elseif Value.Instance:IsA("TextLabel") then
                        Value:Tween(nil, { TextTransparency = 1 })
                    elseif Value.Instance:IsA("UIStroke") then
                        Value:Tween(nil, { Transparency = 1 })
                    end
                end
                local SlideOut = TweenService:Create(Items["Notification"].Instance, SlideOutTweenInfo, { Position = UDim2New(0.5, 0, 0, -140) })
                SlideOut:Play()
                task.wait(0.35)
                if self.ActiveGlobalAnnouncement == Items then self.ActiveGlobalAnnouncement = nil end
                Items["Notification"]:Clean()
            end)
        end)
    end

    local function EscapeDiscordRichText(Value)
        local Escaped = tostring(Value or "")
        Escaped = StringGSub(Escaped, "&", "&amp;")
        Escaped = StringGSub(Escaped, "<", "&lt;")
        Escaped = StringGSub(Escaped, ">", "&gt;")
        return Escaped
    end

    local function ApplyDiscordInlineFormatting(Value)
        local Text = EscapeDiscordRichText(Value)
        Text = StringGSub(Text, "%[([^%]]+)%]%(([^%)]+)%)", "%1")
        Text = StringGSub(Text, "__%*%*%*(.-)%*%*%*__", "<u><b><i>%1</i></b></u>")
        Text = StringGSub(Text, "%*%*%*(.-)%*%*%*", "<b><i>%1</i></b>")
        Text = StringGSub(Text, "__%*%*(.-)%*%*__", "<u><b>%1</b></u>")
        Text = StringGSub(Text, "__%*(.-)%*__", "<u><i>%1</i></u>")
        Text = StringGSub(Text, "__([^_]+)__", "<u>%1</u>")
        Text = StringGSub(Text, "%*%*([^%*]+)%*%*", "<b>%1</b>")
        Text = StringGSub(Text, "~~(.-)~~", "<s>%1</s>")
        Text = StringGSub(Text, "`([^`]+)`", "<font color=\"rgb(232,197,71)\">%1</font>")
        Text = StringGSub(Text, "%*([^%*]+)%*", "<i>%1</i>")
        Text = StringGSub(Text, "_([^_]+)_", "<i>%1</i>")
        return Text
    end

    local function NormalizeUpdateTargetId(Value)
        local Normalized = tostring(Value or "")
        Normalized = StringGSub(Normalized, "%s+", "")
        return Normalized
    end

    local function DoesUpdateTargetMatch(TargetGameId)
        local NormalizedTargetGameId = NormalizeUpdateTargetId(TargetGameId)
        if NormalizedTargetGameId == "" then return true end
        local LocalGameId = NormalizeUpdateTargetId(game.GameId)
        return LocalGameId ~= "" and NormalizedTargetGameId == LocalGameId
    end

    local function QueueUpdateRejoinScript()
        local QueueOnTeleport = queue_on_teleport or queueonteleport or (syn and syn.queue_on_teleport) or (syn and syn.queueonteleport)
        if type(QueueOnTeleport) ~= "function" then return false end
        return pcall(QueueOnTeleport, UPDATE_REJOIN_SCRIPT)
    end

    local function CreateDiscordUpdateRow(Parent, Order)
        return Instances:Create("Frame", {
            Parent = Parent,
            Name = "\0",
            BorderSizePixel = 0,
            BackgroundTransparency = 1,
            Size = UDim2New(1, 0, 0, 0),
            AutomaticSize = Enum.AutomaticSize.Y,
            LayoutOrder = Order
        })
    end

    local function CreateDiscordUpdateText(Parent, Order, Text, TextSize, Transparency, Indent)
        local Row = CreateDiscordUpdateRow(Parent, Order)
        local LeftInset = Indent or 0
        local Label = Instances:Create("TextLabel", {
            Parent = Row.Instance,
            Name = "\0",
            FontFace = Library.Font,
            TextColor3 = FromRGB(255, 255, 255),
            TextTransparency = Transparency or 0.08,
            BorderColor3 = FromRGB(0, 0, 0),
            Text = ApplyDiscordInlineFormatting(Text),
            Size = UDim2New(1, -LeftInset, 0, 0),
            Position = UDim2New(0, LeftInset, 0, 0),
            BackgroundTransparency = 1,
            BorderSizePixel = 0,
            RichText = true,
            TextWrapped = true,
            TextXAlignment = Enum.TextXAlignment.Left,
            TextYAlignment = Enum.TextYAlignment.Top,
            AutomaticSize = Enum.AutomaticSize.Y,
            TextSize = TextSize,
            ZIndex = 212
        })
        Label:AddToTheme({ TextColor3 = "Text" })
        return Row, Label
    end

    local function CreateDiscordBulletRow(Parent, Order, BulletText, Text, TextSize, Depth)
        local Row = CreateDiscordUpdateRow(Parent, Order)
        local Indent = 8 + (Depth * 18)
        local Bullet = Instances:Create("TextLabel", {
            Parent = Row.Instance,
            Name = "\0",
            FontFace = Library.Font,
            TextColor3 = FromRGB(255, 255, 255),
            TextTransparency = 0.16,
            BorderSizePixel = 0,
            BackgroundTransparency = 1,
            Text = BulletText,
            Size = UDim2New(0, 14, 0, 18),
            Position = UDim2New(0, Indent, 0, 0),
            RichText = true,
            TextXAlignment = Enum.TextXAlignment.Center,
            TextYAlignment = Enum.TextYAlignment.Top,
            TextSize = TextSize,
            ZIndex = 212
        })
        Bullet:AddToTheme({ TextColor3 = "Text" })

        local Label = Instances:Create("TextLabel", {
            Parent = Row.Instance,
            Name = "\0",
            FontFace = Library.Font,
            TextColor3 = FromRGB(255, 255, 255),
            TextTransparency = 0.08,
            BorderSizePixel = 0,
            BackgroundTransparency = 1,
            Text = ApplyDiscordInlineFormatting(Text),
            Size = UDim2New(1, -(Indent + 20), 0, 0),
            Position = UDim2New(0, Indent + 18, 0, 0),
            RichText = true,
            TextWrapped = true,
            TextXAlignment = Enum.TextXAlignment.Left,
            TextYAlignment = Enum.TextYAlignment.Top,
            AutomaticSize = Enum.AutomaticSize.Y,
            TextSize = TextSize,
            ZIndex = 212
        })
        Label:AddToTheme({ TextColor3 = "Text" })
        return Row, Bullet, Label
    end

    local function CreateDiscordQuoteRow(Parent, Order, Text, Depth)
        local Row = CreateDiscordUpdateRow(Parent, Order)
        local Indent = 2 + ((Depth or 0) * 12)
        local Bar = Instances:Create("Frame", {
            Parent = Row.Instance,
            Name = "\0",
            BorderSizePixel = 0,
            BackgroundColor3 = Library.Theme.Accent,
            Size = UDim2New(0, 3, 1, 0),
            Position = UDim2New(0, Indent, 0, 0),
            ZIndex = 212
        })
        Bar:AddToTheme({ BackgroundColor3 = "Accent" })

        local Label = Instances:Create("TextLabel", {
            Parent = Row.Instance,
            Name = "\0",
            FontFace = Library.Font,
            TextColor3 = FromRGB(255, 255, 255),
            TextTransparency = 0.16,
            BorderSizePixel = 0,
            BackgroundTransparency = 1,
            Text = ApplyDiscordInlineFormatting(Text),
            Size = UDim2New(1, -(Indent + 12), 0, 0),
            Position = UDim2New(0, Indent + 10, 0, 0),
            RichText = true,
            TextWrapped = true,
            TextXAlignment = Enum.TextXAlignment.Left,
            TextYAlignment = Enum.TextYAlignment.Top,
            AutomaticSize = Enum.AutomaticSize.Y,
            TextSize = 15,
            ZIndex = 212
        })
        Label:AddToTheme({ TextColor3 = "Text" })
        return Row, Bar, Label
    end

    local function RenderDiscordUpdateContent(Parent, Content)
        local Order = 0
        local InMultiQuote = false
        local Normalized = tostring(Content or "")
        Normalized = StringGSub(Normalized, "\r\n", "\n")
        Normalized = StringGSub(Normalized, "\r", "\n")

        for Line in string.gmatch(Normalized .. "\n", "(.-)\n") do
            local RawLine = tostring(Line or "")
            local Trimmed = StringGSub(RawLine, "^%s+", "")

            if Trimmed == "" then
                Order = Order + 1
                Instances:Create("Frame", {
                    Parent = Parent,
                    Name = "\0",
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 6),
                    LayoutOrder = Order
                })
            else
                local MultiQuoteText = string.match(RawLine, "^>>>%s?(.*)$")
                if MultiQuoteText then
                    InMultiQuote = true
                    RawLine = MultiQuoteText
                    Trimmed = StringGSub(RawLine, "^%s+", "")
                end

                local HeadingOne = string.match(Trimmed, "^#%s+(.+)$")
                local HeadingTwo = string.match(Trimmed, "^##%s+(.+)$")
                local HeadingThree = string.match(Trimmed, "^###%s+(.+)$")
                local Subtext = string.match(Trimmed, "^%-%#%s+(.+)$")
                local QuoteText = string.match(Trimmed, "^>%s?(.*)$")
                local BulletSpaces, BulletValue = string.match(RawLine, "^(%s*)[-*]%s+(.+)$")
                local NumberSpaces, NumberBullet, NumberValue = string.match(RawLine, "^(%s*)(%d+%.)%s+(.+)$")

                Order = Order + 1

                if HeadingThree then
                    CreateDiscordUpdateText(Parent, Order, HeadingThree, 18, 0.12, 0)
                elseif HeadingTwo then
                    CreateDiscordUpdateText(Parent, Order, HeadingTwo, 21, 0.04, 0)
                elseif HeadingOne then
                    CreateDiscordUpdateText(Parent, Order, HeadingOne, 26, 0, 0)
                elseif Subtext then
                    CreateDiscordUpdateText(Parent, Order, Subtext, 12, 0.3, 0)
                elseif QuoteText or InMultiQuote then
                    local QuoteContent = QuoteText or Trimmed
                    CreateDiscordQuoteRow(Parent, Order, QuoteContent, 0)
                elseif BulletValue then
                    local Depth = MathFloor(StringLen(BulletSpaces) / 2)
                    local Bullet = Depth > 0 and "◦" or "•"
                    CreateDiscordBulletRow(Parent, Order, Bullet, BulletValue, 15, Depth)
                elseif NumberValue then
                    local Depth = MathFloor(StringLen(NumberSpaces) / 2)
                    CreateDiscordBulletRow(Parent, Order, NumberBullet, NumberValue, 15, Depth)
                else
                    CreateDiscordUpdateText(Parent, Order, Trimmed, 15, 0.08, 0)
                end
            end
        end
    end

    Library.MakeUpdateNotification = function(self, Data)
        Data = Data or {}
        if self.ActiveUpdateNotification and self.ActiveUpdateNotification.Close then
            pcall(function() self.ActiveUpdateNotification.Close(true) end)
            self.ActiveUpdateNotification = nil
        end

        local MobilePanelHeight = MathClamp(Camera.ViewportSize.Y - 34, 320, 430)
        local PanelHeight = IsMobile and MobilePanelHeight or 460
        local ContentInset = IsMobile and 12 or 16
        local BottomInset = IsMobile and 12 or 16
        local ButtonHeight = IsMobile and 44 or 42
        local ButtonGap = IsMobile and 8 or 12
        local ButtonStackHeight = IsMobile and ((ButtonHeight * 2) + ButtonGap) or ButtonHeight
        local Closed = false

        local Items = {}

        do
            Items["Notification"] = Instances:Create("Frame", {
                Parent = self.AnnouncementHolder.Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                BorderSizePixel = 0,
                AnchorPoint = Vector2New(0.5, 0),
                Position = UDim2New(0.5, 0, 0, -PanelHeight - 40),
                Size = UDim2New(1, IsMobile and -12 or -24, 0, PanelHeight),
                BackgroundColor3 = FromRGB(17, 16, 20),
                ClipsDescendants = true,
                ZIndex = 210
            })
            Items["Notification"]:AddToTheme({ BackgroundColor3 = "Background" })

            Instances:Create("UISizeConstraint", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                MaxSize = Vector2New(IsMobile and 520 or 640, IsMobile and 430 or 460),
                MinSize = Vector2New(IsMobile and 220 or 300, IsMobile and 300 or 280)
            })

            Instances:Create("UICorner", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 10)
            })

            Items["Stroke"] = Instances:Create("UIStroke", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                Color = FromRGB(36, 33, 42),
                Transparency = 0.08,
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })
            Items["Stroke"]:AddToTheme({ Color = "Border" })

            Items["LogHolder"] = Instances:Create("ScrollingFrame", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                Position = UDim2New(0, ContentInset, 0, ContentInset),
                Size = UDim2New(1, -(ContentInset * 2), 1, -(ContentInset + ButtonStackHeight + BottomInset + 10)),
                BackgroundColor3 = FromRGB(26, 25, 31),
                BorderSizePixel = 0,
                BackgroundTransparency = 0.15,
                CanvasSize = UDim2New(0, 0, 0, 0),
                AutomaticCanvasSize = Enum.AutomaticSize.Y,
                ScrollBarThickness = IsMobile and 3 or 4,
                ZIndex = 211
            })
            Items["LogHolder"]:AddToTheme({ BackgroundColor3 = "Inline" })

            Instances:Create("UICorner", {
                Parent = Items["LogHolder"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 8)
            })

            Instances:Create("UIPadding", {
                Parent = Items["LogHolder"].Instance,
                Name = "\0",
                PaddingTop = UDimNew(0, IsMobile and 8 or 10),
                PaddingBottom = UDimNew(0, IsMobile and 8 or 10),
                PaddingRight = UDimNew(0, IsMobile and 8 or 10),
                PaddingLeft = UDimNew(0, IsMobile and 8 or 10)
            })

            Items["LogContent"] = Instances:Create("Frame", {
                Parent = Items["LogHolder"].Instance,
                Name = "\0",
                BorderSizePixel = 0,
                BackgroundTransparency = 1,
                Size = UDim2New(1, -4, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                ZIndex = 212
            })

            Instances:Create("UIListLayout", {
                Parent = Items["LogContent"].Instance,
                Name = "\0",
                FillDirection = Enum.FillDirection.Vertical,
                HorizontalAlignment = Enum.HorizontalAlignment.Left,
                SortOrder = Enum.SortOrder.LayoutOrder,
                Padding = UDimNew(0, 4)
            })

            RenderDiscordUpdateContent(Items["LogContent"].Instance, tostring(Data.Content or ""))

            Items["RejoinButton"] = Instances:Create("TextButton", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Subfont,
                TextColor3 = FromRGB(255, 255, 255),
                Text = "Update to this version!",
                Position = IsMobile and UDim2New(0, ContentInset, 1, -(BottomInset + ButtonHeight + ButtonGap + ButtonHeight)) or UDim2New(0, 16, 1, -58),
                Size = IsMobile and UDim2New(1, -(ContentInset * 2), 0, ButtonHeight) or UDim2New(0.5, -22, 0, ButtonHeight),
                BorderSizePixel = 0,
                AutoButtonColor = false,
                BackgroundColor3 = Library.Theme.Accent,
                TextSize = IsMobile and 17 or 16,
                ZIndex = 212
            })

            Instances:Create("UIStroke", {
                Parent = Items["RejoinButton"].Instance,
                Name = "\0",
                Color = FromRGB(255, 255, 255),
                Transparency = 0.72,
                Thickness = 1.1,
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })

            Instances:Create("UICorner", {
                Parent = Items["RejoinButton"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 8)
            })

            Items["CloseButton"] = Instances:Create("TextButton", {
                Parent = Items["Notification"].Instance,
                Name = "\0",
                FontFace = Library.Subfont,
                TextColor3 = FromRGB(255, 255, 255),
                Text = "Close",
                Position = IsMobile and UDim2New(0, ContentInset, 1, -(BottomInset + ButtonHeight)) or UDim2New(0.5, 6, 1, -58),
                Size = IsMobile and UDim2New(1, -(ContentInset * 2), 0, ButtonHeight) or UDim2New(0.5, -22, 0, ButtonHeight),
                BorderSizePixel = 0,
                AutoButtonColor = false,
                BackgroundColor3 = FromRGB(45, 45, 55),
                TextSize = IsMobile and 17 or 16,
                ZIndex = 212
            })
            Items["CloseButton"]:AddToTheme({ BackgroundColor3 = "Element" })

            Instances:Create("UIStroke", {
                Parent = Items["CloseButton"].Instance,
                Name = "\0",
                Color = FromRGB(255, 255, 255),
                Transparency = 0.78,
                Thickness = 1,
                ApplyStrokeMode = Enum.ApplyStrokeMode.Border
            })

            Instances:Create("UICorner", {
                Parent = Items["CloseButton"].Instance,
                Name = "\0",
                CornerRadius = UDimNew(0, 8)
            })
        end

        local UpdateDescendants = Items["Notification"].Instance:GetDescendants()

        local function TweenUpdateDescendants(TargetVisible)
            for _, Descendant in UpdateDescendants do
                if Descendant:IsA("TextLabel") then
                    local GoalTransparency = TargetVisible and Descendant.TextTransparency or 1
                    local ExistingTransparency = Descendant:GetAttribute("UpdateOriginalTextTransparency")
                    if ExistingTransparency == nil then
                        ExistingTransparency = Descendant.TextTransparency
                        Descendant:SetAttribute("UpdateOriginalTextTransparency", ExistingTransparency)
                    end
                    Descendant.TextTransparency = TargetVisible and 1 or Descendant.TextTransparency
                    Tween:Create(Descendant, nil, { TextTransparency = TargetVisible and ExistingTransparency or 1 }, true)
                elseif Descendant:IsA("Frame") and Descendant ~= Items["Notification"].Instance and Descendant ~= Items["LogHolder"].Instance then
                    local ExistingTransparency = Descendant:GetAttribute("UpdateOriginalBackgroundTransparency")
                    if ExistingTransparency == nil then
                        ExistingTransparency = Descendant.BackgroundTransparency
                        Descendant:SetAttribute("UpdateOriginalBackgroundTransparency", ExistingTransparency)
                    end
                    Descendant.BackgroundTransparency = TargetVisible and 1 or Descendant.BackgroundTransparency
                    Tween:Create(Descendant, nil, { BackgroundTransparency = TargetVisible and ExistingTransparency or 1 }, true)
                end
            end
        end

        local function CloseUpdateNotification(Instant)
            if Closed then return end
            Closed = true

            if Instant then
                if self.ActiveUpdateNotification and self.ActiveUpdateNotification.Notification == Items["Notification"] then
                    self.ActiveUpdateNotification = nil
                end
                Items["Notification"]:Clean()
                return
            end

            for _, Key in next, {"Notification", "LogHolder", "RejoinButton", "CloseButton"} do
                Items[Key]:Tween(nil, { BackgroundTransparency = 1 })
            end
            Items["Stroke"]:Tween(nil, { Transparency = 1 })
            TweenUpdateDescendants(false)

            local SlideOut = TweenService:Create(Items["Notification"].Instance, TweenInfo.new(0.28, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { Position = UDim2New(0.5, 0, 0, -PanelHeight - 40) })
            SlideOut:Play()
            task.wait(0.32)

            if self.ActiveUpdateNotification and self.ActiveUpdateNotification.Notification == Items["Notification"] then
                self.ActiveUpdateNotification = nil
            end
            Items["Notification"]:Clean()
        end

        self.ActiveUpdateNotification = {
            Notification = Items["Notification"],
            Close = CloseUpdateNotification
        }

        for _, Key in next, {"Notification", "LogHolder", "RejoinButton", "CloseButton"} do
            Items[Key].Instance.BackgroundTransparency = 1
        end
        Items["Stroke"].Instance.Transparency = 1
        TweenUpdateDescendants(true)

        Items["CloseButton"].Instance.MouseButton1Click:Connect(function()
            CloseUpdateNotification(false)
        end)

        Items["RejoinButton"].Instance.MouseButton1Click:Connect(function()
            QueueUpdateRejoinScript()
            pcall(function() TeleportService:Teleport(game.PlaceId, LocalPlayer) end)
        end)

        Library:Thread(function()
            for _, Key in next, {"Notification", "LogHolder", "RejoinButton", "CloseButton"} do
                Items[Key]:Tween(nil, { BackgroundTransparency = 0 })
            end
            Items["Stroke"]:Tween(nil, { Transparency = 0.08 })
            TweenUpdateDescendants(true)

            local SlideIn = TweenService:Create(Items["Notification"].Instance, TweenInfo.new(0.42, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0.5, 0, 0, 18) })
            SlideIn:Play()
        end)
    end

    Library.ConnectGlobalChat = function(self)
        if not WebSocketFunction then return end
        if not self.GlobalChat or not self.GlobalChat.AutoConnect then return end

        local GC = self.GlobalChat
        local Connected = false
        local Socket = nil
        local PingThread = nil
        local Destroyed = false
        local MessageConnection = nil
        local CloseConnection = nil

        local function GetHwid()
            local ok, result = pcall(function()
                if gethwid then return gethwid() end
                if getexecutorhwid then return getexecutorhwid() end
                if get_hwid then return get_hwid() end
                return ""
            end)
            return ok and tostring(result or "") or ""
        end

        local function BuildWsUrl()
            local Base = GC.WsUrl
            local Params = {
                "token=" .. HttpService:UrlEncode(GC.Token),
                "senderId=" .. HttpService:UrlEncode(tostring(LocalPlayer.UserId)),
                "username=" .. HttpService:UrlEncode(tostring(LocalPlayer.Name)),
                "clientId=" .. HttpService:UrlEncode(HttpService:GenerateGUID(false)),
                "gameName=" .. HttpService:UrlEncode(tostring(game.Name or "")),
                "placeId=" .. HttpService:UrlEncode(tostring(game.PlaceId)),
                "joinedAt=" .. HttpService:UrlEncode(tostring(MathFloor(os.time()))),
                "hwid=" .. HttpService:UrlEncode(GetHwid())
            }
            return Base .. "?" .. TableConcat(Params, "&")
        end

        local function HandlePacket(Packet)
            local PacketType = Packet.type

            if PacketType == "history" or PacketType == "stats" then
                self.GlobalChat.ConnectedUsers = Packet.connectedUsers or 0
                return
            end

            if type(Packet.hwidBan) == "table" and Packet.hwidBan.banned then
                Destroyed = true
                task.defer(function()
                    pcall(function() LocalPlayer:Kick(tostring(Packet.hwidBan.message or "Banned From ExpressHub")) end)
                end)
                return
            end

            if PacketType == "hwid_ban" and Packet.banned then
                local TargetSenderId = tostring(Packet.targetSenderId or "")
                local LocalSenderId = tostring(LocalPlayer.UserId or "")
                if TargetSenderId == "" or TargetSenderId == LocalSenderId then
                    Destroyed = true
                    task.defer(function()
                        pcall(function() LocalPlayer:Kick(tostring(Packet.message or "Banned From ExpressHub")) end)
                    end)
                end
                return
            end

            if PacketType == "force_update" then
                local FUData = type(Packet.forceUpdate) == "table" and Packet.forceUpdate or Packet
                local TargetGameId = tostring(FUData.targetGameId or "")
                if not DoesUpdateTargetMatch(TargetGameId) then return end
                local DelaySeconds = tonumber(FUData.delaySeconds) or 5
                if DelaySeconds < 1 then DelaySeconds = 1 end

                self:MakeGlobalAnnouncement({ Name = "ExpressHub", Content = "Force update in " .. tostring(DelaySeconds) .. "s — rejoining...", Time = DelaySeconds })
                task.spawn(function()
                    local Announcement = self.ActiveGlobalAnnouncement
                    for Remaining = DelaySeconds - 1, 1, -1 do
                        task.wait(1)
                        if Destroyed then return end
                        if self.ActiveGlobalAnnouncement == Announcement and Announcement and Announcement["Description"] then
                            pcall(function() Announcement["Description"].Instance.Text = "Force update in " .. Remaining .. "s — rejoining..." end)
                        end
                    end
                end)
                task.delay(DelaySeconds, function()
                    if Destroyed then return end
                    pcall(function()
                        QueueUpdateRejoinScript()
                        TeleportService:Teleport(game.PlaceId, LocalPlayer)
                    end)
                end)
                return
            end

            if PacketType == "announcement" and type(Packet.announcement) == "table" then
                local Ann = Packet.announcement
                self:MakeGlobalAnnouncement({ Name = Ann.title or "ExpressHub", Content = Ann.content or "", Time = Ann.duration or 7 })
                return
            end

            if PacketType == "game_kick" and type(Packet.gameKick) == "table" then
                local TargetSenderId = tostring(Packet.gameKick.targetSenderId or "")
                local LocalSenderId = tostring(LocalPlayer.UserId or "")
                if TargetSenderId ~= "" and TargetSenderId == LocalSenderId then
                    local KickReason = tostring(Packet.gameKick.reason or "")
                    task.defer(function()
                        pcall(function()
                            if KickReason ~= "" then LocalPlayer:Kick(KickReason) else LocalPlayer:Kick() end
                        end)
                    end)
                end
                return
            end

            if PacketType == "trial_expire" and type(Packet.trialExpire) == "table" then
                local TrialData = Packet.trialExpire
                local TargetSenderId = tostring(TrialData.targetSenderId or "")
                local TargetHwid = tostring(TrialData.targetHwid or "")
                local LocalSenderId = tostring(LocalPlayer.UserId or "")
                local LocalHwid = ""
                pcall(function() if self.GetHwidForTrial then LocalHwid = tostring(self.GetHwidForTrial() or "") end end)

                if (TargetSenderId ~= "" and TargetSenderId == LocalSenderId) or (TargetHwid ~= "" and LocalHwid ~= "" and TargetHwid == LocalHwid) then
                    task.spawn(function()
                        pcall(function()
                            if self.TriggerTrialExpiryFlow then
                                self.TriggerTrialExpiryFlow(tostring(TrialData.reason or "Your free trial has ended."))
                            end
                        end)
                    end)
                end
                return
            end

            if PacketType == "update_notify" then
                local Upd = Packet.updateNotify or {}
                local TargetGameId = tostring(Upd.targetGameId or "")
                if DoesUpdateTargetMatch(TargetGameId) then
                    self:MakeUpdateNotification({ Content = Upd.content or "" })
                end
                return
            end

            if PacketType == "poll_start" and type(Packet.poll) == "table" then
                if self._ActivePoll then
                    pcall(function()
                        if self._ActivePoll.ClosePoll then self._ActivePoll.ClosePoll() end
                    end)
                    self._ActivePoll = nil
                end

                local PollData = Packet.poll
                local PollId = tostring(PollData.id or "")
                local PollTitle = tostring(PollData.title or "Poll")
                local PollOptions = type(PollData.options) == "table" and PollData.options or {}
                local PollTotalSeconds = (tonumber(PollData.timerMinutes) or 1) * 60
                local PollStartTick = tick()
                local OptionPctRefs = {}

                local PollFrame = Instances:Create("Frame", {
                    Parent = Library.AnnouncementHolder.Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    BorderSizePixel = 0,
                    AnchorPoint = Vector2New(0.5, 0),
                    Position = UDim2New(0.5, 0, 0, -500),
                    Size = UDim2New(1, -24, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.Y,
                    BackgroundColor3 = FromRGB(17, 16, 20),
                    ClipsDescendants = true,
                    ZIndex = 200
                })
                PollFrame:AddToTheme({ BackgroundColor3 = "Background" })

                Instances:Create("UISizeConstraint", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    MaxSize = Vector2New(560, 800),
                    MinSize = Vector2New(260, 0)
                })

                Instances:Create("UIPadding", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    PaddingTop = UDimNew(0, 12),
                    PaddingBottom = UDimNew(0, 12),
                    PaddingRight = UDimNew(0, 14),
                    PaddingLeft = UDimNew(0, 14)
                })

                Instances:Create("UICorner", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 8)
                })

                local PollStroke = Instances:Create("UIStroke", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    Color = FromRGB(36, 33, 42),
                    Transparency = 0.08,
                    ApplyStrokeMode = Enum.ApplyStrokeMode.Border
                })
                PollStroke:AddToTheme({ Color = "Border" })

                local PollLayout = InstanceNew("UIListLayout")
                PollLayout.FillDirection = Enum.FillDirection.Vertical
                PollLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
                PollLayout.SortOrder = Enum.SortOrder.LayoutOrder
                PollLayout.Padding = UDimNew(0, 8)
                PollLayout.Parent = PollFrame.Instance

                local BadgeRow = Instances:Create("Frame", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 14),
                    ZIndex = 201,
                    LayoutOrder = 1
                })
                Instances:Create("TextLabel", {
                    Parent = BadgeRow.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 214, 120),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "POLL",
                    Size = UDim2New(0.5, 0, 1, 0),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextSize = 13,
                    ZIndex = 201
                })

                local TimerInst = Instances:Create("TextLabel", {
                    Parent = BadgeRow.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 214, 120),
                    TextTransparency = 0.28,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "...",
                    Size = UDim2New(0.5, 0, 1, 0),
                    Position = UDim2New(0.5, 0, 0, 0),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    TextXAlignment = Enum.TextXAlignment.Right,
                    TextSize = 13,
                    ZIndex = 201
                })

                local TitleLabel = Instances:Create("TextLabel", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = PollTitle,
                    Size = UDim2New(1, 0, 0, 20),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    TextWrapped = true,
                    TextXAlignment = Enum.TextXAlignment.Center,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    TextSize = 18,
                    ZIndex = 201,
                    LayoutOrder = 2
                })
                TitleLabel:AddToTheme({ TextColor3 = "Text" })

                local OptionsHolder = Instances:Create("Frame", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.Y,
                    ZIndex = 201,
                    LayoutOrder = 3
                })

                local OptionsLayout = InstanceNew("UIListLayout")
                OptionsLayout.FillDirection = Enum.FillDirection.Vertical
                OptionsLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
                OptionsLayout.SortOrder = Enum.SortOrder.LayoutOrder
                OptionsLayout.Padding = UDimNew(0, 4)
                OptionsLayout.Parent = OptionsHolder.Instance

                local function MakeVoteButton(BtnIndex, BtnText)
                    local Container = Instances:Create("Frame", {
                        Parent = OptionsHolder.Instance,
                        Name = "\0",
                        BorderSizePixel = 0,
                        Size = UDim2New(1, 0, 0, 30),
                        BackgroundColor3 = FromRGB(26, 25, 31),
                        ZIndex = 201,
                        LayoutOrder = BtnIndex,
                        ClipsDescendants = true
                    })
                    Container:AddToTheme({ BackgroundColor3 = "Inline" })
                    Instances:Create("UICorner", {
                        Parent = Container.Instance,
                        Name = "\0",
                        CornerRadius = UDimNew(0, 6)
                    })
                    Instances:Create("UIStroke", {
                        Parent = Container.Instance,
                        Name = "\0",
                        Color = FromRGB(36, 33, 42),
                        Transparency = 0.4,
                        ApplyStrokeMode = Enum.ApplyStrokeMode.Border
                    }):AddToTheme({ Color = "Border" })

                    local PctBar = Instances:Create("Frame", {
                        Parent = Container.Instance,
                        Name = "\0",
                        BorderSizePixel = 0,
                        BackgroundColor3 = FromRGB(246, 178, 255),
                        BackgroundTransparency = 0.72,
                        Size = UDim2New(0, 0, 1, 0),
                        ZIndex = 201
                    })
                    PctBar:AddToTheme({ BackgroundColor3 = "Accent" })
                    Instances:Create("UICorner", {
                        Parent = PctBar.Instance,
                        Name = "\0",
                        CornerRadius = UDimNew(0, 6)
                    })

                    local Btn = Instances:Create("TextButton", {
                        Parent = Container.Instance,
                        Name = "\0",
                        FontFace = Library.Font,
                        TextColor3 = FromRGB(255, 255, 255),
                        TextTransparency = 0.1,
                        BorderColor3 = FromRGB(0, 0, 0),
                        Text = BtnText,
                        AutoButtonColor = false,
                        Size = UDim2New(1, 0, 1, 0),
                        BorderSizePixel = 0,
                        BackgroundTransparency = 1,
                        TextSize = 13,
                        TextXAlignment = Enum.TextXAlignment.Left,
                        ZIndex = 203
                    })
                    Btn:AddToTheme({ TextColor3 = "Text" })
                    Instances:Create("UIPadding", {
                        Parent = Btn.Instance,
                        Name = "\0",
                        PaddingLeft = UDimNew(0, 10)
                    })

                    OptionPctRefs[BtnIndex] = { Container = Container, Button = Btn, PctBar = PctBar, OrigText = BtnText }

                    Btn:OnHover(function()
                        if self._ActivePoll and self._ActivePoll.HasVoted then return end
                        Container:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] or FromRGB(34, 33, 41) })
                    end)

                    Btn:OnHoverLeave(function()
                        Container:Tween(nil, { BackgroundColor3 = Library.Theme["Inline"] or FromRGB(26, 25, 31) })
                    end)

                    Btn.Instance.MouseButton1Click:Connect(function()
                        if not self._ActivePoll then return end
                        if self._ActivePoll.PollId ~= PollId then return end
                        if self._ActivePoll.HasVoted then return end
                        if Destroyed then return end

                        self._ActivePoll.HasVoted = true
                        local VoteBody = JsonEncode({ senderId = tostring(LocalPlayer.UserId), optionIndex = BtnIndex - 1 })
                        if not VoteBody then self._ActivePoll.HasVoted = false return end

                        local Ok = pcall(function()
                            RequestFunction({
                                Url = GC.HttpUrl .. "/poll/vote",
                                Method = "POST",
                                Headers = { ["Content-Type"] = "application/json", ["x-chat-token"] = GC.Token },
                                Body = VoteBody
                            })
                        end)

                        if not Ok then
                            if self._ActivePoll and self._ActivePoll.PollId == PollId then self._ActivePoll.HasVoted = false end
                            return
                        end

                        pcall(function()
                            if self._ActivePoll and self._ActivePoll.PostVoteLabel then
                                self._ActivePoll.PostVoteLabel.Instance.Visible = true
                            end
                        end)
                    end)
                end

                for i, OptData in PollOptions do
                    local OptText = type(OptData) == "table" and tostring(OptData.text or "") or tostring(OptData)
                    MakeVoteButton(i, OptText)
                end

                local PostVoteLabel = Instances:Create("TextLabel", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "If you don't want to vote, you can close this poll.",
                    TextWrapped = true,
                    Size = UDim2New(1, 0, 0, 14),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    TextXAlignment = Enum.TextXAlignment.Center,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    TextSize = 12,
                    ZIndex = 201,
                    Visible = false,
                    LayoutOrder = 4
                })
                PostVoteLabel:AddToTheme({ TextColor3 = "Text" })

                Instances:Create("Frame", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    BorderSizePixel = 0,
                    Size = UDim2New(1, 0, 0, 2),
                    BackgroundTransparency = 1,
                    LayoutOrder = 5
                })

                local PollLiner = Instances:Create("Frame", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 6),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(26, 25, 31),
                    ZIndex = 201,
                    LayoutOrder = 6
                })
                PollLiner:AddToTheme({ BackgroundColor3 = "Inline" })

                Instances:Create("UIGradient", {
                    Parent = PollLiner.Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Instances:Create("UICorner", {
                    Parent = PollLiner.Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                local PollAccent = Instances:Create("Frame", {
                    Parent = PollLiner.Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(246, 178, 255),
                    ZIndex = 202
                })
                PollAccent:AddToTheme({ BackgroundColor3 = "Accent" })

                Instances:Create("UIGradient", {
                    Parent = PollAccent.Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Instances:Create("UICorner", {
                    Parent = PollAccent.Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                local DontVoteBtn = Instances:Create("TextButton", {
                    Parent = PollFrame.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "Close",
                    AutoButtonColor = false,
                    Size = UDim2New(0, 80, 0, 20),
                    AnchorPoint = Vector2New(0, 0),
                    BorderSizePixel = 0,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(26, 25, 31),
                    ZIndex = 202,
                    LayoutOrder = 7
                })
                DontVoteBtn:AddToTheme({ BackgroundColor3 = "Inline", TextColor3 = "Text" })
                Instances:Create("UICorner", {
                    Parent = DontVoteBtn.Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 5)
                })

                DontVoteBtn:OnHover(function() DontVoteBtn:Tween(nil, { TextTransparency = 0.1 }) end)
                DontVoteBtn:OnHoverLeave(function() DontVoteBtn:Tween(nil, { TextTransparency = 0.4 }) end)

                local PollClosed = false

                local function ClosePoll()
                    if PollClosed then return end
                    PollClosed = true
                    if self._ActivePoll and self._ActivePoll.PollId == PollId then self._ActivePoll = nil end
                    TweenService:Create(PollFrame.Instance, TweenInfo.new(0.26, Enum.EasingStyle.Quad, Enum.EasingDirection.In), { Position = UDim2New(0.5, 0, 0, -500) }):Play()
                    task.delay(0.35, function() pcall(function() PollFrame:Clean() end) end)
                end

                DontVoteBtn.Instance.MouseButton1Click:Connect(ClosePoll)

                self._ActivePoll = {
                    PollId = PollId,
                    HasVoted = false,
                    TotalSeconds = PollTotalSeconds,
                    StartTick = PollStartTick,
                    OptionPctRefs = OptionPctRefs,
                    PostVoteLabel = PostVoteLabel,
                    TimerLabel = TimerInst,
                    PollAccent = PollAccent,
                    ClosePoll = ClosePoll
                }

                Library:Thread(function()
                    PollFrame.Instance.BackgroundTransparency = 1
                    PollStroke.Instance.Transparency = 1

                    local PollDescendants = PollFrame.Instance:GetDescendants()
                    for _, Desc in PollDescendants do
                        if Desc:IsA("TextLabel") or Desc:IsA("TextButton") then
                            Desc.TextTransparency = 1
                        elseif Desc:IsA("UIStroke") then
                            Desc.Transparency = 1
                        end
                    end

                    PollFrame:Tween(nil, { BackgroundTransparency = 0 })
                    PollStroke:Tween(nil, { Transparency = 0.08 })
                    TweenService:Create(PollFrame.Instance, TweenInfo.new(0.42, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0.5, 0, 0, 18) }):Play()
                    PollAccent:Tween(TweenInfo.new(PollTotalSeconds, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut), { Size = UDim2New(0, 0, 1, 0) })

                    task.wait(0.1)
                    for _, Desc in PollDescendants do
                        if Desc:IsA("TextLabel") then
                            TweenService:Create(Desc, TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { TextTransparency = Desc.TextTransparency > 0.5 and 0.4 or 0.1 }):Play()
                        elseif Desc:IsA("TextButton") then
                            TweenService:Create(Desc, TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { TextTransparency = 0.1 }):Play()
                        elseif Desc:IsA("UIStroke") then
                            TweenService:Create(Desc, TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Transparency = 0.4 }):Play()
                        end
                    end

                    Library:Thread(function()
                        while not Destroyed do
                            local APoll = self._ActivePoll
                            if not APoll or APoll.PollId ~= PollId then break end
                            local Elapsed = tick() - APoll.StartTick
                            local Remaining = math.max(0, math.floor(APoll.TotalSeconds - Elapsed))
                            local Hours = math.floor(Remaining / 3600)
                            local Mins = math.floor((Remaining % 3600) / 60)
                            local Secs = Remaining % 60
                            local TimeStr
                            if Hours > 0 then
                                TimeStr = StringFormat("%dh %02dm %02ds", Hours, Mins, Secs)
                            else
                                TimeStr = StringFormat("%dm %02ds", Mins, Secs)
                            end
                            pcall(function() APoll.TimerLabel.Instance.Text = TimeStr end)
                            if Remaining <= 0 then break end
                            task.wait(1)
                        end
                    end)
                end)
                return
            end

            if PacketType == "poll_update" and type(Packet.poll) == "table" then
                local APoll = self._ActivePoll
                if not APoll then return end
                if not APoll.HasVoted then return end
                if tostring(Packet.poll.id or "") ~= APoll.PollId then return end

                local OptionsData = type(Packet.poll.options) == "table" and Packet.poll.options or {}
                local TotalVotes = tonumber(Packet.poll.totalVotes) or 0

                for i, OptInfo in OptionsData do
                    local Ref = APoll.OptionPctRefs and APoll.OptionPctRefs[i]
                    if Ref and type(OptInfo) == "table" then
                        local Votes = tonumber(OptInfo.votes) or 0
                        local Pct = TotalVotes > 0 and math.floor((Votes / TotalVotes) * 100) or 0
                        pcall(function()
                            Ref.Button.Instance.Text = Ref.OrigText .. "  —  " .. tostring(Pct) .. "%"
                            TweenService:Create(Ref.PctBar.Instance, TweenInfo.new(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Size = UDim2New(Pct / 100, 0, 1, 0) }):Play()
                        end)
                    end
                end
                return
            end

            if PacketType == "poll_end" and type(Packet.poll) == "table" then
                local APoll = self._ActivePoll
                if not APoll then return end
                pcall(function()
                    APoll.TimerLabel.Instance.Text = "ENDED"
                    APoll.TimerLabel.Instance.TextColor3 = FromRGB(255, 90, 90)
                end)

                local OptionsData = type(Packet.poll.options) == "table" and Packet.poll.options or {}
                local TotalVotes = tonumber(Packet.poll.totalVotes) or 0

                for i, OptInfo in OptionsData do
                    local Ref = APoll.OptionPctRefs and APoll.OptionPctRefs[i]
                    if Ref and type(OptInfo) == "table" then
                        local Pct = tonumber(OptInfo.percentage) or 0
                        local Votes = tonumber(OptInfo.votes) or 0
                        pcall(function()
                            Ref.Button.Instance.Text = Ref.OrigText .. "  —  " .. tostring(Pct) .. "% (" .. tostring(Votes) .. ")"
                            TweenService:Create(Ref.PctBar.Instance, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Size = UDim2New(Pct / 100, 0, 1, 0) }):Play()
                        end)
                    end
                end

                pcall(function()
                    APoll.PostVoteLabel.Instance.Visible = true
                    APoll.PostVoteLabel.Instance.Text = "Poll ended! " .. tostring(TotalVotes) .. " player" .. (TotalVotes ~= 1 and "s" or "") .. " voted."
                end)

                task.delay(8, function()
                    local FinalPoll = self._ActivePoll
                    if FinalPoll and FinalPoll.PollId == tostring(Packet.poll.id or "") then
                        FinalPoll.ClosePoll()
                    end
                end)
                return
            end

            if PacketType == "poll_close" then
                if self._ActivePoll then pcall(function() self._ActivePoll.ClosePoll() end) end
                return
            end
        end

        local function Connect()
            if Destroyed then return end
            pcall(function() if Socket then SocketClose(Socket) Socket = nil end end)
            Connected = false

            local Success, Ws = pcall(function() return WebSocketFunction(BuildWsUrl()) end)
            if not Success or not Ws then
                task.delay(GC.RetryDelay, Connect)
                return
            end

            Socket = Ws
            Connected = true

            if PingThread then pcall(function() task.cancel(PingThread) end) end
            PingThread = task.spawn(function()
                while Connected and not Destroyed do
                    task.wait(GC.PresenceInterval)
                    if Connected and Socket then
                        local Payload = JsonEncode({ type = "ping" })
                        if Payload then SocketSend(Socket, Payload) end
                    end
                end
            end)

            if MessageConnection and type(MessageConnection.Disconnect) == "function" then pcall(function() MessageConnection:Disconnect() end) end
            if CloseConnection and type(CloseConnection.Disconnect) == "function" then pcall(function() CloseConnection:Disconnect() end) end

            MessageConnection = ConnectSocketSignal(Socket.OnMessage or Socket.MessageReceived, function(Raw)
                local Packet = JsonDecode(Raw)
                if Packet and type(Packet) == "table" then pcall(HandlePacket, Packet) end
            end, Socket)

            CloseConnection = ConnectSocketSignal(Socket.OnClose or Socket.Closed, function()
                Connected = false
                Socket = nil
                if not Destroyed then task.delay(GC.RetryDelay, Connect) end
            end, Socket)
        end

        TableInsert(self.CleanupCallbacks, function()
            Destroyed = true
            Connected = false
            if PingThread then pcall(function() task.cancel(PingThread) end) end
            if MessageConnection and type(MessageConnection.Disconnect) == "function" then pcall(function() MessageConnection:Disconnect() end) MessageConnection = nil end
            if CloseConnection and type(CloseConnection.Disconnect) == "function" then pcall(function() CloseConnection:Disconnect() end) CloseConnection = nil end
            if Socket then SocketClose(Socket) Socket = nil end
        end)

        Library:Thread(function() Connect() end)
    end

    Library.AttachExpressButton = function(self, Window)
        if self._ExpressWidgets and self._ExpressWidgets.MainGui and self._ExpressWidgets.MainGui.Instance and self._ExpressWidgets.MainGui.Instance.Parent then
            self._ExpressWidgets.Window = Window
            return
        end

        for _, GuiName in {"CustomScreenGui"} do
            local Gui = CoreGui:FindFirstChild(GuiName)
            if Gui then Gui:Destroy() end
        end

        local Widgets = {
            Window = Window,
            SettingsLoopActive = true,
            LastSettings = {
                Toggle = self.ExpressExtraSettings.Toggle,
                ShowButton = self.ExpressExtraSettings.ShowButton
            }
        }
        self._ExpressWidgets = Widgets

        local function CheckSetting(Setting)
            return self.ExpressExtraSettings and self.ExpressExtraSettings[Setting] == true
        end

        local function CreateRipple()
            local Ripple = Instances:Create("Frame", {
                Parent = Widgets.MainFrame.Instance,
                Size = UDim2New(0, 0, 0, 0),
                Position = UDim2New(0.5, 0, 0.5, 0),
                AnchorPoint = Vector2New(0.5, 0.5),
                BackgroundColor3 = FromRGB(255, 255, 255),
                BackgroundTransparency = 0.7,
                BorderSizePixel = 0
            })
            Instances:Create("UICorner", {
                Parent = Ripple.Instance,
                CornerRadius = UDimNew(1, 0)
            })
            local RippleTween = TweenService:Create(Ripple.Instance, TweenInfo.new(0.5), { Size = UDim2New(1.5, 0, 1.5, 0), BackgroundTransparency = 1 })
            RippleTween:Play()
            RippleTween.Completed:Connect(function() Ripple:Clean() end)
        end

        local function AnimateButton(IsOpen)
            TweenService:Create(Widgets.FrameScale.Instance, TweenInfo.new(0.08, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Scale = 0.88 }):Play()
            TweenService:Create(Widgets.ImageStroke.Instance, TweenInfo.new(0.12, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Thickness = IsOpen and 2 or 1.25 }):Play()
            task.delay(0.08, function()
                if not Widgets.MainFrame or not Widgets.MainFrame.Instance or not Widgets.MainFrame.Instance.Parent then return end
                TweenService:Create(Widgets.FrameScale.Instance, TweenInfo.new(0.16, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { Scale = 1 }):Play()
            end)
        end

        local function CheckSettingsChanged()
            local Current = self.ExpressExtraSettings
            if not Current then return end
            if Widgets.LastSettings.Toggle ~= Current.Toggle then
                if Widgets.MainGui then Widgets.MainGui.Instance.Enabled = Current.Toggle end
                Widgets.LastSettings.Toggle = Current.Toggle
            end
            if Widgets.LastSettings.ShowButton ~= Current.ShowButton then
                if Widgets.MainFrame then Widgets.MainFrame.Instance.Visible = Current.ShowButton end
                Widgets.LastSettings.ShowButton = Current.ShowButton
            end
        end

        Widgets.MainGui = Instances:Create("ScreenGui", {
            Parent = CoreGui,
            Name = "CustomScreenGui",
            ResetOnSpawn = false,
            ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
            Enabled = CheckSetting("Toggle")
        })

        Widgets.MainFrame = Instances:Create("Frame", {
            Parent = Widgets.MainGui.Instance,
            BackgroundColor3 = Color3.fromRGB(20, 20, 20),
            BorderSizePixel = 0,
            Position = UDim2New(0.5, -25, 0, 30),
            Size = UDim2New(0, 50, 0, 50),
            Visible = CheckSetting("ShowButton")
        })

        Widgets.FrameScale = Instances:Create("UIScale", { Parent = Widgets.MainFrame.Instance })
        Instances:Create("UICorner", { Parent = Widgets.MainFrame.Instance, CornerRadius = UDimNew(0, 25) })

        Widgets.ImageLabel = Instances:Create("ImageLabel", {
            Parent = Widgets.MainFrame.Instance,
            Size = UDim2New(1, 0, 1, 0),
            BackgroundTransparency = 1
        })

        Widgets.ImageStroke = Instances:Create("UIStroke", {
            Parent = Widgets.ImageLabel.Instance,
            Color = Color3.fromRGB(255, 0, 255),
            Thickness = 1
        })

        Instances:Create("UICorner", { Parent = Widgets.ImageLabel.Instance, CornerRadius = UDimNew(0, 10) })

        Widgets.MainButton = Instances:Create("TextButton", {
            Parent = Widgets.ImageLabel.Instance,
            BackgroundTransparency = 1,
            Size = UDim2New(1, 0, 1, 0),
            Text = ""
        })

        Widgets.MainButton.Instance.MouseButton1Click:Connect(function()
            local Orion = Library.Holder and Library.Holder.Instance
            CreateRipple()
            if Orion then
                Orion.Enabled = not Orion.Enabled
                AnimateButton(Orion.Enabled)
            else
                AnimateButton(false)
            end
        end)

        Widgets.MainFrame:MakeDraggable()

        task.defer(function()
            if self._ExpressWidgets ~= Widgets then return end
            Widgets.ImageLabel.Instance.Image = "rbxassetid://118529184603611"
        end)

        task.spawn(function()
            while Widgets.SettingsLoopActive and Library == self do
                CheckSettingsChanged()
                task.wait(0.2)
            end
        end)

        self:RegisterCleanupCallback(function()
            Widgets.SettingsLoopActive = false
            if Widgets.MainGui then Widgets.MainGui:Clean() end
            self._ExpressWidgets = nil
        end)
    end

    do
        local function GetHwidForTrial()
            local ok, result = pcall(function()
                if gethwid then return gethwid() end
                if getexecutorhwid then return getexecutorhwid() end
                if get_hwid then return get_hwid() end
                return ""
            end)
            return ok and tostring(result or "") or ""
        end

        local function GetTrialGameName()
            local success, info = pcall(function()
                return game:GetService("MarketplaceService"):GetProductInfo(game.PlaceId)
            end)
            if success and info and info.Name then return info.Name end
            return tostring(game.Name or "Unknown")
        end

        local function NotifyTrial(Title, Description, Duration)
            pcall(function()
                Library:MakeNotification({ Name = Title, Content = Description, Time = Duration or 4 })
            end)
        end

        local function OpenPremiumInvite()
            local PremiumUrl = "https://express-hub.sellhub.cx/"
            local copied = setclipboard and pcall(setclipboard, PremiumUrl)
            if copied then
                NotifyTrial("Premium Required", "Premium website copied to clipboard.", 5)
            else
                NotifyTrial("Copied!", "Premium website copied to clipboard.", 5)
            end
        end

        local function UpdateLastKnownTrialState(isActive, remainingMs)
            local TrialMgr = Library.TrialManager
            if not TrialMgr then return end
            local RemainingMs = math.max(0, tonumber(remainingMs) or 0)
            TrialMgr.LastKnownTrialActive = isActive == true and RemainingMs > 0
            TrialMgr.LastKnownRemainingMs = TrialMgr.LastKnownTrialActive and RemainingMs or 0
            TrialMgr.LastKnownSyncedAt = TrialMgr.LastKnownTrialActive and tick() or 0
        end

        local function SetTrialCacheState(isActive, remainingMs, isClaimed, isExpired)
            local TrialMgr = Library.TrialManager
            if not TrialMgr then return end
            TrialMgr.Cached = true
            TrialMgr.CachedTrialActive = isActive == true
            TrialMgr.CachedRemainingMs = math.max(0, tonumber(remainingMs) or 0)
            TrialMgr.CachedClaimed = isClaimed == true
            TrialMgr.CachedExpired = isExpired == true
            if TrialMgr.CachedTrialActive then
                UpdateLastKnownTrialState(true, TrialMgr.CachedRemainingMs)
            elseif TrialMgr.CachedClaimed or TrialMgr.CachedExpired then
                UpdateLastKnownTrialState(false, 0)
            end
        end

        local function BuildTrialPayload(hwid)
            return {
                hwid = hwid,
                senderId = tostring(LocalPlayer.UserId),
                username = tostring(LocalPlayer.Name),
                gameName = GetTrialGameName(),
                placeId = tonumber(game.PlaceId) or 0
            }
        end

        local function RequestTrialJson(route, payload)
            local TrialMgr = Library.TrialManager
            local ok, result = pcall(function()
                local response = RequestFunction({
                    Url = TrialMgr.HttpUrl .. route,
                    Method = "POST",
                    Headers = {
                        ["Content-Type"] = "application/json",
                        ["x-chat-token"] = TrialMgr.Token
                    },
                    Body = HttpService:JSONEncode(payload)
                })
                if not response or type(response.Body) ~= "string" or response.Body == "" then return nil end
                return HttpService:JSONDecode(response.Body)
            end)
            return ok and result or nil
        end

        local function TriggerTrialExpiryFlow(notificationContent)
            if Library._TrialExpiryHandling or Library._Unloaded then return end
            Library._TrialExpiryHandling = true
            Library._TrialExpired = true
            SetTrialCacheState(false, 0, true, true)
            pcall(function()
                StarterGui:SetCore("SendNotification", {
                    Title = "Trial Ended",
                    Text = tostring(notificationContent or "Your free trial has ended."),
                    Duration = 5
                })
            end)
            task.delay(0.35, function()
                pcall(function()
                    if getgenv().Library then getgenv().Library:Unload() elseif Library then Library:Unload() end
                end)
            end)
            task.spawn(function() pcall(ShowExpiredTrialScreen) end)
        end

        local function ClaimTrialWithHwid(durationMinutes)
            local hwid = GetHwidForTrial()
            if hwid == "" then return false, "Could not get HWID" end
            local claimPayload = BuildTrialPayload(hwid)
            claimPayload.durationMinutes = durationMinutes
            local decoded = RequestTrialJson("/trial/claim", claimPayload)

            if decoded and decoded.ok then
                SetTrialCacheState(true, decoded.remainingMs or (durationMinutes * 60 * 1000), true, false)
                pcall(UpdatePresence)
                return true, "Trial claimed successfully"
            end

            local checkDecoded = RequestTrialJson("/trial/check", BuildTrialPayload(hwid))
            if checkDecoded and checkDecoded.ok and checkDecoded.active then
                SetTrialCacheState(true, checkDecoded.remainingMs or (durationMinutes * 60 * 1000), true, false)
                pcall(UpdatePresence)
                return true, "Trial active"
            end

            Library.TrialManager.Cached = false
            return false, "Failed to claim trial"
        end

        local function CheckTrialStatus()
            local TrialMgr = Library.TrialManager
            if TrialMgr.Cached then
                return TrialMgr.CachedTrialActive, TrialMgr.CachedRemainingMs, TrialMgr.CachedClaimed or false, TrialMgr.CachedExpired or false
            end

            local hwid = GetHwidForTrial()
            if hwid == "" then
                SetTrialCacheState(false, 0, false, false)
                UpdateLastKnownTrialState(false, 0)
                return false, 0, false, false
            end

            local result = RequestTrialJson("/trial/check", BuildTrialPayload(hwid))
            if result and result.ok then
                SetTrialCacheState(result.active or false, result.remainingMs or 0, result.claimed or false, result.expired or false)
                pcall(UpdatePresence)
                return result.active or false, result.remainingMs or 0, result.claimed or false, result.expired or false
            end

            return false, 0, false, false
        end

        local function UpdatePresence()
            pcall(function()
                local hwid = GetHwidForTrial()
                RequestFunction({
                    Url = Library.TrialManager.HttpUrl .. "/presence",
                    Method = "POST",
                    Headers = {
                        ["Content-Type"] = "application/json",
                        ["x-chat-token"] = Library.TrialManager.Token
                    },
                    Body = HttpService:JSONEncode({
                        clientId = tostring(LocalPlayer.UserId),
                        senderId = tostring(LocalPlayer.UserId),
                        hwid = hwid ~= "" and hwid or nil,
                        username = tostring(LocalPlayer.Name),
                        gameName = GetTrialGameName(),
                        placeId = tonumber(game.PlaceId) or 0
                    })
                })
            end)
        end

        local function FormatTrialDurationMinutes(durationMinutes)
            local totalMinutes = math.max(1, math.floor(tonumber(durationMinutes) or 0))
            local days = math.floor(totalMinutes / 1440)
            local hours = math.floor((totalMinutes % 1440) / 60)
            local minutes = totalMinutes % 60
            local parts = {}
            if days > 0 then table.insert(parts, tostring(days) .. "D") end
            if hours > 0 then table.insert(parts, tostring(hours) .. "H") end
            if minutes > 0 or #parts == 0 then table.insert(parts, tostring(minutes) .. "M") end
            return table.concat(parts, " ")
        end

        local function GetTrialDefaultMinutes()
            local TrialMgr = Library.TrialManager
            local cachedMinutes = tonumber(TrialMgr.CachedDefaultMinutes)
            if cachedMinutes and cachedMinutes > 0 then return math.floor(cachedMinutes) end

            local ok, result = pcall(function()
                local response = RequestFunction({
                    Url = TrialMgr.HttpUrl .. "/trial/default-hours",
                    Method = "GET",
                    Headers = {
                        ["Content-Type"] = "application/json",
                        ["x-chat-token"] = TrialMgr.Token
                    }
                })
                if not response or type(response.Body) ~= "string" or response.Body == "" then return nil end
                return HttpService:JSONDecode(response.Body)
            end)

            local durationMinutes = 60
            if ok and result and result.ok then
                if tonumber(result.durationMinutes) then
                    durationMinutes = math.max(1, math.floor(tonumber(result.durationMinutes)))
                elseif tonumber(result.durationHours) then
                    durationMinutes = math.max(1, math.floor(tonumber(result.durationHours) * 60))
                end
            end

            TrialMgr.CachedDefaultMinutes = durationMinutes
            return durationMinutes
        end

        local function BuildTrialPanel(panelCfg)
            local uiRoot = gethui()
            for _, child in ipairs(uiRoot:GetChildren()) do
                if child.Name == "TrialGui" then child:Destroy() end
            end

            local metrics = IsMobile and {
                pw = 470, ph = 255, headerH = 42, titleW = 185, titleX = 14,
                badgeW = 126, badgeH = 22, badgeX = -138, badgeY = -11, badgeR = 11, badgeText = 10,
                iconSize = 60, iconY = 58, bodyTitleSize = 20, bodyTitleH = 28, bodyTitleY = 112,
                msgSize = 13, msgH = 36, msgY = 144, sidePad = 28, gap = 12,
                btnY = 203, btnH = 36, btnText = 12
            } or {
                pw = 540, ph = 280, headerH = 56, titleW = 205, titleX = 18,
                badgeW = 150, badgeH = 26, badgeX = -165, badgeY = -13, badgeR = 13, badgeText = 11,
                iconSize = 82, iconY = 64, bodyTitleSize = 24, bodyTitleH = 34, bodyTitleY = 132,
                msgSize = 14, msgH = 40, msgY = 168, sidePad = 34, gap = 14,
                btnY = 224, btnH = 40, btnText = 13
            }

            local gui = Instances:Create("ScreenGui", {
                Parent = uiRoot,
                Name = "TrialGui",
                ZIndexBehavior = Enum.ZIndexBehavior.Global,
                DisplayOrder = 999,
                ResetOnSpawn = false
            })

            local Modal = Instances:Create("Frame", {
                Parent = gui.Instance,
                Name = "TrialModal",
                AnchorPoint = Vector2New(0.5, 0.5),
                Size = UDim2New(0, metrics.pw, 0, metrics.ph),
                Position = UDim2New(0.5, 0, 0.5, 24),
                BackgroundColor3 = Library.Theme["Background"],
                BorderSizePixel = 0,
                ClipsDescendants = true
            })

            Instances:Create("UICorner", { Parent = Modal.Instance, CornerRadius = UDimNew(0, 12) })
            Instances:Create("UIStroke", { Parent = Modal.Instance, Color = Library.Theme["Border"], Thickness = 1 })

            local Header = Instances:Create("Frame", {
                Parent = Modal.Instance,
                Size = UDim2New(1, 0, 0, metrics.headerH),
                Position = UDim2New(0, 0, 0, 0),
                BackgroundTransparency = 1,
                BorderSizePixel = 0
            })

            local AccentLine = Instances:Create("Frame", {
                Parent = Header.Instance,
                Size = UDim2New(1, 0, 0, 2),
                Position = UDim2New(0, 0, 1, -2),
                BackgroundColor3 = Library.Theme["Accent"],
                BorderSizePixel = 0
            })

            local HeaderTitle = Instances:Create("TextLabel", {
                Parent = Header.Instance,
                Text = "Express Hub",
                FontFace = Library.Font,
                TextSize = metrics.bodyTitleSize - 6,
                TextColor3 = Library.Theme["Text"],
                Size = UDim2New(0, metrics.titleW, 1, 0),
                Position = UDim2New(0, metrics.titleX, 0, 0),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                TextXAlignment = Enum.TextXAlignment.Left
            })

            local BadgeFrame = Instances:Create("Frame", {
                Parent = Header.Instance,
                Size = UDim2New(0, metrics.badgeW, 0, metrics.badgeH),
                Position = UDim2New(1, metrics.badgeX, 0.5, metrics.badgeY),
                BackgroundColor3 = Color3.new(),
                BackgroundTransparency = 1,
                BorderSizePixel = 0
            })

            Instances:Create("UICorner", { Parent = BadgeFrame.Instance, CornerRadius = UDimNew(0, metrics.badgeR) })
            Instances:Create("UIStroke", { Parent = BadgeFrame.Instance, Color = Library.Theme["Accent"], Thickness = 2 })

            Instances:Create("TextLabel", {
                Parent = BadgeFrame.Instance,
                Text = panelCfg.badge or "PREMIUM REQUIRED",
                FontFace = Library.Font,
                TextSize = metrics.badgeText,
                TextColor3 = Library.Theme["Accent"],
                Size = UDim2New(1, 0, 1, 0),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Center
            })

            local Icon = Instances:Create("ImageLabel", {
                Parent = Modal.Instance,
                AnchorPoint = Vector2New(0.5, 0),
                Size = UDim2New(0, metrics.iconSize, 0, metrics.iconSize),
                Position = UDim2New(0.5, 0, 0, metrics.iconY),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                Image = "rbxassetid://107575027768011",
                ScaleType = Enum.ScaleType.Fit,
                ImageColor3 = Color3.new(1, 1, 1)
            })

            local BodyTitle = Instances:Create("TextLabel", {
                Parent = Modal.Instance,
                Text = panelCfg.title or "Premium required",
                FontFace = Library.Font,
                TextSize = metrics.bodyTitleSize,
                TextColor3 = Library.Theme["Text"],
                Size = UDim2New(1, -48, 0, metrics.bodyTitleH),
                Position = UDim2New(0, 24, 0, metrics.bodyTitleY),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                TextXAlignment = Enum.TextXAlignment.Center
            })

            local MsgLabel = Instances:Create("TextLabel", {
                Parent = Modal.Instance,
                Text = panelCfg.message or "",
                FontFace = Library.Font,
                TextSize = metrics.msgSize,
                TextColor3 = Library.Theme["Text"],
                TextTransparency = 0,
                Size = UDim2New(1, -56, 0, metrics.msgH),
                Position = UDim2New(0, 28, 0, metrics.msgY),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                TextWrapped = true,
                RichText = true,
                TextXAlignment = Enum.TextXAlignment.Center,
                TextYAlignment = Enum.TextYAlignment.Top
            })

            local btns = panelCfg.buttons or {}
            local btnW = math.floor((metrics.pw - metrics.sidePad * 2 - metrics.gap * (#btns - 1)) / #btns)
            local btnRowWidth = (btnW * #btns) + (metrics.gap * (#btns - 1))
            local btnStartX = math.floor((metrics.pw - btnRowWidth) / 2)

            for i, bd in ipairs(btns) do
                local xOff = btnStartX + (i - 1) * (btnW + metrics.gap)
                local B = Instances:Create("TextButton", {
                    Parent = Modal.Instance,
                    Text = bd.text,
                    FontFace = Library.Font,
                    TextSize = metrics.btnText,
                    TextColor3 = bd.textColor or Library.Theme["Text"],
                    Size = UDim2New(0, btnW, 0, metrics.btnH),
                    Position = UDim2New(0, xOff, 0, metrics.btnY),
                    BackgroundColor3 = bd.color or Library.Theme["Element"],
                    BorderSizePixel = 0,
                    AutoButtonColor = false
                })
                local ButtonScale = Instances:Create("UIScale", { Parent = B.Instance })
                Instances:Create("UICorner", { Parent = B.Instance, CornerRadius = UDimNew(0, 10) })
                if bd.stroke then
                    Instances:Create("UIStroke", { Parent = B.Instance, Color = bd.stroke, Thickness = bd.strokeThickness or 1 })
                end

                B.Instance.MouseEnter:Connect(function()
                    TweenService:Create(B.Instance, TweenInfo.new(0.12, Enum.EasingStyle.Quad), { BackgroundTransparency = 0.12 }):Play()
                    TweenService:Create(ButtonScale.Instance, TweenInfo.new(0.12, Enum.EasingStyle.Quad), { Scale = 1.03 }):Play()
                end)

                B.Instance.MouseLeave:Connect(function()
                    TweenService:Create(B.Instance, TweenInfo.new(0.12, Enum.EasingStyle.Quad), { BackgroundTransparency = 0 }):Play()
                    TweenService:Create(ButtonScale.Instance, TweenInfo.new(0.12, Enum.EasingStyle.Quad), { Scale = 1 }):Play()
                end)

                B.Instance.MouseButton1Click:Connect(function()
                    if bd.callback then bd.callback() end
                end)
            end

            Header:MakeDraggable(Modal)
            return gui, Modal, MsgLabel
        end

        local function ShowTrialScreen(trialDurationMinutes, alreadyClaimed)
            local state = { Claimed = false, Closed = false }
            local Busy = false
            local gui, Modal, MsgLabel
            local formattedTrialDuration = FormatTrialDurationMinutes(trialDurationMinutes)
            local trialBtnText = alreadyClaimed and "Free Trial Used" or ("Free Trial " .. formattedTrialDuration)

            gui, Modal, MsgLabel = BuildTrialPanel({
                badge = "PREMIUM REQUIRED",
                title = "Premium required",
                message = alreadyClaimed and "You've already used your free trial.\nPurchase premium to regain access." or ("Start your <b>" .. formattedTrialDuration .. "</b> free trial\nto get full access to this script."),
                buttons = {
                    {
                        text = "Exit",
                        color = FromRGB(43, 43, 55),
                        textColor = FromRGB(241, 241, 245),
                        callback = function()
                            if Busy then return end
                            Busy = true
                            state.Closed = true
                            gui.Instance:Destroy()
                        end
                    },
                    {
                        text = trialBtnText,
                        color = alreadyClaimed and FromRGB(43, 43, 55) or FromRGB(43, 43, 55),
                        textColor = alreadyClaimed and FromRGB(140, 142, 154) or FromRGB(241, 241, 245),
                        callback = function()
                            if Busy then return end
                            if alreadyClaimed then
                                MsgLabel.Instance.Text = "You've already used your free trial.\nPurchase premium to regain access."
                                return
                            end
                            Busy = true
                            MsgLabel.Instance.Text = "Contacting server..."
                            task.spawn(function()
                                local success = ClaimTrialWithHwid(trialDurationMinutes)
                                if success then
                                    state.Claimed = true
                                    state.Closed = true
                                    gui.Instance:Destroy()
                                else
                                    MsgLabel.Instance.Text = "Could not reach server.\nPlease try again."
                                    Busy = false
                                end
                            end)
                        end
                    },
                    {
                        text = "Purchase Premium",
                        color = Library.Theme["Accent"],
                        textColor = FromRGB(255, 255, 255),
                        callback = function() OpenPremiumInvite() end
                    }
                }
            })

            while not state.Closed do task.wait(0.05) end
            return state.Claimed
        end

        local function ShowExpiredTrialScreen()
            local state = { Closed = false }
            local Busy = false
            local gui, Modal, MsgLabel

            gui, Modal, MsgLabel = BuildTrialPanel({
                badge = "TRIAL EXPIRED",
                title = "Premium required",
                message = "Your free trial has expired.\nPurchase premium to keep using this script.",
                buttons = {
                    {
                        text = "Exit",
                        color = FromRGB(43, 43, 55),
                        textColor = FromRGB(241, 241, 245),
                        callback = function()
                            if Busy then return end
                            Busy = true
                            state.Closed = true
                            gui.Instance:Destroy()
                        end
                    },
                    {
                        text = "Free Trial Used",
                        color = FromRGB(43, 43, 55),
                        textColor = FromRGB(140, 142, 154),
                        callback = function()
                            MsgLabel.Instance.Text = "You've already used your free trial.\nPurchase premium to regain access."
                        end
                    },
                    {
                        text = "Purchase Premium",
                        color = Library.Theme["Accent"],
                        textColor = FromRGB(255, 255, 255),
                        callback = function() OpenPremiumInvite() end
                    }
                }
            })

            while not state.Closed do task.wait(0.05) end
        end

        Library.ClaimTrialWithHwid = ClaimTrialWithHwid
        Library.CheckTrialStatus = CheckTrialStatus
        Library.ShowTrialModal = ShowTrialScreen
        Library.ShowTrialExpiredModal = ShowExpiredTrialScreen
        Library.GetTrialDefaultMinutes = GetTrialDefaultMinutes
        Library.GetTrialDefaultHours = GetTrialDefaultMinutes
        Library.GetHwidForTrial = GetHwidForTrial
        Library.TriggerTrialExpiryFlow = TriggerTrialExpiryFlow
        Library._TrialExpired = false
        Library._TrialExpiryHandling = false

        task.spawn(function() pcall(GetTrialDefaultMinutes) end)
        task.spawn(function() pcall(CheckTrialStatus) end)

        task.spawn(function()
            local presenceTick = 0
            local checkTick = 0
            local wasActive = false

            while Library and not Library._Unloaded do
                task.wait(5)
                presenceTick = presenceTick + 5
                checkTick = checkTick + 5

                if presenceTick >= 10 then
                    presenceTick = 0
                    pcall(UpdatePresence)
                end

                if checkTick >= 30 then
                    checkTick = 0
                    if wasActive then
                        if not(Library and Library.TrialManager) then break end
                        Library.TrialManager.Cached = false
                        local ok, active, _, claimed = pcall(CheckTrialStatus)
                        if ok and claimed and (not active) then
                            TriggerTrialExpiryFlow("Your free trial has ended.")
                            break
                        end
                        if ok and active then wasActive = true end
                    else
                        if Library and Library.TrialManager and Library.TrialManager.CachedTrialActive then wasActive = true end
                    end
                end
            end
        end)
    end

    do
        Library.MakeWindow = function(self, Data)
            Data = Data or {}
            local TrialApi = type(self) == "table" and self.ShowTrialModal and self or Library
            local hasClaimedTrial
            local TrialActive = false
            local configuredTrialMinutes = tonumber(Data.TrialTimeMinutes)

            if configuredTrialMinutes then
                configuredTrialMinutes = math.max(1, math.floor(configuredTrialMinutes))
            end

            local configuredTrialTime = tonumber(Data.TrialTime)
            if not configuredTrialMinutes and configuredTrialTime then
                configuredTrialMinutes = math.max(1, math.floor(configuredTrialTime * 60))
            end

            local premiumRequiredSetting = Data.PremiumRequired
            if premiumRequiredSetting == nil then premiumRequiredSetting = Data.premiumrequired end

            local PremiumRequired = configuredTrialMinutes ~= nil
            if premiumRequiredSetting ~= nil then PremiumRequired = premiumRequiredSetting == true end

            local TrialTimeMinutes = configuredTrialMinutes or (TrialApi and TrialApi.GetTrialDefaultMinutes and TrialApi.GetTrialDefaultMinutes()) or 60

            if PremiumRequired then
                if not TrialApi then return nil end
                TrialActive, _, hasClaimedTrial = TrialApi.CheckTrialStatus()
                if not TrialActive then
                    local alreadyUsed = hasClaimedTrial == true
                    local trialClaimed = TrialApi.ShowTrialModal(TrialTimeMinutes, alreadyUsed)
                    if not trialClaimed then
                        coroutine.yield(coroutine.running())
                        return nil
                    end
                    if not TrialApi.TrialManager then return nil end
                    TrialApi.TrialManager.Cached = false
                    TrialActive = TrialApi.CheckTrialStatus()
                end
            end

            local Window = {
                Name = Data.Name or Data.name or "Window",
                CloseCallback = Data.CloseCallback or Data.closecallback or function() end,
                PremiumRequired = PremiumRequired == true,
                TrialActive = TrialActive == true,
                Pages = {},
                Items = {},
                IsOpen = false,
                IsMinimized = false,
                ResizeButton = nil,
                ResizeHandle = nil
            }
            local Items = {}

            do
                Items["MainFrame"] = Instances:Create("Frame", {
                    Parent = Library.Holder.Instance,
                    Name = "\0",
                    Position = UDim2New(0, Camera.ViewportSize.X / 3 - 100, 0, Camera.ViewportSize.Y / 3 - 100),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = IsMobile and UDim2New(0, 575, 0, 345) or UDim2New(0, 730, 0, 530),
                    ClipsDescendants = true,
                    Visible = false,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Items["MainFrame"]:AddToTheme({ BackgroundColor3 = "Background" })

                Window.ResizeButton = Items["MainFrame"]:MakeResizeable(
                    Vector2New(Items["MainFrame"].Instance.Size.X.Offset - 100, Items["MainFrame"].Instance.Size.Y.Offset - 100),
                    Vector2New(9999, 9999)
                )

                Items["BackgroundImage"] = Instances:Create("ImageLabel", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 1, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    ZIndex = 1,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UICorner", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Top"] = Instances:Create("Frame", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 45),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Top"]:MakeDraggable(Items["MainFrame"])

                Instances:Create("UICorner", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Fade"] = Instances:Create("Frame", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    AnchorPoint = Vector2New(1, 0),
                    Position = UDim2New(1, 0, 0, 0),
                    ZIndex = 2,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Fade"]:AddToTheme({ BackgroundColor3 = "Background" })

                Items["Title"] = Instances:Create("TextLabel", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Window.Name,
                    Size = UDim2New(1, -115, 0, 25),
                    AnchorPoint = Vector2New(0, 0.5),
                    Position = UDim2New(0, 12, 0.5, 0),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderSizePixel = 0,
                    ZIndex = 1,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 22,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Title"]:AddToTheme({ TextColor3 = "Text" })

                Instances:Create("UIGradient", {
                    Parent = Items["Fade"].Instance,
                    Name = "\0",
                    Transparency = NumSequence{
                        NumSequenceKeypoint(0, 1),
                        NumSequenceKeypoint(0.65, 1),
                        NumSequenceKeypoint(0.75, 1),
                        NumSequenceKeypoint(0.85, 0),
                        NumSequenceKeypoint(0.9, 0),
                        NumSequenceKeypoint(1, 0)
                    }
                })

                Instances:Create("UICorner", {
                    Parent = Items["Fade"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Library:AddMarqueStyleHoverThing(Items["Title"], Items["Top"])

                Items["CloseButton"] = Instances:Create("ImageButton", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    ScaleType = Enum.ScaleType.Fit,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AutoButtonColor = false,
                    AnchorPoint = Vector2New(1, 0),
                    Image = "rbxassetid://103147620865081",
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -12, 0, 15),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["CloseButton"]:AddToTheme({ ImageColor3 = "Text" })

                Instances:Create("Frame", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    Position = UDim2New(0, 0, 1, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 1),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(36, 33, 42)
                }):AddToTheme({ BackgroundColor3 = "Border" })

                Items["MinimizeButton"] = Instances:Create("ImageButton", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AutoButtonColor = false,
                    AnchorPoint = Vector2New(1, 0),
                    Image = "rbxassetid://124077918458008",
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, not IsMobile and -75 or -76, 0, 15),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["MinimizeButton"]:AddToTheme({ ImageColor3 = "Text" })

                Items["FullScreenButton"] = Instances:Create("ImageButton", {
                    Parent = Items["Top"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AutoButtonColor = false,
                    AnchorPoint = Vector2New(1, 0),
                    Image = "rbxassetid://79119806011839",
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -44, 0, 15),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["FullScreenButton"]:AddToTheme({ ImageColor3 = "Text" })

                Items["ClosePromptOverlay"] = Instances:Create("TextButton", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, 0, 1, 0),
                    Active = true,
                    BorderSizePixel = 0,
                    AutoButtonColor = false,
                    Text = "",
                    Visible = false,
                    ZIndex = 48,
                    BackgroundColor3 = FromRGB(0, 0, 0),
                    BackgroundTransparency = 0.4
                })

                Items["ClosePrompt"] = Instances:Create("Frame", {
                    Parent = Items["ClosePromptOverlay"].Instance,
                    Name = "\0",
                    Active = true,
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    Size = UDim2New(0, 280, 0, 140),
                    BorderSizePixel = 0,
                    ZIndex = 49,
                    BackgroundColor3 = FromRGB(15, 12, 16)
                })
                Items["ClosePrompt"]:AddToTheme({ BackgroundColor3 = "Background" })

                Instances:Create("UICorner", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 8)
                })

                Items["ClosePromptStroke"] = Instances:Create("UIStroke", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    Thickness = 1,
                    Color = Library.Theme.Border,
                    ApplyStrokeMode = Enum.ApplyStrokeMode.Border
                })
                Items["ClosePromptStroke"]:AddToTheme({ Color = "Border" })

                Items["ClosePromptTitle"] = Instances:Create("TextLabel", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 14, 0, 12),
                    Size = UDim2New(1, -28, 0, 24),
                    FontFace = Library.Font,
                    Text = "Close window?",
                    TextColor3 = FromRGB(255, 255, 255),
                    TextSize = 18,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    ZIndex = 50,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["ClosePromptTitle"]:AddToTheme({ TextColor3 = "Text" })

                Items["ClosePromptMessage"] = Instances:Create("TextLabel", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 14, 0, 42),
                    Size = UDim2New(1, -28, 0, 38),
                    FontFace = Library.Subfont or Library.Font,
                    Text = "Are you sure you want to close the UI?",
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.2,
                    TextSize = 14,
                    TextWrapped = true,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextYAlignment = Enum.TextYAlignment.Top,
                    ZIndex = 50,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["ClosePromptMessage"]:AddToTheme({ TextColor3 = "Text" })

                Items["ClosePromptCancel"] = Instances:Create("TextButton", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(0, 1),
                    Position = UDim2New(0, 14, 1, -14),
                    Size = UDim2New(0.5, -21, 0, 34),
                    BorderSizePixel = 0,
                    AutoButtonColor = false,
                    FontFace = Library.Font,
                    Text = "Cancel",
                    TextColor3 = FromRGB(255, 255, 255),
                    TextSize = 14,
                    ZIndex = 50,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["ClosePromptCancel"]:AddToTheme({ BackgroundColor3 = "Element", TextColor3 = "Text" })
                Instances:Create("UICorner", {
                    Parent = Items["ClosePromptCancel"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["ClosePromptConfirm"] = Instances:Create("TextButton", {
                    Parent = Items["ClosePrompt"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(1, 1),
                    Position = UDim2New(1, -14, 1, -14),
                    Size = UDim2New(0.5, -21, 0, 34),
                    BorderSizePixel = 0,
                    AutoButtonColor = false,
                    FontFace = Library.Font,
                    Text = "Close",
                    TextColor3 = FromRGB(255, 255, 255),
                    TextSize = 14,
                    ZIndex = 50,
                    BackgroundColor3 = Library.Theme.Accent
                })
                Items["ClosePromptConfirm"]:AddToTheme({ BackgroundColor3 = "Accent", TextColor3 = "Text" })
                Instances:Create("UICorner", {
                    Parent = Items["ClosePromptConfirm"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Side"] = Instances:Create("Frame", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 0, 0, 45),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 185, 1, -45),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("Frame", {
                    Parent = Items["Side"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(1, 0),
                    Position = UDim2New(1, 0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 1, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(36, 33, 42)
                }):AddToTheme({ BackgroundColor3 = "Border" })

                Items["UserInfo"] = Instances:Create("Frame", {
                    Parent = Items["Side"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(0, 1),
                    Position = UDim2New(0, 8, 1, -8),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, -16, 0, 55),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["UserInfo"]:AddToTheme({ BackgroundColor3 = "Inline" })
                Instances:Create("UICorner", {
                    Parent = Items["UserInfo"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Avatar"] = Instances:Create("ImageLabel", {
                    Parent = Items["UserInfo"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    Image = "",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0.5, 0),
                    Size = UDim2New(0, 35, 0, 35),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Instances:Create("UICorner", { Parent = Items["Avatar"].Instance, Name = "\0", CornerRadius = UDimNew(1, 0) })
                Items["Avatar"].Instance.Image = Content

                Items["Username"] = Instances:Create("TextLabel", {
                    Parent = Items["UserInfo"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = LocalPlayer.Name,
                    Size = UDim2New(1, -64, 0, 15),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 47, 0, 10),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BackgroundColor3 = FromRGB(255, 255, 255),
                    TextTruncate = Enum.TextTruncate.AtEnd
                })
                Items["Username"]:AddToTheme({ TextColor3 = "Text" })

                Items["Game"] = Instances:Create("TextLabel", {
                    Parent = Items["UserInfo"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = ResolvePlaceName(),
                    Size = UDim2New(1, -64, 0, 15),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 47, 0, 28),
                    BorderColor3 = FromRGB(0, 0, 0),
                    TextTruncate = Enum.TextTruncate.AtEnd,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Game"]:AddToTheme({ TextColor3 = "Text" })

                ResolvePlaceName(function(Name)
                    if Items["Game"] and Items["Game"].Instance and Items["Game"].Instance.Parent then
                        Items["Game"].Instance.Text = tostring(Name or "This Experience")
                    end
                end)

                Items["Pages"] = Instances:Create("ScrollingFrame", {
                    Parent = Items["Side"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 8),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, -16, 1, -75),
                    CanvasSize = UDim2New(0, 0, 0, 0),
                    AutomaticCanvasSize = Enum.AutomaticSize.Y,
                    MidImage = "rbxassetid://136419474381965",
                    TopImage = "rbxassetid://136419474381965",
                    BottomImage = "rbxassetid://136419474381965",
                    ScrollBarImageColor3 = Library.Theme.Accent,
                    BorderSizePixel = 0,
                    ScrollBarThickness = 3,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Pages"]:AddToTheme({ ScrollBarImageColor3 = "Accent" })

                Instances:Create("UIListLayout", {
                    Parent = Items["Pages"].Instance,
                    Name = "\0",
                    Padding = UDimNew(0, 2),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Instances:Create("UIPadding", {
                    Parent = Items["Pages"].Instance,
                    Name = "\0",
                    PaddingBottom = UDimNew(0, 4)
                })

                Items["Content"] = Instances:Create("Frame", {
                    Parent = Items["MainFrame"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 185, 0, 45),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, -185, 1, -45),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                local ResizeHandle = Instances:Create("ImageLabel", {
                    Parent = Library.Holder.Instance,
                    Size = UDim2.new(0, 48 * 2, 0, 48 * 2),
                    BackgroundTransparency = 1,
                    Image = "rbxassetid://120997033468887",
                    Position = UDim2.new(1, 30, 1, 30),
                    AnchorPoint = Vector2.new(0, 0),
                    ZIndex = 9999,
                    ImageTransparency = 0.8
                })
                Window.ResizeHandle = ResizeHandle

                local function UpdateResizeHandlePosition()
                    if not Window.IsOpen or Window.IsMinimized or not Window.ResizeHandle.Instance.Visible then return end
                    local mf = Items["MainFrame"].Instance
                    ResizeHandle.Instance.Position = UDim2New(0, mf.AbsolutePosition.X + mf.AbsoluteSize.X - 60, 0, mf.AbsolutePosition.Y + mf.AbsoluteSize.Y - 60)
                end

                Library:Connect(Items["MainFrame"].Instance:GetPropertyChangedSignal("AbsoluteSize"), UpdateResizeHandlePosition)
                Library:Connect(Items["MainFrame"].Instance:GetPropertyChangedSignal("AbsolutePosition"), UpdateResizeHandlePosition)

                Window.ResizeButton:OnHover(function() ResizeHandle:Tween(nil, { ImageTransparency = 0.35 }) end)
                Window.ResizeButton:OnHoverLeave(function() ResizeHandle:Tween(nil, { ImageTransparency = 0.8 }) end)

                Window.Items = Items
            end

            local SnowFlakes = {}
            local MaxSnow = 100
            local Snowing = false
            local SpawnDelay = 0.05
            local Frame = Items["MainFrame"].Instance

            function Window:CreateFlake()
                if not Snowing or #SnowFlakes >= MaxSnow then return end
                local Flake = InstanceNew("Frame")
                local Size = MathRandom(2, 4)
                Flake.Size = UDim2FromOffset(Size, Size)
                Flake.Position = UDim2FromOffset(MathRandom(0, Frame.AbsoluteSize.X), -10)
                Flake.BackgroundColor3 = FromRGB(255, 255, 255)
                Flake.BackgroundTransparency = MathRandom(20, 40) / 100
                Flake.BorderSizePixel = 0
                Flake.ZIndex = 9999
                Flake.Parent = Frame

                local Duration = MathRandom(2, 15)
                local EndY = Frame.AbsoluteSize.Y + 10
                local Tween = TweenService:Create(Flake, TweenInfo.new(Duration, Enum.EasingStyle.Linear), { Position = UDim2FromOffset(Flake.Position.X.Offset, EndY) })

                TableInsert(SnowFlakes, Flake)
                Tween:Play()
                Tween.Completed:Once(function()
                    local Index = table.find(SnowFlakes, Flake)
                    if Index then TableRemove(SnowFlakes, Index) end
                    Flake:Destroy()
                end)
            end

            function Window:StartSnow()
                if Snowing then return end
                Snowing = true
                task.spawn(function()
                    while Snowing do
                        Window:CreateFlake()
                        task.wait(SpawnDelay)
                    end
                end)
            end

            function Window:StopSnow()
                Snowing = false
                for _, Flake in SnowFlakes do if Flake then Flake:Destroy() end end
                SnowFlakes = {}
            end

            function Window:UpdateSnowState()
                if Library.Snowing and not Window.IsMinimized then
                    Window:StartSnow()
                else
                    Window:StopSnow()
                end
            end

            Library.WindowItem = Window

            local function SetClosePromptOpen(Bool)
                Window.ClosePromptOpen = Bool
                Items["ClosePromptOverlay"].Instance.Visible = Bool and Window.IsOpen == true
            end

            local function CloseWindow()
                Window.CloseLocked = true
                SetClosePromptOpen(false)
                Library:Unload()
                for _, GuiName in {"CustomScreenGui"} do
                    local Gui = CoreGui:FindFirstChild(GuiName)
                    if Gui and Gui:IsA("ScreenGui") then Gui:Destroy() end
                end
            end

            function Window:SetOpen(Bool)
                if Debounce then return end
                if not Bool and Window.ClosePromptOpen then SetClosePromptOpen(false) end
                Window.IsOpen = Bool
                Debounce = true

                if Window.IsOpen then Items["MainFrame"].Instance.Visible = true end

                local Descendants = Items["MainFrame"].Instance:GetDescendants()
                TableInsert(Descendants, Items["MainFrame"].Instance)
                local NewTween

                for Index, Value in Descendants do
                    local TransparencyProperty = Tween:GetProperty(Value)
                    if not TransparencyProperty then continue end

                    if type(TransparencyProperty) == "table" then
                        for _, Property in TransparencyProperty do
                            NewTween = Tween:FadeItem(Value, Property, Window.IsOpen, Library.FadeSpeed)
                        end
                    else
                        NewTween = Tween:FadeItem(Value, TransparencyProperty, Window.IsOpen, Library.FadeSpeed)
                    end
                end

                if NewTween and NewTween.Tween then
                    NewTween.Tween.Completed:Once(function()
                        Debounce = false
                        Items["MainFrame"].Instance.Visible = Window.IsOpen
                    end)
                else
                    Debounce = false
                    Items["MainFrame"].Instance.Visible = Window.IsOpen
                end
            end

            function Window:SetStreamerMode(Bool)
                local Avatar = Bool and StreamerContent or Content
                local Username = Bool and StreamerName or LocalPlayer.Name
                local DisplayName = Bool and StreamerName or LocalPlayer.DisplayName
                Items["Avatar"].Instance.Image = Avatar
                Items["Username"].Instance.Text = Username
                if Items["AccountAvatar"] then Items["AccountAvatar"].Instance.Image = Avatar end
                if Items["AccountDisplayName"] then Items["AccountDisplayName"].Instance.Text = DisplayName end
                if Items["AccountUsername"] then Items["AccountUsername"].Instance.Text = "@" .. Username end
            end

            function Window:SetBackgroundImage(Image)
                Items["BackgroundImage"].Instance.Image = Image
            end

            Library:Connect(UserInputService.InputBegan, function(Input)
                if tostring(Input.KeyCode) == Library.MenuKeybind or tostring(Input.UserInputType) == Library.MenuKeybind then
                    if UserInputService:GetFocusedTextBox() then return end
                    if Window.CloseLocked and not Window.IsOpen then return end
                    Window:SetOpen(not Window.IsOpen)
                    if Window.IsOpen then
                        Window.ResizeHandle.Instance.Visible = true
                        for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                    else
                        Window.ResizeHandle.Instance.Visible = false
                        for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                    end
                end
            end)

            local function BindClosePromptButtonAnimation(Button, BaseSize, HoverSize, PressSize, BaseTransparency, HoverTransparency)
                Button:Connect("MouseEnter", function()
                    Button:Tween(nil, { Size = HoverSize, TextTransparency = HoverTransparency })
                end)
                Button:Connect("MouseLeave", function()
                    Button:Tween(nil, { Size = BaseSize, TextTransparency = BaseTransparency })
                end)
                Button:Connect("InputBegan", function(Input)
                    if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                        Button:Tween(TweenInfo.new(0.12, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Size = PressSize })
                    end
                end)
                Button:Connect("InputEnded", function(Input)
                    if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                        Button:Tween(nil, {
                            Size = Library:IsMouseOverFrame(Button) and HoverSize or BaseSize,
                            TextTransparency = Library:IsMouseOverFrame(Button) and HoverTransparency or BaseTransparency
                        })
                    end
                end)
            end

            Items["CloseButton"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    SetClosePromptOpen(true)
                end
            end)

            Items["ClosePromptCancel"]:Connect("MouseButton1Click", function() SetClosePromptOpen(false) end)
            Items["ClosePromptConfirm"]:Connect("MouseButton1Click", function() CloseWindow() end)

            BindClosePromptButtonAnimation(Items["ClosePromptCancel"], UDim2New(0.5, -21, 0, 34), UDim2New(0.5, -18, 0, 36), UDim2New(0.5, -16, 0, 32), 0, 0.08)
            BindClosePromptButtonAnimation(Items["ClosePromptConfirm"], UDim2New(0.5, -21, 0, 34), UDim2New(0.5, -18, 0, 36), UDim2New(0.5, -16, 0, 32), 0, 0.05)

            if not IsMobile then
                Items["CloseButton"]:Connect("MouseEnter", function()
                    Items["CloseButton"]:ChangeItemTheme({ ImageColor3 = "Accent" })
                    Items["CloseButton"]:Tween(nil, { ImageColor3 = Library.Theme.Accent })
                end)
                Items["CloseButton"]:Connect("MouseLeave", function()
                    Items["CloseButton"]:ChangeItemTheme({ ImageColor3 = "Text" })
                    Items["CloseButton"]:Tween(nil, { ImageColor3 = Library.Theme.Text })
                end)
            end

            Items["MinimizeButton"]:Connect("MouseEnter", function()
                Items["MinimizeButton"]:ChangeItemTheme({ ImageColor3 = "Accent" })
                Items["MinimizeButton"]:Tween(nil, { ImageColor3 = Library.Theme.Accent })
            end)
            Items["MinimizeButton"]:Connect("MouseLeave", function()
                Items["MinimizeButton"]:ChangeItemTheme({ ImageColor3 = "Text" })
                Items["MinimizeButton"]:Tween(nil, { ImageColor3 = Library.Theme.Text })
            end)

            Items["FullScreenButton"]:Connect("MouseEnter", function()
                Items["FullScreenButton"]:ChangeItemTheme({ ImageColor3 = "Accent" })
                Items["FullScreenButton"]:Tween(nil, { ImageColor3 = Library.Theme.Accent })
            end)
            Items["FullScreenButton"]:Connect("MouseLeave", function()
                Items["FullScreenButton"]:ChangeItemTheme({ ImageColor3 = "Text" })
                Items["FullScreenButton"]:Tween(nil, { ImageColor3 = Library.Theme.Text })
            end)

            local OldSize = Items["MainFrame"].Instance.AbsoluteSize

            function Window:Minimize(Bool)
                Window.IsMinimized = Bool
                Window:UpdateSnowState()

                if Window.IsMinimized then
                    OldSize = Items["MainFrame"].Instance.AbsoluteSize
                    Items["MainFrame"]:Tween(nil, { Size = UDim2New(0, Items["Title"].Instance.TextBounds.X + 125, 0, 45) })
                    Window.ResizeButton:Tween(nil, { ImageTransparency = 1 })
                    Window.ResizeButton.Instance.Interactable = false
                    Window.ResizeHandle.Instance.Visible = false
                    Items["UserInfo"].Instance.Visible = false
                    Items["Content"].Instance.Visible = false
                    for Index, Value in Window.Pages do Value:SetVisibility(false) end
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                else
                    Items["MainFrame"]:Tween(nil, { Size = UDim2New(0, OldSize.X, 0, OldSize.Y) })
                    Window.ResizeButton:Tween(nil, { ImageTransparency = 0 })
                    Window.ResizeButton.Instance.Interactable = true
                    Window.ResizeHandle.Instance.Visible = true
                    Items["UserInfo"].Instance.Visible = true
                    Items["Content"].Instance.Visible = true
                    for Index, Value in Window.Pages do Value:SetVisibility(true) end
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                end
            end

            Items["MinimizeButton"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    Window:Minimize(not Window.IsMinimized)
                end
            end)

            local IsFullScreen = false
            Items["FullScreenButton"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    if Window.IsMinimized then Window:Minimize(false) end
                    IsFullScreen = not IsFullScreen
                    if IsFullScreen then
                        Items["MainFrame"]:Tween(nil, { Size = UDim2New(1, 0, 1, 0) })
                        Items["MainFrame"]:Tween(nil, { Position = UDim2New(0, 0, 0, 0) })
                    else
                        Items["MainFrame"]:Tween(nil, { Size = UDim2New(0, OldSize.X, 0, OldSize.Y) })
                        Items["MainFrame"]:Tween(nil, { Position = UDim2New(0, Camera.ViewportSize.X / 3 - 100, 0, Camera.ViewportSize.Y / 3 - 100) })
                    end
                end
            end)

            Window:SetOpen(true)
            task.defer(function() Library:AttachExpressButton(Window) end)

            local result = setmetatable(Window, self)

            if Data.HomeTab ~= false then
                Library:CreateHomeTab(result, Data.DiscordLink or "discord.gg/expresshub")
            end

            if not IsMobile and Library.GlobalChat and Library.GlobalChat.AutoConnect and not Library._GlobalChatConnected then
                Library._GlobalChatConnected = true
                task.defer(function()
                    local Success = pcall(function() Library:ConnectGlobalChat() end)
                    if not Success then Library._GlobalChatConnected = false end
                end)
            end

            return result
        end

        Library.MakeTab = function(self, Data)
            Data = Data or {}
            local Page = {
                Window = self,
                Name = Data.Name or Data.name or "Page",
                Icon = Data.Icon or Data.icon or nil,
                Active = false,
                SubPages = {},
                Items = {}
            }
            Library.SearchItems[Page] = {}
            local Items = {}

            do
                Items["Inactive"] = Instances:Create("TextButton", {
                    Parent = Page.Window.Items["Pages"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 35),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Inactive"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.5,
                    Text = Page.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, Page.Icon and 30 or 8, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 18,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                if Page.Icon then
                    Items["Icon"] = Instances:Create("ImageLabel", {
                        Parent = Items["Inactive"].Instance,
                        Name = "\0",
                        ImageTransparency = 0.4000000059604645,
                        BorderColor3 = FromRGB(0, 0, 0),
                        AnchorPoint = Vector2New(0, 0.5),
                        Image = Page.Icon,
                        BackgroundTransparency = 1,
                        Position = UDim2New(0, 3, 0.5, 0),
                        Size = UDim2New(0, 16, 0, 16),
                        BorderSizePixel = 0,
                        BackgroundColor3 = FromRGB(255, 255, 255)
                    })
                    Items["Icon"]:AddToTheme({ ImageColor3 = "Text" })
                end

                Items["Page"] = Instances:Create("Frame", {
                    Parent = Library.UnusedHolder.Instance,
                    Name = "\0",
                    ClipsDescendants = true,
                    Visible = false,
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["SubPages"] = Instances:Create("Frame", {
                    Parent = Items["Page"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 8),
                    Size = UDim2New(0, 0, 0, 38),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SubPages"].Instance,
                    Name = "\0",
                    Padding = UDimNew(0, 2),
                    FillDirection = Enum.FillDirection.Horizontal,
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Items["Columns"] = Instances:Create("Frame", {
                    Parent = Items["Page"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 56),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, -14, 1, -64),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Inactive"]:OnHover(function()
                    if Page.Active then return end
                    Items["Text"]:Tween(nil, { TextTransparency = 0.2 })
                end)

                Items["Inactive"]:OnHoverLeave(function()
                    if Page.Active then return end
                    Items["Text"]:Tween(nil, { TextTransparency = 0.5 })
                end)

                Page.Items = Items
            end

            local Debounce = false

            function Page:Turn(Bool)
                if Debounce then return end
                Page.Active = Bool
                Debounce = true
                Items["Page"].Instance.Visible = Bool
                Items["Page"].Instance.Parent = not Bool and Library.UnusedHolder.Instance or Page.Window.Items["Content"].Instance

                if Page.Active then
                    Items["Text"]:Tween(nil, { TextTransparency = 0 })
                    if Page.Icon then
                        Items["Icon"]:ChangeItemTheme({ ImageColor3 = "Accent" })
                        Items["Icon"]:Tween(nil, { ImageColor3 = Library.Theme.Accent, ImageTransparency = 0 })
                    end
                    Items["Columns"]:Tween(TweenInfo.new(0.6, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0, 8, 0, 56) })
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                else
                    Items["Text"]:Tween(nil, { TextTransparency = 0.4 })
                    if Page.Icon then
                        Items["Icon"]:ChangeItemTheme({ ImageColor3 = "Text" })
                        Items["Icon"]:Tween(nil, { ImageColor3 = Library.Theme.Text, ImageTransparency = 0.4 })
                    end
                    Items["Columns"]:Tween(TweenInfo.new(0.6, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0, 50, 0, 56) })
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                end
                Debounce = false
            end

            function Page:SetVisibility(Bool)
                Items["Inactive"].Instance.Visible = Bool
            end

            Items["Inactive"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    for Index, Value in Page.Window.Pages do Value:Turn(Value == Page) end
                end
            end)

            if #Page.Window.Pages == 0 then Page:Turn(true) end
            TableInsert(Page.Window.Pages, Page)
            return setmetatable(Page, Library.Pages)
        end

        Library.MakeTabSection = function(self, Name)
            local Items = {}
            do
                Items["PageSection"] = Instances:Create("TextLabel", {
                    Parent = self.Items["Pages"].Instance,
                    Name = "\0",
                    FontFace = Library.Subfont,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Name,
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["PageSection"]:AddToTheme({ TextColor3 = "Text" })
                Instances:Create("UIPadding", {
                    Parent = Items["PageSection"].Instance,
                    Name = "\0",
                    PaddingLeft = UDimNew(0, 5)
                })
            end
        end

        Library.Pages.AddSubTab = function(self, Data)
            Data = Data or {}
            local Page = {
                Window = self.Window,
                Page = self,
                Name = Data.Name or Data.name or "Page",
                Columns = Data.Columns or Data.columns or 2,
                Active = false,
                Items = {},
                ColumnsData = {},
                Sections = {},
                SearchQuery = ""
            }
            Library.SearchItems[Page] = {}
            local Items = {}

            do
                Items["Inactive"] = Instances:Create("TextButton", {
                    Parent = Page.Page.Items["SubPages"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    Size = UDim2New(0, 0, 0, 38),
                    BackgroundTransparency = 1,
                    ClipsDescendants = true,
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["Inactive"]:AddToTheme({ BackgroundColor3 = "Inline" })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Inactive"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Page.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Instances:Create("UIPadding", {
                    Parent = Items["Inactive"].Instance,
                    Name = "\0",
                    PaddingRight = UDimNew(0, 8)
                })

                Instances:Create("UICorner", {
                    Parent = Items["Inactive"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Liner"] = Instances:Create("Frame", {
                    Parent = Items["Inactive"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0.5, 1),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0.5, 2, 1, 6),
                    Size = UDim2New(0, 0, 0, 8),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(246, 178, 255)
                })
                Items["Liner"]:AddToTheme({ BackgroundColor3 = "Accent" })
                Instances:Create("UICorner", {
                    Parent = Items["Liner"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(1, 0)
                })

                Items["Page"] = Instances:Create("Frame", {
                    Parent = Library.UnusedHolder.Instance,
                    Name = "\0",
                    Visible = false,
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["Page"].Instance,
                    Name = "\0",
                    FillDirection = Enum.FillDirection.Vertical,
                    HorizontalAlignment = Enum.HorizontalAlignment.Center,
                    Padding = UDimNew(0, 8),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Items["Searchbar"] = Instances:Create("Frame", {
                    Parent = Items["Page"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, -10, 0, IsMobile and 32 or 36),
                    BorderColor3 = FromRGB(0, 0, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Items["Searchbar"]:AddToTheme({ BackgroundColor3 = "Background" })

                Instances:Create("UIStroke", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    Color = FromRGB(36, 33, 42),
                    ApplyStrokeMode = Enum.ApplyStrokeMode.Border
                }):AddToTheme({ Color = "Border" })

                Instances:Create("UICorner", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["SearchIcon"] = Instances:Create("ImageLabel", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    ImageTransparency = 0.4000000059604645,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AnchorPoint = Vector2New(0, 0.5),
                    Image = "rbxassetid://106690619909970",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0.5, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["SearchIcon"]:AddToTheme({ ImageColor3 = "Text" })

                Items["Input"] = Instances:Create("TextBox", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    AnchorPoint = Vector2New(0, 0.5),
                    PlaceholderColor3 = FromRGB(185, 185, 185),
                    PlaceholderText = "Search sections and items...",
                    TextSize = 14,
                    Size = UDim2New(1, -46, 0, 15),
                    ClipsDescendants = true,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    CursorPosition = -1,
                    Position = UDim2New(0, 38, 0.5, 0),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextColor3 = FromRGB(255, 255, 255),
                    ClearTextOnFocus = false,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Input"]:AddToTheme({ TextColor3 = "Text" })

                Items["Columns"] = Instances:Create("Frame", {
                    Parent = Items["Page"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 1, -(IsMobile and 40 or 44)),
                    BorderColor3 = FromRGB(0, 0, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["Columns"].Instance,
                    Name = "\0",
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalFlex = Enum.UIFlexAlignment.Fill,
                    Padding = UDimNew(0, 4),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                for Index = 1, Page.Columns do
                    local NewColumn = Instances:Create("ScrollingFrame", {
                        Parent = Items["Columns"].Instance,
                        Name = "\0",
                        ScrollBarImageColor3 = FromRGB(0, 0, 0),
                        Active = true,
                        AutomaticCanvasSize = Enum.AutomaticSize.Y,
                        ScrollBarThickness = 0,
                        BackgroundTransparency = 1,
                        Size = UDim2New(1, 0, 1, 0),
                        BackgroundColor3 = FromRGB(255, 255, 255),
                        BorderColor3 = FromRGB(0, 0, 0),
                        BorderSizePixel = 0,
                        CanvasSize = UDim2New(0, 0, 0, 0)
                    })

                    Instances:Create("UIPadding", {
                        Parent = NewColumn.Instance,
                        Name = "\0",
                        PaddingTop = UDimNew(0, 5),
                        PaddingBottom = UDimNew(0, 5),
                        PaddingRight = UDimNew(0, 5),
                        PaddingLeft = UDimNew(0, 5)
                    })

                    Instances:Create("UIListLayout", {
                        Parent = NewColumn.Instance,
                        Name = "\0",
                        Padding = UDimNew(0, 15),
                        SortOrder = Enum.SortOrder.LayoutOrder
                    })

                    Page.ColumnsData[Index] = NewColumn
                end

                Items["Inactive"]:OnHover(function()
                    if Page.Active then return end
                    Items["Inactive"]:Tween(nil, { BackgroundTransparency = 0.3 })
                end)

                Items["Inactive"]:OnHoverLeave(function()
                    if Page.Active then return end
                    Items["Inactive"]:Tween(nil, { BackgroundTransparency = 1 })
                end)

                Page.Items = Items
            end

            local function ApplySearchFilter()
                Library:ApplyPageSearch(Page, Items["Input"].Instance.Text)
            end

            local Debounce = false

            function Page:Turn(Bool)
                if Debounce then return end
                Page.Active = Bool
                Items["Page"].Instance.Visible = Bool
                Items["Page"].Instance.Parent = not Bool and Library.UnusedHolder.Instance or Page.Page.Items["Columns"].Instance
                Debounce = true

                if Bool then
                    Items["Text"]:Tween(nil, { TextTransparency = 0 })
                    Items["Inactive"]:Tween(nil, { BackgroundTransparency = 0 })
                    Items["Liner"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { BackgroundTransparency = 0, Size = UDim2New(1, -25, 0, 8) })
                    Items["Page"]:Tween(TweenInfo.new(0.6, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0, 0, 0, 0) })
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                else
                    Items["Text"]:Tween(nil, { TextTransparency = 0.4 })
                    Items["Inactive"]:Tween(nil, { BackgroundTransparency = 1 })
                    Items["Liner"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { BackgroundTransparency = 1, Size = UDim2New(0, 0, 0, 8) })
                    Items["Page"]:Tween(TweenInfo.new(0.6, Enum.EasingStyle.Quint, Enum.EasingDirection.Out), { Position = UDim2New(0, 0, 0, 35) })
                    for Index, Value in Library.OpenFrames do Value:SetOpen(false) end
                end
                Debounce = false
            end

            Items["Input"].Instance:GetPropertyChangedSignal("Text"):Connect(function() ApplySearchFilter() end)

            Items["Inactive"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    for Index, Value in Page.Page.SubPages do Value:Turn(Value == Page) end
                end
            end)

            if #Page.Page.SubPages == 0 then Page:Turn(true) end
            ApplySearchFilter()
            TableInsert(Page.Page.SubPages, Page)
            return setmetatable(Page, Library.Pages)
        end

        Library.Pages.Playerlist = function(self, Data)
            local Playerlist = {
                Window = self.Window,
                Page = self,
                Player = nil,
                Players = {},
                Settings = { Items = {} }
            }
            Playerlist.Page.Items["Searchbar"].Instance.Visible = false
            Playerlist.Page.Items["Columns"].Instance.Size = UDim2New(1, 0, 1, 0)

            if Playerlist.Page.Columns ~= 1 then
                error("Playerlist can only be in one column (Edit Columns property to 1)")
            end

            local Items = {}

            do
                Items["Playerlist"] = Instances:Create("Frame", {
                    Parent = Playerlist.Page.ColumnsData[1].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["Playerlist"]:AddToTheme({ BackgroundColor3 = "Inline" })

                Instances:Create("UICorner", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["PlayersBackground"] = Instances:Create("Frame", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    Position = UDim2New(0, 8, 0, 8),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, -16, 1, -90),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Items["PlayersBackground"]:AddToTheme({ BackgroundColor3 = "Background" })
                Instances:Create("UICorner", { Parent = Items["PlayersBackground"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["Holder"] = Instances:Create("ScrollingFrame", {
                    Parent = Items["PlayersBackground"].Instance,
                    Name = "\0",
                    Active = true,
                    AutomaticCanvasSize = Enum.AutomaticSize.Y,
                    BorderSizePixel = 0,
                    CanvasSize = UDim2New(0, 0, 0, 0),
                    ScrollBarImageColor3 = FromRGB(246, 178, 255),
                    MidImage = "rbxassetid://131420561571624",
                    BorderColor3 = FromRGB(0, 0, 0),
                    ScrollBarThickness = 2,
                    Size = UDim2New(1, -6, 1, IsMobile and -59 or -69),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 0, 0, IsMobile and 53 or 63),
                    BottomImage = "rbxassetid://131420561571624",
                    TopImage = "rbxassetid://131420561571624",
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Holder"]:AddToTheme({ ScrollBarImageColor3 = "Accent" })

                local _1 = Instances:Create("UIListLayout", { Parent = Items["Holder"].Instance, Name = "\0", Padding = UDimNew(0, 8) })
                _1.Instance.SortOrder = Enum.SortOrder.LayoutOrder

                Instances:Create("UIPadding", {
                    Parent = Items["Holder"].Instance,
                    Name = "\0",
                    PaddingTop = UDimNew(0, 2),
                    PaddingBottom = UDimNew(0, 8),
                    PaddingRight = UDimNew(0, 10),
                    PaddingLeft = UDimNew(0, 8)
                })

                Items["Avatar"] = Instances:Create("ImageLabel", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0, 1),
                    Image = "rbxassetid://98200387761744",
                    Position = UDim2New(0, 8, 1, -12),
                    Size = UDim2New(0, 60, 0, 60),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Instances:Create("UICorner", { Parent = Items["Avatar"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["PlayerUsername"] = Instances:Create("TextLabel", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 0, 0, 12),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 75, 1, -58),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["PlayerUsername"]:AddToTheme({ TextColor3 = "Text" })

                Items["PlayerUserID"] = Instances:Create("TextLabel", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "???",
                    AnchorPoint = Vector2New(0, 1),
                    Size = UDim2New(0, 0, 0, 12),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["PlayerUserID"]:AddToTheme({ TextColor3 = "Text" })

                Items["PlayerDistance"] = Instances:Create("TextLabel", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "0 studs",
                    AnchorPoint = Vector2New(0, 1),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 75, 1, -18),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["PlayerDistance"]:AddToTheme({ TextColor3 = "Text" })

                Items["Searchbar"] = Instances:Create("Frame", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, -16, 0, IsMobile and 20 or 30),
                    Position = UDim2New(0, 8, 0, 8),
                    BorderColor3 = FromRGB(0, 0, 0),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Items["Searchbar"]:AddToTheme({ BackgroundColor3 = "Background" })
                Instances:Create("UIStroke", { Parent = Items["Searchbar"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })
                Instances:Create("UICorner", { Parent = Items["Searchbar"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["SearchIcon"] = Instances:Create("ImageLabel", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    ImageTransparency = 0.4000000059604645,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AnchorPoint = Vector2New(0, 0.5),
                    Image = "rbxassetid://106690619909970",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0.5, 0),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["SearchIcon"]:AddToTheme({ ImageColor3 = "Text" })

                Items["Input"] = Instances:Create("TextBox", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    AnchorPoint = Vector2New(0, 0.5),
                    PlaceholderColor3 = FromRGB(185, 185, 185),
                    ZIndex = 2,
                    TextSize = 14,
                    Size = UDim2New(1, -46, 0, 15),
                    ClipsDescendants = true,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    CursorPosition = -1,
                    Position = UDim2New(0, 38, 0.5, 0),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextColor3 = FromRGB(255, 255, 255),
                    ClearTextOnFocus = false,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Input"]:AddToTheme({ TextColor3 = "Text" })

                Items["Columns"] = Instances:Create("Frame", {
                    Parent = Items["PlayersBackground"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, -16, 0, 14),
                    Position = UDim2New(0, 8, 0, IsMobile and 35 or 45),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["UsernameHeader"] = Instances:Create("TextLabel", {
                    Parent = Items["Columns"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4,
                    Text = "Username",
                    Size = UDim2New(0.3499999940395355, 0, 1, 0),
                    Position = UDim2New(0, 8, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    TextSize = 13,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["UsernameHeader"]:AddToTheme({ TextColor3 = "Text" })

                Items["TeamHeader"] = Instances:Create("TextLabel", {
                    Parent = Items["Columns"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4,
                    Text = "Team",
                    Size = UDim2New(0.3499999940395355, 0, 1, 0),
                    Position = UDim2New(0.3499999940395355, 4, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    TextSize = 13,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["TeamHeader"]:AddToTheme({ TextColor3 = "Text" })

                Items["HealthHeader"] = Instances:Create("TextLabel", {
                    Parent = Items["Columns"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4,
                    Text = "Health",
                    Size = UDim2New(0.3499999940395355, 0, 1, 0),
                    Position = UDim2New(0.699999988079071, 4, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    TextSize = 13,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["HealthHeader"]:AddToTheme({ TextColor3 = "Text" })

                Items["SettingsWindow"] = Instances:Create("Frame", {
                    Parent = Library.UnusedHolder.Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 200, 0, 400),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["SettingsWindow"]:AddToTheme({ BackgroundColor3 = "Background" })
                Instances:Create("UICorner", { Parent = Items["SettingsWindow"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["SettingsScrollFrame"] = Instances:Create("ScrollingFrame", {
                    Parent = Items["SettingsWindow"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, 0, 1, 0),
                    BackgroundTransparency = 1,
                    MidImage = "rbxassetid://105444659140695",
                    TopImage = "rbxassetid://105444659140695",
                    BottomImage = "rbxassetid://105444659140695",
                    BorderSizePixel = 0,
                    AutomaticCanvasSize = Enum.AutomaticSize.Y,
                    CanvasSize = UDim2New(0, 0, 0, 0),
                    ScrollBarImageColor3 = FromRGB(255, 0, 255),
                    ScrollBarThickness = 2,
                    ScrollingDirection = Enum.ScrollingDirection.Y
                })

                Instances:Create("UIPadding", {
                    Parent = Items["SettingsScrollFrame"].Instance,
                    Name = "\0",
                    PaddingTop = UDimNew(0, 6),
                    PaddingBottom = UDimNew(0, 6),
                    PaddingRight = UDimNew(0, 6),
                    PaddingLeft = UDimNew(0, 6)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SettingsScrollFrame"].Instance,
                    Name = "\0",
                    Padding = UDimNew(0, 4),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Playerlist.Items = { Content = Items["SettingsScrollFrame"] }
                setmetatable(Playerlist, Library.Sections)
            end

            local Toggle = { Value = false, Callback = function() end }

            do
                Items["Toggle"] = Instances:Create("TextButton", {
                    Parent = Items["Playerlist"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Size = UDim2New(0, 100, 0, 18),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    AnchorPoint = Vector2New(1, 0.96),
                    Position = UDim2New(1, -15, 0.96, -15),
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Indicator"] = Instances:Create("Frame", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(1, 0.5),
                    Position = UDim2New(1, 0, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 18, 0, 18),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["Indicator"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["Indicator"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })
                Instances:Create("UIStroke", { Parent = Items["Indicator"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })

                Instances:Create("UIGradient", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Check"] = Instances:Create("ImageLabel", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    ImageColor3 = FromRGB(0, 0, 0),
                    ScaleType = Enum.ScaleType.Fit,
                    ImageTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Image = "rbxassetid://116048588333795",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    Size = UDim2New(0, 0, 0, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = "Player Tools",
                    Size = UDim2New(0, 0, 0, 15),
                    AnchorPoint = Vector2New(1, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -30, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ BackgroundColor3 = "Text" })

                Items["Toggle"]:OnHover(function()
                    if Toggle.Value then return end
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] })
                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Hovered Element" })
                end)

                Items["Toggle"]:OnHoverLeave(function()
                    if Toggle.Value then return end
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme["Element"] })
                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                end)
            end

            function Toggle:Set(Bool)
                self.Value = Bool
                if self.Value then
                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Accent" })
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Accent })
                    Items["Text"]:Tween(nil, { TextTransparency = 0 })
                    Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 0, Size = UDim2New(0, 8, 0, 8) })
                else
                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Element })
                    Items["Text"]:Tween(nil, { TextTransparency = 0.4 })
                    Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 1, Size = UDim2New(0, 0, 0, 0) })
                end
                if self.Callback then Library:SafeCall(self.Callback, self.Value) end
            end

            Items["Toggle"]:Connect("MouseButton1Click", function() Toggle:Set(not Toggle.Value) end)

            local IsSettingsOpen = false
            Toggle.Callback = function(Value)
                IsSettingsOpen = Value
                if IsSettingsOpen then
                    Items["SettingsWindow"].Instance.Visible = true
                    Items["SettingsWindow"].Instance.Parent = Library.Holder.Instance

                    local function UpdateSettingsLayout()
                        local MainFrame = Playerlist.Window.Items["MainFrame"].Instance
                        Items["SettingsWindow"].Instance.Position = UDim2New(0, MainFrame.AbsolutePosition.X + MainFrame.AbsoluteSize.X + 15, 0, MainFrame.AbsolutePosition.Y)
                        Items["SettingsWindow"].Instance.Size = UDim2New(0, 200, 0, math.min(400, MainFrame.AbsoluteSize.Y * 0.5))
                    end

                    UpdateSettingsLayout()
                    local _mfInst = Playerlist.Window.Items["MainFrame"].Instance
                    local _sA = _mfInst:GetPropertyChangedSignal("AbsoluteSize"):Connect(UpdateSettingsLayout)
                    local _sB = _mfInst:GetPropertyChangedSignal("AbsolutePosition"):Connect(UpdateSettingsLayout)
                    RenderStepped2 = { Disconnect = function() _sA:Disconnect() _sB:Disconnect() end }
                else
                    if RenderStepped2 then RenderStepped2:Disconnect() RenderStepped2 = nil end
                    Items["SettingsWindow"].Instance.Visible = false
                    Items["SettingsWindow"].Instance.Parent = Library.UnusedHolder.Instance
                end
            end

            function Playerlist:Remove(Name)
                if Playerlist.Players[Name] then Playerlist.Players[Name].PlayerButton:Clean() end
                Playerlist.Players[Name] = nil
            end

            local function FormatPlayerHealth(Health)
                Health = tonumber(Health) or 0
                local function FormatCompact(Value, Divisor, Suffix)
                    return StringGSub(StringFormat("%.1f%s", Value / Divisor, Suffix), "%.0([KMB])$", "%1")
                end
                local AbsoluteHealth = MathAbs(Health)
                if AbsoluteHealth >= 1000000000 then
                    return FormatCompact(Health, 1000000000, "B")
                elseif AbsoluteHealth >= 1000000 then
                    return FormatCompact(Health, 1000000, "M")
                elseif AbsoluteHealth >= 1000 then
                    return FormatCompact(Health, 1000, "K")
                end
                return tostring(MathFloor(Health + 0.5))
            end

            local function UpdatePlayerHealth(PlayerData)
                local Character = PlayerData.Player.Character
                local Humanoid = Character and Character:FindFirstChildOfClass("Humanoid")
                PlayerData.PlayerStatus.Instance.Text = FormatPlayerHealth(Humanoid and Humanoid.Health or 0)
            end

            local function GetCharacterPosition(Character)
                if not Character then return nil end
                local Root = Character:FindFirstChild("HumanoidRootPart")
                if Root then return Root.Position end
                return Character:GetPivot().Position
            end

            function Playerlist:Add(Player)
                local PlayerItems = {}

                PlayerItems["NewPlayer"] = Instances:Create("TextButton", {
                    Parent = Items["Holder"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 25),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(22, 25, 24)
                })
                PlayerItems["NewPlayer"]:AddToTheme({ BackgroundColor3 = "Inline" })
                Instances:Create("UICorner", { Parent = PlayerItems["NewPlayer"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                PlayerItems["Name"] = Instances:Create("TextLabel", {
                    Parent = PlayerItems["NewPlayer"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0,
                    Text = Player.Name,
                    Size = UDim2New(0.3499999940395355, 0, 0, 15),
                    Position = UDim2New(0, 8, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                PlayerItems["Status"] = Instances:Create("TextLabel", {
                    Parent = PlayerItems["NewPlayer"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0,
                    Text = "0",
                    Size = UDim2New(0.3499999940395355, 0, 0, 15),
                    Position = UDim2New(0.699999988079071, 8, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                local Team = Player.Team ~= nil and Player.Team.Name or "None"
                local TeamColor = Player.TeamColor ~= nil and Player.TeamColor.Color or Color3.new(1, 1, 1)

                PlayerItems["Team"] = Instances:Create("TextLabel", {
                    Parent = PlayerItems["NewPlayer"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = TeamColor,
                    TextTransparency = 0,
                    Text = Team,
                    Size = UDim2New(0.3499999940395355, 0, 0, 15),
                    Position = UDim2New(0.3499999940395355, 8, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                local PlayerData = {
                    Name = Player.Name,
                    Selected = false,
                    PlayerButton = PlayerItems["NewPlayer"],
                    PlayerName = PlayerItems["Name"],
                    PlayerTeam = PlayerItems["Team"],
                    PlayerStatus = PlayerItems["Status"],
                    Player = Player
                }

                UpdatePlayerHealth(PlayerData)

                function PlayerData:Toggle(Status)
                    if Status == "Active" then
                        PlayerItems["NewPlayer"]:Tween(nil, { BackgroundTransparency = 0 })
                    else
                        PlayerItems["NewPlayer"]:Tween(nil, { BackgroundTransparency = 1 })
                    end
                end

                function PlayerData:Set()
                    PlayerData.Selected = not PlayerData.Selected
                    if PlayerData.Selected then
                        Playerlist.Player = PlayerData.Player
                        for Index, Value in Playerlist.Players do
                            Value.Selected = false
                            Value:Toggle("Inactive")
                        end
                        PlayerData:Toggle("Active")
                        local PlayerAvatar = Players:GetUserThumbnailAsync(Playerlist.Player.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size420x420)
                        Items["Avatar"].Instance.Image = PlayerAvatar
                        Items["PlayerUsername"].Instance.Text = Playerlist.Player.DisplayName .. " (@" .. Playerlist.Player.Name .. ")"
                        Items["PlayerUserID"].Instance.Text = "User ID: " .. tostring(Playerlist.Player.UserId)
                    else
                        Playerlist.Player = nil
                        PlayerData:Toggle("Inactive")
                        Items["Avatar"].Instance.Image = "rbxassetid://98200387761744"
                        Items["PlayerUsername"].Instance.Text = "???"
                        Items["PlayerUserID"].Instance.Text = "???"
                    end
                    if Data.Callback then
                        Library:SafeCall(Data.Callback, Playerlist.Player, PlayerData.PlayerStatus.Instance.Text, PlayerData.PlayerTeam.Instance.Text)
                    end
                end

                PlayerItems["NewPlayer"]:Connect("InputBegan", function(Input)
                    if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                        PlayerData:Set()
                    end
                end)

                Playerlist.Players[Player.Name] = PlayerData
                return PlayerData
            end

            local SearchStepped
            Items["Input"]:Connect("Focused", function()
                local function FilterPlayers()
                    local query = StringLower(Items["Input"].Instance.Text)
                    for Index, Value in Playerlist.Players do
                        Value.PlayerButton.Instance.Visible = query == "" or StringFind(StringLower(Value.PlayerName.Instance.Text), query, 1, true) ~= nil
                    end
                end
                FilterPlayers()
                SearchStepped = Items["Input"].Instance:GetPropertyChangedSignal("Text"):Connect(FilterPlayers)
            end)

            Items["Input"]:Connect("FocusLost", function()
                if SearchStepped then
                    SearchStepped:Disconnect()
                    SearchStepped = nil
                end
            end)

            local LastDistanceUpdate = 0
            local LastDistanceText = ""

            Library:Thread(function()
                for Index, Value in Players:GetPlayers() do Playerlist:Add(Value) end

                Library:Connect(Players.PlayerRemoving, function(Player)
                    if Playerlist.Players[Player.Name] then Playerlist:Remove(Player.Name) end
                end)

                Library:Connect(Players.PlayerAdded, function(Player) Playerlist:Add(Player) end)

                Library:Connect(RunService.Heartbeat, function()
                    local Now = OsClock()
                    if Now - LastDistanceUpdate < 0.2 then return end
                    LastDistanceUpdate = Now
                    if not Playerlist.Page.Active then return end

                    for _, Value in Playerlist.Players do UpdatePlayerHealth(Value) end

                    if Playerlist.Player and Playerlist.Player ~= LocalPlayer then
                        local localChar = LocalPlayer.Character
                        local targetChar = Playerlist.Player.Character
                        if localChar and targetChar then
                            local localPosition = GetCharacterPosition(localChar)
                            local targetPosition = GetCharacterPosition(targetChar)
                            if localPosition and targetPosition then
                                local NewDistanceText = "Distance: " .. MathFloor((localPosition - targetPosition).Magnitude) .. " studs"
                                if LastDistanceText ~= NewDistanceText then
                                    LastDistanceText = NewDistanceText
                                    Items["PlayerDistance"].Instance.Text = NewDistanceText
                                end
                            end
                        end
                    end
                end)
            end)

            for Index, Value in Playerlist.Players do
                if Index == LocalPlayer.Name then Value:Set() end
            end

            return Playerlist
        end

        Library.Pages.AddSection = function(self, Data)
            local Section = {
                Window = self.Window,
                Page = self,
                Name = Data.Name or Data.name or "Section",
                Description = Data.Description or Data.Description or "",
                Side = Data.Side or Data.side or 1,
                Premium = Data.Premium or Data.premium or false,
                IsOpen = false,
                Items = {}
            }

            if not Section.Page.ColumnsData then
                Section.Page.ColumnsData = {}
                local ColumnsParent = Section.Page.Items["Columns"] and Section.Page.Items["Columns"].Instance
                if ColumnsParent then
                    Instances:Create("UIListLayout", {
                        Parent = ColumnsParent,
                        Name = "\0",
                        FillDirection = Enum.FillDirection.Horizontal,
                        HorizontalFlex = Enum.UIFlexAlignment.Fill,
                        Padding = UDimNew(0, 4),
                        SortOrder = Enum.SortOrder.LayoutOrder
                    })

                    local Columns = Section.Page.Columns or 2
                    for ColIdx = 1, Columns do
                        local NewColumn = Instances:Create("ScrollingFrame", {
                            Parent = ColumnsParent,
                            Name = "\0",
                            ScrollBarImageColor3 = FromRGB(0, 0, 0),
                            Active = true,
                            AutomaticCanvasSize = Enum.AutomaticSize.Y,
                            ScrollBarThickness = 0,
                            BackgroundTransparency = 1,
                            Size = UDim2New(1, 0, 1, 0),
                            BackgroundColor3 = FromRGB(255, 255, 255),
                            BorderColor3 = FromRGB(0, 0, 0),
                            BorderSizePixel = 0,
                            CanvasSize = UDim2New(0, 0, 0, 0)
                        })

                        Instances:Create("UIPadding", {
                            Parent = NewColumn.Instance,
                            Name = "\0",
                            PaddingTop = UDimNew(0, 5),
                            PaddingBottom = UDimNew(0, 5),
                            PaddingRight = UDimNew(0, 5),
                            PaddingLeft = UDimNew(0, 5)
                        })

                        Instances:Create("UIListLayout", {
                            Parent = NewColumn.Instance,
                            Name = "\0",
                            Padding = UDimNew(0, 15),
                            SortOrder = Enum.SortOrder.LayoutOrder
                        })

                        Section.Page.ColumnsData[ColIdx] = NewColumn
                    end
                end
            end

            local Items = {}

            do
                Items["Section"] = Instances:Create("Frame", {
                    Parent = Section.Page.ColumnsData[Section.Side].Instance,
                    Name = "\0",
                    Size = UDim2New(1, 0, 0, 35),
                    BorderColor3 = FromRGB(0, 0, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["Section"]:AddToTheme({ BackgroundColor3 = "Inline" })

                Instances:Create("UICorner", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    CornerRadius = UDimNew(0, 6)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Section.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 5),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["Toggle"] = Instances:Create("TextButton", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 0, 0, 0),
                    Size = UDim2New(1, 0, 0, 35),
                    BorderSizePixel = 0,
                    ZIndex = 2,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Arrow"] = Instances:Create("ImageLabel", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    ImageColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Image = "rbxassetid://72579423244522",
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -17, 0, 17),
                    Size = UDim2New(0, 16, 0, 16),
                    ZIndex = 3,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Arrow"]:AddToTheme({ ImageColor3 = "Text" })

                Items["Description"] = Instances:Create("TextLabel", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    FontFace = Library.Subfont,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Section.Description,
                    Size = UDim2New(1, -16, 0, 15),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 24),
                    BorderColor3 = FromRGB(0, 0, 0),
                    TextXAlignment = Enum.TextXAlignment.Left,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    TextWrapped = true,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Description"]:AddToTheme({ TextColor3 = "Text" })

                Instances:Create("UIPadding", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    PaddingBottom = UDimNew(0, 8)
                })

                if Section.Premium then
                    Items["IsPremium"] = Instances:Create("TextButton", {
                        Parent = Items["Section"].Instance,
                        Name = "\0",
                        FontFace = Library.Font,
                        TextColor3 = FromRGB(0, 0, 0),
                        BorderColor3 = FromRGB(0, 0, 0),
                        Text = "",
                        AutoButtonColor = false,
                        BorderSizePixel = 0,
                        BackgroundTransparency = 0.35,
                        Position = UDim2New(0, 2, 0, 55),
                        Size = UDim2New(1, -4, 0, 405),
                        ZIndex = 2,
                        TextSize = 14,
                        BackgroundColor3 = FromRGB(17, 16, 20)
                    })
                    Items["IsPremium"]:AddToTheme({ BackgroundColor3 = "Background" })
                    Instances:Create("UICorner", { Parent = Items["IsPremium"].Instance, Name = "\0" })
                    Instances:Create("UIPadding", { Parent = Items["IsPremium"].Instance, Name = "\0" })

                    Items["PremiumText"] = Instances:Create("TextLabel", {
                        Parent = Items["Section"].Instance,
                        Name = "\0",
                        FontFace = Library.Font,
                        TextColor3 = FromRGB(255, 255, 255),
                        BorderColor3 = FromRGB(0, 0, 0),
                        Text = "Premium Access Only!",
                        BorderSizePixel = 0,
                        BackgroundTransparency = 1,
                        Position = UDim2New(0, 0, 0.5, 0),
                        Size = UDim2New(1, 0, 0, 55),
                        ZIndex = 4,
                        TextSize = 18,
                        BackgroundColor3 = FromRGB(255, 255, 255)
                    })
                    Items["PremiumText"]:AddToTheme({ TextColor3 = "Text" })
                end

                local Addition = 6
                Items["Content"] = Instances:Create("Frame", {
                    Parent = Items["Section"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, Items["Description"].Instance.AbsoluteSize.Y + 30),
                    Size = UDim2New(1, -16, 0, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Content"].Instance.Visible = false

                if Section.Description == "" then
                    Items["Content"].Instance.Position = UDim2New(0, 8, 0, 35)
                end

                Instances:Create("UIListLayout", {
                    Parent = Items["Content"].Instance,
                    Name = "\0",
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                if Section.Premium then
                    Items["IsPremium"].Instance.Size = UDim2New(1, -4, 0, Items["Content"].Instance.AbsoluteSize.Y + 4)
                    Items["IsPremium"].Instance.Position = UDim2New(0, 2, 0, Items["Content"].Instance.Position.Y.Offset - 4)
                    Items["IsPremium"].Instance.Visible = false
                    Items["PremiumText"].Instance.Visible = false
                end

                local function UpdateSectionLayout()
                    local HasDescription = Section.Description ~= ""
                    local DescriptionVisible = Section.IsOpen and HasDescription
                    Items["Description"].Instance.Visible = DescriptionVisible
                    Items["Content"].Instance.Visible = Section.IsOpen

                    if HasDescription then
                        Items["Content"].Instance.Position = UDim2New(0, 8, 0, Items["Description"].Instance.AbsoluteSize.Y + 30)
                    else
                        Items["Content"].Instance.Position = UDim2New(0, 8, 0, 35)
                    end

                    Items["Toggle"].Instance.Size = UDim2New(1, 0, 0, Section.IsOpen and Items["Content"].Instance.Position.Y.Offset or 35)

                    if Section.Premium then
                        Items["IsPremium"].Instance.Visible = Section.IsOpen
                        Items["PremiumText"].Instance.Visible = Section.IsOpen
                        Items["IsPremium"].Instance.Size = UDim2New(1, -4, 0, Items["Content"].Instance.AbsoluteSize.Y + 4)
                        Items["IsPremium"].Instance.Position = UDim2New(0, 2, 0, Items["Content"].Instance.Position.Y.Offset - 4)
                    end
                end

                function Section:SetOpen(Bool)
                    self.IsOpen = Bool
                    Items["Arrow"]:Tween(nil, { Rotation = Bool and 90 or 0 })
                    UpdateSectionLayout()
                end

                function Section:SetVisibility(Bool)
                    Items["Section"].Instance.Visible = Bool
                end

                Items["Section"]:Connect("Changed", function(Property)
                    if Property == "Size" or Property == "AbsoluteSize" and Section.Description ~= "" then
                        UpdateSectionLayout()
                    end
                end)

                Items["Toggle"]:Connect("MouseButton1Click", function()
                    Section:SetOpen(not Section.IsOpen)
                end)

                UpdateSectionLayout()
                Section.Items = Items
            end

            Section.Page.Sections = Section.Page.Sections or {}
            TableInsert(Section.Page.Sections, Section)
            Library:ApplyPageSearch(Section.Page, Section.Page.SearchQuery)
            return setmetatable(Section, Library.Sections)
        end

        Library.Sections.AddToggle = function(self, Data)
            Data = Data or {}
            local Toggle = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Data.Name or Data.name or "Toggle",
                Flag = Data.Flag or Data.flag or nil,
                Default = Data.Default or Data.default or false,
                Tooltip = Data.ToolTip or Data.tooltip or nil,
                Callback = Data.Callback or Data.callback or function() end,
                Premium = Data.Premium or Data.premium or false,
                Dependency = Data.Dependency or Data.dependency or nil
            }

            if not Toggle.Flag then Toggle.Flag = Toggle.Name end

            local IsHovered = false
            local UpdateToggleVisuals
            local Items = {}

            do
                Items["Toggle"] = Instances:Create("TextButton", {
                    Parent = Toggle.Section.Items["Content"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 18),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Indicator"] = Instances:Create("Frame", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    AnchorPoint = Library.ToggleSide == "Right" and Vector2New(1, 0.5) or Vector2New(0, 0.5),
                    Position = Library.ToggleSide == "Right" and UDim2New(1, 0, 0.5, 0) or UDim2New(0, 0, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 32, 0, 18),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["Indicator"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["Indicator"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })
                Instances:Create("UIStroke", { Parent = Items["Indicator"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })

                Instances:Create("UIGradient", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Check"] = Instances:Create("ImageLabel", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    ImageColor3 = FromRGB(0, 0, 0),
                    ScaleType = Enum.ScaleType.Fit,
                    ImageTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Image = "rbxassetid://116048588333795",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    Size = UDim2New(0, 0, 0, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Knob"] = Instances:Create("Frame", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    Position = UDim2New(0, 3, 0.5, 0),
                    Size = UDim2New(0, 12, 0, 12),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Knob"]:AddToTheme({ BackgroundColor3 = "Text" })
                Instances:Create("UICorner", { Parent = Items["Knob"].Instance, Name = "\0", CornerRadius = UDimNew(1, 0) })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Toggle.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundTransparency = 1,
                    Position = Library.ToggleSide == "Right" and UDim2New(0, 0, 0.5, 0) or UDim2New(0, 40, 0.5, 0),
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })
                Items["Text"]:Tooltip(Toggle.Tooltip)

                Items["SubElements"] = Instances:Create("Frame", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(1, 0),
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -38, 0, 0),
                    Size = UDim2New(0, 0, 1, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SubElements"].Instance,
                    Name = "\0",
                    VerticalAlignment = Enum.VerticalAlignment.Center,
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalAlignment = Enum.HorizontalAlignment.Right,
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                UpdateToggleVisuals = function()
                    local IsCheckbox = Library.ToggleStyle == "Checkbox"
                    local IsRight = Library.ToggleSide == "Right"
                    local IndicatorWidth = IsCheckbox and 18 or 32
                    local IndicatorTheme = Toggle.Value and "Accent" or (IsHovered and "Hovered Element" or "Element")

                    Items["Indicator"].Instance.AnchorPoint = IsRight and Vector2New(1, 0.5) or Vector2New(0, 0.5)
                    Items["Indicator"].Instance.Position = IsRight and UDim2New(1, 0, 0.5, 0) or UDim2New(0, 0, 0.5, 0)
                    Items["Indicator"].Instance.Size = UDim2New(0, IndicatorWidth, 0, 18)
                    Items["Text"].Instance.Position = IsRight and UDim2New(0, 0, 0.5, 0) or (IsCheckbox and UDim2New(0, 26, 0.5, 0) or UDim2New(0, 40, 0.5, 0))
                    Items["SubElements"].Instance.Position = IsRight and UDim2New(1, -(IndicatorWidth + 6), 0, 0) or UDim2New(1, 0, 0, 0)

                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = IndicatorTheme })
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme[IndicatorTheme] })
                    Items["Text"]:Tween(nil, { TextTransparency = Toggle.Value and 0 or (IsHovered and 0.15 or 0.4) })

                    if IsCheckbox then
                        Items["Knob"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Position = UDim2New(0, 3, 0.5, 0), Size = UDim2New(0, 0, 0, 0) })
                        Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = Toggle.Value and 0 or 1, Size = Toggle.Value and UDim2New(0, 8, 0, 8) or UDim2New(0, 0, 0, 0) })
                    else
                        Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 1, Size = UDim2New(0, 0, 0, 0) })
                        Items["Knob"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Position = Toggle.Value and UDim2New(0, 17, 0.5, 0) or UDim2New(0, 3, 0.5, 0), Size = UDim2New(0, 12, 0, 12) })
                    end
                end

                Items["Toggle"]:OnHover(function() IsHovered = true UpdateToggleVisuals() end)
                Items["Toggle"]:OnHoverLeave(function() IsHovered = false UpdateToggleVisuals() end)
                Items["Text"]:OnHover(function() IsHovered = true UpdateToggleVisuals() end)
                Items["Text"]:OnHoverLeave(function() IsHovered = false UpdateToggleVisuals() end)

                Items["Toggle"]:Connect("MouseButton1Down", function()
                    if Library.ToggleStyle ~= "Checkbox" then
                        Items["Knob"]:Tween(TweenInfo.new(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Size = UDim2New(0, 14, 0, 14) })
                    end
                end)

                Library:RegisterToggleStyleCallback(function() UpdateToggleVisuals() end)
            end

            Library.Elements[Toggle.Flag] = Toggle

            function Toggle:Get() return self.Value end
            function Toggle:SetVisibility(Bool) Items["Toggle"].Instance.Visible = Bool end

            function Toggle:Set(Bool)
                self.Value = Bool
                Library.Flags[self.Flag] = self.Value
                Library:QueueAutoSave()

                if Toggle.Dependency and Toggle.Dependency.Enabled then
                    for Index, Value in Toggle.Dependency.Values do
                        if not Library.Elements[Value] then continue end
                        Library.Elements[Value]:SetVisibility(self.Value)
                    end
                end

                UpdateToggleVisuals()
                if self.Callback then Library:SafeCall(self.Callback, self.Value) end
            end

            function Toggle:AddColorpicker(Data)
                Data = Data or {}
                local Colorpicker = {
                    Window = self.Window,
                    Page = self.Page,
                    Section = self.Section,
                    Flag = Data.Flag or Data.flag or nil,
                    Default = Data.Default or Data.default or Color3.fromRGB(255, 255, 255),
                    Premium = Data.Premium or Data.premium or false,
                    Callback = Data.Callback or Data.callback or function() end
                }
                local NewColorpicker, ColorpickerItems = Library:CreateColorpicker({
                    Name = Colorpicker.Name,
                    Parent = Items["SubElements"],
                    Default = Colorpicker.Default,
                    Premium = Colorpicker.Premium,
                    Flag = Colorpicker.Flag,
                    Callback = Colorpicker.Callback
                })
                return NewColorpicker
            end

            function Toggle:AddKeybind(Data)
                Data = Data or {}
                local Keybind = {
                    Window = self.Window,
                    Page = self.Page,
                    Section = self.Section,
                    Flag = Data.Flag or Data.flag or nil,
                    Default = Data.Default or Data.default or nil,
                    Premium = Data.Premium or Data.premium or false,
                    Mode = Data.Mode or Data.mode or "Toggle",
                    Callback = Data.Callback or Data.callback or function() end
                }
                local NewKeybind, KeybindItems = Library:CreateKeybind({
                    Name = Keybind.Name,
                    Parent = Items["SubElements"],
                    Flag = Keybind.Flag,
                    Premium = Keybind.Premium,
                    Default = Keybind.Default,
                    Mode = Keybind.Mode,
                    Callback = Keybind.Callback
                })
                return NewKeybind
            end

            local SearchData = { Name = Toggle.Name, Item = Items["Toggle"], Section = Toggle.Section }
            local PageSearchData = Library.SearchItems[Toggle.Page]
            if not PageSearchData then return end
            TableInsert(PageSearchData, SearchData)

            Items["Toggle"]:Connect("MouseButton1Click", function()
                if Toggle.Premium then return end
                if Library:IsMouseOverFrame(Items["Text"]) or Library:IsMouseOverFrame(Items["Indicator"]) then
                    Toggle:Set(not Toggle.Value)
                end
            end)

            Library.SetFlags[Toggle.Flag] = function(Value) Toggle:Set(Value) end
            Toggle:Set(Toggle.Default)
            Library:RegisterDefaultFlag(Toggle.Flag, Library.Flags[Toggle.Flag])
            return Toggle
        end

        Library.Sections.AddButton = function(self, Data)
            Data = Data or {}
            local Button = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Data.Name or Data.name or "Button",
                Callback = Data.Callback or Data.callback or function() end,
                Tooltip = Data.ToolTip or Data.tooltip or nil,
                Premium = Data.Premium or Data.premium or false
            }
            local Items = {}

            do
                Items["Buttons"] = Instances:Create("Frame", {
                    Parent = Button.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 25),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Buttons"]:Tooltip(Button.Tooltip)

                Instances:Create("UIListLayout", {
                    Parent = Items["Buttons"].Instance,
                    Name = "\0",
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalFlex = Enum.UIFlexAlignment.Fill,
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Items["NewButton"] = Instances:Create("TextButton", {
                    Parent = Items["Buttons"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    Size = UDim2New(1, 0, 1, 0),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["NewButton"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["NewButton"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Instances:Create("UIGradient", {
                    Parent = Items["NewButton"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["NewButton"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Button.Name,
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["Buttons"]:OnHover(function()
                    Items["NewButton"]:ChangeItemTheme({ BackgroundColor3 = "Hovered Element" })
                    Items["NewButton"]:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] })
                end)

                Items["Buttons"]:OnHoverLeave(function()
                    Items["NewButton"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["NewButton"]:Tween(nil, { BackgroundColor3 = Library.Theme["Element"] })
                end)
            end

            Library.Elements[Button.Name] = Button

            function Button:SetVisibility(Bool) Items["Buttons"].Instance.Visible = Bool end

            function Button:Press()
                Items["NewButton"]:ChangeItemTheme({ BackgroundColor3 = "Accent" })
                Items["NewButton"]:Tween(nil, { BackgroundColor3 = Library.Theme.Accent })
                task.wait(0.1)
                Library:SafeCall(self.Callback)
                Items["NewButton"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                Items["NewButton"]:Tween(nil, { BackgroundColor3 = Library.Theme.Element })
            end

            local PageSearchData = Library.SearchItems[Button.Page]
            if PageSearchData then
                local SearchData = { Name = Button.Name, Item = Items["Buttons"], Section = Button.Section }
                TableInsert(PageSearchData, SearchData)
            end

            Items["NewButton"]:Connect("MouseButton1Click", function()
                if Button.Premium then return end
                Button:Press()
            end)

            return Button
        end

        Library.Sections.AddSlider = function(self, Data)
            Data = Data or {}
            local SliderName = Data.Name or Data.name or "Slider"
            local Slider = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = SliderName,
                Flag = Library:ResolveElementFlag(Data.Flag or Data.flag, SliderName),
                Default = Data.Default or Data.default or 0,
                Min = Data.Min or Data.min or 0,
                Max = Data.Max or Data.max or 100,
                Decimals = Data.Increment or Data.increment or 1,
                Callback = Data.Callback or Data.callback or function() end,
                Suffix = Data.ValueName or Data.valuename or "",
                Tooltip = Data.ToolTip or Data.tooltip or nil,
                Premium = Data.Premium or Data.premium or false,
                Value = 0,
                Sliding = false
            }
            local Items = {}

            do
                Items["Slider"] = Instances:Create("Frame", {
                    Parent = Slider.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 28),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Slider"]:Tooltip(Slider.Tooltip)

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Slider"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Slider.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    RichText = true,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["RealSlider"] = Instances:Create("TextButton", {
                    Parent = Items["Slider"].Instance,
                    Text = "",
                    AutoButtonColor = false,
                    Name = "\0",
                    AnchorPoint = Vector2New(0, 1),
                    Position = UDim2New(0, 0, 1, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 5),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["RealSlider"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["RealSlider"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Instances:Create("UIGradient", {
                    Parent = Items["RealSlider"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Accent"] = Instances:Create("Frame", {
                    Parent = Items["RealSlider"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0.5, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(246, 178, 255)
                })
                Items["Accent"]:AddToTheme({ BackgroundColor3 = "Accent" })
                Instances:Create("UICorner", { Parent = Items["Accent"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Instances:Create("UIGradient", {
                    Parent = Items["Accent"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Dragger"] = Instances:Create("TextButton", {
                    Parent = Items["Accent"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    AnchorPoint = Vector2New(0, 0.5),
                    Position = UDim2New(1, -7, 0.5, 0),
                    Size = UDim2New(0, 10, 0, 10),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Instances:Create("UIGradient", {
                    Parent = Items["Dragger"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })
                Instances:Create("UICorner", { Parent = Items["Dragger"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["Value"] = Instances:Create("TextBox", {
                    Parent = Items["Slider"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "50s",
                    Size = UDim2New(0, 0, 0, 15),
                    Position = UDim2New(1, 0, 0, 0),
                    AnchorPoint = Vector2New(1, 0),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    PlaceholderColor3 = FromRGB(255, 255, 255),
                    AutomaticSize = Enum.AutomaticSize.X,
                    ClearTextOnFocus = false,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Value"]:AddToTheme({ TextColor3 = "Text" })

                Items["Slider"]:OnHover(function()
                    Items["RealSlider"]:ChangeItemTheme({ BackgroundColor3 = "Hovered Element" })
                    Items["RealSlider"]:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] })
                end)

                Items["Slider"]:OnHoverLeave(function()
                    Items["RealSlider"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["RealSlider"]:Tween(nil, { BackgroundColor3 = Library.Theme["Element"] })
                end)
            end

            Library.Elements[Slider.Flag] = Slider

            function Slider:Get() return self.Value end

            function Slider:Set(Value)
                self.Value = Library:Round(MathClamp(Value, self.Min, self.Max), self.Decimals)
                Library.Flags[self.Flag] = self.Value
                Library:QueueAutoSave()

                Items["Accent"]:Tween(TweenInfo.new(0.17, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Size = UDim2New((self.Value - self.Min) / (self.Max - self.Min), 0, 1, 0) })
                Items["Value"].Instance.Text = StringFormat("%s%s", tostring(self.Value), " " .. self.Suffix)
                Items["Dragger"]:Tween(nil, { Position = self.Value == self.Max and UDim2New(1, -8, 0.5, 0) or UDim2New(1, -3, 0.5, 0) })

                if self.Callback then Library:SafeCall(self.Callback, self.Value) end
            end

            function Slider:SetVisibility(Bool) Items["Slider"].Instance.Visible = Bool end

            local PageSearchData = Library.SearchItems[Slider.Page]
            if PageSearchData then
                local SearchData = { Name = Slider.Name, Item = Items["Slider"], Section = Slider.Section }
                TableInsert(PageSearchData, SearchData)
            end

            local RealSliderInputChanged
            local DraggerInputChanged

            Items["RealSlider"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    if Slider.Premium then return end
                    Slider.Sliding = true
                    local SizeX = (Input.Position.X - Items["RealSlider"].Instance.AbsolutePosition.X) / Items["RealSlider"].Instance.AbsoluteSize.X
                    local Value = ((Slider.Max - Slider.Min) * SizeX) + Slider.Min
                    Slider:Set(Value)
                    if RealSliderInputChanged then return end
                    RealSliderInputChanged = Input.Changed:Connect(function()
                        if Input.UserInputState == Enum.UserInputState.End then
                            Slider.Sliding = false
                            RealSliderInputChanged:Disconnect()
                            RealSliderInputChanged = nil
                        end
                    end)
                end
            end)

            Items["Dragger"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    if Slider.Premium then return end
                    Slider.Sliding = true
                    local SizeX = (Input.Position.X - Items["RealSlider"].Instance.AbsolutePosition.X) / Items["RealSlider"].Instance.AbsoluteSize.X
                    local Value = ((Slider.Max - Slider.Min) * SizeX) + Slider.Min
                    Slider:Set(Value)
                    if DraggerInputChanged then return end
                    DraggerInputChanged = Input.Changed:Connect(function()
                        if Input.UserInputState == Enum.UserInputState.End then
                            Slider.Sliding = false
                            DraggerInputChanged:Disconnect()
                            DraggerInputChanged = nil
                        end
                    end)
                end
            end)

            Library:Connect(UserInputService.InputChanged, function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseMovement or Input.UserInputType == Enum.UserInputType.Touch then
                    if Slider.Premium then return end
                    if Slider.Sliding then
                        local SizeX = (Input.Position.X - Items["RealSlider"].Instance.AbsolutePosition.X) / Items["RealSlider"].Instance.AbsoluteSize.X
                        local Value = ((Slider.Max - Slider.Min) * SizeX) + Slider.Min
                        Slider:Set(Value)
                    end
                end
            end)

            Items["Value"]:Connect("Focused", function()
                if Slider.Premium then return end
                Items["Value"].Instance.Text = StringFormat("%s", tostring(Slider.Value))
            end)

            Items["Value"]:Connect("FocusLost", function()
                if Slider.Premium then return end
                Slider:Set(tonumber(Items["Value"].Instance.Text))
            end)

            if Slider.Default then Slider:Set(Slider.Default) end
            Library:RegisterDefaultFlag(Slider.Flag, Slider.Default)
            Library.SetFlags[Slider.Flag] = function(Value) Slider:Set(Value) end
            return Slider
        end

        Library.Sections.AddDropdown = function(self, Data)
            Data = Data or {}
            local DropdownName = Data.Name or Data.name or "Dropdown"
            local Dropdown = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = DropdownName,
                Flag = Library:ResolveElementFlag(Data.Flag or Data.flag, DropdownName),
                MaxSize = Data.MaxSize or Data.maxsize or 125,
                Default = Data.Default or Data.default or "",
                Callback = Data.Callback or Data.callback or function() end,
                Tooltip = Data.ToolTip or Data.tooltip or nil,
                Options = Data.Options or Data.options or {},
                Multi = Data.Multi or Data.multi or false,
                Premium = Data.Premium or Data.premium or false,
                Value = {},
                IsOpen = false,
                OptionInstances = {},
                OptionOrder = {}
            }

            local SelectAllHeight = IsMobile and 16 or 17
            local SelectAllWidth = IsMobile and 74 or 82
            local SelectAllIndicatorSize = IsMobile and 12 or 14
            local SelectAllCheckSize = IsMobile and 7 or 8
            local SelectAllBottomPadding = IsMobile and 5 or 6
            local Items = {}

            do
                Items["Dropdown"] = Instances:Create("Frame", {
                    Parent = Dropdown.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 48),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Dropdown"]:Tooltip(Dropdown.Tooltip)

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Dropdown"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Dropdown.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    RichText = true,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["RealDropdown"] = Instances:Create("TextButton", {
                    Parent = Items["Dropdown"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    AnchorPoint = Vector2New(0, 1),
                    Position = UDim2New(0, 0, 1, 0),
                    Size = UDim2New(1, 0, 0, 25),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["RealDropdown"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["RealDropdown"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Instances:Create("UIGradient", {
                    Parent = Items["RealDropdown"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Value"] = Instances:Create("TextLabel", {
                    Parent = Items["RealDropdown"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    RichText = true,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "--",
                    Size = UDim2New(1, -25, 0, 15),
                    Position = UDim2New(0, 8, 0.5, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextTruncate = Enum.TextTruncate.AtEnd,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Value"]:AddToTheme({ TextColor3 = "Text" })

                Items["Icon"] = Instances:Create("ImageLabel", {
                    Parent = Items["RealDropdown"].Instance,
                    Name = "\0",
                    ImageColor3 = FromRGB(246, 178, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(1, 0.5),
                    Image = "rbxassetid://72579423244522",
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, -5, 0.5, -1),
                    Size = UDim2New(0, 16, 0, 16),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Icon"]:AddToTheme({ ImageColor3 = "Accent" })

                Items["OptionHolder"] = Instances:Create("TextButton", {
                    Parent = Items["Dropdown"].Instance,
                    Name = "\0",
                    Visible = false,
                    Active = false,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    Selectable = false,
                    Position = UDim2New(0, 0, 1, 5),
                    Size = UDim2New(1, 0, 0, 125),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(26, 25, 31)
                })
                Items["OptionHolder"]:AddToTheme({ BackgroundColor3 = "Inline" })
                Instances:Create("UICorner", { Parent = Items["OptionHolder"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })
                Instances:Create("UIStroke", { Parent = Items["OptionHolder"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })

                Items["Holder"] = Instances:Create("ScrollingFrame", {
                    Parent = Items["OptionHolder"].Instance,
                    Name = "\0",
                    Active = true,
                    AutomaticCanvasSize = Enum.AutomaticSize.Y,
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    CanvasSize = UDim2New(0, 0, 0, 0),
                    ScrollBarImageColor3 = FromRGB(246, 178, 255),
                    MidImage = "rbxassetid://105444659140695",
                    BorderColor3 = FromRGB(0, 0, 0),
                    ScrollBarThickness = 2,
                    Size = Dropdown.Multi and UDim2New(1, -12, 1, -(48 + SelectAllHeight + SelectAllBottomPadding)) or UDim2New(1, -12, 1, -51),
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 6, 0, 45),
                    BottomImage = "rbxassetid://105444659140695",
                    TopImage = "rbxassetid://105444659140695",
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Holder"]:AddToTheme({ ScrollBarImageColor3 = "Accent" })

                Instances:Create("UIListLayout", {
                    Parent = Items["Holder"].Instance,
                    Name = "\0",
                    Padding = UDimNew(0, 5),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                Instances:Create("UIPadding", {
                    Parent = Items["Holder"].Instance,
                    Name = "\0",
                    PaddingTop = UDimNew(0, 2),
                    PaddingBottom = UDimNew(0, 2),
                    PaddingRight = UDimNew(0, 8),
                    PaddingLeft = UDimNew(0, 2)
                })

                Items["Searchbar"] = Instances:Create("Frame", {
                    Parent = Items["OptionHolder"].Instance,
                    Name = "\0",
                    Size = UDim2New(1, -16, 0, IsMobile and 20 or 30),
                    Position = UDim2New(0, 8, 0, 8),
                    BorderColor3 = FromRGB(0, 0, 0),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                Items["Searchbar"]:AddToTheme({ BackgroundColor3 = "Background" })
                Instances:Create("UIStroke", { Parent = Items["Searchbar"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })
                Instances:Create("UICorner", { Parent = Items["Searchbar"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Items["SearchIcon"] = Instances:Create("ImageLabel", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    ImageTransparency = 0.4000000059604645,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 16, 0, 16),
                    AnchorPoint = Vector2New(0, 0.5),
                    Image = "rbxassetid://106690619909970",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0.5, 0),
                    ZIndex = 2,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["SearchIcon"]:AddToTheme({ ImageColor3 = "Text" })

                Items["Input"] = Instances:Create("TextBox", {
                    Parent = Items["Searchbar"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    AnchorPoint = Vector2New(0, 0.5),
                    PlaceholderColor3 = FromRGB(185, 185, 185),
                    ZIndex = 2,
                    TextSize = 14,
                    Size = UDim2New(1, -46, 0, 15),
                    ClipsDescendants = true,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    CursorPosition = -1,
                    Position = UDim2New(0, 38, 0.5, 0),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    TextColor3 = FromRGB(255, 255, 255),
                    ClearTextOnFocus = false,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Input"]:AddToTheme({ TextColor3 = "Text" })

                if Dropdown.Multi then
                    Items["SelectAll"] = Instances:Create("TextButton", {
                        Parent = Items["OptionHolder"].Instance,
                        Name = "\0",
                        AnchorPoint = Vector2New(1, 1),
                        Position = UDim2New(1, -6, 1, -SelectAllBottomPadding),
                        Size = UDim2New(0, SelectAllWidth, 0, SelectAllHeight),
                        BackgroundTransparency = 1,
                        BorderSizePixel = 0,
                        Text = "",
                        AutoButtonColor = false,
                        ZIndex = 2,
                        BackgroundColor3 = FromRGB(255, 255, 255)
                    })

                    Items["SelectAllIndicator"] = Instances:Create("Frame", {
                        Parent = Items["SelectAll"].Instance,
                        Name = "\0",
                        AnchorPoint = Vector2New(0, 0.5),
                        Position = UDim2New(0, 0, 0.5, 0),
                        Size = UDim2New(0, SelectAllIndicatorSize, 0, SelectAllIndicatorSize),
                        BackgroundColor3 = FromRGB(41, 40, 49),
                        BorderSizePixel = 0,
                        BackgroundTransparency = 0,
                        ZIndex = 2
                    })
                    Items["SelectAllIndicator"]:AddToTheme({ BackgroundColor3 = "Element" })
                    Instances:Create("UICorner", { Parent = Items["SelectAllIndicator"].Instance, Name = "\0", CornerRadius = UDimNew(0, 4) })

                    Instances:Create("UIGradient", {
                        Parent = Items["SelectAllIndicator"].Instance,
                        Name = "\0",
                        Rotation = 90,
                        Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                    }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                    Items["SelectAllCheck"] = Instances:Create("ImageLabel", {
                        Parent = Items["SelectAllIndicator"].Instance,
                        Name = "\0",
                        AnchorPoint = Vector2New(0.5, 0.5),
                        Position = UDim2New(0.5, 0, 0.5, 0),
                        Size = UDim2New(0, 0, 0, 0),
                        BackgroundTransparency = 1,
                        BorderSizePixel = 0,
                        Image = "rbxassetid://116048588333795",
                        ImageColor3 = FromRGB(0, 0, 0),
                        ImageTransparency = 1,
                        ScaleType = Enum.ScaleType.Fit,
                        ZIndex = 2,
                        BackgroundColor3 = FromRGB(255, 255, 255)
                    })

                    Items["SelectAllText"] = Instances:Create("TextLabel", {
                        Parent = Items["SelectAll"].Instance,
                        Name = "\0",
                        AnchorPoint = Vector2New(0, 0.5),
                        Position = UDim2New(0, SelectAllIndicatorSize + 4, 0.5, 0),
                        Size = UDim2New(1, -(SelectAllIndicatorSize + 4), 1, 0),
                        BackgroundTransparency = 1,
                        BorderSizePixel = 0,
                        FontFace = Library.Font,
                        Text = "Select All",
                        TextColor3 = FromRGB(255, 255, 255),
                        TextSize = IsMobile and 12 or 13,
                        TextTransparency = 0.4,
                        TextXAlignment = Enum.TextXAlignment.Left,
                        ZIndex = 2,
                        BackgroundColor3 = FromRGB(255, 255, 255)
                    })
                    Items["SelectAllText"]:AddToTheme({ TextColor3 = "Text" })
                end

                Items["Dropdown"]:OnHover(function()
                    Items["RealDropdown"]:ChangeItemTheme({ BackgroundColor3 = "Hovered Element" })
                    Items["RealDropdown"]:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] })
                end)

                Items["Dropdown"]:OnHoverLeave(function()
                    Items["RealDropdown"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["RealDropdown"]:Tween(nil, { BackgroundColor3 = Library.Theme["Element"] })
                end)
            end

            Library.Elements[Dropdown.Flag] = Dropdown

            function Dropdown:Get() return self.Value end

            function Dropdown:GetOrderedOptions()
                local OrderedOptions = {}
                for _, OptionName in self.OptionOrder do
                    if self.OptionInstances[OptionName] then
                        TableInsert(OrderedOptions, OptionName)
                    end
                end
                return OrderedOptions
            end

            function Dropdown:UpdateMultiSelectAllState()
                if not self.Multi or not Items["SelectAllIndicator"] then return end
                local SelectedCount = #self.Value
                local OptionCount = 0
                for _, OptionName in self.OptionOrder do
                    if self.OptionInstances[OptionName] then OptionCount = OptionCount + 1 end
                end
                local AllSelected = OptionCount > 0 and SelectedCount == OptionCount

                if AllSelected then
                    Items["SelectAllIndicator"]:ChangeItemTheme({ BackgroundColor3 = "Accent" })
                    Items["SelectAllIndicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Accent })
                    Items["SelectAllText"]:Tween(nil, { TextTransparency = 0 })
                    Items["SelectAllCheck"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 0, Size = UDim2New(0, SelectAllCheckSize, 0, SelectAllCheckSize) })
                else
                    Items["SelectAllIndicator"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["SelectAllIndicator"]:Tween(nil, { BackgroundColor3 = Library.Theme.Element })
                    Items["SelectAllText"]:Tween(nil, { TextTransparency = 0.4 })
                    Items["SelectAllCheck"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 1, Size = UDim2New(0, 0, 0, 0) })
                end
            end

            function Dropdown:ApplyMultiSelection(Options, ShouldSave, ShouldCallback)
                local SelectedLookup = {}
                local SelectedOptions = {}

                for _, OptionName in Options do
                    if self.OptionInstances[OptionName] and not SelectedLookup[OptionName] then
                        SelectedLookup[OptionName] = true
                        TableInsert(SelectedOptions, OptionName)
                    end
                end

                for _, OptionName in self.OptionOrder do
                    local OptionData = self.OptionInstances[OptionName]
                    if OptionData then
                        OptionData.Selected = SelectedLookup[OptionName] == true
                        OptionData:Toggle(OptionData.Selected and "Active" or "Inactive")
                    end
                end

                self.Value = SelectedOptions
                Library.Flags[self.Flag] = self.Value
                Items["Value"].Instance.Text = #self.Value == 0 and "--" or TableConcat(self.Value, ", ")
                self:UpdateMultiSelectAllState()

                if ShouldSave ~= false then Library:QueueAutoSave() end
                if ShouldCallback ~= false and self.Callback then Library:SafeCall(self.Callback, self.Value) end
            end

            function Dropdown:Set(Option)
                if self.Multi then
                    if type(Option) ~= "table" then return end
                    self:ApplyMultiSelection(Option)
                else
                    if not self.OptionInstances[Option] then return end
                    local OptionData = self.OptionInstances[Option]
                    self.Value = OptionData.Name
                    Library.Flags[self.Flag] = OptionData.Name
                    Library:QueueAutoSave()

                    for Index, Value in self.OptionInstances do
                        if Value ~= OptionData then
                            Value.Selected = false
                            Value:Toggle("Inactive")
                        else
                            Value.Selected = true
                            Value:Toggle("Active")
                        end
                    end
                    Items["Value"].Instance.Text = OptionData.Name
                end
                if self.Callback then Library:SafeCall(self.Callback, self.Value) end
            end

            function Dropdown:SetText(Text)
                Items["Value"].Instance.Text = Text
                Dropdown.Value = nil
            end

            function Dropdown:Add(Option)
                local OptionButton = Instances:Create("TextButton", {
                    Parent = Items["Holder"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    Size = UDim2New(1, 0, 0, 25),
                    ZIndex = 2,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                })
                OptionButton:AddToTheme({ BackgroundColor3 = "Background" })
                Instances:Create("UICorner", { Parent = OptionButton.Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                local OptionText = Instances:Create("TextLabel", {
                    Parent = OptionButton.Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Option,
                    AutomaticSize = Enum.AutomaticSize.X,
                    Size = UDim2New(0, 0, 1, 0),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = UDim2New(0, 8, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    ZIndex = 2,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                OptionText:AddToTheme({ TextColor3 = "Text" })

                local OptionData = { Name = Option, Selected = false, Button = OptionButton, Text = OptionText }

                function OptionData:Toggle(Status)
                    if Status == "Active" then
                        OptionData.Button:Tween(nil, { BackgroundTransparency = 0 })
                        OptionData.Text:Tween(nil, { TextTransparency = 0 })
                    else
                        OptionData.Button:Tween(nil, { BackgroundTransparency = 1 })
                        OptionData.Text:Tween(nil, { TextTransparency = 0.4 })
                    end
                end

                function OptionData:Set()
                    self.Selected = not self.Selected
                    if Dropdown.Multi then
                        local NewValue = TableClone(Dropdown.Value)
                        local Index = TableFind(NewValue, self.Name)
                        if Index then
                            TableRemove(NewValue, Index)
                        else
                            TableInsert(NewValue, self.Name)
                        end
                        Dropdown:ApplyMultiSelection(NewValue, true, false)
                    else
                        if self.Selected then
                            Dropdown.Value = self.Name
                            Library.Flags[Dropdown.Flag] = self.Name
                            Library:QueueAutoSave()
                            for Index, Value in Dropdown.OptionInstances do
                                if Value ~= OptionData then
                                    Value.Selected = false
                                    Value:Toggle("Inactive")
                                else
                                    Value.Selected = true
                                    Value:Toggle("Active")
                                end
                            end
                            Items["Value"].Instance.Text = self.Name
                        else
                            Dropdown.Value = nil
                            Library.Flags[Dropdown.Flag] = nil
                            Library:QueueAutoSave()
                            self.Selected = false
                            self:Toggle("Inactive")
                            Items["Value"].Instance.Text = "--"
                        end
                    end
                    if Dropdown.Callback then Library:SafeCall(Dropdown.Callback, Dropdown.Value) end
                end

                OptionData.Button:Connect("MouseButton1Click", function()
                    if Dropdown.Premium then return end
                    OptionData:Set()
                end)

                Dropdown.OptionInstances[OptionData.Name] = OptionData
                TableInsert(Dropdown.OptionOrder, OptionData.Name)

                if Dropdown.Multi then Dropdown:UpdateMultiSelectAllState() end
                return OptionData
            end

            local Debounce = false
            local RenderStepped
            local OptionsRefreshThread
            local OptionsRefreshToken = 0

            local function RefreshDynamicOptions()
                if type(Dropdown.Options) == "function" then
                    pcall(function()
                        local newOptions = Dropdown.Options()
                        if type(newOptions) == "table" then
                            local currentOptions = {}
                            for optionName, _ in pairs(Dropdown.OptionInstances) do currentOptions[optionName] = true end
                            local newOptionsList = {}
                            for Index, Value in newOptions do
                                local optionName = ""
                                if type(Value) == "Instance" and Value:IsA("Player") then
                                    optionName = Value.Name
                                elseif type(Value) == "string" then
                                    optionName = Value
                                else
                                    optionName = tostring(Value)
                                end
                                newOptionsList[optionName] = true
                                if not currentOptions[optionName] then Dropdown:Add(optionName) end
                            end
                            for optionName, _ in pairs(currentOptions) do
                                if not newOptionsList[optionName] then Dropdown:Remove(optionName) end
                            end
                        end
                    end)
                elseif type(Dropdown.Options) == "Instance" and (Dropdown.Options.ClassName == "Players" or Dropdown.Options:IsA("DataModel")) then
                    local currentOptions = {}
                    for optionName, _ in pairs(Dropdown.OptionInstances) do currentOptions[optionName] = true end
                    local newOptionsList = {}
                    for Index, Value in Dropdown.Options:GetChildren() do
                        if Value:IsA("Player") then
                            newOptionsList[Value.Name] = true
                            if not currentOptions[Value.Name] then Dropdown:Add(Value.Name) end
                        end
                    end
                    for optionName, _ in pairs(currentOptions) do
                        if not newOptionsList[optionName] then Dropdown:Remove(optionName) end
                    end
                end
            end

            function Dropdown:SetOpen(Bool)
                if Debounce then return end
                self.IsOpen = Bool
                Debounce = true
                Items["OptionHolder"].Instance.Visible = self.IsOpen
                Items["OptionHolder"].Instance.Parent = self.IsOpen and Library.Holder.Instance or Library.UnusedHolder.Instance

                if self.IsOpen then
                    Items["Icon"]:Tween(nil, { Rotation = -90 })

                    local function UpdateOptionHolder()
                        Items["OptionHolder"].Instance.Position = UDim2New(0, Items["RealDropdown"].Instance.AbsolutePosition.X, 0, Items["RealDropdown"].Instance.AbsolutePosition.Y + Items["RealDropdown"].Instance.AbsoluteSize.Y + 5)
                        Items["OptionHolder"].Instance.Size = UDim2New(0, Items["RealDropdown"].Instance.AbsoluteSize.X, 0, Dropdown.MaxSize)
                    end

                    UpdateOptionHolder()
                    local _rdInst = Items["RealDropdown"].Instance
                    local _sC = _rdInst:GetPropertyChangedSignal("AbsoluteSize"):Connect(UpdateOptionHolder)
                    local _sD = _rdInst:GetPropertyChangedSignal("AbsolutePosition"):Connect(UpdateOptionHolder)
                    RenderStepped = { Disconnect = function() _sC:Disconnect() _sD:Disconnect() end }

                    if type(Dropdown.Options) == "function" or (type(Dropdown.Options) == "Instance" and (Dropdown.Options.ClassName == "Players" or Dropdown.Options:IsA("DataModel"))) then
                        OptionsRefreshToken = OptionsRefreshToken + 1
                        local CurrentToken = OptionsRefreshToken
                        RefreshDynamicOptions()
                        OptionsRefreshThread = task.spawn(function()
                            while Dropdown.IsOpen and OptionsRefreshToken == CurrentToken do
                                task.wait(0.2)
                                if not Dropdown.IsOpen or OptionsRefreshToken ~= CurrentToken then break end
                                RefreshDynamicOptions()
                            end
                        end)
                    end

                    for Index, Value in Library.OpenFrames do
                        if Value ~= self then Value:SetOpen(false) end
                    end
                    Library.OpenFrames[self] = self
                else
                    Items["Icon"]:Tween(nil, { Rotation = 0 })
                    if Library.OpenFrames[self] then Library.OpenFrames[self] = nil end
                    if RenderStepped then RenderStepped:Disconnect() RenderStepped = nil end
                    if OptionsRefreshThread then pcall(function() task.cancel(OptionsRefreshThread) end) OptionsRefreshThread = nil end
                    OptionsRefreshToken = OptionsRefreshToken + 1
                end

                local Descendants = Items["OptionHolder"].Instance:GetDescendants()
                TableInsert(Descendants, Items["OptionHolder"].Instance)
                local NewTween

                for Index, Value in Descendants do
                    local TransparencyProperty = Tween:GetProperty(Value)
                    if TransparencyProperty then
                        if not StringFind(Value.ClassName, "UI") then Value.ZIndex = self.IsOpen and 104 or 1 end
                        if type(TransparencyProperty) == "table" then
                            for _, Property in TransparencyProperty do
                                NewTween = Tween:FadeItem(Value, Property, Bool, Library.FadeSpeed)
                            end
                        else
                            NewTween = Tween:FadeItem(Value, TransparencyProperty, Bool, Library.FadeSpeed)
                        end
                    end
                end

                if NewTween and NewTween.Tween then
                    NewTween.Tween.Completed:Once(function() Debounce = false end)
                else
                    Debounce = false
                end
            end

            function Dropdown:Remove(Option)
                if Dropdown.OptionInstances[Option] then
                    Dropdown.OptionInstances[Option].Button:Clean()
                    Dropdown.OptionInstances[Option] = nil
                    local OrderIndex = TableFind(Dropdown.OptionOrder, Option)
                    if OrderIndex then TableRemove(Dropdown.OptionOrder, OrderIndex) end
                    if Dropdown.Multi then Dropdown:ApplyMultiSelection(Dropdown.Value, false, false) end
                end
            end

            function Dropdown:Refresh(List, ShouldClearOthers)
                if ShouldClearOthers then
                    for Index, Value in Dropdown.OptionInstances do self:Remove(Value.Name) end
                end
                for Index, Value in List do Dropdown:Add(Value) end
            end

            function Dropdown:SetVisibility(Bool) Items["Dropdown"].Instance.Visible = Bool end

            local PageSearchData = Library.SearchItems[Dropdown.Page]
            if PageSearchData then
                local SearchData = { Name = Dropdown.Name, Item = Items["Dropdown"], Section = Dropdown.Section }
                TableInsert(PageSearchData, SearchData)
            end

            local SearchStepped
            Items["Input"]:Connect("Focused", function()
                Items["SearchIcon"]:Tween(nil, { ImageTransparency = 0 })

                local function FilterOptions()
                    local query = Items["Input"].Instance.Text
                    if query ~= "" then
                        local lowerQuery = StringLower(query)
                        for Index, Value in Dropdown.OptionInstances do
                            Value.Button.Instance.Visible = StringFind(StringLower(Value.Name), lowerQuery, 1, true) ~= nil
                        end
                    else
                        for Index, Value in Dropdown.OptionInstances do Value.Button.Instance.Visible = true end
                    end
                end

                FilterOptions()
                SearchStepped = Items["Input"].Instance:GetPropertyChangedSignal("Text"):Connect(FilterOptions)
            end)

            Items["Input"]:Connect("FocusLost", function()
                Items["SearchIcon"]:Tween(nil, { ImageTransparency = 0.4 })
                if SearchStepped then SearchStepped:Disconnect() SearchStepped = nil end
            end)

            Items["RealDropdown"]:Connect("MouseButton1Click", function()
                if Dropdown.Premium then return end
                Dropdown:SetOpen(not Dropdown.IsOpen)
            end)

            if Dropdown.Multi and Items["SelectAll"] then
                Items["SelectAll"]:Connect("MouseButton1Click", function()
                    if Dropdown.Premium then return end
                    local CurrentOptions = Dropdown:GetOrderedOptions()
                    local AllSelected = #CurrentOptions > 0 and #Dropdown.Value == #CurrentOptions
                    Dropdown:ApplyMultiSelection(AllSelected and {} or CurrentOptions)
                end)
            end

            Library:Connect(UserInputService.InputBegan, function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    if not Dropdown.IsOpen then return end
                    if Library:IsMouseOverFrame(Items["OptionHolder"]) then return end
                    Dropdown:SetOpen(false)
                end
            end)

            Items["RealDropdown"]:Connect("Changed", function(Property)
                if Property == "AbsolutePosition" and Dropdown.IsOpen then
                    Dropdown.IsOpen = not Library:IsClipped(Items["OptionHolder"].Instance, Dropdown.Section.Items["Section"].Instance.Parent)
                    Items["OptionHolder"].Instance.Visible = Dropdown.IsOpen
                end
            end)

            if type(Dropdown.Options) == "function" then
                pcall(function()
                    local initialOptions = Dropdown.Options()
                    if type(initialOptions) == "table" then
                        for Index, Value in initialOptions do
                            if type(Value) == "Instance" and Value:IsA("Player") then
                                Dropdown:Add(Value.Name)
                            elseif type(Value) == "string" then
                                Dropdown:Add(Value)
                            else
                                Dropdown:Add(tostring(Value))
                            end
                        end
                    end
                end)
            elseif type(Dropdown.Options) == "table" then
                for Index, Value in Dropdown.Options do
                    if type(Value) == "Instance" and Value:IsA("Player") then
                        Dropdown:Add(Value.Name)
                    else
                        Dropdown:Add(tostring(Value))
                    end
                end
            elseif type(Dropdown.Options) == "Instance" and Dropdown.Options:IsA("DataModel") then
                for Index, Value in Dropdown.Options:GetChildren() do
                    if Value:IsA("Player") then Dropdown:Add(Value.Name) end
                end
            elseif type(Dropdown.Options) == "Instance" and Dropdown.Options.ClassName == "Players" then
                for Index, Value in Dropdown.Options:GetChildren() do
                    if Value:IsA("Player") then Dropdown:Add(Value.Name) end
                end
            end

            if Dropdown.Default then
                Dropdown:Set(Dropdown.Default)
            elseif Dropdown.Multi then
                Dropdown:UpdateMultiSelectAllState()
            end

            Library:RegisterDefaultFlag(Dropdown.Flag, Dropdown.Default)
            Library.SetFlags[Dropdown.Flag] = function(Value) Dropdown:Set(Value) end
            return Dropdown
        end

        Library.Sections.AddLabel = function(self, Name)
            local Label = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Name or "Label"
            }
            local Items = {}

            do
                Items["Label"] = Instances:Create("Frame", {
                    Parent = Label.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 18),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Label"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Label.Name,
                    BackgroundTransparency = 1,
                    Size = UDim2New(0, 0, 0, 20),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["SubElements"] = Instances:Create("Frame", {
                    Parent = Items["Label"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(1, 0),
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, 0, 0, 0),
                    Size = UDim2New(0, 0, 1, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SubElements"].Instance,
                    Name = "\0",
                    VerticalAlignment = Enum.VerticalAlignment.Center,
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalAlignment = Enum.HorizontalAlignment.Right,
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })
            end

            Library.Elements[Label.Name] = Label

            function Label:SetVisibility(Bool) Items["Label"].Instance.Visible = Bool end
            function Label:Set(Text) Text = tostring(Text) Items["Text"].Instance.Text = Text end

            function Label:AddColorpicker(Data)
                Data = Data or {}
                local Colorpicker = {
                    Window = self.Window,
                    Page = self.Page,
                    Section = self.Section,
                    Flag = Data.Flag or Data.flag or nil,
                    Default = Data.Default or Data.default or Color3.fromRGB(255, 255, 255),
                    Callback = Data.Callback or Data.callback or function() end,
                    Premium = Data.Premium or Data.premium or false
                }
                if not Colorpicker.Flag then Colorpicker.Flag = Label.Name end
                local NewColorpicker, ColorpickerItems = Library:CreateColorpicker({
                    Name = Colorpicker.Name,
                    Parent = Items["SubElements"],
                    Default = Colorpicker.Default,
                    Premium = Colorpicker.Premium,
                    Flag = Colorpicker.Flag,
                    Callback = Colorpicker.Callback
                })
                return NewColorpicker
            end

            function Label:AddKeybind(Data)
                Data = Data or {}
                local Keybind = {
                    Window = self.Window,
                    Page = self.Page,
                    Section = self.Section,
                    Flag = Data.Flag or Data.flag or nil,
                    Default = Data.Default or Data.default or nil,
                    Mode = Data.Mode or Data.mode or "Toggle",
                    Premium = Data.Premium or Data.premium or false,
                    Callback = Data.Callback or Data.callback or function() end
                }
                if not Keybind.Flag then Keybind.Flag = Label.Name end
                local NewKeybind, KeybindItems = Library:CreateKeybind({
                    Name = Keybind.Name,
                    Parent = Items["SubElements"],
                    Flag = Keybind.Flag,
                    Premium = Keybind.Premium,
                    Default = Keybind.Default,
                    Mode = Keybind.Mode,
                    Callback = Keybind.Callback
                })
                return NewKeybind
            end

            local PageSearchData = Library.SearchItems[Label.Page]
            if PageSearchData then
                local SearchData = { Name = Label.Name, Item = Items["Label"], Section = Label.Section }
                TableInsert(PageSearchData, SearchData)
            end

            return Label
        end

        Library.Sections.AddTextbox = function(self, Data)
            Data = Data or {}
            local Textbox = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Data.Name or Data.name or "Textbox",
                Flag = Data.Flag or Data.flag or nil,
                Default = Data.Default or Data.default or "",
                Callback = Data.Callback or Data.callback or function() end,
                Premium = Data.Premium or Data.premium or false,
                Numeric = Data.Numeric or Data.numeric or false,
                Finished = Data.Finished or Data.finished or false,
                Placeholder = Data.Placeholder or Data.placeholder or "Enter text",
                Value = ""
            }

            if not Textbox.Flag then Textbox.Flag = Textbox.Name end

            local Items = {}

            do
                Items["Textbox"] = Instances:Create("Frame", {
                    Parent = Textbox.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 48),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Textbox"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Textbox.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 1,
                    BorderSizePixel = 0,
                    RichText = true,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["Background"] = Instances:Create("Frame", {
                    Parent = Items["Textbox"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(0, 1),
                    Position = UDim2New(0, 0, 1, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 25),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["Background"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["Background"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })

                Instances:Create("UIGradient", {
                    Parent = Items["Background"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Inline"] = Instances:Create("TextBox", {
                    Parent = Items["Background"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    Size = UDim2New(1, -16, 1, 0),
                    Position = UDim2New(0, 8, 0, 0),
                    BorderSizePixel = 0,
                    ClearTextOnFocus = false,
                    BackgroundTransparency = 1,
                    PlaceholderColor3 = FromRGB(185, 185, 185),
                    TextXAlignment = Enum.TextXAlignment.Left,
                    PlaceholderText = Textbox.Placeholder,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Inline"]:AddToTheme({ TextColor3 = "Text" })

                Items["Textbox"]:OnHover(function()
                    Items["Background"]:ChangeItemTheme({ BackgroundColor3 = "Hovered Element" })
                    Items["Background"]:Tween(nil, { BackgroundColor3 = Library.Theme["Hovered Element"] })
                end)

                Items["Textbox"]:OnHoverLeave(function()
                    Items["Background"]:ChangeItemTheme({ BackgroundColor3 = "Element" })
                    Items["Background"]:Tween(nil, { BackgroundColor3 = Library.Theme["Element"] })
                end)
            end

            Library.Elements[Textbox.Flag] = Textbox

            function Textbox:Get() return self.Value end

            function Textbox:Set(Value)
                if Textbox.Numeric then
                    if (not tonumber(Value)) and StringLen(tostring(Value)) > 0 then
                        Value = Textbox.Value
                    end
                end
                Items["Inline"].Instance.Text = Value
                self.Value = Value
                Library.Flags[Textbox.Flag] = Value
                Library:QueueAutoSave()
                if Textbox.Callback then Library:SafeCall(Textbox.Callback, Value) end
            end

            function Textbox:SetVisibility(Bool) Items["Textbox"].Instance.Visible = Bool end

            local PageSearchData = Library.SearchItems[Textbox.Page]
            if PageSearchData then
                local SearchData = { Name = Textbox.Name, Item = Items["Textbox"], Section = Textbox.Section }
                TableInsert(PageSearchData, SearchData)
            end

            if not Textbox.Finished then
                Items["Inline"].Instance:GetPropertyChangedSignal("Text"):Connect(function()
                    if Textbox.Premium then
                        Textbox:Set("")
                        return
                    end
                    Textbox:Set(Items["Inline"].Instance.Text)
                end)
            else
                Items["Inline"]:Connect("FocusLost", function(PressedEnterQuestionMark)
                    if PressedEnterQuestionMark then
                        if Textbox.Premium then
                            Textbox:Set("")
                            return
                        end
                        Textbox:Set(Items["Inline"].Instance.Text)
                    end
                end)
            end

            if Textbox.Default then Textbox:Set(Textbox.Default) end
            Library:RegisterDefaultFlag(Textbox.Flag, Textbox.Default)
            Library.SetFlags[Textbox.Flag] = function(Value) Textbox:Set(Value) end
            return Textbox
        end

        Library.Sections.AddColorpicker = function(self, Data)
            Data = Data or {}
            local Colorpicker = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Data.Name or Data.name or "Colorpicker",
                Flag = Data.Flag or Data.flag or nil,
                Default = Data.Default or Data.default or FromRGB(255, 255, 255),
                Callback = Data.Callback or Data.callback or function() end,
                Premium = Data.Premium or Data.premium or false
            }

            if not Colorpicker.Flag then Colorpicker.Flag = Colorpicker.Name end

            local Items = {}

            do
                Items["Label"] = Instances:Create("Frame", {
                    Parent = Colorpicker.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 18),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Label"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Colorpicker.Name,
                    BackgroundTransparency = 1,
                    Size = UDim2New(0, 0, 0, 20),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["SubElements"] = Instances:Create("Frame", {
                    Parent = Items["Label"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(1, 0),
                    BackgroundTransparency = 1,
                    Position = UDim2New(1, 0, 0, 0),
                    Size = UDim2New(0, 0, 1, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SubElements"].Instance,
                    Name = "\0",
                    VerticalAlignment = Enum.VerticalAlignment.Center,
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalAlignment = Enum.HorizontalAlignment.Right,
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })
            end

            Library.Elements[Colorpicker.Flag] = Colorpicker

            function Colorpicker:SetVisibility(Bool) Items["Label"].Instance.Visible = Bool end

            local NewColorpicker, ColorpickerItems = Library:CreateColorpicker({
                Name = Colorpicker.Name,
                Premium = Colorpicker.Premium,
                Parent = Items["SubElements"],
                Default = Colorpicker.Default,
                Flag = Colorpicker.Flag,
                Callback = Colorpicker.Callback
            })

            local PageSearchData = Library.SearchItems[Colorpicker.Page]
            if PageSearchData then
                local SearchData = { Name = Colorpicker.Name, Item = Items["Label"], Section = Colorpicker.Section }
                TableInsert(PageSearchData, SearchData)
            end

            return NewColorpicker
        end

        Library.Sections.AddToggleColorPicker = function(self, Data)
            Data = Data or {}
            local Colorpicker = {
                Name = Data.Name or Data.name or "Colorpicker",
                Flag = Data.Flag or Data.flag or nil,
                Default = Data.Default or Data.default or FromRGB(255, 255, 255),
                Tooltip = Data.ToolTip or Data.tooltip or nil,
                ColorpickerDefault = Data.ColorPickerDefault or Data.colorPickerdefault or FromRGB(255, 255, 255),
                Premium = Data.Premium or Data.premium or false,
                Callback = Data.Callback or Data.callback or function() end
            }

            if not Colorpicker.Flag then Colorpicker.Flag = Colorpicker.Name end

            local Toggle = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Flag = Colorpicker.Flag .. "Toggle",
                Value = false
            }

            local IsHovered = false
            local UpdateToggleVisuals
            local Items = {}

            do
                Items["Toggle"] = Instances:Create("TextButton", {
                    Parent = Toggle.Section.Items["Content"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(0, 0, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = "",
                    AutoButtonColor = false,
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 18),
                    BorderSizePixel = 0,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Toggle"]:Tooltip(Colorpicker.Tooltip)

                Items["Indicator"] = Instances:Create("Frame", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    AnchorPoint = Library.ToggleSide == "Right" and Vector2New(1, 0.5) or Vector2New(0, 0.5),
                    Position = Library.ToggleSide == "Right" and UDim2New(1, 0, 0.5, 0) or UDim2New(0, 0, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 32, 0, 18),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["Indicator"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UICorner", { Parent = Items["Indicator"].Instance, Name = "\0", CornerRadius = UDimNew(0, 6) })
                Instances:Create("UIStroke", { Parent = Items["Indicator"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })

                Instances:Create("UIGradient", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    Rotation = 90,
                    Color = RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, FromRGB(218, 218, 218)) }
                }):AddToTheme({ Color = function() return RGBSequence{ RGBSequenceKeypoint(0, FromRGB(255, 255, 255)), RGBSequenceKeypoint(1, Library.Theme["Gradient"]) } end })

                Items["Check"] = Instances:Create("ImageLabel", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    ImageColor3 = FromRGB(0, 0, 0),
                    ScaleType = Enum.ScaleType.Fit,
                    ImageTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Image = "rbxassetid://116048588333795",
                    BackgroundTransparency = 1,
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    Size = UDim2New(0, 0, 0, 0),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Knob"] = Instances:Create("Frame", {
                    Parent = Items["Indicator"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(0, 0.5),
                    Position = UDim2New(0, 3, 0.5, 0),
                    Size = UDim2New(0, 12, 0, 12),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Knob"]:AddToTheme({ BackgroundColor3 = "Text" })
                Instances:Create("UICorner", { Parent = Items["Knob"].Instance, Name = "\0", CornerRadius = UDimNew(1, 0) })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Colorpicker.Name,
                    Size = UDim2New(0, 0, 0, 15),
                    AnchorPoint = Vector2New(0, 0.5),
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    Position = Library.ToggleSide == "Right" and UDim2New(0, 0, 0.5, 0) or UDim2New(0, 40, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ BackgroundColor3 = "Text" })

                Items["SubElements"] = Instances:Create("Frame", {
                    Parent = Items["Toggle"].Instance,
                    Name = "\0",
                    BorderColor3 = FromRGB(0, 0, 0),
                    AnchorPoint = Vector2New(1, 0),
                    BackgroundTransparency = 1,
                    Position = Library.ToggleSide == "Right" and UDim2New(1, -38, 0, 0) or UDim2New(1, 0, 0, 0),
                    Size = UDim2New(0, 0, 1, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Instances:Create("UIListLayout", {
                    Parent = Items["SubElements"].Instance,
                    Name = "\0",
                    VerticalAlignment = Enum.VerticalAlignment.Center,
                    FillDirection = Enum.FillDirection.Horizontal,
                    HorizontalAlignment = Enum.HorizontalAlignment.Right,
                    Padding = UDimNew(0, 6),
                    SortOrder = Enum.SortOrder.LayoutOrder
                })

                UpdateToggleVisuals = function()
                    local IsCheckbox = Library.ToggleStyle == "Checkbox"
                    local IsRight = Library.ToggleSide == "Right"
                    local IndicatorWidth = IsCheckbox and 18 or 32
                    local IndicatorTheme = Toggle.Value and "Accent" or (IsHovered and "Hovered Element" or "Element")

                    Items["Indicator"].Instance.AnchorPoint = IsRight and Vector2New(1, 0.5) or Vector2New(0, 0.5)
                    Items["Indicator"].Instance.Position = IsRight and UDim2New(1, 0, 0.5, 0) or UDim2New(0, 0, 0.5, 0)
                    Items["Indicator"].Instance.Size = UDim2New(0, IndicatorWidth, 0, 18)
                    Items["Text"].Instance.Position = IsRight and UDim2New(0, 0, 0.5, 0) or (IsCheckbox and UDim2New(0, 26, 0.5, 0) or UDim2New(0, 40, 0.5, 0))
                    Items["SubElements"].Instance.Position = IsRight and UDim2New(1, -(IndicatorWidth + 6), 0, 0) or UDim2New(1, 0, 0, 0)

                    Items["Indicator"]:ChangeItemTheme({ BackgroundColor3 = IndicatorTheme })
                    Items["Indicator"]:Tween(nil, { BackgroundColor3 = Library.Theme[IndicatorTheme] })
                    Items["Text"]:Tween(nil, { TextTransparency = Toggle.Value and 0 or (IsHovered and 0.15 or 0.4) })

                    if IsCheckbox then
                        Items["Knob"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Position = UDim2New(0, 3, 0.5, 0), Size = UDim2New(0, 0, 0, 0) })
                        Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = Toggle.Value and 0 or 1, Size = Toggle.Value and UDim2New(0, 8, 0, 8) or UDim2New(0, 0, 0, 0) })
                    else
                        Items["Check"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Back, Enum.EasingDirection.Out), { ImageTransparency = 1, Size = UDim2New(0, 0, 0, 0) })
                        Items["Knob"]:Tween(TweenInfo.new(Library.Tween.Time, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), { Position = Toggle.Value and UDim2New(0, 17, 0.5, 0) or UDim2New(0, 3, 0.5, 0), Size = UDim2New(0, 12, 0, 12) })
                    end
                end

                Items["Toggle"]:OnHover(function() IsHovered = true UpdateToggleVisuals() end)
                Items["Toggle"]:OnHoverLeave(function() IsHovered = false UpdateToggleVisuals() end)

                Items["Toggle"]:Connect("MouseButton1Down", function()
                    if Library.ToggleStyle ~= "Checkbox" then
                        Items["Knob"]:Tween(TweenInfo.new(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { Size = UDim2New(0, 14, 0, 14) })
                    end
                end)

                Library:RegisterToggleStyleCallback(function() UpdateToggleVisuals() end)
            end

            Library.Elements[Toggle.Flag] = Toggle

            local NewColorpicker, ColorpickerItems = Library:CreateColorpicker({
                Name = Colorpicker.Name,
                Parent = Items["SubElements"],
                Default = Colorpicker.ColorpickerDefault,
                Flag = Colorpicker.Flag .. "Colorpicker",
                Callback = Colorpicker.Callback,
                Premium = Colorpicker.Premium,
                IsTogglePicker = Toggle
            })

            function Toggle:Get() return self.Value end
            function Toggle:SetVisibility(Bool) Items["Toggle"].Instance.Visible = Bool end

            function Toggle:Set(Bool)
                self.Value = Bool
                Library.Flags[self.Flag] = self.Value
                Library:QueueAutoSave()
                UpdateToggleVisuals()
                if Colorpicker.Callback then Library:SafeCall(Colorpicker.Callback, NewColorpicker.Color, Toggle.Value) end
            end

            local PageSearchData = Library.SearchItems[Toggle.Page]
            if PageSearchData then
                local SearchData = { Name = Colorpicker.Name, Item = Items["Toggle"], Section = Toggle.Section }
                TableInsert(PageSearchData, SearchData)
            end

            Items["Toggle"]:Connect("MouseButton1Click", function()
                if Colorpicker.Premium then return end
                Toggle:Set(not Toggle.Value)
            end)

            Toggle:Set(Toggle.Default)
            Library:RegisterDefaultFlag(Toggle.Flag, Library.Flags[Toggle.Flag])
            Library.SetFlags[Toggle.Flag] = function(Value) Toggle:Set(Value) end

            return NewColorpicker, Toggle
        end

        Library.Sections.AddDivider = function(self, Name)
            local Divider = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Name or "Divider"
            }
            local Items = {}

            do
                Items["Divider"] = Instances:Create("Frame", {
                    Parent = Divider.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 15),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["RealDivider"] = Instances:Create("Frame", {
                    Parent = Items["Divider"].Instance,
                    Name = "\0",
                    AnchorPoint = Vector2New(0, 0.5),
                    Position = UDim2New(0, 0, 0.5, 0),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(1, 0, 0, 3),
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(41, 40, 49)
                })
                Items["RealDivider"]:AddToTheme({ BackgroundColor3 = "Element" })
                Instances:Create("UIStroke", { Parent = Items["RealDivider"].Instance, Name = "\0", Color = FromRGB(36, 33, 42), ApplyStrokeMode = Enum.ApplyStrokeMode.Border }):AddToTheme({ Color = "Border" })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["RealDivider"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Divider.Name,
                    AnchorPoint = Vector2New(0.5, 0.5),
                    Size = UDim2New(0, 0, 0, 15),
                    BackgroundTransparency = 0,
                    Position = UDim2New(0.5, 0, 0.5, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text", BackgroundColor3 = "Inline" })
                Instances:Create("UIPadding", { Parent = Items["Text"].Instance, Name = "\0", PaddingRight = UDimNew(0, 7), PaddingLeft = UDimNew(0, 7) })
            end

            function Divider:Set(Text) Text = tostring(Text) Items["Text"].Instance.Text = Text end
            function Divider:SetVisibility(Bool) Items["Divider"].Instance.Visible = Bool end

            local PageSearchData = Library.SearchItems[Divider.Page]
            if PageSearchData then
                local SearchData = { Name = Divider.Name, Item = Items["Divider"], Section = Divider.Section }
                TableInsert(PageSearchData, SearchData)
            end

            return Divider
        end

        Library.Sections.AddParagraph = function(self, Name, Description)
            local Paragraph = {
                Window = self.Window,
                Page = self.Page,
                Section = self,
                Name = Name or "Paragraph",
                Description = Description or "Content"
            }
            local Items = {}

            do
                Items["Paragraph"] = Instances:Create("Frame", {
                    Parent = Paragraph.Section.Items["Content"].Instance,
                    Name = "\0",
                    BackgroundTransparency = 1,
                    Size = UDim2New(1, 0, 0, 25),
                    BorderColor3 = FromRGB(0, 0, 0),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.Y,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })

                Items["Text"] = Instances:Create("TextLabel", {
                    Parent = Items["Paragraph"].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = Paragraph.Name,
                    BackgroundTransparency = 1,
                    Size = UDim2New(0, 0, 0, 15),
                    BorderSizePixel = 0,
                    AutomaticSize = Enum.AutomaticSize.X,
                    TextSize = 14,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Text"]:AddToTheme({ TextColor3 = "Text" })

                Items["Description"] = Instances:Create("TextLabel", {
                    Parent = Items["Paragraph"].Instance,
                    Name = "\0",
                    FontFace = Library.Subfont,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.4000000059604645,
                    Text = Paragraph.Description,
                    Size = UDim2New(1, -8, 0, 15),
                    Position = UDim2New(0, 0, 0, 22),
                    TextWrapped = true,
                    BorderSizePixel = 0,
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderColor3 = FromRGB(0, 0, 0),
                    AutomaticSize = Enum.AutomaticSize.Y,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                })
                Items["Description"]:AddToTheme({ TextColor3 = "Text" })
            end

            function Paragraph:Set(Text) Text = tostring(Text) Items["Text"].Instance.Text = Text end
            function Paragraph:SetDescription(Text) Text = tostring(Text) Items["Description"].Instance.Text = Text end
            function Paragraph:SetVisibility(Bool) Items["Paragraph"].Instance.Visible = Bool end

            local PageSearchData = Library.SearchItems[Paragraph.Page]
            if PageSearchData then
                local SearchData = { Name = Paragraph.Name, Item = Items["Paragraph"], Section = Paragraph.Section }
                TableInsert(PageSearchData, SearchData)
            end

            return Paragraph
        end
    end

    Library.CreateThemingSection = function(self, Tab)
        local ThemesSection = Tab:AddSection({ Name = "Themes", Side = 1, Description = "make your very own ui colors" })
        for Index, Value in Library.Theme do
            ThemesSection:AddLabel(Index):AddColorpicker({
                Name = Index,
                Flag = Index .. "Theme",
                Default = Value,
                Callback = function(Value)
                    Library.Theme[Index] = Value
                    Library:ChangeTheme(Index, Value)
                end
            })
        end
    end

    Library.CreateConfigsSection = function(self, Tab)
        local ConfigsSection = Tab:AddSection({ Name = "Profiles", Description = "save and load configs", Side = 2 })
        local ConfigName
        local ConfigSelected
        local AutoloadEnabled = false
        local ClipboardSetter = setclipboard or toclipboard

        local function GetConfigPath(Name)
            return Library.Folders.Configs .. "/" .. Name .. ".json"
        end

        local ConfigsDropdown = ConfigsSection:AddDropdown({
            Name = "Configs",
            Flag = "ConfigsList",
            Options = {},
            Multi = false,
            Callback = function(Value)
                ConfigSelected = Value
                local autoToggle = Library.Elements and Library.Elements["ConfigAutoload"]
                if autoToggle and autoToggle.Set then
                    local enabled = Library:IsAutoloadEnabled(ConfigSelected)
                    autoToggle:Set(enabled)
                end
            end
        })

        ConfigsSection:AddTextbox({
            Name = "Config name",
            Default = "",
            Flag = "ConfigName",
            Placeholder = "Enter text",
            Callback = function(Value) ConfigName = Value end
        })

        ConfigsSection:AddToggle({
            Name = "Autoload Selected Config",
            Flag = "ConfigAutoload",
            Default = false,
            Callback = function(Value)
                AutoloadEnabled = Value
                if ConfigSelected then Library:SetAutoload(ConfigSelected, Value) end
            end
        })

        ConfigsSection:AddButton({
            Name = "Create",
            Callback = function()
                if ConfigName ~= "" then
                    local ConfigPath = GetConfigPath(ConfigName)
                    if isfile(ConfigPath) then
                        Library:MakeNotification({ Name = "Error", Content = "Config with the name " .. ConfigName .. " already exists", Time = 3 })
                    else
                        local success, err = pcall(function()
                            writefile(ConfigPath, Library:GetConfig())
                            Library:SetAutoload(ConfigName, AutoloadEnabled)
                            Library:RefreshConfigsList(ConfigsDropdown)
                            Library:MakeNotification({ Name = "Success!", Content = "Created config " .. ConfigName .. " successfully", Time = 3 })
                        end)
                    end
                end
            end
        })

        ConfigsSection:AddButton({
            Name = "Delete",
            Callback = function()
                if ConfigSelected then
                    local ConfigPath = GetConfigPath(ConfigSelected)
                    if isfile(ConfigPath) then
                        delfile(ConfigPath)
                        Library:SetAutoload(ConfigSelected, false)
                        ConfigsDropdown:Remove(ConfigSelected)
                        ConfigsDropdown:SetText("--")
                        Library:MakeNotification({ Name = "Success!", Content = "Deleted config " .. ConfigSelected .. " successfully", Time = 3 })
                    else
                        Library:MakeNotification({ Name = "Error!", Content = "Config " .. ConfigSelected .. " does not exist", Time = 3 })
                    end
                end
            end
        })

        ConfigsSection:AddButton({
            Name = "Load",
            Callback = function()
                if ConfigSelected then
                    local Success, Message = Library:LoadConfig(readfile(GetConfigPath(ConfigSelected)))
                    if not Success then
                        Library:MakeNotification({ Name = "Error!", Content = "Failed to load configs, report this to the developers:\n" .. Message, Time = 10 })
                    else
                        Library:MakeNotification({ Name = "Success!", Content = Message and ("Loaded config " .. ConfigSelected .. " with warnings\n" .. Message) or ("Loaded config " .. ConfigSelected .. " successfully"), Time = 3 })
                    end
                end
            end
        })

        ConfigsSection:AddButton({
            Name = "Save",
            Callback = function()
                if ConfigSelected then
                    local ConfigPath = GetConfigPath(ConfigSelected)
                    if not isfile(ConfigPath) then return end
                    writefile(ConfigPath, Library:GetConfig())
                    Library:SetAutoload(ConfigSelected, AutoloadEnabled)
                    Library:MakeNotification({ Name = "Success!", Content = "Saved config " .. ConfigSelected .. " successfully", Time = 3 })
                end
            end
        })

        ConfigsSection:AddButton({
            Name = "Refresh",
            Callback = function()
                Library:RefreshConfigsList(ConfigsDropdown)
                Library:MakeNotification({ Name = "Refreshed", Content = "Configs list has been refreshed", Time = 3 })
            end
        })

        local AutoSaveToggleReady = false
        ConfigsSection:AddToggle({
            Name = "Auto Save Config",
            ToolTip = "Automatically saves your config every time you make a change, and loads it when you execute the script.",
            Flag = "AutoSaveConfig",
            Default = Library:IsAutoSaveEnabled(),
            Callback = function(Value)
                Library:SetAutoSaveEnabled(Value)
                if not AutoSaveToggleReady then return end
                if Value then pcall(function() Library:WriteAutoSaveConfig() end) end
                Library:MakeNotification({ Name = "Config", Content = Value and "Auto save enabled" or "Auto save disabled", Time = 3 })
            end
        })
        AutoSaveToggleReady = true

        ConfigsSection:AddDivider("Sharing configs")
        local SharedConfigTextbox = ConfigsSection:AddTextbox({
            Name = "Paste Shared Config",
            Default = "",
            Flag = "SharedConfigText",
            Placeholder = "Paste config here..."
        })

        ConfigsSection:AddButton({
            Name = "Share Current",
            ToolTip = "Copies the current config to clipboard.",
            Callback = function()
                local CurrentConfig = Library:GetConfig()
                if type(CurrentConfig) ~= "string" or CurrentConfig == "" then
                    Library:MakeNotification({ Name = "Error!", Content = "Failed to build the current config", Time = 3 })
                    return
                end
                SharedConfigTextbox:Set(CurrentConfig)
                local Copied = false
                if type(ClipboardSetter) == "function" then Copied = pcall(ClipboardSetter, CurrentConfig) end
                Library:MakeNotification({ Name = "Success!", Content = Copied and "Current config copied to clipboard" or "Current config added to the textbox", Time = 3 })
            end
        })

        ConfigsSection:AddButton({
            Name = "Import Pasted",
            ToolTip = "Imports the config you have in the textbox.",
            Callback = function()
                local PastedConfig = SharedConfigTextbox:Get()
                if type(PastedConfig) ~= "string" or PastedConfig == "" then
                    Library:MakeNotification({ Name = "Error!", Content = "Paste a shared config first", Time = 3 })
                    return
                end
                local Success, Message = Library:LoadConfig(PastedConfig)
                if not Success then
                    Library:MakeNotification({ Name = "Error!", Content = "Failed to import shared config:\n" .. tostring(Message), Time = 5 })
                    return
                end
                SharedConfigTextbox:Set(PastedConfig)
                Library:MakeNotification({ Name = "Success!", Content = Message and ("Imported shared config with warnings\n" .. Message) or "Imported shared config successfully", Time = 10 })
            end
        })

        Library:RefreshConfigsList(ConfigsDropdown)

        Library._PendingAutoload = function()
            task.wait(2.5)
            local AutoSaveLoaded = false

            if Library:IsAutoSaveEnabled() then
                local Success, Message = Library:LoadAutoSaveConfig()
                if Success then
                    AutoSaveLoaded = true
                    Library:MakeNotification({ Name = "Config Loaded", Content = Message and ("Loaded your last saved config with warnings\n" .. Message) or "Loaded your last saved config", Time = 3 })
                elseif Message then
                    Library:MakeNotification({ Name = "Config Loaded", Content = "Failed to load your last saved config: " .. tostring(Message), Time = 5 })
                end
            end

            if not AutoSaveLoaded then
                local AutoloadName = Library:GetAutoloadConfig()
                task.wait(2.5)
                if AutoloadName then
                    local FilePath = GetConfigPath(AutoloadName)
                    if isfile(FilePath) then
                        local Success, Message = Library:LoadConfig(readfile(FilePath))
                        if Success then
                            pcall(function()
                                ConfigsDropdown:Set(AutoloadName)
                                local autoToggle = Library.Elements and Library.Elements["ConfigAutoload"]
                                if autoToggle and autoToggle.Set then autoToggle:Set(true) end
                            end)
                            Library:MakeNotification({ Name = "Autoload", Content = Message and ("Loaded config " .. AutoloadName .. " with warnings\n" .. Message) or ("Loaded config " .. AutoloadName .. " automatically"), Time = 3 })
                        else
                            Library:MakeNotification({ Name = "Autoload", Content = "Failed to autoload config " .. AutoloadName .. ": " .. tostring(Message), Time = 5 })
                        end
                    else
                        Library:MakeNotification({ Name = "Autoload", Content = "Autoload config " .. AutoloadName .. " not found!", Time = 5 })
                    end
                end
            end
            Library.AutoSaveReady = true
        end
    end

    Library.CreateSettingsSection = function(self, Tab)
        local SettingsSection = Tab:AddSection({ Name = "Settings", Description = "customize however you want", Side = 1 })

        local function AddExpressSettingToggle(Name, Flag, Key)
            SettingsSection:AddToggle({
                Name = Name,
                Flag = Flag,
                Default = Library.ExpressExtraSettings[Key],
                Callback = function(Value) Library.ExpressExtraSettings[Key] = Value end
            })
        end

        SettingsSection:AddSlider({
            Name = "Animation speed",
            Flag = "AnimationSpeed",
            Min = 0,
            Max = 5,
            Increment = 0.01,
            Default = Library.Tween.Time,
            ValueName = "s",
            Callback = function(Value) Library.Tween.Time = Value end
        })

        SettingsSection:AddDropdown({
            Name = "Animation style",
            Flag = "AnimationStyle",
            Options = { "Linear", "Quad", "Quart", "Back", "Bounce", "Circular", "Cubic", "Elastic", "Exponential", "Sine", "Quint" },
            Default = "Cubic",
            Multi = false,
            Callback = function(Value) Library.Tween.Style = Enum.EasingStyle[Value] end
        })

        SettingsSection:AddDropdown({
            Name = "Animation direction",
            Flag = "AnimationDirection",
            Options = { "In", "Out", "InOut" },
            Default = "Out",
            Multi = false,
            Callback = function(Value) Library.Tween.Direction = Enum.EasingDirection[Value] end
        })

        SettingsSection:AddButton({ Name = "Unload", Callback = function() Library:Unload() end })
        SettingsSection:AddLabel("Menu keybind"):AddKeybind({
            Flag = "MenuKeybind",
            Default = Library.MenuKeybind,
            Mode = "Toggle",
            Callback = function() Library.MenuKeybind = Library.Flags["MenuKeybind"].Key end
        })

        SettingsSection:AddDivider("UI Settings")
        SettingsSection:AddDropdown({
            Name = "Toggle style",
            Flag = "ToggleStyle",
            Options = { "Toggle", "Checkbox" },
            Default = "Toggle",
            Multi = false,
            Callback = function(Value) Library:SetToggleStyle(Value) end
        })

        SettingsSection:AddDropdown({
            Name = "Toggle side",
            Flag = "ToggleSide",
            Options = { "Right", "Left" },
            Default = "Right",
            Multi = false,
            Callback = function(Value) Library:SetToggleSide(Value) end
        })

        SettingsSection:AddToggle({
            Name = "Snowing",
            Flag = "Snowing",
            Default = false,
            Callback = function(Value)
                Library.Snowing = Value
                Library.WindowItem:UpdateSnowState()
            end
        })

        SettingsSection:AddToggle({
            Name = "Hide Tooltips",
            Flag = "HideTooltips",
            ToolTip = "Example tooltip text",
            Default = false,
            Callback = function(Value) Library.HideTooltips = Value end
        })

        SettingsSection:AddToggle({
            Name = "Streamer Mode",
            Flag = "StreamerMode",
            ToolTip = "Hides your username & profile at the bottom left of the script with anonymous",
            Default = false,
            Callback = function(Value) Library.WindowItem:SetStreamerMode(Value) end
        })

        AddExpressSettingToggle("Show Button", "ShowButton", "ShowButton")
        AddExpressSettingToggle("Show FPS", "ShowFPS", "ShowFPS")
        AddExpressSettingToggle("Show Ping", "ShowPing", "ShowPing")
    end

    Library.CreateHomeTab = function(self, Window, DiscordLink)
        if Window and Window.HomeTab and table.find(Window.Pages, Window.HomeTab) then
            return Window.HomeTab
        end

        if Window and Window.Pages then
            for _, ExistingPage in ipairs(Window.Pages) do
                if ExistingPage and ExistingPage.Name == "Home" then
                    Window.HomeTab = ExistingPage
                    return ExistingPage
                end
            end
        end

        local HomeTab = Window:MakeTab({ Name = "Home", Icon = "rbxassetid://10723407389" })
        Window.HomeTab = HomeTab

        local function AddHomeCorner(Parent, Radius)
            Instances:Create("UICorner", { Parent = Parent, Name = "\0", CornerRadius = UDimNew(0, Radius or 12) })
        end

        HomeTab.Items["Inactive"].Instance.LayoutOrder = -1
        local _pages = Window.Pages
        if _pages[#_pages] == HomeTab then
            table.remove(_pages, #_pages)
            table.insert(_pages, 1, HomeTab)
        end

        for _, _page in ipairs(Window.Pages) do
            if _page ~= HomeTab and _page.Active then _page:Turn(false) end
        end
        if not HomeTab.Active then HomeTab:Turn(true) end

        local Items = {}

        do
            Items["HomeScroll"] = Instances:Create("ScrollingFrame", {
                Parent = HomeTab.Items["Page"].Instance,
                Name = "\0",
                Position = UDim2New(0, 0, 0, 4),
                Size = UDim2New(1, -8, 1, -24),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                CanvasSize = UDim2New(0, 0, 0, 0),
                AutomaticCanvasSize = Enum.AutomaticSize.Y,
                ScrollBarThickness = 2,
                TopImage = "rbxassetid://105444659140695",
                MidImage = "rbxassetid://105444659140695",
                BottomImage = "rbxassetid://105444659140695",
                ScrollBarImageColor3 = Library.Theme.Accent,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["HomeScroll"]:AddToTheme({ ScrollBarImageColor3 = "Accent" })

            local function CreateHomePanel(key, properties, theme, radius)
                Items[key] = Instances:Create("Frame", properties)
                if theme then Items[key]:AddToTheme(theme) end
                AddHomeCorner(Items[key].Instance, radius)
                return Items[key]
            end

            CreateHomePanel("SessionInfo", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                Position = UDim2New(0, 12, 0, 24),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -24, 0, 160),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            }, { BackgroundColor3 = "Inline" })

            Items["SessionInfoTitle"] = Instances:Create("TextLabel", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "SESSION INFORMATION",
                Size = UDim2New(1, -16, 0, 15),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                Position = UDim2New(0, 12, 0, 4),
                BorderSizePixel = 0,
                TextTransparency = 0.35,
                TextSize = 12,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["SessionInfoTitle"]:AddToTheme({ TextColor3 = "Text" })

            CreateHomePanel("Players", {
                Parent = Items["SessionInfo"].Instance,
                Name = "\0",
                Position = UDim2New(0, 10, 0, 12),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0.44999998807907104, 0, 0.3499999940395355, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(17, 16, 20)
            }, { BackgroundColor3 = "Background" })

            Items["PlayersTitle"] = Instances:Create("TextLabel", {
                Parent = Items["Players"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Players",
                Size = UDim2New(1, -16, 0, 15),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                Position = UDim2New(0, 8, 0, 8),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["PlayersTitle"]:AddToTheme({ TextColor3 = "Text" })

            Items["CurrentPlayers"] = Instances:Create("TextLabel", {
                Parent = Items["Players"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextWrapped = true,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "",
                Size = UDim2New(1, -16, 0, 15),
                Position = UDim2New(0, 8, 0, 28),
                BorderSizePixel = 0,
                BorderColor3 = FromRGB(0, 0, 0),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["CurrentPlayers"]:AddToTheme({ TextColor3 = "Text" })

            local function UpdateCurrentPlayers()
                Items["CurrentPlayers"].Instance.Text = #Players:GetPlayers() .. " players currently online"
            end
            UpdateCurrentPlayers()
            Library:Connect(Players.PlayerAdded, UpdateCurrentPlayers)
            Library:Connect(Players.PlayerRemoving, UpdateCurrentPlayers)

            CreateHomePanel("MaxPlayers", {
                Parent = Items["SessionInfo"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(1, 0),
                Position = UDim2New(1, -18, 0, 12),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0.5, -16, 0.3499999940395355, 0),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(17, 16, 20)
            }, { BackgroundColor3 = "Background" })

            Items["MaxPlayersTitle"] = Instances:Create("TextLabel", {
                Parent = Items["MaxPlayers"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Max players",
                Size = UDim2New(1, -16, 0, 15),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                Position = UDim2New(0, 8, 0, 8),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["MaxPlayersTitle"]:AddToTheme({ TextColor3 = "Text" })

            Items["MaxPlayersAllowed"] = Instances:Create("TextLabel", {
                Parent = Items["MaxPlayers"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextWrapped = true,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4000000059604645,
                Text = "Maximum of " .. Players.MaxPlayers .. " people can join this experience.",
                Size = UDim2New(1, -16, 0, 15),
                Position = UDim2New(0, 8, 0, 28),
                BorderSizePixel = 0,
                BorderColor3 = FromRGB(0, 0, 0),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                AutomaticSize = Enum.AutomaticSize.Y,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["MaxPlayersAllowed"]:AddToTheme({ TextColor3 = "Text" })

            CreateHomePanel("AccountInformation", {
                Parent = Items["SessionInfo"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 1),
                Position = UDim2New(0, 10, 1, -10),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -28, 0.44999998807907104, -20),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(17, 16, 20)
            }, { BackgroundColor3 = "Background" })

            Items["AccountAvatar"] = Instances:Create("ImageLabel", {
                Parent = Items["AccountInformation"].Instance,
                Name = "\0",
                BorderColor3 = FromRGB(0, 0, 0),
                AnchorPoint = Vector2New(0, 0.5),
                Image = Content,
                Position = UDim2New(0, 10, 0.5, 0),
                Size = UDim2New(0, 44, 0, 44),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            })
            Items["AccountAvatar"]:AddToTheme({ BackgroundColor3 = "Inline" })
            AddHomeCorner(Items["AccountAvatar"].Instance, 10)

            Items["AccountDisplayName"] = Instances:Create("TextLabel", {
                Parent = Items["AccountInformation"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                Text = LocalPlayer.DisplayName,
                Size = UDim2New(1, -72, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 64, 0.5, -23),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                BorderSizePixel = 0,
                TextSize = 15,
                TextTruncate = Enum.TextTruncate.AtEnd
            })
            Items["AccountDisplayName"]:AddToTheme({ TextColor3 = "Text" })

            Items["AccountUsername"] = Instances:Create("TextLabel", {
                Parent = Items["AccountInformation"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4,
                Text = "@" .. LocalPlayer.Name,
                Size = UDim2New(1, -72, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 64, 0.5, -4),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                BorderSizePixel = 0,
                TextSize = 13,
                TextTruncate = Enum.TextTruncate.AtEnd
            })
            Items["AccountUsername"]:AddToTheme({ TextColor3 = "Text" })

            Window.Items["AccountAvatar"] = Items["AccountAvatar"]
            Window.Items["AccountDisplayName"] = Items["AccountDisplayName"]
            Window.Items["AccountUsername"] = Items["AccountUsername"]

            if Library.Flags.StreamerMode then Window:SetStreamerMode(true) end

            local joinDate = os.date("%b %d, %Y", os.time() - (LocalPlayer.AccountAge * 86400))
            Items["AccountMeta"] = Instances:Create("TextLabel", {
                Parent = Items["AccountInformation"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.5,
                Text = "Age: " .. LocalPlayer.AccountAge .. " days | Joined: " .. joinDate,
                Size = UDim2New(1, -72, 0, 0),
                AutomaticSize = Enum.AutomaticSize.Y,
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 64, 0.5, 12),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                BorderSizePixel = 0,
                TextSize = 12,
                TextWrapped = true
            })
            Items["AccountMeta"]:AddToTheme({ TextColor3 = "Text" })

            CreateHomePanel("Discord", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                Position = UDim2New(0, 12, 0, 200),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -24, 0, 84),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            }, { BackgroundColor3 = "Inline" })

            Items["DiscordIcon"] = Instances:Create("ImageLabel", {
                Parent = Items["Discord"].Instance,
                Name = "\0",
                ImageColor3 = FromRGB(66, 126, 255),
                ScaleType = Enum.ScaleType.Fit,
                BorderColor3 = FromRGB(0, 0, 0),
                AnchorPoint = Vector2New(0, 0.5),
                Image = "rbxassetid://98752033517234",
                BackgroundTransparency = 1,
                Position = UDim2New(0, 10, 0.5, 0),
                Size = UDim2New(0, 56, 0, 56),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            AddHomeCorner(Items["DiscordIcon"].Instance, 14)

            Items["AreYouNotInOurDiscordYet"] = Instances:Create("TextLabel", {
                Parent = Items["Discord"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Not in our discord server yet?",
                Size = UDim2New(1, -246, 0.5, -2),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                TextYAlignment = Enum.TextYAlignment.Bottom,
                Position = UDim2New(0, 76, 0, 0),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["AreYouNotInOurDiscordYet"]:AddToTheme({ TextColor3 = "Text" })

            Items["JoinDiscord"] = Instances:Create("TextButton", {
                Parent = Items["Discord"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(0, 0, 0),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "",
                AutoButtonColor = false,
                AnchorPoint = Vector2New(1, 0.5),
                Position = UDim2New(1, -12, 0.5, 7),
                Size = UDim2New(0.28, 0, 0, 36),
                BorderSizePixel = 0,
                TextSize = 14,
                BackgroundColor3 = FromRGB(88, 101, 242)
            })

            Items["DiscordDescription"] = Instances:Create("TextLabel", {
                Parent = Items["Discord"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                TextTransparency = 0.4,
                Text = "Join to suggest features, report bugs, and connect with the community!",
                Size = UDim2New(1, -246, 0.5, -10),
                Position = UDim2New(0, 76, 0.5, 4),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                TextYAlignment = Enum.TextYAlignment.Center,
                TextScaled = false,
                TextWrapped = true,
                TextSize = 12,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["DiscordDescription"]:AddToTheme({ TextColor3 = "Text" })

            Items["JoinDiscord"]:Connect("MouseEnter", function()
                Items["JoinDiscord"]:Tween(nil, { BackgroundColor3 = FromRGB(102, 115, 255), Size = UDim2New(0.29, 0, 0, 38) })
            end)
            Items["JoinDiscord"]:Connect("MouseLeave", function()
                Items["JoinDiscord"]:Tween(nil, { BackgroundColor3 = FromRGB(88, 101, 242), Size = UDim2New(0.28, 0, 0, 36) })
            end)
            Items["JoinDiscord"]:Connect("InputBegan", function(Input)
                if Input.UserInputType == Enum.UserInputType.MouseButton1 or Input.UserInputType == Enum.UserInputType.Touch then
                    Items["JoinDiscord"]:Tween(nil, { Size = UDim2New(0.265, 0, 0, 34) })
                    task.wait(0.08)
                    Items["JoinDiscord"]:Tween(nil, { Size = UDim2New(0.28, 0, 0, 36) })
                    if DiscordLink then
                        setclipboard(tostring(DiscordLink))
                        pcall(function() Library:MakeNotification({ Name = "Discord", Content = "Invite copied to clipboard", Time = 3 }) end)
                    end
                end
            end)
            AddHomeCorner(Items["JoinDiscord"].Instance, 10)

            Items["JoinDıscordText"] = Instances:Create("TextLabel", {
                Parent = Items["JoinDiscord"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Join discord",
                AnchorPoint = Vector2New(0.5, 0.5),
                BackgroundTransparency = 1,
                Position = UDim2New(0.5, 0, 0.5, 0),
                Size = UDim2New(1, -10, 1, -6),
                BorderSizePixel = 0,
                TextScaled = false,
                TextSize = 13,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })
            Items["JoinDıscordText"]:AddToTheme({ TextColor3 = "Text" })

            CreateHomePanel("ExecutorInfo", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 0),
                Position = UDim2New(0, 12, 0, 300),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -24, 0, 58),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            }, { BackgroundColor3 = "Inline" })

            local function CreateHomeTextLabel(key, properties, theme)
                Items[key] = Instances:Create("TextLabel", properties)
                if theme then Items[key]:AddToTheme(theme) end
                return Items[key]
            end

            CreateHomeTextLabel("BigExecutorText", {
                Parent = Items["ExecutorInfo"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "Executor: " .. getexecutorname(),
                Size = UDim2New(1, -164, 0, 18),
                AnchorPoint = Vector2New(0, 0),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                TextYAlignment = Enum.TextYAlignment.Top,
                Position = UDim2New(0, 12, 0, 10),
                BorderSizePixel = 0,
                TextSize = 15,
                BackgroundColor3 = FromRGB(255, 255, 255)
            }, { TextColor3 = "Text" })

            local exec = (identifyexecutor and identifyexecutor() or getexecutorname() or ""):lower()
            local unsupported = exec:find("xeno") or exec:find("solara") or exec:find("velocity")
            local supportColor = unsupported and FromRGB(255, 170, 64) or FromRGB(67, 214, 117)

            CreateHomePanel("ExecutorStatusDot", {
                Parent = Items["ExecutorInfo"].Instance,
                Name = "\0",
                AnchorPoint = Vector2New(0, 0.5),
                Position = UDim2New(0, 14, 0, 41),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(0, 8, 0, 8),
                BorderSizePixel = 0,
                BackgroundColor3 = supportColor
            }, nil, 8)

            CreateHomeTextLabel("IsSupportedText", {
                Parent = Items["ExecutorInfo"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = supportColor,
                Text = "Some features may not work properly.",
                Size = UDim2New(1, -178, 0, 14),
                AnchorPoint = Vector2New(0, 0),
                Position = UDim2New(0, 30, 0, 34),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                TextYAlignment = Enum.TextYAlignment.Top,
                BorderSizePixel = 0,
                BorderColor3 = FromRGB(0, 0, 0),
                TextSize = 13,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })

            if unsupported then
                Items["IsSupportedText"].Instance.Text = "Some features may not work properly."
            else
                Items["IsSupportedText"].Instance.Text = "Fully supported executor."
            end

            CreateHomeTextLabel("TrialTimerTitle", {
                Parent = Items["ExecutorInfo"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "TRIAL ENDS IN",
                Size = UDim2New(0, 132, 0, 12),
                AnchorPoint = Vector2New(1, 0),
                Position = UDim2New(1, -12, 0, 10),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Right,
                TextYAlignment = Enum.TextYAlignment.Top,
                BorderSizePixel = 0,
                TextTransparency = 0.35,
                TextSize = 11,
                Visible = false,
                ZIndex = 2,
                BackgroundColor3 = FromRGB(255, 255, 255)
            }, { TextColor3 = "Text" })

            CreateHomeTextLabel("TrialTimerValue", {
                Parent = Items["ExecutorInfo"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = Library.Theme.Accent,
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "0M",
                Size = UDim2New(0, 132, 0, 18),
                AnchorPoint = Vector2New(1, 0),
                Position = UDim2New(1, -12, 0, 28),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Right,
                TextYAlignment = Enum.TextYAlignment.Top,
                BorderSizePixel = 0,
                TextSize = 16,
                Visible = false,
                ZIndex = 2,
                BackgroundColor3 = FromRGB(255, 255, 255)
            }, { TextColor3 = "Accent" })

            CreateHomePanel("PerformanceInfo", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                Position = UDim2New(0, 12, 0, 400),
                BorderColor3 = FromRGB(0, 0, 0),
                Size = UDim2New(1, -24, 0, 74),
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(26, 25, 31)
            }, { BackgroundColor3 = "Inline" })

            CreateHomeTextLabel("PerformanceTitle", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                FontFace = Library.Font,
                TextColor3 = FromRGB(255, 255, 255),
                BorderColor3 = FromRGB(0, 0, 0),
                Text = "PERFORMANCE",
                Size = UDim2New(1, -16, 0, 15),
                BackgroundTransparency = 1,
                TextXAlignment = Enum.TextXAlignment.Left,
                Position = UDim2New(0, 12, 0, 380),
                BorderSizePixel = 0,
                TextTransparency = 0.35,
                TextSize = 12,
                BackgroundColor3 = FromRGB(255, 255, 255)
            }, { TextColor3 = "Text" })

            Items["HomeBottomSpacer"] = Instances:Create("Frame", {
                Parent = Items["HomeScroll"].Instance,
                Name = "\0",
                Position = UDim2New(0, 0, 0, 486),
                Size = UDim2New(1, 0, 0, 1),
                BackgroundTransparency = 1,
                BorderSizePixel = 0,
                BackgroundColor3 = FromRGB(255, 255, 255)
            })

            local function CreatePerformanceCard(cardKey, accentKey, valueKey, descriptionKey, options)
                CreateHomePanel(cardKey, {
                    Parent = Items["PerformanceInfo"].Instance,
                    Name = "\0",
                    AnchorPoint = options.AnchorPoint or Vector2New(0, 0),
                    Position = options.Position,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = options.Size,
                    BorderSizePixel = 0,
                    BackgroundColor3 = FromRGB(17, 16, 20)
                }, { BackgroundColor3 = "Background" })

                Items[accentKey] = Instances:Create("Frame", {
                    Parent = Items[cardKey].Instance,
                    Name = "\0",
                    Position = UDim2New(0, 8, 0, 12),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Size = UDim2New(0, 3, 0, 30),
                    BorderSizePixel = 0,
                    BackgroundColor3 = options.AccentColor
                })
                if options.AccentTheme then Items[accentKey]:AddToTheme({ BackgroundColor3 = options.AccentTheme }) end
                Instances:Create("UICorner", { Parent = Items[accentKey].Instance, Name = "\0", CornerRadius = UDimNew(1, 0) })

                CreateHomeTextLabel(valueKey, {
                    Parent = Items[cardKey].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = options.ValueText,
                    Size = UDim2New(1, -28, 0, 16),
                    Position = UDim2New(0, 20, 0, 10),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderSizePixel = 0,
                    TextSize = 13,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                }, { TextColor3 = "Text" })

                CreateHomeTextLabel(descriptionKey, {
                    Parent = Items[cardKey].Instance,
                    Name = "\0",
                    FontFace = Library.Font,
                    TextColor3 = FromRGB(255, 255, 255),
                    TextTransparency = 0.45,
                    BorderColor3 = FromRGB(0, 0, 0),
                    Text = options.DescriptionText,
                    Size = UDim2New(1, -28, 0, 14),
                    Position = UDim2New(0, 20, 0, 28),
                    BackgroundTransparency = 1,
                    TextXAlignment = Enum.TextXAlignment.Left,
                    BorderSizePixel = 0,
                    TextSize = 12,
                    BackgroundColor3 = FromRGB(255, 255, 255)
                }, { TextColor3 = "Text" })
            end

            CreatePerformanceCard("FPSCard", "FPSAccent", "FPSValue", "FPSDescription", {
                Position = UDim2New(0, 8, 0, 9),
                Size = UDim2New(0.5, -10, 0, 56),
                AccentColor = Library.Theme.Accent,
                AccentTheme = "Accent",
                ValueText = "FPS: 0",
                DescriptionText = "frames per second"
            })

            CreatePerformanceCard("PingCard", "PingAccent", "PingValue", "PingDescription", {
                AnchorPoint = Vector2New(1, 0),
                Position = UDim2New(1, -8, 0, 9),
                Size = UDim2New(0.5, -10, 0, 56),
                AccentColor = FromRGB(88, 113, 255),
                ValueText = "Ping: 0 ms",
                DescriptionText = "network latency"
            })

            local function UpdatePerformanceLayout()
                local ShowFPS = Library.ExpressExtraSettings and Library.ExpressExtraSettings.ShowFPS == true
                local ShowPing = Library.ExpressExtraSettings and Library.ExpressExtraSettings.ShowPing == true
                Items["PerformanceInfo"].Instance.Visible = ShowFPS or ShowPing
                Items["FPSCard"].Instance.Visible = ShowFPS
                Items["PingCard"].Instance.Visible = ShowPing

                if ShowFPS and ShowPing then
                    Items["FPSCard"].Instance.Size = UDim2New(0.5, -10, 0, 56)
                    Items["FPSCard"].Instance.Position = UDim2New(0, 8, 0, 9)
                    Items["PingCard"].Instance.Size = UDim2New(0.5, -10, 0, 56)
                    Items["PingCard"].Instance.Position = UDim2New(1, -8, 0, 9)
                elseif ShowFPS then
                    Items["FPSCard"].Instance.Size = UDim2New(1, -16, 0, 56)
                    Items["FPSCard"].Instance.Position = UDim2New(0, 8, 0, 9)
                elseif ShowPing then
                    Items["PingCard"].Instance.Size = UDim2New(1, -16, 0, 56)
                    Items["PingCard"].Instance.Position = UDim2New(1, -8, 0, 9)
                end
            end

            local function FormatTrialRemaining(remainingMs)
                local totalMs = math.max(0, MathFloor(tonumber(remainingMs) or 0))
                local totalMinutes = MathFloor(totalMs / 60000)
                local days = math.floor(totalMinutes / 1440)
                local hours = math.floor((totalMinutes % 1440) / 60)
                local minutes = totalMinutes % 60
                local seconds = MathFloor((totalMs % 60000) / 1000)
                local parts = {}
                if days > 0 then TableInsert(parts, tostring(days) .. "D") end
                if hours > 0 then TableInsert(parts, tostring(hours) .. "H") end
                if minutes > 0 or #parts > 0 then TableInsert(parts, tostring(minutes) .. "M") end
                if #parts == 0 then TableInsert(parts, tostring(seconds) .. "S") end
                return table.concat(parts, " ")
            end

            local TrialCountdownRemainingMs = 0
            local TrialCountdownSyncedAt = 0
            local TrialCountdownRefreshAt = 0

            local function ResolveTrialRemainingFromSnapshot(remainingMs, syncedAt)
                return math.max(0, (tonumber(remainingMs) or 0) - math.max(0, (tick() - (tonumber(syncedAt) or tick())) * 1000))
            end

            local function ResolveTrialCountdownRemaining()
                local TrialMgr = Library.TrialManager
                if not TrialMgr then return 0 end
                local syncedAt = tonumber(TrialMgr.LastKnownSyncedAt) or 0
                if TrialMgr.CachedTrialActive and tonumber(TrialMgr.CachedRemainingMs) and tonumber(TrialMgr.CachedRemainingMs) > 0 then
                    return ResolveTrialRemainingFromSnapshot(TrialMgr.CachedRemainingMs, syncedAt)
                end
                if TrialMgr.LastKnownTrialActive and tonumber(TrialMgr.LastKnownRemainingMs) and tonumber(TrialMgr.LastKnownRemainingMs) > 0 then
                    return ResolveTrialRemainingFromSnapshot(TrialMgr.LastKnownRemainingMs, syncedAt)
                end
                return 0
            end

            local function SyncTrialCountdown()
                TrialCountdownRemainingMs = ResolveTrialCountdownRemaining()
                TrialCountdownSyncedAt = TrialCountdownRemainingMs > 0 and tick() or 0
                Window.TrialActive = TrialCountdownRemainingMs > 0
                return Window.TrialActive, TrialCountdownRemainingMs
            end

            local function RefreshTrialCountdown()
                if not Library.CheckTrialStatus then
                    Window.TrialActive = false
                    TrialCountdownRemainingMs = 0
                    TrialCountdownSyncedAt = 0
                    TrialCountdownRefreshAt = 0
                    return false, 0
                end

                local TrialMgr = Library.TrialManager
                if TrialMgr then TrialMgr.Cached = false end
                pcall(Library.CheckTrialStatus)
                local cachedActive, cachedRemainingMs = SyncTrialCountdown()
                TrialCountdownRefreshAt = tick()
                return cachedActive, cachedRemainingMs
            end

            local function UpdateTrialCountdownDisplay(forceRefresh)
                local TrialVisible = Window.PremiumRequired == true
                local TrialText = nil

                if not TrialVisible then
                    Window.TrialActive = false
                    Items["TrialTimerTitle"].Instance.Visible = false
                    Items["TrialTimerValue"].Instance.Visible = false
                    return false, nil
                end

                if TrialVisible then
                    if forceRefresh or TrialCountdownRefreshAt <= 0 or (tick() - TrialCountdownRefreshAt) >= 5 then
                        local Active = RefreshTrialCountdown()
                        TrialVisible = Active == true
                    elseif TrialCountdownSyncedAt <= 0 then
                        local Active = SyncTrialCountdown()
                        TrialVisible = Active == true
                    end

                    local RemainingMs = math.max(0, TrialCountdownRemainingMs - math.max(0, (tick() - TrialCountdownSyncedAt) * 1000))
                    if RemainingMs > 0 then
                        TrialText = FormatTrialRemaining(RemainingMs)
                    else
                        TrialVisible = false
                    end
                end

                Items["TrialTimerTitle"].Instance.Visible = TrialVisible
                Items["TrialTimerValue"].Instance.Visible = TrialVisible
                if TrialVisible and TrialText then Items["TrialTimerValue"].Instance.Text = TrialText end
                return TrialVisible, TrialText
            end

            local function UpdateHomeLayout()
                local stacked = Items["SessionInfo"].Instance.AbsoluteSize.X < 560
                if stacked then
                    Items["SessionInfo"].Instance.Size = UDim2New(1, -24, 0, 216)
                    Items["Players"].Instance.Size = UDim2New(1, -20, 0, 48)
                    Items["MaxPlayers"].Instance.AnchorPoint = Vector2New(0, 0)
                    Items["MaxPlayers"].Instance.Position = UDim2New(0, 10, 0, 68)
                    Items["MaxPlayers"].Instance.Size = UDim2New(1, -20, 0, 56)
                    Items["AccountInformation"].Instance.AnchorPoint = Vector2New(0, 0)
                    Items["AccountInformation"].Instance.Position = UDim2New(0, 10, 0, 136)
                    Items["AccountInformation"].Instance.Size = UDim2New(1, -20, 0, 70)
                else
                    Items["SessionInfo"].Instance.Size = UDim2New(1, -24, 0, 160)
                    Items["Players"].Instance.Size = UDim2New(0.44999998807907104, 0, 0.3499999940395355, 0)
                    Items["MaxPlayers"].Instance.AnchorPoint = Vector2New(1, 0)
                    Items["MaxPlayers"].Instance.Position = UDim2New(1, -18, 0, 12)
                    Items["MaxPlayers"].Instance.Size = UDim2New(0.5, -16, 0.3499999940395355, 0)
                    Items["AccountInformation"].Instance.AnchorPoint = Vector2New(0, 1)
                    Items["AccountInformation"].Instance.Position = UDim2New(0, 10, 1, -10)
                    Items["AccountInformation"].Instance.Size = UDim2New(1, -28, 0.44999998807907104, -20)
                end

                local y = 24
                Items["SessionInfo"].Instance.Position = UDim2New(0, 12, 0, y)
                y = y + Items["SessionInfo"].Instance.AbsoluteSize.Y + 16
                Items["Discord"].Instance.Position = UDim2New(0, 12, 0, y)
                y = y + Items["Discord"].Instance.AbsoluteSize.Y + 16
                Items["ExecutorInfo"].Instance.Position = UDim2New(0, 12, 0, y)
                y = y + Items["ExecutorInfo"].Instance.AbsoluteSize.Y + 18
                Items["PerformanceTitle"].Instance.Position = UDim2New(0, 12, 0, y)
                y = y + 20
                Items["PerformanceInfo"].Instance.Position = UDim2New(0, 12, 0, y)
                Items["HomeBottomSpacer"].Instance.Position = UDim2New(0, 0, 0, y + Items["PerformanceInfo"].Instance.AbsoluteSize.Y + 12)
            end

            task.spawn(function()
                local LastFPS, LastPing, LastShowFPS, LastShowPing
                while Library and Items["PerformanceInfo"] and Items["PerformanceInfo"].Instance and Items["PerformanceInfo"].Instance.Parent do
                    local ShowFPS = Library.ExpressExtraSettings and Library.ExpressExtraSettings.ShowFPS == true
                    local ShowPing = Library.ExpressExtraSettings and Library.ExpressExtraSettings.ShowPing == true

                    if LastShowFPS ~= ShowFPS or LastShowPing ~= ShowPing then
                        UpdatePerformanceLayout()
                        LastShowFPS = ShowFPS
                        LastShowPing = ShowPing
                    end

                    if ShowFPS then
                        local FPS = Stats.Workspace.Heartbeat:GetValueString():match("^(%d+)") or "0"
                        local FPSText = "FPS: " .. FPS
                        if FPSText ~= LastFPS then
                            Items["FPSValue"].Instance.Text = FPSText
                            LastFPS = FPSText
                        end
                    end

                    if ShowPing then
                        local PingText = "Ping: " .. MathFloor(Stats.Network.ServerStatsItem["Data Ping"]:GetValue() + 0.5) .. " ms"
                        if PingText ~= LastPing then
                            Items["PingValue"].Instance.Text = PingText
                            LastPing = PingText
                        end
                    end

                    task.wait(0.2)
                end
            end)

            task.spawn(function()
                while Library and Items["ExecutorInfo"] and Items["ExecutorInfo"].Instance and Items["ExecutorInfo"].Instance.Parent do
                    UpdateTrialCountdownDisplay(false)
                    task.wait(0.2)
                end
            end)

            Library:Connect(Items["HomeScroll"].Instance:GetPropertyChangedSignal("AbsoluteSize"), UpdateHomeLayout)
            UpdateTrialCountdownDisplay(true)
            UpdateHomeLayout()
            UpdatePerformanceLayout()
        end
    end
end

getgenv().Library = Library

task.defer(function()
    task.wait(1)
    if Library and Library._PendingAutoload then
        Library:SafeCall(Library._PendingAutoload)
        Library._PendingAutoload = nil
    end
end)

return Library