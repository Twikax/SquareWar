var playersForm = [];
var player1 = document.querySelector('#gameConfig #player1');
player1.querySelector('input[type=checkbox]').addEventListener('change', function() { togglePlayerForm(event, 0); }, false)
playersForm.push(player1);
for (var i = 1; i < 9; i++)
{
	var player = player1.cloneNode(true);
	player.id = 'player' + i;
	player.querySelector('input[type=text]').value = 'Player' + (i+1);
	(function(i) {
		player.querySelector('input[type=checkbox]').addEventListener('change', function() { togglePlayerForm(event, i); }, false)
	})(i);
	playersForm.push(player);
}
for (var i = 0; i < 4; i++)
{
	document.querySelector('#gameConfig table tbody').appendChild(playersForm[i]);
	playersForm[i].querySelector('select').selectedIndex = i;
}
for (var i = 0; i < 2; i++)
{
	playersForm[i].querySelector('input[type=checkbox]').checked = true;
	playersForm[i].querySelector('input[type=checkbox]').disabled = true;
	playersForm[i].querySelector('input[type=text]').disabled = false;
	playersForm[i].querySelector('select').disabled = false;
}
view.createMap(10);

var mapScaleRange = document.querySelector('#gameConfig input[type=range]');
mapScaleRange.oninput = function(event){
	var value = event.target.value;
	document.body.removeChild(document.getElementById('map'));
	view.createMap(value);
	var myNode = document.querySelector('#gameConfig table tbody');
	while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
	}
	for (var i = 0; i < value/2.5; i++)
		document.querySelector('#gameConfig table tbody').appendChild(playersForm[i]);
}

var startButton = document.querySelector('#gameConfig input[type=submit]');
startButton.addEventListener('click', initGame, false);

function togglePlayerForm(event, p) {
	if (event.target.checked)
	{
		playersForm[p].querySelector('input[type=text]').disabled = false;
		playersForm[p].querySelector('select').disabled = false;
	}
	else
	{
		playersForm[p].querySelector('input[type=text]').disabled = true;
		playersForm[p].querySelector('select').disabled = true;
	}
}