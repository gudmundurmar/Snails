// ======
// ROCKET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rocket(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
   // this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Rocket.prototype = new Entity();
    
// Initial, inheritable, default values
Rocket.prototype.power = 0;
Rocket.prototype.cx = 200;
Rocket.prototype.cy = 200;
Rocket.prototype.velX = 1;
Rocket.prototype.velY = 1;
Rocket.prototype.power = 1;

Rocket.prototype.height = null;
Rocket.prototype.width = null;

Rocket.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

	if(this.height === null || this.width === null)
	{
		this.height = g_images.rocket.height; //define the height of rocket prototype
		this.width = g_images.rocket.width; //define the width of rocket prototype
	}

    if(this.cx > g_canvas.width || this.cx <0 || this.cy > g_canvas.height || this.cy<0)
        return entityManager.KILL_ME_NOW;
    
	if(entityManager._Landscape[0].pixelHitTest(this))
        {
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy
    	});
        return entityManager.KILL_ME_NOW;
    }
	this.velY += NOMINAL_GRAVITY;
	
    this.cx += (this.velX + this.power) * du;
    this.cy += this.velY * du;
	
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
		
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy
    	});
		
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Rocket.prototype.getRadius = function () {
    return 8;
};

Rocket.prototype.render = function (ctx) {
    g_sprites.rocket.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
