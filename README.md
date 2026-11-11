# Giá.exchange

A currency converter for travelling: an installable web app that opens instantly and keeps working on slow or missing connections.

**Live:** https://alexkatzen.github.io/currency-converter/

## Using it

- **Convert:** type an amount and tap **Convert to …**. You get the result, the rate, and when the rates were last updated. Below that is the same amount in each of your other currencies, with the current pair highlighted. Keep typing and the results update as you go.
- **Swap:** tap the pair in the header to swap it. If a result is showing, it also converts that result back the other way.
- **Change the pair:** tap the sliders button in the header to open settings, then pick From and To. Picking the same currency on both sides swaps them. Your pair is remembered.
- **Your currencies:** in settings, choose which of the 160+ currencies appear in your results and pickers. You can search by code, name or country ("Vietnam"). **Restore defaults** resets the list to USD, EUR, THB, VND, TWD and CNY.
- **Theme:** the moon/sun button switches between dark and light. It follows your system setting until you choose one.
- **Volatility warning:** a warning appears when ARS, TRY, NGN, PKR, EGP, IRR, VES or ZWL is in the pair. These rates can move quickly, so check them before you pay.

Before you convert, the main screen lists the rate from your From currency to each of your currencies, with the date the rates are from. Tap one to make it the To currency.

On a phone, results open in a bottom sheet that you drag down to dismiss. On screens 1024px and wider, the controls sit on the left and the results on the right.

## How it stays fast

**One rate request a day.** The app fetches a single USD-based table from [ExchangeRate-API](https://www.exchangerate-api.com) and works out every other pair from it (`A → B = rates[B] / rates[A]`). Changing pairs never costs another request.

**Cached rates show first.** Rates are kept in `localStorage` until the API's `nextUpdate` time (usually 24 hours). After that, the old rates still show straight away and fresh ones load in the background. With no connection, the app keeps working as long as it has cached rates; each result shows when its rates are from. On first use with no connection, it shows an error.

**The app itself works offline.** A service worker (`sw.js`) caches the page, fonts, logo and iOS splash screens when the app is first installed. After that, it loads from the cache without using the network. The fonts are hosted in this repo rather than loaded from Google Fonts, which saves two network round trips each time the app opens.

## Development

There's no build step and no dependencies: the whole app (markup, styles and logic) is in `index.html`.

**Run locally.** The service worker paths start with `/currency-converter/`, so serve the folder *above* the repo:

```sh
cd .. && python3 -m http.server 8000
# open http://localhost:8000/currency-converter/
```

**Deploy.** Push to `main`; GitHub Pages serves it. **Bump `CACHE_NAME` in `sw.js` with every change**, otherwise installed copies keep serving the old cached version.

**Splash screens.** If you change `logo.svg`, regenerate the iOS splash images with `python3 gen-splash.py`. It needs Pillow and `rsvg-convert` (`brew install librsvg`).

**API key.** The ExchangeRate-API key in `index.html` is a free-tier key that runs in the browser, so anyone can see it. Don't put a paid key there.

## Files

```
index.html            the whole app
sw.js                 service worker: caches the app for offline use
manifest.json         PWA manifest
logo.svg              wordmark
icon-192.png, icon-512.png, favicon.ico
fonts/                Space Grotesk, Outfit, and a currency-symbol subset of Inter
splash/               iOS launch images (made by gen-splash.py)
gen-splash.py         regenerates splash/ from logo.svg
```
