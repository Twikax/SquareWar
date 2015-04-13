function Map(scale) {
	this.scale = scale;
	
	this.grid = new Grid(this.scale);
	
	this.objectsList = {};
	
	this.getScale = function() {
		return this.scale;
	}
	
	this.getGrid = function() {
		return this.grid;
	}
	
	this.getObjectsList = function() {
		return this.objectsList;
	}
	
	this.getObjectCoordinates = function(object) {
		return this.objectsList[object.getId()].getCoordinates();
	}
	
	this.getOpponentInRange = function(player) {
		var cp = this.getObjectCoordinates(player), opponent;
		for (var l = 0; l < 2; l++)
			for (var i = 0; i < this.scale; i++)
			{
				var content = this.grid.getGridContent([{x: i, y: cp.y}, {x: cp.x, y: i}][l]);
				if (content && /^player/.exec(content))
				{
					var player1 = this.objectsList[content].getRef();
					if (player1.getTeam() != player.getTeam())
						if (!this.getObjectBetween(cp, this.getObjectCoordinates(player1), 'obstacle'))
							opponent = player1;
				}
			}
		return opponent;
	}
	
	this.getMovementSquares = function(player) {
		var cp = this.getObjectCoordinates(player);
		var movementSquares = [];
		var directions = [{x: 1, y: 0}, {x: 0, y: 1}, {x: Math.sign(-1), y: 0}, {x: 0, y: Math.sign(-1)}];
		for (var d in directions)
			for (var i = 0, x = directions[d].x, y = directions[d].y; i < 3; i++, x += directions[d].x, y += directions[d].y)
			{
				var c = {x: cp.x+x, y: cp.y+y};
				if (this.grid.getGridContent(c) == 'oob' || /^(player|obstacle)/.exec(this.grid.getGridContent(c)))
					break;
				movementSquares.push(c);
			}
		return movementSquares;
	}
	
	this.getObjectBetween = function(coordinates1, coordinates2, type) {
		var c1 = coordinates1, c2 = coordinates2, object;
		var distance = this.grid.getDistanceBetween(c1, c2);
		if (distance == 0)
			if (this.grid.getGridContent(c1) && this.objectsList[this.grid.getGridContent(c1)].getType() == type)
				return this.objectsList[this.grid.getGridContent(c1)].getRef();
		var direction = this.grid.getDirectionBetween(c1, c2).inc;
		for (var i = 0, x = direction.x, y = direction.y; i < distance; i++, x += direction.x, y += direction.y)
		{
			var c = {x: c1.x+x, y: c1.y+y};
			if (this.grid.getGridContent(c) && this.objectsList[this.grid.getGridContent(c)].getType() == type)
				object = this.objectsList[this.grid.getGridContent(c)].getRef();
		}
		return object;
	}
	
	this.setObjectCoordinates = function(object, coordinates) {
		this.objectsList[object.getId()].setCoordinates(coordinates);
		this.refresh();
	}
	
	this.getLastTeamAlive = function() {
		var objects = this.objectsList;
		for (var o in objects)
			if (objects[o].getType() == 'player')
			{
				var team = objects[o].getRef().getTeam();
				break;
			}
		for (var o in objects)
			if (objects[o].getType() == 'player' && objects[o].getRef().getTeam() != team)
				return '';
		return team;
	}
	
	this.addObject = function(object, type) {
		var id = object.getId();
		var obj = new Object(id, object, this.grid.getRandomFreeCoordinates(), type);
		this.objectsList[id] = obj;
		this.refresh();
	}
	
	this.removeObject = function(object) {
		delete this.objectsList[object.getId()];
		this.refresh();
	}
	
	this.removeDeadPlayers = function() {
		var objects = this.objectsList;
		for (var o in objects)
			if (objects[o].getType() == 'player' && !objects[o].getRef().isAlive())
			{
				view.removePlayerHeader(objects[o].getRef());
				this.removeObject(objects[o].getRef());
			}
	}
	
	this.refresh = function() {
		this.grid.clear();
		var objects = this.objectsList;
		for (var o in objects)
			if (objects[o].getType() != 'player')
				this.grid.setGridContent(objects[o].getCoordinates(), o);
		for (var o in objects)
			if (objects[o].getType() == 'player')
				this.grid.setGridContent(objects[o].getCoordinates(), o);
	}
}