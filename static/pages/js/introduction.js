prev_page = "welcome"

document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});

function addEventListeners() {
  const cards = document.querySelectorAll('.subtask');
  cards.forEach(card => {
    card.addEventListener('click', function () {
      const sub_task = card.querySelector('.subtask-title').textContent;

      sessionStorage.setItem('sub_task', sub_task);

      loadPage('task_details');
    });
  });
}

addEventListeners();