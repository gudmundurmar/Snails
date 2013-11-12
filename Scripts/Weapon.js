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
};

Weapon.prototype.render = function(ctx,dir){
	var spriteNow = this.sprites[this.selected];
	this.sprites[this.selected].drawSnailCentredAt(ctx,this.cx,this.cy,dir);
};
Weapon.prototype.update = function(xVal,yVal){
	this.cx=xVal;
	this.cy=yVal;
};