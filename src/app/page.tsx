export const metadata = { title: "Dashboard | Profit Tracker" };
import DashboardClient from "./DashboardClient";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-500 mt-2">Aperçu général de vos performances.</p>
      </div>
      <DashboardClient />
    </div>
  );
}
