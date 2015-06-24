'use strict';
var Explosion = function(game, x, y, key) {

    key = key || 'explosion';

    Phaser.Sprite.call(this, game, x, y, key);

    this.scale.set(0.5);
    this.anchor.setTo(0.5, 0.5);
    if (key === 'explosion') {
        this.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, false);
    } else {
        this.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 30, false);
    }

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

};

Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.constructor = Explosion;
