// ===== DATA =====

const ROUND_EMOJIS = [
  ['🍎', '🚗', '🐶', '🏀', '⌚'],
  ['🍕', '🎸', '🐱', '⚽', '🎩'],
  ['🍌', '🚀', '🦁', '🎯', '💎'],
  ['🍇', '🏍️', '🐸', '🎮', '🔮'],
  ['🍓', '✈️', '🦊', '🎾', '🎪'],
];

const ALL_LABELS = [
  ['Apple', 'Car', 'Dog', 'Ball', 'Watch'],
  ['Pizza', 'Guitar', 'Cat', 'Soccer', 'Hat'],
  ['Banana', 'Rocket', 'Lion', 'Target', 'Diamond'],
  ['Grapes', 'Motorbike', 'Frog', 'Game', 'Crystal'],
  ['Berry', 'Plane', 'Fox', 'Tennis', 'Circus'],
];

const ROUND_QUESTIONS = [
  [
    { q: "Was there a cat?",        e: "🐱", answer: "No",  troll: false },
    { q: "Did you see a ball?",     e: "🏀", answer: "Yes", troll: false },
    { q: "Was the car red?",        e: "🚗", answer: "No",  troll: true,  tag: "We never said the color!" },
    { q: "Was there a clock?",      e: "🕐", answer: "No",  troll: true,  tag: "Tricky — it was a watch!" },
    { q: "Did you see an apple?",   e: "🍎", answer: "Yes", troll: false },
    { q: "Was there a trophy?",     e: "🏆", answer: "No",  troll: false },
  ],
  [
    { q: "Was there a dog?",        e: "🐶", answer: "No",  troll: false },
    { q: "Did you see a guitar?",   e: "🎸", answer: "Yes", troll: false },
    { q: "Was the pizza hot?",      e: "🍕", answer: "No",  troll: true,  tag: "We never said if it was hot!" },
    { q: "Was there a hat?",        e: "🎩", answer: "Yes", troll: false },
    { q: "Did you see a football?", e: "🏈", answer: "No",  troll: true,  tag: "It was soccer — ⚽!" },
    { q: "Was there a cat?",        e: "🐱", answer: "Yes", troll: false },
  ],
  [
    { q: "Was there a banana?",     e: "🍌", answer: "Yes", troll: false },
    { q: "Did you see a rocket?",   e: "🚀", answer: "Yes", troll: false },
    { q: "Was the lion tamed?",     e: "🦁", answer: "No",  troll: true,  tag: "We never said that!" },
    { q: "Was there a diamond?",    e: "💎", answer: "Yes", troll: false },
    { q: "Did you see a dartboard?",e: "🎯", answer: "Yes", troll: false },
    { q: "Was there a frog?",       e: "🐸", answer: "No",  troll: false },
  ],
  [
    { q: "Was there grapes?",           e: "🍇", answer: "Yes", troll: false },
    { q: "Did you see a motorbike?",    e: "🏍️", answer: "Yes", troll: false },
    { q: "Was the frog green?",         e: "🐸", answer: "No",  troll: true,  tag: "We never mentioned color!" },
    { q: "Was there a joystick?",       e: "🕹️", answer: "No",  troll: true,  tag: "It was a game controller 🎮!" },
    { q: "Did you see a crystal ball?", e: "🔮", answer: "Yes", troll: false },
    { q: "Was there a soccer ball?",    e: "⚽", answer: "No",  troll: false },
  ],
  [
    { q: "Was there a strawberry?",     e: "🍓", answer: "Yes", troll: false },
    { q: "Did you see a plane?",        e: "✈️", answer: "Yes", troll: false },
    { q: "Was the fox friendly?",       e: "🦊", answer: "No",  troll: true,  tag: "We never said that!" },
    { q: "Was there a tennis racket?",  e: "🎾", answer: "No",  troll: true,  tag: "It was a tennis ball 🎾!" },
    { q: "Did you see a circus tent?",  e: "🎪", answer: "Yes", troll: false },
    { q: "Was there a cat?",            e: "🐱", answer: "No",  troll: false },
  ],
];

const CARD_COLORS = ['#ff6eb4', '#ffd93d', '#6bcb77', '#4d96ff', '#a855f7'];
const CONFETTI_COLORS = ['#ff6eb4', '#ffd93d', '#6bcb77', '#4d96ff', '#a855f7', '#ff8c42'];

// ===== STATE =====

let score = 0;
let qIndex = 0;
let roundIndex = 0;
let questions = [];
let pendingAnswer = null;
let timerInterval = null;

// ===== HELPERS =====

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function flashScreen(correct) {
  const f = document.getElementById('flash');
  f.className = 'answer-flash ' + (correct ? 'correct' : 'wrong');
  setTimeout(() => f.className = 'answer-flash', 400);
}

// ===== BUILD ITEMS GRID =====

function buildItems() {
  questions = ROUND_QUESTIONS[roundIndex];
  const items = ROUND_EMOJIS[roundIndex];
  const labels = ALL_LABELS[roundIndex];
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';

  items.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.animationDelay = (i * 0.08) + 's';
    card.style.borderColor = CARD_COLORS[i] + '55';
    card.style.background = `linear-gradient(135deg, ${CARD_COLORS[i]}15, transparent)`;
    card.innerHTML = `
      <span class="item-emoji">${emoji}</span>
      <span class="item-label">${labels[i]}</span>
    `;
    grid.appendChild(card);
  });
}

// ===== TIMER =====

function startTimer() {
  let t = 5;
  const numEl = document.getElementById('timer-num');
  const arc = document.getElementById('timer-arc');

  numEl.textContent = t;
  arc.style.strokeDashoffset = '0';
  arc.style.transition = 'none';

  setTimeout(() => {
    arc.style.transition = 'stroke-dashoffset 5s linear';
    arc.style.strokeDashoffset = '251';
  }, 50);

  timerInterval = setInterval(() => {
    t--;
    numEl.textContent = t;
    if (t <= 0) {
      clearInterval(timerInterval);
      goLoading();
    }
  }, 1000);
}

// ===== SCREENS =====

function goLoading() {
  show('loading-screen');
  setTimeout(() => startQuestions(), 1800);
}

function startQuestions() {
  qIndex = 0;
  score = 0;
  show('question-screen');
  showQuestion();
}

// ===== QUESTION LOGIC =====

function showQuestion() {
  const total = questions.length;
  document.getElementById('q-number').textContent = `Question ${qIndex + 1} of ${total}`;
  document.getElementById('progress-bar').style.width = ((qIndex / total) * 100) + '%';

  const q = questions[qIndex];
  document.getElementById('q-emoji').textContent = q.e;
  document.getElementById('q-text').textContent = q.q;

  const tag = document.getElementById('troll-tag');
  if (q.troll && Math.random() < 0.5) {
    tag.style.display = 'inline-block';
    tag.textContent = '⚠️ Tricky!';
  } else {
    tag.style.display = 'none';
  }

  document.getElementById('yes-btn').disabled = false;
  document.getElementById('no-btn').disabled = false;
}

function handleAnswer(ans) {
  document.getElementById('yes-btn').disabled = true;
  document.getElementById('no-btn').disabled = true;

  const q = questions[qIndex];

  // 45% chance troll popup appears on troll questions
  if (q.troll && Math.random() < 0.45) {
    pendingAnswer = ans;
    showTrollPopup(q.tag || 'Are you SURE about that? 😈');
  } else {
    processAnswer(ans);
  }
}

function processAnswer(ans) {
  const q = questions[qIndex];
  const correct = ans === q.answer;
  if (correct) score++;
  flashScreen(correct);
  qIndex++;

  if (qIndex >= questions.length) {
    setTimeout(showResult, 600);
  } else {
    setTimeout(showQuestion, 500);
  }
}

// ===== TROLL POPUP =====

function showTrollPopup(msg) {
  document.getElementById('troll-text').textContent = msg + ' Are you SURE? 😈';
  document.getElementById('troll-popup').classList.add('show');
}

document.getElementById('troll-confirm').onclick = () => {
  document.getElementById('troll-popup').classList.remove('show');
  const flipped = pendingAnswer === 'Yes' ? 'No' : 'Yes';
  processAnswer(flipped);
};

document.getElementById('troll-keep').onclick = () => {
  document.getElementById('troll-popup').classList.remove('show');
  processAnswer(pendingAnswer);
};

// ===== RESULT =====

function showResult() {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  document.getElementById('result-score').textContent = score + '/' + total;

  let emoji, msg, stars;
  if (pct >= 100) {
    emoji = '🏆'; msg = 'Okay GENIUS, relax. Show-off. 🧠🔥'; stars = '⭐⭐⭐⭐⭐';
  } else if (pct >= 70) {
    emoji = '😎'; msg = 'Not bad! Brain cells are warming up 🔥'; stars = '⭐⭐⭐⭐';
  } else if (pct >= 50) {
    emoji = '😅'; msg = 'You tried… brain tried less 😄'; stars = '⭐⭐⭐';
  } else if (pct >= 30) {
    emoji = '🫠'; msg = 'Oof. We were rooting for you… kinda 😬'; stars = '⭐⭐';
  } else {
    emoji = '🐟'; msg = 'Memory level: Goldfish 🐟 No offense.'; stars = '⭐';
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-msg').textContent = msg;
  document.getElementById('result-stars').textContent = stars;

  if (pct >= 70) spawnConfetti();
  show('result-screen');
}

// ===== CONFETTI =====

function spawnConfetti() {
  const wrap = document.getElementById('confetti');
  wrap.innerHTML = '';

  for (let i = 0; i < 28; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.style.left = Math.random() * 100 + '%';
    d.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    d.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    d.style.animationDelay = (Math.random() * 0.8) + 's';
    d.style.width = (5 + Math.random() * 8) + 'px';
    d.style.height = d.style.width;
    wrap.appendChild(d);
  }

  setTimeout(() => wrap.innerHTML = '', 4000);
}

// ===== BUTTON EVENTS =====

document.getElementById('start-btn').onclick = () => {
  roundIndex = 0;
  buildItems();
  show('memory-screen');
  startTimer();
};

document.getElementById('yes-btn').onclick = () => handleAnswer('Yes');
document.getElementById('no-btn').onclick  = () => handleAnswer('No');

document.getElementById('replay-btn').onclick = () => {
  roundIndex = (roundIndex + 1) % ROUND_EMOJIS.length;
  buildItems();
  show('memory-screen');
  startTimer();
};
