var canvas = document.getElementsByTagName("canvas")[0],
	ctx	   = canvas.getContext("2d");


function Grid(width, height, cellSize){
	this.w = width/cellSize;
	this.h = height/cellSize;
	this.cellSize = cellSize;
	
	this.imageData = ctx.createImageData(width, height);
	this.pixelData = this.imageData.data;
}
//Update is called on the back grid
//Both grids must be the same size
Grid.prototype.update = function(frontGrid){
	var w  = this.w,
		h  = this.h,
		cs = this.cellSize,
		ww = w*cs;
	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			var count = 0;
			for(var j = -1; j <= 1; j++){
				for(var i = -1; i <= 1; i++){
					if(!(i == 0 && j == 0)){
						//Make sure the neighbor is inside the grid
						if(x+i >= 0 && x+i < w && y+j >= 0 && y+j < h){
							//If the cell is black (alive)
							//We can just verify the red component since
							//all the components have the same value (255 or 0)
							if(frontGrid.pixelData[(((x+i)*cs)+((y+j)*cs)*ww)*4] === 0)
								count++;
						}
					}
				}
			}
			
			var value = frontGrid.pixelData[((x*cs)+(y*cs)*ww)*4];
			var alive = (frontGrid.pixelData[((x*cs)+(y*cs)*ww)*4] === 0);
			if(!alive && count === 3)
				this.fillCell(x, y, 0);
			else if(alive && (count === 2 || count === 3))
				this.fillCell(x, y, value);
			else
				this.fillCell(x, y, 255);
		}
	}
}
Grid.prototype.fillCell = function(x, y, value){
	var cs   = this.cellSize,
		xcs  = x*cs,
		ycs  = y*cs,
		data = this.pixelData,
		w    = this.w,
		ww   = w*cs;
	for(var y = ycs; y < ycs+cs; y++){
		for(var x = xcs; x < xcs+cs; x++){
			var index = (x+y*ww)*4;
			data[index]   = value;
			data[index+1] = value;
			data[index+2] = value;
			data[index+3] = value;
		}
	}
}
//Threshold is the probability that a cell is dead
Grid.prototype.fillRandom = function(threshold){
	var cs   = this.cellSize,
		w    = this.w,
		ww   = w*cs,
		h    = this.h,
		data = this.pixelData;

	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			if(Math.random() < threshold){
				for(var j = 0; j < cs; j++){
					for(var i = 0; i < cs; i++){
						var index = ((x*cs+i)+(y*cs+j)*ww)*4;
						data[index]   = 255;
						data[index+1] = 255;
						data[index+2] = 255;
						data[index+3] = 255;
					}
				}
			}
		}
	}
}
Grid.prototype.renderGrid = function(size, color, ctx){
	var h  = this.h,
		w  = this.w,
		cs = this.cellSize;

	ctx.strokeStyle = color;
	for(var y = 0; y < h*cs; y+=size){
		ctx.strokeRect(0, y, w*cs, size);
	}
	for(var x = 0; x < w*cs; x+=size){
		ctx.strokeRect(x, 0, size, h*cs);
	}
}

var frontGrid = new Grid(500, 500, 10),
	backGrid  = new Grid(500, 500, 10),
	grids = [frontGrid, backGrid];
grids[0].fillRandom(0.5);

document.getElementById("start").addEventListener("click", function(e){
	running = true;
});
document.getElementById("pause").addEventListener("click", function(e){
	running = false;
});
document.getElementById("reset").addEventListener("click", function(e){
	grids[0].fillRandom(1.0);
	grids[1].fillRandom(1.0);
	ctx.putImageData(grids[0].imageData, 0, 0);
	
	running = false;
});
document.getElementById("speed").addEventListener("change", function(e){
	console.log(e);
	fps = parseInt(e.target.value);
	
	window.clearInterval(id);
	id = window.setInterval(function(){
		loop();
	}, Math.round(1000/fps));
});

var running = true;
var id;
var fps = 10;
function loop(){
	if(Mouse.isPressed()){
		var cs       = grids[0].cellSize,
			mousePos = Mouse.positionInElement(canvas),
			x        = Math.floor(mousePos.x/cs),
			y        = Math.floor(mousePos.y/cs),
			ww       = grids[0].w*cs;
			//pos      = patterns.glider;
		
		var color = 0;
		if(grids[0].pixelData[((x*cs)+(y*cs)*ww)*4] === 0)
			color = 255;
		for(var yy = y*cs; yy < y*cs+cs; yy++){
			for(var xx = x*cs; xx < x*cs+cs; xx++){
				var index = (xx+yy*ww)*4;
				grids[0].pixelData[index]   = color;
				grids[0].pixelData[index+1] = color;
				grids[0].pixelData[index+2] = color;
				grids[0].pixelData[index+3] = color;
			}
		}
		
		ctx.putImageData(grids[0].imageData, 0, 0);
	}
	
	if(running){
		grids[1].update(grids[0]);
		
		var temp = grids[0];
		grids[0] = grids[1];
		grids[1] = temp;
		
		ctx.putImageData(grids[0].imageData, 0, 0);
	}
	
	//Render the grid
	grids[0].renderGrid(10, "black", ctx);
	
	Mouse.update();
	
	//window.requestAnimationFrame(loop);
}
//window.requestAnimationFrame(loop);
id = window.setInterval(function(){
	loop();
}, 1000/fps);


