"use client";
import { inter } from "@/app/fonts/fonts";
import "@/components/FlashMessage/style.css";

type Props = {
  status: "error" | "success";
  title: string;
  message: string;
  onContinue: () => void;
};

export default function FlashMessage({
  status,
  title,
  message,
  onContinue,
}: Props) {
  const getIcon = () => {
    if (status === "success") {
      return "✔️";
    }
    if (status === "error") {
      return "⚠️";
    }
    return "";
  };

  return (
    <div className={`${inter.className} modal-overlay`}>
      <div className={`modal-card ${status}`}>
        <div className="modal-icon">{getIcon()}</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-subtitle">{message}</p>
        <button className="modal-button" onClick={onContinue}>
          {status === "success" ? 'Continuar' : 'Fechar'}
        </button>
      </div>
    </div>
  );
}
