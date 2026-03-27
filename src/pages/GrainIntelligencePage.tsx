import React, { useState } from "react";

const SUPPORTED_GRAINS = [
    { name: "Wheat", minTemp: 10, maxTemp: 25, idealHumidity: 60, risk: "MODERATE" },
    { name: "Rice (Paddy)", minTemp: 15, maxTemp: 30, idealHumidity: 65, risk: "HIGH" },
    { name: "Maize (Corn)", minTemp: 10, maxTemp: 28, idealHumidity: 55, risk: "LOW" },
    { name: "Soybean", minTemp: 10, maxTemp: 20, idealHumidity: 50, risk: "HIGH" },
    { name: "Barley", minTemp: 5, maxTemp: 20, idealHumidity: 55, risk: "LOW" },
];

export default function GrainIntelligencePage() {
  const [selected, setSelected] = useState(SUPPORTED_GRAINS[0]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Grain Intelligence Module</h1>
      <p className="text-muted-foreground mb-8">Select a grain type to view ideal storage conditions and risk sensitivity.</p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <select 
            className="w-full p-3 rounded-lg border bg-background"
            onChange={(e) => setSelected(SUPPORTED_GRAINS.find(g => g.name === e.target.value) || SUPPORTED_GRAINS[0])}
          >
            {SUPPORTED_GRAINS.map(g => (
                <option key={g.name} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
            <div className="bg-card border p-4 rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Min Temp</span>
                <p className="text-3xl font-bold">{selected.minTemp}°C</p>
            </div>
            <div className="bg-card border p-4 rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Max Temp</span>
                <p className="text-3xl font-bold">{selected.maxTemp}°C</p>
            </div>
            <div className="bg-card border p-4 rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Ideal Humidity</span>
                <p className="text-3xl font-bold text-blue-500">{selected.idealHumidity}%</p>
            </div>
            <div className="bg-card border p-4 rounded-xl shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Risk Sensitivity</span>
                <p className={`text-xl font-bold ${selected.risk === 'HIGH' ? 'text-red-500' : 'text-green-500'}`}>{selected.risk}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
