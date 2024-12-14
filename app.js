// app.js

let currentPage = 0;
const questionsPerPage = 6;
const questionsPerTest = 12; // Yeni test 12 sorudan oluşacak
let questions = [];
let totalPages = 0; // Toplam sayfa sayısını hesaplamak için

// JSON verisini yükleme
fetch('sorular.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    totalPages = Math.ceil(questions.length / questionsPerPage);
    createQuestionCards(currentPage);
    updatePaginationControls();
  })
  .catch(error => console.error('JSON verisi yüklenemedi:', error));

// Soruları oluşturma
function createQuestionCards(page) {
  const startIndex = page * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const container = document.getElementById('question-container');
  container.innerHTML = '';

  currentQuestions.forEach((question, index) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.innerHTML = `Soru ${startIndex + index + 1}`;

    // Yardım ikonu (Soru işareti)
    const helpIcon = document.createElement('span');
    helpIcon.setAttribute('id', 'help-icon');
    helpIcon.innerHTML = '?';
    helpIcon.addEventListener('click', () => showAnswer(question, card));
    cardHeader.appendChild(helpIcon);

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.innerHTML = `<p>${question.question}</p>`;

    question.options.forEach((option, idx) => {
      const optionElem = document.createElement('div');
      optionElem.classList.add('option');
      optionElem.innerText = `${String.fromCharCode(65 + idx)}) ${option}`;
      cardContent.appendChild(optionElem);
    });

    card.appendChild(cardHeader);
    card.appendChild(cardContent);
    container.appendChild(card);
  });
}

// Cevabı gösterme
function showAnswer(question, card) {
  const cardContent = card.querySelector('.card-content');
  const options = cardContent.querySelectorAll('.option');
  options.forEach((option, idx) => {
    if (idx === question.answer) {
      option.classList.add('correct');
    }
  });
}

// Sayfa kontrolünü güncelleme
function updatePaginationControls() {
  document.getElementById('current-page').innerText = Math.floor(currentPage / questionsPerTest) + 1;
  document.getElementById('page-info').innerText = `Sayfa ${currentPage + 1} / ${totalPages}`;
  document.getElementById('previous-page').disabled = currentPage === 0;
  document.getElementById('next-page').disabled = currentPage === totalPages - 1;
}

// Sayfa değişim düğmelerine tıklanıldığında
document.getElementById('previous-page').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    createQuestionCards(currentPage);
    updatePaginationControls();
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < totalPages - 1) {
    currentPage++;
    createQuestionCards(currentPage);
    updatePaginationControls();
  }
});
