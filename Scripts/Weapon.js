//Weapons class
//
"use strict";

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
   	this.sprites[8] = g_sprites.bat;
   	this.sprites[9] = g_sprites.blow;
};
Weapon.prototype.rotation =0;
Weapon.prototype.ammo = 50;
Weapon.prototype.aimX=0;
Weapon.prototype.aimY=0;
Weapon.prototype.aimDistance = 35;
Weapon.prototype.started =false;
Weapon.prototype.spraying = 10;

Weapon.prototype.render = function(ctx,dir,rotateJump,g_mouseX, g_mouseY){
	if(this.selected === 6){
	g_sprites.aim.scale = 1;
	g_sprites.aim.drawCentredAt(ctx,g_mouseX, g_mouseY);
	}
	else if(this.selected === 7){
		g_sprites.teleportaim1.drawCentredAt(ctx,g_mouseX, g_mouseY);
	}
	else if(this.selected === 8){
		g_sprites.cap.drawCentredAt(ctx,this.cx + 28*dir, this.cy-15,this.rotation-rotateJump, dir);
	}
	else{
		g_sprites.aim.scale = 0.25;
		g_sprites.aim.drawCentredAt(ctx,this.aimX,this.aimY);
		}
	
	var spriteNow = this.sprites[this.selected];
	display.renderActiveWeapon(this.sprites[this.selected]); //to render active weapon on the interface
	if(this.selected === 8 && this.ammo === 0){
		this.sprites[this.selected].drawCentredAt(ctx,this.cx+40,this.cy,this.rotation-rotateJump,-1);
		}
	else{
		this.sprites[this.selected].drawCentredAt(ctx,this.cx,this.cy,this.rotation-rotateJump,dir);
	}

};
Weapon.prototype.update = function(xVal,yVal,rotation,dir,player){
	this.cx=xVal;
	this.cy=yVal;

    this.aimVectorX = dir*this.aimDistance*Math.cos(this.rotation);
    this.aimVectorY = this.aimDistance*Math.sin(this.rotation);
    this.aimX = this.aimVectorX+this.cx;
    this.aimY = this.aimVectorY + this.cy;

    if(this.selected ===1 && this.started===true &&this.ammo !==0){
        entityManager.fireBullet(this.aimX, this.aimY ,this.aimVectorX/10   ,this.aimVectorY/10,5, player, this.ammo);
        this.ammo -=5;
    }
    if(this.ammo ===0){
        this.started =false;
    }

	
    if(-Math.PI/2<this.rotation-rotation &&this.rotation-rotation<Math.PI/2)
        this.rotation-=rotation;
};

Weapon.prototype.offsetAim= function(degrees){
    //A little linear algebra!
    return {aimVectorX:     this.aimVectorX*Math.cos(consts.RADIANS_PER_DEGREE*degrees) - this.aimVectorY*Math.sin(consts.RADIANS_PER_DEGREE*degrees),
            aimVectorY:     this.aimVectorX*Math.sin(consts.RADIANS_PER_DEGREE*degrees) + this.aimVectorY*Math.cos(consts.RADIANS_PER_DEGREE*degrees)}
}


Weapon.prototype.changeGun = function(whatgun){
    if(!this.started)
        this.selected = whatgun;
};
Weapon.prototype.fire = function(power, owner){
    this.started = true;
    if(this.ammo===0) {
        this.started = false; //if you started shooting you can't change weapons
        return;
    }

    switch(this.selected){
        case 1: 
            this.ammo -= 5;
            if(g_sound) smg.play();
            break;
        case 2: 
            entityManager.fireBullet(this.aimX,this.aimY, this.aimVectorX/10, this.aimVectorY/10,20, owner, this.ammo);
            entityManager.fireBullet(this.aimX,this.aimY, this.offsetAim(20).aimVectorX/10,this.offsetAim(20).aimVectorY/10,20, owner, this.ammo);
            entityManager.fireBullet(this.aimX,this.aimY, this.offsetAim(-20).aimVectorX/10,this.offsetAim(-20).aimVectorY/10,20, owner, this.ammo);
            this.ammo =0;
			if(g_sound) shotgun.play();
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
			if(g_sound) airstrike.play();
			this.ammo =0;
			break;
		case 7: 
            if(entityManager._Landscape[0].getPixAt(g_mouseX,g_mouseY).A ===0)
            {
                entityManager.teleportSnail(g_mouseX,g_mouseY);
		        if(g_sound) teleport.play();
		        this.ammo = 0;
            }
		   break;
		case 8:	
			entityManager.baseBall(this.cx,this.cy);
		   this.ammo = 0;
			break;	
		case 9:	
			entityManager.blowtorch(this.aimX,this.aimY, this.aimVectorX/10,this.aimVectorY/10);
		    this.ammo = 0;
			break;	
			break;			
        default:
            return;
    }
};
