// Content script that runs on Claude.ai pages
class ClaudeChatArchiver {
    constructor() {
        this.lastSaveTime = 0;
        this.autoSaveInterval = null;
        this.initializeListeners();
        this.loadSettings();
    }

    initializeListeners() {
        // Listen for messages from popup and background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'saveChat':
                    this.saveCurrentChat(request.format);
                    sendResponse({ success: true });
                    break;
                case 'toggleAutoSave':
                    this.toggleAutoSave(request.enabled, request.interval);
                    sendResponse({ success: true });
                    break;
                case 'getChatPreview':
                    sendResponse({ preview: this.getChatPreview() });
                    break;
            }
        });
    }

    async loadSettings() {
        const settings = await chrome.storage.local.get(['autoSave', 'interval', 'format']);
        if (settings.autoSave) {
            this.startAutoSave(settings.interval || 10);
        }
    }

    extractChatMessages() {
        const messages = [];
        
        // Try to find chat messages - these selectors may need adjustment
        // based on Claude.ai's current DOM structure
        const messageElements = document.querySelectorAll('[data-testid*="message"], [class*="message"], .conversation-turn');
        
        // Fallback: look for common patterns
        if (messageElements.length === 0) {
            const fallbackSelectors = [
                'div[role="group"]',
                '.prose',
                '[class*="conversation"]',
                '[class*="chat"]'
            ];
            
            for (const selector of fallbackSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    elements.forEach(el => {
                        if (el.textContent.trim().length > 20) {
                            messageElements.push(el);
                        }
                    });
                    break;
                }
            }
        }

        messageElements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (text.length > 0) {
                // Try to determine if it's user or assistant message
                const isUser = element.closest('[data-is-user="true"]') || 
                              element.classList.contains('user') ||
                              element.querySelector('[aria-label*="user"]');
                
                messages.push({
                    index: index,
                    role: isUser ? 'user' : 'assistant',
                    content: text,
                    timestamp: new Date().toISOString()
                });
            }
        });

        return messages;
    }

    getChatPreview() {
        const messages = this.extractChatMessages();
        const preview = messages.slice(-3).map(m => 
            `${m.role}: ${m.content.substring(0, 50)}...`
        ).join('\n');
        return preview || 'No messages found';
    }

    formatMessages(messages, format) {
        const timestamp = new Date().toISOString().split('T')[0];
        const title = `Claude Chat - ${timestamp}`;

        switch (format) {
            case 'markdown':
                let md = `# ${title}\n\n`;
                messages.forEach(msg => {
                    md += `## ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n\n`;
                    md += `${msg.content}\n\n---\n\n`;
                });
                return md;

            case 'json':
                return JSON.stringify({
                    title,
                    timestamp: new Date().toISOString(),
                    messages
                }, null, 2);

            case 'text':
            default:
                let text = `${title}\n${'='.repeat(title.length)}\n\n`;
                messages.forEach(msg => {
                    text += `[${msg.role.toUpperCase()}]\n${msg.content}\n\n`;
                });
                return text;
        }
    }

    async saveCurrentChat(format = 'markdown') {
        try {
            const messages = this.extractChatMessages();
            console.log('Found messages:', messages.length, messages);
            if (messages.length === 0) {
                console.log('No chat messages found to save');
                return;
            }

            const content = this.formatMessages(messages, format);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const extension = format === 'json' ? 'json' : (format === 'markdown' ? 'md' : 'txt');
            const filename = `${timestamp}-claude-chat.${extension}`;

            // Send to background script for download
            chrome.runtime.sendMessage({
                action: 'downloadFile',
                content: content,
                filename: filename
            });

            this.lastSaveTime = Date.now();
            console.log(`Chat saved: ${filename}`);
            
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    }

    startAutoSave(intervalMinutes) {
        this.stopAutoSave();
        
        this.autoSaveInterval = setInterval(() => {
            this.saveCurrentChat();
        }, intervalMinutes * 60 * 1000);
        
        console.log(`Auto-save started: every ${intervalMinutes} minutes`);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('Auto-save stopped');
        }
    }

    toggleAutoSave(enabled, intervalMinutes) {
        if (enabled) {
            this.startAutoSave(intervalMinutes);
        } else {
            this.stopAutoSave();
        }
        
        // Save settings
        chrome.storage.local.set({
            autoSave: enabled,
            interval: intervalMinutes
        });
    }
}

// Initialize the archiver when the script loads
const archiver = new ClaudeChatArchiver();