'use strict';

var Scoreboard = function(game) {
    Phaser.Group.call(this, game);
    this.isShown = false;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(weight, endReached, goalweightReached, currentLevel) {
    this.isShown = true;
    this.levelComplete = endReached && goalweightReached;
    this.currentLevel = currentLevel;
    var bmd, badge, background, gameoverString, gameoverText, startText, lastLevel;

    var style = { font: "bold 20px Fredoka One", fill: "#fff", align: "center" , stroke: "#000", strokeThickness: 3};

    bmd = this.game.add.bitmapData(this.game.width, this.game.height);
    bmd.ctx.fillStyle = '#000';
    bmd.ctx.fillRect(0,0, this.game.width, this.game.height);

    background = this.game.add.sprite(0,0, bmd);
    background.alpha = 0.5;

    this.add(background);


    if (endReached) {
        if (goalweightReached) {
            badge = this.game.add.sprite(0, 100, 'badge_level_completed');
            lastLevel = parseInt(localStorage.getItem("weight_runner_last_level"));
            if (lastLevel === this.currentLevel) {
                localStorage.setItem("weight_runner_last_level", currentLevel + 1);
            }
        } else {
            badge = this.game.add.sprite(0, 100, 'badge_level_failed');
            gameoverString = 'Goal weight not reached.';
        }
    } else {
        badge = this.game.add.sprite(0, 100, 'badge_level_failed');
        gameoverString = 'Level end not reached.';
    }

    badge.scale.set(0.5);
    badge.x =  this.game.width/2 - (badge.width / 2);
    this.add(badge);

    gameoverText = this.game.add.text(0, 450, gameoverString, style);
    gameoverText.x = this.game.width/2 - (gameoverText.width / 2);
    this.add(gameoverText);

    startText = this.game.add.text(0, 500, 'Enter continue\nESC Main-Menu', style);
    startText.x = this.game.width / 2 - (startText.width / 2);
    this.add(startText);

    this.y = this.game.height;

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

    var enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.restart, this);

    var escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    escapeKey.onDown.addOnce(this.backToMenu, this);

};

Scoreboard.prototype.restart = function() {
    if (this.levelComplete && this.currentLevel < 4) {
        this.game.state.states['Game'].startingLevel = this.currentLevel + 1;
    }

    this.game.state.start('Game', true, false);
};

Scoreboard.prototype.backToMenu = function() {
    this.game.state.start('MainMenu', true, false);
};