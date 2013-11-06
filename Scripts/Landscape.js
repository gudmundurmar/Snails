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

Landscape.prototype.cx = 300;
Landscape.prototype.cy = 300;
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
    this.sprite.drawWrappedCentredAt(
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
        return ctx.getImageData(0,0,600,600);
    };

Landscape.prototype.pixelHitTest = function(target ) {
    var pos = target.getPos();
    return this.isPxLand(pos.posX,pos.posY);
};
Landscape.prototype.isPxLand = function(x,y){
    //Erum nuna bara ad tjekka hvort pixel sé ekki svartur. 
    //if(this.pixelMap[Math.floor(x/10)][Math.floor(y/10)].pixMap[0] !==0)
    //    return true;
    //return false;
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
    return 4*(600*y + x);
};
Landscape.prototype.deletePixAt = function(x,y){
    var offset = 100;
    for(var i =x-offset;i<x+offset;i++)
    {
        for(var j = y-offset;j<y+offset;j++){
            this.pixelMap.data[this.findIndex(i,j)] = 0;
            this.pixelMap.data[this.findIndex(i,j)+1] = 0;
            this.pixelMap.data[this.findIndex(i,j)+2]=0;
            this.pixelMap.data[this.findIndex(i,j)+3] = 255;
        }
    }
};