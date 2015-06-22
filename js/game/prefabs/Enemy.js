'use strict';

var Enemy = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'enemy');

    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 15, false);
    this.animations.play('left');

    game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;

    this.speedX = 250;
    this.speedY = 350;

    this.events.onRevived.add(this.onRevived, this);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.onRevived = function() {
    this.body.velocity.x = -this.speedX;
    this.animations.play('left', 10, true);
};

Enemy.prototype.jumpRandomly = function() {
    //Gegner soll zufällig springen
    if (this.body.touching.down) {
        var r = this.game.rnd.integer() % 100;
        if (r == 1) {
            this.body.velocity.y = -this.speedY;
        }
    }
};