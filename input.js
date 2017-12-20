var Mouse = {
	x: 0,
	y: 0,
	down: false,
	previousDown: false,
	
	update: function(){
		this.previousDown = this.down;
	},
	positionInElement: function(elem){
		var rect = elem.getBoundingClientRect();
		
		return {x:this.x-rect.left, y:this.y-rect.top};
	},
	isDown: function(){
		return this.down;
	},
	isPressed: function(){
		return this.down && !this.previousDown;
	}
};

window.addEventListener("mousemove", function(e){
	Mouse.x = e.clientX;
	Mouse.y = e.clientY;
});
window.addEventListener("mousedown", function(e){
	Mouse.down = true;
});
window.addEventListener("mouseup", function(e){
	Mouse.down = false;
});