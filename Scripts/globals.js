// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
//GMG used in the background
//var g_imageData = g_ctx.createImageData(600, 600);

//pick map
var g_landNum = 1;

if(localStorage.getItem("g_landNum") !== undefined && localStorage.getItem("g_landNum") !== null )
	var g_landNum = parseInt(localStorage.getItem("g_landNum"));




// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;
