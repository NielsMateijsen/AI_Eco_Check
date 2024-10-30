// Chapter Data


var currentChapter = 0;
var numChapters;

// Function to update chapter navigation and content
function updateChapter() {
  const chapters = [
    { title: "Duurzaamheid", content: `<div id="sub-page-content" class="sub-page-content" style="padding: 20px 20px 20px 10px; display: flex; flex-direction: column; gap: 20px;">

      <!-- Section 1 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <i class="fa-solid fa-leaf" style="font-size: 35px; flex-shrink: 0; color: #28a745"></i>
        <p style="margin: 0; line-height: 1.5;">
          Door het hoge energieverbruik dragen AI-systemen aanzienlijk bij aan de uitstoot van CO₂. Het trainen van één groot AI-model kan evenveel uitstoot veroorzaken als de levensduur van meerdere auto's. Datacenters, vooral die op fossiele brandstoffen draaien, vergroten deze impact. Ondanks inspanningen om over te stappen op groene energie, blijft de CO₂-voetafdruk van AI zorgwekkend.
        </p>
      </div>
    
      <!-- Section 2 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <i class="fa fa-microchip" style="font-size: 35px; flex-shrink: 0; color: var(--logoblauw)"></i>
        <p style="margin: 0; line-height: 1.5;">
          AI-hardware, zoals GPU's en gespecialiseerde chips, vereist zeldzame aardmaterialen zoals kobalt, lithium en neodymium. Het delven van deze materialen heeft een aanzienlijke impact op het milieu, zoals vervuiling en hoog energieverbruik. Bovendien brengt mijnbouw ethische vraagstukken met zich mee door slechte arbeidsomstandigheden en geopolitieke instabiliteit in de regio's waar deze materialen worden gewonnen. 
        </p>
      </div>
    
      <!-- Section 3 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <i class="fa fa-droplet" style="font-size: 35px; flex-shrink: 0; color: #007FFF"></i>
        <p style="margin: 0; line-height: 1.5;">
          AI-technologieën vereisen aanzienlijke hoeveelheden water voor het koelen van datacenters die de intensieve rekenkracht ondersteunen. Bij het trainen van grote AI-modellen worden miljoenen liters water verbruikt om oververhitting van servers te voorkomen. Daarnaast worden per 15 vragen (in populaire chatmodellen) in nederland zo’n halve liter aan schoon drinkwater gebruikt.  Dit allemaal kan leiden tot ecologische gevolgen, vooral in gebieden waar water schaars is.
        </p>
      </div>
    
      <!-- Section 4 -->
      <div style="display: flex; align-items: center; gap: 15px;">
        <i class="fa fa-bolt" style="font-size: 35px; flex-shrink: 0; color: #FADF63"></i>
        <p style="margin: 0; line-height: 1.5;">
          Kunstmatige intelligentie (AI) is energie-inefficiënt omdat het enorme hoeveelheden rekenkracht en data vereist, vooral tijdens het trainen van modellen zoals machine learning en deep learning. Dit proces, uitgevoerd op energie-intensieve hardware zoals GPU's in datacenters, verbruikt grote hoeveelheden energie en kan aanzienlijke CO2-uitstoot veroorzaken.
        </p>
      </div>
    
    </div>
    ` },
    { title: "Wat is AI?", content: `<div id="sub-page-content" class="sub-page-content" style="padding: 20px;">
      <p>AI (kunstmatige intelligentie) is een technologie waarmee computers taken kunnen uitvoeren die normaal door mensen worden gedaan, zoals leren, problemen oplossen of beslissingen nemen. In plaats van dat de computer precies verteld wordt wat hij moet doen, kan AI zelf informatie gebruiken om te leren en slimmer te worden in wat hij doet. Een voorbeeld hiervan is een AI-model dat een bestaande data set kan sorteren of een AI-model dat gezichten kan herkennen in een reeks foto's.</p> 
      </div>`},
    { title: "AI vs GenAI", content: `<div id="sub-page-content" class="sub-page-content" style="display: flex; flex-direction: row; gap: 20px; padding: 20px;">

  <div class="column" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
    <h2 style="margin-bottom: 10px;">AI</h2>
    <p>AI is de overkoepelende term die verwijst naar systemen of machines die taken kunnen uitvoeren die normaal menselijke intelligentie vereisen. Dit omvat bijvoorbeeld beeldherkenning, spraakherkenning, aanbevelingssystemen, en het voorspellen van trends. AI-systemen zijn vaak gebaseerd op vooraf gedefinieerde regels, machine learning (waarbij systemen leren van data), of deep learning (waarbij het systeem leert door complexe lagen van informatie, net als het menselijk brein). Ze zijn ontworpen om een specifieke taak uit te voeren, zoals het classificeren van afbeeldingen of het analyseren van tekst, maar ze genereren niet per se nieuwe content.</p>
  </div>
  
  <div class="column" style="flex: 1; display: flex; flex-direction: column; align-items: center; ">
    <h2 style="margin-bottom: 10px;">GenAI</h2>
    <p>Generative AI is een type AI dat zich sterker focust op het creerren van nieuwe content, zoals tekst, beelden of muziek. Het is vaak gebaseerd op geavanceerde machine learning-technieken zoals deep learning, waarbij het systeem leert van grote hoeveelheden data om vervolgens iets nieuws te genereren. In plaats van alleen bestaande patronen te herkennen, kan generative AI nieuwe patronen maken, zoals het schrijven van een verhaal, het genereren van een afbeelding, of het componeren van muziek.</p>
  </div>
  
</div>`
 },
    { title: "Categorieën", content:
      `<div id="sub-page-content" class="sub-page-content">

  <p style="text-align: left; font-size: 16px; margin-bottom: 20px;">
    De categorieën van AI zijn te onderscheiden op basis van het type gegevens dat ze verwerken en de manier waarop ze leren. Zo richt <b>Computer Vision</b> zich op visuele informatie, <b>NLP</b> op tekst en taal, en <b>Audio</b> op geluid. Andere categorieën, zoals <b>Tabelvormig</b> en <b>Reinforcement Learning</b>, werken met gestructureerde data of leren via beloningen, terwijl <b>Multimodale</b> AI meerdere soorten gegevens integreert.
  </p>
  
  <div style="display: flex; gap: 10px; justify-content: space-between;">
    
    <div onclick="loadTask('Computer Vision')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Computer Vision</h3>
      <img src="static/images/rijkshuisstijl_iconen/SVG_schilderij-met-bloemen-in-vaas-erop_Blauw.svg" alt="Computer Vision Icon" style="width: 50px; height: 50px;"/>
    </div>
    
    <div onclick="loadTask('Natural Language Processing')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Natural Language Processing</h3>
      <img src="static/images/rijkshuisstijl_iconen/SVG_document-met-potlood_Blauw.svg" alt="Natural Language Processing Icon" style="width: 50px; height: 50px;"/>
    </div>
    
    <div onclick="loadTask('Audio')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Audio</h3>
      <img src="static/images/rijkshuisstijl_iconen/SVG_audio_Blauw.svg" alt="Audio Icon" style="width: 50px; height: 50px;"/>
    </div>
    
    <div onclick="loadTask('Tabelvormig')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Tabelvormig</h3>
      <img src="static/images/rijkshuisstijl_iconen/SVG_grafiek_Blauw.svg" alt="Tabelvormig Icon" style="width: 50px; height: 50px;"/>
    </div>
    
    <div onclick="loadTask('Reinforcement Learning')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Reinforcement Learning</h3>
      <i class="fa fa-robot" style="font-size: 30px; color: var(--logoblauw)"></i>
    </div>
    
    <div onclick="loadTask('Multimodal')" style="flex: 1; cursor: pointer; padding: 15px; border: 1px solid #ccc; text-align: center; border-radius: 8px;;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h3 style="margin-bottom: 10px;">Multimodal</h3>
      <img src="static/images/rijkshuisstijl_iconen/SVG_3-pijlen_Blauw.svg" alt="Multimodal Icon" style="width: 50px; height: 50px;"/>
    </div>
    
  </div>

</div>`
      },
    
    { title: "Alternatieven", content: `<div id="info-section" class="sub-page-content" style="padding: 20px;">

  <!-- Introductory Paragraph -->
  <div style="margin-bottom: 20px;">
    <p>
      We concluderen dat AI een enorme impact kan hebben op het klimaat. Daarom is het belangrijk om vast te stellen of u voor uw toepassing wel echt AI nodig heeft. Soms zijn bestaande technieken, of technieken die u al gebruikt, al voldoende en duurzamer om uw vraag te beantwoorden. Bijvoorbeeld, het stellen van een vraag aan een AI-chatbot kan ongeveer 4 tot 5 keer meer uitstoot veroorzaken dan dezelfde vraag via een zoekmachine zoals Google.
    </p>
  </div>

  <!-- Header for Alternatives Section -->
  <div style="margin-bottom: 15px;">
    <h2 style="font-size: 19px; color: #333; display: inline-block; padding-bottom: 5px;">Alternatieven voor AI</h2>
  </div>

  <!-- Alternative 1: Geautomatiseerde systemen -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
    <i class="fa fa-cog" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Geautomatiseerde systemen</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        In plaats van kunstmatige intelligentie (AI) kunt u kiezen voor systemen die werken op basis van vooraf ingestelde regels. Deze systemen volgen simpelweg een aantal instructies en zijn daarom makkelijker te begrijpen en te voorspellen, maar ze kunnen minder flexibel zijn als er iets veranderd.
      </p>
    </div>
  </div>

  <!-- Alternative 2: Data-analyse software -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
    <i class="fa fa-chart-line" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Data-analyse software</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        U kunt gebruikmaken van softwareprogramma's die statistische modellen of algoritmes toepassen om gegevens te analyseren zonder dat er AI bij komt kijken. Deze tools kunnen nog steeds waardevolle inzichten bieden, maar ze werken op basis van vooraf vastgestelde methoden en vereisen input van mensen.
      </p>
    </div>
  </div>

  <!-- Alternative 3: Workflow-automatisering -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
    <i class="fa fa-robot" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Workflow-automatisering</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        Dit houdt in dat u tools zoals Robotic Process Automation (RPA) kunt gebruiken om routinetaken automatisch uit te voeren, zonder dat AI of geavanceerde leerprocessen nodig zijn. Dit versnelt taken die anders herhaaldelijk door mensen zouden worden gedaan.
      </p>
    </div>
  </div>

  <!-- Alternative 4: Expert Systems -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
    <i class="fa fa-user-tie" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Expert Systems</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        Met expertsystemen kunt u de kennis van vakdeskundigen vastleggen en gebruiken om complexe problemen binnen een specifiek vakgebied op te lossen. In tegenstelling tot AI leren expertsystemen niet van nieuwe gegevens, maar ze maken gebruik van gestructureerde, betrouwbare informatie. Dit kan nuttig zijn wanneer u behoefte hebt aan strikte controle en voorspelbaarheid.
      </p>
    </div>
  </div>

  <!-- Alternative 5: Simulation Modeling -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
    <i class="fa fa-cube" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Simulation Modeling</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        U kunt simulatiemodellen gebruiken om real-world processen en scenario's te simuleren. Deze tools zijn vooral handig in sectoren zoals productie, logistiek of milieubeheer, omdat ze u in staat stellen verschillende uitkomsten te testen zonder afhankelijk te zijn van AI-voorspellingen.
      </p>
    </div>
  </div>

</div>
`},
    { title: "Tips", content: `<div id="sub-page-content" class="sub-page-content" style="padding: 20px;">

  <!-- Section 1: Beperk je data -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
    <i class="fa fa-database" style="font-size: 24px; color: var(--logoblauw); margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Beperk je data</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        Het gebruik van kleinere modellen, die minder data gebruiken, zorgt voor een lagere uitstoot dan het gebruik van grotere modellen. Kies daarom waar mogelijk een kleiner AI model en beperk de input data.
      </p>
    </div>
  </div>

  <!-- Section 2: Duurzame keuze -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
    <i class="fa fa-leaf" style="font-size: 24px; color: #28a745; margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Duurzame keuze</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        Kies waar mogelijk voor AI modellen die zijn gemaakt door bedrijven die rekening houden met het milieu en de uitstoot van AI modellen.
      </p>
    </div>
  </div>

  <!-- Section 3: Bewuste keuze -->
  <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
    <i class="fa fa-lightbulb" style="font-size: 24px; color: #FADF63; margin-right: 15px;"></i>
    <div>
      <h3 style="margin: 0; font-size: 18px;">Bewuste keuze</h3>
      <p style="margin: 5px 0 0; line-height: 1.5;">
        Denk goed na of je echt AI moet gebruiken en of er geen alternatieven te gebruiken zijn die minder schadelijk zijn.
      </p>
    </div>
  </div>

</div>
`
    },
      
      
  ];
  numChapters = chapters.length;

  const chapterTitle = document.getElementById('chapterTitle');
  const chapterText = document.getElementById('chapterText');
  const prevChapterBtn = document.getElementById('prevChapter');
  const nextChapterBtn = document.getElementById('nextChapter');
  // Set the current chapter title and content
  let titleHTML = "";

  // if (currentChapter > 0) {
  //   titleHTML += chapters[currentChapter - 1].title + " ";
  // }

  // titleHTML += "&nbsp;" + chapters[currentChapter].title + "&nbsp;";

  // if (currentChapter < chapters.length - 1) {
  //   titleHTML += " " + chapters[currentChapter + 1].title;
  // }

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('chapter-titles');

  const prevChapterTitle = document.createElement('span');
  prevChapterTitle.classList.add('sibling-chapter');
  if (currentChapter > 0) {
    prevChapterTitle.textContent = chapters[currentChapter - 1].title;
    prevChapterTitle.classList.add('visible');
    prevChapterTitle.classList.remove('invisible');
  } else {
    prevChapterTitle.textContent = chapters[currentChapter].title;
    prevChapterTitle.classList.add('invisible');
    prevChapterTitle.classList.remove('visible');
  }

  const currentChapterTitle = document.createElement('span');
  currentChapterTitle.classList.add('current-chapter');
  currentChapterTitle.textContent = chapters[currentChapter].title

  const nextChapterTitle = document.createElement('span');
  nextChapterTitle.classList.add('sibling-chapter');
  if (currentChapter < chapters.length - 1) {
    nextChapterTitle.textContent = chapters[currentChapter + 1].title;
    nextChapterTitle.classList.add('visible');
    nextChapterTitle.classList.remove('invisible');
  } else {
    nextChapterTitle.textContent = chapters[currentChapter].title;
    nextChapterTitle.classList.add('invisible');
    nextChapterTitle.classList.remove('visible');
  }

  titleDiv.appendChild(prevChapterTitle);
  titleDiv.appendChild(currentChapterTitle);
  titleDiv.appendChild(nextChapterTitle);

  chapterTitle.innerHTML = "";
  chapterTitle.appendChild(titleDiv);
  chapterText.innerHTML = chapters[currentChapter].content;

  // Disable/Enable navigation arrows based on chapter
  prevChapterBtn.disabled = currentChapter === 0;
  nextChapterBtn.disabled = currentChapter === chapters.length - 1;
}

function loadArrowListners() {
  const prevChapterBtn = document.getElementById('prevChapter');
  const nextChapterBtn = document.getElementById('nextChapter');
  prevChapterBtn.addEventListener('click', () => {
    if (currentChapter > 0) {
        currentChapter--;
        updateChapter();
    }
    document.getElementById("start-button").scrollIntoView({ behavior: "smooth" });
  });
  
  nextChapterBtn.addEventListener('click', () => {
    if (currentChapter < numChapters - 1) {
        currentChapter++;
        updateChapter();
    }
    document.getElementById("start-button").scrollIntoView({ behavior: "smooth" });
  });
}


function loadTask(task) {
  globalCategory = task;
  loadPage('task', 'welcome');
}

loadArrowListners();
updateChapter();

document.getElementById('start-button').addEventListener('click', function () {
  loadPage('start', 'welcome');
});