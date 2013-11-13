// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//

function Explosionsprite(sx, sy, width, height, spriteSheet) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.image = spriteSheet;
}

function Sprite(image) {
    this.image = image;

    this.width = image.width;
    this.height = image.height;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation, turn) {
    if (rotation === undefined) rotation = 0;
    if(turn === undefined) turn = 1;
    
	
    var w = this.width,
        h = this.height;
	
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(turn,1);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  

Explosionsprite.prototype.drawSheetAt = function (ctx, x, y) {
	//ctx.scale(5,5);
    ctx.drawImage(this.image, 
                  this.sx, this.sy, this.width, this.height,
                  x, y, this.width, this.height);
}

Sprite.prototype.drawSnailCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
	
    var w = this.width,
        h = this.height;
	
    ctx.save();
    ctx.translate(cx, cy);
    //ctx.rotate(rotation);
    ctx.scale(rotation, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  



Sprite.prototype.drawAimAwayFrom = function(ctx, cx,cy,rotation,dir){
    ctx.save();
    ctx.scale(this.scale,this.scale);
    ctx.drawImage(this.image,cx,cy);
    ctx.restore();
}

