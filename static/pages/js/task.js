document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

function loadSubTasks() {
  const category = globalCategory;
  const categoryHeader = document.getElementById('category-header');
  categoryHeader.textContent = category;

  const url = '/get_sub_tasks/' + category;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('subtasks');
      data.forEach(subTask => {
        const subTaskDiv = document.createElement('div');
        subTaskDiv.className = 'subtask';
        subTaskDiv.addEventListener('click', () => {
          globalSubTask = subTask.label;
          loadPage('category_models', 'task');
        });

        const infoIcon = document.createElement('i');
        infoIcon.className = 'info-icon fa fa-info-circle';
        infoIcon.addEventListener('click', (event) => {
          event.stopPropagation();
          globalSubTask = subTask.label;
          loadPage('task_details', 'task');
        });

        const subTaskLabel = document.createElement('h4');
        subTaskLabel.textContent = subTask.label;
        subTaskLabel.className = 'label';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.innerHTML = subTask.icon;

        const summary = document.createElement('p');
        summary.className = 'summary';
        summary.textContent = subTask.summary;
        
        
        subTaskDiv.appendChild(subTaskLabel);
        subTaskDiv.appendChild(iconDiv);
        subTaskDiv.appendChild(summary);
        subTaskDiv.appendChild(infoIcon);

        container.appendChild(subTaskDiv);
      });
  }); 
}
      


loadSubTasks();