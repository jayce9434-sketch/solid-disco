# Choruswild Transcendent Castle & Ticket Patch - QA Report

## Static validation

- JavaScript syntax: PASS (`game.js` and `sw.js`).
- Manifest JSON: PASS.
- Runtime source contains no emoji/pictograph characters: PASS.
- Runtime has no external HTTP/HTTPS dependency or CDN: PASS.
- Flat GitHub Pages package: PASS.
- Worlds: 9.
- Species IDs: 62 total / 62 unique.
- Castle level-5 capacity: 32 beds.
- Scratch tiers: 5.
- Service-worker cache bumped for the patch.

## Browser runtime method

Normal localhost/file navigation is blocked in the execution environment, so headless Chromium used an in-memory harness containing the exact shipped `index.html`, `style.css` and `game.js`. The harness replaced only localStorage with an in-memory implementation so supplied save states could be loaded. Game logic and rendering code were unchanged.

## Exact supplied-save regression

The user-provided version-4 save was loaded directly into Chromium. That save contains 27 owned monsters total: 26 on Meadowreach and one on Glassreef. Meadowreach had 21 staged monsters under the old level-5 21-bed cap. Five additional Meadowreach monsters were owned but unstaged, including Common Petalbop.

Verified after migration:

- Meadowreach becomes `26 / 32 beds`.
- All 26 Meadowreach-owned performers are staged.
- Petalbop is staged and visible.
- All 26 rendered monsters use unique stage coordinates.
- No performer reuses another performer's exact position.
- Desktop dense layout reserves the right side for the Mixer.
- Runtime errors: 0.

## Full 32-bed stress test

A synthetic stage state with exactly 32 valid performers was rendered.

- Stage performers rendered: 32.
- Unique stage positions: 32.
- Castle label: `32 / 32 beds`.
- No direct coordinate stacking.
- Runtime errors: 0.

## Mobile stage regression

The exact supplied save was also loaded at 390 x 844.

- Meadowreach performers rendered: 26.
- Unique stage positions: 26.
- Petalbop visible: PASS.
- Horizontal page overflow: 0 pixels.
- Runtime errors: 0.

## Scratch Ticket cooldown regression

Five cards render in the Arcade: Standard, Grand, Supreme, Ultimate and Transcendent.

- Standard: 0.25% seasonal, 2% Quad/top.
- Grand: 1% seasonal, 3.5% Quad/top, one free ready use every 3 days, 16-Gem early cooldown skip.
- Supreme: 3% seasonal, 10% Quad/top, one free ready use every 10 days, 35-Gem early cooldown skip.
- Ultimate: 10% seasonal, 20% Quad/top, one free ready use every 14 days, 60-Gem early cooldown skip, monster forms are 80% Rare / 20% Epic.
- Transcendent: 30% seasonal, 30% Quad/top, one free ready use every 21 days, 100-Gem early cooldown skip, non-seasonal monster forms are 60% Rare / 35% Epic / 5% Common. Seasonal wins are forced Rare or Epic.

Deterministic Chromium tests verified both states separately for every cooldown ticket:

- Grand ready ticket costs exactly 0 Gems; early use costs exactly 16 Gems.
- Supreme ready ticket costs exactly 0 Gems; early use costs exactly 35 Gems.
- Ultimate ready ticket costs exactly 0 Gems; early use costs exactly 60 Gems.
- Transcendent ready ticket costs exactly 0 Gems; early use costs exactly 100 Gems.
- Every use restarts that tier's cooldown.
- Ultimate/Transcendent UI copy explicitly says the Gem amount skips the remaining wait rather than buying a ready ticket.
- Ultimate and Transcendent seasonal wins remain Rare/Epic as designed.
- Seasonal Island top-tier fallback excludes seasonal species, so advertised seasonal category odds are not silently inflated.
- Runtime errors during cooldown regression: 0.

## Included evidence screenshots

- `screenshot-user-save-26-monsters.png` - the supplied save after automatic 32-bed migration.
- `screenshot-mobile-26-monsters.png` - the supplied save at 390px width.
- `screenshot-32-bed-stress.png` - full 32/32 renderer stress state.
- `screenshot-five-tickets.png` - corrected five-tier selector showing free-when-ready / paid-cooldown-skip behavior.
- `screenshot-ticket-cooldown-hotfix.png` - same corrected selector captured during the hotfix regression.

## Scope statement

The report verifies the exact flows and invariants above. It does not claim that every possible browser/device edge case is impossible.

## Seasonal duplicate-protection hotfix

- Added Scratch Ticket protection for duplicate Epic seasonals.
- If an Epic seasonal is rolled from any Scratch Ticket tier, that Epic is already owned on the current world, and the Common form is missing on that same world, the reward is converted into the missing Common instead of duplicate Resonance.
- A new Epic seasonal that is not already owned remains Epic.
- If the Common form is already owned, an Epic duplicate keeps the existing 100 Resonance duplicate conversion.
- Non-seasonal Epic duplicates keep their existing duplicate behavior.
- Unit regression used the user's current Glassreef collection shape: Rare Sunburst + Epic Sunburst owned, Common Sunburst missing. A duplicate Epic Sunburst correctly produced Common Sunburst with no Resonance payout.
- `node --check game.js`: PASS after the hotfix.
- Service-worker cache key bumped so GitHub Pages clients do not keep the previous JavaScript.
