import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import {
    WASTE_MOCK,
    WEATHER_FALLBACK,
    SCANNER_RESULTS,
    GAMIFICATION,
    NEARBY_CONTAINERS,
} from '../../mocks/mockData';

// Spring page transition variants
const pageVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 60 : -60,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
        x: dir < 0 ? 60 : -60,
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 },
    }),
};

// ── Screen 1: Estado de hoy ──
const ScreenStatus = () => {
    const [checkedIn, setCheckedIn] = useState(false);

    const handleCheckin = useCallback(() => {
        if (checkedIn) return;
        setCheckedIn(true);
        import('canvas-confetti').then((mod) => {
            mod.default({ particleCount: 80, spread: 55, origin: { x: 0.5, y: 0.65 }, colors: ['#34d399', '#22d3ee', '#a78bfa'] });
        });
    }, [checkedIn]);

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            <p className="mb-2 text-[10px] capitalize text-slate-400">{dateStr}</p>

            <motion.div
                className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">Hoy pasa</p>
                <p className="mt-1 text-xl font-bold text-white">{WASTE_MOCK.tipo_residuo}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] text-white backdrop-blur-sm">
                        🕐 {WASTE_MOCK.hora_inicio} - {WASTE_MOCK.hora_fin}
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] text-white backdrop-blur-sm">
                        📍 {WASTE_MOCK.zona}
                    </span>
                </div>
            </motion.div>

            <motion.div
                className="mt-3 flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            >
                <span className="text-lg">{WEATHER_FALLBACK.icon}</span>
                <div>
                    <p className="text-xs font-medium">{WEATHER_FALLBACK.temperature}°C</p>
                    <p className="text-[10px] text-slate-400">{WEATHER_FALLBACK.condition}</p>
                </div>
                <span className="ml-auto text-[10px] text-slate-500">💧 {WEATHER_FALLBACK.humidity}%</span>
            </motion.div>

            <motion.button
                onClick={handleCheckin}
                className={`mt-auto rounded-xl py-3 text-sm font-semibold transition-all ${checkedIn
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    }`}
                whileHover={!checkedIn ? { scale: 1.02 } : {}}
                whileTap={!checkedIn ? { scale: 0.97 } : {}}
            >
                {checkedIn ? '✅ ¡Registrado!' : '✅ Ya la saqué'}
            </motion.button>
        </div>
    );
};

// ── Screen 2: Tu camión en vivo (Uber/Cabify style) ──
const STEPS = [
    { label: 'Asignado', icon: '📋' },
    { label: 'En camino', icon: '🚛' },
    { label: 'Llegando', icon: '📍' },
];

const ScreenTracker = () => {
    const [eta, setEta] = useState(8);
    const [showNotif, setShowNotif] = useState(false);

    useEffect(() => { const t = setTimeout(() => setShowNotif(true), 1200); return () => clearTimeout(t); }, []);
    useEffect(() => {
        if (eta <= 0) return;
        const t = setInterval(() => setEta((p) => Math.max(0, p - 1)), 3000);
        return () => clearInterval(t);
    }, [eta]);

    const progress = ((8 - eta) / 8) * 100;
    const activeStep = eta > 5 ? 0 : eta > 1 ? 1 : 2;

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            {/* Push notification */}
            <AnimatePresence>
                {showNotif && (
                    <motion.div
                        initial={{ y: -30, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                        className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-2.5 backdrop-blur-md"
                    >
                        <span className="flex-shrink-0 text-base">🔔</span>
                        <div>
                            <p className="text-[10px] font-semibold text-emerald-400">Tu camión está en camino</p>
                            <p className="text-[9px] text-slate-400">Calle San Martín · Godoy Cruz</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Truck with pulse radar */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-800/40 backdrop-blur-sm">
                {/* Road lines */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.3) 28px, rgba(255,255,255,0.3) 32px)' }}
                />
                {/* Radar pulse circles */}
                <motion.div
                    className="absolute h-28 w-28 rounded-full border border-emerald-400/20"
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                    className="absolute h-28 w-28 rounded-full border border-emerald-400/15"
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                />
                {/* Truck */}
                <motion.div
                    className="relative z-10 text-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <span className="text-5xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(52,211,153,0.3))' }}>🚛</span>
                </motion.div>
                {/* Route info */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-slate-900/80 px-2.5 py-1.5 backdrop-blur-md">
                    <div>
                        <p className="text-[9px] font-medium text-slate-300">📍 Calle San Martín 450</p>
                        <p className="text-[8px] text-slate-500">Godoy Cruz, Mendoza</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-emerald-400 tabular-nums">{Math.max(1, Math.ceil(eta * 0.4))} cuadras</p>
                    </div>
                </div>
            </div>

            {/* Progress steps — Uber style */}
            <div className="mt-3 flex items-center gap-0.5">
                {STEPS.map((step, i) => (
                    <div key={step.label} className="flex flex-1 items-center">
                        <div className={`flex flex-col items-center gap-0.5 flex-1 ${i <= activeStep ? 'opacity-100' : 'opacity-40'
                            }`}>
                            <motion.span
                                className="text-sm"
                                animate={i === activeStep ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {step.icon}
                            </motion.span>
                            <span className={`text-[8px] font-medium ${i <= activeStep ? 'text-emerald-400' : 'text-slate-600'
                                }`}>{step.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="mx-1 h-[1px] flex-1 bg-slate-700">
                                <motion.div
                                    className="h-full bg-emerald-400"
                                    animate={{ width: i < activeStep ? '100%' : '0%' }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ETA card */}
            <motion.div
                className="mt-2.5 rounded-xl bg-slate-800/60 p-3 backdrop-blur-sm"
                layout
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-500">Tiempo estimado</p>
                        <motion.p
                            key={eta}
                            initial={{ scale: 1.15, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="text-2xl font-bold tabular-nums"
                            style={{ color: eta <= 2 ? '#34d399' : '#fff' }}
                        >
                            {eta > 0 ? `${eta} min` : '¡Llegó!'}
                        </motion.p>
                    </div>
                    <div className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${eta <= 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/60 text-slate-400'
                        }`}>
                        {activeStep === 0 ? 'Asignado' : activeStep === 1 ? 'En camino' : '¡Llegando!'}
                    </div>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// ── Screen 3: ¿Qué tiro hoy? ──
const ScreenScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<(typeof SCANNER_RESULTS)[0] | null>(null);

    const handleScan = () => {
        if (scanning) return;
        setScanning(true);
        setResult(null);
        setTimeout(() => {
            setResult(SCANNER_RESULTS[Math.floor(Math.random() * SCANNER_RESULTS.length)]);
            setScanning(false);
        }, 1500);
    };

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900">
                {/* Scan lines */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(52,211,153,0.15) 3px, rgba(52,211,153,0.15) 4px)' }}
                />
                {scanning && (
                    <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 1.5, ease: 'linear' }}
                    />
                )}

                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="text-center"
                        >
                            <span className="text-5xl">{result.emoji}</span>
                            <p className="mt-2 text-sm font-bold" style={{ color: result.color }}>{result.label}</p>
                            <p className="mt-1 text-xs text-slate-400">→ {result.action}</p>
                        </motion.div>
                    ) : scanning ? (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                className="mx-auto h-10 w-10 rounded-full border-2 border-emerald-400 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <p className="mt-3 text-[10px] text-emerald-400">Analizando...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            className="text-center text-slate-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.p
                                className="text-4xl"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                📷
                            </motion.p>
                            <p className="mt-2 text-[10px]">Apuntá al residuo</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                onClick={handleScan}
                className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
            >
                📷 Escanear residuo
            </motion.button>
            <p className="mt-2 text-center text-[8px] text-slate-600">
                Powered by UrbanSync Vision AI
            </p>
        </div>
    );
};

// ── Screen 4: Tu impacto ──
const ScreenImpact = () => {
    return (
        <div className="flex h-full flex-col p-4 pt-10">
            <motion.div
                className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 p-4 text-center border border-amber-500/20"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                <motion.p
                    className="text-4xl font-bold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🔥 {GAMIFICATION.streak}
                </motion.p>
                <p className="text-[10px] text-amber-300">días consecutivos</p>
            </motion.div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-800/60 p-3 text-center backdrop-blur-sm">
                    <p className="text-xl font-bold text-emerald-400">{GAMIFICATION.points}</p>
                    <p className="text-[9px] text-slate-400">puntos</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-3 text-center backdrop-blur-sm">
                    <p className="text-xl">{GAMIFICATION.levelEmoji}</p>
                    <p className="text-[9px] text-slate-400">{GAMIFICATION.level}</p>
                </div>
            </div>

            <div className="mt-3">
                <div className="flex justify-between text-[9px] text-slate-500">
                    <span>{GAMIFICATION.level}</span>
                    <span>{GAMIFICATION.nextLevel}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(GAMIFICATION.points / GAMIFICATION.nextLevelPoints) * 100}%` }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            <div className="mt-3 space-y-1">
                {GAMIFICATION.achievements.map((ach, i) => (
                    <motion.div
                        key={ach.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 150 }}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10px] ${ach.unlocked ? 'bg-emerald-500/10 text-slate-300' : 'bg-slate-800/30 text-slate-600'
                            }`}
                    >
                        <span className={ach.unlocked ? '' : 'opacity-30 grayscale'}>{ach.emoji}</span>
                        <span>{ach.label}</span>
                        {ach.unlocked && <span className="ml-auto text-emerald-400">✓</span>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ── Screen 5: Contenedores cercanos ──
const ScreenContainers = () => {
    const getFillStyle = (fill: number) => {
        if (fill > 80) return { bg: 'bg-red-500/15', text: 'text-red-400', bar: 'bg-red-400', dot: '🔴' };
        if (fill > 50) return { bg: 'bg-amber-500/15', text: 'text-amber-400', bar: 'bg-amber-400', dot: '🟡' };
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', bar: 'bg-emerald-400', dot: '🟢' };
    };

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-800/40 h-28 border border-slate-700/30 backdrop-blur-sm">
                <div className="text-center">
                    <p className="text-xl">📍</p>
                    <p className="text-[10px] text-slate-400">Contenedores cercanos</p>
                    <div className="mt-1 flex justify-center gap-2 text-[8px] text-slate-500">
                        <span>🟢 &lt;50%</span>
                        <span>🟡 50-80%</span>
                        <span>🔴 &gt;80%</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
                {NEARBY_CONTAINERS.map((c, i) => {
                    const s = getFillStyle(c.fill);
                    return (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 150 }}
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 ${s.bg}`}
                        >
                            <span className="text-[10px]">{s.dot}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-slate-300">Contenedor #{c.id}</p>
                                <p className="text-[8px] text-slate-500">{c.distance}</p>
                            </div>
                            <p className={`text-sm font-bold tabular-nums ${s.text}`}>{c.fill}%</p>
                            <div className="h-5 w-1 overflow-hidden rounded-full bg-slate-700">
                                <motion.div
                                    className={`w-full rounded-full ${s.bar}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${c.fill}%` }}
                                    transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                                    style={{ marginTop: `${100 - c.fill}%` }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Tabs + PhoneFrame ──
const TABS = [
    { id: 'status', label: 'Hoy', emoji: '📋' },
    { id: 'tracker', label: 'Camión', emoji: '🚛' },
    { id: 'scanner', label: 'IA', emoji: '📷' },
    { id: 'impact', label: 'Impacto', emoji: '🔥' },
    { id: 'bins', label: 'Bins', emoji: '📍' },
];

const SCREENS: Record<string, React.FC> = {
    status: ScreenStatus,
    tracker: ScreenTracker,
    scanner: ScreenScanner,
    impact: ScreenImpact,
    bins: ScreenContainers,
};

const CitizenView = () => {
    const [activeTab, setActiveTab] = useState('status');
    const [direction, setDirection] = useState(0);
    const ActiveScreen = SCREENS[activeTab];

    const handleTabChange = (tabId: string) => {
        const currentIdx = TABS.findIndex((t) => t.id === activeTab);
        const nextIdx = TABS.findIndex((t) => t.id === tabId);
        setDirection(nextIdx > currentIdx ? 1 : -1);
        setActiveTab(tabId);
    };

    return (
        <motion.section
            id="citizen"
            className="mx-auto max-w-5xl px-5 py-16 sm:py-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
        >
            {/* Title */}
            <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                <div className="mb-3 flex items-center justify-center gap-2">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                        <Smartphone className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold sm:text-3xl">La Experiencia del Vecino</h2>
                </div>
                <p className="text-sm text-slate-400">
                    Así se ve UrbanSync desde el celular del ciudadano
                </p>
            </motion.div>

            {/* Phone frame */}
            <motion.div
                className="relative mx-auto"
                style={{ maxWidth: 320 }}
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
                {/* Glow behind phone */}
                <div className="pointer-events-none absolute -inset-8 rounded-[3rem] opacity-30 blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }}
                />

                <div
                    className="phone-notch relative overflow-hidden rounded-[2.5rem] border-[3px] border-slate-700 bg-slate-900 shadow-2xl shadow-emerald-500/10"
                    style={{ aspectRatio: '9/16' }}
                >
                    {/* Status bar */}
                    <div className="relative z-20 flex items-center justify-between px-8 pt-2 text-[8px] text-slate-500">
                        <span>{new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>📶 🔋</span>
                    </div>

                    {/* Screen content with AnimatePresence */}
                    <div className="h-full overflow-hidden pb-14">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeTab}
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="h-full"
                            >
                                <ActiveScreen />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Tab bar — enhanced UX with active pill + glow */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 flex border-t border-slate-800 bg-slate-900/95 px-1 pb-1 pt-1 backdrop-blur-md">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative flex flex-1 flex-col items-center rounded-xl py-2 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-600'
                                        }`}
                                    whileTap={{ scale: 0.9 }}
                                    style={{ minHeight: 44 }}
                                >
                                    {/* Active background pill */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-xl bg-emerald-500/10"
                                            layoutId="activeTabBg"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                    <span className="relative text-sm">{tab.emoji}</span>
                                    <span className={`relative mt-0.5 text-[7px] font-medium ${isActive ? 'text-emerald-400' : 'text-slate-500'
                                        }`}>{tab.label}</span>
                                    {/* Glow dot */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute -top-0.5 right-1/2 h-1 w-1 translate-x-1/2 rounded-full bg-emerald-400"
                                            layoutId="activeTabDot"
                                            style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default CitizenView;
