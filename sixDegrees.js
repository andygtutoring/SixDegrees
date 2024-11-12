// sixDegrees.js
const actor1Element = document.getElementById('actor-1');
const actor2Element = document.getElementById('actor-2');
const stepElements = [
  document.getElementById('step-1-actor'),
  document.getElementById('step-1-movie'),
  document.getElementById('step-2-actor'),
  document.getElementById('step-2-movie'),
  document.getElementById('step-3-actor'),
  document.getElementById('step-3-movie'),
  document.getElementById('step-4-actor'),
  document.getElementById('step-4-movie'),
  document.getElementById('step-5-actor'),
  document.getElementById('step-5-movie'),
];
const checkAnswerButton = document.getElementById('check-answer');
const newGameButton = document.getElementById('new-game');

let actor1, actor2;
let currentStep = 0;

// Initialize game
newGame();

// Event listeners
checkAnswerButton.addEventListener('click', checkAnswer);
newGameButton.addEventListener('click', newGame);

// Functions
function newGame() {
  // Get random actors from API
  fetch('https://api.themoviedb.org/3/person/popular?api_key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => {
      actor1 = data.results[Math.floor(Math.random() * data.results.length)].name;
      actor2 = data.results[Math.floor(Math.random() * data.results.length)].name;

      actor1Element.innerText = actor1;
      actor2Element.innerText = actor2;

      // Clear previous game state
      stepElements.forEach(element => {
        element.innerText = '';
        element.contentEditable = 'true';
      });

      currentStep = 0;
    });
}

function checkAnswer() {
  // Get user input for each step
  const userSteps = stepElements.map(element => element.innerText);

  // Validate user input (e.g., check if actor/movie exists)
  // For simplicity, this example assumes valid input

  // Check if user connected actors
  fetch(`https://api.themoviedb.org/3/person/${getPersonId(actor1)}?api_key=YOUR_API_KEY`)
    .then(response => response.json())
    .then(data => {
      const actor1Movies = data.known_for;

      // Recursively check connections
      checkConnections(actor1Movies, userSteps, 0);
    });
}

function getPersonId(actorName) {
  // Get person ID from API (for simplicity, assume ID is in format "nm1234567")
  return fetch(`https://api.themoviedb.org/3/search/person?api_key=YOUR_API_KEY&query=${actorName}`)
    .then(response => response.json())
    .then(data => data.results[0].id);
}

function checkConnections(movies, userSteps, currentStep) {
  if (currentStep >= userSteps.length) {
    // User connected actors, win!
    alert('Congratulations! You connected the actors!');
    return;
  }

  const currentActor = userSteps[currentStep];
  const currentMovie = userSteps[currentStep + 1];

  // Find movie ID
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${currentMovie}`)
    .then(response => response.json())
    .then(data => {
      const movieId = data.results[0].id;

      // Find cast for movie
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=YOUR_API_KEY`)
        .then(response => response.json())
        .then(data => {
          const cast = data.cast;

          // Check if current actor is in cast
          if (cast.some(actor => actor.name === currentActor)) {
            // Recursively check next connection
            checkConnections(cast.map(actor => actor.name), userSteps, currentStep + 2);
          } else {
            // Invalid connection
            alert(`Invalid connection between ${currentActor} and ${currentMovie}`);
          }
        });
    });
}
