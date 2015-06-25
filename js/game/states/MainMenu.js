'use strict';

Runner.MainMenu = function() {
    this.background = null;
    this.humanPlayer = null;
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

        this.addButton(this.game.width/2, 200, 'Start new game', this.startGame);
        this.addButton(this.game.width/2, 300, 'Load levels', this.loadLevelMenu);
        this.addButton(this.game.width/2, 400, 'Settings', this.loadSettingsMenu);
    },

    addButton: function(x, y, text, callback) {
        var btn = this.add.button(x, y, 'button', callback, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.5);

        var txt = this.add.text(x, y, text, { font: "bold 36px Arial", fill: "#FF4136", stroke: "#FFFFFF", strokeThickness: 3 });
        txt.anchor.setTo(0.5, 0.5);
    },

    startGame: function() {
        this.game.state.start('Game');
    },

    loadLevelMenu: function() {
        this.state.start('LevelsMenu');
    },

    loadSettingsMenu: function() {
    },

    update: function () {
    }

};