'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[6%] py-5 bg-brand-bg/85 backdrop-blur-md border-b border-brand-gold/15"
        >
            <Link href="/" className="font-italian text-4xl text-brand-gold tracking-wide">
                Ember & <span className="text-brand-cream">Ash</span>
            </Link>

            <ul className="hidden md:flex gap-10 list-none">
                <li><Link href="#about" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Chi Siamo</Link></li>
                <li><Link href="#menu" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Menu</Link></li>
                <li><Link href="#experience" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Esperienza</Link></li>
                <li><Link href="#testimonials" className="text-brand-muted text-sm font-medium tracking-widest uppercase transition-colors hover:text-brand-gold">Recensioni</Link></li>
            </ul>

            <Link href="#reservation" className="bg-brand-gold text-brand-bg px-6 py-3 font-semibold text-sm tracking-widest uppercase transition-all hover:bg-brand-gold2 hover:-translate-y-[1px] hover:shadow-[0_5px_20px_rgba(201,168,76,0.3)]">
                Prenota
            </Link>
        </motion.nav>
    );
}
