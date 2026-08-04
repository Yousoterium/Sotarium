-- ============================================================================
-- Sotarium — Loading Screen (loading.lua)
-- ============================================================================

local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

local ICON_URL  = "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/public/Sotarium.png"
local ICON_FILE = "SotariumMummy.png"

local function loadLogoAsset()
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

local LoadingGui = Instance.new("ScreenGui")
LoadingGui.Name = "SotariumLoading"
LoadingGui.ResetOnSpawn = false
LoadingGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
LoadingGui.IgnoreGuiInset = true
LoadingGui.Parent = PlayerGui

local Background = Instance.new("Frame")
Background.Name = "Background"
Background.Size = UDim2.new(1, 0, 1, 0)
Background.Position = UDim2.new(0, 0, 0, 0)
Background.BackgroundColor3 = Color3.fromRGB(8, 8, 8)
Background.BackgroundTransparency = 0
Background.BorderSizePixel = 0
Background.Parent = LoadingGui

local LogoContainer = Instance.new("Frame")
LogoContainer.Name = "LogoContainer"
LogoContainer.Size = UDim2.new(0, 140, 0, 140)
LogoContainer.Position = UDim2.new(0.5, -70, 0.5, -70)
LogoContainer.BackgroundTransparency = 1
LogoContainer.Parent = Background

local LogoImage = Instance.new("ImageLabel")
LogoImage.Name = "Logo"
LogoImage.Size = UDim2.new(1, 0, 1, 0)
LogoImage.Position = UDim2.new(0, 0, 0, 0)
LogoImage.BackgroundTransparency = 1
LogoImage.ImageTransparency = 1
LogoImage.Image = ""
LogoImage.ScaleType = Enum.ScaleType.Fit
LogoImage.Parent = LogoContainer

-- Load logo texture
task.spawn(function()
	local asset = loadLogoAsset()
	if asset and asset ~= "" then
		LogoImage.Image = asset
	end
end)

-- Play smooth Fade In -> Hold / Pulse -> Fade Out animation
local function playLoadingAnimation(holdDuration)
	holdDuration = holdDuration or 2.0

	-- 1. Smooth Fade In
	local fadeInInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
	local fadeInTween = TweenService:Create(LogoImage, fadeInInfo, { ImageTransparency = 0 })
	fadeInTween:Play()
	fadeInTween.Completed:Wait()

	-- 2. Gentle Hold / Breathing Pulse Effect
	local breatheUp = TweenService:Create(LogoContainer, TweenInfo.new(holdDuration * 0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut), {
		Size = UDim2.new(0, 150, 0, 150),
		Position = UDim2.new(0.5, -75, 0.5, -75)
	})
	breatheUp:Play()
	breatheUp.Completed:Wait()

	-- 3. Smooth Fade Out Logo and Background
	local fadeOutInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quart, Enum.EasingDirection.In)
	local fadeOutLogo = TweenService:Create(LogoImage, fadeOutInfo, { ImageTransparency = 1 })
	local fadeOutBg = TweenService:Create(Background, fadeOutInfo, { BackgroundTransparency = 1 })

	fadeOutLogo:Play()
	fadeOutBg:Play()
	fadeOutLogo.Completed:Wait()

	-- Destroy GUI when complete
	LoadingGui:Destroy()
end

playLoadingAnimation(2.0)

return LoadingGui
