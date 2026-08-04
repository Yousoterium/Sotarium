local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

while not Players.LocalPlayer do
	task.wait(0.1)
end
local LocalPlayer = Players.LocalPlayer

local UI, Window, SettingsTab

local function animateClick(button)
	local uiScale = button:FindFirstChild("ClickScale")
	if not uiScale then
		uiScale = Instance.new("UIScale")
		uiScale.Name = "ClickScale"
		uiScale.Parent = button
	end

	local accentColor = Color3.fromRGB(247, 197, 46)
	if Window and typeof(Window.GetAccent) == "function" then
		accentColor = Window:GetAccent()
	elseif UI and UI.Theme and UI.Theme.Accent then
		accentColor = UI.Theme.Accent
	end

	local isTabButton = false
	if Window then
		if button.Parent == Window.TabHolder or button.Parent == Window.PinnedHolder then
			isTabButton = true
		end
	end

	local isSettingsSection = false
	if SettingsTab and SettingsTab.Page and button:IsDescendantOf(SettingsTab.Page) then
		isSettingsSection = true
	end

	if isTabButton then
		local duration = 2.0
		uiScale.Scale = 0.93
		local scaleInfo = TweenInfo.new(duration, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
		TweenService:Create(uiScale, scaleInfo, { Scale = 1 }):Play()

		if button and (button:IsA("TextButton") or button:IsA("ImageButton")) then
			local fill = button:FindFirstChild("ClickFill")
			if fill then
				fill:Destroy()
			end
			fill = Instance.new("Frame")
			fill.Name = "ClickFill"
			fill.BorderSizePixel = 0
			fill.ZIndex = 0
			fill.Parent = button
			button.ClipsDescendants = true
			local corner = button:FindFirstChildOfClass("UICorner")
			if corner then
				local fillCorner = corner:Clone()
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
						if fill and fill.Parent then
							fill:Destroy()
						end
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
			if originalTransparency > 0.8 then
				button.BackgroundTransparency = 0.3
			end
			local colorInfo = TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
			TweenService:Create(button, colorInfo, {
				BackgroundColor3 = originalColor,
				BackgroundTransparency = originalTransparency
			}):Play()
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
		for k, v in pairs(props or {}) do
			if k ~= "Parent" then
				obj[k] = v
			end
		end
		for _, c in ipairs(children or {}) do
			c.Parent = obj
		end
		if props and props.Parent then
			obj.Parent = props.Parent
		end
		return obj
	end

	local function corner(parent, radius)
		return new("UICorner", { CornerRadius = UDim.new(0, radius or 6), Parent = parent })
	end

	local function stroke(parent, color, thickness, transparency)
		return new("UIStroke", {
			Color = color or Theme.Border,
			Thickness = thickness or 1,
			Transparency = transparency or 0,
			ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
			Parent = parent,
		})
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

	function UI:CreateWindow(cfg)
		cfg = cfg or {}

		local Window = setmetatable({
			Tabs = {},
			Flags = UI.Flags,
			Open = true,
			ActiveTab = nil,
			_accentElements = {},
		}, WindowMethods)

		Window.ToggleKey = cfg.ToggleKey or Enum.KeyCode.RightShift

		local function loadLogoAsset()
			local ICON_URL = "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png"
			local ICON_FILE = "SotariumMummy.png"

			local hasWrite = type(writefile) == "function" or type(write_file) == "function"
			local hasIs    = type(isfile) == "function" or type(is_file) == "function"
			local hasCust  = type(getcustomasset) == "function" or type(getsynasset) == "function"

			if not (hasWrite and hasIs and hasCust) then
				return ICON_URL
			end

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
				if ok and res then
					data = type(res) == "table" and res.Body or res
				end
			end
			if not data and game and game.HttpGet then
				pcall(function() data = game:HttpGet(ICON_URL) end)
			end

			if data and type(data) == "string" and #data > 100 then
				pcall(writefileFn, ICON_FILE, data)
				local ok2, asset = pcall(resolver, ICON_FILE)
				if ok2 and asset then return asset end
			end

			return ICON_URL
		end

		local parentGui = Player:FindFirstChild("PlayerGui") or Player:WaitForChild("PlayerGui")
		local Gui = new("ScreenGui", {
			Name = "SotariumUI",
			ResetOnSpawn = false,
			ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
			IgnoreGuiInset = true,
			Parent = parentGui,
		})

		local Main = new("Frame", {
			Name = "Main",
			Size = UDim2.new(0, cfg.Width or 620, 0, cfg.Height or 400),
			Position = UDim2.new(0.5, -(cfg.Width or 620) / 2, 0.5, -(cfg.Height or 400) / 2),
			BackgroundColor3 = Theme.BG,
			BorderSizePixel = 0,
			ClipsDescendants = true,
			Parent = Gui,
		})
		corner(Main, 12)
		stroke(Main, Theme.Border, 1, 0.2)

		local Sidebar = new("Frame", {
			Name = "Sidebar",
			Size = UDim2.new(0, 160, 1, 0),
			BackgroundColor3 = Theme.Sidebar,
			BorderSizePixel = 0,
			Parent = Main,
		})
		corner(Sidebar, 12)
		new("Frame", {
			Size = UDim2.new(0, 14, 1, 0),
			Position = UDim2.new(1, -14, 0, 0),
			BackgroundColor3 = Theme.Sidebar,
			BorderSizePixel = 0,
			Parent = Sidebar,
		})

		local Header = new("Frame", {
			Name = "Header",
			Size = UDim2.new(1, 0, 0, 54),
			BackgroundTransparency = 1,
			Parent = Sidebar,
		})

		local LogoImage = new("ImageLabel", {
			Name = "Logo",
			Size = UDim2.new(0, 26, 0, 26),
			Position = UDim2.new(0, 12, 0.5, -13),
			BackgroundTransparency = 1,
			Image = "",
			ScaleType = Enum.ScaleType.Fit,
			Parent = Header,
		})

		task.spawn(function()
			local asset = loadLogoAsset()
			if asset and asset ~= "" then
				LogoImage.Image = asset
			end
		end)

		new("TextLabel", {
			Size = UDim2.new(1, -48, 1, 0),
			Position = UDim2.new(0, 44, 0, 0),
			BackgroundTransparency = 1,
			Text = cfg.Title or "Sotarium",
			TextColor3 = Theme.Text,
			FontFace = FONT_BOLD,
			TextSize = 19,
			TextXAlignment = Enum.TextXAlignment.Left,
			Parent = Header,
		})

		local PinnedHolder = new("Frame", {
			Name = "PinnedHolder",
			Size = UDim2.new(1, 0, 0, 46),
			Position = UDim2.new(0, 0, 1, -106),
			BackgroundTransparency = 1,
			Parent = Sidebar,
		})
		new("UIListLayout", {
			Padding = UDim.new(0, 4),
			SortOrder = Enum.SortOrder.LayoutOrder,
			VerticalAlignment = Enum.VerticalAlignment.Bottom,
			Parent = PinnedHolder,
		})
		new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), PaddingBottom = UDim.new(0, 6), Parent = PinnedHolder })

		local avatarUrl = "rbxassetid://0"
		pcall(function()
			avatarUrl = Players:GetUserThumbnailAsync(LocalPlayer.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size100x100)
		end)

		local ProfileCard = new("Frame", {
			Name = "ProfileCard",
			Size = UDim2.new(1, -20, 0, 46),
			Position = UDim2.new(0, 10, 1, -56),
			BackgroundColor3 = Theme.Surface,
			BorderSizePixel = 0,
			Parent = Sidebar,
		})
		corner(ProfileCard, 8)
		stroke(ProfileCard, Theme.Border, 1, 0.4)

		local AvatarImage = new("ImageLabel", {
			Name = "Avatar",
			Size = UDim2.new(0, 32, 0, 32),
			Position = UDim2.new(0, 8, 0.5, -16),
			BackgroundColor3 = Theme.Raised,
			BorderSizePixel = 0,
			Image = avatarUrl,
			Parent = ProfileCard,
		})
		corner(AvatarImage, 16)
		stroke(AvatarImage, Theme.Border, 1, 0.4)

		new("TextLabel", {
			Name = "Username",
			Size = UDim2.new(1, -54, 1, 0),
			Position = UDim2.new(0, 46, 0, 0),
			BackgroundTransparency = 1,
			Text = LocalPlayer.Name,
			TextColor3 = Theme.Text,
			FontFace = FONT_BOLD,
			TextSize = 12,
			TextXAlignment = Enum.TextXAlignment.Left,
			TextWrapped = true,
			Parent = ProfileCard,
		})

		local TabHolder = new("ScrollingFrame", {
			Name = "TabHolder",
			Size = UDim2.new(1, 0, 1, -54 - 106 - 10),
			Position = UDim2.new(0, 0, 0, 54),
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			ScrollBarThickness = 2,
			ScrollBarImageColor3 = Theme.Accent,
			AutomaticCanvasSize = Enum.AutomaticSize.Y,
			CanvasSize = UDim2.new(0, 0, 0, 0),
			Parent = Sidebar,
		})
		new("UIListLayout", { Padding = UDim.new(0, 4), SortOrder = Enum.SortOrder.LayoutOrder, Parent = TabHolder })
		new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10), Parent = TabHolder })
		Window:_registerAccent(function(accent)
			TabHolder.ScrollBarImageColor3 = accent
		end)

		local Content = new("Frame", {
			Name = "Content",
			Size = UDim2.new(1, -160, 1, 0),
			Position = UDim2.new(0, 160, 0, 0),
			BackgroundColor3 = Theme.BG,
			BorderSizePixel = 0,
			Parent = Main,
		})

		local MainCloseBtn = new("TextButton", {
			Name = "MainCloseBtn",
			Size = UDim2.new(0, 20, 0, 20),
			Position = UDim2.new(1, -30, 0, 12),
			BackgroundColor3 = Color3.fromRGB(45, 45, 45),
			AutoButtonColor = false,
			Text = "X",
			TextColor3 = Color3.fromRGB(180, 180, 180),
			FontFace = FONT_BOLD,
			TextSize = 10,
			TextXAlignment = Enum.TextXAlignment.Center,
			TextYAlignment = Enum.TextYAlignment.Center,
			ZIndex = 10,
			Parent = Main,
		})
		corner(MainCloseBtn, 10)
		stroke(MainCloseBtn, Theme.Border, 1, 0.4)

		MainCloseBtn.MouseEnter:Connect(function()
			tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(60, 60, 60), TextColor3 = Color3.fromRGB(240, 240, 240) }, 0.12)
		end)
		MainCloseBtn.MouseLeave:Connect(function()
			tween(MainCloseBtn, { BackgroundColor3 = Color3.fromRGB(45, 45, 45), TextColor3 = Color3.fromRGB(180, 180, 180) }, 0.12)
		end)

		MainCloseBtn.MouseButton1Click:Connect(function()
			animateClick(MainCloseBtn)
			task.wait(0.1)
			Gui:Destroy()
		end)

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
					dragging = true
					startInput = i.Position
					startPos = Main.Position
				end
			end)
			Header.InputEnded:Connect(function(i)
				if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then
					dragging = false
				end
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
			if input.KeyCode == Window.ToggleKey then
				Window:Toggle()
			end
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
		for _, applyFn in ipairs(self._accentElements) do
			pcall(applyFn, Theme.Accent, Theme.AccentDim)
		end
		if self.ActiveTab and self.ActiveTab._refresh then
			self.ActiveTab._refresh()
		end
	end

	function WindowMethods:GetAccent()
		return Theme.Accent
	end

	function WindowMethods:SetOpen(state)
		self.Open = state
		if state then
			self.Main.Visible = true
			tween(self.Main, { Position = self._openPos or self.Main.Position }, 0.22)
		else
			self._openPos = self.Main.Position
			task.delay(0.22, function()
				if not self.Open then
					self.Main.Visible = false
				end
			end)
		end
	end

	function WindowMethods:Toggle()
		self:SetOpen(not self.Open)
	end

	local function buildTab(Window, data, pinned)
		data = data or {}
		local Tab = setmetatable({
			Name = data.Name or "Tab",
			Sections = {},
			Window = Window,
			Pinned = pinned or false,
		}, TabMethods)

		local holder = pinned and Window.PinnedHolder or Window.TabHolder

		local Button = new("TextButton", {
			Name = Tab.Name,
			Size = UDim2.new(1, 0, 0, 36),
			BackgroundColor3 = Theme.Raised,
			BackgroundTransparency = 1,
			AutoButtonColor = false,
			Text = "",
			Parent = holder,
		})
		corner(Button, 8)

		local bar = new("Frame", {
			Size = UDim2.new(0, 3, 0.6, 0),
			Position = UDim2.new(0, 0, 0.2, 0),
			BackgroundColor3 = Theme.Accent,
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			Parent = Button,
		})
		corner(bar, 2)

		local Label = new("TextLabel", {
			Size = UDim2.new(1, -16, 1, 0),
			Position = UDim2.new(0, 12, 0, 0),
			BackgroundTransparency = 1,
			Text = Tab.Name,
			TextColor3 = Theme.TextMid,
			FontFace = FONT_REG,
			TextSize = 14,
			TextXAlignment = Enum.TextXAlignment.Left,
			Parent = Button,
		})

		local Page = new("ScrollingFrame", {
			Name = Tab.Name .. "_Page",
			Size = UDim2.new(1, -24, 1, -24),
			Position = UDim2.new(0, 12, 0, 12),
			BackgroundTransparency = 1,
			BorderSizePixel = 0,
			ScrollBarThickness = 3,
			ScrollBarImageColor3 = Theme.Accent,
			AutomaticCanvasSize = Enum.AutomaticSize.Y,
			CanvasSize = UDim2.new(0, 0, 0, 0),
			Visible = false,
			Parent = Window.Content,
		})
		new("UIListLayout", { Padding = UDim.new(0, 12), SortOrder = Enum.SortOrder.LayoutOrder, Parent = Page })
		new("UIPadding", { PaddingRight = UDim.new(0, 6), Parent = Page })
		Window:_registerAccent(function(accent)
			Page.ScrollBarImageColor3 = accent
		end)

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

		Button.MouseButton1Click:Connect(function()
			animateClick(Button)
			Window:SelectTab(Tab)
		end)

		table.insert(Window.Tabs, Tab)
		if not Window.ActiveTab then
			Window:SelectTab(Tab)
		else
			Tab._refresh()
		end
		return Tab
	end

	function WindowMethods:AddTab(data)
		return buildTab(self, data, false)
	end

	function WindowMethods:AddPinnedTab(data)
		return buildTab(self, data, true)
	end

	function WindowMethods:SelectTab(tab)
		for _, t in ipairs(self.Tabs) do
			if t.Page then t.Page.Visible = false end
		end
		self.ActiveTab = tab
		tab.Page.Visible = true
		for _, t in ipairs(self.Tabs) do
			if t._refresh then t._refresh() end
		end
	end

	function TabMethods:AddSection(data)
		data = data or {}
		local Section = setmetatable({
			Name = data.Name or "Section",
			Window = self.Window,
		}, SectionMethods)

		local Card = new("Frame", {
			Name = Section.Name,
			Size = UDim2.new(1, 0, 0, 0),
			AutomaticSize = Enum.AutomaticSize.Y,
			BackgroundColor3 = Theme.Surface,
			BorderSizePixel = 0,
			Parent = self.Container,
		})
		corner(Card, 10)
		stroke(Card, Theme.Border, 1, 0.35)
		new("UIPadding", {
			PaddingTop = UDim.new(0, 12), PaddingBottom = UDim.new(0, 12),
			PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12),
			Parent = Card,
		})
		new("UIListLayout", { Padding = UDim.new(0, 8), SortOrder = Enum.SortOrder.LayoutOrder, Parent = Card })

		new("TextLabel", {
			Size = UDim2.new(1, 0, 0, 18),
			BackgroundTransparency = 1,
			Text = Section.Name,
			TextColor3 = Theme.Text,
			FontFace = FONT_BOLD,
			TextSize = 14,
			TextXAlignment = Enum.TextXAlignment.Left,
			Parent = Card,
		})

		Section.Container = Card
		return Section
	end

	return UI
end)()

if type(UI) ~= "table" or type(UI.CreateWindow) ~= "function" then
	warn("UI library not available or doesn't support CreateWindow")
	return
end

local ok, windowResult = pcall(function()
	return UI:CreateWindow({ Title = "Sotarium", Width = 580, Height = 420 })
end)
if not ok or type(windowResult) ~= "table" then
	warn("Failed to create window:", windowResult)
	return
end
Window = windowResult

local MainTab = Window:AddTab({ Name = "main" })
Window:SelectTab(MainTab)
MainTab:AddSection({ Name = "main" })

Window:SetOpen(true)
