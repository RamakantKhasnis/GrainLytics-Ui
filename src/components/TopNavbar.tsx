import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import type { Alert } from "@/types/grain-monitor";

interface TopNavbarProps {
  lastUpdated: Date;
  alertCount: number;
  alerts: Alert[];
  onRefresh: () => void;
}

const alertBorderColor = {
  HIGH: "border-l-risk-high",
  MEDIUM: "border-l-risk-medium",
  LOW: "border-l-risk-low",
};

export function TopNavbar({ lastUpdated, alertCount, alerts, onRefresh }: TopNavbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="h-5 w-px bg-border" />
        <h2 className="text-sm font-semibold text-foreground">Grain Storage Monitor</h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
          Updated {lastUpdated.toLocaleTimeString()}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>

        {/* Notification Bell with Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-3.5 w-3.5" />
              {alertCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold flex items-center justify-center text-destructive-foreground">
                  {alertCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 bg-card border-border"
            align="end"
            sideOffset={8}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
              <span className="text-[10px] text-muted-foreground">{alertCount} alerts</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications — all systems normal ✓
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {alerts.slice(0, 20).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 border-l-2 ${alertBorderColor[alert.riskLevel]} hover:bg-secondary/20 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{alert.deviceName}</span>
                        <span className={`text-[10px] font-bold ${
                          alert.riskLevel === "HIGH" ? "text-risk-high" :
                          alert.riskLevel === "MEDIUM" ? "text-risk-medium" : "text-risk-low"
                        }`}>
                          {alert.riskLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>

        {user && (
          <>
            <div className="h-5 w-px bg-border" />
            <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-[120px]">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut} title="Sign out">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
