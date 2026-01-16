import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PracticeAreas from '@/components/PracticeAreas';
import Attorneys from '@/components/Attorneys';
import About from '@/components/About';
import Results from '@/components/Results';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <PracticeAreas />
      <About />
      <Attorneys />
      <Results />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
