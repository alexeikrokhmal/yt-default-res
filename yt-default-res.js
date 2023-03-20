// const possibleResolutions = ['highres', 'hd2880', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
const resolutionMap = new Map();

resolutionMap.set("tiny", 0);
resolutionMap.set("small", 1);
resolutionMap.set("medium", 2);
resolutionMap.set("large", 3);
resolutionMap.set("hd720", 4);
resolutionMap.set("hd1080", 5);
resolutionMap.set("hd1440", 6);
resolutionMap.set("hd2160", 7);
resolutionMap.set("hd2880", 8);
resolutionMap.set("highres", 9);

function unwrapElement(element) {
    if (element && element.wrappedJSObject) {
        return element.wrappedJSObject;
    }
    return element;
}

function setResolution(youtubePlayer, resolution) {
    if (youtubePlayer.getPlaybackQuality === undefined) {
        win.setTimeout(setResolution, 100, youtubePlayer);
    } else {
        highestAvailableQuality = youtubePlayer.getAvailableQualityLevels()[0];

        if (
            resolutionMap.get(highestAvailableQuality) <
            resolutionMap.get(resolution)
        ) {
            resolution = highestAvailableQuality;
        }

        if (youtubePlayer.setPlaybackQualityRange !== undefined) {
            youtubePlayer.setPlaybackQualityRange(resolution);
        }
        youtubePlayer.setPlaybackQuality(resolution);
    }
}

browser.runtime.onMessage.addListener((request) => {
    let ytPlayer =
        document.getElementById("movie_player") ||
        document.getElementsByClassName("html5-video-player")[0];
    let ytPlayerUnwrapped = unwrapElement(ytPlayer);
    setResolution(ytPlayerUnwrapped, request.resolution);

    return Promise.resolve();
});
