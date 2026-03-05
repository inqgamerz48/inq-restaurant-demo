'use client';
import { useState, useEffect } from 'react';

type MenuItem = {
    id: number;
    category: string;
    name: string;
    price: string;
    description: string;
    tag: string | null;
    imageUrl: string | null;
};

export default function MenuSection() {
    const [activeTab, setActiveTab] = useState('Starters');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

    useEffect(() => {
        fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMenuItems(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const displayedItems = menuItems.filter(item => item.category === activeTab);

    return (
        <section id="menu" className="py-24 px-[6%] text-center">
            <div className="max-w-[1200px] mx-auto">
                <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4">Provisions</span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
                    The <em className="italic text-brand-gold not-italic">Menu</em>
                </h2>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-12 mx-auto" />

                <div className="flex border-b border-brand-border mb-12 overflow-x-auto no-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`px-8 py-4 uppercase text-sm tracking-widest font-medium transition-all whitespace-nowrap -mb-[1px] border-b-2
                ${activeTab === cat ? 'text-brand-gold border-brand-gold' : 'text-brand-muted border-transparent hover:text-brand-cream'}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-brand-muted">Preparing menu...</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {displayedItems.map((item) => (
                            <div key={item.id} className="bg-brand-surface border border-brand-border overflow-hidden transition-all hover:-translate-y-1 hover:border-brand-gold/40">
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-[220px] object-cover" />
                                )}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-display text-xl">{item.name}</h3>
                                        <span className="text-brand-gold font-bold">{item.price}</span>
                                    </div>
                                    <p className="text-brand-muted text-sm leading-[1.6] mb-3">{item.description}</p>
                                    {item.tag && (
                                        <span className="inline-block text-[0.65rem] tracking-wider uppercase text-brand-gold border border-brand-gold/30 px-2 py-1">
                                            {item.tag}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
