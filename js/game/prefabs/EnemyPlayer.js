'use strict';

var EnemyPlayer = function(game, x, y) {
    Player.call(this, game, x, y, 'enemy');

    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 15, false);
    this.animations.play('left');

    this.baseSpeed = 0;
    this.speedX = 250;
    this.speedY = 350;

    this.events.onRevived.add(this.onRevived, this);
}

EnemyPlayer.prototype = Object.create(Player.prototype);
EnemyPlayer.prototype.constructor = EnemyPlayer;

EnemyPlayer.prototype.onRevived = function() {
    this.animations.play('left', 10, true);
};

EnemyPlayer.prototype.jump = function() {
    //springen nur m�glich, wenn Spieler den Boden ber�hrt
    if (this.body.touching.down) {
        this.body.velocity.y = -this.speedY;
        Runner.enemyJump.play();
    }
}
