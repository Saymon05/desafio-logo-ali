<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "desafio_logo_ali";

try{
    $pdo = new PDO("mysql:dbname=".$dbname.";host=".$servername, $username, $password);
    //echo "Connection established successfully.";
}catch(PDOException $e){
    echo "It was not possible to connect to the database. Erro: " . $e->getMessage();
}