// Keep track of the last prompt text seen from ChatGPT
let lastPrompt = '';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'capturedPrompt') {
    lastPrompt = msg.text;
  }
  console.log("Message saved!", lastPrompt);
});

// When the popup requests the current prompt, send it back
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getLastPrompt') {
    sendResponse({ text: lastPrompt });
  }
  // (no return here; sendResponse is synchronous in MV3)
});
