'use client';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center px-[6%] pt-32 pb-16 overflow-hidden">
            {/* Background layer */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-[0.25]"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&auto=format&fit=crop&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(201,168,76,0.08)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(192,57,43,0.06)_0%,transparent_60%)]" />
            </div>

            <div className="relative z-10 max-w-[780px] mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block text-xs tracking-[0.25em] uppercase text-brand-gold border border-brand-gold/40 px-5 py-2 mb-8"
                >
                    Cucina Italiana Autentica
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-italian text-[clamp(4rem,10vw,8rem)] leading-[1.1] mb-6 text-brand-cream"
                >
                    La Dolce <em className="not-italic text-brand-gold/90">Vita</em>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg text-brand-muted max-w-[520px] mx-auto mb-10 font-light leading-[1.8]"
                >
                    Experience authentic Italian cuisine crafted with passion and tradition.
                    Every dish tells a story of love and heritage.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex gap-4 justify-center flex-wrap"
                >
                    <a href="#menu" className="bg-brand-gold text-brand-bg px-10 py-4 font-bold text-sm tracking-[0.12em] uppercase transition-all hover:bg-brand-gold2 hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(201,168,76,0.3)]">
                        Il Menu
                    </a>
                    <a href="#reservation" className="bg-transparent text-brand-cream border border-brand-cream/30 px-10 py-4 font-medium text-sm tracking-[0.12em] uppercase transition-all hover:border-brand-gold hover:text-brand-gold">
                        Prenota un Tavolo
                    </a>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted text-xs tracking-[0.2em] uppercase"
            >
                <span>Scroll</span>
                <div className="w-[1px] h-[50px] bg-gradient-to-b from-brand-gold to-transparent opacity-70 animate-pulse" />
            </motion.div>
        </section>
    );
}
