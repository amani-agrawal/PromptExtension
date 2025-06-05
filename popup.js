function bindToggle(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-option');
    if (!btn) return;
    [...group.children].forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
}

// Main DOM ready handler
window.addEventListener('DOMContentLoaded', () => {
  ['questionTypeGroup', 'justificationGroup', 'dataFetchGroup'].forEach(bindToggle);

  const copyBtn   = document.getElementById('copyBtn');
  const procText  = document.getElementById('processedText');
  const thumbUp   = document.getElementById('thumbUp');
  const thumbDown = document.getElementById('thumbDown');
  const enableFloat = document.getElementById('enableFloating');
  const originalIconHTML = copyBtn.innerHTML;

  

  chrome.runtime.sendMessage({ type: 'getLastPrompt' }, (response) => {
    console.log("Trying to read value!", response);
    if (response?.text !== undefined) {
      promptInput.value = response.text;
    }
  });

  copyBtn.addEventListener('click', async () => {
    const text = procText?.value ?? '';
    if (!navigator.clipboard) {
      alert('Clipboard API not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      copyBtn.innerHTML = '✔️';
      setTimeout(() => {
        copyBtn.innerHTML = originalIconHTML;
      }, 1200);

      thumbUp.classList.remove('hidden');
      thumbDown.classList.remove('hidden');
    } catch (err) {
      console.error('Copy failed:', err);
      copyBtn.innerHTML = '❌';
      setTimeout(() => {
        copyBtn.innerHTML = originalIconHTML;
      }, 1200);
    }
  });

  document.getElementById('generateBtn')?.addEventListener('click', () => {
    const promptVal = document.getElementById('promptInput')?.value || '';
    // TODO: plug in model
    procText.value = promptVal;
  });
});
