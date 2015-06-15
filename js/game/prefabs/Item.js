'use strict';
var Item = function(game, x, y, frame)
{
    //wenn ein kein key übergeben wurde, dann key auf setzen
    var key = 'burger';
    frame = frame || 0;

    Phaser.Sprite.call(this, game, x, y, key);

    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.events.onRevived.add(this.onRevived, this);
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.onRevived = function() {
    this.body.velocity.x = -200;
}