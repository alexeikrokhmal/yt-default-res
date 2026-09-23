# YouTube Default Resolution

A Firefox extension that automatically sets YouTube videos to your preferred
resolution. If a video isn't available at that resolution, it picks the highest
one below it (or the lowest available, if every option is higher).

## Features

- Choose a default of 2160p, 1440p, 1080p or 720p from the toolbar popup.
  1080p is used until you pick something else.
- Works when you move between videos without a full page load, since YouTube
  is a single-page app.
- Changing the resolution in the popup applies immediately to open YouTube
  tabs.
- Needs only the `storage` permission and access to `www.youtube.com`. No data
  is collected.

## Installation

The extension targets Firefox 140 or later (142 on Android) and uses Manifest V3.

### Temporary install (for development)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select `manifest.json` from this repository.

The extension stays loaded until Firefox restarts.

### With web-ext

[web-ext](https://github.com/mozilla/web-ext) can run the extension in a fresh
Firefox profile and reload it on changes:

```bash
npx web-ext run
```

To build a package into `web-ext-artifacts/`:

```bash
npx web-ext build
```

## How it works

[`yt-default-res.js`](yt-default-res.js) is a content script that runs on
YouTube pages. On each watch page, including after YouTube's in-app
`yt-navigate-finish` navigation, it waits for the player to load the current
video and then calls the player's quality API to lock playback to the chosen
resolution. It retries for up to 15 seconds while the player gets ready.

The popup ([`popup/`](popup)) saves your choice to `browser.storage.local`, and
the content script listens for storage changes to pick it up.

## Project structure

```
manifest.json              Extension manifest
yt-default-res.js          Content script that sets the player's quality
popup/                     Toolbar popup for choosing the resolution
icons/                     Extension icons
```

## License

[MIT](LICENSE)
