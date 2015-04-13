function Grid(scale) {
	this.scale = scale;
	
	var table = [];
	for (var i = 0; i < this.scale; i++)
		table[i] = [];
	for (var i = 0; i < this.scale; i++)
		for (var j = 0; j < this.scale; j++)
			table[i][j] = '';
	
	this.table = table;
	
	this.getScale = function() {
		return this.scale;
	}
	
	this.getTable = function() {
		return this.table;
	}
	
	this.setGridContent = function(coordinates, content) {
		var c = coordinates;
		if (c.x < 0 || c.x >= this.scale || c.y < 0 || c.y >= this.scale)
			return;
		this.table[c.y][c.x] = content;
	}
	
	this.getGridContent = function(coordinates) {
		var c = coordinates;
		if (c.x < 0 || c.x >= this.scale || c.y < 0 || c.y >= this.scale)
			return 'oob';
		return this.table[c.y][c.x];
	}
	
	this.getDistanceBetween = function(coordinates1, coordinates2) {
		var c1 = coordinates1, c2 = coordinates2;
		if (c1.x == c2.x)
			return Math.abs(c1.y - c2.y);
		else
			return Math.abs(c1.x - c2.x);
	}
	
	this.getDirectionBetween = function(coordinates1, coordinates2) {
		var c1 = coordinates1, c2 = coordinates2;
		if (c1.x == c2.x)
			if (c1.y > c2.y)
				return {inc: {x: 0, y: Math.sign(-1)}, deg: 270};
			else
				return {inc: {x: 0, y: 1}, deg: 90};
		else
			if (c1.x > c2.x)
				return {inc: {x: Math.sign(-1), y: 0}, deg: 180};
			else
				return {inc: {x: 1, y: 0}, deg: 0};
	}
	
	this.getRandomFreeCoordinates = function() {
		do
			var c = {x: random(0, this.scale-1), y: random(0, this.scale-1)};
		while (!this.areCoordinatesFree(c));
		return c;
	}
	
	this.areCoordinatesFree = function(coordinates) {
		var c = coordinates;
		if (this.table[c.y][c.x] == '')
			return true;
		return false;
	}
	
	this.clear = function() {
		for (var i = 0; i < this.scale; i++)
			for (var j = 0; j < this.scale; j++)
				this.table[j][i] = '';
	}
}