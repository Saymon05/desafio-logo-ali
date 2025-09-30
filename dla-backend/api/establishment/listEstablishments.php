<?php
require('../../config.php');
$array = [];
$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'get') {
    // Receber parâmetros de paginação e busca
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['perPage']) ? (int)$_GET['perPage'] : 10;
    if ($perPage < 1) $perPage = 10;
    $search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : '%';

    $offset = ($page - 1) * $perPage;

    // Contar total de registros
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM establishment WHERE name LIKE :search");
    $countStmt->bindValue(':search', $search);
    $countStmt->execute();
    $total = (int)$countStmt->fetchColumn();

    // Buscar registros da página (todos, incluindo excluídos)
    $stmt = $pdo->prepare("SELECT * FROM establishment WHERE name LIKE :search ORDER BY id DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(':search', $search);
    $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $array['result'] = [
        'data' => $data,
        'total' => $total,
        'page' => $page,
        'perPage' => $perPage,
        'totalPages' => ceil($total / $perPage)
    ];
} else {
    $array['error'] = 'Method not allowed (only GET)';
}

require('../../return.php');