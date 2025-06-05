// contentScript.js – injected into ChatGPT to capture user prompt input from the contenteditable div
console.log("Prompt Extension content script loaded.");

// debounce helper so we don't fire on every keystroke
defaultDelay = 300;
const debounce = (fn, delay = defaultDelay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

// Utility: wait until the contenteditable div appears
function waitForPromptBox(callback) {
  const interval = setInterval(() => {
    const el = document.querySelector('div[id="prompt-textarea"]');
    if (el) {
      clearInterval(interval);
      callback(el);
    }
  }, 300);
}

waitForPromptBox((promptBox) => {
  console.log("Prompt box found!", promptBox);

  const sendPrompt = debounce((val) => {
    console.log("Sending prompt: ", val);
    chrome.runtime.sendMessage({
      type: 'capturedPrompt',
      text: val,
    });
  }, 200);

  // Listen for input events on the contenteditable div
  promptBox.addEventListener('input', () => {
    // innerText retrieves the plain text inside the div
    sendPrompt(promptBox.innerText);
  });
});

// If the element never appears, you can optionally log
setTimeout(() => {
  if (!document.querySelector('div[id="prompt-textarea"]')) {
    console.warn("Failed to locate prompt-textarea within timeout.");
  }
}, 10000);
