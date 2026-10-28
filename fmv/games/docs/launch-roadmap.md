# R.I.P. FMV launch roadmap

**October 27 series update:** The [current recording and acquisition plan](fmv-play-order.md) now sequences 32 productions for episode quality, with Tomcat Alley, Burning Soldier and Midnight Raiders as published practice episodes 1–3, Sewer Shark as the first major flagship at #5, and Dragon’s Lair at #12. Budget and current ownership no longer determine recording order. The strategy and episode formula below remain useful; earlier Season Zero ordering and spending priorities are superseded.

**First recording:** follow the [Tomcat Alley production brief](episodes/01-tomcat-alley.md). It supplies the current episode-one challenge, capture sequence, outline and finish checklist; the Sewer Shark recording assignment and old publishing calendar below are retained historical planning.

Oct 26, 2026 · Tom. The plan is settled in [channel-plan.md](channel-plan.md) (Strategy v2: Race to the Credits, Season Zero on Sega CD) and the gear in [capture-plan.md](capture-plan.md). This file is the to-do list that turns them into a channel with videos on it. Tick boxes here as things get done.

**The short version:** you can record the first episode with about $55 of discs and one capture setup ($250 to $500). Nothing else has to be bought before launch. The target below is two episodes banked by the end of November and the first upload on **Saturday Dec 5, 2026**, then one every two weeks.

## What's in the way

Only four things stand between today and a first upload, and all of them are yours:

1. **A capture setup for the Sega CD tower.** Nothing is recorded until this exists. Step 1 below.
2. **The five Season Zero discs you don't own** (about $55 loose). Step 2.
3. **The YouTube channel itself**: name, handle, verification. Step 3.
4. **Recording time**: about 6 to 10 hours per episode across practice, the run and the voiceover. Steps 4 and 5.

Everything else (scripts, run rules, thumbnails, descriptions, the site links) Claude can do from here.

## Tom's side, in order

### 1. Capture setup (this week)

The Sega CD's video is 15 fps in 64 colours; any of these makes it look as good as it can. Prices are rough 2026 street prices, not checked against a store, so look before you buy.

| Part | Budget (about $250) | Standard (about $500) | Why |
| --- | --- | --- | --- |
| Video cable | Genesis/32X RGB SCART cable with csync, about $35 | same | RGB is the cleanest signal the console has. In the tower the cable goes in the **32X's** A/V out, the top of the stack |
| Scaler | OSSC or a RetroTINK line-doubler, about $150 | RetroTINK 5X Pro, about $325 | Turns 240p into something a capture card accepts without blur or lag |
| Capture card | USB 3 1080p60 capture stick (MS2130 type), about $30 | Elgato HD60 X or similar, about $150 | Records the scaler's HDMI into OBS on the PC |
| Microphone | USB dynamic mic (Samson Q2U or similar), about $70 | same, or one you already own | The voice carries the show; this matters more than the scaler |
| Software | OBS, LiveSplit, DaVinci Resolve: free | same | Capture, the run timer, editing |

- [ ] Check which Genesis model is in the tower. A Model 1 sends Sega CD audio out of its headphone jack, so you may need the Sega CD/32X audio mixing cable as well; a Model 2 mixes it already.
- [ ] Buy the cable, scaler, capture card and mic.
- [ ] Set up OBS with two scenes: game only, and game with the LiveSplit timer in a corner. Record at 1080p60, game audio and mic on separate tracks.
- [ ] Shoot 30 seconds of Double Switch through the chain and send it over. Claude will check sharpness, colour and sync before you record anything real.
- [ ] Not needed for Season Zero: a CRT (only for real light guns) or a facecam (decide after episode 2).

### 2. Buy the Season Zero discs (this week)

Loose PriceCharting prices from the index, Oct 20. You own Double Switch.

- [ ] Sewer Shark (Sega CD), $8. The not-for-resale pack-in pressing is the cheap one and the same game
- [ ] Wirehead (Sega CD), $17
- [ ] Sherlock Holmes: Consulting Detective Vol. I (Sega CD), $8
- [ ] Tomcat Alley (Sega CD), $8 (the capture plan says it's in the eBay lot)
- [ ] Microcosm (Sega CD), $13
- [ ] When each arrives, mark it owned on the site and download the tracker, so `data/tracker.json` and the capture routes stay right

The next batch (Road Avenger $26, Night Trap $25, Cobra Command $12) can wait until Season Zero is half done. The 3DO waits until an episode needs it.

### 3. Set up the accounts (this week, an hour)

- [ ] Create the channel **R.I.P. FMV** as a brand account (so you can add an editor later). Try the handle `@RIPFMV` first; `@ripfmvgames` or `@ripfmvchannel` if it's taken.
- [ ] Verify the channel with a phone number. Uploads over 15 minutes and custom thumbnails need it, and every episode is 10 to 18 minutes.
- [ ] Turn on advanced features (Settings, Channel, Feature eligibility) so links work in descriptions.
- [ ] Set the upload defaults: category Gaming, the description template below, "Not made for kids".
- [ ] Make a Speedrun.com account under the same name, so official runs can be submitted and the episodes can say so.
- [ ] Optional: claim the same name on Bluesky, Instagram and TikTok for Shorts, even if they sit empty for now.
- [ ] Tell Claude the handle. It goes into the site footer and nav and the description template.

### 4. Record episode 1: Sewer Shark (weeks 2 to 3)

Script and run rules: [episodes/01-sewer-shark.md](episodes/01-sewer-shark.md).

- [ ] Read the board's rules on [speedrun.com/sewer_shark](https://www.speedrun.com/sewer_shark) and its guides before the first attempt; note anything the script gets wrong.
- [ ] Record the blind first attempt with commentary. Keep it, whatever happens: it's the "first attempt" segment.
- [ ] Record B-roll on your phone: the tower, the disc going in, the boot screen, the box.
- [ ] Practise off camera, but record the sessions anyway; failures are the training montage.
- [ ] Record the timed run uncut, with LiveSplit on screen and the console audio on its own track. Submit it to the board if it's clean.
- [ ] Record the voiceover from the script, in your own words where it doesn't sound like you.
- [ ] Fill in the tracker fields for segacd-9: challenge, capture, attempts, clears, pb.

### 5. Record episode 2 and edit both (weeks 3 to 5)

- [ ] Record Double Switch the same way: [episodes/02-double-switch.md](episodes/02-double-switch.md). It's the disc you own, so it can go first if the Sewer Shark disc is slow to arrive.
- [ ] Edit both. Target 10 to 18 minutes; cut to the story, not to a length.
- [ ] Pick a thumbnail frame from each (Claude makes the thumbnail around it).

### 6. Launch (Dec 5)

- [ ] Upload episode 1 on Saturday Dec 5 with the title, description and thumbnail Claude prepares. Schedule it rather than posting live.
- [ ] Add the video URL to the tracker on the site (the drawer's Video URL field), then download the tracker and commit it, so the index links the episode.
- [ ] One Short from the episode, two or three days later, only if a clip has its own payoff.
- [ ] Post the link where FMV and Sega CD people already are: r/segacd, r/FMVgames, the Sega-16 forum, the Speedrun.com board's forum.

## Publishing calendar

One long video every two weeks, Saturdays, with at least one episode banked ahead. Record order can differ from upload order.

| Upload | Episode | Class | Disc |
| --- | --- | --- | --- |
| Dec 5 | 1. Sewer Shark: Can I speedrun the Sega CD pack-in on a real Sega CD? | Official (4 runs on the board) | $8 |
| Dec 19 | 2. Double Switch: Corey Haim needs me to be fast | Official (5 runs) | owned |
| Jan 2 | 3. Wirehead: Two people have speedrun Wirehead. I want in | Official (2 runs) | $17 |
| Jan 16 | 4. Sherlock Holmes Vol. I: Can a detective game be speedrun? | Speed-clear | $8 |
| Jan 30 | 5. Tomcat Alley: Top Gun, but it's a menu | Speed-clear | $8 |
| Feb 13 | 6. Microcosm: Fantastic Voyage, five ports, one stopwatch | Speed-clear | $13 |
| late Feb | Review the six against the success measures in the channel plan; pick the next batch | | |

Double Switch moved from sixth to second: you own it, it ranks 18 on the Titan chart (Wirehead is 501), and a strong second upload matters more than saving it. The channel plan's other four stay in their order. The likely next batch is Road Avenger, Night Trap and Cobra Command, all on the tower.

## Claude's side

| | What | Status |
| --- | --- | --- |
| ✓ | This roadmap | Done |
| ✓ | Episode 1 script and run rules: Sewer Shark | Done, [episodes/01-sewer-shark.md](episodes/01-sewer-shark.md) |
| ✓ | Episode 2 script and run rules: Double Switch | Done, [episodes/02-double-switch.md](episodes/02-double-switch.md) |
| ✓ | Description template and title formula | Done, below |
| next | Channel art: avatar (800×800), banner (2560×1440) and a thumbnail template in the site's Sega CD look (pixel type, dithered gradients, Sega blue, red and yellow on black), rendered to PNG | Can start now |
| next | Scripts for episodes 3 to 6 (Wirehead, Sherlock Holmes, Tomcat Alley, Microcosm) | Can start now |
| next | Site links: a "Watch on YouTube" link in the nav and footer, and a Watch button in the drawer and on Channel's status screen when a record has a video URL (the field exists already) | Needs the handle |
| next | Per-episode research packet: everything the index holds on the game (cast, trivia, cheats, versions, board, prices) in one page to read from while recording | Folded into each script for now |
| later | Check the capture test clip, and the rough cut of episode 1 if you share it | Needs your footage |
| later | Shorts picks: two or three timestamps per episode with a self-contained payoff | Needs the edit |
| later | After each upload: fill the tracker's episode fields, refresh the speedrun board data on your Mac, update the channel plan | Ongoing |

## Templates

### Titles

Game, then the challenge, then the joke. No episode numbers or season branding in the title.

- *Can I Speedrun Sewer Shark on a Real Sega CD?*
- *Corey Haim Needs Me to Be Faster | Double Switch Speedrun*
- *Two People Have Speedrun Wirehead. I Want In.*

### Description

```
<Game>, <system> (real hardware). <Category>: <time>. Board: speedrun.com/<slug>

<One or two sentences: the challenge and how it went, no spoiler for the result if the episode builds to it.>

Everything about this game, every version and where to play it today:
https://unrealities-media.github.io/fmv-games/timeline.html#<gameId>

Chapters
0:00 Cold open
<…>

Played on: Sega Genesis + Sega CD + 32X, <cable>, <scaler>, captured with <card>.
Timed with LiveSplit, real time, start on <…>, end on <…>.
```

The index link is the GitHub Pages address; change it here and in the scripts if the site moves to its own domain.

### Pinned comment

> What should I suffer through next? The index at the link in the description lists 786 FMV games across 17 systems, ranked by how much they matter.
