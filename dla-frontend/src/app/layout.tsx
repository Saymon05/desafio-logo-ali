import type { Metadata } from "next";
import "./globals.css";
import 'animate.css';

export const metadata: Metadata = {
  title: "Logo Ali",
  description: "Sistema de teste de estágio. (Saymon Salles)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
