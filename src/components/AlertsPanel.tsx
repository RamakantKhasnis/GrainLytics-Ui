import type { Alert } from "@/types/grain-monitor";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcon = {
  HIGH: <AlertTriangle className="h-4 w-4 text-risk-high" />,
  MEDIUM: <AlertCircle className="h-4 w-4 text-risk-medium" />,
  LOW: <Info className="h-4 w-4 text-risk-low" />,
};

const alertBorder = {
  HIGH: "border-l-risk-high",
  MEDIUM: "border-l-risk-medium",
  LOW: "border-l-risk-low",
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
        <span className="text-xs text-muted-foreground">{alerts.length} alerts</span>
      </div>
      <div className="max-h-[360px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No active alerts — all systems normal
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 border-l-2 ${alertBorder[alert.riskLevel]} hover:bg-secondary/20 transition-colors`}
              >
                <div className="mt-0.5">{alertIcon[alert.riskLevel]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.deviceName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
