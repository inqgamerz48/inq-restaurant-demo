export default function Experience() {
    return (
        <section id="experience" className="py-24 px-[6%] bg-brand-surface">
            <div className="max-w-[1200px] mx-auto">
                <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4 text-center">The Journey</span>
                <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-center">
                    Not Just a <em className="italic text-brand-gold not-italic">Meal</em>
                </h2>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-12 mx-auto" />

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="p-10 border border-brand-border bg-brand-bg text-center transition-colors hover:border-brand-gold/40">
                        <span className="block text-3xl mb-4">🥂</span>
                        <h3 className="font-display text-xl mb-3">Curated Pairings</h3>
                        <p className="text-brand-muted text-sm leading-[1.7]">
                            Our sommelier works alongside the chefs to select wines that perfectly complement the smoky profiles of our dishes.
                        </p>
                    </div>

                    <div className="p-10 border border-brand-border bg-brand-bg text-center transition-colors hover:border-brand-gold/40">
                        <span className="block text-3xl mb-4">🔥</span>
                        <h3 className="font-display text-xl mb-3">The Hearth</h3>
                        <p className="text-brand-muted text-sm leading-[1.7]">
                            Watch our culinary team work with our custom 12-foot open hearth, the beating heart of our kitchen and restaurant.
                        </p>
                    </div>

                    <div className="p-10 border border-brand-border bg-brand-bg text-center transition-colors hover:border-brand-gold/40">
                        <span className="block text-3xl mb-4">🌿</span>
                        <h3 className="font-display text-xl mb-3">Seasonal Focus</h3>
                        <p className="text-brand-muted text-sm leading-[1.7]">
                            Our menu adapts to what our local farmers harvest daily. Quality ingredients need only the simplest preparation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
