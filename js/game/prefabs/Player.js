'use strict'
var Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.animations.play('right', 8, true);

    game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;

    this.speedX = 150;
    this.speedY = 350;
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
    if (this.body.touching.down)
        this.body.velocity.y = -this.speedY;
}

