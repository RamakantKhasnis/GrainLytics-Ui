import React, { useEffect, useState } from "react";
import { geoService } from "@/services/api";

export default function GeoInsightsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    geoService.getInsights("state").then((res) => setData(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Geographic Insights</h1>
      <p className="text-muted-foreground mb-8">State, District, and City level intelligence mapping.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">State Overview</h2>
          <pre className="text-sm overflow-auto text-green-400 bg-black/90 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm flex items-center justify-center">
            {/* Map logic goes here */}
            <p className="text-muted-foreground text-center">Interactive Leaflet Map<br/>(State Level View)</p>
        </div>
      </div>
    </div>
  );
}
