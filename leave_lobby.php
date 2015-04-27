<?php
	session_start();
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	
	$req = $bdd->query('DELETE FROM players_in_servers WHERE idplayer = ' . $_SESSION['id']);
	
	header('Location: serverlist.php');
?>