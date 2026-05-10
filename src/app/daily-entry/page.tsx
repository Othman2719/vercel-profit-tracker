"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function DailyEntryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [productId, setProductId] = useState("");
  const [ordered, setOrdered] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [returned, setReturned] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return alert("Veuillez sélectionner un produit.");
    setSaving(true);
    
    const { error } = await supabase.from("daily_deliveries").insert([{
      date,
      product_id: productId,
      ordered,
      delivered,
      returned
    }]);

    setSaving(false);
    if (error) {
      alert("Erreur: " + error.message);
    } else {
      alert("Enregistré avec succès !");
      setOrdered(0);
      setDelivered(0);
      setReturned(0);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saisie Quotidienne</h1>
        <p className="text-gray-500 mt-2">Enregistrez vos livraisons et retours du jour.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
          <select 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            required
          >
            <option value="">Sélectionner un produit...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commandé</label>
            <input 
              type="number" min="0" value={ordered} onChange={(e) => setOrdered(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-emerald-600">Livré</label>
            <input 
              type="number" min="0" value={delivered} onChange={(e) => setDelivered(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-red-600">Retourné (Frais 200DA)</label>
            <input 
              type="number" min="0" value={returned} onChange={(e) => setReturned(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-red-50"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || saving}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer la journée"}
        </button>
      </form>
    </div>
  );
}
