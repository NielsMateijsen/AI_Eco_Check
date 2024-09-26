var prev_page = 'start';

function addEventListeners() {
  document.getElementById('specific-model').addEventListener('click', function () {
    loadPage('specific_model');
  });

  document.getElementById('goal').addEventListener('click', function () {
    loadPage('goal');
  });
}

addEventListeners();