'use strict';

Runner.Game = function () {
    console.log('init');
};

Runner.Game.prototype = {
    create: function () {
        // Welt-Grenzen setzen
        this.game.world.bounds = new Phaser.Rectangle(-100, 0, this.game.width + 300, this.game.height);

        //Phsysik-System starten
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 600;

        this.spawnPositionX = this.game.width + 64;

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

        //Gruppen erzeugen
        this.goodItems = this.game.add.group();
        this.badItems = this.game.add.group();
        this.obstacles = this.game.add.group();

        //Player
        this.player = new Player(this.game, 32, this.game.height - 120);
        this.game.world.add(this.player);

        //Loops zum Erzeugen von Items und Hindernissen
        this.itemGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateItems, this);
        this.itemGenerator.timer.start();

        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.generateObstacles, this);
        this.obstacleGenerator.timer.start();

        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Aktuelles Gewicht und Zielgewicht
        this.weight = 200;
        this.maxWeight = this.weight;
        this.goal = 150;

        //Score und vorheriger Score (ben�tigt f�r die Gewichtsz�hlung)
        this.score = 15;
        this.previousScore = 0;

        //Je nach StartScore wird das Startgewicht aus der Differenz von maxWeight und goal berechnet
        this.calculateWeight();

        //Weighttext
        var style = { font: "20px Arial", fill: "#fff", align: "center" };
        this.weightText = this.game.add.text(30, 30, "weight: " + this.weight + " Goal: " + this.goal, style);


    },

    update: function () {
        // Geschwindigkeit zur�cksetzen
        this.player.zero();

        //Kollisionen
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.overlap(this.player, this.goodItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.badItems, this.itemHit, null, this);
        this.game.physics.arcade.collide(this.player, this.obstacles, this.obstacleHit, null, this);


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
    },

    obstacleHit: function() {
        //player soll weiter rennen, wenn er ein Hindernis ber�hrt
        this.player.moveRight();
    },

    itemHit: function(player, item) {
        item.kill();

        //Der Score wird je nach Item hoch oder runtergez�hlt
        this.score += item.scoreValue;

        //Score soll 100 nicht �berschreiten
        if(this.score >= 100){
            this.score = 100;
        }

        if(this.score <= 0){
            this.score = 0;
        }

        //Score wird in Gewicht umgerechnet f�r das Scoreboard
        this.calculateWeight();

        this.weightText.text = "weight: " + this.weight + " goal: " + this.goal;
        console.log(this.score);

        if(this.scoreReached()){

            this.weightText.text = "weight: " + this.weight + " goal: " + this.goal + " immer weiter so du Tier!";
        }

        if(this.gameOver()){
            this.weightText.text = "weight: " + this.weight + " goal: " + this.goal + " fauler Sack!";
        }
    },

    dispose: function() {
        console.log('disposing scene');

        this.itemGenerator.timer.destroy();
        this.obstacleGenerator.timer.destroy();
    },

    generateItems: function() {
        //1 zu 3 Chance auf schlechtes Item
        var r = Math.floor(Math.random() * 3);
        var isGood = r != 1;
        console.log(isGood);
        this.createItem(0,0, isGood);

    },

    createItem: function(x, y, isGood) {
        x = x || this.spawnPositionX;
        y = y || this.game.rnd.integerInRange(this.game.world.height - 120, this.game.world.height - 192);

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

    createItemGroup: function(columns, rows) {

    },

    generateObstacles: function() {
        this.createObstacle();
    },

    createObstacle: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || this.game.world.height - 90;

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

    render: function() {
       // this.game.debug.body(this.ground);
    },

    calculateWeight: function(){

        //Faktor zwischen Weight und Score errechnen
        var weightDifference = this.maxWeight - this.goal;
        var multiples = 100/weightDifference;

        //Gewicht abh�ngig von der Scorever�nderung hoch- bzw. runterz�hlen
        while(this.previousScore <= this.score - multiples){
            this.weight -= 1;
            this.previousScore += multiples;
        }

        while(this.previousScore >= this.score + multiples){
            this.weight += 1;
            this.previousScore -= multiples;
        }

    },

    scoreReached: function(){
        //�berpr�fen ob das Scorelimit erreich wurde
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