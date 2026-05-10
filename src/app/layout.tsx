import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Package, Truck, Receipt } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profit Tracker",
  description: "E-commerce Profit & Delivery Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col md:flex-row`}>
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <span className="bg-emerald-100 p-2 rounded-lg">📈</span> Tracker
            </h1>
          </div>
          <nav className="flex md:flex-col gap-2 px-4 overflow-x-auto pb-4 md:pb-0">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 whitespace-nowrap">
              <LayoutDashboard size={20} className="text-emerald-500" />
              Tableau de Bord
            </Link>
            <Link href="/daily-entry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 whitespace-nowrap">
              <Truck size={20} className="text-blue-500" />
              Saisie Quotidienne
            </Link>
            <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 whitespace-nowrap">
              <Package size={20} className="text-amber-500" />
              Produits
            </Link>
            <Link href="/expenses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 whitespace-nowrap">
              <Receipt size={20} className="text-rose-500" />
              Dépenses
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
