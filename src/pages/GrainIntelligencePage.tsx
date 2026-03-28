import React, { useState } from "react";

const SUPPORTED_GRAINS = [
    { name: "Wheat", minTemp: 10, maxTemp: 25, idealHumidity: 60, risk: "MODERATE", description: "Wheat requires strict moisture control (below 14%). If humidity spikes above 65%, aeration fans must be activated immediately to prevent fungal growth." },
    { name: "Corn", minTemp: 5, maxTemp: 15, idealHumidity: 55, risk: "HIGH", description: "Corn is highly susceptible to aflatoxin if stored above 15% moisture. Keep temperatures below 15°C (59°F) and run ventilation cycles every 48 hours." },
    { name: "Rice", minTemp: 15, maxTemp: 30, idealHumidity: 60, risk: "HIGH", description: "Rice storage is critical; if relative humidity exceeds 60%, the kernel can crack or grow mold. Ensure constant airflow in your silos." },
    { name: "Barley", minTemp: 5, maxTemp: 20, idealHumidity: 55, risk: "LOW", description: "Barley is resilient but should be kept around 12% moisture. Watch entirely for heat pockets forming in the center of the storage bin." },
    { name: "Oats", minTemp: 10, maxTemp: 15, idealHumidity: 55, risk: "MODERATE", description: "Oats have a thicker husk reducing moisture transfer but are still at risk. Keep storage temperature steady around 10-15°C to avoid rancidity." },
    { name: "Sorghum", minTemp: 10, maxTemp: 25, idealHumidity: 50, risk: "MODERATE", description: "Sorghum can rapidly heat up if stored fresh. Ensure it is dried to at least 13% before binning, and monitor the Risk Chart for sudden heat spikes." },
    { name: "Rye", minTemp: 5, maxTemp: 20, idealHumidity: 45, risk: "HIGH", description: "Rye is prone to ergot mold if left in damp conditions. Keep humidity extremely low and use the Alerts Panel to track sudden weather changes." },
    { name: "Soybeans", minTemp: 10, maxTemp: 20, idealHumidity: 50, risk: "HIGH", description: "Soybeans are dangerous if stored too wet; their high oil content can lead to spontaneous combustion. Do not let moisture exceed 13%." },
    { name: "Millet", minTemp: 10, maxTemp: 30, idealHumidity: 45, risk: "MODERATE", description: "Millet is a small grain, meaning it compacts tightly. This restricts airflow, so you must use forced-air ventilation to keep moisture below 12%." },
    { name: "Quinoa", minTemp: 5, maxTemp: 15, idealHumidity: 40, risk: "LOW", description: "Quinoa's outer coating (saponin) protects it slightly, but it must remain exceptionally dry (below 10% moisture) to retain its premium quality." },
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
            
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl shadow-sm col-span-2 mt-2">
                <h3 className="text-sm font-bold text-primary mb-2">AI Knowledge Base: {selected.name}</h3>
                <p className="text-sm leading-relaxed text-foreground">{selected.description}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
