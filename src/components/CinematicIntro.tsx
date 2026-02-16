import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CinematicIntroProps = {
    onComplete: () => void;
};

const TYPING_TEXT = '> initializing urbansync_ai';
const LOGO_TEXT = 'URBANSYNC AI';
const SUBTITLE = 'Inteligencia Artificial para Ciudades Limpias';

// Floating particles for the intro background
const Particles = () => {
    const particles = useMemo(
        () =>
            Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                duration: Math.random() * 8 + 6,
                delay: Math.random() * 4,
            })),
        []
    );

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-emerald-400"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                        y: [0, -60, -120],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

// Animated aurora mesh background
const AuroraMesh = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
            className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                background:
                    'conic-gradient(from 0deg, rgba(52,211,153,0.3), rgba(34,211,238,0.2), rgba(168,85,247,0.15), rgba(52,211,153,0.3))',
            }}
        />
        <motion.div
            className="absolute left-1/3 top-2/3 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
            animate={{
                scale: [1.1, 0.9, 1.1],
                x: [-20, 20, -20],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)',
            }}
        />
    </div>
);

// Horizontal scan line effect
const ScanLine = ({ phase }: { phase: number }) =>
    phase < 3 ? (
        <motion.div
            className="pointer-events-none absolute left-0 right-0 h-[1px]"
            style={{
                background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)',
            }}
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
    ) : null;

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
    const [phase, setPhase] = useState(0);
    const [typedChars, setTypedChars] = useState(0);
    const [logoChars, setLogoChars] = useState(0);
    const [visible, setVisible] = useState(true);

    const skip = useCallback(() => {
        setVisible(false);
        sessionStorage.setItem('intro_seen', 'true');
        setTimeout(onComplete, 100);
    }, [onComplete]);

    useEffect(() => {
        if (phase !== 0) return;
        if (typedChars >= TYPING_TEXT.length) {
            const t = setTimeout(() => setPhase(1), 400);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setTypedChars((c) => c + 1), 50);
        return () => clearTimeout(t);
    }, [phase, typedChars]);

    useEffect(() => {
        if (phase !== 1) return;
        if (logoChars >= LOGO_TEXT.length) {
            const t = setTimeout(() => setPhase(2), 600);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setLogoChars((c) => c + 1), 80);
        return () => clearTimeout(t);
    }, [phase, logoChars]);

    useEffect(() => {
        if (phase !== 2) return;
        const t = setTimeout(() => setPhase(3), 1200);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        if (phase !== 3) return;
        const t = setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem('intro_seen', 'true');
            onComplete();
        }, 600);
        return () => clearTimeout(t);
    }, [phase, onComplete]);

    if (!visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
                initial={{ opacity: 1 }}
                animate={{ opacity: phase === 3 ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <AuroraMesh />
                <Particles />
                <ScanLine phase={phase} />

                {/* Grid overlay for tech feel */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="relative z-10 text-center">
                    {/* Typing text */}
                    {phase >= 0 && (
                        <motion.p
                            className="mb-8 font-mono text-sm text-emerald-400/80 sm:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {TYPING_TEXT.slice(0, typedChars)}
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity }}
                            >
                                █
                            </motion.span>
                        </motion.p>
                    )}

                    {/* Logo with spring + glow */}
                    {phase >= 1 && (
                        <h1 className="mb-4 text-4xl font-black tracking-[0.15em] sm:text-5xl lg:text-7xl">
                            {LOGO_TEXT.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.5, filter: 'blur(8px)' }}
                                    animate={
                                        i < logoChars
                                            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                                            : {}
                                    }
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 15,
                                        delay: i * 0.02,
                                    }}
                                    className="inline-block"
                                    style={{
                                        color: '#fff',
                                        textShadow:
                                            i < logoChars
                                                ? '0 0 40px rgba(52,211,153,0.7), 0 0 80px rgba(52,211,153,0.4), 0 0 120px rgba(34,211,238,0.2)'
                                                : 'none',
                                    }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </h1>
                    )}

                    {/* Subtitle with stagger */}
                    {phase >= 2 && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.03 } },
                            }}
                        >
                            <p className="text-sm text-slate-400 sm:text-base lg:text-lg">
                                {SUBTITLE.split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 5 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="inline-block"
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                ))}
                            </p>
                        </motion.div>
                    )}

                    {/* Decorative line */}
                    {phase >= 1 && (
                        <motion.div
                            className="mx-auto mt-6 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                        />
                    )}
                </div>

                {/* Skip button with hover effect */}
                <motion.button
                    onClick={skip}
                    className="absolute bottom-8 right-8 z-20 rounded-full border border-slate-800 px-4 py-1.5 text-xs text-slate-600 transition-all hover:border-slate-600 hover:text-slate-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Saltar →
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};

export default CinematicIntro;
