<?php
	session_start();
	if (!isset($_SESSION['id']))
    header('Location: login.html');
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	$req = $bdd->prepare('SELECT idserver FROM players_in_servers WHERE idplayer = ?');
	$req->execute(array($_SESSION['id']));
	$resultat = $req->fetch();
	if (!$resultat)
		header('Location: serverlist.php');
	$idserver = $resultat['idserver'];
	$req->closeCursor();
?>
<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<title> SquareWar - Lobby </title>
	<link rel="stylesheet" href="style.css">
</head>
<body onunload="location.href='leave_lobby.php'">
	<div id="gameConfig">
		<div>
			<label>Map Scale</label>
			<div>
				<input type="range" min="5" max="20" value="10">
			</div>
		</div>
		<div>
			<label>Players</label>
			<table align="center">
				<thead>
					<tr>
						<th>Name</th> 
						<th>Team</th>
					</tr>
				</thead>
				<tbody>
				<?php
					$req = $bdd->prepare('SELECT idplayer, team, slot FROM players_in_servers WHERE idserver = ? ORDER BY slot');
					$req->execute(array($idserver));
					while ($resultat = $req->fetch()) {
						$req1 = $bdd->prepare('SELECT name FROM players WHERE id = ?');
						$req1->execute(array($resultat['idplayer']));
						$name = $req1->fetch()['name'];
					?>
					<tr id="player<?php echo $resultat['slot']; ?>">
						<td><p><?php echo $name; ?></p></td> 
						<td>
						<?php
							if ($resultat['idplayer'] == $_SESSION['id']) {
						?>
							<select onchange="location.href='change_team.php?team=' + this.value">
								<option value="blue">Blue</option>
								<option value="red">Red</option>
								<option value="yellow">Yellow</option>
								<option value="green">Green</option>
							</select>
						<?php
							}
							else
								echo '<p>' . $resultat['team'] . '</p>';
						?>
						</td>
					</tr>
				<?php
					}
					$req->closeCursor();
				?>
				</tbody>
			</table>
		</div>
		<div>
			<input type="submit" value="Start Game">
		</div>
		<div><a href="leave_lobby.php">Leave lobby</a></div>
	</div>
	<div id="displayText">
		<p></p>
	</div>
	<div id="battleMenu">
		<button id="attack">Attack</button>
		<button id="defend">Defend</button>
		<button id="flee">Flee</button>
	</div>
	<script src="js/game/Game.js"></script>
	<script src="js/game/Map.js"></script>
	<script src="js/game/Grid.js"></script>
	<script src="js/objects/Object.js"></script>
	<script src="js/objects/environment/Player.js"></script>
	<script src="js/objects/items/Weapon.js"></script>
	<script src="js/objects/environment/Gate.js"></script>
	<script src="js/objects/items/Medpack.js"></script>
	<script src="js/objects/environment/Obstacle.js"></script>
	<script src="js/view.js"></script>
	<script src="js/misc.js"></script>
	<script src="js/main.js"></script>
</body>
</html>