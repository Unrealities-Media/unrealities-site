# FMV classification and series scope

Agreed October 28, 2026. The catalog remains broader than R.I.P. FMV. The [eligibility checklist](rip-fmv-checklist.md) is the wider candidate pool. The separate [R.I.P. FMV section](../rip-fmv.html) contains games explicitly selected for the series; the [32-game rotation](fmv-play-order.md) is its opening production order. A bad review, low Titan rank, price or lack of ownership cannot exclude a qualifying game.

## The boundary

Core FMV uses moving prerecorded video as its principal playfield or principal narrative interaction. Filmed actors, drawn cartoons and CG animation can all qualify. A shooting cursor, sprite vehicle, inventory, map or camera interface can be integrated with the video. QTEs are one interaction type, not the definition of FMV.

Eligibility for R.I.P. FMV requires a qualifying released FMV edition **before January 1, 2000**, plus a reviewed consumer edition. Later ports and restorations preserving that experience qualify. The qualifying original may be an arcade release: a 2023 home remaster of a 1985 arcade video game can belong to R.I.P. FMV. A cancelled project's filming date or prototype date cannot establish a commercial release; American Hero's restored 2021 release belongs to later FMV under this rule.

Assess each edition. Starblade's video-based 3DO edition qualifies independently of its real-time arcade original. Creature Shock's North American Saturn Special Edition combines video exploration and real-time shooter stages, unlike the video-only exploration described for its Japanese release; the combined Saturn record is conservatively hybrid. Panic! remains a format-review case because the existing hand-drawn-animation descriptions do not establish video playback rather than sprite animation. The Lawnmower Man's Sega CD platform/action edition is hybrid, while its DOS/Mac interactive-video adventure is core. Myst's still-image puzzle exploration plus filmed scenes is hybrid. Plumbers Don't Wear Ties is predominantly still photographs, outside core moving-video gameplay. Telltale's The Walking Dead: Season One is a real-time cinematic adventure, separately categorized even though it has dialogue choices and QTEs.

Consumer arcade ports and restorations are preferred over making cabinet visits mandatory. Arcade emulation does not itself constitute a consumer release. The `arcade-only` scope means **no reviewed consumer edition established in this catalog**, not proof that no home edition exists. For example, older research mentions MSX Palcom routes for Astron Belt and Badlands; their exact editions still need review. The newly sourced Switch Yamato and PS3 Fast Draw Showdown records do establish consumer routes, without claiming current stock or PSN checkout.

## Release fields

Each release in `data/games.json` has an additive `classification` object. The legacy `category`, `fmvType`, `genre` and `fmv` remain available for compatibility and historical research.

| Field | Values / meaning |
| --- | --- |
| `relationship` | `core`, `hybrid`, `cutscenes`, `adjacent`, `non-game`, `unknown` |
| `visualMaterial` | Multiple of `live-action`, `drawn-animation`, `cg-animation`, `still-photographs`, `stop-motion`; empty means unknown |
| `presentation` | Multiple of `prerecorded-video`, `still-images`, `real-time`, `sprite-overlays`; empty means unknown |
| `videoRole` | Multiple of `main-playfield`, `interactive-narrative`, `background`, `cutscenes`, `illustration`; empty means unknown/not established |
| `interaction` | Independent tags: choices, QTEs, shooting, driving, investigation, puzzles, point-and-click, camera management, quiz, fighting, video editing, exploration, sports, cards, timed actions, route selection |
| `qte`, `timedInput` | `yes`, `no`, `unknown`; timed traps/aiming do not automatically establish prompted QTEs |
| `otherGameplay` | `extent`: `integrated`, `substantial`, `none`, `unknown`; `types`: the documented activities |
| `version` | `original`, `port`, `remaster`, `remake`, `compilation`, `unknown`; inferred labels are identified |
| `qualifyingReleaseYear` | This edition's established qualifying release year; may correct a legacy project-year field without overwriting it |
| `reviewStatus` | `catalog-reviewed`, `inferred`, `unreviewed` |
| `checked`, `rationale` | Classification decision date and explanation |
| `evidence` | Release key, legacy descriptive fields used, decision reference, sources, provenance, optional fresh-source observation and `inferredFields` |

`catalog-reviewed` means an editorial format decision was made using the existing catalog descriptions and linked research. It does **not** mean every source was freshly checked, every edition played or every tag independently verified. `evidence.inferredFields` identifies normalized attributes that remain inferred even on a reviewed relationship. Sparse editions do not inherit a family's reviewed core status. An inferred hybrid classification goes to the review backlog rather than becoming a definitive exclusion; explicit legacy cutscene labels remain provisional related-history evidence. A specific release decision takes precedence over a family default.

Do not manufacture negative facts: missing QTE evidence means unknown, not no; an unpriced edition does not mean unavailable; an import region does not establish its language. Region, language research, purchase dates, compatibility caveats and capture requirements remain separate catalog/guide evidence. This classification does not turn them into verified production readiness.

## Family scope and finite counting

`lineage[gameId].scope` records:

- `series`: `rip-fmv`, `later-fmv`, `cinematic-adventures`, `related-history`, `arcade-only`, `unreleased`, `review`, or `compilation`.
- `qualifyingYear`: earliest established released core-FMV date, including an explicitly sourced original arcade date where needed. This is not necessarily the first non-FMV release in a family.
- `firstCatalogReleaseYear`: earliest released year recorded in the catalog, distinguished from qualifying format history.
- `consumerKeys`: reviewed released consumer versions and reviewed compilation routes; does not imply stock, language suitability or capture success.
- `reviewKeys`: editions still requiring classification review.
- `reason`, `originalYearSources`, `checked`, `qualityGate: false`.

Each constituent game is one eligible catalog entry; it becomes a series target only when explicitly selected. A compilation is a route, not another obligation. The UI resolves compilation eligibility through its constituent scopes while displaying its compilation status. A family can qualify while one of its editions remains hybrid, unreviewed or otherwise ineligible.

The [machine-readable baseline](../data/rip-fmv-scope.json) includes every catalog family and scope total. The eligibility checklist is a finite, dated catalog baseline; it does not automatically make every candidate a planned episode. Uncertain cases are a separate backlog; additions require an explicit evidence-backed decision and a regenerated baseline. It is not a worldwide completeness claim, an English-only list or a promise that every listed purchase route is currently obtainable.

## Independent editorial selection

`data/rip-fmv-series.json` maintains explicit per-game `selected` flags, chosen `releaseKey`, ordering and editorial `reason`. The initial selections are the32 existing episode-rotation games. Unlisted games default to not selected even when eligible. The generator validates every selected game and edition, then projects `lineage[gameId].ripFmv` with `selected`, `eligible`, `releaseKey`, `reason`, `order`, `checked` and `source`.

The legacy `scope.series: "rip-fmv"` token now means the pre-2000 consumer eligibility pool; it is preserved for existing links and scripts. It is not a selection flag. The main catalog labels it “Pre-2000 consumer FMV.” The separate `rip-fmv.html` page reads only explicit selections and reuses the shared game guides. Eligible games not selected remain candidates in the catalog; there is no quality, review-score or ownership threshold for selection.

To add/remove a series game, edit the editorial manifest and regenerate with `python3 tools/classify.py`. A selected game must have a valid eligible consumer release and an editorial reason. If changing the production rotation, update both the rotation and selection manifest deliberately. No published episode or successful capture is inferred from selection or a planned slot.

## FMV prominence score

The existing 0–10 score is retained as a legacy editorial prominence estimate, separate from format eligibility and quality:

| Score | Legacy rubric |
| --- | --- |
| 0 | No qualifying moving-video presentation established; inspect format/evidence for unknown scores |
| 1–3 | Introductory or incidental cutscene video |
| 4–6 | Substantial video within a broader conventional or mixed game |
| 7–8 | Video drives much of play, with other interaction |
| 9 | Predominantly video, often with independently controlled overlays |
| 10 | Essentially video-led play throughout |

These are not measured percentages or automatic definitions. Existing scores can disagree with newly reviewed categories and are retained as research history until separately reviewed. Structured classification controls this series checklist. Existing Titan formulas are not replaced by this classification task.

## Maintenance

1. Edit `tools/classification/reviewed.json` for format facts, or `data/rip-fmv-series.json` for independent editorial selections. Never reuse a stable release key for another game.
2. Run older catalog/play-guide importers first. The current rotation is authoritative; displaced `playGuide.rotation` entries are cleared when that importer runs.
3. Run `python3 tools/classify.py`. It regenerates release classifications, lineage scope, `data/rip-fmv-scope.json` and `docs/rip-fmv-checklist.md` without changing legacy game review scores or tracker state.
4. Run `python3 tools/classify.py --check`, `python3 -m unittest discover -s tools/classification`, and `node --test`.
5. Reconcile rotation edits against each selected release's `consumerKeys`. A restored game's current store price is a different research task; retain old price dates. Recalculate Titan scores separately after release/score changes under the existing repository workflow.

The index supports `?relationship=core` across all eras, `?series=rip-fmv` for eligible pre-2000 consumer candidates, and independent relationship, material, presentation, interaction and QTE filters. Each release guide exposes format facts, uncertainty, scope reasons and classification sources.

A shared “R.I.P. FMV eligible” badge marks qualifying games across catalog, timeline, ranking and guide pages. It is independent of the editorial selection flag. Family cards can qualify through a reviewed consumer edition; release-specific views require that particular edition to qualify. Badge tooltips explain the distinction and compilation routes. The dedicated series page continues to show only explicit selections.
