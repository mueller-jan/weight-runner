'use strict';

Runner.MainMenu = function() {
    this.background = null;
    this.player = null;
    this.playButton = null;
};

Runner.MainMenu.prototype = {
    create : function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-100,0);

        this.midground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 85, 'midground');
        this.midground.autoScroll(-100,0);

        this.ground = this.game.add.tileSprite(0,this.game.height - 85, this.game.width, 85, 'ground');
        this.ground.autoScroll(-400,0);

        this.player = this.game.add.sprite(32, this.game.height - 85 - 48, 'player');
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.animations.play('right', 8, true);
       // this.game.add.tween(this.player).to({y: this.player.y - 16}, 500, Phaser.Easing.Linear.NONE, true, 0, 100, true);

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