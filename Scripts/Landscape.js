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

Landscape.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};

Landscape.prototype.init = function(ctx, canvas) {
    console.log('here');
    this.render(ctx);

    //make pixelMap
    this.pixelMap = this.buildPixelMap(canvas);
    for(var i in this.pixelMap) {
        console.log(this.pixelMap[i]);
    }
};


Landscape.prototype.pixelMap;

Landscape.prototype.buildPixelMap = function( ctx ) {
        var resolution = 10;
        var pixelMap = [];
 
        for( var y = 0; y < this.height; y=y+10) {
            for( var x = 0; x < this.width; x=x+10 ) {
                var dataRowColOffset = y+"_"+x;//((y * source.width) + x);
                var pixel = g_ctx.getImageData(x,y,resolution,resolution);
                //get the opacity
                var pixelData = pixel.data;
                
                pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };
 
            }
        }
        return {
            data: pixelMap,
            resolution: resolution
        };
    };

Landscape.prototype.pixelHitTest = function( source, target ) {
 

            var top = parseInt( Math.max( source.y, target.y ) );
            var bottom = parseInt( Math.min(source.y+source.height, target.y+target.height) );
            var left = parseInt( Math.max(source.x, target.x) );
            var right = parseInt( Math.min(source.x+source.width, target.x+target.width) );
 
            for (var y = top; y < bottom; y++)
            {
                for (var x = left; x < right; x++)
                {
                    var pixel1 = source.pixelMap.data[ (x - source.x) +"_"+ (y - source.y) ];
                    var pixel2 = target.pixelMap.data[ (x - target.x) +"_"+ (y - target.y) ];
 
                    if( !pixel1 || !pixel2 ) {
                        continue;
                    };
                    
                    if (pixel1.pixelData[3] === 255 && pixel2.pixelData[3] === 255)
                    {
                        return true;
                    }
                }
            }
 
            return false;
    };