document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

function loadContent() {
  sub_task = globalSubTask;
  url = '/get_sub_task_details/' + sub_task;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const description = data['description'] === 'Unknown' ? 'N/A' : data['description'];
      const mean = data['inference']['mean'] === 'Unknown' ? 'N/A' : data['inference']['mean'];
      const std = data['inference']['std'] === 'Unknown' ? 'N/A' : data['inference']['std'];
      
      // Pixel 8 -> battery voltage of 3.89V and 4485mAh capacity -> 0.0174 kWh per charge
      const eq = data['inference']['mean'] === 'Unknown' ? 'N/A' : (data['inference']['mean']/0.0174).toFixed(2);

      const titleWrapper = document.getElementById('title-wrapper');
      const h1 = document.createElement('h1');
      console.log(data['title']);
      h1.textContent = data['title'];
      h1.id = 'title';

      titleWrapper.innerHTML = data['icon'];
      titleWrapper.appendChild(h1);

      document.getElementById('description').textContent = description;
      document.getElementById('mean-value').textContent = mean;
      document.getElementById('std-value').textContent = std;
      document.getElementById('eq-value').textContent = eq

      document.getElementById('button-text').textContent = sub_task + ' Modellen';

      document.getElementById('model-overview-button').addEventListener('click', function () {
        globalSubTask = sub_task;
        loadPage('category_models', 'task_details');
      });
    });
}

loadContent();