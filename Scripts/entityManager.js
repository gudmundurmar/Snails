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

//_rocks   : [],
_bullets : [],
_ships   : [],
_Landscape  : [],
_SnailsP1 : [],
_SnailsP2 : [],
_Death : [],

_bShowRocks : true,

// "PRIVATE" METHODS

/*_generateRocks : function() {
    var i,
        NUM_ROCKS = 4;

    for (i = 0; i < NUM_ROCKS; ++i) {
        this.generateRock();
    }
},*/

_generateSnails : function() {
    var i,
        NUM_SNAILS = 2;

    for (i = 0; i < NUM_SNAILS; ++i) {
        this.generateSnail();
    }
},


_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._Landscape,/*this._rocks,*/ this._bullets,/* this._ships,*/this._SnailsP1,this._SnailsP2,this._Death];
},

init: function() {
    //this._generateRocks();
    //this._generateShip();
    this.generateLandscape();
	this._generateSnails();
	//this.generateSnail();
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

fireRocket: function(cx,cy,velX,velY/*,power*/){
    this._bullets.push(new Rocket({
        cx : cx,
        cy : cy,
        velX: velX,
        velY: velY
        //Add power
    }));
},



/*generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},*/

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


generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

/*toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},*/

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
changeWormP1 : 0,
changeWormP2 : 0,
changePlayer : "empty",

changeTurn : function (p1Worm, p2Worm, currentPlayer){
		
	//console.log(this._SnailsP1.length);
	//console.log(this._SnailsP2.length);
	//console.log(this.changeWorm);
	//console.log(this.changePlayer);
	//console.log("test");
	
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
},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
/*
        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;*/

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
},

renderLandscape: function(ctx, canvas) {
    for(var landscape in this._Landscape) {
        console.log('asdlfkjasdf'+landscape); 
        console.log(this._Landscape);
        this._Landscape[landscape].init(ctx, canvas);
    }
}
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();