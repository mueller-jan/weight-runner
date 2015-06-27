'use strict';

Runner.Game = function () {
    console.log('init');
};

Runner.Game.prototype = {
    create: function () {
        this.levelData = JSON.parse(this.game.cache.getText('level'));

        if (!this.levelData) {
            //wenn kein Level geladen werden kann, Level zufällig generieren
            //Loops zum zufälligen Erzeugen von Items und Hindernissen
            this.itemGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateItems, this);
            this.itemGenerator.timer.start();

            this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.generateObstacles, this);
            this.obstacleGenerator.timer.start();
        } else {
            this.currentLevelStep = 0;
            //Level aus JSON-Datei lesen
            this.levelGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.generateLevel, this);
            this.levelGenerator.timer.start();
        }

        this.spawnPositionX = this.game.width + 64;
        this.itemSpacingX = 10;
        this.itemSpacingY = 10;

        // Welt-Grenzen setzen
        this.game.world.bounds = new Phaser.Rectangle(-100, 0, this.game.width + 300, this.game.height);

        //Phsysik-System starten
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 600;

        //Hintergrund
        this.background = this.game.add.tileSprite(0,0,this.game.width, 512, 'background');
        this.background.autoScroll(-100,0);

        //Mittelgrund
        this.midground = this.game.add.tileSprite(0, 420, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-150,0);

        //Vordergrund
        this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-200,0);

        this.game.physics.arcade.enableBody(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        //Gamesound
        this.goodItemSound = this.game.add.audio('collectGoodItem');
        this.badItemSound = this.game.add.audio('collectBadItem');
        this.obstacleDestroySound = this.game.add.audio('obstacleDestroy');

        //Gruppen erzeugen
        this.goodItems = this.game.add.group();
        this.badItems = this.game.add.group();
        this.obstacles = this.game.add.group();
        this.explosions = this.game.add.group();
        this.enemies = this.game.add.group();

        //Player
        this.humanPlayer = new HumanPlayer(this.game, 32, this.game.height - 170);
        this.game.world.add(this.humanPlayer);

        //left wall
        this.leftWall = this.game.add.sprite(0, 0, 'wall');
        this.game.physics.arcade.enableBody(this.leftWall);
        this.leftWall.body.allowGravity = false;
        this.leftWall.visible = false;

        //right wall
        this.rightWall = this.game.add.sprite(800, 0, 'wall');
        this.game.physics.arcade.enableBody(this.rightWall);
        this.rightWall.body.allowGravity = false;
        this.rightWall.body.immovable = true;
        this.rightWall.visible = false;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Aktuelles Gewicht und Zielgewicht
        this.weight = 200;
        this.maxWeight = this.weight;
        this.goal = 150;

        //Score und vorheriger Score (benötigt für die Gewichtszählung)
        this.score = 15;
        this.previousScore = 0;

        //Je nach StartScore wird das Startgewicht aus der Differenz von maxWeight und goal berechnet
        this.calculateWeight();

        //Weighttext
        var style = { font: "20px Arial", fill: "#fff", align: "center" };
        this.weightText = this.game.add.text(30, 30, "weight: " + this.weight + " Goal: " + this.goal, style);

        //Scoreboard
        this.scoreboard = new Scoreboard(this.game);
    },

    update: function () {
        //Kollisionen und Bewegung für Gegner
        this.handleEnemyCollisions();
        this.handleEnemyMovement();

        //Kollisionen und Bewegung für Spieler
        if (!this.isLevelEndReached() && this.humanPlayer.alive) {
            this.handlePlayerCollisions();
            this.handlePlayerMovement();
        } else {
            this.stopMovement();
        }

        if (this.isLevelEndReached()) {
            if (!this.scoreboard.isShown) {
                this.disablePlayer();
                this.showScoreboard();
            }
        }
    },

    handleEnemyCollisions: function() {
        this.game.physics.arcade.collide(this.enemies, this.ground);

        this.enemies.forEachAlive(function(enemy) {
            if (!this.game.physics.arcade.collide(enemy, this.obstacles, this.obstacleHit, null, this)) {
                enemy.baseSpeed = 0;
            }
        }, this);

    },

    handlePlayerCollisions: function() {
        this.game.physics.arcade.collide(this.humanPlayer, this.enemies, this.enemyHit, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.ground, this.groundHit, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.rightWall);
        this.game.physics.arcade.overlap(this.humanPlayer, this.goodItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.humanPlayer, this.badItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.humanPlayer, this.leftWall, this.enemyHit, null, this);

        if (!this.game.physics.arcade.collide(this.humanPlayer, this.obstacles, this.obstacleHit, null, this)) {
            this.humanPlayer.baseSpeed = 0;
        }
    },

    handleEnemyMovement: function() {
        this.enemies.forEachAlive(function(enemy) {
            enemy.moveLeft();

            //Gegner sollen zufällig springen
            var r = this.game.rnd.integer() % 100;
            if (r === 1)
                enemy.jump();
        }, this);
    },

    handlePlayerMovement: function() {
        // Geschwindigkeit zurücksetzen
        this.humanPlayer.resetSpeed();

        if (this.cursors.left.isDown) {
            this.humanPlayer.moveLeft();
        }
        else if (this.cursors.right.isDown) {
            this.humanPlayer.moveRight();
        }

        if (this.cursors.up.isDown) {
            this.humanPlayer.jump();
        }
        else if (this.cursors.down.isDown) {
            this.humanPlayer.roll();
        }
    },

    enemyHit: function(player, item) {
        console.log('enemy hit');
        this.disablePlayer();
        var deathTween = this.game.add.tween(player).to({x: player.x - 90, y: 560, angle: -90}, 300, Phaser.Easing.Circular.Out, true);
        deathTween.onComplete.add(this.showScoreboard, this);
        this.stopMovement();
    },

    groundHit: function(player, ground) {

    },

    obstacleHit: function(player, obstacle) {
        //Player soll weiter rennen, wenn er sich auf dem Hindernis befindet
        //deshalb wird die negative Geschwindigkeit des Hindernisses auf die Player-Geschwindigkeit addiert
        player.baseSpeed = -obstacle.body.velocity.x;
        if (player.isRolling) {
            obstacle.kill();
            this.obstacleDestroySound.play('', 0, 0.3, false);
            this.createExplosion(obstacle.x, obstacle.y, 'explosion');
        }
    },

    itemHit: function(player, item) {
        item.kill();
        //Der Score wird je nach Item hoch oder runtergezählt
        this.score += item.scoreValue;

        //Score soll 100 nicht überschreiten
        if(this.score >= 100){
            this.score = 100;
        }

        if(this.score <= 0){
            this.score = 0;
        }

        //Score wird in Gewicht umgerechnet für das Scoreboard
        this.calculateWeight();

        //Gewicht wird auf dem Weightboard angezeigt
        this.weightText.text = "weight: " + this.weight + " goal: " + this.goal;
        console.log(this.score);

        //Überprüft ob "Gewonnen" oder "GameOver"
        if(this.scoreReached()){

            this.weightText.text = "weight: " + this.weight + " goal: " + this.goal + " immer weiter so du Tier!";
        }

        if(this.gameOver()){
            this.weightText.text = "weight: " + this.weight + " goal: " + this.goal + " fauler Sack!";
        }

        //Sound und Animationen für good/badItem
        if(item instanceof GoodItem){
            if(!this.goodItemSound.isPlaying)
                this.goodItemSound.play('', 0, 0.3, false);

            this.createExplosion(item.x, item.y, 'sparkle');
        } else {
            if(!this.badItemSound.isPlaying)
                this.badItemSound.play('', 0, 0.5, false);

            this.createExplosion(item.x, item.y, 'red_sparkle');
        }
    },

    dispose: function() {
        console.log('disposing scene');

        this.itemGenerator.timer.destroy();
        this.obstacleGenerator.timer.destroy();
        this.levelGenerator.timer.destroy();
    },

    generateLevel: function() {
        if (this.currentLevelStep < this.levelData.objectData.length) {
            var currentElement = this.levelData.objectData[this.currentLevelStep];
            for (var i = 0; i < currentElement.length; i++) {
                switch (currentElement[i].type) {
                    case 0:
                        this.createObstacle(this.spawnPositionX, currentElement[i].y);
                        break;
                    case 1:
                        this.createItem(this.spawnPositionX, currentElement[i].y, true);
                        break;
                    case 2:
                        this.createItem(this.spawnPositionX, currentElement[i].y, false);
                        break;
                    case 3:
                        this.createEnemy(this.spawnPositionX, currentElement[i].y);
                        break;
                    case 4:
                        this.createGoalFlag(this.spawnPositionX, currentElement[i].y);
                        break;
                    default:
                        this.createObstacle(this.spawnPositionX, currentElement[i].y);
                }
            }
        }
        this.currentLevelStep++;
    },

    generateItems: function() {
        //1 zu 3 Chance auf schlechtes Item
        var r = this.game.rnd.integer() % 3;
        var isGood = r != 1;

        if(!this.previousItemType || this.previousItemType < 3) {
            var itemType = this.game.rnd.integer() % 5;
            switch(itemType) {
                case 0:
                    //kein Item wird erzeugt
                    break;
                case 1:
                case 2:
                    //bei 1 oder 2 wird ein einzelnes Item erzeugt
                    this.createItem(null, null, isGood);
                    break;
                case 3:
                    //eine kleine Gruppe von Items erzeugen
                    this.createItemGroup(2, 2, isGood);
                    break;
                case 4:
                    //große Gruppe von Items erzeugen
                    this.createItemGroup(6, 2, isGood);
                    break;
                default:
                    this.previousItemType = 0;
                    break;
            }
            this.previousItemType = itemType;
        } else {
            if (this.previousItemType === 4) {
                // die vorige Gruppe war groß,
                // nächsten 2 Erzeugungen sollen übersprungen werden
                this.previousItemType = 3;
            } else {
                this.previousItemType = 0;
            }
        }
    },

    createItem: function(x, y, isGood) {
        x = x || this.spawnPositionX;
        y = y || this.game.rnd.integerInRange(this.game.world.height - 140, this.game.world.height - 192);

        var items = isGood ? this.goodItems : this.badItems;

        //Items recyclen
        var item = items.getFirstExists(false);
        if (!item) {
            item = isGood ? new GoodItem(this.game, 0, 0) : new BadItem(this.game, 0, 0);
            items.add(item);
        }
        item.reset(x, y);
        item.revive();
        return item;
    },

    createItemGroup: function(columns, rows, isGood) {
        var itemSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
        var itemRowCounter = 0;
        var itemColumnCounter = 0;
        var item;
        for(var i = 0; i < columns * rows; i++) {
            item = this.createItem(this.spawnPositionX, itemSpawnY, isGood);
            item.x = item.x + (itemColumnCounter * item.width) + (itemColumnCounter * this.itemSpacingX);
            item.y = item.y + (itemRowCounter * item.height) + (itemRowCounter * this.itemSpacingY);
            itemColumnCounter++;
            if(i+1 >= columns && (i+1) % columns === 0) {
                itemRowCounter++;
                itemColumnCounter = 0;
            }
        }
    },

    generateObstacles: function() {
        //1 zu 2 Chance, dass ein Hindernis erzeugt wird
        var r = this.game.rnd.integer() % 2;
        if (r == 1) {
            this.createObstacle();
        }
    },

    createObstacle: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || this.game.rnd.integerInRange(this.game.world.height - 100, this.game.world.height - 192);

        //Obstacles recyclen
        var obstacle = this.obstacles.getFirstExists(false);
        if (!obstacle) {
            obstacle = new Obstacle(this.game, 0, 0, 'box');
            this.obstacles.add(obstacle);
        }
        obstacle.reset(x, y);
        obstacle.revive();
        return obstacle;
    },

    createObstacleGroup: function(columns, rows) {

    },

    createEnemy: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || 400;

        //Obstacles recyclen
        var enemy = this.enemies.getFirstExists(false);
        if (!enemy) {
            enemy = new EnemyPlayer(this.game, 0, 0);
            this.enemies.add(enemy);
        }
        enemy.reset(x, y);
        enemy.revive();
        return enemy;
    },

    createGoalFlag: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || 200;
        this.goalFlag = new GoalFlag(this.game, x, y);
        this.game.world.add(this.goalFlag);
    },

    createExplosion: function(x, y, type) {
        var explosion = this.explosions.getFirstExists(false);
        if (!explosion) {
            explosion = this.explosions.add(new Explosion(this.game, 0, 0, type));
        }

        if (!explosion.animations.isPlaying) {
            explosion.x = x;
            explosion.y = y;
            explosion.animations.play('explode');
        }
    },

    render: function() {
        //this.game.debug.body(this.humanPlayer);
    },

    calculateWeight: function(){
        //Faktor zwischen Weight und Score errechnen
        var weightDifference = this.maxWeight - this.goal;
        var multiples = 100/weightDifference;

        //Gewicht abhängig von der Scoreveränderung hoch- bzw. runterzählen
        while(this.previousScore <= this.score - multiples){
            this.weight -= 1;
            this.previousScore += multiples;
        }

        while(this.previousScore >= this.score + multiples){
            this.weight += 1;
            this.previousScore -= multiples;
        }

    },

    isLevelEndReached: function() {
        return this.goalFlag && (this.humanPlayer.x > this.goalFlag.x + 20);
    },

    stopMovement: function() {
        this.enemies.setAll('body.velocity.x', 0);
        this.goodItems.setAll('body.velocity.x', 0);
        this.badItems.setAll('body.velocity.x', 0);
        this.obstacles.setAll('body.velocity.x', 0);

        this.levelGenerator.timer.stop();

        if (this.goalFlag) this.goalFlag.body.velocity = 0;

        this.humanPlayer.body.velocity.x = 0;
        this.humanPlayer.frame = 0;

        this.ground.stopScroll();
        this.midground.stopScroll();
        this.background.stopScroll();
    },

    disablePlayer: function() {
        this.humanPlayer.body.enabled = false;
        this.humanPlayer.alive = false;
        this.humanPlayer.body.moves = false;
        this.humanPlayer.animations.stop();
    },

    scoreReached: function(){
        //Überprüfen ob das Scorelimit erreich wurde
        var result = false;
        if(this.score == 100){
            result = true;
        }
        return result;
    },

    gameOver: function(){

        var result = false;
        if(this.score == 0){
            result = true;
        }
        return result;
    },

    showScoreboard: function() {
        this.scoreboard.show(this.score, this.isLevelEndReached(), this.scoreReached());
    }
};