const STORAGE_KEY = "yt-default-res";
const DEFAULT_RESOLUTION = "hd1080";

// Lowest to highest.
const QUALITY_ORDER = [
    "tiny",
    "small",
    "medium",
    "large",
    "hd720",
    "hd1080",
    "hd1440",
    "hd2160",
    "hd2880",
    "highres",
];

const RETRY_INTERVAL_MS = 200;
const MAX_RETRIES = 75; // 15 seconds

let preferredResolution = DEFAULT_RESOLUTION;
let retryTimer = null;

function getPlayer() {
    const element =
        document.getElementById("movie_player") ||
        document.querySelector(".html5-video-player");
    // The player API lives on the page's object, not the content script's view of it.
    return element && (element.wrappedJSObject || element);
}

function currentVideoId() {
    return new URLSearchParams(window.location.search).get("v");
}

// Pick the highest available quality that doesn't exceed the desired one.
// `available` is ordered highest first and may include "auto".
function pickQuality(available, desired) {
    const desiredRank = QUALITY_ORDER.indexOf(desired);
    const known = available.filter((q) => QUALITY_ORDER.includes(q));
    const match = known.find((q) => QUALITY_ORDER.indexOf(q) <= desiredRank);
    return match || known[known.length - 1];
}

function isPlayerReady(player) {
    if (!player || typeof player.getAvailableQualityLevels !== "function") {
        return false;
    }
    // After in-app navigation the player can briefly still report the previous video.
    const videoData = player.getVideoData && player.getVideoData();
    if (!videoData || videoData.video_id !== currentVideoId()) {
        return false;
    }
    return player.getAvailableQualityLevels().length > 0;
}

function applyResolution(attempt = 0) {
    clearTimeout(retryTimer);
    if (window.location.pathname !== "/watch") {
        return;
    }

    const player = getPlayer();
    if (!isPlayerReady(player)) {
        if (attempt < MAX_RETRIES) {
            retryTimer = setTimeout(
                applyResolution,
                RETRY_INTERVAL_MS,
                attempt + 1,
            );
        }
        return;
    }

    const available = Array.from(player.getAvailableQualityLevels());
    const quality = pickQuality(available, preferredResolution);
    if (!quality) {
        return;
    }

    if (typeof player.setPlaybackQualityRange === "function") {
        player.setPlaybackQualityRange(quality, quality);
    }
    if (typeof player.setPlaybackQuality === "function") {
        player.setPlaybackQuality(quality);
    }
}

// YouTube is a single-page app, so watch pages are usually reached without a page load.
document.addEventListener("yt-navigate-finish", () => applyResolution());

browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
        preferredResolution =
            changes[STORAGE_KEY].newValue || DEFAULT_RESOLUTION;
        applyResolution();
    }
});

browser.storage.local.get(STORAGE_KEY).then((stored) => {
    preferredResolution = stored[STORAGE_KEY] || DEFAULT_RESOLUTION;
    applyResolution();
});
