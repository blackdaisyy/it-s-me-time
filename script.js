let currentQuestion = 0;
let answers = [];
let disorders = [];

// DOM Elements
const screens = {
  welcome: document.getElementById("welcomeScreen"),
  assessment: document.getElementById("assessmentScreen"),
  search: document.getElementById("searchScreen"),
  results: document.getElementById("resultsScreen"),
};

// Event 1: Start Assessment Button
document
  .getElementById("startAssessment")
  .addEventListener("click", function () {
    showScreen("assessment");
    startAssessment();
  });

// Event 2: Show Search Screen Button
document.getElementById("showSearch").addEventListener("click", function () {
  showScreen("search");
});

// Event 3: Search Button
document.getElementById("searchBtn").addEventListener("click", function () {
  performSearch();
});

// Navigation buttons
document.getElementById("backToWelcome").addEventListener("click", function () {
  showScreen("welcome");
});

document
  .getElementById("backFromSearch")
  .addEventListener("click", function () {
    showScreen("welcome");
  });

document.getElementById("restartBtn").addEventListener("click", function () {
  showScreen("welcome");
  resetAssessment();
});

// Load data when page loads
window.addEventListener("load", function () {
  loadDisorders();
});

function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  // Show requested screen
  screens[screenName].classList.add("active");
}

function loadDisorders() {
  fetch("db.json")
    .then((response) => response.json())
    .then((data) => {
      disorders = data.disorders;
    })
    .catch((error) => {
      console.error("Error loading disorders:", error);
    });
}

function startAssessment() {
  currentQuestion = 0;
  answers = [];
  showQuestion();
}

function showQuestion() {
  const questions = [
    "Have you felt down or hopeless recently?",
    "Have you lost interest in activities you usually enjoy?",
    "Have you had trouble sleeping or been sleeping too much?",
    "Have you felt unusually worried or anxious?",
    "Have you had difficulty concentrating?",
  ];

  if (currentQuestion < questions.length) {
    /*  */
    document.getElementById("questionText").textContent =
      questions[currentQuestion];
    document.getElementById("progress").textContent = `Question ${
      currentQuestion + 1
    } of ${questions.length}`;

    // Add event listeners to answer buttons
    document.querySelectorAll(".answer-btn").forEach((button) => {
      button.onclick = function () {
        answers.push(this.getAttribute("data-answer"));
        currentQuestion++;
        if (currentQuestion < questions.length) {
          showQuestion();
        } else {
          showResults();
        }
      };
    });
  }
}

function showResults() {
  showScreen("results");

  const yesCount = answers.filter((answer) => answer === "yes").length;
  const unsureCount = answers.filter((answer) => answer === "unsure").length;

  let resultHTML = "";

  if (yesCount >= 3) {
    resultHTML = `
            <div class="result-card">
                <h3>Recommend Professional Consultation</h3>
                <p>Based on your responses, it may be helpful to speak with a mental health professional.</p>
                <div class="remedy">
                    <h4>Suggestions:</h4>
                    <ul>
                        <li>Consider speaking with a therapist or counselor</li>
                        <li>Practice daily mindfulness exercises</li>
                        <li>Maintain a regular sleep schedule</li>
                        <li>Stay connected with supportive friends/family</li>
                    </ul>
                </div>
            </div>
        `;
  } else if (yesCount + unsureCount >= 2) {
    resultHTML = `
            <div class="result-card">
                <h3>Some Concerns Noted</h3>
                <p>You're experiencing some challenges. Regular self-care can be beneficial.</p>
                <div class="remedy">
                    <h4>Self-Care Tips:</h4>
                    <ul>
                        <li>Practice relaxation techniques daily</li>
                        <li>Engage in physical activity</li>
                        <li>Maintain social connections</li>
                        <li>Consider keeping a mood journal</li>
                    </ul>
                </div>
            </div>
        `;
  } else {
    resultHTML = `
            <div class="result-card">
                <h3>Good Mental Health Signs</h3>
                <p>Your responses indicate positive mental health patterns. Keep up the good work!</p>
                <div class="remedy">
                    <h4>Maintenance Tips:</h4>
                    <ul>
                        <li>Continue healthy routines</li>
                        <li>Practice gratitude</li>
                        <li>Stay physically active</li>
                        <li>Help others when possible</li>
                    </ul>
                </div>
            </div>
        `;
  }

  document.getElementById("resultContent").innerHTML = resultHTML;
}

function performSearch() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const resultsDiv = document.getElementById("searchResults");

  if (!searchTerm) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  const foundDisorder = disorders.find((disorder) =>
    disorder.name.toLowerCase().includes(searchTerm)
  );

  if (foundDisorder) {
    resultsDiv.innerHTML = `
            <div class="result-card">
                <h3>${foundDisorder.name}</h3>
                <p><strong>Description:</strong> ${
                  foundDisorder.description
                }</p>
                <div class="remedy">
                    <h4>Support Strategies:</h4>
                    <ul>
                        ${foundDisorder.remedies
                          .map((remedy) => `<li>${remedy}</li>`)
                          .join("")}
                    </ul>
                </div>
            </div>
        `;
  } else {
    resultsDiv.innerHTML =
      "<p>No matching disorder found. Try another search term.</p>";
  }
}

function resetAssessment() {
  currentQuestion = 0;
  answers = [];
}
