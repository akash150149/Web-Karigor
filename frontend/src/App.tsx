import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Projects from './sections/Projects';
import OurProcess from './sections/OurProcess';
import AboutUs from './sections/AboutUs';
import Contact from './sections/Contact';
import BookACall from './sections/BookACall';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <OurProcess />
        <AboutUs />
        <Contact />
        <BookACall />
      </main>
      
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground font-medium">
            © {new Date().getFullYear()} Web-Karigor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
