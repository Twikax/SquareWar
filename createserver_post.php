<?php
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	$req = $bdd->prepare('INSERT INTO servers (name, max_players, status) VALUES(?, ?, ?)');
	$req->execute(array($_POST['servername'], $_POST['maxplayers'], 'preparing'));
	header('Location: serverlist.php');
?>