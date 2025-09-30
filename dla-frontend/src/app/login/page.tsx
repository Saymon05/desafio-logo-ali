'use client'
import Head from "next/head";
import "@/app/login/style.css";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flashError, setFlashError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // não tem token, fica na página de login

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

        if (data.result) {
          router.replace("/"); // token válido, redireciona pra home
        } else {
          localStorage.removeItem("token"); // token inválido, limpa storage
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token"); // erro na requisição, limpar token
      }
    };

    validateToken();
  }, [router]);

  async function handleSubmit(e: any) {
    e.preventDefault();
      setFlashError("");

    // Validações
    if (!email) {
      setFlashError("O campo email é obrigatório!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFlashError("Digite um email válido!");
      return;
    }
    if (!password) {
      setFlashError("O campo senha é obrigatório!");
      return;
    }
    if (password.length < 3) {
      setFlashError("A senha deve ter pelo menos 3 caracteres!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/desafio-logo-ali/dla-backend/api/user/auth.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.result) {
        localStorage.setItem("token", data.result.token);
        router.push('/');
      } else if (data.error) {
        setFlashError(data.error);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="container">
        <div className="card">
          <h1 className="title">Login</h1>
          <p className="subtitle">Entre com seu email e sua senha</p>
          
          {flashError &&
            <p className="animate__animated animate__bounce flashError">{flashError}</p>
          }

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admn@example.com"
              className="input"
              name="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="input"
              name="password"
            />
            <button type="submit" className="button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
