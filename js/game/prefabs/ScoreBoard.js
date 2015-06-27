'use strict';

var Scoreboard = function(game) {
    Phaser.Group.call(this, game);
    this.isShown = false;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(weight, endReached, goalweightReached) {
    this.isShown = true;
    var bmd, badge, background, gameoverString, gameoverText, scoreText, highScoreText, newHighScoreText, startText;

    var style = { font: "20px Arial", fill: "#fff", align: "center" };

    bmd = this.game.add.bitmapData(this.game.width, this.game.height);
    bmd.ctx.fillStyle = '#000';
    bmd.ctx.fillRect(0,0, this.game.width, this.game.height);

    background = this.game.add.sprite(0,0, bmd);
    background.alpha = 0.5;

    this.add(background);


    if (endReached) {
        if (goalweightReached) {
            badge = this.game.add.sprite(0, 100, 'badge_level_completed');
        } else {
            gameoverString = 'Goal weight not reached.';
        }
        //var isNewHighScore = false;
        //var highscore = localStorage.getItem('highscore');
        //if(!highscore || highscore > weight) {
        //    isNewHighScore = true;
        //    highscore = weight;
        //    localStorage.setItem('highscore', highscore);
        //}
    } else {
        badge = this.game.add.sprite(0, 100, 'badge_level_failed');
        gameoverString = 'Level end not reached.';
    }

    //if(isNewHighScore) {
    //    newHighScoreText = this.game.add.text(0, 100, 'New best weight!', style);
    //    newHighScoreText.x = gameoverText.x + gameoverText.width + 40;
    //    newHighScoreText.angle = 45;
    //    this.add(newHighScoreText);
    //}
    //
    //scoreText = this.game.add.text(0, 200, 'Your reached a weight of: ' + weight, style);
    //scoreText.x = this.game.width / 2 - (scoreText.width / 2);
    //this.add(scoreText);
    //
    //highScoreText = this.game.add.text(0, 250, 'Your best weight: ' + highscore, style);
    //highScoreText.x = this.game.width / 2 - (highScoreText.width / 2);
    //this.add(highScoreText);

    badge.scale.set(0.5);
    badge.x =  this.game.width/2 - (badge.width / 2);
    this.add(badge);

    gameoverText = this.game.add.text(0, 450, gameoverString, style);
    gameoverText.x = this.game.width/2 - (gameoverText.width / 2);
    this.add(gameoverText);

    startText = this.game.add.text(0, 500, 'Tap to continue!', style);
    startText.x = this.game.width / 2 - (startText.width / 2);
    this.add(startText);

    this.y = this.game.height;

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

    this.game.input.onDown.addOnce(this.restart, this);

};

Scoreboard.prototype.restart = function() {
    this.game.state.start('Game', true, false);
};