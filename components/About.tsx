'use client';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id="about" className="py-24 px-[6%] bg-brand-surface">
            <div className="grid md:grid-cols-2 gap-24 items-center max-w-[1200px] mx-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <img
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80"
                        alt="Chef working with fire"
                        className="w-full h-[520px] object-cover border border-brand-border"
                    />
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-bg p-6 text-center shadow-xl"
                    >
                        <strong className="block text-3xl leading-none font-display">15</strong>
                        <span className="text-xs tracking-widest uppercase font-sans mt-2 block">Anni di Tradizione</span>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4">La Nostra Filosofia</span>
                    <h2 className="font-italian text-5xl md:text-6xl leading-tight mb-6">
                        L'Arte della <em className="italic text-brand-gold not-italic">Cucina</em>
                    </h2>
                    <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-8" />

                    <p className="text-brand-muted mb-5 leading-[1.9] font-light">
                        Da Ember & Ash, crediamo che i sapori più sofisticati nascano dai metodi di cottura più elementari. Abbiamo domato la fiamma aperta per regalarti un'esperienza gastronomica unica.
                    </p>
                    <p className="text-brand-muted mb-8 leading-[1.9] font-light">
                        Ogni piatto che esce dalla nostra cucina è stato preparato nel nostro focolare artigianale. Che sia affumicato a freddo, arrostito sulla brace o baciato dalla brace, il fuoco è l'ingrediente distintivo di tutto ciò che facciamo.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {[
                            { it: 'Legna Sostenibile', en: 'Sustainable Wood' },
                            { it: 'Prodotti Locali', en: 'Local Sourcing' },
                            { it: 'Zero Rifiuti', en: 'Zero Waste' },
                            { it: 'Celle di Stagionatura', en: 'Dry Aging Room' }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-center gap-3 text-sm"
                            >
                                <span className="text-brand-gold text-xs">✦</span> {item.it}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
