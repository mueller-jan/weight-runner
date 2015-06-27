'use strict';
var HumanPlayer = function(game, x, y) {
    Player.call(this, game, x, y, 'player');

    this.animations.add('run', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 30, true);
    this.animations.add('roll', [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], 30, false);
    this.animations.play('run');

    this.scale.set(0.7);
    this.body.setSize(70, 140, 20, 0);

    this.rollSound = this.game.add.audio('roll');

    this.baseSpeed = 0;
    this.speedX = 150;
    this.speedY = 350;

    this.events.onAnimationComplete.add(function(){
        this.animations.play('run');
        this.isRolling = false;
    }, this);
};

HumanPlayer.prototype = Object.create(Player.prototype);
HumanPlayer.prototype.constructor = HumanPlayer;

HumanPlayer.prototype.roll = function() {
    this.animations.play("roll");
    this.isRolling = true;
    if(!this.rollSound.isPlaying)
        this.rollSound.play('', 0, 0.3, false);
};
