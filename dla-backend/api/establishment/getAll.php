<?php
require('../../config.php');
$array = [];
$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'get') {
    $sql = $pdo->query("SELECT * FROM establishment WHERE status != 0");

    if ($sql->rowCount() > 0) {
        $data = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($data as $item) {
            $array['result'][] = [
                'id' => $item['id'],
                'name' => $item['name'],
                'description' => $item['description'],
                'document' => $item['document'],
                'status' => $item['status']
            ];
        }
    }
} else {
    $array['error'] = 'Method not allowed (only GET)';
}

require('../../return.php');
?>
