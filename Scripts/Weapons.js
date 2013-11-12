//Weapons class
//
"use strict";

//Erfi ekki fra entity, a ekki alveg vid.
function Weapon(descr) {
 for (var property in descr) {
        this[property] = descr[property];
    }
};