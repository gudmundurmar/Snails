function Death(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
  
    this._scale = 1;
	entityManager._Landscape[0].deletePixAt(Math.floor(this.cx),Math.floor(this.cy),60);
};

Death.prototype = new Entity();

Death.prototype.cx = 200;
Death.prototype.cy = 300;
Death.prototype.timeFrame = 0;
Death.prototype.height = 64;
Death.prototype.width = 64;

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
	
		spatialManager.register(this);
		
};


Death.prototype.getRadius = function () {
    return (g_explosion[this.timeFrame].width / 2) * 0.9;
};

Death.prototype.render = function (ctx) {
	//ctx.fillStyle="red";
	//ctx.fillRect(this.cx,this.cy,100,100);


   // var origScale = this.sprite.scale;
	
    //this.sprite.scale = this._scale;

	//this.spriteArray.drawCentredAt(ctx, this.cx, this.cy,this.direction*-1);
	
   // this.sprite.scale = origScale;

	var cel = g_explosion[this.timeFrame];
	
	//cel.drawSpritesheetCentredAt(ctx,this.cx, this.cy - this.timeFrame*5);
	
	cel.drawSheetAt(ctx,this.cx-(this.width/2), this.cy-(this.height/2) - this.timeFrame*1.5);	
		
		//if (g_cel === g_sprites.length) g_cel = 0;
		
};