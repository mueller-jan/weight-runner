//globale Game-Klasse erzeugen
//enthält Variablen die erhalten bleiben sollen auch wenn sich der State ändert
var Runner = function() {
    this.music = null;
};

//function die den Bootstate enthält
Runner.Boot = function(game) {};

Runner.Boot.prototype = {
    preload: function() {
        //Assets laden, die für den Preloader benötigt werden
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },
    create: function() {
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
    }
};