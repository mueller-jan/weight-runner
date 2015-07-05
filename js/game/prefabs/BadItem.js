'use strict';
var BadItem = function(game, x, y) {
    Item.call(this, game, x, y, 'bad_items', 1);
    this.scoreValue = -1;
};

BadItem.prototype = Object.create(Item.prototype);
BadItem.prototype.constructor = BadItem;

