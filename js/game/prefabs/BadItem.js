'use strict';
var BadItem = function(game, x, y, frame)
{
    var child = this;
    this.prototype.call()

    Phaser.Sprite.call(this, game, x, y, 'cake');
};

BadItem.prototype = Object.create(Item.prototype);
BadItem.prototype.constructor = BadItem;

BadItem.prototype.onRevived = function() {
    this.body.velocity.x = -200;
}