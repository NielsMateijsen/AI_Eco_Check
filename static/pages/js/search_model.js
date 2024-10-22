updateProgressBar('search');

document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

var selectedModel = null;

async function searchModels() {
  const input = document.getElementById('search-bar').value;
  const dropdown = document.getElementById('dropdown');

  if (input.length < 3) {
      dropdown.style.display = 'none';
      return;
  }

  const response = await fetch(`/search_models/${encodeURIComponent(input)}`);
  const data = await response.json();

  // Clear previous dropdown items
  dropdown.innerHTML = '';

  if (data.length > 0) {
      data.forEach(model => {
          const item = document.createElement('div');
          item.classList.add('dropdown-item');

          // Creating and styling the inner content
          const name = document.createElement('div');
          name.classList.add('model-name');
          name.textContent = model["name"];

          const group = document.createElement('div');
          group.classList.add('model-group');
          group.textContent = `Gemaakt door: ${model["group"]}`;
          if (model["source"] === 'Intern') {
            group.innerHTML += '<img src="static/images/RO_kroon.svg" alt="RO" id="RO" class="RO">';
          }
       
          const taskWrapper = document.createElement('div');
          taskWrapper.classList.add('model-task');

          if (model["task"] !== "") {
            const task = document.createElement('div');
            task.classList.add('model-task-item');
            task.textContent = `${model["task"]}`;

            const subTask = document.createElement('div');
            subTask.classList.add('model-task-item');
            subTask.textContent = `${model["sub_task"]}`;

            // Append task and subtask to taskWrapper
            taskWrapper.appendChild(task);
            taskWrapper.appendChild(subTask);
          }

          if (model["emissions_available"]) {
            const emissions = document.createElement('div');
            emissions.classList.add('model-task-item');
            emissions.textContent = `Emissies beschikbaar`;
            
            const leaf = document.createElement('i');
            leaf.classList.add('fa', 'fa-leaf');
            leaf.style.color = 'green';
            emissions.appendChild(leaf);

            // Append emissions to taskWrapper
            taskWrapper.appendChild(emissions);
          }

          // Append all elements to dropdown item
          item.appendChild(name);
          item.appendChild(group);
          item.appendChild(taskWrapper);

          // Handle model selection
          item.onclick = () => selectModel(model);

          // Append item to dropdown
          dropdown.appendChild(item);
      });
      dropdown.style.display = 'block';
  } else {
      dropdown.style.display = 'none';
  }
}

function selectModel(model) {
  selectedModel = model;
  document.getElementById('search-bar').value = model.name;

  // Display the model details
  const modelDetails = document.getElementById('model-details');
  modelDetails.innerHTML = `
    <h2>${model.name}</h2>
    <p><strong>Gemaakt door:</strong> ${model.group}</p>
    <p><strong>Categorie:</strong> ${model.task}</p>
    <p><strong>Taak:</strong> ${model.sub_task}</p>
    <p><strong>Emissies:</strong> ${model.emissions_available ? "Beschikbaar" : "Niet beschikbaar"}</p>
  `;
  modelDetails.style.display = 'block';

  // Show the confirm button
  const confirmButton = document.getElementById('confirm-button');
  confirmButton.style.display = 'block';

  // Hide dropdown
  document.getElementById('dropdown').style.display = 'none';
}

function confirmModel() {
  if (!selectedModel) {
    alert('Selecteer een model');
    return;
  }

  model = {
    id: selectedModel.id,
    name: selectedModel.name,
  }

  globalModel = model;
  loadPage('model_details', 'search_model');
}