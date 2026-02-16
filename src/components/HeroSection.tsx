import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type CounterProps = {
    target: number;
    duration?: number;
    prefix?: string;
    suffix: string;
    decimals?: number;
    label: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const AnimatedCounter = ({
    target,
    duration = 2000,
    prefix = '',
    suffix,
    decimals = 0,
    label,
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
                        const easedProgress = easeOutExpo(progress);
                        setValue(easedProgress * target);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    const formatted = decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('es-AR');

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl font-extrabold tabular-nums sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {prefix}{formatted}
                </span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 sm:text-sm">
                {suffix}
            </p>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">{label}</p>
        </div>
    );
};

const HeroSection = () => {
    return (
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-16">
            {/* Background radial glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(52,211,153,0.4) 0%, rgba(34,211,238,0.15) 40%, transparent 70%)',
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl">
                {/* Stats grid */}
                <motion.div
                    className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <AnimatedCounter
                        target={847}
                        suffix="km"
                        label="Km innecesarios por día"
                    />
                    <AnimatedCounter
                        target={12.4}
                        suffix="ton"
                        decimals={1}
                        label="CO₂ evitable por mes"
                    />
                    <AnimatedCounter
                        target={180000}
                        prefix="USD "
                        suffix="/año"
                        label="Presupuesto desperdiciado"
                    />
                </motion.div>

                {/* Headline */}
                <motion.div
                    className="mt-12 text-center sm:mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h1 className="mx-auto max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                        Los municipios del Gran Mendoza gastan millones en rutas que{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            ninguna IA optimiza.
                        </span>{' '}
                        Hasta ahora.
                    </h1>
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="mt-10 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <button
                        onClick={() =>
                            document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
                        }
                        className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:text-white"
                    >
                        ↓ Ver cómo funciona
                        <span className="inline-block transition-transform group-hover:translate-y-1">
                            ↓
                        </span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
