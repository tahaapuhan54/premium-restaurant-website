import Grain from '@/components/Grain';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Signature from '@/components/Signature';
import Menu from '@/components/Menu';
import Gallery from '@/components/Gallery';
import Chef from '@/components/Chef';
import Testimonials from '@/components/Testimonials';
import Reservation from '@/components/Reservation';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Grain />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Signature />
        <Menu />
        <Gallery />
        <Chef />
        <Testimonials />
        <Reservation />
        <Location />
      </main>
      <Footer />
    </>
  );
}
