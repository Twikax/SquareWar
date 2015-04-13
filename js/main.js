function initGame() {
	var mapScale = document.querySelector('#gameConfig input[type=range]').value;

	var players = [];
	var playersForm = document.querySelectorAll('#gameConfig table tbody tr');
	for (var i = 0; i < playersForm.length; i++)
		if (playersForm[i].querySelector('input[type=checkbox]').checked)
		{
			var name = playersForm[i].querySelector('input[type=text]').value;
			var e = playersForm[i].querySelector('select');
			var team = e.options[e.selectedIndex].value;
			players.push({name: name, team: team});
		}
	
	document.body.removeChild(document.getElementById('gameConfig'));
	document.body.removeChild(document.getElementById('map'));
	
	var game = new Game(mapScale);
	game.startGame(players);
}