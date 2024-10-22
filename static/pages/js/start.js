updateProgressBar('start');	

// Handle Back Button
document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

function addEventListeners() {
  document.getElementById('specific-model').addEventListener('click', function () {
    loadPage('search_model', 'start');
  });

  document.getElementById('goal').addEventListener('click', function () {
    loadPage('goal', 'start');
  });

  document.getElementById('own-model').addEventListener('click', function () {
    loadPage('add_model', 'start');
  });
}

addEventListeners();