function setAndSendResolution() {
    function sendResolutionToContentScript(tabs) {
        resolution = document.getElementById("resolutions").value;
        let contentToStore = {};
        contentToStore["yt-default-res"] = resolution;
        browser.storage.local.set(contentToStore);
        browser.tabs.sendMessage(tabs[0].id, {
            resolution: resolution,
        });
    }

    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(sendResolutionToContentScript)
        .catch(reportError);
}

function reportExecuteScriptError(error) {
    // console.log(error.message);
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

// console.log("Executing popup script.");

try {
    resolutionSelector = document.getElementById("resolutions");

    resolutionSelector.addEventListener("click", function () {
        setAndSendResolution();
    });

    // resolutionSelector.addEventListener("change", function() {
    //     setAndSendResolution()
    // });
} catch (error) {
    reportExecuteScriptError();
}

resolutionSelector = document.getElementById("resolutions");

browser.storage.local.get("yt-default-res").then((response) => {
    storedResolution = response["yt-default-res"];
    if (storedResolution === undefined) {
        storedResolution = "hd1080";
    }

    // console.log(storedResolution);
    resolutionSelector.value = storedResolution;
});

// browser.tabs
//   .executeScript({ file: "/yt-default-res.js" })
//   .then(setAndSendResolution)
//   .catch(reportExecuteScriptError);
