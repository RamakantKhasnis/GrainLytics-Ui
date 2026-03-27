import { useState, useEffect, useCallback } from "react";
import { fetchDashboardData, computeKPIs } from "@/services/grain-data-service";
import type { DashboardData, KPIData } from "@/types/grain-monitor";

const REFRESH_INTERVAL = 5000; // 5 seconds

export function useGrainMonitor() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    try {
      const dashboard = await fetchDashboardData();
      const kpiData = computeKPIs(dashboard);
      setData(dashboard);
      setKpis(kpiData);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, kpis, loading, lastUpdated, refresh };
}
