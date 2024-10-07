updateProgressBar('search');
document.getElementById('back-button').addEventListener('click', function () {
  loadPage('goal');
});

prev_page = 'goal';

var selectedInput = null;
var selectedOutput = null;

/* Function to handle input selection */
function selectInput(element) {
    if (selectedInput) {
        selectedInput.classList.remove('selected');
    }
    selectedInput = element;
    selectedInput.classList.add('selected');
}

/* Function to handle output selection */
function selectOutput(element) {
    if (selectedOutput) {
        selectedOutput.classList.remove('selected');
    }
    selectedOutput = element;
    selectedOutput.classList.add('selected');
}

/* Placeholder function for submitting the selection */
function submitSelection() {
    if (selectedInput && selectedOutput) {
        const inputText = selectedInput.textContent;
        const outputText = selectedOutput.textContent;
        console.log(`Selected Input: ${inputText}, Selected Output: ${outputText}`);
        // Placeholder for actual submission logic
    } else {
        console.log("Please select both input and output.");
    }
}
