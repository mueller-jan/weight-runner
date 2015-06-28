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
        this.load.image('goal_flag', 'assets/images/goal_flag.png');
        this.load.image('wall', 'assets/images/wall.png');
        this.load.image('badge_level_completed', 'assets/images/badge_level_completed.png');
        this.load.image('badge_level_failed', 'assets/images/badge_level_failed.png');
        this.load.image('weightOMeterBackground', 'assets/images/weightOMeterBackground.png');

        this.load.image('button_level', 'assets/images/button_level.png');
        this.load.image('button_level', 'assets/images/button_level_locked.png');
        this.load.image('button', 'assets/images/button.png');

        this.load.spritesheet('good_items', 'assets/images/good_items.png', 48, 48);
        this.load.spritesheet('bad_items', 'assets/images/bad_items.png', 48, 48);
        this.load.spritesheet('player', 'assets/images/player.png', 118.75, 158.5);
        this.load.spritesheet('enemy', 'assets/images/enemy.png', 32, 32);
        this.load.spritesheet('explosion', 'assets/images/explosion.png', 200, 200);
        this.load.spritesheet('sparkle', 'assets/images/sparkle.png', 170, 170);
        this.load.spritesheet('red_sparkle', 'assets/images/red_sparkle.png', 170, 170);
        this.load.spritesheet('weightBar', 'assets/images/weightBar.png');

        //Audio laden
        this.load.audio('jump', 'assets/audio/jump2.wav');
        this.load.audio('collectBadItem', 'assets/audio/collectBadItem.wav');
        this.load.audio('collectGoodItem', 'assets/audio/collectGoodItem.wav');
        this.load.audio('death', 'assets/audio/death.wav');
        this.load.audio('hitEnemy', 'assets/audio/hitEnemy.wav');
        this.load.audio('menuClick', 'assets/audio/menuClick.wav');
        this.load.audio('obstacleDestroy', 'assets/audio/obstacleDestroy2.wav');
        this.load.audio('roll', 'assets/audio/roll.wav');

        // Sounds
        Runner.jumpSound = this.game.add.audio('jump');
        Runner.collectBadItem = this.game.add.audio('collectBadItem');
        Runner.collectGoodItem = this.game.add.audio('collectGoodItem');
        Runner.death = this.game.add.audio('death');
        Runner.hitEnemy = this.game.add.audio('hitEnemy');
        Runner.menuClick = this.game.add.audio('menuClick');
        Runner.obstacleDestroy = this.game.add.audio('obstacleDestroy');
        Runner.rollSound = this.game.add.audio('roll');

        Runner.maxVolumeJump = 0.5;
        Runner.maxVolumeCollectBadItem = 0.5;
        Runner.maxVolumeCollectGoodItem = 0.3;
        Runner.maxVolumeObstacleDestroy= 0.3;
        Runner.maxVolumeDeath= 0.5;
        Runner.maxVolumeHitEnemy= 0.5;
        Runner.maxVolumeMenuClick= 0.5;
        Runner.maxVolumeRoll = 0.3;

        this.load.text('level', 'assets/data/level.json');
        this.load.text('level_1', 'assets/data/level_1.json');
        this.load.text('level_2', 'assets/data/level_2.json');
        this.load.text('level_3', 'assets/data/level_3.json');
        this.load.text('level_4', 'assets/data/level_4.json');

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
