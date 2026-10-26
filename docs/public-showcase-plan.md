# Public showcase across repositories

## Equal project weight and update contract

Talkie Trivia, DeckLogic, RIP FMV and Time Travel Movies receive the same homepage
card structure, navigation visibility and planning review cadence. Release maturity
is explicit; prospective channels remain labeled in development. Review each
project's next milestone, blockers and public presentation together.

Each source repository owns `public-projects.json`: Talkie owns the Talkie and
Time Travel Movies summaries, DeckLogic owns its summary, and FMV owns RIP FMV.
At a public release, changed destination/status or meaningful milestone, update
that file and its `reviewedOn` date. Otherwise record "no website change needed"
in the release/PR notes. Never automatically refresh review dates.

From `unrealities-site`, run:

```sh
node scripts/update-site.cjs
node scripts/update-site.cjs --check --upstream
node --test scripts/projects.test.cjs
git diff --check
```

All four repositories must be siblings with their canonical names. The command
syncs FMV, imports summaries, renders the home/FMV/film pages, generates the
sitemap and checks local links. Edit `scripts/home-template.html`,
`scripts/fmv-template.html` and `scripts/time-travel-template.html`, not generated
HTML. FMV counts come from the catalog. Cards, navigation and Talkie's film-guide
release label come from the imported summaries.

`data/projects.json` is the committed public snapshot. `data/project-sources.json`
records summary SHA-256 hashes and repository HEADs at import. Local uncommitted
summary edits are identified by their content hashes, not HEAD alone. Unrelated
upstream commits do not create updates. Only public-safe, original copy belongs
in summaries: no private clues, future answers, player data or roadmap promises.
DeckLogic live tracking is descriptive; coaching remains post-game.

## Automated checks and activation

`.github/workflows/project-updates.yml` checks generated studio pages, the
sitemap, public links and summary contracts on site pushes and PRs. Every Monday
at 14:23 UTC, and on manual dispatch, it checks the current source default
branches, regenerates and validates the site. Drift produces a `site-update`
patch artifact and a failed check. Unchanged content passes without a custom
notification. Checkout/build failures also fail visibly. GitHub Actions
notification preferences control delivery; nothing publishes automatically.

For private source repositories, configure the site's `PROJECTS_READ_TOKEN`
Actions secret with Contents read access to the three source repositories.
The existing singular name `PROJECT_READ_TOKEN` is also accepted as an alias;
if both exist, `PROJECTS_READ_TOKEN` takes precedence.
Public sources need no extra token. This token needs no write permission, and
the upstream job never runs with secrets on fork PRs.

Publish source summaries and the FMV theme first, then the regenerated site and
workflow. Scheduling starts when the workflow reaches the default branch. Run
it manually once to verify repository access. Review the artifact with
`git apply --check site-update.patch`, apply it on a site branch, inspect the
diff, and run checks before merging. The schedule detects changed public inputs;
the release checklist catches product changes whose summaries were overlooked.

## Content ownership

Unrealities owns the visual system and navigation. The two encyclopedias live on `unrealities.media`: `/fmv/` introduces the full FMV catalog at `/fmv/games/`, and `/time-travel/` presents original film entries. Talkie Trivia and DeckLogic are equally prominent linked products with accurate release labels.

| Repository | Source of truth | Public output |
| --- | --- | --- |
| `fmv-games` | Catalog, game guides, release data, art, FMV UI | Static copy at `/fmv/games/` |
| `DeckLogic` | `public-projects.json` | DeckLogic card, status and product destination |
| `talkie-trivia` | Public film notes in `data/public-time-travel-films.json`; movie title/year catalog | Generated guide at `/time-travel/`; separate playable web beta |
| `unrealities-site` | Studio copy, visual system, landing pages, cross-project navigation | GitHub Pages at `unrealities.media` |

The FMV copy is intentionally generated from the public static site files; changes to game data and design begin in `fmv-games`. The Talkie guide contains no private daily clues, answer schedule, player history or TMDB synopsis. It uses original notes plus titles and years checked against the Talkie movie catalog. The public movie guide can be updated independently of Talkie's game release schedule.

Publish in dependency order: update and validate the FMV and Talkie source repositories, run `node scripts/update-site.cjs` in `unrealities-site`, review the generated diff, then publish the site. Links inside the FMV catalog stay relative, so the copy works at `/fmv/games/`. Check the home page, both landing pages, the game directory, a direct game guide, search/filtering, small screens and keyboard navigation after each update.

When Talkie Trivia leaves beta, update its source summary and regenerate; the home page and film guide share its URL and status. FMV landing page counts are generated from the synced catalog. Edit catalog styling in `fmv-games/css/unrealities.css` and studio/film-guide styling in `styles.css`; both use paper/slate/blue colors, Space Grotesk body type and Archivo Black headings.
