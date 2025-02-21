document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scan-btn");
    const fileListContainer = document.getElementById("file-list");
    const downloadBtn = document.getElementById("download-btn");
    const selectAllContainer = document.getElementById("select-all-container");
    const selectAllCheckbox = document.getElementById("select-all-checkbox");

    scanBtn.addEventListener("click", () => {
        const selectedTypes = Array.from(document.querySelectorAll('#file-type-container input:checked')).map(opt => opt.value);

        if (selectedTypes.length === 0) {
            alert("⚠️ Please select at least one file type to scan.");
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getFileLinks", types: selectedTypes }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    alert("⚠️ Content script not running. Refresh the page and try again.");
                    return;
                }

                if (response && response.files.length > 0) {
                    fileListContainer.innerHTML = ""; // Clear previous content

                    response.files.forEach((file, index) => {
                        const fileItem = document.createElement("label");
                        fileItem.innerHTML = `
                            <input type="checkbox" class="file-checkbox" value="${file.url}" data-name="${file.name}">
                            ${index + 1}. ${file.name} <span class="source">(GitHub)</span>
                        `;
                        fileListContainer.appendChild(fileItem);
                    });

                    selectAllContainer.style.display = "block";
                    selectAllCheckbox.checked = false;

                    selectAllCheckbox.addEventListener("change", function() {
                        document.querySelectorAll(".file-checkbox").forEach(checkbox => {
                            checkbox.checked = selectAllCheckbox.checked;
                        });
                    });

                    downloadBtn.disabled = false;
                } else {
                    fileListContainer.innerHTML = "<p>⚠️ No matching files found!</p>";
                    downloadBtn.disabled = true;
                    selectAllContainer.style.display = "none";
                }
            });
        });
    });

    downloadBtn.addEventListener("click", () => {
        const selectedFiles = Array.from(document.querySelectorAll(".file-checkbox:checked"));
    
        if (selectedFiles.length === 0) {
            alert("⚠️ Please select at least one file to download.");
            return;
        }
    
        selectedFiles.forEach((checkbox, index) => {
            let fileUrl = checkbox.value;
            let fileName = `package${index + 1}.json`; // Sequential naming
    
            chrome.downloads.download({
                url: fileUrl,
                filename: fileName,  // Saves as package1.json, package2.json, etc.
                saveAs: false        // Directly downloads without asking
            });
        });
    
        alert(`✅ Downloading ${selectedFiles.length} files!`);
    });
        
});
