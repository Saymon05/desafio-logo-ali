'use client'
import "@/app/(page)/style.css";
import { inter } from "@/app/fonts/fonts";
import FlashMessage from "@/components/FlashMessage/page";
import Menu from "@/components/Menu/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(
          "http://localhost/desafio-logo-ali/dla-backend/api/user/validateToken.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ token })
          }
        );

        const data = await response.json();

        if (!data.result) {
          router.replace("/login"); // token inválido
        }
        // se for válido, continua na página
      } catch (err) {
        console.error(err);
        router.replace("/login"); // erro na requisição
      }
    };

    validateToken();
  }, [router]);

  const handleSubmit = async (e:any) => {
    e.preventDefault(); // evita refresh

    // Validações
    if (!name) return setErrorMessage("O campo nome é obrigatório.");
    if (name.length > 50) return setErrorMessage("O nome deve ter no máximo 50 caracteres.");

    if (!email) return setErrorMessage("O campo email é obrigatório.");
    if (!/\S+@\S+\.\S+/.test(email)) return setErrorMessage("Digite um email válido.");

    if (!password) return setErrorMessage("O campo senha é obrigatório.");
    if (password.length < 6) return setErrorMessage("A senha deve ter no mínimo 6 caracteres.");

    if (!cpf) return setErrorMessage("O campo CPF é obrigatório.");
    if (cpf.length > 14) return setErrorMessage("O CPF deve ter no máximo 14 caracteres.");

    // Envia para a API
    try {
      const response = await fetch(
        "http://localhost/desafio-logo-ali/dla-backend/api/user/insert.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            name,
            email,
            password,
            cpf
          })
        }
      );

      const data = await response.json();

      if (data.result) {
        // Resetar campos e mostrar sucesso
        setName("");
        setEmail("");
        setPassword("");
        setCpf("");
        setErrorMessage("");
        setSuccessMessage("Administrador criado com sucesso.");
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <main className={inter.className}>
      <Menu selected="user" />

      {errorMessage &&
        <FlashMessage message={errorMessage} status="error" title="Erro" onContinue={() => setErrorMessage("")} />
      }
      {successMessage &&
        <FlashMessage message={successMessage} status="success" title="Sucesso" onContinue={() => setSuccessMessage("")} />
      }

      <form className="form" onSubmit={handleSubmit}>
        <div className="formInfo">
          <h1>Criar Usuário</h1>
          <p>Adicione um novo usuário no seu sistema</p>
        </div>

        <div className="inputBox">
          <h3>Nome Completo</h3>
          <input
            placeholder="Entre com o nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="inputBox">
          <h3>Email</h3>
          <input
            placeholder="Entre com o email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inputBox">
          <h3>Senha</h3>
          <input
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="inputBox">
          <h3>CPF</h3>
          <input
            placeholder="XXX.XXX.XXX-XX"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <button className="submitButton" type="submit">Criar</button>
      </form>
    </main>
  );
}
