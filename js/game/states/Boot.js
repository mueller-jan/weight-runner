'use strict';

//globale Game-Klasse erzeugen
//enth�lt Variablen die erhalten bleiben sollen auch wenn sich der State �ndert
var Runner = function () {
    this.music = null;
    this.jumpSound = null;
    this.collectBadItem = null;
    this.collectGoodItem = null;
    this.death = null;
    this.hitEnemy = null;
    this.menuClick = null;
    this.obstacleDestroy = null;
    this.rollSound = null;

    this.maxVolumeJump = null;
    this.maxVolumeCollectBadItem = null;
    this.maxVolumeCollectGoodItem = null;
    this.maxVolumeObstacleDestroy= null;
    this.maxVolumeDeath= null;
    this.maxVolumeHitEnemy= null;
    this.maxVolumeMenuClick= null;
    this.maxVolumeRoll = null;
};

Runner.Boot = function () {
};

Runner.Boot.prototype = {
    preload: function () {
        //Assets laden, die f�r den Preloader ben�tigt werden
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },
    create: function () {
        //Multi-Touch muss nicht unterst�tzt werden
        this.input.maxPointers = 1;

        if (this.game.device.desktop) {
            //Einstellungen f�r Desktop
            this.scale.pageAlignHorizontally = true;
        } else {
            //Einstellungen f�r Mobile
        }
        //Preloader Assets wurden geladen, Game-Settings wurden gesetzt
        //der richtige Preloader kann gestartet werden
        this.state.start('Preloader');
    },
    getSounds: function () {
        return [this.jump, this.collectBadItem, this.collectBadItem, this.collectGoodItem, this.death, this.hitEnemy, this.menuClick, this.obstacleDestroy, this.roll];
    }
};