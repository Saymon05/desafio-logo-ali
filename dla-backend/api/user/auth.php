<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'post') {
    // Obter dados da requisição
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

    if ($email && $password) {
        // Preparar a consulta para verificar o email
        $stmt = $pdo->prepare("SELECT * FROM user WHERE email = :email");
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Credenciais corretas
            $array['result'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'cpf' => $user['cpf'],
                'status' => $user['status'],
                'token' => $user['token'],
            ];
        } else {
            // Credenciais incorretas
            $array['error'] = 'Email ou senha inválidos.';
        }
    } else {
        $array['error'] = 'Email e senha são obrigatórios.';
    }
} else {
    $array['error'] = 'Método não permitido (apenas POST)';
}

require('../../return.php');
?>
