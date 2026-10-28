# How to play it today: the capture-route rules

Every game in the index has one capture route in `lineage[<gameId>]["playToday"]` of `data/games.json`: the cheapest sound way to get that game on camera with the hardware Tom owns or plans to buy. `python tools/play_today.py` writes it; the drawer shows it as the "To record it" line under How to play it. It is not the recommended version (`best`): best is the version worth playing, playToday is how to record it.

A route is a recommendation, not a successful capture test. For the six Season Zero games, `tools/season-zero/research.json` records pending short and sustained checks; the [briefs](season-zero-briefs.md) explain the acceptance procedure. Tom confirmed owning a RetroTINK and HDMI card on October 25, 2026, with no recordings yet. `kit.json` retains that report without inventing model numbers or working settings.

## Inputs

| File | What it holds |
| --- | --- |
| `tools/capture/kit.json` | Hardware: `owned` (the Sega CD tower: Genesis + Sega CD + 32X), `planned` (the 3DO), and the modern platforms (Windows PC, Switch 2, PS5; the PS5 plays PS4 games but no PS1 or PS2 discs) |
| `tools/capture/picks.json` | 35 hand picks: the Titan top 30, Season Zero, Firefox and Quarterhorse. A pick replaces the rule |
| `data/tracker.json` | Discs Tom owns (`owned: true`); an owned disc's route says buy Nothing |
| each record's `modern`, `wherePlay`, `access`, `status`, prices | What is sold today, what runs it, and what a disc costs |

## Fields

| Field | Values |
| --- | --- |
| `route` | Original hardware · Re-release · Emulation · Arcade · Not playable |
| `key` | The record whose disc or data is played |
| `on` | What to run it on, naming the console, store or emulator |
| `buy` | Disc · Digital · Nothing, with `owned: true` when the tracker has the disc |
| `price`, `priceDate` | Loose price of that record's disc, when buy is Disc |
| `why` | One sentence |
| `compare` | Optional second route, for port-comparison footage |
| `set` | hand (from picks.json) or rule |

## The rule, for games without a hand pick

First match wins.

1. Every version is lost or unreleased: **Not playable**.
2. Tom owns the Sega CD disc: **Original hardware** on the tower.
3. The recommended version is on another console he owns or plans to buy (the 3DO): **Original hardware**, "planned buy" until it arrives.
4. A laserdisc arcade original with a store re-release: **Re-release**, because it carries the arcade video; the Sega CD disc is the comparison.
5. The game has a Sega CD version: **Original hardware** on the tower, with any store re-release as the comparison.
6. Any version has a store re-release (the record's `modern` starts "Yes" and names Steam, GOG, Switch, PS4, PS5, Xbox One/Series, eShop, Epic, Microsoft Store, Game Pass, Limited Run, a 25th Anniversary edition or a remaster): **Re-release**.
7. A DVD game: **Original hardware**, a DVD player or VLC.
8. A released console or computer version: **Emulation**, preferring the recommended version, then an Easy disc over an import, then this emulator order: DOSBox-X/ScummVM/86Box (PC), DuckStation (PlayStation), Mednafen (Saturn), Opera (3DO), SheepShaver/Basilisk II (Mac), MAME cdimono1 (CD-i), BigPEmu (Jaguar CD), FS-UAE/WinUAE (CD32), Mednafen (PC-FX), ares (LaserActive), DingusPPC (Pippin), Genesis Plus GX (Sega CD).
9. A laserdisc game that Hypseus Singe or MAME runs: **Emulation** with the disc image; if only cabinets survive, **Arcade**.
10. Otherwise: **Not playable**.

## Keeping it current

- Bought hardware: move its system id from `planned` to `owned` (or add it) in `kit.json`.
- Bought a disc: mark it owned in the tracker (Download tracker → replace `data/tracker.json`).
- Found a re-release: put the record's `modern` text in `tools/<system>/overrides.json`, run `python tools/apply_overrides.py <system>`, then `python tools/titan.py` (reach counts modern re-releases), `python tools/play_today.py` and `python tools/re_releases.py`.
- A rule pick is wrong: add a hand pick to `picks.json`.
