<?php
require('../../config.php');

$method = strtolower($_SERVER['REQUEST_METHOD']);

if ($method === 'put') {
    // Recuperar dados do corpo da requisição PUT
    parse_str(file_get_contents("php://input"), $put_vars);

    $id = filter_var($put_vars['id'], FILTER_VALIDATE_INT);
    $nome = filter_var($put_vars['nome'], FILTER_SANITIZE_STRING);
    $email = filter_var($put_vars['email'], FILTER_SANITIZE_EMAIL);
    $password = filter_var($put_vars['password'], FILTER_SANITIZE_STRING);

    if ($id) {
        // Verificar se o e-mail já está cadastrado
        $checkEmail = $pdo->prepare("SELECT COUNT(*) FROM user WHERE email = :email");
        $checkEmail->bindValue(':email', $email);
        $checkEmail->execute();
        $emailExists = $checkEmail->fetchColumn();

        if ($emailExists > 0) {
            // E-mail já cadastrado
            $array['error'] = 'E-mail já cadastrado.';
        }else{
            // Verificar se o ID existe no banco de dados
            $checkId = $pdo->prepare("SELECT COUNT(*) FROM user WHERE id = :id");
            $checkId->bindValue(':id', $id);
            $checkId->execute();
            $idExists = $checkId->fetchColumn();

            if ($idExists > 0) {
                // Inicializar partes da consulta SQL e parâmetros
                $set_parts = [];
                $params = [];

                // Adicionar os campos à consulta SQL apenas se estiverem presentes
                if ($nome) {
                    $set_parts[] = 'nome = :nome';
                    $params[':nome'] = $nome;
                }
                if ($email) {
                    $set_parts[] = 'email = :email';
                    $params[':email'] = $email;
                }
                if ($cpf) {
                    $set_parts[] = 'cpf = :cpf';
                    $params[':cpf'] = $cpf;
                }
                if ($status) {
                    $set_parts[] = 'status = :status';
                    $params[':status'] = $status;
                }
                if ($password) {
                    $set_parts[] = 'password = :password';
                    $params[':password'] = password_hash($password, PASSWORD_DEFAULT);
                }

                if (count($set_parts) > 0) {
                    // Construir consulta SQL dinamicamente
                    $sql = "UPDATE user SET " . implode(', ', $set_parts) . " WHERE id = :id";
                    $params[':id'] = $id;

                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);

                    $array['result'] = 'user atualizado com sucesso.';
                } else {
                    $array['error'] = 'Nenhum campo para atualizar.';
                }
            } else {
                $array['error'] = 'ID do usuario nao encontrado.';
            }
        }
    } else {
        $array['error'] = 'ID do usuario nao fornecido ou invalido.';
    }
} else {
    $array['error'] = 'Metodo nao permitido (apenas PUT)';
}

require('../../return.php');
?>