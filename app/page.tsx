import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import MenuSection from '@/components/Menu';
import Experience from '@/components/Experience';
import Reservation from '@/components/Reservation';
import Testimonials from '@/components/Testimonials';
import Hours from '@/components/Hours';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Experience />
      <Reservation />
      <Testimonials />
      <Hours />
      <Footer />
    </main>
  );
}
