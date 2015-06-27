'use strict';

//globale Game-Klasse erzeugen
//enthält Variablen die erhalten bleiben sollen auch wenn sich der State ändert
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
        //Assets laden, die für den Preloader benötigt werden
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },
    create: function () {
        //Multi-Touch muss nicht unterstützt werden
        this.input.maxPointers = 1;

        if (this.game.device.desktop) {
            //Einstellungen für Desktop
            this.scale.pageAlignHorizontally = true;
        } else {
            //Einstellungen für Mobile
        }
        //Preloader Assets wurden geladen, Game-Settings wurden gesetzt
        //der richtige Preloader kann gestartet werden
        this.state.start('Preloader');
    },
    getSounds: function () {
        return [this.jump, this.collectBadItem, this.collectBadItem, this.collectGoodItem, this.death, this.hitEnemy, this.menuClick, this.obstacleDestroy, this.roll];
    }
};