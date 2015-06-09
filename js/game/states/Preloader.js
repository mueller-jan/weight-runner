'use strict';

Runner.Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;
    this.ready = false;
};

Runner.Preloader.prototype = {
    preload: function () {
        //Ladebalken
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);

        //Ladebalken als PreloadSprite setzen
        this.load.setPreloadSprite(this.preloadBar);

        //Bilder laden
        this.load.image('background', 'assets/images/tiles/background_full.png');
        this.load.image('midground', 'assets/images/tiles/midground.png');
        this.load.image('ground', 'assets/images/tiles/ground.png');
        this.load.spritesheet('player', 'assets/images/player.png', 32, 48);

        //Audio laden
        //...

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    },

    create: function () {
        this.preloadBar.cropEnabled = false;
    },

    update: function() {
        //warten bis Sound decoded ist, bevor es zum MainMenu weitergeht
        //if (this.cache.isSoundDecoded('gameMusic') && this.ready == true)
            if (this.ready)
            {
                this.state.start('MainMenu');
            }
        },

    onLoadComplete: function() {
        this.ready = true;
    }
};
