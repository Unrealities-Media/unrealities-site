# Public showcase across repositories

## Equal project weight and update contract

Talkie Trivia, DeckLogic, RIP FMV and Time Travel Movies receive the same homepage
card structure, navigation visibility and planning review cadence. Release maturity
is explicit; prospective channels remain labeled in development. Review each
project's next milestone, blockers and public presentation together.

Each source repository owns `public-projects.json`: Talkie owns Talkie Trivia, Movie Archivist owns Time Travel Movies, DeckLogic owns its summary, and FMV owns RIP FMV.
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

All five repositories must be siblings with their canonical names. The command
syncs FMV, imports summaries, renders the home/FMV/film pages, generates the
sitemap and checks local links. Edit `scripts/home-template.html`,
`scripts/fmv-template.html` and `scripts/time-travel-template.html`, not generated
HTML. FMV counts come from the catalog. Cards, navigation and the film archive’s
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
Actions secret with Contents read access to the four source repositories: `fmv-games`, `talkie-trivia`, `DeckLogic`, and `movie-archivist`.
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

## Public archive and source ownership

The complete FMV catalog is synced from `fmv-games`. The time-travel archive comes from `movie-archivist/public-catalog.cjs`, which verifies both recovery checksums and selects an explicit allowlist of film metadata and research fields. It never exports personal-state, episodes, saved views, production plans, raw recovery files or arbitrary future fields. All catalog records are included, with included/questionable/excluded assessments visible. Significance is not a film-quality rating; lower-confidence scores are marked provisional.

Talkie Trivia remains a separate linked game. Its older 12-film editorial file is no longer an input to this site. Movie Archivist catalog edits must be captured in its committed recovery snapshot before the public update command can see them. Run `node --test public-catalog.test.cjs` in Movie Archivist before publishing changes to the export.

Publish source changes first, regenerate and validate the site, then publish the generated site. Keep the Movie Archivist checkout private; only generated public HTML goes into this repository. Shared styling lives in `styles.css`, with archive-specific layout in `time-travel/archive.css`; FMV styling starts in `fmv-games/css/unrealities.css`.
