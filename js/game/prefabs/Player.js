'use strict'
var Player = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    this.animations.add('run', [1, 2, 3, 4], 10, true);
    this.animations.add('roll', [5, 6, 7, 8], 10, false);
    this.animations.play('run');

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
    //springen nur m�glich, wenn Spieler den Boden ber�hrt
    if (this.body.touching.down)
        this.body.velocity.y = -this.speedY;
}

Player.prototype.roll = function() {
    //kann nur rollen, wenn er den Boden ber�hrt
    if (this.body.touching.down) {
        this.animations.play("roll");
        this.isRolling = true;
    }

}