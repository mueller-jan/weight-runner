'use strict';

Runner.Game = function () {
    console.log('init');
    this.spawnPositionX = null;
};

Runner.Game.prototype = {
    create: function () {
        // Welt-Grenzen setzen
        this.game.world.bounds = new Phaser.Rectangle(-100, 0, this.game.width + 300, this.game.height);

        //Phsysik-System starten
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 600;

        this.spawnPositionX = this.game.width + 64;

        //Mittelgrund und Hintergrund
        this.midground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-100,0);

        this.background = this.game.add.tileSprite(0,0,this.game.width, 512, 'background');
        this.background.autoScroll(-100,0);

        //Boden
        this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-200,0);

        this.game.physics.arcade.enableBody(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        //Gruppen erzeugen
        this.items = this.game.add.group();
        this.obstacles = this.game.add.group();

        //Player
        this.player = this.game.add.sprite(32, this.game.height - 85 - 100, 'player');

        //this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.play('right', 8, true);

        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;

        //Erzeugungs-Loops
        this.itemGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateItems, this);
        this.itemGenerator.timer.start();

        this.obstacleGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.generateObstacles, this);
        this.obstacleGenerator.timer.start();

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        // Geschwindigkeit zur�cksetzen
        this.player.body.velocity.x = 0;

        this.game.physics.arcade.collide(this.player, this.ground);
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

        //springen - nur m�glich, wenn der Spieler den Boden ber�hrt
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -250;
        }
    },

    obstacleHit: function() {
        //player soll weiter rennen, wenn er ein Hindernis ber�hrt
        this.player.body.velocity.x = 200;
    },

    dispose: function() {
        console.log('disposing scene');

        this.itemGenerator.timer.destroy();
        this.obstacleGenerator.timer.destroy();
    },

    generateItems: function() {
        this.createItem();
    },

    createItem: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || this.game.rnd.integerInRange(this.game.world.height - this.ground.height, this.game.world.height - 192);

        var item = this.items.getFirstExists(false);
        if (!item) {
            item = new Item(this.game, 0, 0, 'burger');
            this.items.add(item);
        }
        item.reset(x, y);
        item.revive();
        return item;
    },

    generateObstacles: function() {
        this.createObstacle();
    },

    createObstacle: function(x, y) {
        x = x || this.spawnPositionX;
        y = y || this.game.world.height - 90;

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