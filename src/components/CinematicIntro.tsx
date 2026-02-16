import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CinematicIntroProps = {
    onComplete: () => void;
};

const TYPING_TEXT = '> initializing urbansync_ai';
const LOGO_TEXT = 'URBANSYNC AI';
const SUBTITLE = 'Inteligencia Artificial para Ciudades Limpias';

// ── Lightweight CSS-only background ──
// Uses a single CSS gradient animation instead of 30 JS-animated particles + blurred auroras
const CSS_BG = `
  @keyframes intro-glow {
    0%, 100% { opacity: 0.12; transform: translate(-50%,-50%) scale(1); }
    50%      { opacity: 0.22; transform: translate(-50%,-50%) scale(1.15); }
  }
  @keyframes intro-grid-drift {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }
  @keyframes intro-scan {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
  .intro-glow-orb {
    position: absolute; left: 50%; top: 50%;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, rgba(52,211,153,0.25), rgba(34,211,238,0.15), rgba(168,85,247,0.1), rgba(52,211,153,0.25));
    animation: intro-glow 6s ease-in-out infinite;
    will-change: opacity, transform;
    filter: blur(80px);
    pointer-events: none;
  }
  .intro-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: intro-grid-drift 20s linear infinite;
    pointer-events: none;
  }
  .intro-scan {
    position: absolute; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 10%, rgba(52,211,153,0.35) 50%, transparent 90%);
    animation: intro-scan 3s linear infinite;
    pointer-events: none;
  }
`;

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
    const [phase, setPhase] = useState(0);
    const [typedChars, setTypedChars] = useState(0);
    const [visible, setVisible] = useState(true);

    const skip = useCallback(() => {
        setVisible(false);
        sessionStorage.setItem('intro_seen', 'true');
        setTimeout(onComplete, 100);
    }, [onComplete]);

    // Inject lightweight CSS once
    useEffect(() => {
        if (document.getElementById('intro-css')) return;
        const s = document.createElement('style');
        s.id = 'intro-css';
        s.textContent = CSS_BG;
        document.head.appendChild(s);
        return () => { s.remove(); };
    }, []);

    // Phase 0: typing
    useEffect(() => {
        if (phase !== 0) return;
        if (typedChars >= TYPING_TEXT.length) {
            const t = setTimeout(() => setPhase(1), 400);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setTypedChars((c) => c + 1), 50);
        return () => clearTimeout(t);
    }, [phase, typedChars]);

    // Phase 1: logo reveal → wait → phase 2
    useEffect(() => {
        if (phase !== 1) return;
        const t = setTimeout(() => setPhase(2), 1600);
        return () => clearTimeout(t);
    }, [phase]);

    // Phase 2: subtitle → hold 2.8s → phase 3
    useEffect(() => {
        if (phase !== 2) return;
        const t = setTimeout(() => setPhase(3), 2800);
        return () => clearTimeout(t);
    }, [phase]);

    // Phase 3: fade out
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
                {/* CSS-only background — zero JS overhead */}
                <div className="intro-glow-orb" />
                <div className="intro-grid" />
                {phase < 3 && <div className="intro-scan" />}

                <div className="relative z-10 text-center px-6">
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

                    {/* Logo — single motion.h1 fade-in instead of per-char springs */}
                    {phase >= 1 && (
                        <motion.h1
                            className="mb-4 text-4xl font-black tracking-[0.15em] sm:text-5xl lg:text-7xl"
                            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                color: '#fff',
                                textShadow:
                                    '0 0 40px rgba(52,211,153,0.6), 0 0 80px rgba(52,211,153,0.3), 0 0 120px rgba(34,211,238,0.15)',
                            }}
                        >
                            {LOGO_TEXT}
                        </motion.h1>
                    )}

                    {/* Subtitle — single element fade-in */}
                    {phase >= 2 && (
                        <motion.p
                            className="text-sm text-slate-400 sm:text-base lg:text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            {SUBTITLE}
                        </motion.p>
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

                {/* Skip button */}
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
