var Scoreboard = function(game) {
    Phaser.Group.call(this, game);
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
    var bmd, background, gameoverText, scoreText, highScoreText, newHighScoreText, starText;

    var style = { font: "20px Arial", fill: "#fff", align: "center" };

    bmd = this.game.add.bitmapData(this.game.width, this.game.height);
    bmd.ctx.fillStyle = '#000';
    bmd.ctx.fillRect(0,0, this.game.width, this.game.height);

    background = this.game.add.sprite(0,0, bmd);
    background.alpha = 0.5;

    this.add(background);

    var isNewHighScore = false;
    var highscore = localStorage.getItem('highscore');
    if(!highscore || highscore < score) {
        isNewHighScore = true;
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }

    this.y = this.game.height;

    gameoverText = this.game.add.text(0, 100, "Gameover", style);
    gameoverText.x = this.game.width/2 - (gameoverText.textWidth / 2);
    this.add(gameoverText);

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

    this.game.input.onDown.addOnce(this.restart, this);

};

Scoreboard.prototype.restart = function() {
    this.game.state.start('Game', true, false);
};