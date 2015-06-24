'use strict';

Runner.GameOver = function() {
};

Runner.GameOver.prototype = {
    create : function() {
        //Hintergrund
        this.background = this.game.add.tileSprite(0,0,this.game.width, 512, 'background');
        this.background.autoScroll(-100,0);

        //Mittelgrund
        this.midground = this.game.add.tileSprite(0, 420, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-150,0);

        //Vordergrund
        this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-200,0);

        //Player
        this.humanPlayer = new Player(this.game, 32, this.game.height - 120);
        this.game.world.add(this.humanPlayer);

        var style = { font: "65px Arial", fill: "#fff", align: "center" };
        this.gameOverText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Game Over", style);
        this.gameOverText.anchor.set(0.5);
    }
};