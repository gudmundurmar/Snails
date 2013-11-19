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
   	this.sprites[5] = g_sprites.grenade;
   	this.sprites[6] = g_sprites.airstrike;
   	this.sprites[7] = g_sprites.teleportaim;
};
Weapon.prototype.rotation =0;
Weapon.prototype.ammo = 50;
Weapon.prototype.aimX=0;
Weapon.prototype.aimY=0;
Weapon.prototype.aimDistance = 35;
Weapon.prototype.started =false;

Weapon.prototype.render = function(ctx,dir,rotateJump,g_mouseX, g_mouseY){
	if(this.selected === 6){
	g_sprites.aim.scale = 1;
	g_sprites.aim.drawCentredAt(ctx,g_mouseX, g_mouseY);
	}
	else if(this.selected === 7){
		g_sprites.teleportaim1.drawCentredAt(ctx,g_mouseX, g_mouseY);
	}
	else{
		g_sprites.aim.scale = 0.25;
		g_sprites.aim.drawCentredAt(ctx,this.aimX/* + this.aimDistance*/,this.aimY);
		}
	
	var spriteNow = this.sprites[this.selected];
	display.renderActiveWeapon(this.sprites[this.selected]); //to render active weapon on the interface
	this.sprites[this.selected].drawCentredAt(ctx,this.cx,this.cy,this.rotation-rotateJump,dir);

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
    if(this.ammo===0) {
        this.started = false; //if already started shooting you can't change weapons
        return;
    }

    switch(this.selected){
        case 1: 
            this.ammo -= 5;
            entityManager.fireBullet(this.aimX, this.aimY ,this.aimVectorX/10   ,this.aimVectorY/10,5, owner, this.ammo);
            break;
        case 2: entityManager.fireBullet(this.aimX,this.aimY, this.aimVectorX/10, this.aimVectorY/10,20, owner, this.ammo);
            this.ammo =0;
			shotgun.play();
            break;
        case 3: 
            entityManager.fireRocket(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10, power, owner); 
			this.ammo =0;
			break;
		case 4: 
            entityManager.throwHoly(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10, power, owner); 
			this.ammo =0;
			break;
		case 5: 
            entityManager.throwGrenade(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10, power, owner); 
			this.ammo =0;
			break;
		case 6: 
            entityManager.airStrike(0, g_mouseX); 
			airstrike.play();
			this.ammo =0;
			break;
		case 7: 
           entityManager.teleportSnail(g_mouseX,g_mouseY);
		   teleport.play();
		   this.ammo = 0;
			break;			
        default:
            return;
    }
};
var airstrike = new Audio('sounds/flugvel.wav');
var shotgun = new Audio('sounds/shotgun.wav');
var teleport = new Audio('sounds/teleport.wav');