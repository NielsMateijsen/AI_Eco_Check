updateProgressBar('details');

document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

document.getElementById('next-button').addEventListener('click', function () {
  loadPage('finalize', 'model_details');
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
          task_summary: 'N/A',
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
        
        if (key !== 'pipeline_tag' && key !== 'arxiv') {
          return;
        }
        const tags = model.tags[key];
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
      const task_summary = document.createElement('p');
      task_summary.innerHTML = model.task_summary || '';
      description.appendChild(task_summary);

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
      loadReliability(model);

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
//   "emissions": api.get_model_emissions(selected_model["id"]) if "co2_eq_emissions" in selected_model["tags"] else None,
// }

function loadEmissions(model) {
  const emission_section = document.getElementById('mileukosten-section');
  const not_available_div = document.createElement('div');
  not_available_div.classList.add('not-available');
  not_available_div.style.textAlign = 'center';

  // if (!model.emissions_available) {
  //   const not_available = document.createElement('p');
  //   not_available.textContent = 'Geen emissiegegevens beschikbaar';
  //   not_available.classList.add('not-available-text');

  //   not_available_div.appendChild(not_available);
    
  //   const cross = document.createElement('i');
  //   cross.classList.add('fa', 'fa-times', 'cross');
  //   not_available_div.appendChild(cross);

  //   emission_section.appendChild(not_available_div);
  //   return;
  // }

  // Training costs
  const training_div = document.createElement('div');
  training_div.classList.add('training-costs', 'info-section');

  const training_header = document.createElement('p');
  training_header.textContent = 'Trainingskosten:';
  emission_section.appendChild(training_header);

  const training_icon = document.createElement('i');
  training_icon.classList.add('fa', 'fa-server');
  training_div.appendChild(training_icon);

  const training_costs = document.createElement('p');
  training_costs.innerHTML += ` ${prettyPrintEmissions(getTrainEmissions(model))} CO2eq`;

  training_div.appendChild(training_costs);
  emission_section.appendChild(training_div);

  // Equivalent to
  const equivalent_div = document.createElement('div');
  equivalent_div.classList.add('equivalent-to', 'info-section');

  const equivalent_header = document.createElement('p');
  equivalent_header.textContent = 'Equivalent aan:';
  emission_section.appendChild(equivalent_header);

  const equivalent_icon = document.createElement('i');
  equivalent_icon.classList.add('fa-solid', 'fa-fw', 'fa-gas-pump');
  equivalent_div.appendChild(equivalent_icon);
  
  // Benzine E10: 2.821 kg CO2eq per liter
  // https://www.co2emissiefactoren.nl/lijst-emissiefactoren/
  const equivalent = document.createElement('p');
  equivalent.innerHTML += ` ${(getTrainEmissions(model)/2821).toFixed(3)}L benzine`;

  equivalent_div.appendChild(equivalent);
  emission_section.appendChild(equivalent_div);

  // Inference costs
  const inference_div = document.createElement('div');
  inference_div.classList.add('inference-costs', 'info-section');

  const inference_header = document.createElement('p');
  inference_header.textContent = 'Inferentiekosten (x1000 prompts):';
  emission_section.appendChild(inference_header);

  const inference_icon = document.createElement('i');
  inference_icon.classList.add('fa', 'fa-comments');
  inference_div.appendChild(inference_icon);

  const inference_costs = document.createElement('p');
  const inference_value = model.inference.mean == "Unknown" ? "N/A" : model.inference.mean;
  inference_costs.innerHTML += ` ${inference_value} kWh`;

  inference_div.appendChild(inference_costs);
  emission_section.appendChild(inference_div);
}

function loadReliability(model) {
  const reliability_section = document.getElementById('bron-section');
  if (!model.emissions_available || !model.emissions.source) {
    // no emissions available
    const na_reliability = document.createElement('div');
    const reliability = document.createElement('p');
    na_reliability.classList.add('not-available');
    na_reliability.style.textAlign = 'center';
    reliability.textContent = 'Geen emissie brongegevens beschikbaar';
    reliability.classList.add('not-available-text');
    na_reliability.appendChild(reliability);

    const cross = document.createElement('i');
    cross.classList.add('fa', 'fa-times', 'cross');
    na_reliability.appendChild(cross);

    reliability_section.appendChild(na_reliability);
    return;
  }

  const reliability_div = document.createElement('div');
  reliability_div.classList.add('reliability', 'info-section');

  const reliability_icon = document.createElement('i');
  reliability_icon.classList.add('fa-solid', 'fa-circle-info');
  reliability_div.appendChild(reliability_icon);

  const reliability = document.createElement('p');
  reliability.innerHTML = `${model.emissions.source}`;

  reliability_div.appendChild(reliability);
  reliability_section.appendChild(reliability_div);


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
        const group = row.insertCell(1);
        const training_costs = row.insertCell(2);
        const inference_costs = row.insertCell(3);
        // const stats = row.insertCell(4);

        model_name.innerHTML = similar_model.name;
        group.innerHTML = similar_model.group;

        training_costs.innerHTML = getTrainEmissions(similar_model);


        let inference = 0;
        if (model.inference && model.inference.mean) {
          inference = model.inference.mean;
        }
        else {
          inference = 'N/A';
        }
        inference_costs.innerHTML = inference
        // stats.innerHTML = similar_model.stats || 'N/A';

        row.addEventListener('click', function () {
          // sessionStorage.setItem('model', JSON.stringify(model));
          // loadPage('details');
        });
      });
    });

}

loadDetails();