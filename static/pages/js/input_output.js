updateProgressBar('search');

document.getElementById('back-button').addEventListener('click', function () {
    loadLastPage();
  });

// Arrays to hold selected inputs and outputs
var selectedInputs = [];
var selectedOutputs = [];

/* Function to handle input selection */
function selectInput(element) {
    if (selectedInputs.includes(element)) {
        // Deselect if already selected
        element.classList.remove('selected');
        selectedInputs = selectedInputs.filter(item => item !== element);
    } else if (selectedInputs.length < 2) {
        // Select if below max limit
        element.classList.add('selected');
        selectedInputs.push(element);
    }

    // Update the disabled state of other input items
    updateInputDisabledState();
    checkButtonState();
}

/* Function to handle output selection */
function selectOutput(element) {
    if (selectedOutputs.includes(element)) {
        // Deselect if already selected
        element.classList.remove('selected');
        selectedOutputs = selectedOutputs.filter(item => item !== element);
    } else if (selectedOutputs.length < 2) {
        // Select if below max limit
        element.classList.add('selected');
        selectedOutputs.push(element);
    }

    // Update the disabled state of other output items
    updateOutputDisabledState();
    checkButtonState();
}

/* Function to update disabled state of input items */
function updateInputDisabledState() {
    const inputItems = document.querySelectorAll('.inputs .item');
    if (selectedInputs.length >= 2) {
        inputItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                item.classList.add('disabled');
            }
        });
    } else {
        inputItems.forEach(item => item.classList.remove('disabled'));
    }
}

/* Function to update disabled state of output items */
function updateOutputDisabledState() {
    const outputItems = document.querySelectorAll('.outputs .item');
    if (selectedOutputs.length >= 2) {
        outputItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                item.classList.add('disabled');
            }
        });
    } else {
        outputItems.forEach(item => item.classList.remove('disabled'));
    }
}

function checkButtonState() {
    const submitButton = document.getElementById('next-button');
    if (selectedInputs.length > 0 && selectedOutputs.length > 0) {
        submitButton.classList.remove('disabled');
    } else {
        submitButton.classList.add('disabled');
    }
}


/* Placeholder function for submitting the selection */
function submitSelection() {
    if (selectedInputs.length > 0 && selectedOutputs.length > 0) {
        const inputTexts = selectedInputs.map(item => item.textContent);
        const outputTexts = selectedOutputs.map(item => item.textContent);
        
        // Store the selected inputs and outputs in session storage
        sessionStorage.setItem('selectedInputs', JSON.stringify(inputTexts));
        sessionStorage.setItem('selectedOutputs', JSON.stringify(outputTexts));
    } else {
        alert("Please select at least one input and one output.");
    }
}

document.getElementById('next-button').addEventListener('click', function () {
    submitSelection();
    loadPage('result', 'input_output');
});