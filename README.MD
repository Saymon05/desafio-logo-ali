# Projeto Desafio Logo Ali

Este projeto é uma aplicação completa para gestão de usuários e estabelecimentos, com backend em PHP e frontend em Next.js. A aplicação inclui autenticação, CRUD de usuários e estabelecimentos, paginação, busca, ativação/desativação de registros e interface responsiva.

---

## 🔹 Tecnologias Utilizadas

- **Frontend:** Next.js, React
- **Backend:** PHP, PDO, MySQL  
- **Banco de Dados:** MySQL (pode ser usado via XAMPP)  
- **Extras:** LocalStorage para persistência de token, fetch API para comunicação frontend-backend  

---

## 🚀 Como Rodar o Backend

1. Baixe e instale o [XAMPP](https://www.apachefriends.org/index.html).  
2. Inicie **Apache** e **MySQL**.  
3. Importe o arquivo SQL do projeto no seu client de banco de dados (ele está na raiz do projeto).  
4. Acesse os endpoints da API via navegador ou Postman:


5. Endpoints disponíveis:

**User**
- `auth.php` – autenticação de usuários  
- `get.php` – obter um usuário específico  
- `getAll.php` – listar todos os usuários  
- `insert.php` – criar um novo usuário  
- `updateuser.php` – atualizar dados de usuário  
- `validateToken.php` – validar token de login  

**Establishment**
- `insert.php` – criar estabelecimento  
- `delete.php` – deletar estabelecimento  
- `get.php` – obter um estabelecimento específico  
- `getAll.php` – listar todos os estabelecimentos  
- `toggleEstablishmentStatus.php` – ativar/desativar estabelecimento  
- `listEstablishments.php` – listar estabelecimentos com paginação  
- `update.php` – atualizar dados de estabelecimento  

💡 **Teste rápido da API:**  



---

## 🚀 Como Rodar o Frontend

1. Certifique-se de ter [Node.js](https://nodejs.org/) instalado.  

2. No terminal, navegue até a pasta do frontend:  

3. Instale as dependências:  

4. Rode o projeto em modo desenvolvimento:  

5. Acesse a aplicação via navegador:  


---

## 🎯 Funcionalidades Implementadas

- Autenticação e validação de token  
- CRUD completo de usuários e estabelecimentos  
- Paginação, busca e filtros em listagens  
- Ativação/desativação de estabelecimentos  
- Layout responsivo e estilizado  
- Flash messages para feedback de erros e sucesso  
- Redirecionamento automático com base na autenticação  

---

## 💎 Bônus Implementados

- Confirmação antes de ações críticas (ex.: logout, desativar estabelecimento)  
- Persistência do token no `localStorage`  
- Interface moderna e responsiva seguindo protótipo do Figma  
- Botões de ação dinâmicos de acordo com o status do registro  

---

## 🎨 Protótipo no Figma

[Link para o protótipo](https://www.figma.com/design/MMaK3aEJNJqVriYJ1YEejj/Frontend-vaga?node-id=0-1&t=w0Knf5Wqj3UeMl3w-1)

---

## 📝 Observações

- Certifique-se de que o XAMPP está rodando antes de iniciar o frontend.  
- Todas as requisições ao backend devem ser feitas com token válido.  
- A aplicação segue boas práticas de segurança, separando backend e frontend e usando prepared statements para queries SQL.