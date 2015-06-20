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

        //Player
        this.player = new Player(this.game, 32, this.game.height - 120);
        this.game.world.add(this.player);

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


    },

    update: function () {



            //Kollisionen
            this.game.physics.arcade.collide(this.player, this.ground);
            this.game.physics.arcade.overlap(this.player, this.goodItems, this.itemHit, null, this);
            this.game.physics.arcade.overlap(this.player, this.badItems, this.itemHit, null, this);
            this.game.physics.arcade.collide(this.player, this.obstacles, this.obstacleHit, null, this);

        if (!this.isGoalReached()) {

            // Geschwindigkeit zurücksetzen
            this.player.zero();

            if (this.cursors.left.isDown)
            {
                this.player.moveLeft();
            }
            else if (this.cursors.right.isDown)
            {
                this.player.moveRight();
            }

            if (this.cursors.up.isDown)
            {
                this.player.jump();
            }
            else if (this.cursors.down.isDown) {
                this.player.roll();
            }
        } else {
            this.stopMovement();
        }
    },

    obstacleHit: function(player, obstacle) {
        //player soll weiter rennen, wenn er ein Hindernis berührt
        if (player.isRolling) {
            obstacle.kill();
            this.obstacleDestroySound.play('', 0, 0.3, false);
            
            var explosion = this.explosions.getFirstExists(false);
            if (!explosion) {
                explosion = this.explosions.add(new Explosion(this.game, 0, 0));
            }


            if (!explosion.animations.isPlaying) {
                explosion.x = obstacle.x;
                explosion.y = obstacle.y;
                explosion.animations.play('explode');
            }
        }

        this.player.moveRight();
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

        //Sound für good/badItem
        if(item instanceof GoodItem){
            if(!this.goodItemSound.isPlaying)
            this.goodItemSound.play('', 0, 0.3, false);
        }

        if(item instanceof BadItem){
            if(!this.badItemSound.isPlaying)
            this.badItemSound.play('', 0, 0.5, false);
        }

    },

    dispose: function() {
        console.log('disposing scene');

        this.itemGenerator.timer.destroy();
        this.obstacleGenerator.timer.destroy();
        this.levelGenerator.timer.destroy();
    },

    generateLevel: function() {
        if (this.currentLevelStep < this.levelData.platformData.length) {
            var currentElement = this.levelData.platformData[this.currentLevelStep];
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

    createGoalFlag: function(x, y) {
        console.log('creategoaldflalkfjlsdjkfljsdlfajsd');
        x = x || this.spawnPositionX;
        y = y || 200;
        this.goalFlag = new GoalFlag(this.game, x, y);
        this.game.world.add(this.goalFlag);
    },

    render: function() {
       // this.game.debug.body(this.ground);
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

    isGoalReached: function() {
        return this.goalFlag && (this.player.x > this.goalFlag.x + 20);
    },

    stopMovement: function() {
        this.obstacles.forEachAlive(function(obstacle) {
            obstacle.body.velocity = 0;
            }, this);

        this.goodItems.forEachAlive(function(item) {
            item.body.velocity = 0;
        }, this);

        this.badItems.forEachAlive(function(item) {
            item.body.velocity = 0;
        }, this);

        this.goalFlag.body.velocity = 0;
        this.player.body.velocity.x = 0;
        this.player.frame = 0;

        this.ground.autoScroll(0,0);
        this.midground.autoScroll(0,0);
        this.background.autoScroll(0,0);
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
    }
};