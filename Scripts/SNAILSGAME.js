// =========
// Snails
// =========
//

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Snail.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');
var KEY_3 = keyCode('3');
var KEY_4 = keyCode('4');
var KEY_5 = keyCode('5');
var KEY_6 = keyCode('6');
var KEY_7 = keyCode('7');
var KEY_8 = keyCode('8');
var KEY_9 = keyCode('9');

var KEY_W = keyCode('W');
var KEY_S = keyCode('S');

var KEY_M = keyCode('M');

function processDiagnostics() {



    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    //AudioListener.volume


    if(eatKey(KEY_1)) entityManager._activeSnail._weapon.changeGun(1);

    if(eatKey(KEY_2)) entityManager._activeSnail._weapon.changeGun(2);

    if(eatKey(KEY_3)) entityManager._activeSnail._weapon.changeGun(3);
	
    if(eatKey(KEY_4)) entityManager._activeSnail._weapon.changeGun(4);
	
    if(eatKey(KEY_5)) entityManager._activeSnail._weapon.changeGun(5);
	
    if(eatKey(KEY_6)) entityManager._activeSnail._weapon.changeGun(6);
	
    if(eatKey(KEY_7)) entityManager._activeSnail._weapon.changeGun(7);
	
    if(eatKey(KEY_8)) entityManager._activeSnail._weapon.changeGun(8);
	
    if(eatKey(KEY_9)) entityManager._activeSnail._weapon.changeGun(9);

}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        land   : "img/Whiteline"+g_landNum+".png",
		sea    : "img/sea.png",
		snail  : "img/army-snail.png",
		explosion : "img/explosion.png",
		bigexplosion: "img/HugeExplSprite.png",
		aim: "img/aim.png",
        smg: "img/weapons/smg.png",
        shotgun: "img/weapons/shotgun.png",
        rocketlauncher:"img/weapons/rocketlauncher.png",
        rocket:"img/weapons/rocket.png",
        holy:"img/weapons/holygrenade.png",
        grenade:"img/weapons/grenade.png",
        airstrike:"img/weapons/airstrike.png",
        teleport:"img/teleport.png",
        teleportaim:"img/weapons/teleportaim.png",
        teleportaim1:"img/weapons/teleportaim1.png",
        bat:"img/weapons/bat.png",
        cap:"img/weapons/cap.png",
        blow:"img/weapons/blow.png",
        fire:"img/weapons/fire.png",
		rip : "img/rip.png",
	slime1:"img/slime/slime1.png",
	slime2:"img/slime/slime3.png",
	slime3:"img/slime/slime3.png"
    };
    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};


function preloadDone() {


    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;

    g_sprites.land = new Sprite(g_images.land);
	g_sprites.snail = new Sprite(g_images.snail);
	g_sprites.aim = new Sprite(g_images.aim);
    g_sprites.smg = new Sprite(g_images.smg);
    g_sprites.shotgun = new Sprite(g_images.shotgun);
    g_sprites.rocketlauncher = new Sprite(g_images.rocketlauncher);
    g_sprites.rocket = new Sprite(g_images.rocket);
    g_sprites.holy = new Sprite(g_images.holy);
    g_sprites.sea = new Sprite(g_images.sea);
    g_sprites.grenade = new Sprite(g_images.grenade);
    g_sprites.airstrike = new Sprite(g_images.airstrike);
    g_sprites.teleportaim = new Sprite(g_images.teleportaim);
    g_sprites.teleportaim1 = new Sprite(g_images.teleportaim1);
    g_sprites.bat = new Sprite(g_images.bat);
    g_sprites.cap = new Sprite(g_images.cap);
    g_sprites.blow = new Sprite(g_images.blow);
    g_sprites.fire = new Sprite(g_images.fire);
    g_sprites.rip = new Sprite(g_images.rip);
	g_sprites.slime1 = new Sprite(g_images.slime1);
	g_sprites.slime2 = new Sprite(g_images.slime2);
	g_sprites.slime3 = new Sprite(g_images.slime3);

	
	loadExplosion(g_images.explosion);
	loadBigExplosion(g_images.bigexplosion);
	loadTeleport(g_images.teleport);
	loadSlime();

    entityManager.init();

    entityManager.renderLandscape(g_ctx, g_canvas);
    
    main.init();
}

var g_explosion = [];

function loadExplosion(exploImage){

	var celWidth  = 64;//320
	var celHeight = 64;//320
	var numCols = 5;
	var numRows = 5;
	var numCels = 25;

	var exploSprite;

	for (var row = 0; row < numRows; ++row) {
        	for (var col = 0; col < numCols; ++col) {
        	    exploSprite = new Explosionsprite(col * celWidth, row * celHeight,
        	                        celWidth, celHeight,exploImage); 
        	    g_explosion.push(exploSprite);
        	}
	}

	g_explosion.splice(numCels);		
}

var g_bigexplosion = [];

function loadBigExplosion(bigExploImage){

	var celWidth  = 110;//660
	var celHeight = 110;//440
	var numCols = 6;
	var numRows = 4;
	var numCels = 24;

	var exploSprite;


	for (var row = 0; row < numRows; ++row) {
        	for (var col = 0; col < numCols; ++col) {
        	    exploSprite = new Explosionsprite(col * celWidth, row * celHeight,
                	                celWidth, celHeight,bigExploImage); 
            		g_bigexplosion.push(exploSprite);
        	}
	}

	g_bigexplosion.splice(numCels);
		
}


var g_teleport = [];

function loadTeleport(teleImage){

	var celWidth  = 200;
	var celHeight = 200;
	var numCols = 5;
	var numRows = 2;
	var numCels = 10;

	var teleSprite;

	for (var row = 0; row < numRows; ++row) {
        	for (var col = 0; col < numCols; ++col) {
        	    teleSprite = new Explosionsprite(col * celWidth, row * celHeight,
        	                        celWidth, celHeight,teleImage); 
        	    g_teleport.push(teleSprite);
        	}
	}

	g_teleport.splice(numCels);		
}

var g_slime = [];

function loadSlime()
{
	g_slime.push(g_sprites.slime1);
	g_slime.push(g_sprites.slime2);
	g_slime.push(g_sprites.slime3);

	g_slime.splice(3);
}

// Kick it off
requestPreloads();