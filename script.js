"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "orange", "blue", "purple", "green", "yellow", "white", "black", "pink", "brown"
];

const selectedCards = [];
let score = 0;
let clicks = 0;
let numPairsToWin = 10;
let best = 0;

document.getElementById("new-game").addEventListener("click", newGame);

function newGame() {
  let board = document.getElementById("game");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  score = 0;
  clicks = 0;
  updateCounters();

  const colors = shuffle(createDeck(numPairsToWin));
  createCards(colors);
}

function createDeck(numPairsToWin) {
  let deck = [];
  for (let i = 0; i < numPairsToWin; i++) {
    deck.push(COLORS[i]);
    deck.push(COLORS[i]);
  }
  return deck;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    let new_card = document.createElement("div");
    new_card.classList.add(color);
    new_card.classList.add("card");
    new_card.classList.add("back");
    new_card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(new_card);
  }
}

function flipCard(card) {
  card.classList.remove("back");
  card.removeEventListener("click", handleCardClick);
}

function unFlipCard(card) {
  card.classList.add("back");
  card.addEventListener("click", handleCardClick);
}

function handleCardClick(e) {
  clicks++;
  updateCounters();
  let card = e.target;
  flipCard(card);
  selectedCards.push(card);
  if (selectedCards.length === 2) {
    let unclickedCards = document.getElementsByClassName("back");
    for (let card of unclickedCards) {
      card.removeEventListener("click", handleCardClick);
    }
    setTimeout(checkMatch, FOUND_MATCH_WAIT_MSECS);
  }
}

function checkMatch() {
  if (selectedCards[0].className === selectedCards[1].className) {
    handleMatch();
  } else {
    handleNotMatch();
  }
  selectedCards.length = 0;
  let unmatchedCards = document.getElementsByClassName("back");
  for (let card of unmatchedCards) {
    card.addEventListener("click", handleCardClick);
  }
}

function handleMatch() {
  score++;
  updateCounters();
  checkForWin();
}

function handleNotMatch() {
  for (let card of selectedCards) {
    unFlipCard(card)
  }
}

function checkForWin() {
  if (score === numPairsToWin) {
    setTimeout(alert("Congratulations! You win!"), 300);
    updateBest();
  }
}

function updateCounters() {
  let totalClicks = document.getElementById("click-count");
  totalClicks.innerHTML = clicks;
}

function updateBest() {
  if (clicks < best || best === 0) {
    best = clicks;
  }
  let bestScore = document.getElementById("best-score");
  bestScore.innerHTML = best;
}