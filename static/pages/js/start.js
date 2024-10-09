var prev_page = 'welcome';
updateProgressBar('start');	

// Handle Back Button
document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});


function addEventListeners() {
  document.getElementById('specific-model').addEventListener('click', function () {
    loadPage('search_model');
  });

  document.getElementById('goal').addEventListener('click', function () {
    loadPage('goal');
  });
}

addEventListeners();