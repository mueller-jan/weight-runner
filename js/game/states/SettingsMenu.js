'use strict';

Runner.SettingsMenu = function () {
    this.background = null;
    this.humanPlayer = null;
    this.isSound = null;
    this.soundBtnText = null;
    this.soundBtnStartText = null;
};

Runner.SettingsMenu.prototype = {
    create: function () {
        //Hintergrund
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'backgroundFullStreet');
        this.background.autoScroll(-100, 0);

        //Mittelgrund
        this.midground = this.game.add.tileSprite(0, 420, this.game.width, this.game.height - 85, 'midgroundFullStreet');
        this.midground.autoScroll(-150, 0);

        //Vordergrund
        this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'groundStreet');
        this.ground.autoScroll(-200, 0);

        //Player
        this.humanPlayer = new HumanPlayer(this.game, 32, this.game.height - 170);
        this.humanPlayer.body.allowGravity = false;
        this.game.world.add(this.humanPlayer);

        // Header
        var header = this.add.text(this.game.width/2, this.game.height / 8, "Settings", {
            font: "bold 60px Fredoka One",
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 3
        });
        header.anchor.setTo(0.5, 0.5);

        //Soundbutton
        var btn = this.add.button(this.game.width / 2, 250, 'button', this.toggleSound, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.5);

        var state = this.isSound ? "ON" : "OFF";
        this.soundBtnStartText = "Sound is ";
        this.soundBtnText = this.add.text(this.game.width / 2, 250, this.soundBtnStartText + state, { font: "bold 22px Fredoka One", fill: "#FFF", stroke: "#000", strokeThickness: 3 });

        this.soundBtnText.anchor.setTo(0.5, 0.5);
        this.game.state.states['Game'].setSoundEnabled(this.isSound);

        // Backbutton
        this.addButton(this.game.width / 2, (this.game.height - this.game.height / 6), "Back", this.loadMainMenu, 'button')

    },

    addButton: function (x, y, text, callback, btnId) {
        var btn = this.add.button(x, y, btnId, callback, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.6);
        btn.name = text;

        var txt = this.add.text(x, y, text, { font: "bold 22px Fredoka One", fill: "#FFF", stroke: "#000", strokeThickness: 3 });
        txt.anchor.setTo(0.5, 0.5);
    },

    toggleSound: function () {
        this.isSound = !this.isSound;
        var state = this.isSound ? "ON" : "OFF";
        this.soundBtnText.setText(this.soundBtnStartText + state);
        this.game.state.states['Game'].setSoundEnabled(this.isSound);
        localStorage.setItem("weight_runner_is_sound_on", this.isSound);
        Runner.menuClick.play();
    },

    loadMainMenu: function () {
        this.state.start('MainMenu');
    },

    update: function () {
    }
};