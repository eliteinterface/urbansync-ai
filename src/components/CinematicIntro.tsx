import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CinematicIntroProps = {
    onComplete: () => void;
};

const TYPING_TEXT = '> initializing urbansync';
const LOGO_TEXT = 'URBANSYNC AI';
const SUBTITLE = 'Inteligencia Artificial para Ciudades Limpias';

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
    const [phase, setPhase] = useState(0); // 0=typing, 1=logo, 2=subtitle, 3=fadeout
    const [typedChars, setTypedChars] = useState(0);
    const [logoChars, setLogoChars] = useState(0);
    const [visible, setVisible] = useState(true);

    const skip = useCallback(() => {
        setVisible(false);
        sessionStorage.setItem('intro_seen', 'true');
        setTimeout(onComplete, 100);
    }, [onComplete]);

    // Phase 0: Typing effect
    useEffect(() => {
        if (phase !== 0) return;
        if (typedChars >= TYPING_TEXT.length) {
            const t = setTimeout(() => setPhase(1), 400);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setTypedChars((c) => c + 1), 60);
        return () => clearTimeout(t);
    }, [phase, typedChars]);

    // Phase 1: Logo letter by letter
    useEffect(() => {
        if (phase !== 1) return;
        if (logoChars >= LOGO_TEXT.length) {
            const t = setTimeout(() => setPhase(2), 600);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setLogoChars((c) => c + 1), 100);
        return () => clearTimeout(t);
    }, [phase, logoChars]);

    // Phase 2: Subtitle then fade
    useEffect(() => {
        if (phase !== 2) return;
        const t = setTimeout(() => setPhase(3), 1500);
        return () => clearTimeout(t);
    }, [phase]);

    // Phase 3: Fade out
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
                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(52,211,153,0.3) 0%, rgba(34,211,238,0.1) 50%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Typing text */}
                <div className="relative z-10 text-center">
                    {phase >= 0 && (
                        <p className="mb-8 font-mono text-sm text-emerald-400 sm:text-base">
                            {TYPING_TEXT.slice(0, typedChars)}
                            <span className="animate-blink">_</span>
                        </p>
                    )}

                    {/* Logo */}
                    {phase >= 1 && (
                        <h1 className="mb-4 text-4xl font-black tracking-[0.2em] sm:text-5xl lg:text-6xl">
                            {LOGO_TEXT.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={i < logoChars ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.15 }}
                                    className="inline-block"
                                    style={{
                                        color: '#fff',
                                        textShadow:
                                            i < logoChars
                                                ? '0 0 30px rgba(52,211,153,0.6), 0 0 60px rgba(52,211,153,0.3)'
                                                : 'none',
                                    }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </h1>
                    )}

                    {/* Subtitle */}
                    {phase >= 2 && (
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-sm text-slate-400 sm:text-base"
                        >
                            {SUBTITLE}
                        </motion.p>
                    )}
                </div>

                {/* Skip button */}
                <button
                    onClick={skip}
                    className="absolute bottom-8 right-8 z-20 text-xs text-slate-600 transition-colors hover:text-slate-400"
                >
                    Saltar →
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default CinematicIntro;
