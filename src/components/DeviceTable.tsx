import type { Device, SensorReading, RiskAnalysis } from "@/types/grain-monitor";
import { Badge } from "@/components/ui/badge";

interface DeviceTableProps {
  devices: Device[];
  readings: SensorReading[];
  risks: RiskAnalysis[];
}

const riskBadgeVariant: Record<string, string> = {
  LOW: "bg-risk-low/10 text-risk-low border-risk-low/20",
  MEDIUM: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  HIGH: "bg-risk-high/10 text-risk-high border-risk-high/20",
};

export function DeviceTable({ devices, readings, risks }: DeviceTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Device Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Temp</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Humidity</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Safe Days</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const reading = readings.find((r) => r.deviceId === device.id);
              const risk = risks.find((r) => r.deviceId === device.id);
              return (
                <tr key={device.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{device.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{device.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${device.status === "online" ? "bg-primary" : "bg-muted-foreground"}`} />
                      <span className="text-muted-foreground capitalize">{device.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground">{reading ? `${reading.temperature}°C` : "—"}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{reading ? `${reading.humidity}%` : "—"}</td>
                  <td className="px-4 py-3">
                    {risk ? (
                      <Badge variant="outline" className={`text-[10px] ${riskBadgeVariant[risk.riskLevel]}`}>
                        {risk.riskLevel}
                      </Badge>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-foreground">{risk ? `${risk.predictedDaysRemaining}d` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
