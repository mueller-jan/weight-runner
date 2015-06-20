'use strict';
var GoalFlag = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'goal_flag');

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.body.velocity.x = -200;

};

GoalFlag.prototype = Object.create(Phaser.Sprite.prototype);
GoalFlag.constructor = GoalFlag;
