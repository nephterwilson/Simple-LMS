




var currentSubject = typeof currentSubject !== "undefined" ? currentSubject : "mathematics";
let currentTopic = null;
let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 300; // 5 minutes in seconds
let timerInterval;


// Renders topic selection UI
function renderTopicSelection() {
  console.log("Loading subject:", currentSubject);
console.log("Topics:", quizData[currentSubject]);

  const container = document.getElementById("quiz-container");
  const topics = Object.keys(quizData[currentSubject]);
  
  container.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Select a Topic to Start Quiz</h2>
    <div id="topics-list">
      ${topics.map(topic => `
        <button class="topic-btn bg-indigo-600 text-white px-4 py-2 rounded m-2">
          ${topic}
        </button>
      `).join('')}
    </div>
  `;

  // Hide navigation buttons and reset timer display
  document.getElementById("prev-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("timer").textContent = "";

  setTimeout(() => {
  document.querySelectorAll(".topic-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("Clicked:", btn.textContent); // DEBUG
      currentTopic = btn.textContent.trim();
      startTopicQuiz();
    });
  });
}, 0);


  document.querySelectorAll(".topic-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTopic = btn.textContent;
      startTopicQuiz();
    });
  });
}

// Start quiz for selected topic
function startTopicQuiz() {
  questions = quizData[currentSubject][currentTopic];
  
  const saved = loadProgress(currentSubject, currentTopic);
  currentQuestion = saved.currentQuestion || 0;
  userAnswers = saved.userAnswers || [];
  timeLeft = saved.timeLeft || 300;

  renderQuestion();
  startTimer();

  document.getElementById("prev-btn").style.display = "inline-block";
  document.getElementById("next-btn").style.display = "inline-block";
}

// Render current question UI
function renderQuestion() {
  const quizContainer = document.getElementById("quiz-container");
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">${currentQuestion + 1}. ${q.question}</h3>
      ${q.options.map(opt => `
        <label class="block mb-2">
          <input type="radio" name="answer" value="${opt}" 
            ${userAnswers[currentQuestion] === opt ? 'checked' : ''} class="mr-2">
          ${opt}
        </label>
      `).join('')}
    </div>
  `;

  updateProgressBar();
  document.getElementById("prev-btn").disabled = currentQuestion === 0;
  document.getElementById("next-btn").textContent = currentQuestion === questions.length - 1 ? "Submit" : "Next";
}

// Update progress bar
function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

// Timer start and update
function startTimer() {
  const timerEl = document.getElementById("timer");
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    timerEl.textContent = `Time: ${min}:${sec}`;

    saveProgress(currentSubject, currentTopic, currentQuestion, userAnswers, timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

// Next question or submit
function nextQuestion() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected) {
    userAnswers[currentQuestion] = selected.value;
  }

  saveProgress(currentSubject, currentTopic, currentQuestion, userAnswers, timeLeft);

  if (currentQuestion === questions.length - 1) {
    submitQuiz();
    return;
  }

  currentQuestion++;
  renderQuestion();
}

// Previous question
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

// Submit and show results
function submitQuiz() {
  clearInterval(timerInterval);
  
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  const percent = Math.round((score / questions.length) * 100);

  document.getElementById("quiz-container").innerHTML = `
    <div class="bg-green-100 p-6 text-center rounded shadow">
      <h2 class="text-2xl font-bold text-green-800 mb-2">Quiz Complete!</h2>
      <p class="text-lg text-gray-700">You scored ${score} / ${questions.length} (${percent}%)</p>
      <button onclick="renderTopicSelection()" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Back to Topics</button>
      <button onclick="restartQuiz()" class="mt-4 ml-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Retry Quiz</button>
    </div>
  `;

  document.getElementById("prev-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("timer").textContent = "";

  clearProgress(currentSubject, currentTopic);
}

// Retry current topic quiz
function restartQuiz() {
  currentQuestion = 0;
  userAnswers = [];
  timeLeft = 300;
  renderQuestion();
  startTimer();

  document.getElementById("prev-btn").style.display = "inline-block";
  document.getElementById("next-btn").style.display = "inline-block";
}

// Save/load/clear progress helpers
function saveProgress(subject, topic, currentQuestion, userAnswers, timeLeft) {
  const key = `quizProgress_${subject}_${topic}`;
  localStorage.setItem(key, JSON.stringify({ currentQuestion, userAnswers, timeLeft }));
}

function loadProgress(subject, topic) {
  const key = `quizProgress_${subject}_${topic}`;
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return { currentQuestion: 0, userAnswers: [], timeLeft: 300 };
}

function clearProgress(subject, topic) {
  const key = `quizProgress_${subject}_${topic}`;
  localStorage.removeItem(key);
}

// Event listeners
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("prev-btn").addEventListener("click", prevQuestion);

// Initialize topic selection on load
document.addEventListener("DOMContentLoaded", () => {
  renderTopicSelection();
});
