<?php
	session_start();
	if (!isset($_GET['idserver']))
		header('Location: serverlist.php');
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}

	$req = $bdd->prepare('SELECT max_players FROM servers WHERE id = ?');
	$req->execute(array($_GET['idserver']));
	$resultat = $req->fetch();
	if (!$resultat) {
		header('Location: serverlist.php');
		exit();
	}
	$max_players = $resultat['max_players'];
	$req->closeCursor();
	
	$req = $bdd->prepare('SELECT COUNT(*) AS nb_players FROM players_in_servers WHERE idserver = ?');
	$req->execute(array($_GET['idserver']));
	$resultat = $req->fetch();
	$nb_players = $resultat['nb_players'];
	$req->closeCursor();
	
	if ($nb_players >= $max_players) {
		header('Location: serverlist.php');
		exit();
	}
	
	$req = $bdd->prepare('SELECT idplayer FROM players_in_servers WHERE idserver = ?');
	$req->execute(array($_GET['idserver']));
	while ($resultat = $req->fetch()) {
		if ($_SESSION['id'] == $resultat['idplayer']) {
			header('Location: lobby.php');
			exit();
		}
	}
	$req->closeCursor();
	
	$req = $bdd->prepare('INSERT INTO players_in_servers (idserver, idplayer, is_admin, slot, team) VALUES(?, ?, ?, ?, ?)');
	$req->execute(array($_GET['idserver'], $_SESSION['id'], 1, ($nb_players+1), 'blue'));
	$req->closeCursor();
	
	header('Location: lobby.php');
?>