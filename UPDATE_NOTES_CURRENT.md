Vedatime current-source patch

What was changed:
- Left city image system unchanged.
- Made the onboarding first page much more compact on mobile:
  - removed text-density toggle on mobile
  - reduced mobile title/body sizes
  - reduced featured city count on mobile
  - reduced chip/button/card sizing
  - removed mobile modal border radius and expanded to full-height shell
- Made Open Calendar more reliable:
  - added pending jump flow in CalendarScreen
  - scrolls only after the grid is mounted
  - Today Summary Open calendar now sets a calendar jump flag before switching tabs
- Reduced Open calendar and reminder pill sizes closer to other action pills.
- Added a tiny polish style injection for tap highlight / font smoothing.

Build status:
- npm install: pass
- npm run build: pass
