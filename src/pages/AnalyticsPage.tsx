import { useGrainMonitor } from "@/hooks/use-grain-monitor";
import { TemperatureChart } from "@/components/TemperatureChart";
import { HumidityChart } from "@/components/HumidityChart";
import { RiskChart } from "@/components/RiskChart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { useMemo } from "react";
import type { RiskLevel } from "@/types/grain-monitor";

const riskColors: Record<RiskLevel, string> = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };

export default function AnalyticsPage() {
  const { data, loading } = useGrainMonitor();

  const riskDistribution = useMemo(() => {
    if (!data) return [];
    const counts: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    data.riskAnalyses.forEach((r) => counts[r.riskLevel]++);
    return Object.entries(counts).map(([level, count]) => ({
      name: level,
      value: count,
      fill: riskColors[level as RiskLevel],
    }));
  }, [data]);

  const deviceComparison = useMemo(() => {
    if (!data) return [];
    return data.devices
      .filter((d) => d.status === "online")
      .map((d) => {
        const reading = data.latestReadings.find((r) => r.deviceId === d.id);
        const risk = data.riskAnalyses.find((r) => r.deviceId === d.id);
        return {
          name: d.name,
          temperature: reading?.temperature ?? 0,
          humidity: reading?.humidity ?? 0,
          safeDays: risk?.predictedDaysRemaining ?? 0,
          risk: risk?.riskLevel ?? "LOW",
        };
      });
  }, [data]);

  if (loading || !data) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 w-48 rounded bg-card border border-border" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-card border border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          In-depth trends and comparative analysis across all storage units
        </p>
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TemperatureChart data={data.historicalData} />
        <HumidityChart data={data.historicalData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Distribution Pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Device Comparison Bar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Device Temperature Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deviceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="temperature" name="Temp (°C)" radius={[4, 4, 0, 0]}>
                {deviceComparison.map((entry, i) => (
                  <Cell key={i} fill={riskColors[entry.risk as RiskLevel]} />
                ))}
              </Bar>
              <Bar dataKey="humidity" name="Humidity (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Safe Storage Days */}
      <RiskChart data={data.riskAnalyses} />
    </main>
  );
}
