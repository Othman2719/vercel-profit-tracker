"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("products").insert([{
      name,
      cost_price: Number(costPrice),
      selling_price: Number(sellingPrice)
    }]);
    setName("");
    setCostPrice("");
    setSellingPrice("");
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if(confirm("Supprimer ce produit ?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
        <p className="text-gray-500 mt-2">Gérez votre catalogue de produits et vos prix.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Produit</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-amber-500"/>
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix Achat</label>
          <input type="number" value={costPrice} onChange={e=>setCostPrice(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-amber-500"/>
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix Vente</label>
          <input type="number" value={sellingPrice} onChange={e=>setSellingPrice(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-amber-500"/>
        </div>
        <button type="submit" className="w-full md:w-auto px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">Ajouter</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Nom</th>
              <th className="p-4 font-medium">Prix Achat</th>
              <th className="p-4 font-medium">Prix Vente</th>
              <th className="p-4 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id}>
                <td className="p-4">{p.name}</td>
                <td className="p-4 text-gray-500">{p.cost_price} DA</td>
                <td className="p-4 text-emerald-600 font-medium">{p.selling_price} DA</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Aucun produit trouvé.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
