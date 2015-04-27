<?php
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	
	$req = $bdd->query('SELECT COUNT(*) AS nb_servers FROM servers');
	$resultat = $req->fetch();
	$id = $resultat['nb_servers']+1;
	$req->closeCursor();
	
	$req = $bdd->prepare('INSERT INTO servers (id, name, max_players, status) VALUES(?, ?, ?, ?)');
	$req->execute(array($id, $_POST['servername'], $_POST['maxplayers'], 'preparing'));
	$req->closeCursor();
	
	header('Location: join_server.php?idserver=' . $id);
?>