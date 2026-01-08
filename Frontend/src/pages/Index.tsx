import { useState, useEffect, useMemo } from "react";
import { Zap, AlertTriangle, Wrench, Users } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { DataTable } from "@/components/dashboard/DataTable";
import { IssueChart } from "@/components/dashboard/IssueChart";
import { EngineerChart } from "@/components/dashboard/EngineerChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RatingChart } from "@/components/dashboard/RatingChart";
import {
  // parseCSVData,
  getIssueCategories,
  getEngineerStats,
  getRatingStats,
  getMonthlyTrend,
  ReplacementRecord,
} from "@/lib/parseData";
import { fetchReplacements } from "@/lib/api";
import { mapDbToReplacementRecord } from "@/lib/parseData";

const Index = () => {
  const [data, setData] = useState<ReplacementRecord[]>([]);

useEffect(() => {
  async function load() {
    try {
      const dbData = await fetchReplacements();
      const records = mapDbToReplacementRecord(dbData);
      setData(records);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  }

  load();
}, []);


  const stats = useMemo(() => {
    if (!data.length) return null;

    const issueCategories = getIssueCategories(data);
    const engineerStats = getEngineerStats(data);
    const ratingStats = getRatingStats(data);
    const monthlyTrend = getMonthlyTrend(data);

    const pendingCount = data.filter((r) =>
      r.status.toLowerCase().includes("pending")
    ).length;

    const completedCount = data.filter(
      (r) =>
        r.status.toLowerCase().includes("done") ||
        r.status.toLowerCase().includes("replaced")
    ).length;

    return {
      total: data.length,
      pending: pendingCount,
      completed: completedCount,
      uniqueEngineers: engineerStats.length,
      issueCategories,
      engineerStats,
      ratingStats,
      monthlyTrend,
    };
  }, [data]);

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
  <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
  <div className="w-full max-w-full px-2 py-3">
    <div className="flex items-center space-x-5 h-24"> 
      {/*LOGO */}
      <img
        src="/logo.png"
        alt="Company Logo"
        className="h-20 w-auto object-contain -scroll-ml-0.5"
      />

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          FE Replacement Dashboard
        </h1>
        <p className="text-base text-muted-foreground">
          Inverter Replacement Status Overview
        </p>
      </div>
    </div>
  </div>
</header>



      <main className="container mx-auto space-y-6 px-4 py-6">
        {/* KPI Cards */}
<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <KPICard
    title="Total Replacements"
    value={stats.total}
    icon={Zap}
    iconClassName="bg-blue-100 text-blue-600"
  />

  <KPICard
    title="Pending"
    value={stats.pending}
    icon={AlertTriangle}
    iconClassName="bg-orange-100 text-orange-600"
  />

  <KPICard
    title="Completed"
    value={stats.completed}
    icon={Wrench}
    iconClassName="bg-green-100 text-green-600"
  />

  <KPICard
    title="Active Engineers"
    value={stats.uniqueEngineers}
    icon={Users}
    iconClassName="bg-indigo-100 text-indigo-600"
  />
</section>


        {/* Trend Chart */}
        <TrendChart data={stats.monthlyTrend} />

        {/* Charts Grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          <IssueChart data={stats.issueCategories} />
          <EngineerChart data={stats.engineerStats} />
          <RatingChart data={stats.ratingStats} />
        </section>

        {/* Data Table */}
        <DataTable data={data} />
      </main>
    </div>
  );
};

export default Index;
