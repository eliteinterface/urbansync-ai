import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Box, Leaf, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DASHBOARD_KPIS, EVENT_FEED, CHART_DATA } from '../../mocks/mockData';

const KPI_CONFIG = [
    { key: 'trucks' as const, label: 'Camiones activos', icon: Truck, format: (v: number) => v.toString() },
    { key: 'containers' as const, label: 'Contenedores', icon: Box, format: (v: number) => v.toString() },
    { key: 'co2Saved' as const, label: 'CO₂ ahorrado (ton)', icon: Leaf, format: (v: number) => v.toFixed(1) },
    { key: 'costSaved' as const, label: 'Ahorro USD/mes', icon: DollarSign, format: (v: number) => `$${v.toLocaleString('es-AR')}` },
];

const DashboardView = () => {
    const [kpis, setKpis] = useState(DASHBOARD_KPIS);
    const [chartData, setChartData] = useState(CHART_DATA);
    const [events, setEvents] = useState(EVENT_FEED.slice(0, 5));
    const [eventIdx, setEventIdx] = useState(5);
    const feedRef = useRef<HTMLDivElement>(null);

    // KPI micro-updates every 5s
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

    // Chart update every 3s
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

    // Event feed every 4s
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

    // Auto-scroll feed
    useEffect(() => {
        feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }, [events]);

    return (
        <motion.section
            id="dashboard"
            className="mx-auto max-w-5xl px-5 py-16 sm:py-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
        >
            {/* Title */}
            <div className="mb-10 flex items-center gap-3">
                <span className="inline-block h-3 w-3 animate-glow-pulse rounded-full bg-emerald-400" />
                <h2 className="text-2xl font-bold sm:text-3xl">Centro de Comando Municipal</h2>
            </div>

            {/* KPI Grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {KPI_CONFIG.map(({ key, label, icon: Icon, format }) => (
                    <div
                        key={key}
                        className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm"
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs text-slate-500">{label}</span>
                        </div>
                        <motion.p
                            key={kpis[key]}
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold tabular-nums sm:text-3xl"
                        >
                            {format(kpis[key])}
                        </motion.p>
                    </div>
                ))}
            </div>

            {/* Chart + Feed row */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* Area Chart */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm lg:col-span-2">
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
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    fontSize: '12px',
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
                </div>

                {/* Event Feed */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/60 p-4 backdrop-blur-sm">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Feed de eventos
                    </p>
                    <div
                        ref={feedRef}
                        className="max-h-48 space-y-2 overflow-y-auto pr-1"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {events.map((evt, i) => (
                            <motion.div
                                key={`${evt.time}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs ${evt.type === 'warning' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                                    }`}
                            >
                                <span className="shrink-0">{evt.icon}</span>
                                <div>
                                    <span className="font-mono text-slate-500">{evt.time}</span>
                                    <span className="ml-1 text-slate-300">{evt.message}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default DashboardView;
