//Weapons class
//
"use strict";


//Entity manager tharf ad firea bullet.
//Eg tharf ad lata vita hvernig bullet.
//Erfi ekki fra entity, a ekki alveg vid.
function Weapon(descr) {
 for (var property in descr) {
        this[property] = descr[property];
    }
    this.selected = 1;
    this.sprites = new Array()
    this.sprites[1] = g_sprites.smg;
    this.sprites[2] = g_sprites.shotgun;
   	this.sprites[3] = g_sprites.rocketlauncher;
   	this.sprites[4] = g_sprites.holy;
};
Weapon.prototype.rotation =0;
Weapon.prototype.ammo = 50;
Weapon.prototype.aimX=0;
Weapon.prototype.aimY=0;
Weapon.prototype.aimDistance = 35;
Weapon.prototype.started =false;

Weapon.prototype.render = function(ctx,dir,rotateJump){
	var spriteNow = this.sprites[this.selected];
	display.renderActiveWeapon(this.sprites[this.selected]); //to render active weapon on the interface
	this.sprites[this.selected].drawCentredAt(ctx,this.cx,this.cy,this.rotation-rotateJump,dir);
    g_sprites.aim.drawCentredAt(ctx,this.aimX/* + this.aimDistance*/,this.aimY);
	
};
Weapon.prototype.update = function(xVal,yVal,rotation,dir){
	this.cx=xVal;
	this.cy=yVal;

    this.aimVectorX = dir*this.aimDistance*Math.cos(this.rotation);
    this.aimVectorY = this.aimDistance*Math.sin(this.rotation);
    this.aimX = this.aimVectorX+this.cx;
    this.aimY = this.aimVectorY + this.cy;

    if(-Math.PI/2<this.rotation-rotation &&this.rotation-rotation<Math.PI/2)
        this.rotation-=rotation;
};


Weapon.prototype.changeGun = function(whatgun){
    if(!this.started)
        this.selected = whatgun;
};
Weapon.prototype.fire = function(power, owner){
    this.started = true;
    switch(this.selected){
        case 1: 
            this.ammo -= 5;
            entityManager.fireBullet(this.aimX, this.aimY ,this.aimVectorX/10   ,this.aimVectorY/10,5);
            break;
        case 2: entityManager.fireBullet(this.aimX,this.aimY, this.aimVectorX/10, this.aimVectorY/10,20);
            this.ammo =0;
            break;
        case 3: 
            entityManager.fireRocket(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10, power, owner); 
			this.ammo =0;
			break;
		case 4: 
            entityManager.throwHoly(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10, power, owner); 
			this.ammo =0;
        default:
            return;
    }
    if(this.ammo===0)
        this.started = false;
};