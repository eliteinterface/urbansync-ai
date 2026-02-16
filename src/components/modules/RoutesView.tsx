import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRightLeft, Navigation } from 'lucide-react';
import {
    GODOY_CRUZ_CENTER,
    ROUTE_OLD,
    ROUTE_OPTIMIZED,
    ROUTE_STATS,
} from '../../mocks/mockData';

const AnimatedTruck = ({ coords }: { coords: [number, number][] }) => {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);
    const indexRef = useRef(0);

    const truckIcon = useMemo(
        () =>
            L.divIcon({
                html: '<span style="font-size:24px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5))">🚛</span>',
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
        return () => { clearInterval(interval); marker.remove(); };
    }, [map, coords, truckIcon]);

    return null;
};

const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const, delay: i * 0.1 },
    }),
};

const RoutesView = () => {
    const [showOptimized, setShowOptimized] = useState(true);

    return (
        <motion.section
            id="routes"
            className="mx-auto max-w-5xl px-5 py-16 sm:py-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
        >
            {/* Title */}
            <motion.div
                className="mb-10 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                <div className="rounded-lg bg-cyan-500/10 p-2">
                    <Navigation className="h-5 w-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                    Optimización de Rutas
                </h2>
            </motion.div>

            {/* Map */}
            <motion.div
                className="relative mb-6 overflow-hidden rounded-2xl border border-slate-800/50"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            >
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
                    <Polyline
                        positions={ROUTE_OLD}
                        pathOptions={{
                            color: '#ef4444',
                            weight: 3,
                            dashArray: '8,8',
                            opacity: showOptimized ? 0.35 : 0.9,
                        }}
                    />
                    {showOptimized && (
                        <>
                            <Polyline
                                positions={ROUTE_OPTIMIZED}
                                pathOptions={{ color: '#34d399', weight: 4, opacity: 0.9 }}
                            />
                            <AnimatedTruck coords={ROUTE_OPTIMIZED} />
                        </>
                    )}
                </MapContainer>

                {/* Toggle button */}
                <motion.button
                    onClick={() => setShowOptimized((prev) => !prev)}
                    className="absolute right-4 top-4 z-[1000] flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-medium backdrop-blur-md transition-all hover:border-emerald-500/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {showOptimized ? 'Ver estática' : 'Ver optimizada'}
                </motion.button>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 z-[1000] flex gap-3 rounded-full bg-slate-900/90 px-4 py-2 text-[10px] backdrop-blur-md">
                    <span className="flex items-center gap-1.5">
                        <span className="h-[2px] w-4 rounded bg-red-400" style={{ opacity: 0.7 }} />
                        <span className="text-slate-400">Ruta estática</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-[2px] w-4 rounded bg-emerald-400" />
                        <span className="text-slate-400">Ruta UrbanSync</span>
                    </span>
                </div>
            </motion.div>

            {/* Stats strip */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                    {
                        label: 'Distancia',
                        newVal: `${ROUTE_STATS.optimized.distance} km`,
                        oldVal: `${ROUTE_STATS.old.distance} km`,
                        savings: `-${ROUTE_STATS.savings.distance} km (${ROUTE_STATS.savings.percent}%)`,
                        icon: '📏',
                    },
                    {
                        label: 'Tiempo',
                        newVal: `${ROUTE_STATS.optimized.time} min`,
                        oldVal: `${ROUTE_STATS.old.time} min`,
                        savings: `-${ROUTE_STATS.savings.time} min`,
                        icon: '⏱️',
                    },
                    {
                        label: 'CO₂ evitado',
                        newVal: `${ROUTE_STATS.savings.co2} kg`,
                        oldVal: null,
                        savings: 'por ruta optimizada',
                        icon: '🌿',
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        custom={i}
                        variants={statCardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="group rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-700"
                        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{stat.icon}</span>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</p>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                                {stat.newVal}
                            </span>
                            {stat.oldVal && (
                                <span className="text-sm text-red-400/60 line-through tabular-nums">
                                    {stat.oldVal}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-emerald-400/70">{stat.savings}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default RoutesView;
