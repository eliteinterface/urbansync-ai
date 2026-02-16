import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Floating orbs for background depth
const FloatingOrbs = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
            className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full opacity-[0.07] blur-3xl"
            animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }}
        />
        <motion.div
            className="absolute -left-32 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-[0.05] blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }}
        />
    </div>
);

// Stagger container + item variants
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

type CounterProps = {
    target: number;
    duration?: number;
    prefix?: string;
    suffix: string;
    decimals?: number;
    label: string;
    icon: string;
};

const AnimatedCounter = ({
    target,
    duration = 2000,
    prefix = '',
    suffix,
    decimals = 0,
    label,
    icon,
}: CounterProps) => {
    const [value, setValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        setValue(easeOutExpo(progress) * target);
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    const formatted =
        decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('es-AR');

    return (
        <motion.div
            ref={ref}
            variants={itemVariants}
            className="group relative rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-900/60"
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: 'inset 0 0 60px rgba(52,211,153,0.06)' }}
            />
            <span className="mb-3 inline-block text-2xl">{icon}</span>
            <div className="text-3xl font-extrabold tabular-nums sm:text-4xl lg:text-5xl">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {prefix}
                    {formatted}
                </span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 sm:text-sm">
                {suffix}
            </p>
            <p className="mt-2 text-sm text-slate-400">{label}</p>
        </motion.div>
    );
};

const HeroSection = () => {
    return (
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-16">
            <FloatingOrbs />

            {/* Subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(52,211,153,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.5) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-5xl">
                {/* Headline first — value prop */}
                <motion.div
                    className="mb-12 text-center sm:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.1 }}
                >
                    <motion.p
                        className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-emerald-400/70"
                        initial={{ opacity: 0, letterSpacing: '0.5em' }}
                        animate={{ opacity: 1, letterSpacing: '0.3em' }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Plataforma de IA para residuos urbanos
                    </motion.p>
                    <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Los municipios gastan millones en rutas que{' '}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-x_3s_ease_infinite]">
                                ninguna IA optimiza
                            </span>
                        </span>
                    </h1>
                    <motion.p
                        className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Hasta ahora.
                    </motion.p>
                </motion.div>

                {/* Stats grid with stagger */}
                <motion.div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatedCounter
                        target={847}
                        suffix="km / día"
                        label="Kilómetros innecesarios"
                        icon="🛣️"
                    />
                    <AnimatedCounter
                        target={12.4}
                        suffix="toneladas CO₂"
                        decimals={1}
                        label="Emisiones evitables por mes"
                        icon="🌿"
                    />
                    <AnimatedCounter
                        target={180000}
                        prefix="$"
                        suffix="USD / año"
                        label="Presupuesto desperdiciado"
                        icon="💰"
                    />
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.button
                        onClick={() =>
                            document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-slate-700 bg-slate-900/60 px-8 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:text-white"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {/* Animated shine effect on hover */}
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">Ver cómo funciona</span>
                        <motion.span
                            className="relative inline-block"
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            ↓
                        </motion.span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
