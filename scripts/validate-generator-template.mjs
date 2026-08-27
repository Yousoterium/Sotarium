import { readFileSync } from "node:fs";

const template = readFileSync("src/lib/templates/keySystemTemplate.lua", "utf8");
const configMarker = "-- __SOTARIUM_GENERATED_GAME_CONFIG__";
const launchMarker = "-- __SOTARIUM_GENERATED_LAUNCH_PAYLOAD__";

const config = `-- ===========================================
-- Supported Games Database (2 Configured Games)
-- ===========================================
local SupportedGamesList = {
    [1] = {
        Id = "game-1",
        Name = "San Diego Border Roleplay",
        Image = "https://example.com/san-diego.png",
        PlaceId = "136020512003847",
        ScriptUrl = "loadstring(game:HttpGet(\\"https://example.com/san-diego.lua\\"))()"
    },
    [2] = {
        Id = "game-2",
        Name = "Example City",
        Image = "https://example.com/example-city.png",
        PlaceId = "987654321",
        ScriptUrl = "loadstring(game:HttpGet(\\"https://example.com/example-city.lua\\"))()"
    }
}`;

const launch = `                task.spawn(function()
                    local currentPlaceId = tostring(game.PlaceId)
                    local matchedScript = nil
                    for _, configuredGame in ipairs(SupportedGamesList) do
                        if tostring(configuredGame.PlaceId or "") == currentPlaceId then
                            matchedScript = configuredGame.ScriptUrl
                            break
                        end
                    end
                    local payload = matchedScript or ""
                    if payload ~= "" then loadstring(payload)() end
                end)`;

const output = template.replace(configMarker, config).replace(launchMarker, launch);
const requiredSections = [
  "local ContentFrame = Instance.new(\"Frame\")",
  "local SubmitButton = Instance.new(\"TextButton\")",
  "local GetKeyButton = Instance.new(\"TextButton\")",
  "local SupportedGamesButton = Instance.new(\"TextButton\")",
  "local JoinDiscordButton = Instance.new(\"TextButton\")",
  "local GamesOverlay = Instance.new(\"Frame\")",
  "local Overlay = Instance.new(\"Frame\")",
  "local TopBar = Instance.new(\"Frame\")",
  "Example City",
  "local currentPlaceId = tostring(game.PlaceId)",
];

const missingSections = requiredSections.filter((section) => !output.includes(section));
const report = {
  characters: output.length,
  lines: output.split("\n").length,
  markersRemaining: output.includes(configMarker) || output.includes(launchMarker),
  missingSections,
};

console.log(JSON.stringify(report, null, 2));
if (report.characters < 1500 || report.lines < 150 || report.markersRemaining || missingSections.length > 0) {
  process.exit(1);
}
