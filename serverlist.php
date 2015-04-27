<?php
	session_start();
	if (!isset($_SESSION['id']))
    header('Location: login.html');
?>
<!DOCTYPE html>
<head>
	<meta charset="UTF-8">
	<title> SquareWar - Server List </title>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<div id="window">
		<div><p>You are logged in as <?php echo htmlspecialchars($_SESSION['name']); ?>.</p></div>
		<div><a href="createserver.html">Create Server</a></div>
		<div>
			<table id="serverlist">
				<thead>
					<th>Server Name</th>
					<th>Players</th>
					<th>Status</th>
				</thead>
				<tbody>
					<?php
						try {
							$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
						}
						catch(Exception $e) {
							die('Erreur : '.$e->getMessage());
						}
						$req = $bdd->query('SELECT id, name, max_players, status FROM servers');
						while ($donnees = $req->fetch()) {
							$req1 = $bdd->prepare('SELECT COUNT(*) AS nb_players FROM players_in_servers WHERE idserver = ?');
							$req1->execute(array($donnees['id']));
							$resultat = $req1->fetch();
							$nb_players = $resultat['nb_players'];
							$req1->closeCursor();
						?>
						<tr onclick="location.href='join_server.php?idserver=<?php echo $donnees['id']; ?>'">
							<td><?php echo htmlspecialchars($donnees['name']); ?></td>
							<td><?php echo $nb_players . '/' . htmlspecialchars($donnees['max_players']); ?></td>
							<td><?php echo htmlspecialchars($donnees['status']); ?></td>
						</tr>
						<?php
						}
						$req->closeCursor();
					?>
				</tbody>
			</table>
		</div>
		<div><a href="logout.php">Log Out</a></div>
	</div>
</body>
</html>