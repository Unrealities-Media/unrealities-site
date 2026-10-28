# Coverage: what the index holds, what was checked, and what is still outside it

Tom's rule for the index (October 2026): every FMV game with a reasonable footprint, good or hilariously bad, so he can see the whole field before deciding what to buy and play. Titles that no usable source describes, or that cannot be obtained, can stay out. This page is the audit trail for that rule. Re-run it when a new source list turns up.

## Sources checked, and against what

| Source | Size | Result |
|---|---|---|
| [FMV World games list](https://fmvworld.com/games.html) (Wayback, Aug 2026; `tools/fetch/fmvworld/games_list.txt`) | 886 rows | 237 titles were not in the index; sorted in `tools/pc/fmvworld_gaps.md`, the worthwhile ones added in `tools/pc/batchM.py` |
| [fmvgo.com directory](https://fmvgo.com/directory/) (Steam games with FMV as a principal tag, 25+ reviews) | 331 | All in or excluded (`tools/pc/batchL.py`, `tools/pc/excluded.md`) |
| Steam FMV tag (18594) by release date, Jan–Oct 2026 | ~60 | Same |
| [TV Tropes: FMV Game](https://tvtropes.org/pmwiki/pmwiki.php/Main/FMVGame) | 157 examples | 20 missing, all now in or listed below |
| Wikipedia [Full-motion video](https://en.wikipedia.org/wiki/Full-motion_video) and [Interactive film](https://en.wikipedia.org/wiki/Interactive_film) | ~110 titles | 3 missing (Tomb Raider: The Action Adventure DVD, Point of View DVD, Rollercoaster 1982), listed below |
| [gg.deals FMV lists](https://gg.deals/games/xbox/fmv-games/) (Xbox 85, PC 1,918) | — | Xbox list checked in full: all are ports of PC records or non-FMV; the PC list is too noisy to use (any game with the tag, DLC and bundles) |
| MobyGames FMV group | — | Blocked from the cloud (Cloudflare); its titles reach us through FMV World and fmvgo |
| Sega Retro FMV page | — | Blocked from the cloud (Anubis); the Sega CD list below is from memory, to verify by capture |

Per-system candidate lists from the original builds (Wikipedia platform lists, PriceCharting console listings, MobyGames) are in each `tools/<system>/` folder with the batches.

## Systems in the index and their rule

Sega CD, 3DO, CD-i, Jaguar CD, CD32 (with CDTV), laserdisc arcade, LaserActive, TurboGrafx-CD, Bandai Playdia, PC-FX (notable only), Pippin (notable only): everything with streamed video, even cutscenes-only. Later consoles (Dreamcast to Switch, one catch-all system): console-only FMV games with no PC or DVD record. PlayStation, Saturn, PC, Macintosh: core FMV (`fmv` ≥ 4) plus notable cutscene titles. DVD: set-top DVD games. The scope files are `tools/pc/SCOPE.md`, `tools/ps1/SCOPE.md`, `tools/dvd/SCOPE.md`, and the exclusions are in each system's `excluded.md`.

## Added by this audit (October 2026, `tools/pc/batchM.py`)

- **PC, 1991–2000 (41):** Flash Traffic: City of Angels, Are You Afraid of the Dark? The Tale of Orpheo's Curse, D.A.: Pursuit of Justice, Golden Gate, Commander Blood, Bloodwings: Pumpkinhead's Revenge, Reelect JFK, Isis, Connections, Paparazzi!: Tales of Tinseltown, Mode, Piper, Chaos: A Fantasy Adventure Game, Eraser: Turnabout, Soldier Boyz, Wing Nuts, Santa Fe Mysteries: Sacred Ground, The Vampire Diaries, Who Is Oscar Lake?, Treasure Quest, Muppets Inside, Multimedia Celebrity Poker, Rolling Stones: Voodoo Lounge, Virtual Corporation, Beyond Time, Synnergist, The Sacred Pools, The Sacred Mirror of Kofun, The Improv Presents: Don't Quit Your Day Job, Foul Play, Who Killed Taylor French? (PC), Maabus, The Museum of Anything Goes, Dust, Jump Raven, RedJack, Virtual Nightclub, Gag: The Impotent Mystery, Hamlet: A Murder Mystery, Gothos, Vikings; cutscene titles William Shatner's TekWar, Terra Nova and SimCity Enhanced CD-ROM.
- **PC, 2001 and later (18):** Zelenhgorm, Conspiracies, Evidence: The Last Ritual, Yoomurjak's Ring, MIAZMA, Casebook, Fate by Numbers, Darkstar: The Interactive Movie, Cloud Chamber, Sarah Is Missing, The 13th Doll, Headspun, Doctor Who: The Lonely Assassins, Train to Sachsenhausen, The Invisible Guardian, What The Dub?!, RiffTrax: The Game, Obduction.
- **Sega CD (8):** Star Strike (Good Deal Games release of the Digital Pictures game), The Terminator, Hook, Mary Shelley's Frankenstein, Ultraverse Prime, Bill Walsh College Football, Joe Montana's NFL Football, Urusei Yatsura: Dear My Friends.
- **PlayStation and Saturn:** Super Adventure Rockman (both), Scandal (PlayStation, 2000).
- **Macintosh:** Puppet Motel.

Facts the cloud could read (Wikipedia, a few MobyGames pages) are quoted; the rest is marked `(verify)` in the records. Prices and MobyGames scores come from the PC fetches (`tools/scores/fetch_others.py --prices`, `tools/scores/fetch_scores.py`), which run on Tom's PC.

## Looked at and left out

Named by a source list but not added, with the reason. Any of these moves in with a batch entry.

**PC 1991–2000**
- Edutainment with video but no game to speak of: Wyatt Earp's Old West (Grolier encyclopaedia tour, Dragon 2.5/5), Virtual Surgeon: Open Heart (surgery course), The Jungle Book: Legend of Mowgli, Treasure Island Interactive, The Secret of Googol, Wonders of Electricity, San Diego Zoo Presents: The Animals!
- Audio only: Terror T.R.A.X.: Track of the Vampire (TSR audio-CD game).
- Digitized stills or sprites rather than video: Amazon: Guardians of Eden, Bargon Attack, Companions of Xanth (cartoon), 9: The Last Resort and Alien Odyssey (pre-rendered CG), Chess Wars.
- Cutscene titles under the tight PC rule: EarthSiege 2, Stonekeep, The Elder Scrolls II: Daggerfall, Skynet, KKND, Battle Isle 3, Jane's Longbow and Longbow 2, Jungle Strike (DOS), Mary Shelley's Frankenstein (PC), Cadillacs & Dinosaurs (PC), Island Peril, Steel Reign (PS1), Gamera 2000 (PS1), Dragon Force (Saturn), Formula One: Beyond the Limit (the Sega CD record is Heavenly Symphony), ESPN Extreme Games (PS1).
- No English release: Inspektor Zebok, Akte Europa, Shine, Soul Hunt, Space Marines, ranTrainer 1–2 (German); Area D, Kuroki Shi no Kamen, Anime Freak FX 1–3 (Japan; PC-FX rule); Kuusou Kagaku Sekai Gulliver Boy (Saturn/PC Engine CD, anime, Japan; worth a Saturn look later).
- Could not be verified from any source the cloud reaches: C.I.T.Y. 2000, Mirage (1995), Ghosts (1995), What's My Story?, Weird: Truth Is Stranger Than Fiction, Outpost 69, Touring Car Champions, Blackout (1997), Bombmeister (unreleased), The Adventures of Pinocchio. Add if Tom knows them.
- Already considered in earlier passes: Team Xtreme: Operation Weather Disaster and Eco-Nightmare, Shootout at Old Tucson, Zombie Dinos, Speed, Agile Warrior, Project: Horned Owl, Steel Harbinger, Voice Paradise, Judge Dredd, Riven, Hardwar, BoomBots, Sherlock Holmes DVD, Top Gun, Ripley's, Shanghai: Great Moments (see the system `excluded.md` files).

**2001 and later**
- No English: Viy (2004) and Bumer 2 (2006, Russia), Erevos (2002, Greece), Les Aventures du Chevalier Jack (France), Bank Run (2010), Hero of Shaolin (2013), Hell's House (2011).
- Mobile or app only: Hysteria Project 1–2 (iOS/DSiWare), Sherlock Holmes: Consulting Detective (iOS), Are You Smarter Than a Cheerleader?, Stitchers: Hack the Case, Your Pizza Adventure, The Hunting, Final Cut: Death on the Silver Screen, Dark Dimensions: Wax Beauty, Dark Alleys and Suburban Mysteries (hidden-object casuals).
- Small indies with no wider coverage (Steam under about 400 reviews, no press): Liar's Dice, Adventures at the Center of the Earth, Blaming Tim's Relapse Adventure, Relics: Dark Hours, Sword and Hammer, The Wavy Tube Man Chronicles, Top Secret Finders, Fright, A Stranger Comes Calling, The Awkward Steve Duology, Don't Turn Your Back On The Ocean, How To Shoot a Criminal, There's a Genie in My Szechuan Sauce, AVC's Survival Guide, Daemon_9, ECHOPLEX, Moral King, Yeli Orog, Jen's Adventure, Visitor2, after HOURS, Cryptex, General Horse, BorderCollie Game, Deluded, Howdy Jacob!, Internet Court, Lost Angel, PCI Public Crime Investigation, Recontact London, Universe Generator, Vegas Tales, Willage, The World After, AWK, Agarta, Case Files 1–2, First Date: Late to Date, Grinded Meat, HUSH - Crane, I'm in Love With Your Dead Grandmother, It's On You, John Fart, Single Player: Horror, Space Quest: 2099, Underworld Island, Sheesh-Man, Criminal Expert, Cuttlefish, SPIDER MALL!, Metron (2004); plus the ones in `tools/pc/excluded.md` (Stay Dead, Jessika, Markus Ritter, Interrogation Files, Hijacker Jack, Morph Girl, Squad 51, A Trip to Yugoslavia, Truth, Visitor, The List).
- Not video: Japanese Rail Sim series (cab footage, no game), Henry Stickmin (animation), Steins;Gate Elite and School Days (anime visual novels; the PC-FX/PS1 anime rule does not reach PC), Asura's Wrath, Master Detective Archives.
- Streaming and TV interactive: Bandersnatch, Carmen Sandiego, Cat Burglar, the Chad Matt & Rob YouTube series; VHS/VCR board games (Clue VCR, Nightmare, Star Wars VHS, .38 Ambush Alley, California Games) are listed by FMV World but are not console or computer games.

## Systems added after the audit (October 2026, `tools/new_systems_2026_10.py`)

Tom asked for every FMV game on every system, buying hardware where needed, so the systems the audit had listed as gaps went in:

- **TurboGrafx-CD (`tgcd`, 4):** It Came from the Desert, Sherlock Holmes: Consulting Detective Vol. I and Vol. II (joined to the Sega CD, PC, Mac and CD32 records by gameId), John Madden Duo CD Football. The rest of the US library is drawn cutscenes; `tools/tgcd/excluded.md`.
- **Bandai Playdia (`playdia`, 33):** every retail disc, since the console plays nothing but branching video: the two Dragon Ball Z chapters, Ultraman Powered, Ultra Seven, Gamera: The Time Adventure, Ie Naki Ko (VAP), the Sailor Moon quiz, and the lesson, encyclopedia and voice-actress discs (categories Game show / trivia and Non-game video). All Japan-only imports; the six BS-xxx promotional discs are in `tools/playdia/excluded.md`. Facts for most discs are inferred from the title and marked (verify); the DBZ, Ultra Seven and Gamera discs have sources.
- **Later consoles (`console`, 6):** D2 (Dreamcast), The Fear (PS2), Blood: The Last Vampire (PS2/PSP), Scene It? Lights, Camera, Action (Xbox 360, sequels as variants), Guitar Hero Live, Closed Nightmare (PS4/Switch). What stayed out (game-show discs, re-releases, train simulators, mobile) is in `tools/console/excluded.md`.
- **DVD (2):** Point of View (2001, David Wheeler's interactive DVD film) and Tomb Raider: The Action Adventure (2006, Bright Things).
- **PC (1):** Steins;Gate Elite (2019, the anime-footage visual novel).

A culture check on 2026-10-25 (about 230 well-known FMV titles named from memory, checked against the index) found four more: Bureau 13 (PC, 1995, digitised actors), The Space Adventure: Cobra (Sega CD, 1995, under the small-library rule), The Crow: City of Angels (PlayStation and Saturn, 1997, film-clip cutscenes and a worst-games fixture) and a title fix (Sara Is Missing, not Sarah). Everything else on that list was already in or already in an excluded.md.

Still outside the index, and why: mobile games (no disc or console); Tandy VIS, FM Towns, PC-98 and Apple II laserdisc (named in the laserdisc and PC scope notes, out unless Tom asks); the Japanese PC Engine CD-ROM² library beyond the US discs (not surveyed, NA first); Buzz!, Jeopardy! and Wheel of Fortune console discs with host video (game-show garnish).

## Sega CD: cutscene discs to verify by capture

The Sega CD rule is "everything with streamed video", and the index has 79 Sega CD records. These US and Japanese discs have animated or filmed intros that may be streamed video or may be tile animation with CD audio; they were not added without a look: Final Fight CD, Eternal Champions: Challenge from the Dark Side, Wonder Dog, Keio Flying Squadron, Popful Mail, Vay, Dark Wizard, Shining Force CD, Sol-Feace, Robo Aleste, Android Assault, Lords of Thunder, Earnest Evans, Annet Futatabi, Yumimi Mix, Nostalgia 1907, Aisle Lord, Cosmic Fantasy Stories, Prince of Persia (CG intro), AH-3 Thunderstrike, Soulstar and Stellar-Fire (CG), Lethal Enforcers (digitized photos), Batman Returns (no video, verify), Snatcher (in-engine, considered). Sega Retro's FMV category would settle most of these; it is blocked from the cloud, so run `tools/fetch/scripts/` on the Mac or check the page by hand.

## Core FMV audit and current purchase reconciliation (October 25, 2026)

The follow-up [core FMV audit](fmv-audit.md) prioritizes releases through 2024, with current purchase routes rather than a historical purchase cutoff. It reconciles 24 researched gaps against current main: 12 already covered, 12 added in `tools/pc/batchP.json`. Existing broader and later records remain. Source records, exact Steam product checks and decisions are in `tools/audit/`; updated scores, capture routes and inventory are derived from the combined catalog. Specific new decisions supersede earlier exclusion notes for the named titles.
