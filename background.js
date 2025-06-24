// Background script to handle file downloads
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadFile') {
        // Convert content to data URL for Manifest V3 compatibility
        const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(request.content);
        
        // Download the file
        chrome.downloads.download({
            url: dataUrl,
            filename: request.filename,
            saveAs: false // Set to true if you want to prompt for save location
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError);
            } else {
                console.log('Download started:', downloadId);
            }
        });
        
        sendResponse({ success: true });
    }
});

// Optional: Clean up old downloads or manage storage
chrome.runtime.onInstalled.addListener(() => {
    console.log('Claude Chat Archiver extension installed');
});







// ! old code, relied on Object URL API which is not available to service workers 
// ! in Manifest V3 
// // Background script to handle file downloads
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'downloadFile') {
         // Create a blob URL for the content
//         const blob = new Blob([request.content], { type: 'text/plain' });
//         const url = URL.createObjectURL(blob);
        
//         // Download the file
//         chrome.downloads.download({
//             url: url,
//             filename: request.filename,
//             saveAs: false // Set to true if you want to prompt for save location
//         }, (downloadId) => {
//             if (chrome.runtime.lastError) {
//                 console.error('Download failed:', chrome.runtime.lastError);
//             } else {
//                 console.log('Download started:', downloadId);
//                 // Clean up the blob URL
//                 URL.revokeObjectURL(url);
//             }
//         });
        
//         sendResponse({ success: true });
//     }
// });

// // Optional: Clean up old downloads or manage storage
// chrome.runtime.onInstalled.addListener(() => {
//     console.log('Claude Chat Archiver extension installed');
// });