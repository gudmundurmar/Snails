
"use strict";

var entityManager = {

// "PRIVATE" DATA


_bullets : [],
_Landscape  : [],
_SnailsP1 : [],
_SnailsP2 : [],
_Death : [],
_BigExplo : [],
_Rip : [],


// "PRIVATE" METHODS

hasStarted : false,
isFinished : false,

_generateSnails : function() {
    var i,
        NUM_SNAILS = 5;

    for (i = 0; i < NUM_SNAILS; ++i) {
        this.generateSnail();
    }
	this.currentWind();
	display.findTotalHealth(); // þurfum að hafa þessi 2 hér í einskonar initial game()
	if(g_sound)
		test.play();
	test.loop = true;
	test.volume = 0.3;
	
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},


KILL_ME_NOW : -1,

deferredSetup : function () {
    this._categories = [this._Landscape,this._SnailsP1,this._SnailsP2,this._Rip, this._Death,this._BigExplo, this._bullets];
},

init: function() {
    this.generateLandscape();
	this._generateSnails();
},

fireBullet: function(cx, cy, velX, velY, damage, owner, ammo) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
		owner : owner,

        damage : damage
    }));
},

fireRocket: function(cx,cy,velX,velY,power, owner){
    this._bullets.push(new Rocket({
        cx : cx,
        cy : cy,
        velX: velX * power,
        velY: velY * power,
		owner: owner
		
    }));
},

throwHoly: function(cx,cy,velX,velY,power, owner){
    this._bullets.push(new Holy({
        cx : cx,
        cy : cy,
        velX: velX * power,
        velY: velY * power,
		owner: owner
		
    }));
},
throwGrenade: function(cx,cy,velX,velY,power, owner){
    this._bullets.push(new Grenade({
        cx : cx,
        cy : cy,
        velX: velX * power,
        velY: velY * power,
		owner: owner
		
    }));
},

airStrike: function(start, aimObject){
    this._bullets.push(new Airstrike({
		cx : 0,
        target : aimObject
		
    }));
},

teleportSnail: function(targetX, targetY){
    var xTele = this._activeSnail.cx;
    var yTele = this._activeSnail.cy;
	
	this._activeSnail.cx = targetX;
	this._activeSnail.cy = targetY;
	
	this._bullets.push(new Teleport({
		fromcx : xTele,
		fromcy : yTele,
		cx : targetX,
        cy : targetY
		
    }));
},

baseBall: function(cx, cy){
    this._bullets.push(new Baseball({
		cx : cx,
        cy : cy
		
    }));
},

blowtorch: function(cx,cy, velX, velY){

	this._bullets.push(new Blowtorch({
		cx : cx,
		cy : cy,
		xVel : velX,
        yVel : velY
		
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

generateBigExplo : function(descr) {
	this._BigExplo.push(new BigExplo(descr));
},

generateRip : function(descr) {
	this._Rip.push(new Rip(descr));
},


landedSnails : function(){
	
	var allLanded = 0;
	
	for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
		if(entityManager._SnailsP1[i].isCollidingBottom === true){
			allLanded++;
		}	
		if(entityManager._SnailsP2[i].isCollidingBottom === true){
			allLanded++;
		}	
	}
	if(allLanded === (entityManager._SnailsP1.length + entityManager._SnailsP2.length)){
		
		this.hasStarted = true;
		}
	
},

readyForTurn : function(){
	
	var finished = 0;
	
	for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
		if(entityManager._SnailsP1[i].isCollidingBottom === true){
			finished++;
		}	}
	for(var i = 0 ; i < entityManager._SnailsP2.length; i++){

		if(entityManager._SnailsP2[i].isCollidingBottom === true){
			finished++;
		}	
	}
	if(finished === (entityManager._SnailsP1.length + entityManager._SnailsP2.length)){
		
		return true;
		}
	
},

getShotsNotExploded: function() {
    return this._bullets.length;
},

getLandscape: function() {

	return this._Landscape[0];
},

seaOffset: 0,
seaLevel : 680,

update: function(du) {
	if(this.hasStarted === false){this.landedSnails();}
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
	
	this.updateSea = du;
	
},

changeWormP1 : 0,
changeWormP2 : 0,
changePlayer : "empty",

changeTurn : function (p1Worm, p2Worm, currentPlayer){
	
	switch(currentPlayer){
	case "p1" :	if(p2Worm > entityManager._SnailsP2.length-1){
					this.changeWormP2 = 0;
					p2Worm = 0;
					};
				entityManager._SnailsP2[p2Worm]._isActive = true;
                this._activeSnail = this._SnailsP2[p2Worm];
				this._activeSnail.turnTime = 20 * SECS_TO_NOMINALS;
				this.currentWind();
                break;
				
	case "p2" :	if(p1Worm > entityManager._SnailsP1.length-1){
					this.changeWormP1 = 0;
					p1Worm = 0;
					};	
				entityManager._SnailsP1[p1Worm]._isActive = true;
                this._activeSnail = this._SnailsP1[p1Worm];
                this._activeSnail.turnTime = 20 * SECS_TO_NOMINALS;
				this.currentWind();
                break;
	case "empty" : break;
	}
	this.changePlayer = "empty";
	
	display.findTotalHealth();
},

windThisTurn : 0,
windDirection : 1,
updateSea : 0 ,

currentWind : function(){
	

	var direction = Math.random() * 1;
	if(direction < 0.5){direction = 1;
						this.windDirection = 1}
	else{direction = -1;
		this.windDirection = -1;}
	
	var maxWind = 0.15;
	var	minWind = 0;
		
	this.windThisTurn = util.randRange(minWind,maxWind) * direction;
	this.seacx = 0;
	
},

seacx : 0,

render: function(ctx) {
    var debugX = 10, debugY = 100;
	
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
			
            aCategory[i].render(ctx);

        }
        debugY += 10;
    }
	
	var moveSea = this.windDirection+this.updateSea*this.windThisTurn*10;
	this.seacx += moveSea*1.1;
	animation.renderSeaBack(ctx,(this.seacx));
	animation.renderSeaFront(ctx,(this.seacx));
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
