// ==========
// SNAIL STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Snail(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.snail;
    
  
    this._scale = 1;
    this._isActive = true
	
};

Snail.prototype = new Entity();

Snail.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Snail.prototype.KEY_JUMP = 'J'.charCodeAt(0); // þarf að finna fyrir enter. J fyrru jump
Snail.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Snail.prototype.KEY_FIRE  = ' '.charCodeAt(0); // hafa computeThrustMag fyrir þetta t.d. fyrir bazooka?
Snail.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
/*.prototype.KEY_AIM_UP = 'up'.charCodeAt(0);
Snail.prototype.KEY_AIM_DOWN = 'down'.charCodeAt(0);*/

Snail.prototype.cx = 200;
Snail.prototype.cy = 300;
Snail.prototype.health = 100;
Snail.prototype._isActive = false; //til að ákveða hvern á að hreyfa
Snail.prototype.yVel = 0;
Snail.prototype.direction = 1; // skoða í hvaða átt er verið að skjóta

//Snail.prototype.weapon = new Gun(this.cx,this.cy);

Snail.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width /*|| this.cy >= seaLevel*/) return true;
	//vantar hér breytuna seaLevel til að tjékka á hvenær snigillinn drukknar

}

Snail.prototype.update = function (du) {
	
	
	
	
	spatialManager.unregister(this);
	if(this._isDeadNow || this.isOutOfMap()){
		return entityManager.KILL_ME_NOW;
	}
	
	this.cy+=this.yVel* du;
	var prevY = this.cy;
	var nextY = prevY + this.yVel * du;
	
	if (keys[this.KEY_LEFT] && this._isActive === true)
	{
	this.cx -= 3* du;
	this.direction = -1;
	}
	if (keys[this.KEY_RIGHT] && this._isActive === true)
	{
	this.cx += 3 * du;
	this.direction = 1;
	}
	
   
	if (eatKey(this.KEY_JUMP) && this._isActive === true && this.isCollidingLandscape()) { 
	
		this.yVel = -4.5;
		this.cy += this.yVel * du;
		//jump.play();hoppu hljoð Hér þurfum við að hafa exp fall og ákveða max hæð sem má hoppa
    }
	
	if(!this.isCollidingLandscape()){
		this.yVel += NOMINAL_GRAVITY;
		//
		}
	else{
		this.yVel = 0;
		}
    
    this.maybeFireBullet();

	/*if(this.isColliding()){
		this.warp();
		}
	else{*/
		spatialManager.register(this);
		
};

Snail.prototype.isCollidingLandscape = function() {

	if(entityManager._Landscape[0].pixelHitTest(this))
    {
        console.log("hit");
		return true;
    }

	
}


var NOMINAL_GRAVITY = 0.12;

Snail.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};



Snail.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {
    
        var dX = this.cx+100*this.direction;
        var dY = this.cy;
        var launchDist = this.getRadius() * 1.2;
       
        var relVel = 2;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           dX , dY ,
           1*this.direction , NOMINAL_GRAVITY, 
           200);
           
    }
	
	//Þurfum að enda turnið hér sem breytir meðal annars this._isActive yfir í false
    
};

Snail.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Snail.prototype.takeBulletHit = function () {
    this.takeDamage();
};

Snail.prototype.takeDamage = function(){
	//eitthvað með að við skoðum hvaða vopn hann tók hitt frá
	//breyta þessu yfir í það að þegar þeir eru hættir að hreyfast eða þegar turnið klárast þá minnka lífið þeirra. Bara eins og í leiknum
	this.health -= 20;
	//explosion(this.cx,this.cy);
	if(this.health <= 0) this._isDeadNow = true;
}

Snail.prototype.render = function (ctx) {
	//if(this.health >= 40){
	g_sprites.aim.drawCentredAt(ctx,this.cx+100*this.direction,this.cy);
	
	
	ctx.fillStyle="white";
	ctx.fillRect(this.cx-50,this.cy-70,100,20);
	ctx.fillStyle="red";
	ctx.font= "20px Arial"; 
	ctx.fillText(this.health, this.cx-25, this.cy-55);

    var origScale = this.sprite.scale;
	
    this.sprite.scale = this._scale;
	
    this.sprite.drawSnailCentredAt(ctx, this.cx, this.cy,this.direction*-1); // teiknum orminn á ákveðnum stað
	//teiknum miðið hans hér á ákveðnum stað líklegast með drawAt sem hefur rotation líka
	//eitthvað með að teikna vopnið með this.drawWeapon
	//this.weapon.render(ctx);
    this.sprite.scale = origScale;
	
	/*else{
		
		var g_cel = 0;
	
		var cel = g_explosion[g_cel]
		
		cel.drawCentredAt(ctx,this.cx, this.cy - g_cel*5);
		++g_cel;
		console.log(g_cel);
		if (g_cel === g_sprites.length) g_cel = 0;
		
	}*/
};