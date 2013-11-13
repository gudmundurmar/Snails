
var display = {

weaponActive : "",

p1Health : 0,
p2Health : 0,

	roundBox : function(ctx,x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == "undefined" ) {
			stroke = true;
			}
		if (typeof radius === "undefined") {
			radius = 5;
			}
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		
		if (stroke) {
			ctx.stroke();
		  }
		  if (fill) {
			ctx.fill();
		  }        
	},


	renderInterface: function(ctx){
		ctx.strokeStyle="black";
		ctx.fillStyle="blue";
		this.roundBox(ctx,800,700,this.p1Health,40,20, "blue",true);
		this.roundBox(ctx,700,700,90,40,20, "blue",true);
		ctx.fillStyle="red";
		this.roundBox(ctx,800,750,this.p2Health,40,20, "red",true);
		this.roundBox(ctx,700,750,90,40,20, "red",true);
		ctx.fillStyle="black";
		ctx.font="22px Arial";
		ctx.fillText("Player 1", 707,725);
		ctx.fillText("Player 2", 707,775);
		
		this.roundBox(ctx,1600,725,200,40,20, "red",true);
		var bar = 500 * entityManager.windThisTurn;
		if(bar < 0){
			ctx.fillStyle="red";
			}
		else{
			ctx.fillStyle="blue";
			}
		ctx.fillRect(1700,727, bar, 35);
		
	},
	
	findTotalHealth : function(){
	this.p1Health = 0;
	this.p2Health = 0;
	
		for(var i = 0 ; i < entityManager._SnailsP1.length; i++){
			this.p1Health += entityManager._SnailsP1[i].health;	
		}
		
		for(var i = 0 ; i < entityManager._SnailsP2.length; i++){
			this.p2Health += entityManager._SnailsP2[i].health;	
		}
	},
	
	
}


var animation = {
	
	renderSeaBack : function(ctx){
		g_sprites.sea.drawCentredAt(ctx,0,700);
		g_sprites.sea.drawCentredAt(ctx,200,700);
		g_sprites.sea.drawCentredAt(ctx,400,700);
		g_sprites.sea.drawCentredAt(ctx,600,700);
		g_sprites.sea.drawCentredAt(ctx,800,700);
		g_sprites.sea.drawCentredAt(ctx,1000,700);
		g_sprites.sea.drawCentredAt(ctx,1200,700);
		g_sprites.sea.drawCentredAt(ctx,1400,700);
		g_sprites.sea.drawCentredAt(ctx,1600,700);
		g_sprites.sea.drawCentredAt(ctx,1800,700);
	},
	
	renderSeaFront : function(ctx){
		g_sprites.sea.drawCentredAt(ctx,0,750);
		g_sprites.sea.drawCentredAt(ctx,200,750);
		g_sprites.sea.drawCentredAt(ctx,400,750);
		g_sprites.sea.drawCentredAt(ctx,600,750);
		g_sprites.sea.drawCentredAt(ctx,800,750);
		g_sprites.sea.drawCentredAt(ctx,1000,750);
		g_sprites.sea.drawCentredAt(ctx,1200,750);
		g_sprites.sea.drawCentredAt(ctx,1400,750);
		g_sprites.sea.drawCentredAt(ctx,1600,750);
		g_sprites.sea.drawCentredAt(ctx,1800,750);
	}

}