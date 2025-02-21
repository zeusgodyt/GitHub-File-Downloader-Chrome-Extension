chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getFileLinks") {
        let fileLinks = [];
        document.querySelectorAll('a[href*="package.json"]').forEach(link => {
            let fileUrl = link.href;

            // Only select actual package.json files (ignore search & pagination links)
            if (fileUrl.includes("/blob/") && !fileUrl.includes("search?q=")) {
                let rawUrl = fileUrl.replace("/blob/", "/raw/"); // Convert to raw link
                
                // Use regex to capture the file path and extract just the file name.
                let match = fileUrl.match(/github\.com\/([^\/]+\/[^\/]+)\/blob\/(.+)/);
                let fileName = match ? match[2].split('/').pop() : "unknown.json";

                fileLinks.push({ url: rawUrl, name: fileName });
            }
        });

        sendResponse({ files: fileLinks });
    }
});
