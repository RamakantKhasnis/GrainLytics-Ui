import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { RiskAnalysis } from "@/types/grain-monitor";

interface RiskChartProps {
  data: RiskAnalysis[];
}

const riskColors = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };

export function RiskChart({ data }: RiskChartProps) {
  const chartData = data.map((r) => ({
    device: r.deviceId,
    days: r.predictedDaysRemaining,
    risk: r.riskLevel,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Safe Storage Days by Device</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="device" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 10 }} />
          <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Bar dataKey="days" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={riskColors[entry.risk]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
