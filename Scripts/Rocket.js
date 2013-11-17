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
Rocket.prototype.cx = 200;
Rocket.prototype.cy = 200;
Rocket.prototype.velX = 1;
Rocket.prototype.velY = 1;
Rocket.prototype.power = 1;
Rocket.prototype.angle =0;
Rocket.prototype.direction =1;
Rocket.prototype.owner = "";


Rocket.prototype.height = null;
Rocket.prototype.width = null;

Rocket.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel){
	return true;
	}
}

Rocket.prototype.update = function (du) {
    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow || this.isOutOfMap()) {
		endTurnMakeNextActive(this.owner); 
        return entityManager.KILL_ME_NOW;
    }

	if(this.height === null || this.width === null)
	{
		this.height = g_images.rocket.height; //define the height of rocket prototype
		this.width = g_images.rocket.width; //define the width of rocket prototype
	}

	if(entityManager._Landscape[0].pixelHitTest(this))
        {
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy
    	});
		endTurnMakeNextActive(this.owner); 
        return entityManager.KILL_ME_NOW;
    }
	this.velX += entityManager.windThisTurn;
	this.velY += NOMINAL_GRAVITY;
    this.angle = Math.atan(this.velY/this.velX);

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
		endTurnMakeNextActive(this.owner);
        return entityManager.KILL_ME_NOW;
    }
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Rocket.prototype.getRadius = function () {
    return 8;
};

Rocket.prototype.render = function (ctx) {
    if(this.velX>0)
        g_sprites.rocket.drawCentredAt(ctx, this.cx, this.cy, this.angle);
    else
        g_sprites.rocket.drawCentredAt(ctx,this.cx,this.cy,-this.angle,-1);
};


function Holy(descr) {

    this.setup(descr);
}

Holy.prototype = new Entity();
    
// Initial, inheritable, default values
Holy.prototype.cx = 200;
Holy.prototype.cy = 200;
Holy.prototype.velX = 1;
Holy.prototype.velY = 1;
Holy.prototype.power = 1;
Holy.prototype.angle =0;
Holy.prototype.direction =1;
Holy.prototype.owner = "";


Holy.prototype.height = null;
Holy.prototype.width = null;

Holy.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel){
	return true;
	}
}

Holy.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow || this.isOutOfMap()) {
		endTurnMakeNextActive(this.owner); 
        return entityManager.KILL_ME_NOW;
    }
	console.log(this.velX);
	console.log(this.velY);
	if(this.height === null || this.width === null)
	{
		this.height = g_images.holy.height; //define the height of rocket prototype
		this.width = g_images.holy.width; //define the width of rocket prototype
	}

	if(entityManager._Landscape[0].pixelHitTest(this))
        {
		this.velX *= -0.8;
		this.velY *= -0.9;
	}
	else{
		this.velX += entityManager.windThisTurn * 0.5;
		this.velY += NOMINAL_GRAVITY;
	}
	if(this.velY < 0.5 && this.velY > -0.5 && entityManager._Landscape[0].pixelHitTest(this) ){
		this.velX = 0;
		this.velY = 0;
	}

    this.angle = Math.atan(this.velY/this.velX);

    this.cx += (this.velX + this.power) * du;
    this.cy += this.velY * du;

    spatialManager.register(this);

};

Holy.prototype.getRadius = function () {
    return 13;
};

Holy.prototype.render = function (ctx) {
        g_sprites.holy.drawCentredAt(ctx, this.cx, this.cy, this.angle);
};