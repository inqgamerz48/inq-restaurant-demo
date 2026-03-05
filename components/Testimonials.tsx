'use client';
import { useState, useEffect } from 'react';

type Testimonial = {
    id: number;
    name: string;
    role: string | null;
    rating: number;
    text: string;
    initials: string;
};

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTestimonials(data.filter((t: any) => t.active));
                }
            })
            .catch(console.error);
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="py-24 px-[6%]">
            <div className="max-w-[1200px] mx-auto">
                <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4 text-center">Reviews</span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-center">
                    What They <em className="italic text-brand-gold not-italic">Say</em>
                </h2>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-12 mx-auto" />

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {testimonials.map(t => (
                        <div key={t.id} className="relative bg-brand-surface border border-brand-border p-8 pb-10">
                            <div className="absolute top-[-20px] left-6 font-display text-[5rem] text-brand-gold/20 leading-none">
                                "
                            </div>
                            <div className="flex gap-1 text-brand-gold text-lg mb-4 mt-2">
                                {'★'.repeat(t.rating || 5)}
                            </div>
                            <p className="text-brand-muted italic leading-[1.8] mb-8 text-sm">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-brand-gold flex items-center justify-center font-bold text-brand-bg">
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">{t.name}</div>
                                    {t.role && <div className="text-brand-muted text-xs">{t.role}</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
