'use strict';

//globale Game-Klasse erzeugen
//enth�lt Variablen die erhalten bleiben sollen auch wenn sich der State �ndert
var Runner = function() {
    this.music = null;
};

Runner.Boot = function() {};

Runner.Boot.prototype = {
    preload: function() {
        //Assets laden, die f�r den Preloader ben�tigt werden
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },
    create: function() {
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
    }
};