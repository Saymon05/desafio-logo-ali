<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'post') {
    $name = filter_input(INPUT_POST, 'name');
    $email = filter_input(INPUT_POST, 'email');
    $password = filter_input(INPUT_POST, 'password');
    $cpf = filter_input(INPUT_POST, 'cpf');

    if ($name && $email && $password) {
        // Verificar se o e-mail já está cadastrado
        $checkEmail = $pdo->prepare("SELECT COUNT(*) FROM user WHERE email = :email");
        $checkEmail->bindValue(':email', $email);
        $checkEmail->execute();
        $emailExists = $checkEmail->fetchColumn();

        if ($emailExists > 0) {
            // E-mail já cadastrado
            $array['error'] = 'E-mail já cadastrado.';
        } else {
            // Inserir novo usuário
            $token = md5($email); // Gerando token usando MD5 baseado no email

            $sql = $pdo->prepare("INSERT INTO user (name, email, password, cpf, token) VALUES (:name, :email, :password, :cpf, :token)");
            $sql->bindValue(':name', $name);
            $sql->bindValue(':email', $email);
            $sql->bindValue(':cpf', $cpf);
            $sql->bindValue(':password', password_hash($password, PASSWORD_DEFAULT)); // Armazenando a senha de forma segura
            $sql->bindValue(':token', $token);
            $sql->execute();
            
            $array['result'] = [
                'id' => $pdo->lastInsertId(),
                'name' => $name,
                'email' => $email,
                'token' => $token
            ];
        }
    } else {
        $array['error'] = 'Nome, email, senha ou cpf não enviado(s).';
    }
} else {
    $array['error'] = 'Método não permitido (apenas POST)';
}

require('../../return.php');
?>
