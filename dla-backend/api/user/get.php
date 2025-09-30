<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);
$array = [];

if ($method === 'get') {
    $id = filter_input(INPUT_GET, 'id');
    
    if ($id) {
      $sql = $pdo->prepare("SELECT * FROM user WHERE id = :id");
      $sql->bindValue(':id', $id);
      $sql->execute();

      if($sql->rowCount() > 0){
        $data = $sql->fetch(PDO::FETCH_ASSOC);

        $array['result'] = [
          'id' => $data['id'],
          'name' => $data['name'],
          'cpf' => $data['cpf'],
          'status' => $data['status'],
          'token' => $data['token'],
          'email' => $data['email'],
        ];
      }

    }else{
      $array['error'] = 'Id inexistente';
    }

} else {
    $array['error'] = 'Método não permitido (apenas GET)';
}

require('../../return.php');
?>