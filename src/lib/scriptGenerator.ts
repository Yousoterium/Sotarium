import type { GameItem } from "../components/AddGamePage";
import keySystemTemplate from "./templates/keySystemTemplate.lua?raw";

const GAME_CONFIG_MARKER = "-- __SOTARIUM_GENERATED_GAME_CONFIG__";
const LAUNCH_PAYLOAD_MARKER = "-- __SOTARIUM_GENERATED_LAUNCH_PAYLOAD__";

const FALLBACK_GAME: GameItem = {
  id: "game-1",
  name: "San Diego Border Roleplay",
  imageUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/images/game1.png",
  placeId: "136020512003847",
  scriptUrl: "https://raw.githubusercontent.com/Yousoterium/Sotarium/main/scripts/sandiego.lua",
};

function escapeLuaString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/"/g, '\\"');
}

export function sanitizeScriptPayload(raw: string | undefined): string {
  if (!raw) return "";
  const clean = raw.trim();
  if (clean.length === 0) return "";

  // Accept a raw URL or a pasted loadstring, while preserving a complete payload.
  const httpMatch = clean.match(/https?:\/\/[^\s'")]+/i);
  if (httpMatch) {
    const url = httpMatch[0].replace(/['")]+$/, "");
    return `loadstring(game:HttpGet("${url}"))()`;
  }

  return clean;
}

function resolveGames(games: GameItem[], targetGame?: GameItem): GameItem[] {
  const nonEmptyGames = games.filter((game) => game && game.name?.trim());
  if (nonEmptyGames.length > 0) return nonEmptyGames;
  return [targetGame || FALLBACK_GAME];
}

function buildGamesConfig(games: GameItem[]): string {
  const entries = games
    .map((game, index) => {
      const script = sanitizeScriptPayload(game.scriptUrl);
      return `    [${index + 1}] = {
        Id = "${escapeLuaString(game.id || `game-${index + 1}`)}",
        Name = "${escapeLuaString(game.name)}",
        Image = "${escapeLuaString(game.imageUrl || FALLBACK_GAME.imageUrl)}",
        PlaceId = "${escapeLuaString(game.placeId || "")}",
        ScriptUrl = "${escapeLuaString(script)}"
    }`;
    })
    .join(",\n");

  return `-- ===========================================
-- Supported Games Database (${games.length} Configured Game${games.length === 1 ? "" : "s"})
-- ===========================================
local SupportedGamesList = {
${entries}
}`;
}

function buildLaunchPayload(targetGame: GameItem, unlockedPayload: string): string {
  const fallbackPayload = unlockedPayload.trim() || sanitizeScriptPayload(targetGame.scriptUrl);
  const fallbackLiteral = escapeLuaString(fallbackPayload);

  return `                task.spawn(function()
                    -- Resolve the current Roblox place against every game added in /add.
                    local currentPlaceId = tostring(game.PlaceId)
                    local matchedScript = nil

                    for _, configuredGame in ipairs(SupportedGamesList) do
                        local configuredPlaceId = tostring(configuredGame.PlaceId or "")
                        if configuredPlaceId ~= "" and (configuredPlaceId == currentPlaceId or currentPlaceId:find(configuredPlaceId, 1, true)) then
                            matchedScript = configuredGame.ScriptUrl
                            break
                        end
                    end

                    local payload = matchedScript or "${fallbackLiteral}"
                    if payload and #payload > 0 then
                        local executed, launchError = pcall(function()
                            if payload:find("^https?://") then
                                loadstring(game:HttpGet(payload))()
                            else
                                loadstring(payload)()
                            end
                        end)
                        if not executed then
                            warn("Sotarium could not launch the selected game payload:", launchError)
                        end
                    else
                        warn("Sotarium has no script payload configured for this place.")
                    end
                end)`;
}

/**
 * Produces the complete standalone key-system GUI used by the result panel.
 * The canonical template includes the home screen, key controls, supported-games
 * overlay, animations, notifications, verification flow, and window controls.
 */
export function generateFullKeySystemScript(
  games: GameItem[],
  targetGame: GameItem | undefined,
  unlockedPayload: string
): string {
  const configuredGames = resolveGames(games, targetGame);
  const selectedGame = targetGame || configuredGames[0] || FALLBACK_GAME;
  const script = keySystemTemplate
    .replace(GAME_CONFIG_MARKER, buildGamesConfig(configuredGames))
    .replace(LAUNCH_PAYLOAD_MARKER, buildLaunchPayload(selectedGame, unlockedPayload));

  if (script.includes(GAME_CONFIG_MARKER) || script.includes(LAUNCH_PAYLOAD_MARKER)) {
    throw new Error("The full GUI template is missing a required generation marker.");
  }

  return script;
}
