<?php
require('../../config.php');
$array = [];
$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'post') {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);

    if (!$id || !$action) {
        $array['error'] = 'ID e ação são obrigatórios.';
    } else {
        // Verifica se o estabelecimento existe
        $stmt = $pdo->prepare("SELECT status FROM establishment WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $est = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$est) {
            $array['error'] = 'Estabelecimento não encontrado.';
        } else {
            // Define o novo status
            if ($action === 'disable') {
                $newStatus = 0;
            } elseif ($action === 'enable') {
                $newStatus = 1;
            } else {
                $array['error'] = 'Ação inválida.';
            }

            if (!isset($array['error'])) {
                $update = $pdo->prepare("UPDATE establishment SET status = :status WHERE id = :id");
                $update->bindValue(':status', $newStatus, PDO::PARAM_INT);
                $update->bindValue(':id', $id, PDO::PARAM_INT);
                $update->execute();

                $array['result'] = [
                    'id' => $id,
                    'newStatus' => $newStatus,
                    'message' => $newStatus === 1 ? 'Estabelecimento ativado.' : 'Estabelecimento desativado.'
                ];
            }
        }
    }
} else {
    $array['error'] = 'Método não permitido (apenas POST).';
}

require('../../return.php');
?>
