chrome.runtime.onInstalled.addListener(() => {
    console.log("GitHub File Downloader Installed!");
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
    if (downloadDelta.error) {
        console.error("Download error:", downloadDelta.error.current);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "downloadPageContent") {
        const pageHTML = document.documentElement.outerHTML;
        const blob = new Blob([pageHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const repoName = window.location.pathname.split("/")[1] || "github_page";

        chrome.downloads.download({
            url: url,
            filename: `${repoName}.html`
        });

        sendResponse({ success: true });
    }
});
