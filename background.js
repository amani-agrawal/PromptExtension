let lastPrompt = '';

// Listen for any messages from content scripts or the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    // 1) Content script sends a new prompt whenever the user types
    case 'capturedPrompt':
        lastPrompt = msg.text;
    break;

    // 2) Popup asks for the “last prompt” when it opens
    case 'getLastPrompt':
        sendResponse({ text: lastPrompt });
    break;

    case 'userClickedOptimize':
        chrome.action.openPopup();
    break;

    default:
      break;
  }
});
