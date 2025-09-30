'use client';
import "@/app/editarestabelecimento/style.css";
import { inter } from "@/app/fonts/fonts";
import FlashMessage from "@/components/FlashMessage/page";
import Menu from "@/components/Menu/page";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function EditarEstabelecimento() {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState("");
  const [status, setStatus] = useState("ativo");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Extrair o ID do URL
  const id = pathname.split("/").pop();

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

  // Buscar dados do estabelecimento ao carregar a página
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost/desafio-logo-ali/dla-backend/api/establishment/get.php?id=${id}`
        );
        const data = await response.json();

        if (data.result) {
          setName(data.result.name);
          setDescription(data.result.description);
          setDocument(data.result.document);
          setStatus(data.result.status === 1 ? "ativo" : "desativado");
        } else if (data.error) {
          setErrorMessage(data.error);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao carregar o estabelecimento.");
      }
    };

    fetchData();
  }, [id]);

  // Submissão do formulário
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name) return setErrorMessage("O campo nome é obrigatório.");
    if (!description) return setErrorMessage("O campo descrição é obrigatório.");
    if (!document) return setErrorMessage("O campo documento é obrigatório.");

    try {
      const response = await fetch(
        "http://localhost/desafio-logo-ali/dla-backend/api/establishment/update.php",
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            id: id!,
            name,
            description,
            document,
            status: status === "ativo" ? "1" : "0"
          }),
        }
      );

      const data = await response.json();
      if (data.result) {
        setSuccessMessage("Estabelecimento atualizado com sucesso!");
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao conectar com o servidor.");
    }
  };

  const nextPage = () => {
    router.push("/estabelecimento");
  }

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
          onContinue={nextPage}
        />
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="formInfo">
          <h1>Editar Estabelecimento</h1>
          <p>Atualize os dados do estabelecimento</p>
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

        <div className="inputBox">
          <h3>Status</h3>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="desativado">Desativado</option>
          </select>
        </div>

        <button className="submitButton" type="submit">
          Atualizar
        </button>
      </form>
    </main>
  );
}
