<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'post') {
    // Obter token da requisição
    $token = filter_input(INPUT_POST, 'token', FILTER_SANITIZE_STRING);

    if ($token) {
        // Preparar consulta para verificar token
        $stmt = $pdo->prepare("SELECT * FROM user WHERE token = :token");
        $stmt->bindValue(':token', $token);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Token válido, retornar dados do usuário
            $array['result'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'cpf' => $user['cpf'],
                'status' => $user['status'],
            ];
        } else {
            // Token inválido
            $array['error'] = 'Token inválido ou usuário não encontrado.';
        }
    } else {
        $array['error'] = 'Token não enviado.';
    }
} else {
    $array['error'] = 'Método não permitido (apenas POST)';
}

require('../../return.php');
?>
