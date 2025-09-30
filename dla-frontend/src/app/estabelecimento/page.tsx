"use client";
import "@/app/estabelecimento/style.css";
import { inter } from "@/app/fonts/fonts";
import FlashMessage from "@/components/FlashMessage/page";
import Menu from "@/components/Menu/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Estabelecimentos() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");

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

  // Buscar estabelecimentos
  const fetchEstablishments = async () => {
    try {
      const response = await fetch(
        `http://localhost/desafio-logo-ali/dla-backend/api/establishment/listEstablishments.php?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await response.json();

      if (data.result) {
        setEstablishments(data.result.data);
        setTotalRecords(data.result.total);
        setTotalPages(data.result.totalPages);
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao carregar os estabelecimentos.");
    }
  };

  // Atualiza dados ao mudar página, linhas por página ou busca
  useEffect(() => {
    fetchEstablishments();
  }, [page, perPage, search]);

  const toggleStatus = async (id: number, currentStatus: number) => {
    try {
      const action = currentStatus === 1 ? "disable" : "enable";

      const response = await fetch(
        "http://localhost/desafio-logo-ali/dla-backend/api/establishment/toggleEstablishmentStatus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ id: String(id), action }),
        }
      );

      const data = await response.json();

      if (data.result) {
        // Atualiza o estado local sem precisar recarregar toda a página
        setEstablishments((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, status: data.result.newStatus } : e
          )
        );
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao atualizar status do estabelecimento.");
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

      <section className="estab-container">
        <header className="estab-header">
          <div>
            <h2>Listagem com todos os estabelecimentos</h2>
            <p>Edite ou adicione um novo estabelecimento</p>
          </div>
          <div className="estab-actions">
            <input
              type="text"
              placeholder="Procurar estabelecimentos"
              className="estab-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link href="/novoestabelecimento" className="estab-create">
              Criar estabelecimento
            </Link>
          </div>
        </header>

        <div className="estab-table-wrapper">
          <table className="estab-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Documento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {establishments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}
              {establishments.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.description}</td>
                  <td>{e.document}</td>
                  <td>
                    <span
                      className={`status ${
                        e.status === 1 ? "status-active" : "status-inactive"
                      }`}
                    >
                      {e.status === 1 ? "ativo" : "desativado"}
                    </span>
                  </td>
                  <td className="actions">
                    {e.status === 1 ? (
                      <>
                        <Link href={`http://localhost:3000/editarestabelecimento/${e.id}`} className="btn-edit">Editar</Link>
                        <button
                          className="btn-disable"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Tem certeza que deseja desativar este estabelecimento?"
                            );
                            if (confirmed) toggleStatus(e.id, e.status);
                          }}
                        >
                          desativar
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-recover"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Deseja realmente recuperar este estabelecimento?"
                          );
                          if (confirmed) toggleStatus(e.id, e.status);
                        }}
                      >
                        Recuperar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="estab-footer">
          <span>
            {establishments.length} de {totalRecords} linha(as) selecionadas.
          </span>
          <div className="pagination">
            <label>
              Linhas por página
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </label>
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="pagination-buttons">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                {"<<"}
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                {"<"}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {">"}
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                {">>"}
              </button>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
