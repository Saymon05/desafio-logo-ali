<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'put') {
    // Recuperar dados enviados no corpo da requisição
    parse_str(file_get_contents("php://input"), $put_vars);

    $id = filter_var($put_vars['id'] ?? null, FILTER_VALIDATE_INT);
    $name = $put_vars['name'] ?? null;
    $description = $put_vars['description'] ?? null;
    $document = $put_vars['document'] ?? null;
    $status = isset($put_vars['status']) ? (int)$put_vars['status'] : null;

    if ($id) {
        // Verificar se o estabelecimento existe
        $checkId = $pdo->prepare("SELECT COUNT(*) FROM establishment WHERE id = :id");
        $checkId->bindValue(':id', $id);
        $checkId->execute();
        $idExists = $checkId->fetchColumn();

        if ($idExists > 0) {
            $set_parts = [];
            $params = [];

            // Validações + construção dinâmica da query
            if ($name) {
                if (strlen($name) > 50) {
                    $array['error'] = 'O campo nome deve ter no máximo 50 caracteres.';
                    require('../return.php'); exit;
                }
                $set_parts[] = 'name = :name';
                $params[':name'] = $name;
            }

            if ($description) {
                if (strlen($description) > 300) {
                    $array['error'] = 'O campo descrição deve ter no máximo 300 caracteres.';
                    require('../return.php'); exit;
                }
                $set_parts[] = 'description = :description';
                $params[':description'] = $description;
            }

            if ($document) {
                if (strlen($document) > 14) {
                    $array['error'] = 'O campo documento deve ter no máximo 14 caracteres.';
                    require('../return.php'); exit;
                }
                $set_parts[] = 'document = :document';
                $params[':document'] = $document;
            }

            if ($status !== null) {
                $set_parts[] = 'status = :status';
                $params[':status'] = $status;
            }

            if (count($set_parts) > 0) {
                $sql = "UPDATE establishment SET " . implode(', ', $set_parts) . " WHERE id = :id";
                $params[':id'] = $id;

                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);

                $array['result'] = 'Estabelecimento atualizado com sucesso.';
            } else {
                $array['error'] = 'Nenhum campo válido enviado para atualização.';
            }
        } else {
            $array['error'] = 'Estabelecimento não encontrado.';
        }
    } else {
        $array['error'] = 'ID inválido ou não fornecido.';
    }
} else {
    $array['error'] = 'Método não permitido (apenas PUT)';
}

require('../../return.php');
?>
