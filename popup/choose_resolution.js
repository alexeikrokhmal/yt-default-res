const STORAGE_KEY = "yt-default-res";
const DEFAULT_RESOLUTION = "hd1080";

const resolutionSelector = document.getElementById("resolutions");

function showError(error) {
    document.getElementById("popup-content").hidden = true;
    document.getElementById("error-content").hidden = false;
    console.error(`Failed to access storage: ${error.message}`);
}

// Open YouTube tabs pick the change up through storage.onChanged.
resolutionSelector.addEventListener("change", () => {
    browser.storage.local
        .set({ [STORAGE_KEY]: resolutionSelector.value })
        .catch(showError);
});

browser.storage.local
    .get(STORAGE_KEY)
    .then((stored) => {
        resolutionSelector.value = stored[STORAGE_KEY] || DEFAULT_RESOLUTION;
    })
    .catch(showError);
