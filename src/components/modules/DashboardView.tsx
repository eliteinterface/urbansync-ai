import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Box, Leaf, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DASHBOARD_KPIS, EVENT_FEED, CHART_DATA } from '../../mocks/mockData';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: 'easeOut' as const },
    },
};

const KPI_CONFIG = [
    { key: 'trucks' as const, label: 'Camiones activos', icon: Truck, color: '#34d399', format: (v: number) => v.toString() },
    { key: 'containers' as const, label: 'Contenedores', icon: Box, color: '#22d3ee', format: (v: number) => v.toString() },
    { key: 'co2Saved' as const, label: 'CO₂ ahorrado (ton)', icon: Leaf, color: '#a78bfa', format: (v: number) => v.toFixed(1) },
    { key: 'costSaved' as const, label: 'Ahorro USD/mes', icon: DollarSign, color: '#fbbf24', format: (v: number) => `$${v.toLocaleString('es-AR')}` },
];

const DashboardView = () => {
    const [kpis, setKpis] = useState(DASHBOARD_KPIS);
    const [chartData, setChartData] = useState(CHART_DATA);
    const [events, setEvents] = useState(EVENT_FEED.slice(0, 5));
    const [eventIdx, setEventIdx] = useState(5);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setKpis((prev) => ({
                trucks: prev.trucks + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
                containers: prev.containers + Math.floor((Math.random() - 0.5) * 6),
                co2Saved: +(prev.co2Saved + (Math.random() - 0.3) * 0.2).toFixed(1),
                costSaved: prev.costSaved + Math.floor((Math.random() - 0.3) * 100),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setChartData((prev) => {
                const next = [...prev.slice(1)];
                const lastHour = prev[prev.length - 1].hour;
                const h = (parseInt(lastHour.split(':')[0], 10) + 1) % 24;
                next.push({
                    hour: `${String(h).padStart(2, '0')}:00`,
                    saturation: Math.round(40 + Math.random() * 45),
                });
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventIdx((prev) => {
                const nextIdx = prev % EVENT_FEED.length;
                setEvents((evts) => [...evts.slice(-8), EVENT_FEED[nextIdx]]);
                return prev + 1;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }, [events]);

    return (
        <motion.section
            id="dashboard"
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
                <span className="relative inline-flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <h2 className="text-2xl font-bold sm:text-3xl">Centro de Comando Municipal</h2>
                <span className="ml-auto rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">
                    EN VIVO
                </span>
            </motion.div>

            {/* KPI Grid with stagger */}
            <motion.div
                className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
            >
                {KPI_CONFIG.map(({ key, label, icon: Icon, color, format }) => (
                    <motion.div
                        key={key}
                        variants={cardVariants}
                        className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-700"
                        whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                    >
                        {/* Accent top line */}
                        <div className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                        />
                        <div className="mb-2 flex items-center gap-2">
                            <div className="rounded-lg p-1.5" style={{ backgroundColor: `${color}15` }}>
                                <Icon className="h-3.5 w-3.5" style={{ color }} />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
                        </div>
                        <motion.p
                            key={kpis[key]}
                            initial={{ opacity: 0.5, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="text-2xl font-bold tabular-nums sm:text-3xl"
                        >
                            {format(kpis[key])}
                        </motion.p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Chart + Feed row */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Area Chart */}
                <motion.div
                    className="overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
                >
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Saturación de contenedores — 24h
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="hour"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                interval={5}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                }}
                                labelStyle={{ color: '#94a3b8' }}
                                itemStyle={{ color: '#34d399' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="saturation"
                                stroke="#34d399"
                                strokeWidth={2}
                                fill="url(#satGrad)"
                                animationDuration={300}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Event Feed */}
                <motion.div
                    className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.3 }}
                >
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Feed en tiempo real
                    </p>
                    <div
                        ref={feedRef}
                        className="max-h-48 space-y-1.5 overflow-y-auto pr-1"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {events.map((evt, i) => (
                            <motion.div
                                key={`${evt.time}-${i}`}
                                initial={{ opacity: 0, x: -12, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className={`flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs transition-colors ${evt.type === 'warning'
                                    ? 'bg-amber-500/10 hover:bg-amber-500/15'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/15'
                                    }`}
                            >
                                <span className="shrink-0 text-sm">{evt.icon}</span>
                                <div>
                                    <span className="font-mono text-slate-600">{evt.time}</span>
                                    <span className="ml-1.5 text-slate-300">{evt.message}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default DashboardView;
