# Giá.exchange

A lightweight currency converter PWA built for use on mobile while traveling — optimized for slow connections, minimal data usage, and instant launch.

---

## What it is

A single HTML file with no framework, no build step, and no dependencies beyond two self-hosted font files. The entire app — markup, styles, and logic — lives in `index.html`. It's deployed as a GitHub Pages site and installable as a PWA on iOS and Android.

---

## How it works

### Rate data

Exchange rates come from [ExchangeRate-API](https://www.exchangerate-api.com). The app always fetches a single USD-based rate table, then derives any currency pair from that using cross-rate math:

```
VND → EUR  =  USD_rates[EUR] / USD_rates[VND]
```

This means **one network request per day**, regardless of how many different currency pairs you convert. The alternative — fetching a fresh rate table for each "from" currency — would multiply data usage by the number of currencies used in a session.

Rates are cached in `localStorage` with the API's own `nextUpdate` timestamp (typically 24 hours). On subsequent launches, the cached rates are used immediately. If the cache is stale, the app still shows the old rates instantly and refreshes in the background — so you always get a result, even on a slow connection.

### Offline / launch performance

The app is registered as a [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) with a service worker (`sw.js`). On first load, the SW caches:

- `index.html`
- `manifest.json`
- `logo.svg` (wordmark)
- `fonts/space-mono-400.woff2`
- `fonts/space-mono-700.woff2`
- `fonts/outfit-400.woff2`

Every subsequent launch loads entirely from cache — no network required for the app shell. This eliminates the 3–7 second blank screen that would otherwise occur on a slow connection while the browser waits for fonts and HTML to download.

The fonts are self-hosted for this reason. Using Google Fonts requires two sequential network round trips on every launch (one for the CSS, one for the font file itself), which are a major source of startup lag on poor connections.

### Status indicator

The header pill shows the current state of the rate data:

- **READY** (lime dot) — rates loaded, conversions available
- **LOADING** (orange dot) — fetching fresh rates from the network
- **ERROR** (red dot) — network request failed

If you're offline but have a cached rate, the app shows READY and converts using the cached data. The timestamp shown below each conversion result tells you how current the rates are.

### Volatility warning

A small set of currencies known for high volatility (ARS, TRY, NGN, etc.) trigger a warning banner when selected, reminding you to verify before transacting.

### Settings

Tap the sliders icon in the header to open the settings panel. From there you can:

- **Enable or disable currencies** — choose which currencies appear in the converter dropdowns. 160+ currencies are available, sourced from ExchangeRate-API.
- **Search** — filter the currency list by code or name to find what you need quickly.
- **Restore defaults** — reset to the default set (USD, EUR, THB, VND, TWD, CNY).

Enabled currencies are saved to `localStorage` and persist across sessions. The settings panel opens with a card-flip animation.

---

## File structure

```
index.html          — the entire app
sw.js               — service worker (caching + offline)
manifest.json       — PWA manifest (name, icons, display mode)
logo.svg            — wordmark used in the header
icon-192.png        — PWA home screen icon
icon-512.png        — PWA splash / store icon
favicon.ico         — browser tab icon
fonts/
  space-mono-400.woff2
  space-mono-700.woff2
  outfit-400.woff2
```

---

## Supported currencies

160+ currencies are available, including all major and many minor currencies supported by ExchangeRate-API. The default set shown on first launch is:

| Code | Currency        |
|------|----------------|
| USD  | US Dollar       |
| EUR  | Euro            |
| THB  | Thai Baht       |
| VND  | Vietnamese Dong |
| TWD  | Taiwan Dollar   |
| CNY  | Chinese Yuan    |

Additional currencies can be enabled at any time from the settings panel.
