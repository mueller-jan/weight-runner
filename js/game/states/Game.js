'use strict';

Runner.Game = function () {
    console.log('init');
    this.spawnPositionX = null;
    this.currentWeight = 0;
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
        this.player = this.game.add.sprite(32, this.game.height - 120, 'player');

        //this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.play('right', 8, true);

        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;

        //Loops zum Erzeugen von Items und Hindernissen
        this.itemGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateItems, this);
        this.itemGenerator.timer.start();

        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.generateObstacles, this);
        this.obstacleGenerator.timer.start();

        //Text
        var style = { font: "20px Arial", fill: "#fff", align: "center" };
        this.weightText = this.game.add.text(30, 30, "Weight: " + this.currentWeight, style);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        // Geschwindigkeit zurücksetzen
        this.player.body.velocity.x = 0;

        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.overlap(this.player, this.goodItems, this.itemHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.badItems, this.itemHit, null, this);
        this.game.physics.arcade.collide(this.player, this.obstacles, this.obstacleHit, null, this);


        if (this.cursors.left.isDown)
        {
            //nach links
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown)
        {
            //nach rechts
            this.player.body.velocity.x = 150;
        }

        //springen - nur möglich, wenn der Spieler den Boden berührt
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -350;
        }
    },

    obstacleHit: function() {
        //player soll weiter rennen, wenn er ein Hindernis berührt
        this.player.body.velocity.x = 200;
    },

    itemHit: function(player, item) {
        item.kill();
        this.currentWeight += item.weightValue;
        this.weightText.text = 'Weight: ' + this.currentWeight;
    },

    dispose: function() {
        console.log('disposing scene');

        this.goodItemGenerator.timer.destroy();
        this.obstacleGenerator.timer.destroy();
    },

    generateItems: function() {
        //1 zu 3 Chance auf gute Items
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
    }
};