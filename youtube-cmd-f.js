document.body.addEventListener("keydown", function (event) {
    const isOnYoutube = window.location.host == 'www.youtube.com' || window.location.host == 'youtube.com'
    const isWatchPath = window.location.pathname == "/watch"

    if (!isOnYoutube || !isWatchPath) return;

    // Override Cmd+F on MacOS, Ctrl+F on Windows
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const platformModifierKey = isMac ? "metaKey" : "ctrlKey";

    if (event[platformModifierKey] && event.key.toLowerCase() == "f") {
        const UNEXPECTED_PAGE_STRUCTURE_ERR_MSG = "Unexpected page structure found for YouTube Cmd+F helper. This extension may need to be updated to account for changes to how the subtitle pane is opened."

        // Grab the subtitle pane to check if it's already visible
        const transcriptPaneNodes = document.querySelectorAll('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')
        if (transcriptPaneNodes.length != 1) return;
        if (transcriptPaneNodes[0].getAttribute("visibility") != "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN") return;

        // Find the the elements to click that will open the transcript ("..." button -> "Show transcript")
        const primaryVideoInfoNode = document.querySelectorAll("ytd-menu-renderer.ytd-video-primary-info-renderer")
        if (primaryVideoInfoNode.length != 1) {
            console.error(UNEXPECTED_PAGE_STRUCTURE_ERR_MSG)
            return;
        }

        const moreActionsNode = primaryVideoInfoNode[0].querySelectorAll("yt-icon-button.dropdown-trigger.ytd-menu-renderer")[0]
        if (!moreActionsNode || moreActionsNode.children.length != 2 || (moreActionsNode.children > 0 && moreActionsNode.children[0].getAttribute("aria-label") != "More actions")) {
            console.error(UNEXPECTED_PAGE_STRUCTURE_ERR_MSG)
            return;
        }

        moreActionsNode.click();

        // Wait until the "Show transcript" button is ready to click
        const msPollDuration = 20;
        let msSpentWaiting = 0;
        const checkButtonExistsInterval = setInterval(function () {
            msSpentWaiting += msPollDuration;

            if (msSpentWaiting > 1000) {
                clearInterval(checkButtonExistsInterval);
                return;
            }

            if (document.querySelectorAll("ytd-menu-service-item-renderer").length > 0) {
                clearInterval(checkButtonExistsInterval);
                const moreActionNodes = document.querySelectorAll("ytd-menu-service-item-renderer");

                if (moreActionNodes.length == 0) {
                    console.error(UNEXPECTED_PAGE_STRUCTURE_ERR_MSG);
                    return;
                }

                for (const actionNode of moreActionNodes) {
                    if (actionNode.innerText == "Show transcript") {
                        actionNode.click();
                        break;
                    }
                }

            }
        }, msPollDuration);
    }
});