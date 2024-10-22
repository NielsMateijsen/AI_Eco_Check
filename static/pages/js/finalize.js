document.getElementById('back-button').addEventListener('click', function () {
  loadLastPage();
});


function loadContent() {
  const model = globalModel;
  const model_name = model.name;
  const model_id = model.id;

  const modelHeader = document.getElementById('model-header');
  modelHeader.innerHTML = model_name;

  const url = `/get_model_details?model_id=${model_id}&model_name=${model_name}`; 

  fetch(url)
    .then(response => response.json())
    .then(model => {
      const task = document.getElementById('task');
      task.innerHTML = model.sub_task;

      const tip_url = `/get_tips/${(sanitize(model.task))}`;
      fetch(tip_url)
        .then(response => response.json())
        .then(tips => {
          loadTips(tips);
        })
    })

    document.getElementById('print-button').addEventListener('click', function () {
      alert("Bedankt voor het testen van de demo! De print functionaliteit is op dit moment nog niet beschikbaar.");
    });

  
}

function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

function loadTips(tips) {
  const tipsSection = document.getElementById('tips-section');
  for (let i = 0; i < tips.length; i++) {
    const tip = tips[i];
    const tipBox = document.createElement('div');
    tipBox.className = 'tip-box';

    const tipHeader = document.createElement('h2');
    tipHeader.innerHTML = tip.title;

    const tipDescription = document.createElement('p');
    tipDescription.className = 'description';
    tipDescription.innerHTML = tip.description;

    const moreLink = document.createElement('a');
    moreLink.className = 'more-link';
    moreLink.innerHTML = 'Meer';
    moreLink.onclick = toggleText;

    tipBox.appendChild(tipHeader);
    tipBox.appendChild(tipDescription);
    tipBox.appendChild(moreLink);

    tipsSection.appendChild(tipBox);
  }
}

function toggleText() {
  const tipsSection = document.getElementById('tips-section');
  // get all p elements in the tips section
  const tips = tipsSection.getElementsByTagName('p');
  // for each p element, toggle the class 'expanded'
  for (let i = 0; i < tips.length; i++) {
    tips[i].classList.toggle('expanded');
  }
  
  const links = document.getElementsByClassName('more-link');
  for (let i = 0; i < links.length; i++) {
    if (links[i].innerText === "Meer") {
      links[i].innerText = "Minder";
  } else {
      links[i].innerText = "Meer";
    }
  }
}


loadContent();