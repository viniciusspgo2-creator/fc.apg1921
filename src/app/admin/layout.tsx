import type { Metadata } from "next";
import "../globals.css";

/* ============================================================
 * Admin root layout — standalone shell (no locale header/footer).
 * ============================================================ */

export const metadata: Metadata = {
  title: "Painel · FC APG 1921",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0b0f1a] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
