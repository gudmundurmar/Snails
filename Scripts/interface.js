
var display = {

weaponActive : "",

p1Health : 0,
p2Health : 0,
currentWeapon : "",

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


	renderText : function (ctx, text, cx, cy, color){
		
		ctx.fillStyle = color;
		ctx.fillText(text, cx, cy);
		
	},
	
	renderInterface: function(ctx){
		ctx.strokeStyle="black";
		ctx.font="22px Arial";
		if(entityManager._SnailsP1.length !== 0){
			ctx.fillStyle="red";
			this.roundBox(ctx,800,700,this.p1Health,40,20, "blue",true);
			this.roundBox(ctx,700,700,90,40,20, "blue",true);
			
			this.renderText(ctx, "Player 1", 707, 725, "black");
			
		}
		
		
		if(entityManager._SnailsP2.length !== 0){
			ctx.fillStyle="blue";
			this.roundBox(ctx,800,750,this.p2Health,40,20, "red",true);
			this.roundBox(ctx,700,750,90,40,20, "red",true);
			this.renderText(ctx, "Player 2", 707, 775, "black");
		}
		
		ctx.fillText(entityManager.windThisTurn,200,200);
		this.roundBox(ctx,1600,725,200,40,20, "red",true);
		
		var bar = 500 * entityManager.windThisTurn;
		if(bar > 0){
			ctx.fillStyle="red";
			}
		else{
			ctx.fillStyle="blue";
			}
		ctx.fillRect(1700,727, bar, 35);
		ctx.fillStyle = "black";
		this.roundBox(ctx,50,700,100,100,20, "red",true);
		this.currentWeapon.drawCentredAt(ctx,100,750);
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
	
	renderActiveWeapon: function(_activeWeapon){
		this.currentWeapon = _activeWeapon;
	},
	
	renderArrow : function(ctx, cx, cy, color){
		if(color === "p1"){ctx.fillStyle = "red";}
		else{ctx.fillStyle = "blue";}
		
		ctx.save();
		ctx.beginPath();
		ctx.translate(cx,cy);
		ctx.moveTo(0,0);
		ctx.lineTo(5,20);
		ctx.lineTo(-5,20);
		ctx.closePath();
		ctx.restore();
		ctx.fill();
		},
		
	renderBox : function (ctx, cx, cy, width, height, color, stroke){
		if(stroke === undefined){ctx.strokeStyle = "rgba(1, 1, 1, 0)";}
		else{ctx.strokeStyle = stroke}
		ctx.strokeRect(cx,cy,width,height);
		ctx.lineWidth = 5;
		ctx.fillStyle = color;
		ctx.fillRect(cx,cy,width,height);	
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