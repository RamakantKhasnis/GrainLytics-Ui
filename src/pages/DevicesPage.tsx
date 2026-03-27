import { useGrainMonitor } from "@/hooks/use-grain-monitor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, WifiOff, Thermometer, Droplets, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { RiskLevel } from "@/types/grain-monitor";
import { calculateRisk } from "@/services/grain-data-service";

const riskBadgeClass: Record<RiskLevel, string> = {
  LOW: "bg-risk-low/10 text-risk-low border-risk-low/20",
  MEDIUM: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  HIGH: "bg-risk-high/10 text-risk-high border-risk-high/20",
};

export default function DevicesPage() {
  const { data, loading } = useGrainMonitor();
  const [search, setSearch] = useState("");

  if (loading || !data) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-card border border-border" />
        ))}
      </div>
    );
  }

  const filtered = data.devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Devices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all connected grain storage sensors
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search devices..."
          className="pl-9 bg-card border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((device) => {
          const reading = data.latestReadings.find((r) => r.deviceId === device.id);
          const risk = reading ? calculateRisk(reading.temperature, reading.humidity) : null;

          return (
            <div
              key={device.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-200 space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{device.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {device.location}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {device.status === "online" ? (
                    <Wifi className="h-4 w-4 text-primary" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge
                    variant="outline"
                    className={
                      device.status === "online"
                        ? "bg-primary/10 text-primary border-primary/20 text-[10px]"
                        : "bg-muted text-muted-foreground border-border text-[10px]"
                    }
                  >
                    {device.status}
                  </Badge>
                </div>
              </div>

              {/* Readings */}
              {reading ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Thermometer className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold font-mono text-foreground">{reading.temperature}°</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Temp</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Droplets className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold font-mono text-foreground">{reading.humidity}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Humidity</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    {risk && (
                      <>
                        <div className={`h-3.5 w-3.5 rounded-full mx-auto mb-1 ${risk === "HIGH" ? "bg-risk-high" : risk === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`} />
                        <p className={`text-lg font-bold font-mono ${risk === "HIGH" ? "text-risk-high" : risk === "MEDIUM" ? "text-risk-medium" : "text-risk-low"}`}>
                          {risk}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">Risk</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                  No data available — device offline
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-mono">{device.id}</span>
                {risk && (
                  <Badge variant="outline" className={`text-[10px] ${riskBadgeClass[risk]}`}>
                    {risk} RISK
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No devices match your search.
        </div>
      )}
    </main>
  );
}
