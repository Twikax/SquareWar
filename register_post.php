<?php
	try {
		$bdd = new PDO('mysql:host=localhost;dbname=squarewar;charset=utf8', 'root', '');
	}
	catch (Exception $e) {
		die('Erreur : ' . $e->getMessage());
	}
	$pass_hache = sha1($_POST['password']);
	$req = $bdd->prepare('INSERT INTO players (name, password, email) VALUES(?, ?, ?)');
	$req->execute(array($_POST['name'], $pass_hache, $_POST['email']));
	header('Location: login.html');
?>