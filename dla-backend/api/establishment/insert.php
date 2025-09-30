<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'post') {
    $name = filter_input(INPUT_POST, 'name');
    $description = filter_input(INPUT_POST, 'description');
    $document = filter_input(INPUT_POST, 'document');

    if ($name && $description && $document) {
        // Validações de tamanho
        if (strlen($name) > 50) {
            $array['error'] = 'O campo nome deve ter no máximo 50 caracteres.';
        } elseif (strlen($description) > 300) {
            $array['error'] = 'O campo descrição deve ter no máximo 300 caracteres.';
        } elseif (strlen($document) > 14) {
            $array['error'] = 'O campo documento deve ter no máximo 14 caracteres.';
        } else {
            // Inserir novo estabelecimento
            $sql = $pdo->prepare("INSERT INTO establishment (name, description, document, status) 
                                  VALUES (:name, :description, :document, 1)");
            $sql->bindValue(':name', $name);
            $sql->bindValue(':description', $description);
            $sql->bindValue(':document', $document);
            $sql->execute();

            $array['result'] = [
                'id' => $pdo->lastInsertId(),
                'name' => $name,
                'description' => $description,
                'document' => $document,
                'status' => 1
            ];
        }
    } else {
        $array['error'] = 'Nome, descrição ou documento não enviados.';
    }
} else {
    $array['error'] = 'Método não permitido (apenas POST)';
}

require('../../return.php');
?>
