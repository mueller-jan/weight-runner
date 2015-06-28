'use strict';

var WeightOMeter = function (game, x, y, key) {
    key = key || 'weightBar';
    Phaser.Group.call(this, game, x, y, key);

};

WeightOMeter.prototype = Object.create(Phaser.Group.prototype);
WeightOMeter.prototype.constructor = WeightOMeter;

WeightOMeter.prototype.showBackground = function(weight) {
    this.weightOMeterBackground = this.game.add.image(30, 20, 'weightOMeterBackground');
    var style = {font: "17px Arial", fill: "#000000", align: "center"};

    this.game.add.text(38, 10, "Start", style);
    this.weightText = this.game.add.text(115, 60, "weight: " + weight, style);
}

WeightOMeter.prototype.updateWeight = function(weight, score){
    this.weightText.text = "weight: " + weight;
    console.log(score);

}