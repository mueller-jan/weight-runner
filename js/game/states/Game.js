'use strict';

Runner.Game = function (game) {
    console.log('init');
    this.player;
    this.ground;
};
var cursors;
Runner.Game.prototype = {
    create: function () {
        // Welt-Grenzen setzen
        this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width + 300, this.game.height);

        //Phsysik-System starten
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 400;

        //Mittelgrund und Hintergrund
        this.midground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-100,0);

        this.background = this.game.add.tileSprite(0,0,this.game.width, 512, 'background');
        this.background.autoScroll(-100,0);

        //Boden
        this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-400,0);

        this.game.physics.arcade.enableBody(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        //Player
        this.player = this.game.add.sprite(32, this.game.height - 85 - 100, 'player');

        //this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.play('right', 8, true);

        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        //funktioniert nicht
        this.game.physics.arcade.collide(this.player, this.ground);

        // Geschwindigkeit zur�cksetzen
        this.player.body.velocity.x = 0;

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
            this.player.body.velocity.y = -350;
        }
    },

    render: function() {
       // this.game.debug.body(this.ground);
    }
};