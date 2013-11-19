function Death(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    deathexplo.play();
	deathexplo.volume = 0.1;
    // Default sprite, if not otherwise specified
  
    this._scale = 1;
	entityManager._Landscape[0].deletePixAt(Math.floor(this.cx),Math.floor(this.cy),this.radius);

};

Death.prototype = new Entity();

Death.prototype.cx = 200;
Death.prototype.cy = 300;
Death.prototype.timeFrame = 0;
Death.prototype.height = 64;
Death.prototype.width = 64;
Death.prototype.maxDamage = 70;
Death.prototype.power =70;
Death.prototype.radius = 60;
Death.prototype.explosion = true;


Death.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};



Death.prototype.update = function (du) {
	//console.log(this.timeFrame);

	
	this.timeFrame++;
	
	if(this.timeFrame === 25){
		this._isDeadNow = true;
		
	}
	
	spatialManager.unregister(this);
	if(this._isDeadNow){
		return entityManager.KILL_ME_NOW;
	}
	//thvi sprengjan theytir i threfalt staerra svaedi en that eydir pixlum
	var possibleWorms = this.findWorms(this.radius*3);
	if(possibleWorms&& this.timeFrame===1){
		for(var i =0;i<possibleWorms.length;i++)
		{
			var worm =possibleWorms[i].worm;
			if(this.explosion === true) //check if it's a bomber
			worm.blastAway(this.cx,this.cy,this.power,this.radius*3);
		}
	}

	spatialManager.register(this);
};


Death.prototype.getRadius = function () {
    return (g_explosion[this.timeFrame].width / 2) * 0.9;
};

Death.prototype.render = function (ctx) {


	var cel = g_explosion[this.timeFrame];
	if(this.explosion === true)
	cel.drawSheetAt(ctx,this.cx-(this.width/2), this.cy-(this.height/2) - this.timeFrame*1.5);	
		
};

function Rip(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    this.sprite = this.sprite || g_sprites.rip;
    // Default sprite, if not otherwise specified
  
    this._scale = 1;
};

Rip.prototype = new Entity();

Rip.prototype.cx = 200;
Rip.prototype.cy = 300;
Rip.prototype.yVel = 0;
Rip.prototype.height = 35;
Rip.prototype.width = 27;

//Death.prototype.height = 64;
//Death.prototype.width = 64;

Rip.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Rip.prototype.isOutOfMap = function(){

	if(this.cx < 0 || this.cx > g_canvas.width || this.cy > entityManager.seaLevel + 40){
	return true;
	}
	
};

Rip.prototype.update = function (du) {

	spatialManager.unregister(this);
	
	if(this.isOutOfMap()){
		return entityManager.KILL_ME_NOW;
	}
	
	if(entityManager._Landscape[0].pixelHitTest(this))
        {
		this.yVel *= -0.6;
		if(this.yVel === 0.005){
			this.yVel = 0;
		}
	}
	else{
		this.yVel += NOMINAL_GRAVITY;
	}
	
	this.cy +=this.yVel* du;
	var prevY = this.cy;
	var nextY = prevY + this.yVel * du;
	

	spatialManager.register(this);
};



Rip.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};


Rip.prototype.render = function (ctx) {

this.sprite.drawCentredAt(ctx, this.cx, this.cy); 		
		
};

function BigExplo(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
	haleexplo.play();
    this._scale = 1 ;
	entityManager._Landscape[0].deletePixAt(Math.floor(this.cx),Math.floor(this.cy),this.radius);

};

BigExplo.prototype = new Entity();

BigExplo.prototype.cx = 200;
BigExplo.prototype.cy = 300;
BigExplo.prototype.timeFrame = 0;
BigExplo.prototype.height = 220;
BigExplo.prototype.width = 220;
BigExplo.prototype.maxDamage = 70;
BigExplo.prototype.power =100;
BigExplo.prototype.radius = 100;
BigExplo.prototype.explosion = true;


BigExplo.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};



BigExplo.prototype.update = function (du) {
	//console.log(this.timeFrame);

	
	this.timeFrame++;
	
	if(this.timeFrame === 24){
		this._isDeadNow = true;
		
	}
	
	spatialManager.unregister(this);
	if(this._isDeadNow){
		return entityManager.KILL_ME_NOW;
	}

	if(this.findWorms()&& this.timeFrame===1){
		for(var i =0;i<this.findWorms().length;i++){
			var worm =this.findWorms()[i].worm;
			if(this.explosion === true) //check if it's a bomber
			worm.blastAway(this.cx,this.cy,this.power,this.radius*3);
		}
	}

	spatialManager.register(this);
};


BigExplo.prototype.getRadius = function () {
    return (g_bigexplosion[this.timeFrame].width / 2) * 0.9;
};

BigExplo.prototype.findWorms = function(){
	var pos= this.getPos();
	return spatialManager.findSnailsInRange(
    pos.posX, pos.posY, this.getRadius()
    );
}

BigExplo.prototype.render = function (ctx) {


	var cel = g_bigexplosion[this.timeFrame];
	if(this.explosion === true)
	cel.drawSheetAt(ctx,this.cx-(this.width/4), this.cy-(this.height/4) - this.timeFrame*1.5);	
		
};

var haleexplo = new Audio('sounds/explo1.WAV');
var deathexplo = new Audio('sounds/miniexplo.wav');
