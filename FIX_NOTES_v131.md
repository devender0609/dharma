Vedatime v131 fixes

What was fixed
- City image panel now uses bundled local SVG city images from /public/images/cities for all 77 cities.
- The main Today city card now prioritizes the local bundled image path before any remote URL.
- This removes the blocked Wikimedia request dependency that was leaving the panel blank.
- AI year-specific festival queries were patched so explicit 2026 questions return 2026 dates for Holi, Hanuman Jayanti, Ram Navami, Akshaya Tritiya, and Maha Shivaratri.

What was verified
- 77 city image assets exist in public/images/cities and are present in dist/images/cities after build.
- The call site for the Today city image panel now uses getLocalCityImage(selectedLocation) first.
- Production build completed successfully with Vite.

Remaining limitation
- The bundled city assets are the local SVG city visuals from the earlier working build, not downloaded remote photographs.
