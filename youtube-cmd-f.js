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

        // Find the 'Show transcript' button within the ytd-button-renderer element
        const outerYtdButtonRenderer = document.querySelector('ytd-button-renderer.ytd-video-description-transcript-section-renderer')
        if (!outerYtdButtonRenderer) {
            console.error(UNEXPECTED_PAGE_STRUCTURE_ERR_MSG);
            return;
        }

        const showTranscriptButton = outerYtdButtonRenderer.querySelector('button:only-child')
        if(showTranscriptButton && showTranscriptButton.innerText == "Show transcript"){
            showTranscriptButton.click();
        }
    }
});