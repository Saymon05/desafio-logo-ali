<?php
require('../../config.php');
$array = [];
$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'get') {
    $id = filter_input(INPUT_GET, 'id');

    if ($id) {
        $sql = $pdo->prepare("SELECT * FROM establishment WHERE id = :id");
        $sql->bindValue(':id', $id);
        $sql->execute();

        if ($sql->rowCount() > 0) {
            $data = $sql->fetch(PDO::FETCH_ASSOC);

            $array['result'] = [
                'id' => $data['id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'document' => $data['document'],
                'status' => $data['status']
            ];
        } else {
            $array['error'] = 'Estabelecimento não encontrado';
        }
    } else {
        $array['error'] = 'Id inválido';
    }
} else {
    $array['error'] = 'Método não permitido (somente GET)';
}

require('../../return.php');
?>