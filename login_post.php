<?php
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	$pass_hache = sha1($_POST['password']);
	$req = $bdd->prepare('SELECT id FROM players WHERE name = ? AND password = ?');
	$req->execute(array($_POST['name'], $pass_hache));
	$resultat = $req->fetch();
	if (!$resultat) {
		header('Location: login.html');
	}
	else {
		session_start();
		$_SESSION['id'] = $resultat['id'];
		$_SESSION['name'] = $_POST['name'];
		header('Location: serverlist.php');
	}
?>