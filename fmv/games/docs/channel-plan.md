# R.I.P. FMV channel strategy v2

**October 27 series update:** The [current recording and acquisition plan](fmv-play-order.md) now sequences 32 productions for episode quality, with Tomcat Alley, Burning Soldier and Midnight Raiders as published practice episodes 1–3, Sewer Shark as the first major flagship at #5, and Dragon’s Lair at #12. Budget and current ownership no longer determine recording order. The strategy and episode formula below remain useful; earlier Season Zero ordering and spending priorities are superseded.

The [Tomcat Alley episode-one production brief](episodes/01-tomcat-alley.md) is ready for recording preparation: original Sega CD pad play, a campaign-completion challenge, optional personal speed-clear, capture plan and edit outline.

Titan ranks and catalog totals in this planning snapshot predate the October 25, 2026 audit. The site reads current scores and purchase routes from `data/games.json`.

The [Season Zero research briefs](season-zero-briefs.md) supply the current version comparisons, episode angles and capture checks for the six games below. They qualify historical version picks and correct the Tomcat Alley PC and Double Switch Saturn/platform claims. Tom owns a RetroTINK and HDMI capture card, but has recorded nothing yet; all six capture tests are pending. Leaderboard numbers below remain dated snapshots.

Oct 24, 2026 · Tom. Copy of the [Claude Doc](https://claude.ai/artifact/8o4b87ajZNqZ5U3xGcW5xK). This is the current channel plan; it replaces [season-1-plan.md](season-1-plan.md).

Tom's Strategy v2 is the better channel and this version adopts it whole: comedy first, speedrunning as the engine, the index underneath. The every-version plan from the first version of this doc survives as the Port Problems pillar and as a later laserdisc milestone, not as the spine.

Five changes from checking it against the data:

1. **Only three of the six Season Zero games have a Speedrun.com board** (Sewer Shark, Wirehead, Double Switch). Sherlock Holmes, Tomcat Alley and Microcosm become personal speed-clears with rules written before the first attempt, which fits their "provisional" label.
2. **Lead with Sewer Shark and Double Switch.** They rank 16 and 14 of 548 on the Titan score; Wirehead ranks 322, so its title has to sell the "two people have run this" hook.
3. **Real hardware is the gap on the boards.** The top Sewer Shark and Night Trap runs and one of the tied Double Switch leaders ran on emulators, so a timed run on a real Sega CD is something new, not a lesser copy.
4. **Use the reviewed pre-2000 FMV scope to define the set.** Titan score and board availability can inform episode order, but never exclude a qualifying bad game.
5. **Add the speedrunning fields as a proposal** in two places: public board facts per game in `games.json`, personal attempts per release in `tracker.json`.

## October 28 scope decision

The separate [R.I.P. FMV section](../rip-fmv.html) contains games explicitly flagged as series selections. The [pre-2000 eligibility checklist](rip-fmv-checklist.md) is the wider candidate pool, one entry per family. Eligibility and editorial selection are independent; the existing32 episode choices seed `data/rip-fmv-series.json`. It includes consumer ports of 1980s arcade FMV games and later footage-preserving restorations. Quality is never an eligibility gate. Core FMV, hybrids, cutscene games, non-game discs and real-time cinematic adventures are classified separately in the shared database. Modern FMV originals and Telltale-style cinematic adventures are reserved for other series; historical arcade-only and unavailable projects have separate appendices. The [32-game opening rotation](fmv-play-order.md) now replaces Her Story with Double Switch at #31. Earlier leaderboard counts and strategy examples below remain dated historical research.

## 1. The premise

**Tagline:** *Bad movies. Worse controls. One very unnecessary stopwatch.*

R.I.P. FMV is a comedy-driven retro gaming channel about playing, beating and sometimes speedrunning the bizarre full-motion video games first released before January 1, 2000, including their later consumer ports and footage-preserving remasters, on original hardware where possible. The host treats games that barely qualify as games with absurd seriousness.

**The central question isn't "Is this game good?" It's "Can I beat this ridiculous thing, and how fast?"**

## 2. The three pillars

| Share | Pillar | What it is | Example titles |
| --- | --- | --- | --- |
| 60% | **Race to the Credits** (flagship) | Pick a game, try to beat it, research the fastest route, practise, make a timed attempt. A record is not required; an entertaining journey is. | Can I Speedrun Sewer Shark on a Real Sega CD? · Two People Have Speedrun Wirehead. I Want In. |
| 25% | **Port Problems** | Beat the same game on several systems. Does better hardware help? Which controls offend the hands least? This is where the index's version data and recommended picks pay off. | Sega CD vs. 3DO: Which One Tortures Me Less? · Seven Versions of One Game. Somehow None Agree. |
| 15% | **FMV Crimes** | Specials: music-video games, strange peripherals, games with no real ending, arcade cabinet visits, historical mysteries. | Can You Actually Beat a Make My Video Game? · These Arcade Games Expected Me to Shoot Real Actors |

Port Problems candidates come straight from the index: 162 of 548 games exist on two or more systems, and Dragon's Lair and Space Ace each have seven versions. The arcade road trip from the first version of this plan becomes an FMV Crimes special (venues in section 6).

## 3. The episode formula

Target 10 to 18 minutes, set by the story. Every episode has a beginning, middle and end whether or not a record falls.

| Segment | Purpose |
| --- | --- |
| Cold open, 0:00–0:30 | An absurd failure, shocking mechanic or ridiculous FMV scene |
| The mission | The game, the hardware, the challenge, and its index card (year, developer, Titan rank, board or no board) |
| First attempt | Blind, without the optimal route |
| Investigation | Mechanics, strategies, secrets and history, from the index and the board's guides |
| Training montage | Practice and repeated failure, condensed into comedy |
| The run | The timed attempt or completion challenge, with a real clock |
| Final verdict | Outcome, the R.I.P. Scoreboard, and the version to play when the index has a pick |

## 4. The comedy

An overconfident player treats obsolete interactive movies like championship sport. Start with one or two recurring bits and add others as they earn it: the **R.I.P. Scoreboard** (PB, attempts, failures, outcome) is the natural first, because it doubles as the data the index records. Keep it affectionate; when a game turns out good (Sherlock Holmes might), celebrate it.

The Sewer Shark route is the model joke: the fastest strategy means deliberately earning worse grades and missing a set number of enemies to skip scenes. "I've spent three hours learning to shoot these enemies. The optimal strategy is to be worse at my job."

## 5. Speedrunning rules

Speedrunning is the dramatic engine, not a requirement. Every featured game gets one classification:

- **Official speedrun:** a Speedrun.com board and category exist. Follow its rules, record the full attempt, submit when eligible.
- **Personal speed-clear:** no board, but a measurable finish. Write the start, finish, hardware, difficulty and timing rules before the first attempt.
- **Completion challenge:** speed isn't meaningful or the game can't be conventionally beaten. Set a different challenge and name it accurately.

Where any% cuts the content that makes the game funny, run the story category and say why (Night Trap's any% is a 16-way tie at 2:20; its Best Ending board is the episode). Keep results apart by hardware, emulation and timing method, and never call an unofficial time a record.

### The Speedrun.com check

Season Zero first, then the Titan top 20 in rank order. Depth counts runs on the game's board: thin 1–4, light 5–49, deep 50+. Checked 2026-10-24 from the game pages; "none found" means neither the likely page address nor a web search turned up a board, and the site's API is blocked from here, so confirm on the site before an episode claims to be the first.

| Game | Titan rank | Class | Board | Categories and depth | Top time |
| --- | --- | --- | --- | --- | --- |
| Sewer Shark | 16 | Official | [sewer\_shark](https://www.speedrun.com/sewer_shark) | Beat the game; thin (4 runs) | 32:21, TascoDLX, Sega CD emulator |
| Wirehead | 322 | Official | [wirehead](https://www.speedrun.com/wirehead) | Clear Any%; thin (2) | 17:51.783, sharif, Sega CD |
| Sherlock Holmes Vol. I | 11 | Speed-clear | none found | — | rule: one case, case select to Holmes' verdict |
| Tomcat Alley | 94 | Speed-clear | none found | — | rule: new game to credits, default difficulty |
| Microcosm | 34 | Speed-clear | none found | — | rule: power-on to credits, default difficulty |
| Double Switch | 14 | Official | [double\_switch](https://www.speedrun.com/double_switch) | Any%; light (9) | 26:21, tie: SmoothCriminal12 (PC), ForestOfWires (Sega CD emulator) |
| Dragon's Lair | 1 | Official | [Dragons\_Lair\_1983](https://www.speedrun.com/Dragons_Lair_1983), [dragons\_lair\_3do](https://www.speedrun.com/dragons_lair_3do) | Arcade, Home Versions; thin (4) · 3DO Any%; thin (3) | 10:35, apeezy52, arcade emulator · 10:22, The\_Retro\_Challenger, real 3DO |
| Night Trap | 2 | Official | [night\_trap](https://www.speedrun.com/night_trap) | any%, Best Ending; light (30) | any% 2:20, 16-way tie |
| Space Ace | 3 | Official | [space\_ace](https://www.speedrun.com/space_ace) | Arcade/PC tab; the board is mostly the SNES game; light (7) | Arcade/PC time not shown |
| Mad Dog McCree | 4 | Official | [mad\_dog\_mccree](https://www.speedrun.com/mad_dog_mccree) | Any%; light (5) | 8:14, SuperBlackWhite, Wii emulator |
| Road Avenger / Road Blaster | 5 | Official | [road\_blaster](https://www.speedrun.com/road_blaster) | Normal Any%, Hard Any%; thin (1) | not shown |
| Star Wars: Rebel Assault | 6 | Speed-clear | none found (only Rebel Assault II has one) | — | — |
| D | 7 | Speed-clear | none found | — | the game's own two-hour limit is a built-in clock |
| Time Gal | 8 | Official | [time\_gal](https://www.speedrun.com/time_gal) | Arcade Default/Hardest/Any%, Sega CD Default; light (6) | Arcade 11:09.097, DBcade (iOS) · Sega CD 12:37, sharif |
| Wing Commander III | 9 | Completion | none found (the only board is the first Wing Commander) | — | four discs; finish the story, track deaths |
| Phantasmagoria | 10 | Official | [phantasmagoria](https://www.speedrun.com/phantasmagoria) | Any%, chapter levels; deep (64) | 5:12.233, darkshoxx, PC |
| Cobra Command | 12 | Speed-clear | none found (the site's Cobra Command is the 1988 NES game) | — | — |
| Gabriel Knight 2 | 13 | Official | [gk2\_tbw](https://www.speedrun.com/gk2_tbw) | Any%, 100%; light (20) | 24:56, mikeSpeedyAdventures, DOS emulator |
| Dragon's Lair II | 15 | Official | [Dragons\_Lair\_II\_Time\_Warp\_1991](https://www.speedrun.com/Dragons_Lair_II_Time_Warp_1991) | Original, Director's Cut; thin (1) | 9:53, Gutsan |
| Mad Dog II | 17 | Speed-clear | none found | — | — |
| The 7th Guest | 18 | Official | [the\_7th\_guest](https://www.speedrun.com/the_7th_guest) | Any%, All Puzzles, no-skip and 25th Anniversary variants; deep (68) | 4:24, darkshoxx |
| Brain Dead 13 | 19 | Speed-clear | none found | — | — |
| Corpse Killer | 20 | Speed-clear | none found | — | — |

Thirteen of the 23 have a board, and only two are deep (Phantasmagoria and The 7th Guest, both PC). Nine boards hold fewer than ten runs, so a clean real-hardware run would put the channel on the first page of most of them.

## 6. Season Zero: six experimental episodes

Chosen to learn the production process, not to win opening week. Not promoted as a numbered season; each stands alone. All six are Sega CD, all rated Low for Content ID, and the five you don't own cost about $134 CIB together.

| # | Game | Experiment | Class | Titan rank | CIB (owned?) |
| --- | --- | --- | --- | --- | --- |
| 1 | **Sewer Shark** | First real-hardware speedrun, finding the voice | Official | 16 | $39 |
| 2 | **Wirehead** | Branching choices, rapid attempts, leaderboard competition | Official | 322 | $46 |
| 3 | **Sherlock Holmes Vol. I** | Can a slow, dialogue-driven game carry a fast-completion challenge? | Speed-clear | 11 | $10 |
| 4 | **Tomcat Alley** | Action gameplay and speed-clear experiments | Speed-clear | 94 | $19 |
| 5 | **Microcosm** | Mechanics, technical limits, version differences | Speed-clear | 34 | $20 |
| 6 | **Double Switch** | The mature format against a bigger board | Official | 14 | $21 (owned) |

Upload order in [launch-roadmap.md](launch-roadmap.md) moves Double Switch to second, because Tom owns it and it ranks far above Wirehead; the table keeps the original numbering. Episodes 3 to 5 stay provisional until their rules and production needs are tested. Microcosm is also the first Port Problems candidate: five versions in the index (Sega CD, 3DO, CD-i, PC, CD32).

Reserve Dragon's Lair, Space Ace, Night Trap and Mad Dog McCree as milestone episodes for when the host, edit and capture process are comfortable.

Arcade venues for the FMV Crimes road trip, from the index's dated sources: Galloping Ghost, Brookfield IL (Dragon's Lair, Dragon's Lair II, Space Ace, Cobra Command and four arcade-only games; 2018 source) and Funspot, Laconia NH (Dragon's Lair, Dragon's Lair II, Space Ace, Astron Belt, Us vs. Them; undated). Call ahead before travelling.

## 7. After Season Zero

Pick each next game with the Titan score, filtered by what is playable now: the highest-ranked game you can run on hardware you own, preferring a thin board where a real-hardware run would place. On the Sega CD that gives the next batch almost by itself:

| Next | Why | Class |
| --- | --- | --- |
| Road Avenger (Titan 5) | One run on its whole board | Official |
| Time Gal (8) | The Sega CD category has a single run | Official |
| Mad Dog McCree (4) | Five runs, top one on a Wii emulator; Menacer vs. Justifier is its own joke | Official |
| Night Trap (2) | Milestone; run Best Ending, not the 2:20 any% | Official |
| Cobra Command (12) | No board for the laserdisc game | Speed-clear |

**The laserdisc family is the long-term milestone.** Dragon's Lair (Titan 1, seven versions), Space Ace, Cobra Command, Road Blaster, Time Gal, Mad Dog McCree and the other arcade originals become a Port Problems arc once the format is settled, ending with the Dragon's Lair event episode and the arcade road trip. The 15-game lineup, version counts and recommended picks from the first version of this doc still stand for that arc; it is in this doc's history.

## 8. Hardware

Original hardware is a defining feature, not an obstacle to publishing. Start with the Sega CD setup and film the console, controllers, discs and boot as part of the show. Use emulation for research, practice, rare systems and missing versions, and say so on screen.

Don't buy a 3DO, CD-i or LaserActive for a roadmap; buy when an episode justifies it. When that day comes, the 3DO is the likely first: it is the index's recommended version for 15 of the 28 games that have a pick, and Dragon's Lair has a 3DO-only board.

## 9. Publishing

- One long video every two to three weeks, with two or three finished before the first goes up.
- One or two Shorts per episode, only where a clip has a self-contained payoff.
- No opening documentary about FMV history: the first challenge video establishes the concept.
- Titles carry the game, the challenge and the joke; season numbers and branding stay out of the hook. Put the board and time in the description's first line, e.g. "Sewer Shark, Sega CD (real hardware). Beat the game: \<time>. Board: speedrun.com/sewer\_shark".

## 10. The FMV Games Index

The index stays the factual backbone and companion site, comprehensive even when the videos are selective. Each episode links its game's page (`timeline.html#<gameId>`), and the game's page links back once the tracker has a video URL.

### Proposal: speedrunning fields

Two homes, because the facts have two owners. Board facts belong to the game and are refreshed by a script, like the Titan score. Attempts belong to you, are per release (console and version), and are edited in the browser like the rest of the tracker. Not built yet; this is the spec for a PR.

**1. `data/games.json`: `lineage[<gameId>].speedrun`** (game level, beside `best` and `titan`; never on game records)

```json
"dragons-lair": {
  "best": "3do-13",
  "titan": { "...": "unchanged" },
  "speedrun": {
    "class": "Official",
    "boards": [
      { "url": "https://www.speedrun.com/dragons_lair_3do",
        "name": "Dragon's Lair (3DO)",
        "keys": ["3do-13"],
        "runs": 3,
        "categories": [ { "name": "Any %", "wr": "10:22", "wrRunner": "The_Retro_Challenger", "wrPlatform": "3DO" } ] }
    ],
    "rules": "",
    "checked": "2026-10-24"
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `class` | Official · Speed-clear · Completion | Official whenever a board exists; otherwise set by hand |
| `boards[]` | list | One per Speedrun.com game page; Dragon's Lair has two (arcade and 3DO) |
| `boards[].keys` | record keys | The releases the board accepts; left out = every version |
| `boards[].runs` | number | Total runs on the board; depth (thin, light, deep) is derived, not stored |
| `boards[].categories[]` | list | name, `wr` (h:mm:ss.mmm), `wrRunner`, `wrPlatform` |
| `rules` | text | For Speed-clear and Completion: start, finish, difficulty, timing |
| `checked` | date | When the board was last read, like `priceDate` |

Pipeline: `tools/speedrun/boards.json` (gameId → board URLs, plus hand-set class and rules) → `tools/speedrun/fetch_boards.py` reads Speedrun.com's API on your Mac (it is blocked from the cloud) → `apply_speedrun.py` writes the lineage blocks.

**2. `data/tracker.json`: per record key** (beside owned, played, episode, videoUrl)

| Field | Type | Meaning |
| --- | --- | --- |
| `challenge` | text | Category and rule set, e.g. "Beat the game (Speedrun.com rules)" |
| `capture` | Original hardware · FPGA · Emulator: name and version | How the run was played and recorded |
| `attempts` | number | Attempts started |
| `clears` | number | Attempts completed |
| `pb` | h:mm:ss.mmm | Personal best under `challenge` |
| `lastClear` | date | Latest completed attempt |
| `srcRun` | URL | The run as submitted to Speedrun.com, once verified |
| `srcPlace` | text | Place and date, e.g. "3 of 5, 2026-11-02" |

The existing `videoUrl` covers the episode link. On the site: a Speedrun block in each drawer (board, WR, your PB), an index filter for games with a board, and later a R.I.P. FMV challenge leaderboard page.

## 11. Success measures

Judge the first six episodes on four things, and don't read low early views as failure:

1. **Entertainment:** are viewers watching the story, reacting to the jokes, asking for more?
2. **Sustainability:** can an episode be made without becoming a second full-time job?
3. **Format discovery:** which creates the best moments: the clock, the hardware, or the commentary?
4. **Enjoyment:** do you like recording, practising, writing and editing this?

Review after six, then decide on the next batch.

## 12. Long-term vision

R.I.P. FMV becomes the home of an ongoing, mildly insane attempt to master gaming's forgotten interactive movies. Milestones: the first verified board placing, the first game beaten on three original consoles, the first laserdisc arcade challenge, the first viewer-suggested game, the first collaboration with an established runner, and the Dragon's Lair event episode.

The goal is not 548 videos because the index holds 548 games. **It is an entertaining channel whose unusual subject happens to be FMV games.**

## Sources

- Tom's R.I.P. FMV Channel Strategy v2 (2026-10-24), for the structure, pillars, rules and voice
- The FMV Games Index, `data/games.json`, `data/tracker.json` and `tools/laserdisc/cabinets.json` in Unrealities-Media/fmv-games at the PR 18 merge (Titan scores and ranks, version counts, picks, prices, venues)
- Speedrun.com game pages, read 2026-10-24: [sewer\_shark](https://www.speedrun.com/sewer_shark), [wirehead](https://www.speedrun.com/wirehead), [double\_switch](https://www.speedrun.com/double_switch), [Dragons\_Lair\_1983](https://www.speedrun.com/Dragons_Lair_1983), [dragons\_lair\_3do](https://www.speedrun.com/dragons_lair_3do), [night\_trap](https://www.speedrun.com/night_trap), [space\_ace](https://www.speedrun.com/space_ace), [mad\_dog\_mccree](https://www.speedrun.com/mad_dog_mccree), [road\_blaster](https://www.speedrun.com/road_blaster), [time\_gal](https://www.speedrun.com/time_gal), [phantasmagoria](https://www.speedrun.com/phantasmagoria), [gk2\_tbw](https://www.speedrun.com/gk2_tbw), [Dragons\_Lair\_II\_Time\_Warp\_1991](https://www.speedrun.com/Dragons_Lair_II_Time_Warp_1991), [the\_7th\_guest](https://www.speedrun.com/the_7th_guest), [cobra\_command](https://www.speedrun.com/cobra_command) (NES game), [wing\_commander](https://www.speedrun.com/wing_commander), [Sherlock Holmes series](https://www.speedrun.com/series/sherlock_holmes)
- [Channel plan, first version](https://claude.ai/artifact/8o4b87ajZNqZ5U3xGcW5xK) (this doc's history) and the [Season 1 plan](https://claude.ai/artifact/S5uJpTXWSzrumW1AxagB1G)
