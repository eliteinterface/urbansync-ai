import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import {
    WASTE_MOCK,
    WEATHER_FALLBACK,
    SCANNER_RESULTS,
    GAMIFICATION,
    NEARBY_CONTAINERS,
    GODOY_CRUZ_CENTER,
} from '../../mocks/mockData';

// ── Screen 1: Estado de hoy ──
const ScreenStatus = () => {
    const [checkedIn, setCheckedIn] = useState(false);

    const handleCheckin = useCallback(() => {
        if (checkedIn) return;
        setCheckedIn(true);
        import('canvas-confetti').then((mod) => {
            mod.default({ particleCount: 100, spread: 60, origin: { x: 0.5, y: 0.7 } });
        });
    }, [checkedIn]);

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            <p className="mb-1 text-[10px] capitalize text-slate-400">{dateStr}</p>

            {/* Status card */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                    Hoy pasa
                </p>
                <p className="mt-1 text-xl font-bold text-white">{WASTE_MOCK.tipo_residuo}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">
                        🕐 {WASTE_MOCK.hora_inicio} - {WASTE_MOCK.hora_fin}
                    </span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">
                        📍 {WASTE_MOCK.zona}
                    </span>
                </div>
            </div>

            {/* Weather strip */}
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2">
                <span className="text-lg">{WEATHER_FALLBACK.icon}</span>
                <div>
                    <p className="text-xs font-medium">{WEATHER_FALLBACK.temperature}°C</p>
                    <p className="text-[10px] text-slate-400">{WEATHER_FALLBACK.condition}</p>
                </div>
            </div>

            {/* Check-in button */}
            <button
                onClick={handleCheckin}
                className={`mt-auto rounded-xl py-3 text-sm font-semibold transition-all ${checkedIn
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-emerald-500 text-white active:scale-95'
                    }`}
            >
                {checkedIn ? '✅ ¡Listo!' : '✅ Ya la saqué'}
            </button>
        </div>
    );
};

// ── Screen 2: Tu camión en vivo ──
const ScreenTracker = () => {
    const [eta, setEta] = useState(8);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShowNotification(true), 2000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (eta <= 0) return;
        const t = setInterval(() => setEta((prev) => Math.max(0, prev - 1)), 3000);
        return () => clearInterval(t);
    }, [eta]);

    const progress = ((8 - eta) / 8) * 100;

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            {/* Push notification */}
            {showNotification && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-3 rounded-xl bg-slate-700/80 p-2.5 text-[10px] backdrop-blur"
                >
                    <p className="font-semibold text-white">🚛 Tu camión se acerca</p>
                    <p className="text-slate-300">Preparate para sacar la bolsa</p>
                </motion.div>
            )}

            {/* Map placeholder */}
            <div className="relative flex-1 rounded-xl bg-slate-800/60 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <span className="text-4xl">🚛</span>
                    <p className="mt-2 text-xs text-slate-400">Godoy Cruz · Villa Marini</p>
                </div>
                {/* Animated progress route */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                    <motion.div
                        className="h-full bg-emerald-400"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* ETA */}
            <div className="mt-3 rounded-xl bg-slate-800/60 p-3 text-center">
                <p className="text-[10px] text-slate-400">Llega en</p>
                <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                    {eta > 0 ? `${eta} min` : '¡Ahora!'}
                </p>
                <p className="text-[10px] text-slate-500">A {Math.max(1, Math.ceil(eta * 0.4))} cuadras</p>
            </div>
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
            const random = SCANNER_RESULTS[Math.floor(Math.random() * SCANNER_RESULTS.length)];
            setResult(random);
            setScanning(false);
        }, 1500);
    };

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            {/* Camera frame */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-900 border border-slate-700">
                {/* Scan lines */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(52,211,153,0.1) 3px, rgba(52,211,153,0.1) 4px)',
                    }}
                />
                {scanning && (
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 opacity-80 animate-scan-line" />
                )}

                {result ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <span className="text-4xl">{result.emoji}</span>
                        <p className="mt-2 text-sm font-bold" style={{ color: result.color }}>
                            {result.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">→ {result.action}</p>
                    </motion.div>
                ) : scanning ? (
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                        <p className="mt-2 text-[10px] text-slate-400">Analizando...</p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <p className="text-3xl">📷</p>
                        <p className="mt-2 text-[10px]">Apuntá al residuo</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleScan}
                className="mt-3 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-white active:scale-95 transition-transform"
            >
                📷 Escanear residuo
            </button>

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
            {/* Streak */}
            <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-3 text-center border border-amber-500/20">
                <p className="text-3xl font-bold">🔥 {GAMIFICATION.streak}</p>
                <p className="text-[10px] text-amber-300">días consecutivos</p>
            </div>

            {/* Points + Level */}
            <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-400">{GAMIFICATION.points}</p>
                    <p className="text-[10px] text-slate-400">puntos</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                    <p className="text-xl">{GAMIFICATION.levelEmoji}</p>
                    <p className="text-[10px] text-slate-400">{GAMIFICATION.level}</p>
                </div>
            </div>

            {/* Progress to next level */}
            <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{GAMIFICATION.level}</span>
                    <span>{GAMIFICATION.nextLevel}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{
                            width: `${(GAMIFICATION.points / GAMIFICATION.nextLevelPoints) * 100}%`,
                        }}
                    />
                </div>
                <p className="mt-1 text-center text-[10px] text-slate-500">
                    {GAMIFICATION.nextLevelPoints - GAMIFICATION.points} pts para el siguiente nivel
                </p>
            </div>

            {/* Achievements */}
            <div className="mt-3 space-y-1.5">
                {GAMIFICATION.achievements.map((ach) => (
                    <div
                        key={ach.label}
                        className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[10px] ${ach.unlocked
                                ? 'bg-emerald-500/10 text-slate-300'
                                : 'bg-slate-800/40 text-slate-600'
                            }`}
                    >
                        <span className={ach.unlocked ? '' : 'opacity-40'}>{ach.emoji}</span>
                        <span>{ach.label}</span>
                        {ach.unlocked && <span className="ml-auto text-emerald-400">✓</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Screen 5: Contenedores cercanos ──
const ScreenContainers = () => {
    const getFillColor = (fill: number) => {
        if (fill > 80) return { bg: 'bg-red-500/20', text: 'text-red-400', dot: '🔴' };
        if (fill > 50) return { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: '🟡' };
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: '🟢' };
    };

    return (
        <div className="flex h-full flex-col p-4 pt-10">
            {/* Mini map placeholder */}
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-800/60 h-32 border border-slate-700/50">
                <div className="text-center">
                    <p className="text-2xl">📍</p>
                    <p className="text-[10px] text-slate-400">Contenedores cercanos</p>
                    <div className="mt-1 flex justify-center gap-2 text-[8px]">
                        <span>🟢 &lt;50%</span>
                        <span>🟡 50-80%</span>
                        <span>🔴 &gt;80%</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto">
                {NEARBY_CONTAINERS.map((c) => {
                    const fill = getFillColor(c.fill);
                    return (
                        <div
                            key={c.id}
                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${fill.bg}`}
                        >
                            <span className="text-xs">{fill.dot}</span>
                            <div className="flex-1">
                                <p className="text-[10px] font-medium text-slate-300">
                                    Contenedor #{c.id}
                                </p>
                                <p className="text-[8px] text-slate-500">{c.distance}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold tabular-nums ${fill.text}`}>{c.fill}%</p>
                            </div>
                            {/* Fill bar */}
                            <div className="h-6 w-1 rounded-full bg-slate-700 overflow-hidden">
                                <div
                                    className={`w-full rounded-full ${c.fill > 80
                                            ? 'bg-red-400'
                                            : c.fill > 50
                                                ? 'bg-amber-400'
                                                : 'bg-emerald-400'
                                        }`}
                                    style={{ height: `${c.fill}%`, marginTop: `${100 - c.fill}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Tabs ──
const TABS = [
    { id: 'status', label: 'Hoy', emoji: '📋' },
    { id: 'tracker', label: 'Camión', emoji: '🚛' },
    { id: 'scanner', label: 'Escanear', emoji: '📷' },
    { id: 'impact', label: 'Impacto', emoji: '🔥' },
    { id: 'bins', label: 'Contenedores', emoji: '📍' },
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
    const ActiveScreen = SCREENS[activeTab];

    return (
        <motion.section
            id="citizen"
            className="mx-auto max-w-5xl px-5 py-16 sm:py-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
        >
            {/* Title */}
            <div className="mb-4 text-center">
                <div className="mb-3 flex items-center justify-center gap-2">
                    <Smartphone className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-2xl font-bold sm:text-3xl">La Experiencia del Vecino</h2>
                </div>
                <p className="text-sm text-slate-400">
                    Así se ve UrbanSync desde el celular del ciudadano
                </p>
            </div>

            {/* Phone frame */}
            <motion.div
                className="relative mx-auto"
                style={{ maxWidth: 320 }}
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="phone-notch relative overflow-hidden rounded-[2.5rem] border-[3px] border-slate-700 bg-slate-900 shadow-2xl shadow-emerald-500/10"
                    style={{ aspectRatio: '9/16' }}
                >
                    {/* Status bar */}
                    <div className="relative z-20 flex items-center justify-between px-8 pt-2 text-[8px] text-slate-400">
                        <span>{new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>📶 🔋</span>
                    </div>

                    {/* Screen content */}
                    <div className="h-full pb-14">
                        <ActiveScreen />
                    </div>

                    {/* Bottom tab bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 flex border-t border-slate-800 bg-slate-900/95 backdrop-blur">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 flex-col items-center py-2 transition-colors ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-600'
                                    }`}
                            >
                                <span className="text-sm">{tab.emoji}</span>
                                <span className="text-[7px] mt-0.5">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default CitizenView;
