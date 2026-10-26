# Unrealities site audit — October 26, 2026

## Scope and route tree

The live baseline covered all ten HTML pages at desktop and 390px mobile width:

- Home → FMV introduction → release index, game directory, release timeline, game Titans, Platform Titans, Channel select.
- Game directory → 786 unique game guides → 1,091 release records, section anchors and research links. All game routes and all release-key routes also pass the source model tests.
- Home → time-travel guide → 12 film entries and TMDB details.
- Studio links → Talkie Trivia public beta and DeckLogic.
- Custom 404 page and recovery navigation.

The sitemap contains 795 public URLs, including each game guide and the previously omitted timeline, rankings and Channel pages. The unrequested Explore directory and its navigation links were removed after the user clarified the intended scope.

## Findings and fixes

| Finding | Evidence | Resolution |
| --- | --- | --- |
| Platform Titans unusable | HTML returned 200, but `tools/capture/store_prices.json` returned 404; UI displayed “Platform rankings could not load” | Added the required public file to the FMV sync manifest. Verified rankings, value mode and hardware estimates in the browser. |
| Deployment checks missed JavaScript data dependencies | Old checker scanned only HTML links | Checker now discovers public HTML and follows its script references to check literal runtime data dependencies. Unused historical modules and optional localhost overlays are excluded. |
| Deep branches missing from sitemap | Five sitemap entries | Generated the full sitemap for the existing site. |
| Obsolete Wikizilla hostname | `wikizilla.wikiteq.com` failed DNS | Replaced with the verified Gamera article on `wikizilla.org`. |
| Dragon’s Lair Project TLS failures | Bare hostname failed certificate validation | Verified and switched Freedom Fighter, Atari prototypes and Zorton Brothers links to the working `www` hostname. |
| Dead Take reference unavailable | Episteme source returned 503 on both checks | Replaced with BAFTA’s official 2026 nominations announcement, supporting the nomination claim. Other cast/review sources remain. |

Research URL corrections were made in `fmv-games` data and upstream research inputs, then synced to this site. Historical verification inventories were retained as historical evidence.

## Verification

- All 786 game guides rendered in headless Edge: correct headings, no missing section anchors, no JavaScript exceptions, no page-wide overflow at 390px, and no failed asset requests observed. This traverses every guide via the real client-side navigation handler; it does not separately reload 786 identical HTML documents.
- Source model tests: 10 passed, including resolution of every game and release, sparse entries and compilation families.
- Film title search, mechanism filters, empty results and reset to all 12 entries passed.
- Release-index system links, search, drawer opening, Escape dismissal and filter reset passed.
- Timeline system links, empty search and reset passed; Titans Top 50/100 switching passed.
- Channel year tuning and teletext passed.
- Platform Titans loaded with the restored file; value mode and editing hardware estimates passed.
- Generation parity, all 10 public HTML pages’ local links, runtime asset checks and whitespace checks passed before publication.

## External links and limits

159 distinct external destinations were sampled from rendered top-level pages and up to two guide links per hostname. The initial results were 77 HTTP 200 responses, 23 HTTP 403 responses, 55 HTTP 429 responses, one HTTP 503 response, and three DNS/TLS failures. Raw initial results are in `link-audit.json`; they deliberately retain the before-fix evidence. The repaired Dragon’s Lair Project and Wikizilla destinations returned 200, and the replacement BAFTA page was verified separately.

Talkie Trivia and DeckLogic landing URLs returned 200. TMDB, MobyGames and some other sites blocked automated access; Wikipedia rate-limited this session. These responses do not establish that the destinations are broken for ordinary visitors. No access restrictions were bypassed, and those research links were retained.

This is a navigation, loading and sampled interaction audit. It does not certify every external research claim, every third-party URL, checkout flows, Talkie gameplay, tracker import/export, or full accessibility conformance. External availability can change independently of this site.

## Repeat the checks

Run the generation/check commands in the README. Browser audits require an installed Playwright module and Microsoft Edge; optionally set `PLAYWRIGHT_MODULE` to the module path. `audit-guides.cjs` starts its own temporary local server; `audit-browser.cjs` defaults to the live domain and can use `AUDIT_BASE` for another host. `audit-links.cjs` consumes their URL inventories; avoid frequent runs because external services may rate-limit requests.
