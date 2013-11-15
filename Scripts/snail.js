// ==========
// SNAIL STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var NOMINAL_GRAVITY = 0.12;

function Snail(descr, playerCheck) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

	this.randomisePosition();
    
	if(playerCheck === "p1"){
		this.direction = 1;
		this.player = playerCheck;
		}
	else{
		this.direction = -1;
		this.player = playerCheck;
		}
	
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.snail;
    
  
    this._scale = 1;
    this._isActive = false;
	this._weapon = new Weapon({
		cx:this.cx,
		cy:this.cy
		});
};


Snail.prototype = new Entity();

Snail.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Snail.prototype.player = "";
Snail.prototype.thrust = 0;
Snail.prototype.KEY_JUMP = 'J'.charCodeAt(0); // þarf að finna fyrir enter. J fyrru jump
Snail.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Snail.prototype.KEY_FIRE  = ' '.charCodeAt(0); // hafa computeThrustMag fyrir þetta t.d. fyrir bazooka?
Snail.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Snail.prototype.KEY_0 = '0'.charCodeAt(0);
Snail.prototype.KEY_1 = '1'.charCodeAt(0);
Snail.prototype.KEY_AIM_UP = 'W'.charCodeAt(0);
Snail.prototype.KEY_AIM_DOWN = 'S'.charCodeAt(0);

Snail.prototype.health = 100;
Snail.prototype._isActive = false; //til að ákveða hvern á að hreyfa
Snail.prototype.yVel = 0;

Snail.prototype.height = null;
Snail.prototype.width = null;
Snail.prototype.xVel = 0;

Snail.prototype.rotation = 0;
Snail.prototype.rotationAdded =0;

Snail.prototype.isCollidingTop = false;
Snail.prototype.isCollidingBottom = false;

/*Snail.prototype.direction = 1;*/ // skoða í hvaða átt er verið að skjóta

//Snail.prototype.weapon = new Gun(this.cx,this.cy);

Snail.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
	this.cy = 200;
	
	
    //this.cy = this.cy || Math.random() * g_canvas.height;
    //this.rotation = this.rotation || 0;
};

Snail.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel){
	if(this._isActive){endTurnMakeNextActive(this.player);}
	return true;
	}
	//vantar hér breytuna seaLevel til að tjékka á hvenær snigillinn drukknar
	
}

Snail.prototype.blastAway = function(x,y,power){
	this.xVel = (this.cx - x)*power/2;
	this.yVel = (this.cy - y)*power/2;
	this.rotationAdded = power;
}

var NOMINAL_ROTATE_RATE = 0.1;

Snail.prototype.update = function (du) {
	spatialManager.unregister(this);
	if(this._isDeadNow || this.isOutOfMap()){
		  
		return entityManager.KILL_ME_NOW;
	}
	
	if(this.height === null || this.width === null)
	{
		this.height = g_images.snail.height; //define the height of snail prototype
		this.width = g_images.snail.width; //define the width of snail prototype
	}

	this.rotation += this.rotationAdded*du;

	this.cy +=this.yVel* du;
	this.cx += this.xVel*du;
	var prevY = this.cy;
	var prevX = this.cx;
	var nextY = prevY + this.yVel * du;
	var addRotate = 0;
	
	var halfheight = this.height/2;
	var width = this.width;
	var halfwidth = width/2;
	
	if (keys[this.KEY_LEFT] && this._isActive === true)
	{
		this.direction = -1;
		
		var y1 = Math.floor(this.cy+halfheight-4); //check fourth pixel
		var y2 = Math.floor(this.cy+halfheight-8); //check eighth pixel
		var x = Math.floor(this.cx-halfwidth-1);

		var R1 = entityManager._Landscape[0].getPixAt(x,y1).R;
		var R2 = entityManager._Landscape[0].getPixAt(x,y2).R;
		var G1 = entityManager._Landscape[0].getPixAt(x,y1).G;
		var G2 = entityManager._Landscape[0].getPixAt(x,y2).G;
		var B1 = entityManager._Landscape[0].getPixAt(x,y1).B;
		var B2 = entityManager._Landscape[0].getPixAt(x,y2).B;

		if(R1 !== 0 && G1 !== 0 && B1 !== 0)
		{
			if(R2 === 0 && G2 === 0 && B2 === 0)
			{
				this.cy -= 1*du;
				this.cx -= 1*du;
			}
			else{
				//do nothing
			}
		}
		else{
			this.cx -= 3*du;
		}
	
	}
	if (keys[this.KEY_RIGHT] && this._isActive === true)
	{
		this.direction = 1;
		
		var y1 = Math.floor(this.cy+halfheight-4); //check fourth pixel
		var y2 = Math.floor(this.cy+halfheight-8); //check eighth pixel
		var x = Math.floor(this.cx+halfwidth+1);

		var R1 = entityManager._Landscape[0].getPixAt(x,y1).R;
		var R2 = entityManager._Landscape[0].getPixAt(x,y2).R;
		var G1 = entityManager._Landscape[0].getPixAt(x,y1).G;
		var G2 = entityManager._Landscape[0].getPixAt(x,y2).G;
		var B1 = entityManager._Landscape[0].getPixAt(x,y1).B;
		var B2 = entityManager._Landscape[0].getPixAt(x,y2).B;
		

		if(R1 !== 0 && G1 !== 0 && B1 !== 0)
		{
			if(R2 === 0)
			{
				this.cy -= 1*du;
				this.cx += 1*du;
			}
			else{
				//do nothing
			}

		}
		else{
			this.cx += 3*du;
		}	
	}
   
	if (keys[this.KEY_JUMP] && this._isActive === true && this.isCollidingLandscape()) { 
	
		this.yVel = -4.5;
		this.cy += this.yVel * du;
		//jump.play();hoppu hljoð Hér þurfum við að hafa exp fall og ákveða max hæð sem má hoppa
    }

    if(keys[this.KEY_AIM_UP] && this._isActive)
    	addRotate = NOMINAL_ROTATE_RATE*du;
    if(keys[this.KEY_AIM_DOWN] && this._isActive)
    	addRotate = -NOMINAL_ROTATE_RATE*du;

	
	if(!this.isCollidingLandscape()){
		
		this.yVel += NOMINAL_GRAVITY;
	}
	else
	{
		this.xVel = this.xVel/2;
		this.rotationAdded=0;
		this.rotation=0;
		if(this.isCollidingBottom)
		{
			if(this.yVel > 6.5){this.takeDamage(this.yVel * 0.5);};
			this.yVel = 0;
		}
	}
	
    this._weapon.update(this.cx,this.cy,addRotate,this.direction);
    this.maybeFireBullet();

		spatialManager.register(this);
		
};

Snail.prototype.isCollidingLandscape = function() {

	if(this.cy>0 && entityManager._Landscape[0].pixelHitTest(this))
    {
		return true;
    }
}


var NOMINAL_GRAVITY = 0.12;


function endTurnMakeNextActive(currentPlayer){
	
	
	entityManager.currentWind();
	if(currentPlayer === "p1"){
		for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
			if(entityManager._SnailsP1[i]._isActive === true){
				entityManager.changePlayer = "p1";
				entityManager.changeWormP1 = i + 1;
			}	
		}
	}
	else{				
		for(var i = 0 ; i < entityManager._SnailsP2.length; i++){
			if(entityManager._SnailsP2[i]._isActive === true){
				entityManager.changePlayer = "p2";
				entityManager.changeWormP2 = i + 1;
			}
			
		}
	}
}

var hasBeenShot = false;

Snail.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE] && this._isActive === true) {
		this.thrust += 0.5;
		}
	
	if((hasBeenShot === true || this.thrust > 5.5)&& this._isActive === true ){
    	this._weapon.fire(this.thrust);
		
		hasBeenShot = false;
		this.thrust = 0;
		}
		
 
	if(this._weapon.ammo===0){
		endTurnMakeNextActive(this.player); 
		this._weapon.ammo=50; 
		this._isActive = false;
		} 
  
    }
	

Snail.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Snail.prototype.takeBulletHit = function () {
    this.takeDamage(2);
};

Snail.prototype.takeDamage = function(damage){
	//eitthvað með að við skoðum hvaða vopn hann tók hitt frá
	//breyta þessu yfir í það að þegar þeir eru hættir að hreyfast eða þegar turnið klárast þá minnka lífið þeirra. Bara eins og í leiknum
	this.health -= damage;
	
	if(this.health <= 0){
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy
    	});
		
		this._isDeadNow = true;
	}
}

Snail.prototype.render = function (ctx) {	
	
	ctx.fillStyle="white";
	ctx.fillRect(this.cx-50,this.cy-70,100,25);
	
	if(this._isActive === true){
	
		ctx.strokeStyle="green";
		ctx.lineWidth = 5;
		ctx.strokeRect(this.cx-50,this.cy-70,100,25);
		ctx.fillRect(this.cx-50,this.cy-80,this.thrust * 18, 5);
		}
	
	
	if(this.player === "p1"){
		ctx.fillStyle="red";
	}
	else{
		ctx.fillStyle="blue";
	}
	ctx.font= "20px Arial"; 
	ctx.fillText(Math.floor(this.health), this.cx-18, this.cy-52);
	

    var origScale = this.sprite.scale;
	
    this.sprite.scale = this._scale;
	
    this.sprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation,this.direction*-1); 
	
    this.sprite.scale = origScale;
    if(this._isActive)
		this._weapon.render(ctx,this.direction);

};
