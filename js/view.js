var view = {
	displayText: function(text) {
		var textnode = document.createTextNode(text);
		document.querySelector('p').appendChild(textnode);
		var s = document.getElementById('displayText').style;
		s.opacity = '1';
		s.top = '10px';
		view.animText();
	},
	
	animText: function() {
		var s = document.getElementById('displayText').style;
		opacity = s.opacity = parseFloat(s.opacity) - 0.01;
		s.top = (parseFloat(s.top.substring(0, s.top.indexOf('p'))) + 1) + 'px';
		if (opacity > 0)
			setTimeout(view.animText, 10);
		else
			document.querySelector('p').removeChild(document.querySelector('p').firstChild);
	},
	
	createCSSClasses: function(players, weapons, gates) {
		var style = document.createElement('style');
		style.type = 'text/css';
		for (var p in players)
			view.createPlayerHeader(players[p])
		for (var p in players)
			for (var w in weapons)
				style.innerHTML += ' .' + players[p].getId() + weapons[w].getId() + ' {background: url(img/players/' + players[p].getTeam() + '.png) no-repeat left bottom, url(img/weapons/' + weapons[w].getName() + '.png) no-repeat 85% 80%; background-size: 60% 100%, 60% 20%;}';
		for (var w in weapons)
			style.innerHTML += ' .' + weapons[w].getId() + ' {background: url(img/weapons/' + weapons[w].getName() + '.png) no-repeat center center; background-size: 100% 40%;}';
		for (var g in gates)
			style.innerHTML += ' .' + gates[g].getId() + ' {background: url(img/gates/' + gates[g].getColor() + '.png) no-repeat center center; background-size: 100% 100%;}';
		document.getElementsByTagName('head')[0].appendChild(style);
	},
	
	createPlayerHeader: function(player) {
		var id = player.getId();
		var name = player.getName();
		var header = document.createElement('div');
		header.id = 'header' + id;
		var playername = document.createElement('p');
		playername.innerHTML = name;
		var hpbar = document.createElement('div');
		hpbar.id = 'hpbar' + id;
		header.appendChild(playername);
		header.appendChild(hpbar);
		document.body.appendChild(header);
	},
	
	removePlayerHeader: function(player) {
		var id = player.getId();
		document.body.removeChild(document.getElementById('header' + id));
	},
	
	refreshPlayerHeader: function(player) {
		var id = player.getId();
		var dim = document.getElementById('0x0').offsetWidth;
		var header = document.getElementById('header' + id).style;
		header.width = parseFloat(dim*1.2) + 'px';
		var hpbar = document.getElementById('hpbar' + id).style;
		hpbar.width = player.getHealth() + '%';
		var rect = document.querySelector('.' + player.getId() + player.getWeapon().getId()).getBoundingClientRect();
		header.top = parseFloat(rect.top - dim*0.4) + 'px';
		header.left = parseFloat(rect.right - dim*1.1) + 'px';
		window.addEventListener('resize', function() { view.refreshPlayerHeader(player); }, false);
	},
	
	createMap: function(scale) {
		var ul = document.createElement('ul');
		ul.id = 'map';
		for (var i = 0; i < scale; i++)
		{
			var li = document.createElement('li');
			for (var j = 0; j < scale; j++)
			{
				var div = document.createElement('div');
				div.id = i + 'x' + j;
				li.appendChild(div);
			}
			ul.appendChild(li);
		}
		document.body.appendChild(ul);
	},
	
	refreshMap: function(map) {
		var width, height, table = map.getGrid().getTable();
		width = height = map.getScale();
		objects = map.getObjectsList();
		for (var i = 0; i < height; i++)
			for (var j = 0; j < width; j++)
				if (/^player/.exec(table[i][j]))
				{
					var player = objects[table[i][j]].getRef();
					document.getElementById(i + 'x' + j).className = player.getId() + player.getWeapon().getId();
					view.refreshPlayerHeader(player);
				}
				else
					document.getElementById(i + 'x' + j).className = table[i][j];
		
		var el = document.querySelector('body');
		var elClone = el.cloneNode(true);
		el.parentNode.replaceChild(elClone, el);
		
		document.getElementById('battleMenu').style.opacity = '0';
	},
	
	displayMovementSquares: function(game, map, player, movementSquares) {
		var cList = movementSquares;
		for (var c in cList)
		{
			var square = document.getElementById(cList[c].y + 'x' + cList[c].x);
			square.className += ' movementsquare';
			(function(coordinates) {
				square.addEventListener('mouseover', function(){ view.rotatePlayer(map, player, map.getGrid().getDirectionBetween(map.getObjectCoordinates(player), coordinates).deg); }, false);
				square.addEventListener('click', function(){ game.movePlayer(player, coordinates); }, false);
			})(cList[c]);
			square.addEventListener('click', function() { game.newTurn(player); }, false);
		}
	},

	displayBattleMenu: function(game, player, opponent) {
		var color = player.getTeam();
		var rect = document.querySelector('.' + player.getId() + player.getWeapon().getId()).getBoundingClientRect();
		var menu = document.getElementById('battleMenu').style;
		var dim = document.getElementById('0x0').offsetWidth;
		menu.top = parseFloat(rect.top + dim) + 'px';
		menu.left = parseFloat(rect.right - dim*1.55) + 'px';
		menu.boxShadow = '0 0 5px ' + color;
		menu.opacity = '1';
		var attackBtn = document.getElementById('attack');
		var defendBtn = document.getElementById('defend');
		var fleeBtn = document.getElementById('flee');
		attackBtn.addEventListener('click', function() { player.attack(opponent); }, false);
		defendBtn.addEventListener('click', player.defend, false);
		attackBtn.addEventListener('click', function() { game.newTurn(opponent); }, false);
		defendBtn.addEventListener('click', function() { game.newTurn(opponent); }, false);
		if (player.getHealth() > 50)
			fleeBtn.disabled = true;
		else
		{
			fleeBtn.disabled = false;
			fleeBtn.addEventListener('click', function() { game.movementTurn(player); }, false);
		}
		window.addEventListener('resize', function() { view.displayBattleMenu(game, player, opponent); }, false);
	},
	
	rotatePlayer: function(map, player, deg) {
		var p = map.getObjectCoordinates(player);
		document.getElementById(p.y + 'x' + p.x).style.transform = 'rotate(' + deg + 'deg)';
	},
	
	playersLookThemselves: function(map, player1, player2) {
		var p1angle = map.getGrid().getDirectionBetween(map.getObjectCoordinates(player1), map.getObjectCoordinates(player2)).deg;
		view.rotatePlayer(map, player1, p1angle);
		view.rotatePlayer(map, player2, p1angle + 180);
	}
}