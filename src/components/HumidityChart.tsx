import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SensorReading } from "@/types/grain-monitor";
import { useMemo } from "react";

interface HumidityChartProps {
  data: SensorReading[];
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartData = useMemo(() => {
    const grouped = new Map<string, { time: string; avg: number; count: number }>();
    for (const r of data) {
      const time = new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const existing = grouped.get(time);
      if (existing) {
        existing.avg += r.humidity;
        existing.count++;
      } else {
        grouped.set(time, { time, avg: r.humidity, count: 1 });
      }
    }
    return Array.from(grouped.values())
      .map((e) => ({ time: e.time, humidity: Math.round((e.avg / e.count) * 10) / 10 }))
      .slice(-24);
  }, [data]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Average Humidity Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="time" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
          <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#humGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
