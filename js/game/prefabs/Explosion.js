'use strict'
var Explosion = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'explosion');

    this.scale.set(0.4);
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, false);
    this.visible = false;
    this.events.onAnimationComplete.add(function(){
        this.visible = false;
    }, this);
    this.events.onAnimationStart.add(function() {
        this.visible = true;
    }, this);

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.body.velocity.x = -200;

}

Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.constructor = Explosion;
