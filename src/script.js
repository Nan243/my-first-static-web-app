// script.js
// Interactividad: datos aleatorios y juego de parejas con animaciones y sonido

const facts = [
  "Los gatos duermen entre 12 y 16 horas al día.",
  "Un gato puede girar sus orejas 180 grados.",
  "Los gatitos nacen ciegos y abren los ojos entre 7 y 10 días después.",
  "Los gatos tienen más huesos que los humanos: 230 frente a 206.",
  "Al ronronear, los gatos pueden ayudar a sanar sus propios huesos y tejidos."
];

const gameImages = [
  'https://placekitten.com/300/300',
  'https://placekitten.com/301/300',
  'https://placekitten.com/302/300'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';

  const deck = [...gameImages, ...gameImages].map((src, i) => ({ id: i, src }));
  shuffle(deck);

  deck.forEach((cardData) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.src = cardData.src;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = '🐾';

    const back = document.createElement('div');
    back.className = 'card-back';
    const img = document.createElement('img');
    img.src = cardData.src;
    img.alt = 'Gatito';
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    board.appendChild(card);
  });
}

// WebAudio helpers
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function playTone(freq, duration = 0.12, type = 'sine') {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
  o.start(now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.stop(now + duration + 0.02);
}

function playSuccess() {
  playTone(523, 0.12); // C5
  setTimeout(() => playTone(659, 0.14), 140); // E5
}

function playFail() {
  playTone(180, 0.18, 'square');
}

function playWin() {
  const notes = [523, 659, 784];
  notes.forEach((n, i) => setTimeout(() => playTone(n, 0.12), i * 160));
}

// Estado del juego
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let matches = 0;

const movesEl = () => document.getElementById('moves');
const matchesEl = () => document.getElementById('matches');

function resetSelected() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function updateStats() {
  movesEl().textContent = moves;
  matchesEl().textContent = matches;
}

function showVictory() {
  const victory = document.getElementById('victory');
  const movesFinal = document.getElementById('movesFinal');
  movesFinal.textContent = moves;
  victory.classList.remove('hidden');
  playWin();
}

function setupGame() {
  const board = document.getElementById('gameBoard');

  // manejar clics usando onclick para evitar múltiple registro de listeners
  board.onclick = (e) => {
    const card = e.target.closest('.card');
    if (!card || lock || card.classList.contains('matched') || card === firstCard) return;

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    updateStats();
    lock = true;

    const src1 = firstCard.dataset.src;
    const src2 = secondCard.dataset.src;

    if (src1 === src2) {
      // match
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      // efecto pulse
      firstCard.querySelector('.card-inner').classList.add('pulse');
      secondCard.querySelector('.card-inner').classList.add('pulse');
      playSuccess();
      matches++;
      updateStats();
      setTimeout(() => {
        // quitar la animación pulse después
        firstCard.querySelector('.card-inner').classList.remove('pulse');
        secondCard.querySelector('.card-inner').classList.remove('pulse');
        resetSelected();
        if (matches === gameImages.length) {
          showVictory();
        }
      }, 600);
    } else {
      // no match: shake y sonido
      firstCard.classList.add('shake');
      secondCard.classList.add('shake');
      playFail();
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.classList.remove('shake');
        secondCard.classList.remove('shake');
        resetSelected();
      }, 800);
    }
  };

  // reiniciar con botón
  const restartBtn = document.getElementById('restart');
  restartBtn.onclick = () => {
    moves = 0;
    matches = 0;
    updateStats();
    createBoard();
    setupGame();
    // ocultar overlay si estaba visible
    document.getElementById('victory').classList.add('hidden');
  };

  // boton jugar de nuevo en overlay
  const playAgain = document.getElementById('playAgain');
  if (playAgain) {
    playAgain.onclick = () => {
      document.getElementById('victory').classList.add('hidden');
      restartBtn.onclick();
    };
  }

  // inicializar estadísticas
  moves = 0;
  matches = 0;
  updateStats();
}

window.addEventListener('DOMContentLoaded', () => {
  // datos aleatorios
  const factBtn = document.getElementById('factBtn');
  const factEl = document.getElementById('fact');

  factBtn.addEventListener('click', () => {
    const idx = Math.floor(Math.random() * facts.length);
    factEl.textContent = facts[idx];
  });

  // crear tablero y configurar juego
  createBoard();
  setupGame();
});