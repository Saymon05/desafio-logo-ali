'use client';
import "@/app/novoestabelecimento/style.css";
import { inter } from "@/app/fonts/fonts";
import FlashMessage from "@/components/FlashMessage/page";
import Menu from "@/components/Menu/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NovoEstabelecimento() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState("");
  const [status, setStatus] = useState("ativo");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Validar token
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
            body: new URLSearchParams({ token }),
          }
        );
        const data = await response.json();
        if (!data.result) router.replace("/login");
      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    validateToken();
  }, [router]);

  // Submissão do formulário
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // previne refresh
    setErrorMessage("");
    setSuccessMessage("");

    // Validações
    if (!name) return setErrorMessage("O campo nome é obrigatório.");
    if (!description) return setErrorMessage("O campo descrição é obrigatório.");
    if (!document) return setErrorMessage("O campo documento é obrigatório.");

    if (name.length > 50) return setErrorMessage("O nome deve ter no máximo 50 caracteres.");
    if (description.length > 300) return setErrorMessage("A descrição deve ter no máximo 300 caracteres.");
    if (document.length > 14) return setErrorMessage("O documento deve ter no máximo 14 caracteres.");

    try {
      const response = await fetch(
        "http://localhost/desafio-logo-ali/dla-backend/api/establishment/insert.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            name,
            description,
            document,
            status: status === "ativo" ? "1" : "0"
          }),
        }
      );

      const data = await response.json();

      if (data.result) {
        setSuccessMessage("Estabelecimento criado com sucesso!");
        setName("");
        setDescription("");
        setDocument("");
        setStatus("ativo");
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
      <Menu selected="establishment" />

      {errorMessage && (
        <FlashMessage
          message={errorMessage}
          status="error"
          title="Erro"
          onContinue={() => setErrorMessage("")}
        />
      )}

      {successMessage && (
        <FlashMessage
          message={successMessage}
          status="success"
          title="Sucesso"
          onContinue={() => setSuccessMessage("")}
        />
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="formInfo">
          <h1>Criar Estabelecimento</h1>
          <p>Adicione um novo estabelecimento no seu sistema</p>
        </div>

        <div className="inputBox">
          <h3>Nome</h3>
          <input
            type="text"
            placeholder="Entre com o nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <h3>Descrição</h3>
          <input
            type="text"
            placeholder="Entre com uma descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <h3>Documento</h3>
          <input
            type="text"
            placeholder="Entre com o documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </div>

        <button className="submitButton" type="submit">
          Criar
        </button>
      </form>
    </main>
  );
}
