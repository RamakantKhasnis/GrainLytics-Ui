import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Bell, Thermometer, Droplets, Clock, Shield } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    refreshInterval: 5,
    tempThresholdHigh: 30,
    humidityThresholdHigh: 70,
    humidityThresholdMedium: 60,
    emailAlerts: true,
    pushNotifications: false,
    alertOnHigh: true,
    alertOnMedium: true,
    alertOnLow: false,
    darkMode: true,
    companyName: "GrainGuard Corp",
    timezone: "UTC",
  });

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure monitoring thresholds, alerts, and preferences
        </p>
      </div>

      {/* General */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">General</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Name</Label>
              <Input
                value={settings.companyName}
                onChange={(e) => updateSetting("companyName", e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Timezone</Label>
              <Input
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Monitoring Thresholds */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Monitoring Thresholds</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                High Temp Threshold (°C)
              </Label>
              <Input
                type="number"
                value={settings.tempThresholdHigh}
                onChange={(e) => updateSetting("tempThresholdHigh", Number(e.target.value))}
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                High Humidity Threshold (%)
              </Label>
              <Input
                type="number"
                value={settings.humidityThresholdHigh}
                onChange={(e) => updateSetting("humidityThresholdHigh", Number(e.target.value))}
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Medium Humidity Threshold (%)
              </Label>
              <Input
                type="number"
                value={settings.humidityThresholdMedium}
                onChange={(e) => updateSetting("humidityThresholdMedium", Number(e.target.value))}
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Refresh Interval (seconds)
              </Label>
              <Input
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => updateSetting("refreshInterval", Number(e.target.value))}
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border" />

      {/* Notifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive risk alerts via email</p>
            </div>
            <Switch
              checked={settings.emailAlerts}
              onCheckedChange={(v) => updateSetting("emailAlerts", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Browser push notifications for critical alerts</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(v) => updateSetting("pushNotifications", v)}
            />
          </div>

          <Separator className="bg-border" />

          <p className="text-xs text-muted-foreground uppercase tracking-wider">Alert by Risk Level</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-high" />
                <span className="text-sm text-foreground">High Risk</span>
              </div>
              <Switch
                checked={settings.alertOnHigh}
                onCheckedChange={(v) => updateSetting("alertOnHigh", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-medium" />
                <span className="text-sm text-foreground">Medium Risk</span>
              </div>
              <Switch
                checked={settings.alertOnMedium}
                onCheckedChange={(v) => updateSetting("alertOnMedium", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-low" />
                <span className="text-sm text-foreground">Low Risk</span>
              </div>
              <Switch
                checked={settings.alertOnLow}
                onCheckedChange={(v) => updateSetting("alertOnLow", v)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="pb-8">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </main>
  );
}
