# claude_browser_archive_extension

A browser extension that automatically archives your Claude AI conversations with customizable export formats and auto-save functionality.

## Features

- **Manual Save**: One-click saving of current conversation
- **Auto-Save**: Configurable automatic saving at set intervals (5-30 minutes)  
- **Multiple Export Formats**: Markdown, Plain Text, and JSON
- **Smart Detection**: Automatically identifies and extracts chat messages
- **Local Storage**: All files saved directly to your Downloads folder
- **Privacy First**: No data sent to external servers

## Installation

### Chrome/Edge (Developer Mode)

1. **Download the extension**
   ```bash
   git clone https://github.com/ClaspMyGoose/claude-chat-archiver.git
   cd claude-chat-archiver
   ```

2. **Open Extensions page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `claude-chat-archiver` folder
   - The extension should now appear in your extensions list

5. **Verify installation**
   - Look for the Claude Chat Archiver icon in your browser toolbar
   - Navigate to [Claude.ai](https://claude.ai) to test

## Usage

### Manual Save
1. Navigate to Claude.ai and start a conversation
2. Click the extension icon in your toolbar
3. Click "Save Current Chat"
4. Check your Downloads folder for the saved file

### Auto-Save Setup
1. Click the extension icon
2. Check "Enable Auto-Save"
3. Select your preferred interval (5-30 minutes)
4. Choose export format (Markdown recommended)
5. Files will automatically save to Downloads at the specified interval

### Export Formats

- **Markdown** (`.md`): Clean formatting with headers and sections
- **Plain Text** (`.txt`): Simple text format for easy reading
- **JSON** (`.json`): Structured data format for programmatic use

## File Structure

```
claude-chat-archiver/
├── manifest.json      # Extension configuration
├── popup.html         # Extension UI interface  
├── popup.js          # UI event handlers and settings
├── content.js        # Main chat extraction logic
├── background.js     # File download handling
└── README.md         # This file
```

## How It Works

1. **Content Script** (`content.js`) runs automatically on Claude.ai pages
2. **Message Detection** analyzes the DOM to identify chat messages
3. **Format Processing** converts messages to your chosen export format
4. **Background Download** (`background.js`) handles file creation and download
5. **Settings Persistence** remembers your preferences between sessions

## Troubleshooting

### Extension Not Working
- Ensure you're on a Claude.ai page
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the Claude.ai page

### Files Not Downloading
- Check your browser's download settings
- Verify Downloads folder permissions
- Look for download prompts that may be blocked

### Messages Not Detected
- Claude.ai may have updated their page structure
- Check browser console for errors (F12 → Console)
- Try refreshing the page and saving again

## Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/ClaspMyGoose/claude-chat-archiver.git
cd claude-chat-archiver

# Make changes to the files
# Reload extension in chrome://extensions/
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly on Claude.ai
5. Submit a pull request

## Roadmap

- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] Conversation search and indexing
- [ ] HTML export with preserved formatting
- [ ] Batch export of multiple conversations
- [ ] Custom file naming patterns
- [ ] Conversation analytics and insights

## Privacy & Security

- **No Data Collection**: Extension works entirely offline
- **Local Storage Only**: All files saved to your device
- **No Network Requests**: No data sent to external servers
- **Source Code**: Fully open source and auditable

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

If you encounter issues or have feature requests:
- Open an [Issue](https://github.com/ClaspMyGoose/claude-chat-archiver/issues)
- Check existing issues for solutions
- Contribute improvements via Pull Requests

---

**Note**: This extension is not affiliated with Anthropic or Claude AI. It's a community tool for archiving your own conversations.