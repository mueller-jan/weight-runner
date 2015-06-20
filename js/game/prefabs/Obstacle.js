'use strict';
var Obstacle = function(game, x, y, key)
{
    //wenn ein kein key übergeben wurde, dann key auf setzen
    key = key || 'box';

    Phaser.Sprite.call(this, game, x, y, key);

    this.anchor.setTo(0.5, 0.5);
    this.scale.set(0.5);
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.events.onRevived.add(this.onRevived, this);
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.onRevived = function() {
    this.body.velocity.x = -200;
};