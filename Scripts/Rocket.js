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
Holy.prototype.bounce = 0;
Holy.prototype.ticking = false;
Holy.prototype.timer = 0;


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
        return entityManager.KILL_ME_NOW;
    }
	if(this.height === null || this.width === null)
	{
		this.height = g_images.holy.height; //define the height of rocket prototype
		this.width = g_images.holy.width; //define the width of rocket prototype
	}

	if(this.cy > 0 && entityManager._Landscape[0].pixelHitTest(this))
        {	
		this.bounce++;
		console.log("bounce");
		this.velX *= -0.8;
		this.velY *= -0.5;
		this.cx += this.velX;
		this.cy += this.velY;
		if(this.bounce <= 8) ding.play();
	}
	else{
		this.velY += NOMINAL_GRAVITY;
	}
	if(this.bounce === 8){
		
		haleluja.play();
		haleluja.volume=.09;
		console.log("inn");
		this.velX = 0;
		this.velY = 0;
		this.ticking = true;
	}
	if(this.ticking === true){
		this.timer++;
		
	}

	if(this.timer === 120){
		entityManager.generateBigExplo({
        		cx : this.cx,
        		cy : this.cy,
				
    	});
        return entityManager.KILL_ME_NOW;
	}
	
    this.angle = Math.atan(this.velY/this.velX);

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    spatialManager.register(this);

};

Holy.prototype.getRadius = function () {
    return 13;
};

Holy.prototype.render = function (ctx) {
        g_sprites.holy.drawCentredAt(ctx, this.cx, this.cy, this.angle);
};

function Grenade(descr) {

    this.setup(descr);
}

Grenade.prototype = new Entity();
    
// Initial, inheritable, default values
Grenade.prototype.cx = 200;
Grenade.prototype.cy = 200;
Grenade.prototype.velX = 1;
Grenade.prototype.velY = 1;
Grenade.prototype.power = 1;
Grenade.prototype.angle =0;
Grenade.prototype.direction =1;
Grenade.prototype.owner = "";
Grenade.prototype.timer = 3 * SECS_TO_NOMINALS;


Grenade.prototype.height = null;
Grenade.prototype.width = null;

Grenade.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel){
	return true;
	}
}

Grenade.prototype.update = function (du) {

    spatialManager.unregister(this);
	this.timer--;
	
	if(this.timer <= 0){
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy,
				
    	});
        return entityManager.KILL_ME_NOW;
	}
	
    if(this._isDeadNow || this.isOutOfMap()) {
        return entityManager.KILL_ME_NOW;
    }
	if(this.height === null || this.width === null)
	{
		this.height = g_images.grenade.height; //define the height of rocket prototype
		this.width = g_images.grenade.width; //define the width of rocket prototype
	}

	if(this.cy > 0 && entityManager._Landscape[0].pixelHitTest(this))
        {
		ding.pause();
		ding.play();
		this.velX *= -0.8;
		this.velY *= -0.5;
		this.cx += this.velX;
		this.cy += this.velY;
	}
	else{
		this.velY += NOMINAL_GRAVITY;
	}
	this.velX += entityManager.windThisTurn * 0.4;
		
    this.angle = Math.atan(this.velY/this.velX);

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    spatialManager.register(this);

};

Grenade.prototype.getRadius = function () {
    return 13;
};

Grenade.prototype.render = function (ctx) {
		display.renderBox(ctx,this.cx-20,this.cy-50,25,25,"white","black");
		display.renderText(ctx, Math.round(this.timer/60), this.cx-13,this.cy-28, "black");
        g_sprites.grenade.drawCentredAt(ctx, this.cx, this.cy, this.angle);
};

function Airstrike(descr) {

    this.setup(descr);
}

Airstrike.prototype = new Entity();
    
// Initial, inheritable, default values
Airstrike.prototype.cx = 0;
Airstrike.prototype.cy = 50;
Airstrike.prototype.velX = 8;
Airstrike.prototype.ammo = 5;
Airstrike.prototype.timer = 0;
/*Grenade.prototype.power = 1;
Grenade.prototype.angle =0;
Grenade.prototype.direction =1;
Grenade.prototype.owner = "";
Grenade.prototype.timer = 3 * SECS_TO_NOMINALS;
*/

Airstrike.prototype.update = function (du) {

    spatialManager.unregister(this);
	
	if(this.cx > g_canvas.width){
        return entityManager.KILL_ME_NOW;
	}
	console.log(this.cx);
	console.log(this.target);
	if(this.cx >= this.target-250 && this.ammo !== 0){
		
		this.timer++;
		if(this.timer % 10 === 0){
			entityManager.fireRocket(this.cx, this.cy + 50, 1,1, 1); 
			this.ammo--;
			}
	}

    this.cx += this.velX * du;

    spatialManager.register(this);

};

Airstrike.prototype.getRadius = function () {
    return 13;
};

Airstrike.prototype.render = function (ctx) {

        g_sprites.airstrike.drawCentredAt(ctx, this.cx, this.cy, this.angle);
};

function Teleport(descr) {

    this.setup(descr);
}

Teleport.prototype = new Entity();
    
// Initial, inheritable, default values
Teleport.prototype.cx = 0;
Teleport.prototype.cy = 50;
Teleport.prototype.fromcx = 50;
Teleport.prototype.fromcy = 50;
Teleport.prototype.target = "";
Teleport.prototype.ammo = 5;
Teleport.prototype.timeTo = -1;
Teleport.prototype.width = 200;
Teleport.prototype.height = 200;
Teleport.prototype.travel = false;
Teleport.prototype.timeTo = -1;
Teleport.prototype.timeFrom = 10;
/*Grenade.prototype.power = 1;
Grenade.prototype.angle =0;
Grenade.prototype.direction =1;
Grenade.prototype.owner = "";
Grenade.prototype.timer = 3 * SECS_TO_NOMINALS;
*/

Teleport.prototype.update = function (du) {
    spatialManager.unregister(this);
		this.timeTo++;
		this.timeFrom--;
	if(this.timeTo === 10){
		return entityManager.KILL_ME_NOW;
	}
    spatialManager.register(this);
	
	
};

Teleport.prototype.getRadius = function () {
    return 13;
};

Teleport.prototype.render = function (ctx) {
		var cel = g_teleport[this.timeFrom];
		cel.drawSheetAt(ctx,this.fromcx-(this.width/2), this.fromcy-(this.height/2) - this.timeTo);	   
	
		var cel1 = g_teleport[this.timeTo];
		cel1.drawSheetAt(ctx,this.cx-(this.width/2), this.cy-(this.height/2) - this.timeFrom);	   
	
};

function Baseball(descr) {
	this.setup(descr);
}

Baseball.prototype = new Entity();

Baseball.prototype.ammo = 5;
Baseball.prototype.timeFrame = 0;
Baseball.prototype.power = 1.2;

Baseball.prototype.update = function (du) {
    spatialManager.unregister(this);
	this.timeFrame++;
	base.play();
	if(this.timeFrame === 1){
	if(this.findWorms()&& this.timeFrame===1){
		for(var i =0;i<this.findWorms().length;i++){
			var worm =this.findWorms()[i].worm;
			worm.baseball(this.cx,this.cy,this.power);
			}
		}
	}
	
	if(this.timeFrame === 15){
		
		return entityManager.KILL_ME_NOW;
	}
    spatialManager.register(this);
	
	
};

Baseball.prototype.findWorms = function(){
	var pos= this.getPos();
	return spatialManager.findSnailsInRange(
    pos.posX, pos.posY, this.getRadius()
    );
}


Baseball.prototype.getRadius = function(){
	return 20;
}

Baseball.prototype.render = function() {
}


function Blowtorch(descr) {
	
	this.setup(descr);
}

Blowtorch.prototype = new Entity();

Blowtorch.prototype.ammo = 5;
Blowtorch.prototype.timeFrame = 0;
Blowtorch.prototype.power = 2.5;
Blowtorch.prototype.cx = 2.5;
Blowtorch.prototype.cy = 2.5;
Blowtorch.prototype.xVel = 0;
Blowtorch.prototype.yVel = 0;
Blowtorch.prototype.damage = 0.5;

Blowtorch.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel){
	return true;
	}	
}

Blowtorch.prototype.update = function (du) {
    spatialManager.unregister(this);
	fire.play();
	this.timeFrame++;
	this.angle = Math.atan(this.yVel/this.xVel);
	entityManager._Landscape[0].deletePixAt(Math.floor(this.cx),Math.floor(this.cy),this.getRadius());
	
	
	if(this.timeFrame === 115 || this.isOutOfMap()){
		fire.pause();
		return entityManager.KILL_ME_NOW;
	}
	
	var hitworm = this.findWorms(this.getRadius()/2);
    if(hitworm.length !==0){
        hitworm[0].worm.takeDamage(this.damage);
    }
	
	this.cx += this.xVel * du;
    this.cy += this.yVel * du;
    spatialManager.register(this);
};

Blowtorch.prototype.getRadius = function(){
	return 35;
}

Blowtorch.prototype.render = function(ctx) {
	if(this.xVel <0){
	g_sprites.fire.drawCentredAt(ctx, this.cx, this.cy,this.angle*-1,-1);}
	else{
	g_sprites.fire.drawCentredAt(ctx, this.cx, this.cy,this.angle);
	}
}
