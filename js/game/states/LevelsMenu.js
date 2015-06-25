'use strict';

Runner.LevelsMenu = function () {
    this.background = null;
    this.humanPlayer = null;
    this.maxLevels = 4;
};

Runner.LevelsMenu.prototype = {
    create: function () {
        //Hintergrund
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-100, 0);

        //Mittelgrund
        this.midground = this.game.add.tileSprite(0, 420, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-150, 0);

        //Vordergrund
        this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
        this.ground.autoScroll(-200, 0);

        //Player
        this.humanPlayer = new HumanPlayer(this.game, 32, this.game.height - 120);
        this.game.world.add(this.humanPlayer);

        // Buttons
        var startY = 250;
        for (var i = 1; i <= this.maxLevels; i++) {

            if (i % 2 == 1) {
                this.addButton(this.game.width / 2 -40, startY, i, this.loadLevel, 'button_level')
            }
            else {
                this.addButton(this.game.width / 2 + 55, startY, i, this.loadLevel, 'button_level');
                startY += 85;
            }
        }

        // Header
        var header = this.add.text(this.game.width/2, this.game.height / 5, "Levels", {
            font: "bold 90px Arial",
            fill: "#FF4136",
            stroke: "#FFFFFF",
            strokeThickness: 3
        });
        header.anchor.setTo(0.5, 0.5);

        // Backbutton
        startY += 100;
        this.addButton(this.game.width / 2, startY, "Back", this.loadMainMenu, 'button')


    },

    addButton: function (x, y, text, callback, btnId) {
        var btn = this.add.button(x, y, btnId, callback, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.5);
        btn.name = text;

        var txt = this.add.text(x, y, text, {
            font: "bold 36px Arial",
            fill: "#FF4136",
            stroke: "#FFFFFF",
            strokeThickness: 3
        });
        txt.anchor.setTo(0.5, 0.5);
    },

    loadLevel: function (button) {
        console.log('Load level : ' + button.name);

    },

    loadMainMenu: function () {
        this.state.start('MainMenu');

    },

    update: function () {
    }

};