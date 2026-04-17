#!/usr/bin/env python3
"""
validate-vedatime.py — Vedatime Data Completeness Validator
===========================================================
Audits App.jsx for:
  - City data completeness (CITY_GUIDES, CITY_DETAIL_DATA, CITY_METADATA,
    CITY_BG_ICONS, WIKI_CITY_PAGES)
  - Image field presence in CITY_GUIDES
  - Festival calendar completeness (FESTIVALS_2026)
  - Build artifact presence

Usage:
    python3 validate-vedatime.py [--json]
    python3 validate-vedatime.py --report   (saves validation-report.md)
"""

import re, os, sys, json, datetime

APP_PATH = os.path.join(os.path.dirname(__file__), "src", "App.jsx")
REPORT_PATH = os.path.join(os.path.dirname(__file__), "validation-report.md")

# ── helpers ─────────────────────────────────────────────────────────────
def extract_keys(content, struct_name, key_pattern):
    start = content.find(f"const {struct_name}")
    if start == -1:
        return []
    # Heuristic end
    end = content.find("\nconst ", start + 100)
    chunk = content[start:end] if end != -1 else content[start:start+200000]
    return re.findall(key_pattern, chunk, re.MULTILINE)

def check_exists(content, name):
    return f"const {name}" in content

# ── load ────────────────────────────────────────────────────────────────
print(f"Reading {APP_PATH}...")
with open(APP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

def extract_text_block(content, name):
    start = content.find(f"const {name}={{")
    if start == -1: return ""
    end = content.find("};", start) + 2
    return content[start:end]

# ── city key extraction ──────────────────────────────────────────────────
guides_keys      = extract_keys(content, "CITY_GUIDES",      r"^\s{2}([a-z_]+):\{")
detail_keys      = extract_keys(content, "CITY_DETAIL_DATA", r"^\s{2}([a-z_]+):\{weather:")
metadata_keys    = extract_keys(content, "CITY_METADATA",    r"^\s{2}([a-z_]+)\s*:\s*\{name:")
wiki_keys        = extract_keys(content, "WIKI_CITY_PAGES",  r"^\s{2}([a-z_]+):\[")

bg_block = extract_text_block(content, "CITY_BG_ICONS")
bg_icon_keys = re.findall(r"\b([a-z_]{3,}):\"", bg_block)

# image fields in CITY_GUIDES
guide_start = content.find("const CITY_GUIDES = {")
guide_end   = content.find("const LOCATION_PANCHANG", guide_start)
guide_chunk = content[guide_start:guide_end]
cities_with_img    = set(re.findall(r"(\w+):\{[^{]*?image:", guide_chunk))
cities_without_img = [c for c in guides_keys if c not in cities_with_img]

# festivals
festivals_present = check_exists(content, "FESTIVALS_2026")
festival_count    = len(re.findall(r'"20\d\d-\d\d-\d\d":', content[content.find("const FESTIVALS_2026"):content.find("const FESTIVALS_2026")+200000])) if festivals_present else 0

panchang_muhurat = check_exists(content, "PANCHANG_MUHURAT_RULES")
city_metadata_ok  = check_exists(content, "CITY_METADATA")

# Build artifacts
dist_dir  = os.path.join(os.path.dirname(__file__), "dist")
build_ok  = os.path.isfile(os.path.join(dist_dir, "index.html"))
js_files  = [f for f in os.listdir(os.path.join(dist_dir, "assets")) if f.endswith(".js")] if os.path.isdir(os.path.join(dist_dir, "assets")) else []

# ── cross-reference ──────────────────────────────────────────────────────
all_cities = sorted(set(guides_keys))  # canonical list from CITY_GUIDES

missing_detail   = sorted(set(all_cities) - set(detail_keys))
missing_metadata = sorted(set(all_cities) - set(metadata_keys))
missing_bg_icon  = sorted(set(all_cities) - set(bg_icon_keys))
missing_wiki     = sorted(set(all_cities) - set(wiki_keys))

# ── report ───────────────────────────────────────────────────────────────
now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

lines = [
    "# Vedatime Validation Report",
    f"Generated: {now}",
    "",
    "## Summary",
    f"| Check | Status | Count |",
    f"|-------|--------|-------|",
    f"| Total cities (CITY_GUIDES) | {'✅' if guides_keys else '❌'} | {len(guides_keys)} |",
    f"| CITY_DETAIL_DATA complete  | {'✅' if not missing_detail else '⚠️'} | {len(detail_keys)}/{len(all_cities)} |",
    f"| CITY_METADATA present      | {'✅' if city_metadata_ok else '❌'} | {len(metadata_keys)} cities |",
    f"| CITY_BG_ICONS complete     | {'✅' if not missing_bg_icon else '⚠️'} | {len(bg_icon_keys)}/{len(all_cities)} |",
    f"| WIKI_CITY_PAGES complete   | {'✅' if not missing_wiki else '⚠️'} | {len(wiki_keys)}/{len(all_cities)} |",
    f"| Cities with image URL      | {'✅' if not cities_without_img else '⚠️'} | {len(cities_with_img)}/{len(all_cities)} |",
    f"| FESTIVALS_2026 data        | {'✅' if festivals_present else '❌'} | {festival_count} dates |",
    f"| PANCHANG_MUHURAT_RULES     | {'✅' if panchang_muhurat else '❌'} | {'present' if panchang_muhurat else 'missing'} |",
    f"| Vite build artifact        | {'✅' if build_ok else '❌'} | {'built' if build_ok else 'not built'} |",
    "",
]

def section(title, items, ok_msg):
    if not items:
        lines.append(f"## {title}: ✅ {ok_msg}")
    else:
        lines.append(f"## {title}: ⚠️ {len(items)} gaps")
        for it in items:
            lines.append(f"  - {it}")
    lines.append("")

section("CITY_DETAIL_DATA gaps", missing_detail, "All cities have detail data")
section("CITY_METADATA gaps",    missing_metadata, "All cities have metadata")
section("CITY_BG_ICONS gaps",    missing_bg_icon, "All cities have bg icons")
section("WIKI_CITY_PAGES gaps",  missing_wiki, "All cities have wiki pages")
section("Cities missing image URL", cities_without_img, "All cities have image URLs")

lines += [
    "## Festival Coverage 2026",
    f"- FESTIVALS_2026 constant: {'✅ Present' if festivals_present else '❌ Missing'}",
    f"- Total calendar entries: {festival_count}",
    f"- PANCHANG_MUHURAT_RULES: {'✅ Present' if panchang_muhurat else '❌ Missing'}",
    "",
    "## Build Status",
    f"- Vite dist/index.html: {'✅ Found' if build_ok else '❌ Not found — run npm run build'}",
    f"- JS bundles: {', '.join(js_files) if js_files else 'none'}",
    "",
    "## Methodology Notes",
    "- Festival dates computed from astronomical mean synodic month (29.530588 days)",
    "- Reference new moon: JD 2451550.26 (Jan 6, 2000 18:14 UTC)",
    "- Solar events (Sankranti) from approximate sidereal solar longitude",
    "- All dates expressed in IST (UTC+5:30); may vary ±1 day by location",
    "- Cross-verify critical dates: drikpanchang.com, prokerala.com",
    "- PANCHANG_MUHURAT_RULES provides daily timing formulas (not hardcoded times)",
    "- City images: Wikimedia Commons direct CDN URLs (no API call required)",
    "- Wikipedia API retained as secondary fallback for image loading",
]

report_text = "\n".join(lines)

# ── output ───────────────────────────────────────────────────────────────
if "--json" in sys.argv:
    result = {
        "generated": now,
        "total_cities": len(all_cities),
        "city_detail_data": {"ok": len(all_cities)-len(missing_detail), "missing": missing_detail},
        "city_metadata": {"ok": len(metadata_keys), "missing": missing_metadata},
        "city_bg_icons": {"ok": len(bg_icon_keys), "missing": missing_bg_icon},
        "wiki_pages": {"ok": len(wiki_keys), "missing": missing_wiki},
        "images": {"with_url": len(cities_with_img), "without_url": sorted(cities_without_img)},
        "festivals_2026": {"present": festivals_present, "entries": festival_count},
        "build_ok": build_ok,
    }
    print(json.dumps(result, indent=2))
elif "--report" in sys.argv:
    with open(REPORT_PATH, "w") as f:
        f.write(report_text)
    print(f"Report saved to {REPORT_PATH}")
else:
    print(report_text)

# Always return non-zero if critical checks fail
critical_fail = not guides_keys or not festivals_present or missing_detail
sys.exit(1 if critical_fail else 0)
