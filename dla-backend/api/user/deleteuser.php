<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'delete') {
    $id = filter_input(INPUT_GET, 'id');
    
    if ($id) {
        // Atualizando o status do usuário para false em vez de deletar
        $sql = $pdo->prepare("UPDATE user SET status = 0 WHERE id = :id");
        $sql->bindValue(':id', $id);
        $sql->execute();

        // Verificando se a atualização foi bem-sucedida
        if ($sql->rowCount() > 0) {
            $array['result'] = 'Usuário desativado com sucesso';
        } else {
            $array['error'] = 'Nenhum usuário encontrado com este ID';
        }
    } else {
        $array['error'] = 'ID inválido';
    }
} else {
    $array['error'] = 'Método não permitido (apenas DELETE)';
}

require('../../return.php');
?>
