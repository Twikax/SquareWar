<?php
	session_start();
	if (!isset($_SESSION['id']))
    header('Location: login.html');
	else
		header('Location: serverlist.php');
?>