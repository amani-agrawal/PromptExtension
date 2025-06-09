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
  // Debounced sender (as before)
  const sendPrompt = debounce((val) => {
    chrome.runtime.sendMessage({
      type: 'capturedPrompt',
      text: val,
    });
  }, 200);

  // 1) Create—but keep hidden—a floating “Generate” button
  const floatBtn = document.createElement('button');
  floatBtn.textContent = 'Optimize Prompt';
  Object.assign(floatBtn.style, {
    position: 'absolute',
    display: "none",
    zIndex: 9999,
    padding: '4px 8px',
    fontSize: '0.8rem',
    background: '#1f1f1f',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '4px',
    cursor: 'pointer'
  });
  document.body.appendChild(floatBtn);

  // Utility to measure and position next to the caret
  function getCaretCoordinates() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const dummy = document.createElement('span');
    dummy.textContent = '\u200b';
    range.insertNode(dummy);
    const rect = dummy.getBoundingClientRect();
    dummy.parentNode.removeChild(dummy);
    return { x: rect.left, y: rect.bottom };
  }

  function repositionFloatingButton() {
    const coords = getCaretCoordinates();
    if (!coords) {
      floatBtn.style.display = 'none';
      return;
    }
    floatBtn.style.left = `${coords.x + 2}px`;
    floatBtn.style.top = `${coords.y + 2}px`;
    floatBtn.style.display = 'block';
  }

  // 2) Listen for input—on first keystroke, show & position the button,
  //    and thereafter keep repositioning it as the user types.
  let firstKeystroke = true;
  promptBox.addEventListener('input', () => {
    const text = promptBox.innerText;
    sendPrompt(text);

    // On the very first time the user types, show the button:
    if (firstKeystroke) {
      firstKeystroke = false;
      repositionFloatingButton();
    } else {
      // On subsequent keystrokes, just reposition:
      repositionFloatingButton();
    }
  });

  // Also reposition if the caret moves without new text (arrows/clicks):
  promptBox.addEventListener('click', () => {
    if (!firstKeystroke) repositionFloatingButton();
  });
  promptBox.addEventListener('keyup', (e) => {
    const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (arrows.includes(e.key) && !firstKeystroke) {
      repositionFloatingButton();
    }
  });

  // 3) Hide the floating button if the user clicks anywhere else:
  document.addEventListener('click', (e) => {
    if (!promptBox.contains(e.target) && e.target !== floatBtn) {
      floatBtn.style.display = 'none';
    }
  });

  // 4) When “Generate” is clicked, notify background/popup as before:
  floatBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'userClickedOptimize' });
  });
});

// If the element never appears, you can optionally log
setTimeout(() => {
  if (!document.querySelector('div[id="prompt-textarea"]')) {
    console.warn("Failed to locate prompt-textarea within timeout.");
  }
}, 10000);
