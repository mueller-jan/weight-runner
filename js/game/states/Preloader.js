'use strict';

Runner.Preloader = function() {
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

        this.load.image('box', 'assets/images/box.png');

        this.load.spritesheet('good_item_collected', 'assets/images/good_item_collected.png', 128, 128);
        this.load.spritesheet('good_items', 'assets/images/good_items.png', 48, 48);
        this.load.spritesheet('bad_items', 'assets/images/bad_items.png', 48, 48);
        this.load.spritesheet('player', 'assets/images/player.png', 32, 48);
        this.load.spritesheet('explosion', 'assets/images/explosion.png', 200, 200);

        //Audio laden
        this.load.audio('jump', 'assets/audio/jump2.wav');
        this.load.audio('collectBadItem', 'assets/audio/collectBadItem.wav');
        this.load.audio('collectGoodItem', 'assets/audio/collectGoodItem.wav');
        this.load.audio('death', 'assets/audio/death.wav');
        this.load.audio('hitEnemy', 'assets/audio/hitEnemy.wav');
        this.load.audio('menuClick', 'assets/audio/menuClick.wav');
        this.load.audio('obstacleDestroy', 'assets/audio/obstacleDestroy2.wav');
        this.load.audio('roll', 'assets/audio/roll.wav');

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
