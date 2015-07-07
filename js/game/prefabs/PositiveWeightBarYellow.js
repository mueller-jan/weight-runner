'use strict';

var PositiveWeightBarYellow = function (game, x, y, key) {
    key = key || 'yellowWeightBar';
    Phaser.Sprite.call(this, game, x, y, key);

    this.anchor.y = 0.5;

};

PositiveWeightBarYellow.prototype = Object.create(Phaser.Sprite.prototype);
PositiveWeightBarYellow.prototype.constructor = PositiveWeightBarYellow;

PositiveWeightBarYellow.prototype.createCropRectangle = function(){
    this.widthRectangle = new Phaser.Rectangle(0, 0, 0, this.height);
    this.cropEnabled = true;
    this.crop(this.widthRectangle);
}

PositiveWeightBarYellow.prototype.updateWeight = function(score){

    var widthCalculate = ((score-10)/100)*258;

    this.widthRectangle.width = widthCalculate;

    this.crop(this.widthRectangle);

}
