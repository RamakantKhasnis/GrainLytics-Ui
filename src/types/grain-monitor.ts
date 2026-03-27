// Types for the Grain Storage Condition Monitor

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Device {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
}

export interface SensorReading {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface RiskAnalysis {
  id: string;
  deviceId: string;
  riskLevel: RiskLevel;
  predictedDaysRemaining: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  message: string;
  riskLevel: RiskLevel;
  timestamp: string;
  acknowledged: boolean;
}

export interface DashboardData {
  latestReadings: SensorReading[];
  riskAnalyses: RiskAnalysis[];
  alerts: Alert[];
  devices: Device[];
  historicalData: SensorReading[];
}

export interface KPIData {
  avgTemperature: number;
  avgHumidity: number;
  overallRisk: RiskLevel;
  minSafeDays: number;
  activeDevices: number;
  totalAlerts: number;
}
