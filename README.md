# unrealities.media

Static site for Unrealities LLC, served by GitHub Pages from the `main` branch root. Talkie Trivia, DeckLogic, RIP FMV and Time Travel Movies share equal homepage and navigation prominence.

The home and FMV landing pages are generated from templates and source-owned public summaries. The complete FMV catalog at `/fmv/games/` is copied from the sibling `fmv-games` repository. The time-travel guide at `/time-travel/` is generated from the sibling `movie-archivist` repository's checksummed catalog recovery snapshot through its strict public-field export. Generated pages and assets are committed so GitHub Pages needs no build step.

After updating a source, run:

```sh
node scripts/update-site.cjs
node scripts/update-site.cjs --check --upstream
node --test scripts/projects.test.cjs
```

The source repositories own their data and product UIs. Do not edit `/fmv/games/` or `/time-travel/index.html` directly. Movie Archivist owns the time-travel catalog and summary. Its `public-catalog.cjs` exports only explicitly allowed film metadata and research; personal history, ratings, notes, saved views and production plans are never copied. Research may contain spoilers and is collapsed by default. The Talkie web game is currently linked as a public beta. See [the cross-repository plan](docs/public-showcase-plan.md) for update and release order.

`CNAME` pins the custom domain. DNS at the registrar:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | `unrealities-media.github.io` |

The site uses text social cards until a brand image has been created.
