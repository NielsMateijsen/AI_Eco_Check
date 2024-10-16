updateProgressBar('search');

document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});


var categories = [
  {
    title: "Computer Vision",
    description: "Computer Vision is een veld binnen kunstmatige intelligentie dat machines in staat stelt om visuele informatie uit de wereld te interpreteren en te begrijpen. Dit omvat de analyse van afbeeldingen en video's om taken uit te voeren zoals objectherkenning, beeldclassificatie en scene-interpretatie.",
  },
  {
    title: "Natural Language Processing",
    description: "NLP (Natural Language Processing) houdt zich bezig met het ontwikkelen van algoritmen en modellen die machines in staat stellen om menselijke taal op een zinvolle manier te begrijpen, interpreteren en genereren. Het omvat een breed scala aan taken, zoals tekstclassificatie, sentimentanalyse, machinevertaling en vraag-antwoord systemen. Toepassingen omvatten chatbots, sentimentanalyse en vertaaldiensten. NLP combineert taalkunde en machine learning om grote hoeveelheden natuurlijke taalgegevens te verwerken en te analyseren.",
  },
  {
    title: "Audio",
    description: "Audioprocessing omvat de analyse en manipulatie van geluidssignalen, met toepassingen in spraakherkenning, muziekanalyse en meer.",
  },
  {
    title: "Tabelvormig",
    description: "Tabelvormige AI-modellen verwijzen naar een categorie machine learning-modellen die speciaal zijn ontworpen om te werken met tabelvormige gegevens, die gestructureerde gegevens zijn die zijn georganiseerd in rijen en kolommen. Elke rij vertegenwoordigt een uniek datapunt, terwijl elke kolom overeenkomt met een specifieke eigenschap die het datapunt beschrijft. Tabelvormige datasets kunnen verschillende soorten kenmerken bevatten, zoals categorische en numerieke.",
  },
  {
    title: "Reinforcement Learning",
    description: "Reinforcement Learning richt zich op hoe agenten acties moeten ondernemen in een omgeving om cumulatieve beloningen te maximaliseren.",
  },
  {
    title: "Multimodal",
    description: "Multimodale AI-modellen kunnen informatie verwerken en integreren uit meerdere modaliteiten, zoals tekst, afbeeldingen, audio en video.",
  },
  {
    title: "Overig",
    description: "Dit is de 'Overig'-categorie. Het beslaat de volledige breedte van het raster en bevat diverse inhoud.",
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
      loadPage('task', 'goal');
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
    detailsTitle.classList.add('detail-title');
    detailsTitle.textContent = category.title;

    const detailsDescription = document.createElement('p');
    detailsDescription.classList.add('detail-description');
    detailsDescription.textContent = category.description;

    // Append title and description to the details div
    details.appendChild(detailsTitle);
    details.appendChild(detailsDescription);

    // Append the bar and the details to the container
    container.appendChild(bar);
    container.appendChild(details);
  });

  // // Create the "Other" category that spans the entire width
  // const otherCategory = categories[6];

  // // Create the "Other" category bar
  // const otherBar = document.createElement('div');
  // otherBar.className = 'category-bar category-other';
  // otherBar.onclick = () => loadPage('input_output');

  // // Create the title and icon for "Other"
  // const otherTitle = document.createElement('span');
  // otherTitle.className = 'category-title';
  // otherTitle.textContent = otherCategory.title;

  // // const otherIcon = document.createElement('i');
  // // otherIcon.className = 'info-icon fa fa-info-circle';

  // // // Info icon click handler for "Other"
  // // otherIcon.addEventListener('click', (event) => {
  // //   event.stopPropagation(); // Prevents the bar click event from firing
  // //   toggleDetails(otherBar);
  // // });

  // // Append title and info icon to the "Other" bar
  // otherBar.appendChild(otherTitle);
  // // otherBar.appendChild(otherIcon);

  // // Create the "Other" details div
  // const otherDetails = document.createElement('div');
  // otherDetails.className = 'category-details';

  // // Create the details title and description for "Other"
  // const otherDetailsTitle = document.createElement('h3');
  // otherDetailsTitle.textContent = otherCategory.title;

  // const otherDetailsDescription = document.createElement('p');
  // otherDetailsDescription.textContent = otherCategory.description;

  // // Append title and description to the "Other" details div
  // otherDetails.appendChild(otherDetailsTitle);
  // otherDetails.appendChild(otherDetailsDescription);

  // // Append the "Other" category to the container
  // container.appendChild(otherBar);
  // container.appendChild(otherDetails);
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