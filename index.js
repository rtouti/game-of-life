var canvas = document.getElementsByTagName("canvas")[0],
	ctx	   = canvas.getContext("2d");


function Grid(width, height, cellSize){
	this.w = width;
	this.h = height;
	this.cellSize = cellSize;
	
	this.imageData = ctx.createImageData(width*cellSize, height*cellSize);
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
Grid.prototype.fillRandom = function(threshold){
	var cs   = this.cellSize,
		w    = this.w,
		ww   = w*cs,
		h    = this.h,
		data = this.pixelData;
	
	/*for(var x = 0; x < w; x++){
		for(var y = 0; y < h; y++){
			if(Math.random() < threshold){
				var index = (x+y*w)*4;
				data[index]   = 255;
				data[index+1] = 255;
				data[index+2] = 255;
				data[index+3] = 255;
			}
		}
	}*/
	//console.log(data);
	
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

var backGrid  = new Grid(100, 100, 5),
	frontGrid = new Grid(100, 100, 5);
var grids = [frontGrid, backGrid];
grids[0].fillRandom(0.5);
console.log(grids[0].imageData);
function loop(){
	grids[1].update(grids[0]);
	
	var temp = grids[0];
	grids[0] = grids[1];
	grids[1] = temp;
	
	ctx.putImageData(grids[0].imageData, 0, 0);
	
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
/*window.setInterval(function(){
	loop();
}, 1000);*/


/*
function reverse(array){
	var revArray = [];
	for(var i = array.length-1; i >= 0; i--){
		revArray.push(array[i]);
	}
	
	return revArray;
}
function reverseInline(array){
	var min = 0, max = array.length-1;
	while(min < max){
		var temp = array[min];
		array[min] = array[max];
		array[max] = temp;
		min++;
		max--;
	}
	
	return array;
}
console.log(reverse([0, 1, 2, 3, 4, 5]));
console.log(reverseInline([0, 1, 2, 3, 4, 5]));
*/