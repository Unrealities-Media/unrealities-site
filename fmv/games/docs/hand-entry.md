# What Tom can fill in by hand

Counts as of 2026-10-25. Everything below either needs your Mac (the cloud can't reach the site) or needs you (no source online settles it).

## 1. Run on your Mac

From your fmv-games checkout, after `git pull`. Each pair fetches, then writes `data/games.json`. Commit and push what changes, or tell Claude it's done and it will pick the files up.

| What | Command | Fills |
|---|---|---|
| PC prices and MobyGames scores | `python3 tools/pc/fetch_pc.py && python3 tools/pc/apply_fetched.py` | 152 PC records with no price (49 of the 50 from 2001 on among them); this one has never run |
| Prices and scores for every other system | `python3 tools/scores/fetch_others.py && python3 tools/scores/apply_others.py` | last run 2026-10-23, before the CD32 additions; a re-run picks up the 7 new CD32 records and retries the rest |
| Speedrun.com boards | `python3 tools/speedrun/fetch_boards.py && python3 tools/speedrun/apply_speedrun.py` | the 24 games in `boards.json`; `fetched.json` holds hand-copied numbers until this runs |
| Evidence for verify flags | `python3 tools/verify/fetch_evidence.py` | saves source pages for records that have none yet into `tools/fetch/verify/`; Claude reads them and clears what they settle |

Not fetchable anywhere: DVD games (PriceCharting has no DVD console), most Mac discs (its Macintosh console lists about 110 items), and the Japanese PlayStation and Saturn imports it doesn't list. For those, use the price sheet below. Hardware prices (a 3DO for the capture plan) aren't in the index; look the console up on PriceCharting and say the number in the project, and it goes in `docs/capture-plan.md`.

## 2. Only someone who played it can say

2,724 flags across 787 records still say "verify". The ones a source won't settle, by field:

| field | flags | top 30 |
|---|---|---|
| video (resolution, frame rate, screen size) | 503 | 64 |
| notes | 358 | 48 |
| variants (regional and edition differences) | 256 | 41 |
| endings | 248 | 8 |
| cast | 227 | 9 |
| peripherals (light gun, mouse, PC minimum spec) | 223 | 29 |
| save | 182 | 17 |
| length | 109 | 1 |
| difficulty | 79 | 1 |
| cheats | 76 | 15 |

Smaller: modern 90, wherePlay 88, cidTrigger 56, alsoOn 50, trivia 48, publisher 44, developer 36.

The easy way is a spreadsheet:

```
python3 tools/hand_entry.py flags --top 30          # or --system 3do, --field video,save,endings
# open hand-flags.csv in Numbers, fill `new` (and `source` if it isn't "I played it"), export as CSV
python3 tools/hand_entry.py import hand-flags.csv --dry-run
python3 tools/hand_entry.py import hand-flags.csv
```

Write `ok` in `new` when the current text is right and its only flag is a "(verify)" or a trailing "— verify"; 1,425 flags are like that. Anything else needs the value written out. Each row lands in `tools/verify/cleared.json` with its source, and in the system's `overrides.json`, so later pipeline runs keep it. Rows left blank are skipped, so fill a few after each recording session and import again.

## 3. Your own tracker

Only four discs are marked owned (Double Switch, Prize Fighter, Ground Zero Texas and Who Shot Johnny Rock? on Sega CD), nothing is marked played, and no speedrun attempts are logged.

```
python3 tools/hand_entry.py tracker --system segacd   # one row per record
# mark owned with y, pick a format (Original disc, Repro/burned, Flash cart (ISO), Emulator, Other),
# add played, episode, attempts, clears, pb as you go
python3 tools/hand_entry.py import hand-tracker.csv
```

This writes `data/tracker.json` directly. If you've edited the tracker in the browser, use Download tracker in the site footer and commit that file first, or the browser edits stay local. After marking discs owned, re-run `python3 tools/play_today.py` so the capture routes say "you own the disc".

Missing prices work the same way: `python3 tools/hand_entry.py prices` lists the 335 obtainable records with no loose price (PC 152, Mac 82, DVD 25, PlayStation 21, Saturn 11, the rest a handful each). Fill `loose` (and `cib`, `new` if you know them) from PriceCharting or recent eBay sold listings, then import. A hand price is written to `overrides.json` and stays until you remove it there.

After importing flags or prices, re-run `python3 tools/titan.py`, `python3 tools/play_today.py` and `python3 tools/verify/inventory.py`.
