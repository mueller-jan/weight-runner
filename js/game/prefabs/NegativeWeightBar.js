'use strict';

var NegativeWeightBar = function (game, x, y, key) {
    key = key || 'negativeWeightBar';
    Phaser.Sprite.call(this, game, x, y, key);

    this.anchor.y = 0.5;
    this.anchor.x = 1;

};

NegativeWeightBar.prototype = Object.create(Phaser.Sprite.prototype);
NegativeWeightBar.prototype.constructor = NegativeWeightBar;

NegativeWeightBar.prototype.createCropRectangle = function(){
    this.widthRectangle = new Phaser.Rectangle(0, 0, 0, this.height);
    this.cropEnabled = true;
    this.crop(this.widthRectangle);
}

NegativeWeightBar.prototype.updateWeight = function(score){

    var widthCalculate = (-1)*(((score-10)/100)*258);
    console.log(widthCalculate);
    this.widthRectangle.width = widthCalculate;

    this.crop(this.widthRectangle);

}