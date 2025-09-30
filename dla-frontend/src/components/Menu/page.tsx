'use client';
import "@/components/Menu/style.css";
import { inter } from "@/app/fonts/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
    selected: 'user' | 'establishment';
}

export default function Menu({ selected }: Props) {
  const router = useRouter();

  return (
    <div className={`${inter.className} optionBox`}>
      <Link 
        href="/" 
        className={`optionBox__optionSingle ${selected === 'user' ? 'optionSingle-selected' : ''}`}
      >
        Usuários
      </Link>
      <Link 
        href="/estabelecimento" 
        className={`optionBox__optionSingle ${selected === 'establishment' ? 'optionSingle-selected' : ''}`}
      >
        Estabelecimentos
      </Link>

      {/* Botão de logout*/}
      <button 
        onClick={() => {
        const confirmed = window.confirm("Tem certeza que deseja sair?");
        if (confirmed) {
          localStorage.removeItem("token"); // limpa token
          router.push("/login"); // redireciona
        }
      }}  
        className="optionBox__optionSingle logoutButton"
        title="Sair"
      >
        🔒 Sair
      </button>
    </div>
  );
}
