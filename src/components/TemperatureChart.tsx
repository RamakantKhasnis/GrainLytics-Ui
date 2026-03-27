import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SensorReading } from "@/types/grain-monitor";
import { useMemo } from "react";

interface TemperatureChartProps {
  data: SensorReading[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = useMemo(() => {
    // Group by timestamp, average per timestamp
    const grouped = new Map<string, { time: string; [key: string]: number | string }>();
    for (const r of data) {
      const time = new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (!grouped.has(time)) {
        grouped.set(time, { time });
      }
      const entry = grouped.get(time)!;
      entry[r.deviceId] = r.temperature;
    }
    return Array.from(grouped.values()).slice(-24);
  }, [data]);

  const deviceIds = [...new Set(data.map((r) => r.deviceId))];
  const colors = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Temperature Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="time" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
          <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} unit="°C" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {deviceIds.map((id, i) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
              name={id}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
