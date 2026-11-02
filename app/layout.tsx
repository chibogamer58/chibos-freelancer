import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link"; // Herramienta de Next.js para cambiar de página sin recargar

export const metadata: Metadata = {
  title: "ChibosFreelancer",
  description: "Sistema para gestionar clientes y facturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        
        {/* LA BARRA DE NAVEGACIÓN SUPERIOR */}
        <nav className="bg-blue-900 text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center gap-6">
            <Link href="/" className="font-bold text-xl mr-4 hover:text-blue-200">
            ChibosFreelancer
            </Link>
            
            <Link href="/clientes" className="hover:text-blue-300 font-semibold">
              Clientes
            </Link>
            
            <Link href="/facturas" className="hover:text-blue-300 font-semibold">
              Facturas
            </Link>
          </div>
        </nav>

        {/* AQUÍ ES DONDE SE CARGAN LAS PÁGINAS INDIVIDUALES */}
        <main className="pt-4">
          {children}
        </main>

      </body>
    </html>
  );
}