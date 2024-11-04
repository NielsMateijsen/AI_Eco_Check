updateProgressBar('details');

document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});

document.getElementById('next-button').addEventListener('click', function () {
  loadPage('finalize', 'model_details');
});

function loadDetails() {
  const model = globalModel
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
        
        if (key !== 'pipeline_tag' && key !== 'arxiv' && key !== 'source') {
          return;
        }
        const tags = model.tags[key];
        tags.forEach(tag => {
          const tagElement = document.createElement("span");
          if (key === 'arxiv') {
            tagElement.innerHTML = '<i class="fa fa-book"></i> ';
            tagElement.classList.add("arxiv");
          } else if (key === 'source' && tag === "Intern") {
            tagElement.innerHTML = '<img src="static/images/RO_kroon.svg" alt="RO" id="RO" class="RO-tag-icon"> ';
            tagElement.classList.add("inhouse");
          } else if (key === 'source' && tag === "HuggingFace") {
            tagElement.innerHTML = '<img src="static/images/hf-logo.svg" alt="HuggingFace" class="huggingface-img"> ';
            tagElement.classList.add("huggingface");
            tagElement.addEventListener('click', function () {
              const link = `https://huggingface.co/${model.group}/${model.name}`;
              window.open(link, '_blank');
            });
          }
          else {
            tagElement.innerHTML = '';
          }
          
          tagElement.classList.add("tag");
          tagElement.innerHTML += tag;
          if (key === 'arxiv') {
            tagElement.innerHTML += " <i class='fa fa-external-link'></i>";
            tagElement.addEventListener('click', function () {
              const link = `https://arxiv.org/abs/${tag.split(':')[1]}`;
              window.open(link, '_blank');
            });
          }
          else if (key === 'source' && tag === "HuggingFace") {
            tagElement.innerHTML += " <i class='fa fa-external-link'></i>";
          }
          tagsContainer.appendChild(tagElement);
        });
      });

      const descriptionDiv = document.getElementById('model-description');
      const description = document.createElement('p');
      description.innerHTML = model.description || '';
      descriptionDiv.appendChild(description);

      if (model.tags.license && model.tags.license.length > 0) {
        const license = document.createElement('p');
        license.innerHTML = `<b>Licentie:</b> ${model.tags.license[0]}` ;
        descriptionDiv.appendChild(license);
      }

      if (model.tags.dataset && model.tags.dataset.length > 0) {
        const dataset = document.createElement('p');
        dataset.innerHTML = `<b>Dataset:</b> ${model.tags.dataset[0]}` ;
        descriptionDiv.appendChild(dataset);
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

function loadEmissions(model) {
  const emission_section = document.getElementById('mileukosten-section');
  const not_available_div = document.createElement('div');
  not_available_div.classList.add('not-available');
  not_available_div.style.textAlign = 'center';

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
  
  const equivalent = document.createElement('p');
  const training_emissions = getTrainEmissions(model);
  console.log(training_emissions);
  if (isNaN(training_emissions)) {
    equivalent.innerHTML += ` N/A L benzine`;
    equivalent_icon.classList.add('fa-regular', 'fa-circle-question');
  } else {
    if (training_emissions > 1_000_000 ) { // bigger than 1 ton
      // https://www.milieucentraal.nl/klimaat-en-aarde/klimaatverandering/wat-is-je-co2-voetafdruk/
      // Gemiddeld huishouden van 2,2 personen: gemiddeld 18500 kg CO2 per jaar
      equivalent.innerHTML += ` ${(training_emissions/18_500_000).toFixed(3)} huishoudens/jaar`;
      equivalent_icon.classList.add('fa-solid', 'fa-house-chimney');
    } else if (training_emissions > 25_000) {
      // https://ecotree.green/en/how-much-co2-does-a-tree-absorb#:~:text=A%20tree%20absorbs%20approximately%2025kg%20of%20CO2%20per%20year&text=It's%20based%20on%20the%20estimate,a%20whole%20host%20of%20factors.
      // Een boom absorbeert ongeveer 25 kg CO2 per jaar
      equivalent.innerHTML += ` ${(training_emissions/25_000).toFixed(3)} bomen/jaar`;
      equivalent_icon.classList.add('fa-solid', 'fa-tree');
    } else if (training_emissions > 2821) {
      // Benzine E10: 2821 g CO2eq per liter
      // https://www.co2emissiefactoren.nl/lijst-emissiefactoren/
      equivalent_icon.classList.add('fa-solid', 'fa-fw', 'fa-gas-pump');
      equivalent.innerHTML += ` ${(training_emissions/2821).toFixed(3)}L benzine`;
    } else {
      // 204g CO2eq per km voor middelklass benzine auto (Well-to-Wheel)
      // https://www.co2emissiefactoren.nl/lijst-emissiefactoren/ 
      equivalent.innerHTML += ` ${(training_emissions/204).toFixed(3)} km rijden`;
      equivalent_icon.classList.add('fa-solid', 'fa-car');
    }
  }
  equivalent_div.appendChild(equivalent_icon);

  equivalent_div.appendChild(equivalent);
  emission_section.appendChild(equivalent_div);

  // Inference costs
  const inference_div = document.createElement('div');
  inference_div.classList.add('inference-costs', 'info-section');

  const inference_header = document.createElement('p');
  inference_header.innerHTML = 'Inferentiekosten (x1000 prompts):';
  emission_section.appendChild(inference_header);

  const inference_icon = document.createElement('i');
  inference_icon.classList.add('fa', 'fa-comments');
  inference_div.appendChild(inference_icon);

  const inference_costs = document.createElement('p');
  let inference_value = 0;
  if (model.inference && model.inference.mean) {
    inference_value = model.inference.mean;
  } else if (model.inference) {
    inference_value = model.inference;
  }
  else {
    inference_value = 'N/A';
  }
  const inference_value_display = inference_value == "Unknown"  || inference_value == null ? "N/A" : inference_value;
  inference_costs.innerHTML += ` ${inference_value_display} kWh`;

  if (model.inference_source === "Estimate") {
    inference_costs.innerHTML += `<div class='tooltip'><i class='fa fa-info-circle'></i>
    <span class='tooltiptext'>De werkelijke inferencekosten zijn niet beschikbaar. De huidige waarde is een schatting door: '<a href="https://arxiv.org/abs/2311.16863v2" target="_blank">Power Hungry Processing: Watts Driving the Cost of AI Deployment?</a>'</span>
    </div>`;
  }

  inference_div.appendChild(inference_costs);
  emission_section.appendChild(inference_div);
}

function loadReliability(model) {
  const reliability_section = document.getElementById('bron-section');

  if (model.source === 'HuggingFace' && model.emissions_available) {
    const reliability_div = document.createElement('div');
    reliability_div.classList.add('reliability', 'info-section');

    const reliability_icon = document.createElement('i');
    reliability_icon.classList.add('fa-solid', 'fa-circle-info');
    reliability_div.appendChild(reliability_icon);

    const reliability = document.createElement('p');

    reliability.innerHTML = 'Via HuggingFace:<br>';

    let sourceValue;
    if (!model.emissions.source) {
      sourceValue = 'Onbekende bron voor emissiegegevens';
    }
    else {
      sourceValue = model.emissions.source;
    }

    reliability.innerHTML += `<span>${sourceValue}</span>`;

    reliability_div.appendChild(reliability);
    reliability_section.appendChild(reliability_div);
  }
  else if (model.source === 'Intern' && model.emissions_available) {
    const reliability_div = document.createElement('div');
    reliability_div.classList.add('reliability', 'info-section');

    const reliability_icon = document.createElement('i');
    reliability_icon.classList.add('fa-solid', 'fa-circle-info');
    reliability_div.appendChild(reliability_icon);

    const reliability = document.createElement('p');

    reliability.innerHTML = 'In-house model:<br>';
    reliability.innerHTML += `<span>Emissies zijn intern gerapporteerd.</span>`;
    
    reliability_div.appendChild(reliability);
    reliability_section.appendChild(reliability_div);
  }
  else if (model.inference_source === 'Estimate') {
    const reliability_div = document.createElement('div');
    reliability_div.classList.add('reliability', 'info-section');

    const reliability_icon = document.createElement('i');
    reliability_icon.classList.add('fa-solid', 'fa-circle-info');
    reliability_div.appendChild(reliability_icon);

    const reliability = document.createElement('p');

    reliability.innerHTML = 'Onbekende bron:<br>';
    reliability.innerHTML += `<span>De werkelijke inferencekosten zijn niet beschikbaar. De huidige waarde is een schatting door: '<a href="https://arxiv.org/abs/2311.16863v2" target="_blank">Power Hungry Processing: Watts Driving the Cost of AI Deployment?</a>'</span>`;
    
    reliability_div.appendChild(reliability);
    reliability_section.appendChild(reliability_div);
  
  }
  else {
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
  }
}

function loadTable(model) {
  const task = model.sub_task;
  const url = `/get_models_by_task/${task}?creator=all&emissions=all`;
  
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


        if (similar_model.source === 'Intern') {
          const groupDiv = document.createElement('div');
          groupDiv.className = 'RO_group';
          groupDiv.textContent = similar_model.group;
          groupDiv.innerHTML += '<img src="static/images/RO_kroon.svg" alt="RO" id="RO" class="RO">' 
          group.appendChild(groupDiv);
        }
        else {
          group.textContent = similar_model.group;
        }

        training_costs.innerHTML = getTrainEmissions(similar_model);


        let inference = 0;
        if (model.inference && model.inference.mean) {
          inference = model.inference.mean;
        }
        else if (model.inference) {
          inference = model.inference;
        }
        else {
          inference = 'N/A';
        }
        inference_costs.innerHTML = inference
      });
    });

}

loadDetails();