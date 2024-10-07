var category = sessionStorage.getItem('category');
var prev_page = 'goal';
var rowsPerPage = 7; // Number of rows to display per page
var currentPage = 1;
var models = []; // Data will be stored here

// Handle Back Button
document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});

// Function to load and populate the table with pagination
function loadTable() {
  const page_title = document.getElementById('page-title');
  page_title.textContent = category;

  // API call to fetch models for the given category (sub_task)
  fetch(`get_models/${category}`)
    .then(response => response.json())
    .then(data => {
      models = data;
      displayTable(currentPage);
      setupPagination();
    })
    .catch(error => {
      console.error('Error fetching model data:', error);
    });
}

// Function to display table rows based on the current page
function displayTable(page) {
  const tableBody = document.querySelector("#model-table tbody");
  tableBody.innerHTML = ''; // Clear existing rows

  // Determine the slice of data to display
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = models.slice(start, end);

  // Loop through the models data and populate the table
  pageData.forEach(model => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = model.name;
    row.appendChild(nameCell);

    const groupCell = document.createElement('td');
    groupCell.textContent = model.group;
    row.appendChild(groupCell);

    const subTaskCell = document.createElement('td');
    subTaskCell.textContent = model.sub_task || 'N/A';
    row.appendChild(subTaskCell);

    const trainingCostsCell = document.createElement('td');
    trainingCostsCell.textContent = '$' + (Math.random() * 10000).toFixed(2); // Placeholder for real data
    row.appendChild(trainingCostsCell);

    const inferenceCostsCell = document.createElement('td');
    inferenceCostsCell.textContent = '$' + (Math.random() * 1000).toFixed(2); // Placeholder for real data
    row.appendChild(inferenceCostsCell);

    const emissionsCell = document.createElement('td');
    emissionsCell.textContent = model.emissions_available ? 'Yes' : 'No';
    row.appendChild(emissionsCell);

    tableBody.appendChild(row);
  });
}

// Function to set up pagination controls with ellipses
function setupPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = ''; // Clear existing pagination buttons

  const totalPages = Math.ceil(models.length / rowsPerPage);
  const maxButtons = 13;

  // Function to create a pagination button
  const createButton = (page, text, isActive = false) => {
    const button = document.createElement('button');
    button.textContent = text;
    if (isActive) {
      button.classList.add('active');
    }
    button.addEventListener('click', function () {
      currentPage = page;
      displayTable(currentPage);
      setupPagination(); // Re-render pagination to update the active page
    });
    paginationContainer.appendChild(button);
  };

  if (totalPages <= maxButtons) {
    // Display all buttons if total pages are less than or equal to the max
    for (let i = 1; i <= totalPages; i++) {
      createButton(i, i, i === currentPage);
    }
  } else {
    // Logic for limiting to maxButtons and adding ellipses
    let startPage, endPage;

    if (currentPage <= 7) {
      startPage = 1;
      endPage = maxButtons - 2;
    } else if (currentPage + 5 >= totalPages) {
      startPage = totalPages - (maxButtons - 3);
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 3;
    }

    // Ellipses before start if needed
    if (startPage > 2) {
      createButton(1, 1, currentPage === 1);
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }

    // Pages between start and end
    for (let i = startPage; i <= endPage; i++) {
      createButton(i, i, i === currentPage);
    }

    // Ellipses after end if needed
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    }

    // Last Page
    createButton(totalPages, totalPages, currentPage === totalPages);
  }
}

loadTable();
