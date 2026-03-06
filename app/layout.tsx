import type { Metadata } from 'next';
import { Inter, Playfair_Display, Italianno } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display'
});
const italianno = Italianno({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italian'
});

export const metadata: Metadata = {
  title: 'Ember & Ash — Fine Italian Dining',
  description: 'Experience authentic Italian cuisine where fire transforms simple ingredients into poetry.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${italianno.variable}`}>
      <body className="antialiased font-sans bg-brand-bg text-brand-cream selection:bg-brand-gold selection:text-brand-bg">
        {children}
      </body>
    </html>
  );
}
