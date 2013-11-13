// ==========
// SNAIL STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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
Snail.prototype.thrust = 1;
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

	if(this.cx < 0 || this.cx > g_canvas.width /*|| this.cy >= seaLevel*/){
	if(this._isActive){endTurnMakeNextActive(this.player);}
	return true;
	}
	//vantar hér breytuna seaLevel til að tjékka á hvenær snigillinn drukknar
	
}

var NOMINAL_ROTATE_RATE = 0.1;

Snail.prototype.update = function (du) {
	//console.log(this._isActive);
	spatialManager.unregister(this);
	if(this._isDeadNow || this.isOutOfMap()){
		  
		return entityManager.KILL_ME_NOW;
	}
	
	if(this.height === null || this.width === null)
	{
		this.height = g_images.snail.height; //define the height of snail prototype
		this.width = g_images.snail.width; //define the width of snail prototype
	}
	
	this.cy +=this.yVel* du;
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
		if(this.isCollidingTop)
		{
			this.yVel *= -0.8;
			this.yVel += NOMINAL_GRAVITY;
			this.cx = prevX;
			this.cy = prevY;
		}
		if(this.isCollidingBottom)
		{
			this.yVel = 0;
		}
	}
	
    this._weapon.update(this.cx,this.cy,addRotate,this.direction);
    this.maybeFireBullet();

		spatialManager.register(this);
		
};

Snail.prototype.isCollidingLandscape = function() {

	if(entityManager._Landscape[0].pixelHitTest(this))
    {
		return true;
    }
}


var NOMINAL_GRAVITY = 0.12;


function endTurnMakeNextActive(currentPlayer){
	if(currentPlayer === "p1"){
		for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
			if(entityManager._SnailsP1[i]._isActive === true){
				entityManager.changePlayer = "p1";
				entityManager.changeWormP1 = i + 1;
			}	
		}
	}
	else{				
		for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
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
		console.log(this.thrust);
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
    this.takeDamage();
};

Snail.prototype.takeDamage = function(){
	//eitthvað með að við skoðum hvaða vopn hann tók hitt frá
	//breyta þessu yfir í það að þegar þeir eru hættir að hreyfast eða þegar turnið klárast þá minnka lífið þeirra. Bara eins og í leiknum
	this.health -= 20;
	
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
	ctx.fillRect(this.cx-50,this.cy-70,100,20);
	
	if(this._isActive === true){
		ctx.strokeStyle="green";
		ctx.strokeRect(this.cx-50,this.cy-70,100,20);
		}
	
	
	if(this.player === "p1"){
		ctx.fillStyle="red";
	}
	else{
		ctx.fillStyle="blue";
	}
	ctx.font= "20px Arial"; 
	ctx.fillText(this.health, this.cx-25, this.cy-55);

    var origScale = this.sprite.scale;
	
    this.sprite.scale = this._scale;
	
    this.sprite.drawSnailCentredAt(ctx, this.cx, this.cy,this.direction*-1); 
	
    this.sprite.scale = origScale;
    if(this._isActive)
		this._weapon.render(ctx,this.direction);
	
};
