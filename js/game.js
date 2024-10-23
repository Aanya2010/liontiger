class Game {
    constructor() {
      this.resetTitle = createElement("h2");
      this.resetButton = createButton("");
  
      this.leadeboardTitle = createElement("h2");
  
      this.leader1 = createElement("h2");
      this.leader2 = createElement("h2");
      this.playerMoving = false;
      this.leftKeyActive = false;
      this.blast = false;
    }
  
    getState() {
      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value", function(data) {
        gameState = data.val();
      });
    }
    update(state) {
      database.ref("/").update({
        gameState: state
      });
    }
  
    start() {
      player = new Player();
      playerCount = player.getCount();
  
      form = new Form();
      form.display();
  
      lion = createSprite(width / 2 - 50, height - 100);
      lion.addImage("lion", lion);
      lion.scale = 0.07;
  
      lion.addImage("blast", blastImage);
  
      tiger = createSprite(width / 2 + 100, height - 100);
      tiger.addImage("car2", car2_img);
      tiger.scale = 0.07;
  
      tiger.addImage("blast", blastImage);
  
      animals = [lion, tiger];
  
      
      powerCoins = new Group();
  
      obstacles = new Group();
  
      var obstaclesPositions = [
        { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
        { x: width / 2, y: height - 2800, image: obstacle2Image },
        { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
        { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
        { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
        { x: width / 2, y: height - 5300, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
      ];
  
    
      // Adding coin sprite in the game
      this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
  
      //Adding obstacles sprite in the game
      this.addSprites(
        obstacles,
        obstaclesPositions.length,
        obstacle1Image,
        0.04,
        obstaclesPositions
      );
    }
  
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
  
        //C41 //SA
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
        } else {
          x = random(width / 2 + 150, width / 2 - 150);
          y = random(-height * 4.5, height - 400);
        }
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage);
  
        sprite.scale = scale;
        spriteGroup.add(sprite);
      }
    }
  
    handleElements() {
      form.hide();
      form.titleImg.position(40, 50);
      form.titleImg.class("gameTitleAfterEffect");
  
      //C39
      this.resetTitle.html("Reset Game");
      this.resetTitle.class("resetText");
      this.resetTitle.position(width / 2 + 200, 40);
  
      this.resetButton.class("resetButton");
      this.resetButton.position(width / 2 + 230, 100);
  
      this.leadeboardTitle.html("Leaderboard");
      this.leadeboardTitle.class("resetText");
      this.leadeboardTitle.position(width / 3 - 60, 40);
  
      this.leader1.class("leadersText");
      this.leader1.position(width / 3 - 50, 80);
  
      this.leader2.class("leadersText");
      this.leader2.position(width / 3 - 50, 130);
    }
  
    play() {
      this.handleElements();
      this.handleResetButton();
  
      Player.getPlayersInfo();
      player.getAnimalsAtEnd();
  
      if (allPlayers !== undefined) {
        image(track, 0, -height * 5, width, height * 6);
  

        this.showLife();
        this.showLeaderboard();
  
        //index of the array
        var index = 0;
        for (var plr in allPlayers) {
          //add 1 to the index for every loop
          index = index + 1;
  
          //use data form the database to display the  in x and y direction
          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;
  
          var currentlife = allPlayers[plr].life;
  
          if (currentlife <= 0) {
            animals[index - 1].changeImage("blast");
            animals[index - 1].scale = 0.3;
          }
  
          animals[index - 1].position.x = x;
          animals[index - 1].position.y = y;
  
          if (index === player.index) {
            stroke(10);
            fill("red");
            ellipse(x, y, 60, 60);
  
            
            this.handlePowerCoins(index);
            this.handleObstacleCollision(index);
  
            if (player.life <= 0) {
              this.blast = true;
              this.playerMoving = false;
            }
  
            // Changing camera position in y direction
            camera.position.y = animals[index - 1].position.y;
          }
        }
  
        if (this.playerMoving) {
          player.positionY += 5;
          player.update();
        }
  
        // handling keyboard events
        this.handlePlayerControls();
  
        // Finshing Line
        const finshLine = height * 6 - 100;
  
        if (player.positionY > finshLine) {
          gameState = 2;
          player.rank += 1;
          Player.updateAnimalsAtEnd(player.rank);
          player.update();
          this.showRank();
        }
  
        drawSprites();
      }
    }
  
    handleResetButton() {
      this.resetButton.mousePressed(() => {
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {},
          animalsAtEnd: 0
        });
        window.location.reload();
      });
    }
  
    showLife() {
      push();
      image(lifeImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
      fill("white");
      rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
      fill("#f50057");
      rect(width / 2 - 100, height - player.positionY - 350, player.life, 20);
      noStroke();
      pop();
    }

  
    showLeaderboard() {
      var leader1, leader2;
      var players = Object.values(allPlayers);
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        // &emsp;    This tag is used for displaying four spaces.
        leader1 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
  
        leader2 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
      }
  
      if (players[1].rank === 1) {
        leader1 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
  
        leader2 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
      }
  
      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }
  
    handlePlayerControls() {
      if (!this.blast) {
        if (keyIsDown(UP_ARROW)) {
          this.playerMoving = true;
          player.positionY += 10;
          player.update();
        }
  
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
          this.leftKeyActive = true;
          player.positionX -= 5;
          player.update();
        }
  
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
          this.leftKeyActive = false;
          player.positionX += 5;
          player.update();
        }
      }
    }
  
  
    handlePowerCoins(index) {
        animals[index - 1].overlap(powerCoins, function(collector, collected) {
        player.score += 21;
        player.update();
        //collected is the sprite in the group collectibles that triggered
        //the event
        collected.remove();
      });
    }
  
    handleObstacleCollision(index) {
      if (animals[index - 1].collide(obstacles)) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
  
        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
  
        player.update();
      }
    }
  
    showRank() {
      swal({
        title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
        text: "You reached the finish line successfully",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
    }
  
    gameOver() {
      swal({
        title: `Game Over`,
        text: "Oops you lost the race....!!!",
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        imageSize: "100x100",
        confirmButtonText: "Thanks For Playing"
      });
    }
  
    end() {
      console.log("Game Over");
    }
  }
  