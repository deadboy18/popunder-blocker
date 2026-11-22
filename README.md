# Popunder Blocker - 1shows, 1flex, 1tube

A Tampermonkey/Violentmonkey userscript that blocks popunder and clickunder ads on streaming sites **1shows.org**, **1flex.org**, and **1tube.org**.

## The Problem

These sites inject ad scripts that hijack your clicks — every time you click play, pause, or anywhere on the page, a popup/popunder opens in a new tab. Even with **uBlock Origin Lite** (Manifest V3), the popups still fire because MV3 extensions can only block the navigation *after* the redirect, not prevent the script from executing in the first place.

## How It Works

The script runs at `document-start` (before any page scripts load) and does two things:

1. **Removes ad scripts** — A MutationObserver watches the DOM and removes `<script>` tags from known ad domains (`layla.wtf`, `llvpn.com`, `daleelerah.info`, `reffpa.com`) before they can execute and attach click listeners to the page.

2. **Intercepts `window.open`** — As a fallback, overrides `window.open` to silently block any popup attempts targeting known ad redirect domains (`daleelerah`, `reffpa`, `v2006`, `rtb-pops`).

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) browser extension
2. Click the link below to install the script:

   **[Install popunder-blocker.user.js](https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/popunder-blocker.user.js)**

3. Click "Install" when prompted by your userscript manager
4. Done — visit any of the supported sites and popups are gone

## Supported Sites

| Site | URL |
|------|-----|
| 1shows | `1shows.org` |
| 1flex | `1flex.org` |
| 1tube | `1tube.org` |

## Blocked Domains

| Domain | Role |
|--------|------|
| `layla.wtf` | Ad script injection (click hijacker) |
| `llvpn.com` | Ad script injection |
| `daleelerah.info` | Popunder redirect endpoint |
| `reffpa.com` | Popunder redirect endpoint |
| `v2006.com` | Popunder redirect endpoint |

## Why Not Just Use uBlock Origin?

- **uBlock Origin** (full, MV2) handles this fine — but Chrome is phasing out MV2 extensions
- **uBlock Origin Lite** (MV3) blocks the popup destination but can't prevent the script from hijacking clicks, so you still get the "blocked page" tab opening every time you click
- This userscript runs via Tampermonkey (which still has MV3 support) and kills the scripts *before* they execute

## License

MIT
