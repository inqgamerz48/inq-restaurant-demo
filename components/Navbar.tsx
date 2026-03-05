import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[6%] py-5 bg-brand-bg/85 backdrop-blur-md border-b border-brand-gold/15">
            <Link href="/" className="font-display text-2xl text-brand-gold tracking-widest">
                Ember & <span className="text-brand-cream">Ash</span>
            </Link>

            <ul className="hidden md:flex gap-10 list-none">
                <li><Link href="#about" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">About</Link></li>
                <li><Link href="#menu" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Menu</Link></li>
                <li><Link href="#experience" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Experience</Link></li>
                <li><Link href="#testimonials" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Reviews</Link></li>
            </ul>

            <Link href="#reservation" className="bg-brand-gold text-brand-bg px-6 py-3 font-semibold text-sm tracking-widest uppercase transition-all hover:bg-brand-gold2 hover:-translate-y-[1px]">
                Reserve
            </Link>
        </nav>
    );
}
