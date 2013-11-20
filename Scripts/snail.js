// ==========
// SNAIL STUFF
// ==========

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
Snail.prototype.KEY_BACKJUMP = 'L'.charCodeAt(0); 
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
Snail.prototype.isBackJumping = false;

//Snail.prototype.isCollidingTop = false;
Snail.prototype.isCollidingBottom = false;
Snail.prototype.isCollidingLeft = false;
Snail.prototype.isCollidingRight = false;
Snail.prototype.timeFrame = 0;
Snail.prototype.turnTime = 20 * SECS_TO_NOMINALS;


/*Snail.prototype.direction = 1;*/ // skoða í hvaða átt er verið að skjóta

//Snail.prototype.weapon = new Gun(this.cx,this.cy);

Snail.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = util.randRange(250, g_canvas.width - 250);
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

Snail.prototype.blastAway = function(x,y,power,maxDist){
	this.xVel = (this.cx - x)*power/300;
	this.yVel = (this.cy - y)*power/300;
	this.rotationAdded = power/200;
	var dist = Math.sqrt(util.distSq(this.cx,this.cy,x,y));
	var damage = Math.floor(10*maxDist/dist);
	this.takeDamage(damage);
 }


var NOMINAL_ROTATE_RATE = 0.1;

Snail.prototype.update = function (du) {
	spatialManager.unregister(this);

		if(this._isDeadNow || this.isOutOfMap()){
		entityManager.generateDeath({
        		cx : this.cx,
        		cy : this.cy
    	});
    	endTurnMakeNextActive(this.player);
		return entityManager.KILL_ME_NOW;
	}
	
	if(this._isActive){
		this.turnTime -= du;
		if(this.turnTime <= 0){
			endTurnMakeNextActive(this.player); 
			this._weapon.ammo=50; 
			this._isActive = false;
		}
	}
	
	
	if(this.height === null || this.width === null)
	{
		this.height = g_images.snail.height; //define the height of snail prototype
		this.width = g_images.snail.width; //define the width of snail prototype
	}

	this.rotation += this.rotationAdded*du;
	move.volume = 0.2;
	this.cy +=this.yVel* du;
	this.cx += this.xVel*du;
	var prevY = this.cy;
	var prevX = this.cx;
	var nextY = prevY + this.yVel * du;
	var addRotate = 0;
	
	var halfheight = this.height/2;
	var width = this.width;
	var halfwidth = width/2;
	
	if (keys[this.KEY_LEFT] && this._isActive === true && this.isCollidingLandscape())
	{
		move.play();
		
		this.direction = -1;

		if(this.timeFrame < 2)
		{	
			++this.timeFrame;
		}
		else
		{
			this.timeFrame = 0;
		}	
		
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
	if (keys[this.KEY_RIGHT] && this._isActive === true && this.isCollidingLandscape())
	{
		move.play();
		this.direction = 1;

		if(this.timeFrame < 2)
		{	
			++this.timeFrame;
		}
		else
		{
			this.timeFrame = 0;
		}	
		
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
		frontjump.play();
		this.xVel = 3 * this.direction;
		this.yVel = -2.5;
		this.cy += this.yVel * du;
		this.rotation = 0.25;
		
		
    }
	
	

    if(keys[this.KEY_AIM_UP] && this._isActive)
    	addRotate = NOMINAL_ROTATE_RATE*du;
    if(keys[this.KEY_AIM_DOWN] && this._isActive)
    	addRotate = -NOMINAL_ROTATE_RATE*du;

	if(this.isCollidingLeft)
	{
			
		this.cx += 2;
	}

	if(this.isCollidingRight)
	{
		this.cx -= 2;
	}
	
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
			this.xVel = 0;
			if(this.yVel > 6.5 && entityManager.hasStarted === true){
				this.takeDamage(this.yVel * 0.9);
				ouchFall.play();
				};
			this.yVel = 0;
		}
	}
	if(this._isActive === true){
	//debugging method fyrir active snail - console.log(whatevs); :P :D XD ;O
	}
	if(keys[this.KEY_BACKJUMP] && this._isActive && this.isCollidingLandscape()){
		backjump.play();
		this.xVel = 0.5 * this.direction * -1;
		this.yVel = -4.5;
		this.cy += this.yVel * du;
		this.rotationAdded = 0.09;
		this.isBackJumping = true;
	}
	if(this.rotation > Math.PI*2 && this.isBackJumping ===  true){
		this.rotationAdded = 0;
		this.rotation = 0;
		this.isBackJumping = false;
		}
	
    this._weapon.update(this.cx,this.cy,addRotate,this.direction,this.player);
    this.maybeFireBullet();

		spatialManager.register(this);
		
};

Snail.prototype.isCollidingLandscape = function() {

	if(this.cy>0 && entityManager.getLandscape().pixelHitTest(this))
    {
		return true;
    }
}


var NOMINAL_GRAVITY = 0.12;


function endTurnMakeNextActive(currentPlayer){

	if(currentPlayer === "p1"){
				entityManager.changePlayer = "p1";
				entityManager.changeWormP1 +=1;
		}
	
	else{
				entityManager.changePlayer = "p2";
				entityManager.changeWormP2 += 1;

	}
	makeSound();
}



var hasBeenShot = false;

Snail.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE] && this._isActive === true) {
		this.thrust += 0.5;
		}
	
	if((hasBeenShot === true || this.thrust > 5.5)&& this._isActive === true ){
    	this._weapon.fire(this.thrust,this.player);
		
		hasBeenShot = false;
		this.thrust = 0;
		}
	
 
	if((this._weapon.ammo === 0) && (entityManager.getShotsNotExploded() === 0) && entityManager.readyForTurn()){
		console.log("change");
		endTurnMakeNextActive(this.player); 

		this._weapon.ammo=50; 
		this._isActive = false;
		} 
  
    }
	

Snail.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Snail.prototype.takeBulletHit = function () {
	
    this.takeDamage(50);
};

Snail.prototype.takeDamage = function(damage){
	//eitthvað með að við skoðum hvaða vopn hann tók hitt frá
	//breyta þessu yfir í það að þegar þeir eru hættir að hreyfast eða þegar turnið klárast þá minnka lífið þeirra. Bara eins og í leiknum
	this.health -= damage;
	
	if(this.health <= 0){
		entityManager.generateRip({
			cx : this.cx,
			cy : this.cy,
			yVel : -5
		});
		this._isDeadNow = true;
	}
}

Snail.prototype.render = function (ctx) {	
	
	display.renderBox(ctx,this.cx-50,this.cy-70,100,25,"white","black");

	var cel = g_slime[this.timeFrame];
	if(this.isCollidingLandscape())
	{
		cel.drawCentredAt(ctx,this.cx,this.cy,this.rotation,this.direction*-1);
	}
	else{
		cel.drawCentredAt(ctx,this.cx,this.cy+3,this.rotation,this.direction*-1);
	}
	
	if(this._isActive === true){
			display.renderBox(ctx,this.cx-50,this.cy-70,100,25,"white","green");
			display.renderBox(ctx, this.cx-50,this.cy-80,this.thrust * 18, 5, "red", "yellow");
			display.renderBox(ctx, 47,25,125,55, "white", "black");
			display.renderText(ctx,Math.ceil(this.turnTime/100), 90, 70, "Black");
			display.renderText(ctx,"Time Left  ", 60, 50, "Black");
		}
	
	
	if(this.player === "p1"){
		display.renderText(ctx, Math.floor(this.health), this.cx-18, this.cy-52, "red");
	}
	else{
		display.renderText(ctx, Math.floor(this.health), this.cx-18, this.cy-52, "blue");
	}
	
    var origScale = this.sprite.scale;
	
    this.sprite.scale = this._scale;
	
    this.sprite.drawCentredAt(ctx, this.cx, this.cy,this.rotation,this.direction*-1); 
	
    this.sprite.scale = origScale;
    if(this._isActive){
		//if(this._weapon.selected === 8 && this._weapon.ammo === 0){
			//this._weapon.render(ctx,this.direction * -1,this.rotation,g_mouseX, g_mouseY);
			
		//else{
			this._weapon.render(ctx,this.direction,this.rotation,g_mouseX, g_mouseY);
			
		}
		
	if(this.cy < 0){
		display.renderArrow(ctx,this.cx,0, this.player);
		display.renderText(ctx, Math.floor(this.cy * -1),this.cx-15,40);
	}

};

function makeSound(){

	var sound = Math.floor(Math.random() * 17);

	switch(sound){
		case 0 : zero.play(); break;
		case 1 : one.play(); break;
		case 2 : two.play(); break;
		case 3 : three.play(); break;
		case 4 : four.play(); break;
		case 5 : five.play(); break;
		case 6 : six.play(); break;
		case 7 : seven.play(); break;
		case 8 : eight.play(); break;
		case 9 : nine.play(); break;
		case 10 : ten.play(); break;
		case 11: eleven.play(); break;
		case 12: twelve.play(); break;
		case 13: thirteen.play(); break;
		case 14: fourteen.play(); break;
		case 15: fifteen.play(); break;
		case 16: sixteen.play(); break;
		
	}
	
}


//------!!!!!!
//
//---SOUNDS---
//
//------!!!!!!

var zero = new Audio('sounds/worm/delighted.wav');
var one = new Audio('sounds/worm/dirtjob.wav');
var two = new Audio('sounds/worm/eager.wav');
var three = new Audio('sounds/worm/evil.wav');
var four = new Audio('sounds/worm/fedup.wav');
var five = new Audio('sounds/worm/imbecil.wav');
var six = new Audio('sounds/worm/japhoi.wav');
var seven = new Audio('sounds/worm/um-yeah.wav');
var eight = new Audio('sounds/worm/son-of-imbecil.wav');
var nine = new Audio('sounds/worm/whoee-hee.wav');
var ten = new Audio('sounds/worm/uhhuh.wav');
var eleven = new Audio('sounds/worm/shaken.wav');
var twelve = new Audio('sounds/worm/not-funny.wav');
var thirteen = new Audio('sounds/worm/newbie.wav');
var fourteen = new Audio('sounds/worm/more-stupid.wav');
var fifteen = new Audio('sounds/worm/hitchoo.wav');
var sixteen = new Audio('sounds/worm/backdogg.wav');

var frontjump = new Audio('sounds/jump4.ogg');
var backjump = new Audio('sounds/jump1.wav');
var move = new Audio('sounds/slim.wav');
var end = new Audio('sounds/tapa.wav');
var test = new Audio('sounds/theme.wav');

var airstrike = new Audio('sounds/flugvel.wav');
var shotgun = new Audio('sounds/shotgun.wav');
var teleport = new Audio('sounds/teleport.wav');
var haleluja = new Audio('sounds/haleluja.mp3');
var ding = new Audio('sounds/ding.wav');
var ouchFall = new Audio('sounds/ow.wav');
var fire = new Audio('sounds/fire.wav');
var base = new Audio('sounds/base.wav');
var smg = new Audio('sounds/mp5.wav');
