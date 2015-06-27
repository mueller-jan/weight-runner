'use strict';

var WeightOMeter = function(game, x, y, key){
    key = key || 'healthBar';
    Phaser.Sprite.call(this, game, x, y, key);
    this.cropEnabled = true;
    this.cropWidth = (score / 100) * this.width;
    this.scale.setTo(1);
};

WeightOMeter.prototype = Object.create(Phaser.Group.prototype);
WeightOMeter.prototype.constructor = WeightOMeter;

WeightOMeter.prototype.show = function(weight) {
    this.weightOMeter = this.game.add.image(30, 20, 'weightOMeter');
    var style = {font: "17px Arial", fill: "#000000", align: "center"};

    this.startWeightText = this.game.add.text(38, 10, "Start", style);
    this.weightText = this.game.add.text(115, 60, "weight: " + weight, style);
}

WeightOMeter.prototype.updateWeight = function(weight, score){
    this.weightText.text = "weight: " + weight;
    this.cropWidth = (score / 100) * this.healthBar.width;
    console.log(score);
}