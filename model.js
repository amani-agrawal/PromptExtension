async function runModel(prompt) {
  try {
    const res  = await fetch("http://localhost:5001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    return data.output;  
  } catch (err) {
    console.error(err);
    return `Error: ${err.message}`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn')?.addEventListener('click', () => {
    const input_prompt = document.getElementById('promptInput')?.value || '';
    const getSelectionValue = (groupId) => {
      const group = document.getElementById(groupId);
      const activeOption = group.querySelector('.btn-option.active');
      return activeOption ? activeOption.getAttribute('data-value') : null;
    };

    const justificationValue = getSelectionValue('justificationGroup');
    const dataFetchValue = getSelectionValue('dataFetchGroup');
    const procText  = document.getElementById('processedText');
    let prompt = "Create a new, more detailed prompt for the below text:\n";
    if (justificationValue==='yes'){
      prompt+= 'Show step by step justification. ';
    }
    if (dataFetchValue==='no'){
      prompt+= 'Use the data provided in the question only. ';
    } else {
      prompt+= 'Find appropriate data and use them. ';
    }
    prompt+= input_prompt;
    runModel(prompt).then(result => {
      procText.value = result;
    });
  });
});
