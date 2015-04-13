function Game(scale) {
	this.map = new Map(scale);
	
	this.playersList = [];
	this.weaponsList = [];
	this.gatesList = [];
	this.obstaclesList = [];
	this.medpacksList = [];
	
	this.getMap = function() {
		return this.map;
	}
	
	this.getNextPlayer = function(player) {
		var players = this.playersList;
		var index = players.indexOf(player);
		if (index+1 == players.length)
			return players[0];
		else
			return players[index+1];
	}
	
	this.addObstacle = function () {
		var obstacle = new Obstacle('obstacle' + (this.obstaclesList.length+1));
		this.obstaclesList.push(obstacle);
		this.map.addObject(obstacle, 'obstacle');
	}
	
	this.addMedpack = function () {
		var medpack = new Medpack('medpack' + (this.medpacksList.length+1));
		this.medpacksList.push(medpack);
		this.map.addObject(medpack, 'medpack');
	}
	
	this.addPlayer = function(name, team) {
		var weapon = new Weapon('weapon' + (this.weaponsList.length+1), 'rifle');
		this.weaponsList.push(weapon);
		var player = new Player('player' + (this.playersList.length+1), name, team, weapon);
		this.playersList.push(player);
		this.map.addObject(player, 'player');
		while (this.map.getOpponentInRange(player))
			this.map.setObjectCoordinates(player, this.map.getGrid().getRandomFreeCoordinates());
	}
	
	this.addWeapon = function(weaponName) {
		var weapon = new Weapon('weapon' + (this.weaponsList.length+1), weaponName);
		this.weaponsList.push(weapon);
		this.map.addObject(weapon, 'weapon');
	}
	
	this.addGate = function(color) {
		var gate1 = new Gate('gate' + (this.gatesList.length+1), '', color);
		this.gatesList.push(gate1);
		var gate2 = new Gate('gate' + (this.gatesList.length+1), gate1, color);
		this.gatesList.push(gate2);
		gate1.setPair(gate2);
		this.map.addObject(gate1, 'gate');
		this.map.addObject(gate2, 'gate');
	}
	
	this.startGame = function(players) {
		var scale = this.map.getScale();
		view.createMap(scale);
		for (var i = 0; i < scale; i++)
			this.addObstacle();
		for (var i = 0; i < scale*0.2; i++)
			this.addMedpack();
		for (var p in players)
			this.addPlayer(players[p].name, players[p].team);
		for (var i = 0; i < random(scale*0.2, scale*0.4); i++)
			this.addWeapon('random');
		for (var i = 0; i < scale*0.2; i++)
			this.addGate(['blue', 'red', 'yellow', 'green'][i]);
		view.createCSSClasses(this.playersList, this.weaponsList, this.gatesList);
		view.displayText('Game start');
		this.newTurn(this.playersList[random(0, this.playersList.length-1)]);
	}
	
	this.gameOver = function(lastTeamAlive) {
		view.displayText(lastTeamAlive + ' Team win');
	}
	
	this.newTurn = function(player) {
		this.map.removeDeadPlayers();
		view.refreshMap(this.map);
		var team = this.map.getLastTeamAlive();
		if (team)
		{
			this.gameOver(team);
			return;
		}
		if (player.isAlive())
			var opponent = this.map.getOpponentInRange(player);
		if (opponent)
			this.battleTurn(player, opponent);
		else
		{
			do
				player = this.getNextPlayer(player)
			while (!player.isAlive());
			this.movementTurn(player);
		}
	}
	
	this.movementTurn = function(player) {
		view.displayMovementSquares(this, this.map, player, this.map.getMovementSquares(player, this.playersList));
	}
	
	this.battleTurn = function(player1, player2) {
		view.playersLookThemselves(this.map, player1, player2);
		view.displayBattleMenu(this, player1, player2);
	}
	
	this.movePlayer = function(player, coordinates) {
		var cp = this.map.getObjectCoordinates(player), c = coordinates;
		var weapon = this.map.getObjectBetween(cp, c, 'weapon');
		if (weapon)
		{
			this.map.addObject(player.getWeapon());
			this.map.setObjectCoordinates(player.getWeapon(), this.map.getObjectCoordinates(weapon));
			this.map.removeObject(weapon);
			player.setWeapon(weapon);
		}
		var medpack = this.map.getObjectBetween(c, c, 'medpack');
		if (medpack)
		{
			this.map.removeObject(medpack);
			player.receiveHealth(medpack.getHealthAmount());
		}
		view.rotatePlayer(this.map, player, 0);
		var gate = this.map.getObjectBetween(c, c, 'gate');
		this.map.setObjectCoordinates(player, c);
		if (gate && !/^player/.exec(this.map.getGrid().getGridContent(this.map.getObjectCoordinates(gate.getPair()))))
			this.map.setObjectCoordinates(player, this.map.getObjectCoordinates(gate.getPair()));
		view.rotatePlayer(this.map, player, this.map.getGrid().getDirectionBetween(cp, c).deg);
	}
}