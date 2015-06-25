'use strict';

Runner.SettingsMenu = function () {
    this.background = null;
    this.humanPlayer = null;
    this.isSound = true;
    this.soundBtnText = " Sound is ";
};

Runner.SettingsMenu.prototype = {
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

        // Header
        var header = this.add.text(this.game.width/2, this.game.height / 5, "Settings", {
            font: "bold 90px Arial",
            fill: "#FF4136",
            stroke: "#FFFFFF",
            strokeThickness: 3
        });
        header.anchor.setTo(0.5, 0.5);

        //Soundbutton
        var btn = this.add.button(this.game.width / 2, 250, 'button', this.toggleSound, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.5);

        this.soundBtnText = this.add.text(this.game.width / 2, 250, this.soundBtnText + "ON", {
            font: "bold 36px Arial",
            fill: "#FF4136",
            stroke: "#FFFFFF",
            strokeThickness: 3
        });

        this.soundBtnText.anchor.setTo(0.5, 0.5);

        // Backbutton
        this.addButton(this.game.width / 2, (this.game.height - this.game.height / 6), "Back", this.loadMainMenu, 'button')


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

    toggleSound: function () {
        this.isSound = !this.isSound;
        var state = this.isSound ?  "ON" : "OFF";
        this.soundBtnText.setText("Sound is " + state);
    },

    loadMainMenu: function () {
        this.state.start('MainMenu');
    },

    update: function () {
    }
};