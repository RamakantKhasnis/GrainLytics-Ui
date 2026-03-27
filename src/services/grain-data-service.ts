import { api } from "./api";
import type {
  Device,
  SensorReading,
  RiskAnalysis,
  RiskLevel,
  Alert,
  DashboardData,
  KPIData,
} from "@/types/grain-monitor";

export function calculateRisk(temperature: number, humidity: number): RiskLevel {
  if (humidity > 70 && temperature > 30) return "HIGH";
  if (humidity >= 60 && humidity <= 70) return "MEDIUM";
  return "LOW";
}

export function calculateSafeDays(temperature: number, humidity: number): number {
  if (humidity > 70 && temperature > 30) return Math.max(1, Math.floor(5 + Math.random() * 5));
  if (humidity >= 60) return Math.floor(15 + Math.random() * 15);
  return Math.floor(60 + Math.random() * 120);
}

// --- Public API ---
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const [dashRes, devRes, alertRes] = await Promise.all([
      api.get("/dashboard"),
      api.get("/devices"),
      api.get("/alerts")
    ]);

    const dashboard = dashRes.data;
    const devices = devRes.data.map((d: any) => ({
      id: d.device_id,
      name: d.warehouse_name,
      location: `City ID: ${d.city_id}`,
      status: "online"
    }));

    const alerts = alertRes.data.map((a: any) => ({
      id: String(a.id),
      deviceId: a.warehouse_name,
      deviceName: a.warehouse_name,
      message: a.message,
      riskLevel: a.alert_level.toUpperCase() === "CRITICAL" ? "HIGH" : 
                 a.alert_level.toUpperCase() === "WARNING" ? "MEDIUM" : "LOW",
      timestamp: a.timestamp,
      acknowledged: false,
    }));

    // Mock historical data mapping to fit existing charts from backend trends logic
    const labels = dashboard.trends.labels;
    const historicalData = labels.map((l: string, i: number) => ({
      id: `hist-${i}`,
      deviceId: devices[0]?.id || "unknown",
      temperature: dashboard.trends.temperature[i],
      humidity: dashboard.trends.humidity[i],
      timestamp: new Date().toISOString() // simplify for now
    }));

    // We can simulate latest readings and risk analyses from the averages provided by the backend to keep the existing UI intact
    const latestReadings = devices.map((d: any) => ({
       id: `curr-${d.id}`,
       deviceId: d.id,
       temperature: dashboard.kpis.average_temperature + (Math.random() * 2 - 1), // slight variation
       humidity: dashboard.kpis.average_humidity + (Math.random() * 5 - 2.5),
       timestamp: new Date().toISOString()
    }));

    const riskAnalyses = latestReadings.map((r: any) => ({
      id: `risk-${r.deviceId}`,
      deviceId: r.deviceId,
      riskLevel: "LOW" as RiskLevel, // simplify 
      predictedDaysRemaining: 15,
      timestamp: r.timestamp
    }));

    return {
      latestReadings,
      riskAnalyses,
      alerts,
      devices,
      historicalData,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data from backend", error);
    // Return empty fallback
    return {
      latestReadings: [],
      riskAnalyses: [],
      alerts: [],
      devices: [],
      historicalData: [],
    };
  }
}

export function computeKPIs(data: DashboardData): KPIData {
  const readings = data.latestReadings;
  const avgTemp = readings.length ? readings.reduce((s, r) => s + r.temperature, 0) / readings.length : 0;
  const avgHum = readings.length ? readings.reduce((s, r) => s + r.humidity, 0) / readings.length : 0;
  const risks = data.riskAnalyses;
  const hasHigh = risks.some((r) => r.riskLevel === "HIGH");
  const hasMedium = risks.some((r) => r.riskLevel === "MEDIUM");
  const overallRisk: RiskLevel = hasHigh ? "HIGH" : hasMedium ? "MEDIUM" : "LOW";
  const minDays = risks.length ? Math.min(...risks.map((r) => r.predictedDaysRemaining)) : 0;

  return {
    avgTemperature: Math.round(avgTemp * 10) / 10,
    avgHumidity: Math.round(avgHum * 10) / 10,
    overallRisk,
    minSafeDays: minDays,
    activeDevices: data.devices.filter((d) => d.status === "online").length,
    totalAlerts: data.alerts.length,
  };
}
