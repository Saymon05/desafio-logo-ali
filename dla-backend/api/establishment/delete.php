<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'delete') {
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if ($id) {
        // Atualizando o status do estabelecimento para 0 (desativado)
        $sql = $pdo->prepare("UPDATE establishment SET status = 0 WHERE id = :id");
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $array['result'] = 'Estabelecimento desativado com sucesso';
        } else {
            $array['error'] = 'Nenhum estabelecimento encontrado com este ID';
        }
    } else {
        $array['error'] = 'ID inválido';
    }
} else {
    $array['error'] = 'Método não permitido (apenas DELETE)';
}

require('../../return.php');
?>
