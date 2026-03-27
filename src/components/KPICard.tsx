import type { ReactNode } from "react";
import type { RiskLevel } from "@/types/grain-monitor";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  riskLevel?: RiskLevel;
  subtitle?: string;
}

const riskStyles: Record<RiskLevel, string> = {
  LOW: "risk-glow-low border-risk-low/20",
  MEDIUM: "risk-glow-medium border-risk-medium/20",
  HIGH: "risk-glow-high border-risk-high/20",
};

const riskTextColor: Record<RiskLevel, string> = {
  LOW: "text-risk-low",
  MEDIUM: "text-risk-medium",
  HIGH: "text-risk-high",
};

export function KPICard({ title, value, unit, icon, riskLevel, subtitle }: KPICardProps) {
  const glowClass = riskLevel ? riskStyles[riskLevel] : "kpi-glow border-border";

  return (
    <div
      className={`relative rounded-xl border bg-card p-5 transition-all duration-300 hover:scale-[1.02] animate-slide-up ${glowClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-bold font-mono ${riskLevel ? riskTextColor[riskLevel] : "text-foreground"}`}>
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}
