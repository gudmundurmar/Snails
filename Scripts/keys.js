// =================
// KEYBOARD HANDLING
// =================

var keys = [];

function handleKeydown(evt) {

	var KEY_Y = keyCode('Y');
	var KEY_N = keyCode('N');

    keys[evt.keyCode] = true;
	if(entityManager.isFinished && evt.keyCode === KEY_Y){
		location.reload();
	}
	if(entityManager.isFinished && evt.keyCode === KEY_N){
		 history.go(-1);
	}
}

function handleKeyup(evt) {

	var SPACE = 32;

	if(evt.keyCode === SPACE){
	hasBeenShot = true;
	}
	keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    keys[keyCode] = false;
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
