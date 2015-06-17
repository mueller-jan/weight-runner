'use strict';
var Item = function(game, x, y, key, frame)
{
    key = key || 'good_items';
    frame = frame || 1;
    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enableBody(this);
    this.body.drag = 0;
    this.body.allowGravity = false;
    this.outOfBoundsKill = true;
    this.events.onRevived.add(this.onRevived, this);
    this.scoreValue = 0;
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.onRevived = function() {
    this.body.velocity.x = -200;
    var r = Math.floor(Math.random() * 2);
    this.frame = r;
}