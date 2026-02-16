import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRightLeft, Navigation } from 'lucide-react';
import {
    GODOY_CRUZ_CENTER,
    ROUTE_OLD,
    ROUTE_OPTIMIZED,
    ROUTE_STATS,
} from '../../mocks/mockData';

// Animated truck that moves along the optimized route
const AnimatedTruck = ({ coords }: { coords: [number, number][] }) => {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const indexRef = useRef(0);

    const truckIcon = useMemo(
        () =>
            L.divIcon({
                html: '<span style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🚛</span>',
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
        []
    );

    useEffect(() => {
        if (!map || coords.length === 0) return;

        const marker = L.marker(coords[0], { icon: truckIcon }).addTo(map);
        markerRef.current = marker;

        const interval = setInterval(() => {
            indexRef.current = (indexRef.current + 1) % coords.length;
            marker.setLatLng(coords[indexRef.current]);
        }, 800);

        return () => {
            clearInterval(interval);
            marker.remove();
        };
    }, [map, coords, truckIcon]);

    return null;
};

const RoutesView = () => {
    const [showOptimized, setShowOptimized] = useState(true);

    return (
        <motion.section
            id="routes"
            className="mx-auto max-w-5xl px-5 py-16 sm:py-24"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
        >
            {/* Title */}
            <div className="mb-10 flex items-center gap-3">
                <Navigation className="h-5 w-5 text-cyan-400" />
                <h2 className="text-2xl font-bold sm:text-3xl">
                    Optimización de Rutas en Tiempo Real
                </h2>
            </div>

            {/* Map */}
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-800/50">
                <MapContainer
                    center={GODOY_CRUZ_CENTER}
                    zoom={15}
                    scrollWheelZoom={false}
                    dragging={true}
                    className="h-[50vh] w-full sm:h-[60vh]"
                    style={{ background: '#0f172a' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution=""
                    />

                    {/* Old route (red dashed) */}
                    <Polyline
                        positions={ROUTE_OLD}
                        pathOptions={{
                            color: '#ef4444',
                            weight: 3,
                            dashArray: '8,8',
                            opacity: showOptimized ? 0.4 : 0.9,
                        }}
                    />

                    {/* Optimized route (green solid) */}
                    {showOptimized && (
                        <>
                            <Polyline
                                positions={ROUTE_OPTIMIZED}
                                pathOptions={{
                                    color: '#34d399',
                                    weight: 4,
                                    opacity: 0.9,
                                }}
                            />
                            <AnimatedTruck coords={ROUTE_OPTIMIZED} />
                        </>
                    )}
                </MapContainer>

                {/* Toggle button */}
                <button
                    onClick={() => setShowOptimized((prev) => !prev)}
                    className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium backdrop-blur-sm transition-all hover:border-emerald-500/50"
                >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {showOptimized ? 'Ver ruta estática' : 'Ver ruta optimizada'}
                </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Distance */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500">Distancia</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                            {ROUTE_STATS.optimized.distance} km
                        </span>
                        <span className="text-sm text-red-400/70 line-through tabular-nums">
                            {ROUTE_STATS.old.distance} km
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-400/80">
                        -{ROUTE_STATS.savings.distance} km ({ROUTE_STATS.savings.percent}%)
                    </p>
                </div>

                {/* Time */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500">Tiempo</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                            {ROUTE_STATS.optimized.time} min
                        </span>
                        <span className="text-sm text-red-400/70 line-through tabular-nums">
                            {ROUTE_STATS.old.time} min
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-400/80">
                        -{ROUTE_STATS.savings.time} min ahorrados
                    </p>
                </div>

                {/* CO₂ */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500">CO₂ evitado</p>
                    <div className="mt-1">
                        <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                            {ROUTE_STATS.savings.co2} kg
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-400/80">por ruta optimizada</p>
                </div>
            </div>
        </motion.section>
    );
};

export default RoutesView;
