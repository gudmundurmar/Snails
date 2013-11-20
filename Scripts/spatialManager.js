
"use strict";


var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    delete this._entities[spatialID];
},

findEntityInRange: function(posX, posY, radius) {

    var Position;
    var sqDistance;
    var sqRad;
    for(var i in this._entities) {
        Position = this._entities[i].getPos();
        sqDistance = util.distSq(Position.posX, Position.posY, posX, posY);
        sqRad = Math.pow(radius+this._entities[i].getRadius(), 2);
        if(sqDistance - sqRad < 0) {
            return this._entities[i];
        }
    }
    return;
},

findSnailsInRange: function(posX,posY,radius){
    var Position;
    var sqDistance;
    var sqRad;
    var snails = new Array();
    for(var i = 0;i<entityManager._SnailsP1.length;i++){
        var snail = entityManager._SnailsP1[i];
        var position = snail.getPos();
        sqDistance = util.distSq(position.posX,position.posY,posX,posY);
        sqRad = Math.pow(radius+snail.getRadius(),2);
        if(sqDistance - sqRad<0){
            snails.push({worm: snail, distance: Math.sqrt(sqDistance)});
        }
    }
    for(var i = 0;i<entityManager._SnailsP2.length;i++){
        var snail = entityManager._SnailsP2[i];
        var position = snail.getPos();
        sqDistance = util.distSq(position.posX,position.posY,posX,posY);
        sqRad = Math.pow(radius+snail.getRadius(),2);
        if(sqDistance-sqRad<0){
            snails.push({worm: snail,distance: Math.sqrt(sqDistance)});
        }
    }
    return snails;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.cx, e.cy, e.getRadius());
    }
    ctx.strokeStyle = oldStyle;
}

}
