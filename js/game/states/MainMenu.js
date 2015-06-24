'use strict';

Runner.MainMenu = function() {
    this.background = null;
    this.humanPlayer = null;
    this.playButton = null;
};

Runner.MainMenu.prototype = {
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
        this.humanPlayer = new HumanPlayer(this.game, 32, this.game.height - 120);
        this.game.world.add(this.humanPlayer);

        var style = { font: "65px Arial", fill: "#fff", align: "center" };
        this.startText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Tap to start", style);
        this.startText.anchor.set(0.5);
    },

    update: function () {
        if(this.game.input.activePointer.justPressed()) {
            this.game.state.start('Game');
        }
    }

};