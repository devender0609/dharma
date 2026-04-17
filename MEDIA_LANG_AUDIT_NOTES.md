Vedatime media + language audit pass

Changes made
- Removed duplicate Hinduism and Vedas pills from the lower Media row.
- Kept Hinduism and Vedas as featured cards at the top of Media.
- Passed `lang` through additional feature panels used by AI / Tracker / Marketplace paths.
- Added missing local translation helpers (`A` / `U`) in panels that referenced them.
- Replaced broken literal premium placeholders like `⭐ {U.premium}` with real interpolated text.

Build verification
- npm install: passed
- npm run build: passed

Language audit result
- English / Hindi / Sanskrit switching is strongest in the core shell, Media hub, Hinduism / Vedas sections, AI shell, auth modals, premium modal, contact screen, and nav areas.
- It is not yet a complete 100% app-wide translation of every long-form content block and every niche data entry. Many deep data arrays and knowledge cards are still authored in English.
- No language tabs were removed.
