'use strict';

Runner.Game = function () {
    console.log('init');
    this.startingLevel = 1;
    this.backgroundName = 'backgroundFullStreet';
    this.midgroundName = 'midgroundFullStreet';
    this.groundName = 'groundStreet';
};

Runner.Game.prototype = {
    create: function () {
        // Level laden
        this.loadLevel('level_' + this.startingLevel);

        this.spawnPositionX = this.game.width + 64;

        // Welt-Grenzen setzen
        this.game.world.bounds = new Phaser.Rectangle(-100, 0, this.game.width + 300, this.game.height);

        //Phsysik-System starten
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 600;

        //Hintergrund
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, this.backgroundName);
        this.background.autoScroll(-100, 0);

        //Mittelgrund
        this.midground = this.game.add.tileSprite(0, 420, this.game.width, this.game.height - 85, this.midgroundName);
        this.midground.autoScroll(-150, 0);

        //Vordergrund
        this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, this.groundName);
        this.ground.autoScroll(-200, 0);

        this.game.physics.arcade.enableBody(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        //Gruppen erzeugen
        this.goodItems = this.game.add.group();
        this.badItems = this.game.add.group();
        this.destructableObstacles = this.game.add.group();
        this.obstacles = this.game.add.group();
        this.explosions = this.game.add.group();
        this.enemies = this.game.add.group();

        //Player
        this.humanPlayer = new HumanPlayer(this.game, 32, this.game.height - 170);
        this.game.world.add(this.humanPlayer);

        //left wall
        this.leftWall = this.game.add.sprite(-70, 0, 'wall');
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
        this.getLevelWeight();

        //Score und vorheriger Score (ben�tigt f�r die Gewichtsz�hlung)
        this.score = 10;
        this.previousScore = 0;

        //Je nach StartScore wird das Startgewicht aus der Differenz von maxWeight und goal berechnet
        this.calculateWeight();

        this.goalFlag = null;

        //WeightOMeter
        this.weightOMeterBackground = this.game.add.image(30, 47, 'weightOMeterBackground');
        this.weightOMeterBackground.anchor.y = 0.5;

        this.yellowWeightBar = new PositiveWeightBarYellow(this.game, 56, 46.5);
        this.game.world.add(this.yellowWeightBar);
        this.yellowWeightBar.createCropRectangle();

        this.positiveWeightBar = new PositiveWeightBar(this.game, 56, 46.5);
        this.game.world.add(this.positiveWeightBar);
        this.positiveWeightBar.createCropRectangle();

        this.negativeWeightBar = new NegativeWeightBar(this.game, 56, 46.5);
        this.game.world.add(this.negativeWeightBar);
        this.negativeWeightBar.createCropRectangle();


        this.start_goal_marker = this.game.add.image(30, 47, 'start_goal_marker');
        this.start_goal_marker.anchor.y = 0.5;

        var style = { font: "bold 17px Fredoka One", fill: "#fff", align: "center" , stroke: "#000", strokeThickness: 3};
        var headlineStyle = {font: "bold 20px Fredoka One", fill: "#fff", align: "center" , stroke: "#000", strokeThickness: 3};
        this.weightOMeterStart = this.game.add.text(38, 60, "Start", style);

        this.weightOMeterGoal = this.game.add.text(260, 60, "Goal", style);
        this.weightOMeterGoal.anchor.x = 0.5;

        this.weightOMeterHeadline = this.game.add.text(80, 10, "Weight-O-Meter", headlineStyle);
        this.weightText = this.game.add.text(115, 60, "weight: " + this.weight, style);

        //Level-Fortschritt-Text
        this.progressText = this.game.add.text(550, 20, 'Level-Progress: 0%', headlineStyle);
        //Anzeige des aktuellen Levels
        this.currentLevelText = this.game.add.text(550, 50, 'Level: ' + this.startingLevel, headlineStyle);

        Runner.backgroundMenu.stop();
        //Hintergrundmusik starten
        Runner.backgroundMusic.play();

        //Scoreboard
        this.scoreboard = new Scoreboard(this.game);

        var escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escapeKey.onDown.addOnce(this.backToMenu, this);

    },

    update: function () {
        this.humanPlayer.baseSpeed = 0;

        //Kollisionen und Bewegung f�r Gegner
        this.handleEnemyCollisions();
        this.handleEnemyMovement();

        //Kollisionen und Bewegung f�r Spieler
        if (!this.isLevelEndReached() && this.humanPlayer.alive) {
            this.handlePlayerCollisions();
            this.handlePlayerMovement();

        } else {
            this.stopMovement();
        }

        if (this.isLevelEndReached()) {
            if (!this.scoreboard.isShown) {
                this.disablePlayer();
                var goalTween = this.game.add.tween(this.goalFlag.scale).to({
                    x: 0,
                    y: 0
                }, 300, Phaser.Easing.Circular.Out, true);
                this.showScoreboard();
            }
        }
    },

    handleEnemyCollisions: function() {
        this.enemies.forEachAlive(function (enemy) {
            enemy.baseSpeed = 0;
        }, this);
        this.game.physics.arcade.collide(this.enemies, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.destructableObstacles, this.obstacleHit, null, this);
        this.game.physics.arcade.collide(this.enemies, this.obstacles, this.obstacleHit, null, this);
    },

    handlePlayerCollisions: function() {
        this.game.physics.arcade.collide(this.humanPlayer, this.enemies, this.killPlayer, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.ground, this.groundHit, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.rightWall);
        this.game.physics.arcade.overlap(this.humanPlayer, this.goodItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.humanPlayer, this.badItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.humanPlayer, this.leftWall, this.killPlayer, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.destructableObstacles, this.obstacleHit, null, this);
        this.game.physics.arcade.collide(this.humanPlayer, this.obstacles, this.obstacleHit, null, this);
    },


    handleEnemyMovement: function () {
        this.enemies.forEachAlive(function (enemy) {
            enemy.moveLeft();
            enemy.jump();
        }, this);
    },

    handlePlayerMovement: function () {
        // Geschwindigkeit zur�cksetzen
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

    killPlayer: function (player, item) {
        console.log('enemy hit');
        Runner.deathSound.play();
        this.disablePlayer();
        var deathTween = this.game.add.tween(player).to({
            x: player.x - 90,
            y: 560,
            angle: -90
        }, 300, Phaser.Easing.Circular.Out, true);
        if (this.goalFlag) {
            var hideFlagTween = this.game.add.tween(this.goalFlag.scale).to({
                x: 0,
                y: 0
            }, 300, Phaser.Easing.Circular.Out, true);
        }
        deathTween.onComplete.add(this.showScoreboard, this);
        this.stopMovement();
    },

    groundHit: function (player, ground) {

    },

    obstacleHit: function (player, obstacle) {
        //Player soll weiter rennen, wenn er sich auf dem Hindernis befindet
        //deshalb wird die Geschwindigkeit des Hindernisses von der Player-Geschwindigkeit abgezogen
        player.baseSpeed = -obstacle.body.velocity.x;
        if ((player.isRolling) && (obstacle.isDestructible)) {
            obstacle.kill();
            Runner.obstacleDestroy.play();
            this.createExplosion(obstacle.x, obstacle.y, 'explosion');
        }
    },

    itemHit: function (player, item) {
        item.kill();
        //Der Score wird je nach Item hoch oder runtergez�hlt
        this.score += item.scoreValue;

        //Score soll 100 nicht �berschreiten
        if (this.score >= 100) {
            this.score = 100;
        }

        if (this.score <= 0) {
            this.killPlayer(this.humanPlayer);
        }

        //Score wird in Gewicht umgerechnet f�r das Scoreboard
        this.calculateWeight();

        //Gewicht wird auf dem Weightboard angezeigt
        this.weightText.text = "weight: " + this.weight;
        console.log(this.score);

        //Je nach Score verschiebt sich das Weightboar positiv oder negativ
        if(this.score >= 10 && this.score < 90) {
            this.yellowWeightBar.updateWeight(this.score);
        }

        if(this.score >= 90){
            this.positiveWeightBar.updateWeight(this.score);
        }else{
            this.positiveWeightBar.resetWeightbar();
        }

        if(this.score <= 10){
            this.negativeWeightBar.updateWeight(this.score);
        }

        //Sound und Animationen f�r good/badItem
        if (item instanceof GoodItem) {
            if (!Runner.collectGoodItem.isPlaying)
                Runner.collectGoodItem.play();

            this.createExplosion(item.x, item.y, 'sparkle');
        } else {
            if (!Runner.collectBadItem.isPlaying)
                Runner.collectBadItem.play();

            this.createExplosion(item.x, item.y, 'red_sparkle');
        }
    },

    shutdown: function () {
        console.log('shutting down');
        this.levelGenerator.timer.destroy();
        Runner.backgroundMusic.stop();
    },

    generateLevel: function () {
        var levelLength = this.levelData.objectData.length;

        //Level-Fortschritt
        var progress = Math.floor(this.currentLevelStep / levelLength * 100);
        if (progress > 100) progress = 100;
        this.progressText.text = 'Level-Progress: ' + progress + '%';

        if (this.currentLevelStep < levelLength) {
            var currentElement = this.levelData.objectData[this.currentLevelStep];
            for (var i = 0; i < currentElement.length; i++) {
                switch (currentElement[i].type) {
                    case 0:
                        this.createObstacle(this.spawnPositionX, currentElement[i].y, true);
                        break;
                    case 1:
                        this.createObstacle(this.spawnPositionX, currentElement[i].y, false);
                        break;
                    case 2:
                        this.createItem(this.spawnPositionX, currentElement[i].y, true);
                        break;
                    case 3:
                        this.createItem(this.spawnPositionX, currentElement[i].y, false);
                        break;
                    case 4:
                        this.createEnemy(this.spawnPositionX, currentElement[i].y);
                        break;
                    case 5:
                        this.createGoalFlag(this.spawnPositionX, currentElement[i].y);
                        break;
                    default:
                        this.createObstacle(this.spawnPositionX, currentElement[i].y);
                }
            }
        }
        this.currentLevelStep++;
    },

    createItem: function (x, y, isGood) {
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

    createObstacle: function (x, y, isDestructible) {
        x = x || this.spawnPositionX;
        y = y || this.game.rnd.integerInRange(this.game.world.height - 100, this.game.world.height - 192);

        var obstacles = isDestructible ? this.destructableObstacles : this.obstacles;

        //Obstacles recyclen
        var obstacle = obstacles.getFirstExists(false);
        if (!obstacle) {
            obstacle = new Obstacle(this.game, 0, 0, isDestructible);
            obstacles.add(obstacle);
        }
        obstacle.reset(x, y);
        obstacle.revive();
        return obstacle;
    },

    createEnemy: function (x, y) {
        x = x || this.spawnPositionX;
        y = y || 400;

        //Obstacles recyclen
        var enemy = this.enemies.getFirstExists(false);
        if (!enemy) {
            enemy = new EnemyPlayer(this.game, 0, 0, 100);
            this.enemies.add(enemy);
        }
        enemy.reset(x, y);
        enemy.revive();
        return enemy;
    },

    createGoalFlag: function (x, y) {
        x = x || this.spawnPositionX;
        y = y || 200;
        this.goalFlag = new GoalFlag(this.game, x, y);
        this.goalFlag.anchor.setTo(0.5, 0.5);
        this.game.world.add(this.goalFlag);
    },

    createExplosion: function (x, y, type) {
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

    render: function () {
        //this.game.debug.body(this.humanPlayer);
    },

    calculateWeight: function () {
        //Faktor zwischen Weight und Score errechnen
        var weightDifference = this.maxWeight - this.goal;
        var multiples = 100 / weightDifference;

        //Gewicht abh�ngig von der Scorever�nderung hoch- bzw. runterz�hlen
        while (this.previousScore <= this.score - multiples) {
            this.weight -= 1;
            this.previousScore += multiples;
        }

        while (this.previousScore >= this.score + multiples) {
            this.weight += 1;
            this.previousScore -= multiples;
        }

    },

    isLevelEndReached: function () {
        return this.goalFlag && (this.humanPlayer.x > this.goalFlag.x + 20);
    },

    stopMovement: function () {
        this.enemies.setAll('body.velocity.x', 0);
        this.goodItems.setAll('body.velocity.x', 0);
        this.badItems.setAll('body.velocity.x', 0);
        this.obstacles.setAll('body.velocity.x', 0);
        this.destructableObstacles.setAll('body.velocity.x', 0);

        this.levelGenerator.timer.stop();

        if (this.goalFlag) this.goalFlag.body.velocity = 0;

        this.humanPlayer.body.velocity.x = 0;
        this.humanPlayer.frame = 0;

        this.ground.stopScroll();
        this.midground.stopScroll();
        this.background.stopScroll();
    },

    disablePlayer: function () {
        this.humanPlayer.body.enabled = false;
        this.humanPlayer.alive = false;
        this.humanPlayer.body.moves = false;
        this.humanPlayer.animations.stop();
    },

    scoreReached: function () {
        //�berpr�fen ob das Scorelimit erreich wurde
        var result = false;
        if (this.score >= 90) {
            result = true;
        }
        return result;
    },

    showScoreboard: function () {
        this.scoreboard.show(this.score, this.isLevelEndReached(), this.scoreReached(), this.startingLevel);
    },

    loadLevel : function(levelName){
        this.levelData = JSON.parse(this.game.cache.getText(levelName));
        this.currentLevelStep = 0;
        //Level aus JSON-Datei lesen
        this.levelGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 0.5, this.generateLevel, this);
        this.levelGenerator.timer.start();
    },

    backToMenu : function() {
        this.game.state.start('MainMenu', true, false);
    },

    getLevelWeight : function(){

        switch(this.startingLevel){

            case 1:
                this.weight = 165;
                this.maxWeight = this.weight;
                this.goal = 140;
                break;

            case 2:
                this.weight = 145;
                this.maxWeight = this.weight;
                this.goal = 120;
                break;

            case 3:
                this.weight = 125;
                this.maxWeight = this.weight;
                this.goal = 100;
                break;

            case 4:
                this.weight = 105;
                this.maxWeight = this.weight;
                this.goal = 80;
                break;

            default:
                this.weight = 160;
                this.maxWeight = this.weight;
                this.goal = 140;
        }


    }
};