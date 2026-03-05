'use client';
import { useState, useEffect } from 'react';

type HourItem = {
    id: number;
    dayRange: string;
    time: string;
    note: string | null;
};

export default function Hours() {
    const [hoursData, setHoursData] = useState<HourItem[]>([]);

    useEffect(() => {
        fetch('/api/hours')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setHoursData(data);
            })
            .catch(console.error);
    }, []);

    if (hoursData.length === 0) return null;

    return (
        <section className="py-24 px-[6%] bg-brand-surface text-center">
            <div className="max-w-[900px] mx-auto">
                <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4">Visit Us</span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
                    Operating <em className="italic text-brand-gold not-italic">Hours</em>
                </h2>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-12 mx-auto" />

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    {hoursData.map((hr) => (
                        <div key={hr.id} className="p-8 border border-brand-border bg-brand-bg">
                            <div className="font-semibold mb-2 text-sm tracking-widest uppercase">{hr.dayRange}</div>
                            <div className="font-display text-xl text-brand-gold">{hr.time}</div>
                            {hr.note && <div className="text-brand-muted text-xs mt-2">{hr.note}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
