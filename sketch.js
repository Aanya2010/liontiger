var canvas;
var backgroundImage, lion, tiger, track;
var fuelImage, powerCoinImage, lifeImage;
var obstacle1Image, obstacle2Image;
var database, gameState;
var blastImage;
var form, player, playerCount;
var allPlayers, lion, tiger,  powerCoins, obstacles;
var cars = [];

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  lion = loadImage("./assets/lion.png");
  tiger = loadImage("./assets/tiger.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.jpg");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");
  titleImg = loadImage("./assets/title.jpeg");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
