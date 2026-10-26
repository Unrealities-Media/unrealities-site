# Public showcase across repositories

Unrealities owns the visual system and navigation. The two encyclopedias live on `unrealities.media`: `/fmv/` introduces the full FMV catalog at `/fmv/games/`, and `/time-travel/` presents original film entries. Talkie Trivia and DeckLogic remain linked products with accurate release labels.

| Repository | Source of truth | Public output |
| --- | --- | --- |
| `fmv-games` | Catalog, game guides, release data, art, FMV UI | Static copy at `/fmv/games/` |
| `talkie-trivia` | Reviewed public film notes in `content/public-time-travel-films.json`; movie title/year catalog | Generated guide at `/time-travel/`; separate playable web beta |
| `unrealities-site` | Studio copy, visual system, landing pages, cross-project navigation | GitHub Pages at `unrealities.media` |

The FMV copy is intentionally generated from the public static site files; changes to game data and design begin in `fmv-games`. The Talkie guide contains no private daily clues, answer schedule, player history or TMDB synopsis. It uses original notes plus titles and years checked against the Talkie movie catalog. The public movie guide can be updated independently of Talkie's game release schedule.

Publish in dependency order: update and validate the FMV and Talkie source repositories, run the two generation scripts in `unrealities-site`, review the generated diff, then publish the site. Links inside the FMV catalog stay relative, so the copy works at `/fmv/games/`. Check the home page, both landing pages, the game directory, a direct game guide, search/filtering, small screens and keyboard navigation after each update.

When Talkie Trivia leaves beta, update the destination URL and release wording on the home page and film guide. The FMV landing page's release count is a snapshot and should be updated when the catalog changes.
