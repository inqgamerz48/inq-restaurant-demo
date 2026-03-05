import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-brand-border pt-16 pb-8 px-[6%] text-brand-muted bg-brand-bg">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-12 mb-12">
                <div className="md:col-span-2">
                    <Link href="/" className="font-display text-3xl text-brand-gold tracking-widest mb-4 inline-block">
                        Ember & <span className="text-brand-cream">Ash</span>
                    </Link>
                    <p className="text-sm leading-[1.8] max-w-[280px]">
                        A culinary experience where primal techniques meet modern refinement.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs tracking-[0.15em] uppercase text-brand-gold mb-5">Explore</h4>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li><Link href="#about" className="hover:text-brand-cream transition-colors">About</Link></li>
                        <li><Link href="#menu" className="hover:text-brand-cream transition-colors">Menu</Link></li>
                        <li><Link href="#reservation" className="hover:text-brand-cream transition-colors">Reservations</Link></li>
                        <li><Link href="/admin" className="hover:text-brand-cream transition-colors">Admin Panel</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs tracking-[0.15em] uppercase text-brand-gold mb-5">Contact</h4>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li>123 Ember Lane</li>
                        <li>Portland, OR 97204</li>
                        <li>reservations@emberandash.com</li>
                        <li>(503) 555-FIRE</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <div>&copy; {new Date().getFullYear()} Ember & Ash. All rights reserved.</div>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-brand-cream transition-colors">Instagram</a>
                    <a href="#" className="hover:text-brand-cream transition-colors">Facebook</a>
                    <a href="#" className="hover:text-brand-cream transition-colors">Twitter</a>
                </div>
            </div>
        </footer>
    );
}
