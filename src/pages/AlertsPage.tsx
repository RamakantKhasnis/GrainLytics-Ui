import { useGrainMonitor } from "@/hooks/use-grain-monitor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Filter } from "lucide-react";
import { useState } from "react";
import type { RiskLevel, Alert } from "@/types/grain-monitor";

const riskBadgeClass: Record<RiskLevel, string> = {
  LOW: "bg-risk-low/10 text-risk-low border-risk-low/20",
  MEDIUM: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  HIGH: "bg-risk-high/10 text-risk-high border-risk-high/20",
};

const alertIconMap: Record<RiskLevel, React.ReactNode> = {
  HIGH: <AlertTriangle className="h-5 w-5 text-risk-high" />,
  MEDIUM: <AlertCircle className="h-5 w-5 text-risk-medium" />,
  LOW: <Info className="h-5 w-5 text-risk-low" />,
};

type FilterType = "all" | RiskLevel;

export default function AlertsPage() {
  const { data, loading } = useGrainMonitor();
  const [filter, setFilter] = useState<FilterType>("all");
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  if (loading || !data) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-card border border-border" />
        ))}
      </div>
    );
  }

  const alerts = data.alerts.map((a) => ({
    ...a,
    acknowledged: acknowledged.has(a.id),
  }));

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.riskLevel === filter);

  const counts = {
    all: alerts.length,
    HIGH: alerts.filter((a) => a.riskLevel === "HIGH").length,
    MEDIUM: alerts.filter((a) => a.riskLevel === "MEDIUM").length,
    LOW: alerts.filter((a) => a.riskLevel === "LOW").length,
  };

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor risk alerts across all storage facilities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["all", "HIGH", "MEDIUM", "LOW"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl border p-4 text-left transition-all ${
              filter === f
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {f === "all" ? "All Alerts" : `${f} Risk`}
            </p>
            <p className="text-2xl font-bold font-mono text-foreground mt-1">{counts[f]}</p>
          </button>
        ))}
      </div>

      {/* Filter indicator */}
      {filter !== "all" && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filter}</span> risk alerts
          </span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setFilter("all")}>
            Clear
          </Button>
        </div>
      )}

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium">All Clear</p>
            <p className="text-sm text-muted-foreground mt-1">No alerts match the current filter.</p>
          </div>
        ) : (
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => handleAcknowledge(alert.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}

function AlertCard({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge: () => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-4 flex items-start gap-4 transition-all ${
        alert.acknowledged ? "opacity-50 border-border" : "border-border hover:border-primary/20"
      }`}
    >
      <div className="mt-0.5">{alertIconMap[alert.riskLevel]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{alert.deviceName}</span>
          <Badge variant="outline" className={`text-[10px] ${riskBadgeClass[alert.riskLevel]}`}>
            {alert.riskLevel}
          </Badge>
          {alert.acknowledged && (
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
              Acknowledged
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
        <p className="text-[10px] text-muted-foreground mt-2 font-mono">
          {new Date(alert.timestamp).toLocaleString()}
        </p>
      </div>
      {!alert.acknowledged && (
        <Button variant="outline" size="sm" className="text-xs shrink-0" onClick={onAcknowledge}>
          Acknowledge
        </Button>
      )}
    </div>
  );
}
