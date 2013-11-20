// =================
// KEYBOARD HANDLING
// =================

var keys = [];

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
	if(entityManager.isFinished && evt.keyCode === 89){
		location.reload();
	}
	if(entityManager.isFinished && evt.keyCode === 78){
		 history.go(-1);
	}
}

function handleKeyup(evt) {

	if(evt.keyCode === 32){
	hasBeenShot = true;
	}
	keys[evt.keyCode] = false;
	//console.log(evt.keyCode);
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
