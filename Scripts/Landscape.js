// ==========
// Background STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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

Landscape.prototype.cx = 938;
Landscape.prototype.cy = 404;
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
	ctx, this.cx, this.cy, this.rotation
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
	return ctx.getImageData(0,0,1876,809);
    };

Landscape.prototype.pixelHitTest = function(target ) {
	var pos = target.getPos();
	var halfheight = g_images.snail.height/2;
	var width = g_images.snail.width;
	var halfwidth = width/2;
	var y = Math.floor(pos.posY+halfheight);	
	var x = Math.floor(pos.posX-halfwidth);


	for(var i=x; i<width+x; i++)
	{
		var R = this.getPixAt(i,y).R;
		var G = this.getPixAt(i,y).G;
		var B = this.getPixAt(i,y).B;
			
		if(R !== 0 && G !== 0 && B !== 0)
		{
			//console.log("HIT");
			return true;
		}
			
	}

	
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
    //Teiknar fylltan kassa
	var offset = 20;
    /*for(var i =x0-offset;i<x0+offset;i++)
    {
        for(var j = y0-offset;j<y0+offset;j++){
            this.pixelMap.data[this.findIndex(i,j)] = 0;
            this.pixelMap.data[this.findIndex(i,j)+1] = 0;
            this.pixelMap.data[this.findIndex(i,j)+2]=0;
            this.pixelMap.data[this.findIndex(i,j)+3] = 255;
        }
    }*/
	
	//Teiknar hring
	/*var radius = 20;
	var x = radius, y = 0;
  	var radiusError = 1-x;
 
  	while(x >= y)
  	{
  		this.drawPixAt(x + x0, y + y0);
    		this.drawPixAt(y + x0, x + y0);
    		this.drawPixAt(-x + x0, y + y0);
    		this.drawPixAt(-y + x0, x + y0);
    		this.drawPixAt(-x + x0, -y + y0);
    		this.drawPixAt(-y + x0, -x + y0);
    		this.drawPixAt(x + x0, -y + y0);
    		this.drawPixAt(y + x0, -x + y0);
 
    		y++;
        	if(radiusError<0)
        	        radiusError+=2*y+1;
        	else
        	{
        	        x--;
        	        radiusError+=2*(y-x+1);
        	}
  	}*/
	

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
        this.pixelMap.data[this.findIndex(x,y)+3] = 255;
};