# Season Zero version comparisons and episode briefs

Research checked October 25, 2026. The six games below retain version research and proposed capture checks; the [October 28 recording rotation](fmv-play-order.md) now governs episode order and the [finite checklist](rip-fmv-checklist.md) governs series eligibility. Use the Sega CD tower for these historical versions and buy comparison editions only when their differences serve the episode. Historical prices in the catalog remain dated snapshots, not current offers.

Tom confirmed on October 25 that he owns a RetroTINK and an HDMI capture card and has not recorded anything. **None of the six capture setups is tested yet.** The steps below are proposed acceptance checks, not successful test results. Equipment ownership does not establish a working capture chain.

## Recording setup and acceptance checks

Proposed chain: Sega CD tower → compatible analog video and audio cables → owned RetroTINK → HDMI capture card → recording computer and software. Record the Genesis/Sega CD models and region, cable and audio routing, RetroTINK model/firmware, capture-card model/driver, output mode, recording software/version, and saved recording profile before testing. OBS Studio is a suggested recorder, not software Tom has confirmed using.

Choose cables and output modes after identifying the equipment. For example, the [RetroTINK-2X Pro](https://www.retrotink.com/shop/retrotink-2x-pro) accepts composite, S-Video and component; that does not establish which inputs Tom's model has. In OBS, [Video Capture Device settings](https://obsproject.com/kb/video-capture-sources) must use a resolution/frame-rate combination the card accepts. Keep the game display geometry intact; avoid stretching a 4:3 presentation to fill a widescreen frame.

For each game:

1. Record a cold boot, title screen, introduction and two minutes of interactive play. Play back the saved file, checking both audio channels, dialogue sync, HUD edges, readable text, clipped sound and picture dropouts during transitions.
2. Record a failure and restart, including the controller and stopwatch if they are part of the episode. Confirm the on-screen prompts remain readable at the intended viewing size.
3. Record at least 30 continuous minutes, or an entire attempt if shorter. Inspect sync near the start and end, signal interruptions, and recording-software reports of missed or skipped frames. For a final run, record the complete attempt and ending; a short test does not establish full-run reliability.
4. Save the file path, date, exact profile and observed problems in the result log below. Mark a short check and a sustained check separately; fix and repeat any failed check before describing the setup as tested.

Emulation is an optional practice route. [Genesis Plus GX documentation](https://docs.libretro.com/library/genesis_plus_gx/) lists Sega CD support and the required regional BIOS files; it does not support 32X games. Record the core/frontend versions, region and disc revision if using it. This compatibility statement is not a test of these six discs or an assurance that a leaderboard accepts the configuration.

| Game | Sega CD record | Short check | Sustained check | Test evidence |
| --- | --- | --- | --- | --- |
| Sewer Shark | `segacd-9` | Pending | Pending | No recording yet |
| Wirehead | `segacd-28` | Pending | Pending | No recording yet |
| Sherlock Holmes Vol. I | `segacd-41` | Pending | Pending | No recording yet |
| Tomcat Alley | `segacd-25` | Pending | Pending | No recording yet |
| Microcosm | `segacd-35` | Pending | Pending | No recording yet |
| Double Switch | `segacd-10` | Pending | Pending | No recording yet |

When testing, replace each evidence cell with the date, file path and setup/profile identifier. Log failures as failures, rather than leaving a passed-looking blank. A completed recording can then supply personal observations and clip timestamps for the brief.

## How to use the briefs

The version comparisons below distinguish documented features from attributed reviewer observations. Episode questions and shot lists are editorial proposals. Timing rules for personal speed-clears are channel choices; official categories must use their current board rules. Existing leaderboard counts and records are historical snapshots until rechecked immediately before recording. A low Content ID rating is not a guarantee that an upload will be claim-free.

## Version and purchase decisions

| Episode | Main version | Optional comparison | Purchase decision |
| --- | --- | --- | --- |
| Sewer Shark | Sega CD | 3DO | Start with Sega CD; buy 3DO only for the presentation/control tradeoff segment. |
| Wirehead | Sega CD | Alternate routes on the same disc | No released second version verified; do not buy a supposed 32X edition. |
| Sherlock Holmes Vol. I | Sega CD | Zojoi's Mummy's Curse restoration | One restored case is enough for a matched comparison. The three-case Collection covers Volume I, not three volumes. |
| Tomcat Alley | Sega CD | Windows retail port | PC comparison is optional and requires its own working setup; no current digital purchase verified here. |
| Microcosm | Sega CD | CD32 or FM Towns | Choose one comparison with a demonstrable design difference; neither is needed for the first episode. DOS remains an untested alternative. |
| Double Switch | Owned Sega CD disc | 25th Anniversary on Windows, Switch or PlayStation | No main-game purchase needed. Use a modern edition for matched footage before buying another vintage console. |

## Sewer Shark

**Episode question:** Can I learn to shoot, navigate and survive Ghost's performance reviews at the same time?

The original manual assigns A to firing, B to enabling steering, C to hydrogen flares and the D-pad to aiming or steering according to mode. That provides a concrete explanation of why the game is more demanding than watching a film. [Original manual, controls section](https://www.segakore.fr/media/segakore/downloads/jeux/megacd/mcd_sewer_shark_bundle_manual_u.pdf).

**Version comparison:** In Dan Mahlendorf's direct comparison, the 3DO has a larger, cleaner video presentation and altered cockpit and sound effects, but targeting and diagonal input are less dependable. Those control judgments are his observations, to be checked on the actual equipment. His review supports a tradeoff, not an unconditional best-version verdict. [Digital Press comparison](https://www.digitpress.com/reviews/sewershark.htm). David Fry's contemporary review describes the 3DO video as less than full-screen; avoid repeating the catalog's blanket full-screen language. [Game Bytes review](https://www.ibiblio.org/GameBytes/issue19/creviews/sewer.html).

**Proposed episode beats:** Start with a missed turn; explain the control modes through the next attempt; show improvement through a short training montage; finish with the timed run. For historical color, Rob Fulop recalls taking the production to Hawaii to film the ending while discussing Hasbro's cancelled NEMO project. Attribute this to his recollection. [Fulop interview with Tristan Donovan](https://www.gamedeveloper.com/business/the-replay-interviews-rob-fulop).

**Capture check:** Include the turn arrows, energy gauge, Catfish's spoken directions and a failure/retry. If comparing 3DO, use the same enemy and scene, with matched display geometry and recorded controller details. Check the current [Sewer Shark board](https://www.speedrun.com/sewer_shark) before choosing a category; no record or runner count was refreshed for this brief.

**Still to establish:** Pressing-specific continue behavior, measured video dimensions/frame rate, and the claimed deliberate-low-score speedrun route. Do not script the latter as fact without a route or run demonstrating it. No current standalone digital sale is established here; the existence of an older hardware compilation would not establish current stock.

## Wirehead

**Episode question:** How quickly can I get an ordinary dad through an action movie when every wrong turn is my fault?

The original manual describes Ned's brain implant and explicitly allows multiple escape routes in some situations. Its credits identify James Riley as writer/director and Steve Witting as Wirehead. [Original manual, story, Multiple Paths and credits](https://r.mprd.se/Sega%20CD/Manuals/Wirehead%20%28U%29.pdf).

**Version comparison:** Use different routes on the Sega CD disc. A July 1995 schedule advertised both Mega-CD and 32X-CD, but an advertised project is not a shipped edition or evidence of better video. [MAN!AC July 1995 release schedule](https://retrocdn.net/images/1/14/MAN%21AC_DE_1995-07.pdf). No released second edition was verified in this pass.

**Proposed episode beats:** Establish that the controller literally controls Ned; contrast a safe route with a shortcut; show the cost of mistakes before the final attempt. Jonathan Dogey describes battery-based retries, shortcuts and chapter routes that converge on one ending. Attribute that description until the disc test confirms the behavior. [Sega-16 review](https://www.sega-16.com/2008/09/wirehead/).

**Capture check:** Record readable directional prompts, a successful choice, a wrong choice and its rollback, and a battery loss. Save the route used with the attempt so a faster result can be explained. Confirm timing, difficulty and allowed hardware on the current [Wirehead board](https://www.speedrun.com/wirehead).

**Still to establish:** Exact shortcut inputs and retry behavior on this pressing, precise regional retail coverage, and any surviving 32X build. Do not describe a cancelled build as a comparison purchase or assume its performance.

## Sherlock Holmes Consulting Detective Volume I

**Episode question:** Can I solve a filmed mystery efficiently without turning deduction into a memorized answer sheet?

Volume I's cases are The Mummy's Curse, The Mystified Murderess and The Tin Soldier. Contemporary coverage describes newspaper research, filmed interviews and presenting evidence in court. [Adventure Club review and guide](https://www.mocagh.org/advclub/asclub26.pdf).

**Version comparison:** Zojoi's Steam Collection contains those three cases as individual restored games. Buy Mummy's Curse alone for a one-case comparison, or the Collection for all three. Inspect the exact cart contents rather than interpreting Collection as Volumes I–III. [Mummy's Curse and Collection listing](https://store.steampowered.com/app/374010/), [Mystified Murderess](https://store.steampowered.com/app/376790/), [Tin Soldier](https://store.steampowered.com/app/376780/).

Joe Pranevich and Voltgloss report a redesigned research interface, subtitles, hints and a discovery log in the restoration. Treat their content-parity judgment as an attributed comparison. [Alternate versions comparison](https://advgamer.blogspot.com/2016/09/consulting-detective-alternate-versions.html?m=0). Original ICOM art director and Zojoi cofounder David Marsh describes recovering Beta SP tapes and having the footage redigitized. [David Marsh interview](https://advgamer.blogspot.com/2016/09/a-conversation-with-david-marsh.html).

**Proposed episode beats:** Follow one lead from newspaper to interview to courtroom; show the difference between discovering and remembering a solution; compare the same testimony and research screen in the restoration. Keep culprit and final-answer spoilers out of the opening.

**Capture check:** Record a newspaper page, directory selection, dialogue and a courtroom response. Verify text legibility in the final exported video. Proposed personal speed-clear: one named case, case selection to verdict, real time, with hints and prior knowledge declared. This is a channel challenge, not a claim of an official record.

**Still to establish:** Measured Sega CD video specifications, peripheral support and full content parity. The three-case Collection does not establish purchase routes for the other volumes; it also does not prove no later case has ever been restored.

## Tomcat Alley

**Current episode 1:** use the [complete production brief](episodes/01-tomcat-alley.md) for the declared challenge, recording sequence and edit outline. The earlier Season Zero numbering is superseded.

**Episode question:** Can I win an aerial action movie from the back seat using a cursor?

Sega's manual makes the player the Radar Intercept Officer in an F-14X. The film supplies the flight action while the player operates the mission interface. The manual credits Sam Nicholson as director, John Zuur Platten as writer, Clay Lacy for aerial photography and The Code Monkeys for programming. [Original manual, printed pp. 2–3 and credits](https://r.mprd.se/Sega%20CD/Manuals/Tomcat%20Alley%20%28U%29.pdf). Doug Bauer's contemporary review describes HUD selection of weapons, radio responses, waypoints, countermeasures and reconnaissance. [Game Bytes review](https://www.ibiblio.org/GameBytes/issue18/creviews/tomcat.html).

**Version comparison:** A Windows retail port exists; Tomcat Alley is not Sega CD only. Contemporary Sega PC launch coverage names it in the lineup. [Billboard, September 30, 1995](https://www.worldradiohistory.com/Archive-All-Music/Billboard/90s/1995/BB-1995-09-30.pdf). NintendoComplete's PC playthrough describes improved graphics and mouse input; these are the recorder's observations, not a local test. [Windows playthrough](https://www.youtube.com/watch?v=9tOnxG2-kFQ). The PC edition is optional comparison material, not an established plug-and-play route on a current computer.

**Proposed episode beats:** Open with a missed command; explain the RIO role through a sequence combining radio, navigation and targeting; build the final run around learning to read the HUD. If a working PC setup is obtained, match one briefing and combat sequence and compare input handling.

**Capture check:** Show the reticle, all HUD edges, spoken orders and the response to a command. Test a retry and a transition back to a briefing. Proposed personal speed-clear: new game to end credits, default difficulty, real time, with the exact pressing and retry policy stated.

**October 27 manual check:** A fires, B selects HUD functions and C toggles the HUD. The stock-footage credits identify Grumman for Tomcat material and Sikorsky for Blackhawk material (printed p. 16); they do not establish a US Navy license or Top Gun adaptation. Saving remains uncertain because the contemporary review mentions backup RAM while the old catalog said no saving. Check the actual pressing, PC runtime and capture behavior before recording those claims.

## Microcosm

**Episode question:** Does controlling a little ship over a prerecorded human body make the expensive cinematic future fun to play?

Richard Browne, John Gibson, Jim Bowers and Mike Clarke describe FM Towns development, Fujitsu's involvement, compression compromises and improvised live-action production in credited interviews. This supports an episode about making ambitious imagery fit restricted hardware. [Making of Microcosm](https://www.timeextension.com/features/the-making-of-microcosm-cd-rom-gamings-first-aaa-title).

**Version comparison:** The Sega CD review describes a movable ship used for aiming over prerecorded backgrounds. [Sega-16 review](https://www.sega-16.com/2010/10/microcosm/). Contemporary CD32 coverage reports substantial rewriting and a visible ship replacing the FM Towns crosshair. Attribute design observations to the named reviewers and development statements to Psygnosis's Mike Simpson. [Amiga Computing interview and CU Amiga review transcriptions](https://www.amigareviews.leveluphost.com/microcos.htm). A CD32/FM Towns comparison therefore has a specific question to investigate; the existing DOS recommendation remains provisional.

Clarke recalls Rick Wakeman's music being licensed for FM Towns and Tim Wright supplying music for later versions. Other descriptions disagree about DOS, so identify the edition before making a soundtrack claim. The CD-i branch remains outside the playable comparison plan: [ICDIA preserves promotional footage](https://www.icdia.co.uk/video/videos_sw.html), which does not establish an obtainable or complete playable prototype.

**Proposed episode beats:** Separate the controllable ship from the prerecorded tunnel on screen; explain one documented compression compromise; contrast the spectacular introduction with the demands of reading enemies during play. Save a full port tournament for a later episode.

**Capture check:** Record dark tunnels, ship visibility, enemy fire, HUD edges and the transition from the introduction to play. Capture a sustained stage without altering brightness between comparison editions. Proposed personal speed-clear: power-on to credits, default difficulty, real time; keep it separate from new-game-start attempts.

**Still to establish:** DOS music, measured Sega CD frame rate, exact 3DO differences and the CD-i build's availability. Do not repeat unsupported CD32 launch-title or Sega-team conversion claims.

## Double Switch

**Episode question:** Can I follow the story while every other room demands a perfectly timed trap?

Publisher descriptions identify Mary Lambert as director and Corey Haim, Debbie Harry and R. Lee Ermey among the cast; Steam credits Thomas Dolby's score. The simultaneous room plots make attention management the natural challenge. [Steam publisher description](https://store.steampowered.com/app/878290/).

**Version comparison:** Keep the owned Sega CD disc for the main episode. The anniversary version offers enhanced video and bonus material according to its publisher. Verified storefronts cover [Windows/Steam](https://store.steampowered.com/app/878290/), [Nintendo Switch, with Nintendo listing Switch 2 support](https://www.nintendo.com/us/store/products/double-switch-25th-anniversary-edition-switch/), and [PS4 plus a native PS5 edition released March 21, 2026](https://store.playstation.com/en-us/product/UP3455-PPSA23502_00-DOUBLESWITCH2501). No Xbox edition was verified. Trevor Gould describes an unlockable Theater in his review of the 2019 Switch version; check the installed edition before relying on it for footage access. [Pure Nintendo review](https://purenintendo.com/review-double-switch-25th-anniversary-edition-nintendo-switch/).

The Saturn disc is a 1995 North American release, not a Japan-only port. Satakore catalogs the retail package as T-16207H with two discs. [Satakore retail entry](https://www.satakore.com/sega-saturn-game,,T-16207H,,Double-Switch-USA.html). Its exact improvements over Sega CD remain untested, so a Saturn purchase is unnecessary for this episode.

**Proposed episode beats:** Follow one room until a competing event pulls attention away; contrast reacting to a trap with deciding whom to trust; end with the timed attempt. Match one scene and camera switch against the anniversary edition if the comparison adds a clear payoff.

**Capture check:** Record camera changes, indicators, dialogue and a trap event, then a complete act to check continuity. Keep the anniversary build/platform in the footage log. Recheck the current [Double Switch board](https://www.speedrun.com/double_switch) for edition eligibility and timing; do not assume all editions share a category.

**Still to establish:** Measured Sega CD video specs, Saturn gameplay differences and anniversary build-specific timing changes. The earlier best-selling-after-Night-Trap claim is not substantiated by these sources.

## Evidence maintenance

The machine-readable [research ledger](../tools/season-zero/research.json) maps the six records, source types, comparison status and pending capture checks. Concise episode proposals and version decisions are also stored in the existing game fields and system overrides, so they appear in the site's detail panels. Update the source ledger and overrides together when new evidence changes a claim. Keep dated market snapshots and historical leaderboard facts separate from newly checked research.

Several scanned manuals were available as indexed text while PDF rendering was unavailable; consult the linked original pages before using a quotation or screen crop in an episode. Interview recollections and reviewer judgments remain attributed. No manual, image or video was copied into the site's asset library.
