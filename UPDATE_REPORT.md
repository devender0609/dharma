# Vedatime update report

Generated: 2026-04-13

## What was changed
- Replaced the `CITY_GUIDES` block with the fuller city dataset from the newer source so the city records again include their structured `image` values.
- Reworked the city image panel to render a real `<img>` element first, instead of relying only on layered CSS backgrounds.
- Kept the Wikipedia summary/image lookup as secondary fallback only when a structured image is unavailable.
- Reduced the image overlay darkness and made the hero section more visibly image-forward.
- Reworked the AI secondary navigation from a sideways scroll strip into a wrapped responsive grid so major categories are visible without left-right scrolling.
- Expanded the sacred calendar data with additional recurring observances requested in the prompt, including more Sankashti Chaturthi, Masik Shivaratri, Sankranti markers, Purnima/Amavasya-adjacent observances, Navratri markers, and several festival / vrata additions.
- Updated `package.json` scripts so `npm run build` works reliably in this source package.

## Files modified
- `src/App.jsx`
- `package.json`
- `dist/*` (rebuilt)
- `validate-vedatime.py` (copied in for reference)

## What was verified directly
- The source builds successfully with Vite using `npm run build`.
- The AI sub-navigation code no longer uses the old horizontal-only secondary tab strip.
- The city image component now prefers structured city images and renders them via `<img>`.

## Important honesty note
- I was able to verify the code path and build, but not do full live-browser manual QA across every city and every date card in an interactive browser session here.
- The calendar coverage is materially broader than before, but it should still be treated as an expanded app dataset rather than a fully scholar-audited Panchang.
- For a truly authoritative city-by-city and day-by-day Hindu calendar, the next step would still be a dedicated source-verification pass against a Panchang reference workflow.
