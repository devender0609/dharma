# Vedatime Validation Report
Generated: 2026-04-13 19:52 UTC

## Summary
| Check | Status | Count |
|-------|--------|-------|
| Total cities (CITY_GUIDES) | ✅ | 77 |
| CITY_DETAIL_DATA complete  | ✅ | 77/77 |
| CITY_METADATA present      | ❌ | 0 cities |
| CITY_BG_ICONS complete     | ✅ | 77/77 |
| WIKI_CITY_PAGES complete   | ✅ | 77/77 |
| Cities with image URL      | ✅ | 77/77 |
| FESTIVALS_2026 data        | ❌ | 0 dates |
| PANCHANG_MUHURAT_RULES     | ❌ | missing |
| Vite build artifact        | ✅ | built |

## CITY_DETAIL_DATA gaps: ✅ All cities have detail data

## CITY_METADATA gaps: ⚠️ 77 gaps
  - agra
  - ahmedabad
  - amritsar
  - atlanta
  - auckland
  - austin
  - ayodhya
  - bali
  - bangkok
  - bengaluru
  - bodh_gaya
  - calgary
  - chandigarh
  - chennai
  - chicago
  - coimbatore
  - dallas
  - delhi
  - doha
  - dubai
  - dwarka
  - edison
  - frankfurt
  - fremont
  - geneva
  - guruvayur
  - haridwar
  - hong_kong
  - houston
  - hyderabad
  - indore
  - jaipur
  - johannesburg
  - kanchipuram
  - kathmandu
  - kolkata
  - kuala_lumpur
  - leicester
  - london
  - los_angeles
  - madurai
  - mathura
  - mauritius
  - melbourne
  - mumbai
  - muscat
  - mysuru
  - nashik
  - newyork
  - paris
  - phoenix
  - prayagraj
  - pune
  - puri
  - rameswaram
  - rishikesh
  - sacramento
  - san_francisco
  - san_jose
  - seattle
  - shirdi
  - singapore
  - somnath
  - srinagar
  - surat
  - sydney
  - thiruvananthapuram
  - tirupati
  - tokyo
  - toronto
  - udaipur
  - ujjain
  - vancouver
  - varanasi
  - visakhapatnam
  - vrindavan
  - washington_dc

## CITY_BG_ICONS gaps: ✅ All cities have bg icons

## WIKI_CITY_PAGES gaps: ✅ All cities have wiki pages

## Cities missing image URL: ✅ All cities have image URLs

## Festival Coverage 2026
- FESTIVALS_2026 constant: ❌ Missing
- Total calendar entries: 0
- PANCHANG_MUHURAT_RULES: ❌ Missing

## Build Status
- Vite dist/index.html: ✅ Found
- JS bundles: vendor-wGySg1uH.js, index-brcIjV1M.js

## Methodology Notes
- Festival dates computed from astronomical mean synodic month (29.530588 days)
- Reference new moon: JD 2451550.26 (Jan 6, 2000 18:14 UTC)
- Solar events (Sankranti) from approximate sidereal solar longitude
- All dates expressed in IST (UTC+5:30); may vary ±1 day by location
- Cross-verify critical dates: drikpanchang.com, prokerala.com
- PANCHANG_MUHURAT_RULES provides daily timing formulas (not hardcoded times)
- City images: Wikimedia Commons direct CDN URLs (no API call required)
- Wikipedia API retained as secondary fallback for image loading