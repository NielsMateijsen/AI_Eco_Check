var prev_page = 'start';
updateProgressBar('start');	

function addEventListeners() {
  document.getElementById('specific-model').addEventListener('click', function () {
    loadPage('search_model');
  });

  document.getElementById('goal').addEventListener('click', function () {
    loadPage('goal');
  });
}

addEventListeners();