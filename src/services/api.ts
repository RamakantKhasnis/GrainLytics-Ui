import axios from 'axios';

// Get the backend URL from env, or default to standard local port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardService = {
  getKPIs: () => api.get('/dashboard'),
  getAlerts: () => api.get('/alerts'),
};

export const geoService = {
  getLocations: () => api.get('/locations'),
  getInsights: (level: string) => api.get(`/geo-insights/${level}`),
  getWeather: (location: string) => api.get(`/weather/${location}`),
};

export const chatService = {
  sendMessage: (message: string) => api.post('/ai-chat', { message }),
};

export const sensorService = {
  getDevices: () => api.get('/devices'),
};

export const emcService = {
  getCurve: (grain_type: string, temperature_c: number) => 
    api.get('/lora/emc-curve', { params: { grain_type, temperature_c } }),
};
