# unrealities.media

Static site for Unrealities LLC, served by GitHub Pages from the `main` branch root. The home page leads into two public encyclopedias: FMV games and time-travel movies.

The home page and FMV landing page are hand-authored HTML/CSS. The complete FMV catalog at `/fmv/games/` is copied from the sibling `fmv-games` repository. The time-travel guide at `/time-travel/` is generated from the sibling `talkie-trivia` repository's original public editorial entries. Generated pages and assets are committed so GitHub Pages needs no build step.

After updating either source, run:

```sh
node scripts/sync-fmv.cjs
node scripts/build-time-travel.cjs
node scripts/build-explore.cjs
node scripts/sync-fmv.cjs --check
node scripts/build-time-travel.cjs --check
node scripts/build-explore.cjs --check
node scripts/check-public.cjs
```

The source repositories own their data and product UIs. Do not edit `/fmv/games/` or `/time-travel/index.html` directly. The Talkie guide uses public, spoiler-light copy in `data/public-time-travel-films.json`; never include private daily clues or unreleased schedules. The Talkie web game is currently linked as a public beta. See [the cross-repository plan](docs/public-showcase-plan.md) for update and release order.

`CNAME` pins the custom domain. DNS at the registrar:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | `unrealities-media.github.io` |

The site uses text social cards until a brand image has been created.
