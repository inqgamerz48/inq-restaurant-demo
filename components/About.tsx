export default function About() {
    return (
        <section id="about" className="py-24 px-[6%] bg-brand-surface">
            <div className="grid md:grid-cols-2 gap-24 items-center max-w-[1200px] mx-auto">
                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80"
                        alt="Chef working with fire"
                        className="w-full h-[520px] object-cover border border-brand-border"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-bg p-6 text-center font-display shadow-xl">
                        <strong className="block text-3xl leading-none">15</strong>
                        <span className="text-xs tracking-widest uppercase font-sans mt-2 block">Years of Quality</span>
                    </div>
                </div>

                <div>
                    <span className="block text-xs text-brand-gold tracking-[0.25em] uppercase mb-4">Our Philosophy</span>
                    <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
                        Mastering the <em className="italic text-brand-gold not-italic">Primal</em> Element
                    </h2>
                    <div className="w-[60px] h-[2px] bg-gradient-to-r from-brand-gold to-transparent mb-8" />

                    <p className="text-brand-muted mb-5 leading-[1.9] font-light">
                        At Ember & Ash, we believe that the most sophisticated flavors are born from the most elemental cooking method. We have tamed the open flame to bring you a dining experience unlike any other.
                    </p>
                    <p className="text-brand-muted mb-8 leading-[1.9] font-light">
                        Every dish that leaves our kitchen has been introduced to our custom-built hearth. Whether cold-smoked, coal-roasted, or kissed by burning embers, fire is the defining ingredient in everything we do.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-brand-gold text-xs">✦</span> Sustainable Wood
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-brand-gold text-xs">✦</span> Local Sourcing
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-brand-gold text-xs">✦</span> Zero Waste
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-brand-gold text-xs">✦</span> Dry Aging Room
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
