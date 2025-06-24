document.addEventListener('DOMContentLoaded', async () => {
    const saveNowButton = document.getElementById('saveNow');
    const autoSaveCheckbox = document.getElementById('autoSave');
    const intervalSelect = document.getElementById('interval');
    const formatSelect = document.getElementById('format');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    const settings = await chrome.storage.local.get(['autoSave', 'interval', 'format']);
    autoSaveCheckbox.checked = settings.autoSave || false;
    intervalSelect.value = settings.interval || 10;
    formatSelect.value = settings.format || 'markdown';

    // Update status
    function updateStatus(message) {
        statusDiv.textContent = message;
        setTimeout(() => {
            statusDiv.textContent = 'Ready';
        }, 3000);
    }

    // Save current chat
    saveNowButton.addEventListener('click', async () => {
        updateStatus('Saving...');
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('claude.ai')) {
                updateStatus('Please navigate to Claude.ai first');
                return;
            }

            await chrome.tabs.sendMessage(tab.id, {
                action: 'saveChat',
                format: formatSelect.value
            });
            
            updateStatus('Chat saved!');
        } catch (error) {
            console.error('Error saving chat:', error);
            updateStatus('Error saving chat');
        }
    });

    // Toggle auto-save
    autoSaveCheckbox.addEventListener('change', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('claude.ai')) {
                updateStatus('Auto-save only works on Claude.ai');
                autoSaveCheckbox.checked = false;
                return;
            }

            await chrome.tabs.sendMessage(tab.id, {
                action: 'toggleAutoSave',
                enabled: autoSaveCheckbox.checked,
                interval: parseInt(intervalSelect.value)
            });

            // Save settings
            await chrome.storage.local.set({
                autoSave: autoSaveCheckbox.checked,
                interval: parseInt(intervalSelect.value),
                format: formatSelect.value
            });

            updateStatus(autoSaveCheckbox.checked ? 'Auto-save enabled' : 'Auto-save disabled');
        } catch (error) {
            console.error('Error toggling auto-save:', error);
            updateStatus('Error configuring auto-save');
            autoSaveCheckbox.checked = false;
        }
    });

    // Save settings when changed
    intervalSelect.addEventListener('change', () => {
        chrome.storage.local.set({ interval: parseInt(intervalSelect.value) });
        
        // If auto-save is enabled, restart with new interval
        if (autoSaveCheckbox.checked) {
            autoSaveCheckbox.dispatchEvent(new Event('change'));
        }
    });

    formatSelect.addEventListener('change', () => {
        chrome.storage.local.set({ format: formatSelect.value });
    });

    // Show chat preview if available
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url.includes('claude.ai')) {
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'getChatPreview'
            });
            
            if (response && response.preview) {
                updateStatus('Chat detected');
            }
        }
    } catch (error) {
        // Ignore errors for preview
    }
});