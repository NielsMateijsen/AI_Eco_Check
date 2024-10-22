// Chapter Data


var currentChapter = 0;
var numChapters;

// Function to update chapter navigation and content
function updateChapter() {
  const chapters = [
    { title: "Chapter 1", content: "This is the content of Chapter 1." },
    { title: "Chapter 2", content: "This is the content of Chapter 2." },
    { title: "Chapter 3", content: "This is the content of Chapter 3." },
    { title: "Chapter 4", content: "This is the content of Chapter 4." },
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
  chapterText.textContent = chapters[currentChapter].content;

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
  });
  
  nextChapterBtn.addEventListener('click', () => {
    if (currentChapter < numChapters - 1) {
        currentChapter++;
        updateChapter();
    }
  });
}

loadArrowListners();
updateChapter();

document.getElementById('start-button').addEventListener('click', function () {
  loadPage('start', 'welcome');
});