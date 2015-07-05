'use strict';

Runner.MainMenu = function () {
    this.background = null;
    this.humanPlayer = null;
};

Runner.MainMenu.prototype = {
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
        var header = this.add.text(this.game.width / 2, this.game.height / 8, "Weight-Runner", {
            font: "bold 60px Fredoka One",
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 3
        });
        header.anchor.setTo(0.5, 0.5);

        this.addButton(this.game.width / 2, 200, 'Start new game', this.startGame);
        this.addButton(this.game.width / 2, 300, 'Load levels', this.loadLevelMenu);
        this.addButton(this.game.width / 2, 400, 'Settings', this.loadSettingsMenu);
        this.addButton(this.game.width / 2, 500, 'How to play', this.showIntroduction);

        var isOn = localStorage.getItem("weight_runner_is_sound_on") || 'true';
        this.game.sound.mute = (isOn != 'true');

        //Einführung
        this.introduction = new Introduction(this.game);
        //Hintergrundmusik starten
        Runner.backgroundMenu.play();
    },

    addButton: function (x, y, text, callback) {
        var btn = this.add.button(x, y, 'button', callback, this);
        btn.anchor.setTo(0.5, 0.5);
        btn.scale.setTo(0.6, 0.6);
        var txt = this.add.text(x, y, text, {
            font: "bold 22px Fredoka One",
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 3
        });
        txt.anchor.setTo(0.5, 0.5);
    },

    startGame: function () {
        if (!this.introduction.isShown) {
            Runner.menuClick.play();
            this.game.state.start('Game');
        }
    },

    loadLevelMenu: function () {
        if (!this.introduction.isShown) {
            Runner.menuClick.play();
            this.state.start('LevelsMenu');
        }
    },

    loadSettingsMenu: function () {
        if (!this.introduction.isShown) {
            Runner.menuClick.play();
            this.state.start('SettingsMenu');
        }
    },

    showIntroduction: function () {
        if (!this.introduction.isShown) {
            Runner.menuClick.play();
            this.introduction.show();
        }
    },

    update: function () {
    }

};