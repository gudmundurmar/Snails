/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA


_bullets : [],
_Landscape  : [],
_SnailsP1 : [],
_SnailsP2 : [],
_Death : [],


// "PRIVATE" METHODS


_generateSnails : function() {
    var i,
        NUM_SNAILS = 2;

    for (i = 0; i < NUM_SNAILS; ++i) {
        this.generateSnail();
    }
	this.currentWind();
	display.findTotalHealth(); // þurfum að hafa þessi 2 hér í einskonar initial game()
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},


KILL_ME_NOW : -1,

deferredSetup : function () {
    this._categories = [this._Landscape,this._SnailsP1,this._SnailsP2,this._Death,this._bullets];
},

init: function() {
    this.generateLandscape();
	this._generateSnails();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},

fireRocket: function(cx,cy,velX,velY,power){
    this._bullets.push(new Rocket({
        cx : cx,
        cy : cy,
        velX: velX * power,
        velY: velY * power
    }));
},


//New background line
generateLandscape : function(descr) {
    this._Landscape.push(new Landscape(descr));
},

generateSnail : function(descr) {
    this._SnailsP1.push(new Snail(descr,"p1"));
    this._SnailsP2.push(new Snail(descr,"p2"));
	this._SnailsP1[0]._isActive = true;
	this._activeSnail = this._SnailsP1[0];
},

generateDeath : function(descr) {
    this._Death.push(new Death(descr));
},


update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;
		
        while (i < aCategory.length) {

            var status = aCategory[i].update(du);
			
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
		
    }
   this.changeTurn(this.changeWormP1,this.changeWormP2, this.changePlayer);
},

seaLevel : 680,

changeWormP1 : 0,
changeWormP2 : 0,
changePlayer : "empty",

changeTurn : function (p1Worm, p2Worm, currentPlayer){
	
	switch(currentPlayer){
	case "p1" :	if(p2Worm > entityManager._SnailsP2.length-1){p2Worm = 0;};	entityManager._SnailsP2[p2Worm]._isActive = true;
                this._activeSnail = this._SnailsP2[p2Worm];
				
                break;
	case "p2" :	if(p1Worm > entityManager._SnailsP1.length-1){p1Worm = 0;};	entityManager._SnailsP1[p1Worm]._isActive = true;
                this._activeSnail = this._SnailsP1[p1Worm];
                break;
	case "empty" : break;
	}
	this.changePlayer = "empty";
	display.findTotalHealth();
	
},

windThisTurn : 0,

currentWind : function(){

	var direction = Math.random() * 1;
	if(direction < 0.5){direction = 1;}
	else{direction = -1;}
	
	var maxWind = 0.15;
	var	minWind = 0;
		
	this.windThisTurn = util.randRange(minWind,maxWind) * direction;
	
},

render: function(ctx) {
    var debugX = 10, debugY = 100;
	
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
			
            aCategory[i].render(ctx);

        }
        debugY += 10;
    }
	animation.renderSeaFront(ctx);
	
	display.renderInterface(ctx);
},

renderLandscape: function(ctx, canvas) {
    for(var landscape in this._Landscape) {
        this._Landscape[landscape].init(ctx, canvas);
    }
}
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();