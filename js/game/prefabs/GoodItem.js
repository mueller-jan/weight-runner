'use strict';
var GoodItem = function(game, x, y) {
    Item.call(this, game, x, y, 'good_items');
    this.weightValue = -0.5;
};

GoodItem.prototype = Object.create(Item.prototype);
GoodItem.prototype.constructor = GoodItem;
