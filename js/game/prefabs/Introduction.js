'use strict';

var Introduction = function(game) {
    Phaser.Group.call(this, game);
    this.isShown = false;
};

Introduction.prototype = Object.create(Phaser.Group.prototype);
Introduction.prototype.constructor = Scoreboard;

Introduction.prototype.show = function() {
    this.isShown = true;
    var introduction;

    introduction = this.game.add.sprite(0,0, 'introduction');

    this.add(introduction);
        this.y = this.game.height;

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

    this.game.input.onDown.addOnce(this.hide, this);

};

Introduction.prototype.hide = function() {
    this.game.add.tween(this).to({y: -1000}, 1000, Phaser.Easing.Bounce.Out, true);
};