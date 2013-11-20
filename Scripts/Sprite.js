// ============
// SPRITE STUFF
// ============

"use strict";

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
    
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  

Explosionsprite.prototype.drawSheetAt = function (ctx, x, y) {

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

    ctx.scale(rotation, this.scale);
    
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

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
   // this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};
