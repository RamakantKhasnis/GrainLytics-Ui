import { Thermometer, Droplets, ShieldAlert, Clock, Cpu, Bell } from "lucide-react";
import { useGrainMonitor } from "@/hooks/use-grain-monitor";
import { KPICard } from "@/components/KPICard";
import { TemperatureChart } from "@/components/TemperatureChart";
import { HumidityChart } from "@/components/HumidityChart";
import { RiskChart } from "@/components/RiskChart";
import { DeviceTable } from "@/components/DeviceTable";
import { AlertsPanel } from "@/components/AlertsPanel";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Dashboard() {
  const { data, kpis, loading } = useGrainMonitor();

  if (loading || !data || !kpis) return <DashboardSkeleton />;

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Avg Temperature" value={kpis.avgTemperature} unit="°C" icon={<Thermometer className="h-5 w-5" />} />
        <KPICard title="Avg Humidity" value={kpis.avgHumidity} unit="%" icon={<Droplets className="h-5 w-5" />} />
        <KPICard title="Risk Level" value={kpis.overallRisk} icon={<ShieldAlert className="h-5 w-5" />} riskLevel={kpis.overallRisk} />
        <KPICard title="Min Safe Days" value={kpis.minSafeDays} unit="days" icon={<Clock className="h-5 w-5" />} riskLevel={kpis.overallRisk} />
        <KPICard title="Active Devices" value={kpis.activeDevices} icon={<Cpu className="h-5 w-5" />} subtitle={`of ${data.devices.length} total`} />
        <KPICard title="Active Alerts" value={kpis.totalAlerts} icon={<Bell className="h-5 w-5" />} riskLevel={kpis.totalAlerts > 0 ? "MEDIUM" : "LOW"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TemperatureChart data={data.historicalData} />
        <HumidityChart data={data.historicalData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RiskChart data={data.riskAnalyses} />
        <AlertsPanel alerts={data.alerts} />
      </div>
      <DeviceTable devices={data.devices} readings={data.latestReadings} risks={data.riskAnalyses} />
    </main>
  );
}
