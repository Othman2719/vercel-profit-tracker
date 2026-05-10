"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Wallet, Box, Coins, ArrowRightLeft } from "lucide-react";

export default function DashboardClient() {
  const [stats, setStats] = useState({
    income: 0,
    costOfGoods: 0,
    returnFees: 0,
    expenses: 0,
    unitsDelivered: 0,
    unitsReturned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products mapping for pricing
        const { data: products } = await supabase.from("products").select("*");
        const productMap = (products || []).reduce((acc: any, p: any) => {
          acc[p.id] = { cost: p.cost_price, price: p.selling_price };
          return acc;
        }, {});

        // Fetch deliveries
        const { data: deliveries } = await supabase.from("daily_deliveries").select("*");
        let income = 0;
        let costOfGoods = 0;
        let returnFees = 0;
        let unitsDelivered = 0;
        let unitsReturned = 0;

        (deliveries || []).forEach((d: any) => {
          const product = productMap[d.product_id];
          if (product) {
            const netDelivered = Math.max(0, d.delivered - d.returned);
            income += netDelivered * product.price;
            costOfGoods += netDelivered * product.cost;
            returnFees += d.returned * 200; // 200 DA Return Fee!
            
            unitsDelivered += d.delivered;
            unitsReturned += d.returned;
          }
        });

        // Fetch expenses
        const { data: expenses } = await supabase.from("expenses").select("amount");
        const totalExpenses = (expenses || []).reduce((acc: number, e: any) => acc + Number(e.amount), 0);

        setStats({
          income,
          costOfGoods,
          returnFees,
          expenses: totalExpenses,
          unitsDelivered,
          unitsReturned,
        });
      } catch (err) {
        console.error("Database not connected yet.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDA = (num: number) =>
    new Intl.NumberFormat("fr-DZ").format(num) + " DA";

  const grossProfit = stats.income - stats.costOfGoods - stats.returnFees;
  const netProfit = grossProfit - stats.expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Income */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Revenu (Chiffre d'Affaire)</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : formatDA(stats.income)}</p>
        </div>
      </div>

      {/* Expenses & Fees */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-rose-100 p-4 rounded-xl text-rose-600">
          <ArrowRightLeft size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Dépenses & Frais Retour</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? "..." : formatDA(stats.expenses + stats.returnFees)}</p>
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-xl ${netProfit >= 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
          <Coins size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Bénéfice Net</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {loading ? "..." : formatDA(netProfit)}
          </p>
        </div>
      </div>

      {/* Units Delivered */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
          <Box size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Livré vs Retourné</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? "..." : `${stats.unitsDelivered} / ${stats.unitsReturned}`}
          </p>
        </div>
      </div>
    </div>
  );
}
