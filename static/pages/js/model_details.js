updateProgressBar('details');

document.getElementById('back-button').addEventListener('click', function () {
  loadPage(prev_page);
});

function loadDetails() {
  const model = JSON.parse(sessionStorage.getItem('model'));
  const model_name = model.name;
  const model_id = model.id;
  const url = `/get_model_details?model_id=${model_id}&model_name=${model_name}`;

  fetch(url)
    .then(response => response.json())
    .then(model => {
      if (model.error) {
        model = {
          name: 'Model niet gevonden',
          group: 'N/A',
          tags: [],
          task: 'N/A',
          sub_task: 'N/A',
          description: 'N/A',
          emissions_available: false,
          training_costs: 0,
          inference_costs: 0
        }
      }
      
      const modelTitle = document.getElementById('model-title');
      modelTitle.textContent = "Model: " + model.group + "/" + model.name;


      // Get the tags container
      const tagsContainer = document.querySelector(".tags");

      // Add each tag as a span
      Object.keys(model.tags).forEach(key => {
        console.log(key);
        
        if (key !== 'pipeline_tag' && key !== 'arxiv') {
          return;
        }
        const tags = model.tags[key];
        console.log(tags);
        tags.forEach(tag => {
          const tagElement = document.createElement("span");
          tagElement.innerHTML = key === 'arxiv'? '<i class="fa fa-book"></i> ' : '';
          tagElement.classList.add("tag");
          tagElement.innerHTML += tag;
          if (key === 'arxiv') {
            tagElement.classList.add("arxiv");
            tagElement.innerHTML += " <i class='fa fa-external-link'></i>";
            tagElement.addEventListener('click', function () {
              const link = `https://arxiv.org/abs/${tag.split(':')[1]}`;
              window.open(link, '_blank');
            });
          }
          tagsContainer.appendChild(tagElement);
        });
      });

      const description = document.getElementById('model-description');

      // library, languages, license, dataset
      // if (model.tags.library.length > 0) {
      //   const library = document.createElement('p');
      //   library.innerHTML = `<b>Libraries:</b> ${model.tags.library.join(', ') }`;
      //   description.appendChild(library);
      // }

      // if (model.tags.language.length > 0) {
      //   const languages = document.createElement('p');
      //   languages.innerHTML = `<b>Talen:</b> ${model.tags.language.join(', ')}` ;
      //   description.appendChild(languages);
      // }

      if (model.tags.license.length > 0) {
        const license = document.createElement('p');
        license.innerHTML = `<b>Licentie:</b> ${model.tags.license[0]}` ;
        description.appendChild(license);
      }

      if (model.tags.dataset.length > 0) {
        const dataset = document.createElement('p');
        dataset.innerHTML = `<b>Dataset:</b> ${model.tags.dataset[0]}` ;
        description.appendChild(dataset);
      }

      loadTable(model);
      loadEmissions(model);

      // Show page
      const spinner = document.getElementById('loading');
      spinner.classList.add('hidden');

      const modelDetails = document.getElementById('model-details');
      modelDetails.classList.remove('hidden');
    });
}

// result = {
//   "name": selected_model["id"].split("/")[1],
//   "group": selected_model["id"].split("/")[0],
//   "sub_task": get_sub_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
//   "task": get_task_name(selected_model["pipeline_tag"]) if pipeline_tag_exists else "N/A",
//   "emissions_available": "co2_eq_emissions" in selected_model["tags"],
//   "tags": parse_tags(selected_model["tags"]),
//   "all_data": selected_model
// }

function loadEmissions(model) {
  const emission_section = document.getElementById('mileukosten-section');
  const not_available_div = document.createElement('div');
  not_available_div.classList.add('not-available');
  not_available_div.style.textAlign = 'center';

  if (!model.emissions_available) {
    const not_available = document.createElement('p');
    not_available.textContent = 'Geen emissiegegevens beschikbaar';
    not_available.classList.add('not-available-text');

    not_available_div.appendChild(not_available);
    
    const cross = document.createElement('i');
    cross.classList.add('fa', 'fa-times', 'cross');
    not_available_div.appendChild(cross);

    emission_section.appendChild(not_available_div);
    return;
  }
}

function loadTable(model) {
  const task = model.sub_task;
  const url = `/get_models_by_task/${task}`;
  
  fetch(url)
    .then(response => response.json())
    .then(similar_models => {
      const table = document.getElementById('similar-models-table');
      const tableBody = table.getElementsByTagName('tbody')[0];
      similar_models.forEach(similar_model => {
        if(similar_model.id === model.id) {
          return;
        }
        const row = tableBody.insertRow();
        const model_name = row.insertCell(0);
        const training_costs = row.insertCell(1);
        const inference_costs = row.insertCell(2);
        const stats = row.insertCell(3);

        model_name.innerHTML = similar_model.name;
        training_costs.innerHTML = similar_model.training_costs || 'N/A';
        inference_costs.innerHTML = similar_model.inference_costs || 'N/A';
        stats.innerHTML = similar_model.stats || 'N/A';

        row.addEventListener('click', function () {
          // sessionStorage.setItem('model', JSON.stringify(model));
          // loadPage('details');
        });
      });
    });

}

loadDetails();