// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 1;
Bullet.prototype.velY = 1;

Bullet.prototype.height = null;
Bullet.prototype.width = null;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
		
    }
	
	if(this.height === null || this.width === null)
	{
		this.height = g_images.ship.height/4; //define the height of bullet prototype
		this.width = g_images.ship.width/4; //define the width of bullet prototype
	}
    if(entityManager._Landscape[0].pixelHitTest(this, true, Math.floor(this.cx), Math.floor(this.cy)))
    {
        entityManager.generateDeath({
                cx : this.cx,
                cy : this.cy,
                radius: this.getRadius(),
                explosion : false
        });
        return entityManager.KILL_ME_NOW;
    } 

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    if(this.cx > g_canvas.width || this.cx <0 || this.cy > g_canvas.height || this.cy<0)
        return entityManager.KILL_ME_NOW;
    
    // Handle collisions
    //  Bullets only do damage to worms. Not other bullets and landscape
    // is another thing.
    var hitworm = this.findWorms(this.getRadius());
    if(hitworm.length !==0){
        console.log(hitworm);
        hitworm[0].worm.takeDamage(this.damage);
        return entityManager.KILL_ME_NOW;
    }
    
    /*var hitEntity = this.findHitEntity();
    if (hitEntity) {
        //var canTakeHit = hitEntity.takeBulletHit;
        //if (canTakeHit) canTakeHit.call(hitEntity);
        var canTakeHit = hitEntity.takeDamage;
        if(canTakeHit)  hitEntity.takeDamage(this.damage);
        return entityManager.KILL_ME_NOW;
    }*/

    if(entityManager._Landscape[0].pixelHitTest(this, true))
        {
        entityManager._Landscape[0].deletePixAt(Math.floor(this.cx),Math.floor(this.cy),5);
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    //this.kill();

    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {


    g_sprites.bullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
