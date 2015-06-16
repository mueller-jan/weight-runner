'use strict';
var GoodItem = function(game, x, y) {
    Item.call(this, game, x, y, 'good_items');
    this.scoreValue = 5;
};

GoodItem.prototype = Object.create(Item.prototype);
GoodItem.prototype.constructor = GoodItem;
