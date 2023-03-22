browser.tabs.onUpdated.addListener((tabId, changed, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        browser.scripting.executeScript({
            target: {
                tabId: tab.id,
            },
            files: ["/yt-default-res.js"],
        });

        browser.storage.local.get("yt-default-res").then((response) => {
            storedResolution = response["yt-default-res"];
            if (storedResolution === undefined) {
                storedResolution = "hd1080";
            }

            browser.tabs.sendMessage(tab.id, { resolution: storedResolution });
        });
    }
});
