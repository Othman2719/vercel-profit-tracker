"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    const { data } = await supabase.from("expenses").select("*").order("created_at", { ascending: false });
    if (data) setExpenses(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("expenses").insert([{
      description: desc,
      amount: Number(amount)
    }]);
    setDesc("");
    setAmount("");
    fetchExpenses();
  }

  async function handleDelete(id: string) {
    if(confirm("Supprimer cette dépense ?")) {
      await supabase.from("expenses").delete().eq("id", id);
      fetchExpenses();
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dépenses</h1>
        <p className="text-gray-500 mt-2">Suivez vos dépenses (publicité, emballage, etc.).</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" value={desc} onChange={e=>setDesc(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-rose-500"/>
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (DA)</label>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-rose-500"/>
        </div>
        <button type="submit" className="w-full md:w-auto px-6 py-2 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600">Ajouter</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Montant</th>
              <th className="p-4 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map(e => (
              <tr key={e.id}>
                <td className="p-4 text-gray-500">{new Date(e.created_at).toLocaleDateString("fr-DZ")}</td>
                <td className="p-4">{e.description}</td>
                <td className="p-4 text-red-600 font-medium">{e.amount} DA</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Aucune dépense trouvée.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
