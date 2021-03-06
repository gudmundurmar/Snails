// ==========
// Background STUFF
// ==========

"use strict";


// A generic contructor which accepts an arbitrary descriptor object
function Landscape(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.land;
    
};

Landscape.prototype = new Entity();

Landscape.prototype.update = function (du) {

	spatialManager.unregister(this);
    if(this.isColliding()){
        var obj =this.isColliding();
        obj.hitland();
    }
	spatialManager.register(this);
	
};

Landscape.prototype.cx = 0;
Landscape.prototype.cy = 0;
Landscape.prototype.name = "Landscape";
Landscape.prototype.width = g_canvas.width;
Landscape.prototype.height = g_canvas.height;

Landscape.prototype.getRadius = function () {
    return 0;
};


Landscape.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Landscape.prototype.firstRender = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.width/2, this.height/2, this.rotation
    );
    this.sprite.scale = origScale;
};

Landscape.prototype.init = function(ctx, canvas) {

	this.firstRender(ctx);
    //make pixelMap
    this.pixelMap = this.buildPixelMap(ctx);
};


Landscape.prototype.pixelMap;

Landscape.prototype.buildPixelMap = function( ctx ) {
	return ctx.getImageData(0,0,this.width,this.height);
    };

Landscape.prototype.pixelHitTest = function(target, checkmiddle ) {
    var pos = target.getPos();
       if(checkmiddle === true) {
        var halfheight = 0;
        var width = 1;
        var halfwidth = 0;
    }
    else {        
        var halfheight = target.height/2;
        var width = target.width;
        var halfwidth = width/2;    
    }
 
   var y1 = Math.round(pos.posY+halfheight);
   var y2 = Math.round(pos.posY-halfheight);   
   var x = Math.round(pos.posX-halfwidth);


	target.isCollidingBottom = false;
	target.isCollidingLeft = false;
	target.isCollidingRight = false;


	for(var i=y1-10; i>y2+10; i--)
	{
		var S1 = this.getPixAt(x-2,i).A;
		var S2 = this.getPixAt(x+width+2,i).A;
					
		if(S1 !== 0)
		{
			target.isCollidingLeft = true;
		}
		if(S2 !== 0)
		{
			target.isCollidingRight = true;
		}
			
	}

	for(var i=x; i<width+x; i++)
	{
		var R = this.getPixAt(i,y1).R;
		var G = this.getPixAt(i,y1).G;
		var B = this.getPixAt(i,y1).B;
        var A = this.getPixAt(i,y1).A;
			
		if(R !== 0 && G !== 0 && B !== 0 || A !== 0)
		{
      			target.isCollidingBottom = true;
			return true;
		}
			
	}

	return false;	
	
};

Landscape.prototype.render = function(ctx){
    ctx.putImageData(this.pixelMap,0,0);
};

Landscape.prototype.getPixAt = function(x,y){
    return  {
            R:   this.pixelMap.data[this.findIndex(x,y)],
            G:   this.pixelMap.data[this.findIndex(x,y)+1],
            B:   this.pixelMap.data[this.findIndex(x,y)+2],
            A:   this.pixelMap.data[this.findIndex(x,y)+3]
            };
};
Landscape.prototype.findIndex = function(x,y){
    return 4*(1876*y + x);
};
Landscape.prototype.deletePixAt = function(x0,y0,radius){    	

	//Teiknar fylltan hring
	var x = radius;
    	var y = 0;
    	var xChange = 1 - (radius << 1);
    	var yChange = 0;
    	var radiusError = 0;

    	while (x >= y)
    	{
        	for (var i = x0 - x; i <= x0 + x; i++)
        	{
        	    this.drawPixAt(i, y0 + y);
        	    this.drawPixAt(i, y0 - y);
        	}
        	for (var i = x0 - y; i <= x0 + y; i++)
        	{
        	    this.drawPixAt(i, y0 + x);
        	    this.drawPixAt(i, y0 - x);
        	}

        	y++;
        	radiusError += yChange;
        	yChange += 2;
        	if (((radiusError << 1) + xChange) > 0)
        	{
        	    x--;
        	    radiusError += xChange;
        	    xChange += 2;
        	}
    	}
	
};

Landscape.prototype.drawPixAt = function(x,y){
       this.pixelMap.data[this.findIndex(x,y)] = 0;
        this.pixelMap.data[this.findIndex(x,y)+1] = 0;
        this.pixelMap.data[this.findIndex(x,y)+2]=0;
        this.pixelMap.data[this.findIndex(x,y)+3] = 0;
};
