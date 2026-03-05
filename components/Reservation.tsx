'use client';
import { useState } from 'react';

export default function Reservation() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, guests: Number(data.guests) }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to submit reservation');
            }

            setStatus('success');
            setMessage('Reservation request submitted successfully. We will confirm shortly.');
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'Failed to submit reservation. Please try again.');
        }
    };

    return (
        <section id="reservation" className="relative py-24 px-[6%] text-center">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "linear-gradient(rgba(10, 7, 5, 0.88), rgba(10, 7, 5, 0.88)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&auto=format&fit=crop&q=80')" }}
            />

            <div className="relative z-10 max-w-[700px] mx-auto">
                <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4">Book Your Table</span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
                    Reserve an <em className="italic text-brand-gold not-italic">Experience</em>
                </h2>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-8 mx-auto" />

                <p className="text-brand-muted text-lg mb-12">
                    Secure your spot at the hearth. For parties larger than 6 or special private events, please contact us directly.
                </p>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Name</label>
                        <input name="name" required className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Email</label>
                        <input type="email" name="email" required className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Date</label>
                        <input type="date" name="date" required className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors style-color-scheme-dark" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Time</label>
                        <select name="time" required className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors">
                            <optgroup label="Dinner">
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="20:00">8:00 PM</option>
                                <option value="21:00">9:00 PM</option>
                                <option value="22:00">10:00 PM</option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Number of Guests</label>
                        <input type="number" name="guests" min="1" max="20" required className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs tracking-widest uppercase text-brand-muted">Special Requests (Optional)</label>
                        <textarea name="specialRequests" rows={3} className="bg-brand-surface2 border border-brand-border text-brand-cream p-3 focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                    </div>

                    {status !== 'idle' && (
                        <div className={`md:col-span-2 p-4 border ${status === 'error' ? 'border-brand-red text-brand-red bg-brand-red/10' : 'border-brand-gold text-brand-gold bg-brand-gold/10'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        disabled={status === 'loading'}
                        type="submit"
                        className="md:col-span-2 mt-4 bg-brand-gold text-brand-bg font-bold py-4 tracking-[0.15em] uppercase text-sm transition-all hover:bg-brand-gold2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Submitting...' : 'Confirm Reservation'}
                    </button>
                </form>
            </div>
        </section>
    );
}
