// script.js
// Simple interactivity: show a random kitten fact when button is clicked.

const facts = [
  "Los gatos duermen entre 12 y 16 horas al día.",
  "Un gato puede girar sus orejas 180 grados.",
  "Los gatitos nacen ciegos y abren los ojos entre 7 y 10 días después.",
  "Los gatos tienen más huesos que los humanos: 230 frente a 206.",
  "Al ronronear, los gatos pueden ayudar a sanar sus propios huesos y tejidos."
];

window.addEventListener('DOMContentLoaded', () => {
  const factBtn = document.getElementById('factBtn');
  const factEl = document.getElementById('fact');

  factBtn.addEventListener('click', () => {
    const idx = Math.floor(Math.random() * facts.length);
    factEl.textContent = facts[idx];
  });
});