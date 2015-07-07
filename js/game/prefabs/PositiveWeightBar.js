'use strict';

var PositiveWeightBar = function (game, x, y, key) {
    key = key || 'positiveWeightBar';
    Phaser.Sprite.call(this, game, x, y, key);

    this.anchor.y = 0.5;

};

PositiveWeightBar.prototype = Object.create(Phaser.Sprite.prototype);
PositiveWeightBar.prototype.constructor = PositiveWeightBar;

PositiveWeightBar.prototype.createCropRectangle = function(){
    this.widthRectangle = new Phaser.Rectangle(0, 0, 0, this.height);
    this.cropEnabled = true;
    this.crop(this.widthRectangle);
}

PositiveWeightBar.prototype.updateWeight = function(score){
    
    var widthCalculate = ((score-10)/100)*258;

    this.widthRectangle.width = widthCalculate;

    this.crop(this.widthRectangle);

}

PositiveWeightBar.prototype.resetWeightbar = function(){
    this.widthRectangle.width = 0;

    this.crop(this.widthRectangle);
};