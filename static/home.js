window.onload = function () {
  loadPage('welcome');
}

var currentStep = 'start';

// Push an initial state to the history
history.pushState(null, null, location.href);

// Listen for the 'popstate' event which is triggered on back/forward navigation
window.addEventListener('popstate', function () {
    loadPage(prev_page);

    // You can also prevent the user from going back by pushing another state
    history.pushState(null, null, location.href);
});

function loadPage(page) {
  // Load HTML content
  fetch(`static/pages/${page}.html`)
    .then(response => {
      if (!response.ok) {
        // If the response is not ok (e.g., 404 or 500 status), throw an error
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      document.getElementById('content').innerHTML = html;

      // Load the CSS file for the current page
      document.getElementById('page-stylesheet').setAttribute('href', `static/pages/css/${page}.css`);

      // Remove the previous page's JS script and load new JS
      let oldScript = document.getElementById('page-script');
      if (oldScript) {
        oldScript.remove();
      }

      let newScript = document.createElement('script');
      newScript.src = `static/pages/js/${page}.js`;
      newScript.id = 'page-script';
      document.body.appendChild(newScript);
    })
    .catch(error => {
      // Handle fetch errors
      console.error('Error loading page:', error);
      document.getElementById('content').innerHTML = `
        <div class="error-message">
          <h2>Error loading page</h2>
          <p>${error.message}</p>
        </div>`;
    });
}

function updateProgressBar(step) {
  const currentStepDiv = document.getElementById(currentStep);
  currentStepDiv.classList.remove('active');

  const nextStepDiv = document.getElementById(step);
  nextStepDiv.classList.add('active');

  currentStep = step;
}

function prettyPrintEmissions(emission) {
  // emissions is in grams, display with units from grams to metric tons
  emission = parseFloat(emission);
  if (emission < 1000) {
    return emission.toFixed(4) + ' g';
  } else if (emission < 1000000) {
    return (emission / 1000).toFixed(2) + ' kg';
  } else {
    return (emission / 1000000).toFixed(2) + ' mt';
  }
}

function getTrainEmissions(model) {
  let emissions = 0;
  if (!model.emissions_available) {
    emissions = 'N/A';
  }
  else if (model.emissions_is_dict) {
    emissions = model.emissions.emissions.toFixed(4);
  }
  else {
    emissions = model.emissions.toFixed(4);
  }
  return emissions;
}