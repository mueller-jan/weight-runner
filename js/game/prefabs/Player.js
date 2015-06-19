'use strict'
var Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.animations.add('run', [1, 2, 3, 4], 10, true);
    this.animations.add('roll', [5, 6, 7, 8], 15, false);
    this.animations.play('run');

    this.jumpSound = this.game.add.audio('jump');
    this.rollSound = this.game.add.audio('roll');

    game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;

    this.speedX = 150;
    this.speedY = 350;

    this.events.onAnimationComplete.add(function(){
        this.animations.play('run');
        this.isRolling = false;
    }, this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.zero = function() {
    this.body.velocity.x = 0;
}

Player.prototype.moveRight = function() {
    this.body.velocity.x = this.speedX;
}

Player.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speedX
}

Player.prototype.jump = function() {
    //springen nur möglich, wenn Spieler den Boden berührt
    if (this.body.touching.down) {
        this.body.velocity.y = -this.speedY;
        this.jumpSound.play('', 0, 0.5, false);
    }
}

Player.prototype.roll = function() {
        this.animations.play("roll");
        this.isRolling = true;
        if(!this.rollSound.isPlaying)
            this.rollSound.play('', 0, 0.3, false);
}