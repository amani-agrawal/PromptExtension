async function runModel(prompt) {
    fetch("http://localhost:5001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt})
    })
    .then(r => r.json())
    .then(d => {return d});
    return "Error, could not generate output!";
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