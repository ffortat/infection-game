function Sheep(x, y, level) {
	Animator.call(this, x, y, level.container);

	var self = this;

	this.speed = 128; // pixels/second
	this.rateOfFire = 1; // shoots / second

	this.delayShoot = 1 / this.rateOfFire; // seconds
	this.timerShoot = 0;

	this.shotCount = 0;
	this.shotThreshold = 10;

	this.level = level;

	load.json('animations/sheep.json', function (data) {self.Init(data);});
}

Sheep.prototype = Object.create(Animator.prototype);
Sheep.prototype.constructor = Sheep;

Sheep.prototype.Collides = function (delta) {
	var direction = (this.speed / Math.abs(this.speed));

	var x = this.x + delta.x + direction * this.currentAnimation.width + 1;
	var y = this.y + delta.y + this.currentAnimation.height;
	var width = this.currentAnimation.width / 2;
	var height = this.currentAnimation.height;

	var collisions = this.level.Collides(x, y, width, height);

	if (collisions.collides) {
		collisions.colliders.forEach(function (collider) {
			if (this.y + this.currentAnimation.height > collider.y) {
				this.speed = -this.speed;
			}
		}, this);
	} else {
		this.speed = -this.speed;
	}

	return delta;
}

Sheep.prototype.Tick = function (length) {
	if (this.isLoaded) {
		var delta = {
			x : 0,
			y : 0
		}

		delta.x += this.speed * length;

		delta = this.Collides(delta);

		this.x += delta.x;
		this.y += delta.y;

		this.currentAnimation.position.x = this.x;
		this.currentAnimation.position.y = this.y;
	}
}