# Choruswild - Transcendent Ticket Cooldown Hotfix

Choruswild is an original single-player musical creature collection game built as a static GitHub Pages project. It uses original SVG creature art, procedural Web Audio music, local saves, breeding, synthesis, seasonal events, rarity forms, collection goals and a late-game mastery path.

## GitHub Pages setup

Upload every file in this package directly to the repository root. The package intentionally contains no folders.

1. Create or open a GitHub repository.
2. Upload all package files to the repository root.
3. Commit the files.
4. Open Settings > Pages.
5. Deploy from the main branch and repository root.

The game has no CDN, external font, external image or external audio dependency.

## Final-attempt content

- 9 playable worlds: Meadowreach, Glassreef Basin, Moonroot Hollow, Seasonal Island, Gearwake Islet, Stormforge Crag, Thistledrone Islet, Fluxworks Islet and Crownfall Islet.
- 62 creature species with 62 unique base shape identifiers.
- Common, Rare and Epic forms. Rare and Epic forms change anatomy, silhouette features, hardware details and species-specific palettes rather than only recoloring the Common form.
- One owned copy limit for each species/form combination on each home world.
- Species-specific performance animations and note effects.
- Real-time local saving, offline income and export/import save backups.
- Responsive desktop, tablet and phone UI.


## Castle and dense-stage patch

Castle capacity now scales 7 -> 12 -> 18 -> 24 -> 32 beds, with level 5 capped at 32.

The stage renderer now has 32 unique dense-layout positions instead of recycling a 14-position array. Existing saves receive a one-time migration that:

- keeps every still-valid placed performer;
- fills newly available beds with owned performers that were previously blocked by the old 21-bed cap;
- prioritizes hidden seasonals first, then Epic, Rare and Common forms;
- persists the migration so manually removed performers are not repeatedly auto-placed later.

On desktop/tablet, dense layouts reserve the right side for the Mixer instead of drawing monsters underneath it. On phone layouts, the full stage width is used because the Mixer moves to the bottom.

## Breeding

Normal breeding is intentionally uncertain. A valid combination can succeed or fail, and late worlds have lower success chances. A failed attempt returns one parent as a Common egg.

The Breeding Lab displays a full possible-results strip before the attempt begins. It shows:

- Common, Rare and Epic target probabilities;
- active limited seasonal outcomes when the event recipe matches;
- both possible failure-return parents;
- a featured base wait estimate.

Breeding waits scale by world, element complexity and rarity. The hard cap is 10 hours. Nursery waits scale from the same system. Instant completion costs roughly 1 Gem per 30 minutes remaining, capped at 20 Gems.

## Limited home-world seasonals

Every non-Seasonal world has a home seasonal. They cannot be purchased in the Market and can only be bred on their home world while that event is active.

- Meadowreach: Petalbop - Spring
- Glassreef Basin: Sunburst - Summer
- Moonroot Hollow: Gourdgeist - Halloween
- Gearwake Islet: Midnightpop - New Years
- Stormforge Crag: Starspangle - July 4th
- Thistledrone Islet: Cloverclack - St Patricks
- Fluxworks Islet: Heartstring - Valentines
- Crownfall Islet: Yulebell - Christmas

Event recipe cards appear in each relevant Market. Outside the event window, the home-world seasonal is unavailable there.

## Seasonal Island

Seasonal Island is the exception to the event restriction: its festival content remains available year-round.

Four permanent Festival Ensemble starters are sold directly:

- Lanternling
- Ribbonram
- Paradepod
- Carolfin

The 14 actual holiday seasonals are not sold. They form a permanent breeding progression tree. Early recipes use the four starters; later recipes require previously bred seasonals, so completing the island is a long-term collection path rather than a Market purchase.

## Rare and Epic single-elementals

The Resonance Vault is the special path for single-element rarity forms.

- Rare cycle: box the complete Common single-element set for that world, then choose the Rare single you want to manifest.
- Epic cycle: box the complete Rare single-element set, then choose the Epic single.

This prevents Rare/Epic single-elementals from being trivial random upgrades.

## Fluxworks Islet

Fluxworks does not use ordinary breeding outside its limited seasonal event.

The Five-channel Core Array now uses persistent, independently timed attunement jobs. Closing the panel or reloading the game does not erase an active job. The Five-Cycle shortcut is one real batch job that consumes five Blank Cores and produces one tuned Core of every energy when completed.

Synthesis progression:

1. Attune Blank Cores.
2. Synthesize Triple performers.
3. Upgrade chamber stability.
4. Consume Triple bases to synthesize Quads.
5. Consume both Quad bases, five tuned Cores and Crests to synthesize the Quint Pentaflux.

Long synthesis jobs use the same scaled Gem instant-finish economy as breeding. Pentaflux reaches the 10-hour cap.

Fluxworks mastery was rebalanced so its Song Power requirement is achievable with its real roster instead of requiring impossible power.

## Daily Arcade

### Resonance Wheel

The wheel has eight labeled wedges, a fixed pointer and aligned stopping math. The jackpot has a true 5 percent weight and awards a large multi-currency bundle. One spin is free each day; additional spins cost 2 Gems.

### Monster Scratch

Scratch now has five ticket tiers, all tied to the world the player is currently visiting. Every tier uses nine panels with three matching winning panels.

- Standard Ticket: one free daily, then 6 Gems per extra ticket. Seasonal chance: 0.25 percent. Quad/top-tier chance: 2 percent. Base monster-form odds: 18 percent Rare and 3 percent Epic.
- Grand Ticket: one ready ticket every 3 days. Seasonal chance: 1 percent. Quad/top-tier chance: 3.5 percent. Rare/Epic form odds are 1.25x the Standard rates. Skip the remaining cooldown for 16 Gems. Using the ticket restarts its 3-day cooldown.
- Supreme Ticket: one ready ticket every 10 days. Seasonal chance: 3 percent. Quad/top-tier chance: 10 percent. Rare/Epic form odds are exactly 2x the Standard rates. Skip the remaining cooldown for 35 Gems. Using the ticket restarts its 10-day cooldown.
- Ultimate Ticket: one free ready use every 14 days. Seasonal chance: 10 percent. Quad/top-tier chance: 20 percent. Every monster prize is either Rare (80 percent) or Epic (20 percent), including seasonal wins. If it is still cooling down, 60 Gems skips the remaining wait and immediately starts a new 14-day cooldown after use.
- Transcendent Ticket: one free ready use every 21 days. Seasonal chance: 30 percent. Quad/top-tier chance: 30 percent. Non-seasonal monster prizes are 60 percent Rare, 35 percent Epic and 5 percent Common, so 95 percent are Rare-or-better. Seasonal wins are always Rare or Epic. If it is still cooling down, 100 Gems skips the remaining wait and immediately starts a new 21-day cooldown after use.

Scratch seasonals are available year-round on their home-world tickets even when that seasonal's breeding event is inactive. This exception applies only to Scratch; home-world breeding remains event-gated. Seasonal Island tickets choose from its permanent seasonal roster.

Seasonal duplicate protection: if a Scratch Ticket rolls an Epic seasonal the player already owns on that world, and that same seasonal's Common form is still missing there, the reward is converted into the missing Common instead of becoming duplicate Resonance. This protection applies to every Scratch Ticket tier.

Seasonal breeding form odds were also slightly improved: the base seasonal Rare form chance increased from 5 percent to 7 percent and the base Epic form chance from 0.6 percent to 1 percent before Lantern and Seasonal Island bonuses.

## Music

The game uses procedural Web Audio and does not ship copyrighted songs.

The late-game arrangements are deliberately different from one another:

- Stormforge Crag: fast rock with kick, snare, hats, tom fills, cymbal crashes, distorted bass, rhythm guitar, lead guitar and thunder brass.
- Thistledrone Islet: highland/adventure arrangement built around sustained reed-drone writing, hand percussion and counterlines.
- Fluxworks Islet: industrial/glitch-rock synthesis arrangement.
- Crownfall Islet: final rock/orchestral hybrid with full drums, bass, distorted guitar, organ, choir and bells.

Seasonal visitors add their own musical layers when present on their home worlds.

## Progression and engagement

- 14 long-form goals including scratch, synthesis, seasonal collection, world mastery, 40-performer collection and Pentaflux completion goals.
- Per-world mastery rewards.
- Castle capacity progression.
- Lantern breeding bonuses.
- Epic pity progression.
- Daily gift, free wheel spin and free scratch ticket.
- New-form discovery presentation for hatches, scratch discoveries, Resonance Vault manifestations and Fluxworks synthesis.
- Offline coin production.
- Collection Book with form tracking.

## Owner controls

The owner panel is session-locked behind the configured access code. It provides exact SET/ADD currency controls, all-world unlock, current-world form grants, timer finishing and level testing.

## Audio and accessibility

Master, Music and SFX controls each expose 0 to 20,000 percent. Reduced visual effects can disable heavier celebratory visuals. Rapid-tap controls use `touch-action: manipulation` so fast repeated taps on iPad/iPhone do not trigger browser double-tap zoom.

## App icon

The included app icon is not AI-generated promotional art. It is composed directly from the same Epic Gourdgeist SVG renderer and visual palette that ship in the running game, so it represents the actual in-game art style.


## Cooldown hotfix
Ultimate and Transcendent no longer charge Gems when their normal cooldown has finished. A ready ticket is free. The 60-Gem and 100-Gem prices are only early-use cooldown skips. Grand and Supreme were rechecked and keep the same free-when-ready / paid-skip behavior.
