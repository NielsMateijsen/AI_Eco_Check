prev_page = 'start';
updateProgressBar('search');

document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});


// Placeholder data source
var categories = [
  {
    title: "Computer Vision",
    description: "This is the description for Category 1. Add your placeholder data here.",
  },
  {
    title: "Natural Language Processing",
    description: "This is the description for Category 2. Add your placeholder data here.",
  },
  {
    title: "Audio",
    description: "This is the description for Category 3. Add your placeholder data here.",
  },
  {
    title: "Tabelvormig",
    description: "This is the description for Category 4. Add your placeholder data here.",
  },
  {
    title: "Reinforcement Learning",
    description: "This is the description for Category 5. Add your placeholder data here.",
  },
  {
    title: "Multimodal",
    description: "This is the description for Category 6. Add your placeholder data here.",
  },
  {
    title: "Overig",
    description: "This is the 'Other' category. It spans the entire width of the grid and contains miscellaneous content.",
  },
];


// Function to create the categories dynamically
function loadCategories() {
  const container = document.getElementById('category-container');

  // Create category bars for the first 6 categories
  categories.slice(0, 6).forEach(category => {
    // Create the category bar
    const bar = document.createElement('div');
    bar.className = 'category-bar';
    bar.onclick = () => {
      sessionStorage.setItem('category', category.title);
      loadPage('category_models')
    };

    // Create the category title span
    const title = document.createElement('span');
    title.className = 'category-title';
    title.textContent = category.title;

    // Create the info icon span
    const infoIcon = document.createElement('i');
    infoIcon.className = 'info-icon fa fa-info-circle';
    
    // Info icon click handler
    infoIcon.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevents the bar click event from firing
      toggleDetails(bar);
    });

    // Append title and info icon to the bar
    bar.appendChild(title);
    bar.appendChild(infoIcon);

    // Create the category details div
    const details = document.createElement('div');
    details.className = 'category-details';

    // Create the details title and description
    const detailsTitle = document.createElement('h3');
    detailsTitle.textContent = category.title;

    const detailsDescription = document.createElement('p');
    detailsDescription.textContent = category.description;

    // Append title and description to the details div
    details.appendChild(detailsTitle);
    details.appendChild(detailsDescription);

    // Append the bar and the details to the container
    container.appendChild(bar);
    container.appendChild(details);
  });

  // Create the "Other" category that spans the entire width
  const otherCategory = categories[6];

  // Create the "Other" category bar
  const otherBar = document.createElement('div');
  otherBar.className = 'category-bar category-other';
  otherBar.onclick = () => loadPage('input_output');

  // Create the title and icon for "Other"
  const otherTitle = document.createElement('span');
  otherTitle.className = 'category-title';
  otherTitle.textContent = otherCategory.title;

  const otherIcon = document.createElement('i');
  otherIcon.className = 'info-icon fa fa-info-circle';

  // Info icon click handler for "Other"
  otherIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevents the bar click event from firing
    toggleDetails(otherBar);
  });

  // Append title and info icon to the "Other" bar
  otherBar.appendChild(otherTitle);
  otherBar.appendChild(otherIcon);

  // Create the "Other" details div
  const otherDetails = document.createElement('div');
  otherDetails.className = 'category-details';

  // Create the details title and description for "Other"
  const otherDetailsTitle = document.createElement('h3');
  otherDetailsTitle.textContent = otherCategory.title;

  const otherDetailsDescription = document.createElement('p');
  otherDetailsDescription.textContent = otherCategory.description;

  // Append title and description to the "Other" details div
  otherDetails.appendChild(otherDetailsTitle);
  otherDetails.appendChild(otherDetailsDescription);

  // Append the "Other" category to the container
  container.appendChild(otherBar);
  container.appendChild(otherDetails);
}

// Function to toggle the visibility of category details
function toggleDetails(bar) {
  const details = bar.nextElementSibling;
  const allDetails = document.querySelectorAll('.category-details');

  // Hide all other detail sections
  // allDetails.forEach(detail => {
  //   if (detail !== details) {
  //     detail.style.display = 'none';
  //     detail.previousElementSibling.classList.remove('active');
  //   }
  // });

  // Toggle the clicked detail section
  if (details.style.display === 'block') {
    details.style.display = 'none';
    bar.classList.remove('active');
  } else {
    details.style.display = 'block';
    bar.classList.add('active');
  }
}



loadCategories();