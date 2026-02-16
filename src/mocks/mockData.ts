// ── All static mock data for the UrbanSync AI demo ──
// No external API calls. Everything is deterministic.

export const GODOY_CRUZ_CENTER: [number, number] = [-32.9226, -68.8397];

// Zig-zag inefficient route through Villa Marini / Trapiche
export const ROUTE_OLD: [number, number][] = [
    [-32.9180, -68.8450],
    [-32.9195, -68.8420],
    [-32.9210, -68.8460],
    [-32.9225, -68.8400],
    [-32.9240, -68.8445],
    [-32.9255, -68.8390],
    [-32.9270, -68.8435],
    [-32.9285, -68.8380],
    [-32.9260, -68.8420],
    [-32.9245, -68.8370],
    [-32.9230, -68.8410],
    [-32.9215, -68.8360],
];

// Clean L-shaped optimized route
export const ROUTE_OPTIMIZED: [number, number][] = [
    [-32.9180, -68.8450],
    [-32.9200, -68.8440],
    [-32.9220, -68.8430],
    [-32.9240, -68.8420],
    [-32.9260, -68.8410],
    [-32.9270, -68.8400],
    [-32.9275, -68.8380],
    [-32.9280, -68.8360],
];

export const DASHBOARD_KPIS = {
    trucks: 12,
    containers: 847,
    co2Saved: 12.4,
    costSaved: 18400,
};

export const EVENT_FEED = [
    { time: '08:12', icon: '✅', message: 'Ruta 7 completada — 12% menos km', type: 'success' as const },
    { time: '08:34', icon: '⚠️', message: 'Contenedor #402 al 87% — priorizar', type: 'warning' as const },
    { time: '08:51', icon: '✅', message: 'Camión 03 inició ruta optimizada', type: 'success' as const },
    { time: '09:05', icon: '🔄', message: 'Recalculando ruta 12 por corte en calle', type: 'warning' as const },
    { time: '09:22', icon: '✅', message: 'Zona Villa Marini recolectada al 100%', type: 'success' as const },
    { time: '09:38', icon: '⚠️', message: 'Contenedor #118 reportado como dañado', type: 'warning' as const },
    { time: '09:55', icon: '✅', message: 'Ruta 3 completada — ahorro 2.1 km', type: 'success' as const },
    { time: '10:12', icon: '✅', message: 'Predicción actualizada: zona centro +15% mañana', type: 'success' as const },
    { time: '10:30', icon: '⚠️', message: 'Contenedor #255 al 92% — enviar camión', type: 'warning' as const },
    { time: '10:45', icon: '✅', message: 'Camión 07 finalizó turno — 0 incidencias', type: 'success' as const },
    { time: '11:02', icon: '🔄', message: 'Reasignando camión 05 a zona Trapiche', type: 'warning' as const },
    { time: '11:20', icon: '✅', message: 'Zona Benegas completada bajo tiempo estimado', type: 'success' as const },
    { time: '11:38', icon: '✅', message: 'Ahorro acumulado del día: 14.7 km', type: 'success' as const },
    { time: '11:55', icon: '⚠️', message: 'Alerta clima: viento >40 km/h en 2 horas', type: 'warning' as const },
    { time: '12:10', icon: '✅', message: 'Ruta 9 completada — nuevo récord de eficiencia', type: 'success' as const },
    { time: '12:28', icon: '✅', message: 'Modelo predictivo recalibrado con datos AM', type: 'success' as const },
    { time: '12:45', icon: '⚠️', message: 'Contenedor #67 sin lectura desde hace 6h', type: 'warning' as const },
    { time: '13:00', icon: '✅', message: 'Turno mañana cerrado — 94% eficiencia', type: 'success' as const },
    { time: '13:15', icon: '🔄', message: 'Iniciando planificación turno tarde', type: 'warning' as const },
    { time: '13:30', icon: '✅', message: 'Rutas PM generadas — 8.3% mejora vs ayer', type: 'success' as const },
];

// 24-hour container saturation chart
export const CHART_DATA = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    saturation: Math.round(40 + Math.random() * 45 + (i > 6 && i < 20 ? 10 : 0)),
}));

export const WEATHER_FALLBACK = {
    temperature: 17,
    condition: 'Parcialmente nublado',
    humidity: 42,
    icon: '⛅',
};

export const WASTE_MOCK = {
    tipo_residuo: 'Orgánicos',
    pasa_hoy: true,
    hora_inicio: '20:00',
    hora_fin: '22:00',
    municipio: 'Godoy Cruz',
    zona: 'Villa Marini',
    color_estado: 'verde' as const,
};

// Scanner results for AI mockup
export const SCANNER_RESULTS = [
    { emoji: '🍌', label: 'Orgánico', action: 'Sacalo HOY', color: '#34d399' },
    { emoji: '♻️', label: 'PET Reciclable', action: 'Jueves', color: '#22d3ee' },
    { emoji: '🗑️', label: 'No reciclable', action: 'Martes', color: '#94a3b8' },
    { emoji: '📦', label: 'Cartón', action: 'Viernes', color: '#a78bfa' },
    { emoji: '🍶', label: 'Vidrio', action: 'Miércoles', color: '#fbbf24' },
];

// Gamification data
export const GAMIFICATION = {
    streak: 12,
    points: 847,
    level: 'Eco Vecino',
    levelEmoji: '🌱',
    nextLevel: 'Guardián Verde',
    nextLevelPoints: 1000,
    achievements: [
        { emoji: '♻️', label: '10 escaneos', unlocked: true },
        { emoji: '📦', label: 'Primera separación', unlocked: true },
        { emoji: '🏆', label: 'Racha de 7 días', unlocked: true },
        { emoji: '🌍', label: '1 kg CO₂ ahorrado', unlocked: true },
        { emoji: '⭐', label: 'Vecino del mes', unlocked: false },
    ],
};

// Nearby containers (Sensoneo-style)
export const NEARBY_CONTAINERS = [
    { id: 12, distance: '2 cuadras', fill: 45, lat: -32.9230, lng: -68.8400 },
    { id: 7, distance: '4 cuadras', fill: 82, lat: -32.9215, lng: -68.8380 },
    { id: 31, distance: '3 cuadras', fill: 28, lat: -32.9240, lng: -68.8410 },
    { id: 18, distance: '5 cuadras', fill: 91, lat: -32.9250, lng: -68.8370 },
    { id: 44, distance: '2 cuadras', fill: 55, lat: -32.9220, lng: -68.8420 },
    { id: 9, distance: '6 cuadras', fill: 15, lat: -32.9200, lng: -68.8440 },
];

// Route comparison stats
export const ROUTE_STATS = {
    old: { distance: 23.4, time: 42, label: 'Ruta Estática' },
    optimized: { distance: 19.2, time: 34, label: 'Ruta UrbanSync' },
    savings: { distance: 4.2, percent: 18, time: 8, co2: 11.3 },
};
