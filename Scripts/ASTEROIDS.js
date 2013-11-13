// =========
// Snails
// =========


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

var KEY_W = keyCode('W');
var KEY_S = keyCode('S');

function processDiagnostics() {



    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if(eatKey(KEY_1)) entityManager._activeSnail._weapon.changeGun(1);

    if(eatKey(KEY_2)) entityManager._activeSnail._weapon.changeGun(2);

    if(eatKey(KEY_3)) entityManager._activeSnail._weapon.changeGun(3);

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
        land   : "img/Whiteline.png",
		sea    : "img/sea.png",
		snail  : "img/army-snail.png",
		explosion : "img/explosion.png",
		aim: "img/aim.png",
        smg: "img/weapons/smg.png",
        shotgun: "img/weapons/shotgun.png",
        rocketlauncher:"img/weapons/rocketlauncher.png",
        rocket:"img/weapons/rocket.png"
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
    g_sprites.sea = new Sprite(g_images.sea);
	g_sprites.aim.scale = 0.25;
	
	loadExplosion(g_images.explosion);


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

// Kick it off
requestPreloads();