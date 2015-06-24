'use strict';
var Player = function(game, x, y, key) {
    key = key || 'player';
    Phaser.Sprite.call(this, game, x, y, key);

    game.physics.arcade.enableBody(this);

    this.baseSpeed = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.jumpSound = this.game.add.audio('jump');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.resetSpeed = function() {
    this.body.velocity.x = this.baseSpeed;
};

Player.prototype.moveRight = function() {
    this.body.velocity.x = this.baseSpeed + this.speedX;
};

Player.prototype.moveLeft = function() {
    this.body.velocity.x = this.baseSpeed - this.speedX
};

Player.prototype.jump = function() {
    //springen nur m�glich, wenn Spieler den Boden ber�hrt
    if (this.body.touching.down) {
        this.body.velocity.y = -this.speedY;
        this.jumpSound.play('', 0, 0.5, false);
    }
};
