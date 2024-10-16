prev_page = "introduction";

document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});

function loadContent() {
  sub_task = sessionStorage.getItem('sub_task');
  url = '/get_sub_task_details/' + sub_task;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById('title').textContent = data['title'];
      document.getElementById('description').textContent = data['description'];
      document.getElementById('mean-value').textContent = data['inference']['mean'];
      document.getElementById('std-value').textContent = data['inference']['std'];
      document.getElementById('eq-value').textContent = data['inference']['eq'];
    });
}

loadContent();