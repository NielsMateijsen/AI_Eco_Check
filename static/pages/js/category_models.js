updateProgressBar('search');

var category = sessionStorage.getItem('category');
var prev_page = 'goal';
var selected_row = null;

// Handle Back Button
document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});

// Function to load and populate the table
function loadTable() {
  const page_title = document.getElementById('page-title');
  page_title.textContent = category;

  // API call to fetch models for the given category (sub_task)
  fetch(`get_models_by_category/${category}`)
    .then(response => response.json())
    .then(models => {
      // Get the table body where we will append rows
      const tableBody = document.querySelector("#model-table tbody");
      tableBody.innerHTML = ''; // Clear any existing rows

      // Loop through the models data and populate the table
      models.forEach(model => {
        const row = document.createElement('tr');

        row.addEventListener('click', function () {
          if (selected_row) {
            selected_row.classList.remove('selected');
          }
          selected_row = row;
          selected_row.classList.add('selected');

          const button = document.getElementById('next-button');
          button.classList.remove('not-selected');
        });

        const nameCell = document.createElement('td');
        nameCell.textContent = model.name;
        nameCell.className = 'name';
        nameCell.id = model.id;
        row.appendChild(nameCell);

        const groupCell = document.createElement('td');
        groupCell.textContent = model.group;
        row.appendChild(groupCell);

        const subTaskCell = document.createElement('td');
        subTaskCell.textContent = model.sub_task || 'N/A';
        row.appendChild(subTaskCell);

        const trainingCostsCell = document.createElement('td');

        trainingCostsCell.textContent = getTrainEmissions(model);
        row.appendChild(trainingCostsCell);

        const inferenceCostsCell = document.createElement('td');
        let inference_costs = 0;
        if (model.inference && model.inference.mean) {
          inference_costs = model.inference.mean;
        }
        else {
          inference_costs = 'N/A';
        }

        inferenceCostsCell.textContent = inference_costs;
        // inferenceCostsCell.textContent = 'TODO'; // Placeholder for real data
        row.appendChild(inferenceCostsCell);

        const emissionsCell = document.createElement('td');
        // <i class="fa-solid fa-x"></i>
        if (model.emissions_available) {
          const icon = document.createElement('i');
          icon.className = 'fa fa-check';
          icon.style.color = 'green';
          emissionsCell.appendChild(icon);
        } else {
          const icon = document.createElement('i');
          icon.className = 'fa fa-plus';
          icon.style.transform = 'rotate(45deg)';
          icon.style.color = 'red';
          emissionsCell.appendChild(icon);
        }
        // emissionsCell.textContent = model.emissions_available ? 'Yes' : 'No';
        emissionsCell.style.textAlign = 'center'
        row.appendChild(emissionsCell);

        tableBody.appendChild(row);

        document.getElementById('model-table').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
      });
    })
    .catch(error => {
      console.error('Error fetching model data:', error);
    });
}

// Handle Next Button
document.getElementById('next-button').addEventListener('click', function () {
  const model_name = selected_row.querySelector('.name').textContent;
  const model_id = selected_row.querySelector('.name').id;

  const model = {
    name: model_name,
    id: model_id
  };

  sessionStorage.setItem('model',  JSON.stringify(model));
  prev_page = 'category_models';
  loadPage('model_details');
});

loadTable();
