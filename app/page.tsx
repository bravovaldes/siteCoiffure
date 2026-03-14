'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.snap-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Update active section
      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        if (
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(index);
        }
      });

      // Update navbar background on scroll
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.snap-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-black">
      {/* Side Navigation Dots - Hidden on mobile */}
      <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 animate-fade-in-up">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`rounded-full transition-all duration-500 hover:scale-150 ${
              activeSection === index ? 'bg-black w-8 h-2' : 'bg-black/20 w-2 h-2 hover:bg-black/40'
            }`}
            aria-label={`Section ${index + 1}`}
          />
        ))}
      </nav>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        navbarScrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold tracking-wider animate-fade-in-up transition-colors duration-500 ${
            navbarScrolled ? 'text-black' : 'text-white'
          }`}>
            Chez Issouf
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection(0)}
              className={`text-sm font-medium transition-all duration-300 hover:scale-110 relative group ${
                navbarScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Accueil
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                navbarScrolled ? 'bg-black' : 'bg-white'
              }`}></span>
            </button>
            <button
              onClick={() => scrollToSection(2)}
              className={`text-sm font-medium transition-all duration-300 hover:scale-110 relative group ${
                navbarScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Services
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                navbarScrolled ? 'bg-black' : 'bg-white'
              }`}></span>
            </button>
            <button
              onClick={() => scrollToSection(3)}
              className={`text-sm font-medium transition-all duration-300 hover:scale-110 relative group ${
                navbarScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Portfolio
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                navbarScrolled ? 'bg-black' : 'bg-white'
              }`}></span>
            </button>
            <button
              onClick={() => scrollToSection(4)}
              className={`text-sm font-medium transition-all duration-300 hover:scale-110 relative group ${
                navbarScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Contact
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                navbarScrolled ? 'bg-black' : 'bg-white'
              }`}></span>
            </button>
          </div>

          {/* CTA Button - Desktop */}
          <Link href="/booking" className="hidden md:block animate-fade-in-up">
            <div className="px-10 py-4 bg-black text-white text-base font-bold tracking-wider hover:bg-gray-900 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse-glow btn-shimmer">
              RÉSERVER MAINTENANT
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-all duration-300 hover:scale-110 ${
              navbarScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white'
            }`}
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-3 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Menu Items */}
            <div className="space-y-8 text-center">
              <button
                onClick={() => {
                  scrollToSection(0);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-3xl font-light text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 tracking-wider"
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  scrollToSection(2);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-3xl font-light text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 tracking-wider"
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection(3);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-3xl font-light text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 tracking-wider"
              >
                Portfolio
              </button>
              <button
                onClick={() => {
                  scrollToSection(4);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-3xl font-light text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 tracking-wider"
              >
                Contact
              </button>

              {/* CTA Button */}
              <div className="pt-8">
                <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                  <div className="inline-block px-12 py-5 bg-white text-black text-base font-bold tracking-[0.2em] hover:bg-gray-200 transition-all transform hover:scale-110 shadow-2xl">
                    RÉSERVER
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-8 text-center text-white/60 text-sm">
              <p>55 rue Saint-Luc, Chicoutimi</p>
              <p className="mt-2">(418) 123-4567</p>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero Full Screen */}
      <section className="snap-section h-[50vh] md:h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 top-0 bg-cover bg-center md:bg-center transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074)',
            backgroundPosition: 'center 30%',
            transform: `scale(${1.05 + activeSection * 0.02})`
          }}
        >
          <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 md:px-8">
          <div className="animate-fade-in-up">
            <div className="text-xs md:text-sm tracking-[0.3em] mb-4 md:mb-6 opacity-80">CHICOUTIMI</div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-light mb-6 md:mb-8 leading-[0.9]">
              L'ART DE LA
              <br />
              <span className="font-bold italic">COIFFURE</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light mb-8 md:mb-12 max-w-2xl mx-auto">
              Excellence • Précision • Style
            </p>
            <Link href="/booking">
              <div className="inline-block px-8 py-4 md:px-16 md:py-6 bg-black text-white text-base md:text-lg tracking-wider font-bold hover:bg-gray-900 transition-all hover:scale-110 transform duration-300 shadow-2xl animate-bounce">
                PRENDRE RENDEZ-VOUS
              </div>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs tracking-wider">DÉFILER</span>
          <div className="w-px h-8 md:h-12 bg-white/40" />
        </div>
      </section>

      {/* Section 2: Services - Style e-commerce (AMK inspired) */}
      <section id="services" className="snap-section bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="text-xs tracking-[0.35em] text-black/40 mb-3 uppercase">Nos services</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light">Prestations</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="h-px w-10 bg-black/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-black/30" />
              <span className="h-px w-10 bg-black/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                name: 'Coupe Homme',
                price: '$35.00',
                image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800'
              },
              {
                name: 'Coupe Enfant',
                price: '$30.00',
                image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800'
              },
              {
                name: 'Coupe & Barbe',
                price: '$45.00',
                image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800'
              },
              {
                name: 'Soin Barbe',
                price: '$15.00',
                image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800'
              },
              {
                name: 'Coloration',
                price: '$45.00',
                image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800'
              },
              {
                name: 'Coupe & Rasage',
                price: '$40.00',
                image: 'https://images.unsplash.com/photo-1622296089863-eb7fc7f95235?q=80&w=800'
              },
            ].map((service, i) => (
              <Link href="/booking" key={i}>
                <div className="group bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    {/* Hover overlay with booking icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Info - centered */}
                  <div className="py-4 px-3 text-center">
                    <h3 className="text-sm md:text-base font-medium mb-1">{service.name}</h3>
                    <p className="text-sm text-black/60">{service.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: About with Large Images */}
      <section className="snap-section min-h-screen flex items-center bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-3 md:space-y-4">
                <div
                  className="h-48 md:h-64 bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800)' }}
                />
                <div
                  className="h-56 md:h-80 bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800)' }}
                />
              </div>
              <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
                <div
                  className="h-56 md:h-80 bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800)' }}
                />
                <div
                  className="h-48 md:h-64 bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800)' }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="text-xs md:text-sm tracking-[0.3em] text-white/60 mb-3 md:mb-4">15 ANS D'EXPÉRIENCE</div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 md:mb-6">
                  L'excellence dans
                  <br />
                  <span className="italic font-medium">chaque détail</span>
                </h2>
                <p className="text-base md:text-lg text-white/80 leading-relaxed">
                  Depuis plus de 15 ans, nous cultivons l'art de la coiffure masculine avec passion et précision.
                  Chaque coupe est une œuvre unique, adaptée à votre personnalité et votre style de vie.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light mb-1 md:mb-2">5000+</div>
                  <div className="text-xs md:text-sm text-white/60">Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light mb-1 md:mb-2">5.0</div>
                  <div className="text-xs md:text-sm text-white/60">Note</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-light mb-1 md:mb-2">15+</div>
                  <div className="text-xs md:text-sm text-white/60">Années</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Gallery/Portfolio */}
      <section className="snap-section min-h-screen bg-zinc-900 text-white flex items-center py-12 md:py-20">
        <div className="w-full">
          <div className="text-center mb-12 md:mb-16 px-4">
            <div className="text-xs md:text-sm tracking-[0.3em] text-white/60 mb-3 md:mb-4">NOTRE TRAVAIL</div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light">Portfolio</h2>
          </div>

          {/* Horizontal Scrolling Gallery */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 md:gap-6 px-4 md:px-8 pb-6 md:pb-8">
              {[
                'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600',
                'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600',
                'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600',
                'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600',
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600',
                'https://images.unsplash.com/photo-1622296089863-eb7fc7f95235?q=80&w=600',
              ].map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 h-80 md:w-80 md:h-96 bg-cover bg-center transform hover:scale-105 transition-all duration-500 cursor-pointer"
                  style={{
                    backgroundImage: `url(${img})`,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Contact & CTA */}
      <section id="contact" className="snap-section min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-light leading-tight mb-6 md:mb-8">
              Prêt pour une
              <br />
              <span className="italic font-medium">transformation ?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-8 md:mb-12">
              Réservez votre rendez-vous dès maintenant
            </p>
            <Link href="/booking">
              <div className="inline-block px-10 py-5 md:px-20 md:py-7 bg-black text-white text-base md:text-lg tracking-[0.2em] font-bold hover:bg-gray-900 transform hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse-glow btn-shimmer">
                RÉSERVER MAINTENANT
              </div>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-16 md:mt-24 text-center">
            <div>
              <div className="text-xs md:text-sm tracking-[0.2em] text-white/40 mb-3 md:mb-4">ADRESSE</div>
              <div className="text-base md:text-lg">
                55 rue Saint-Luc
                <br />
                Chicoutimi, QC
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm tracking-[0.2em] text-white/40 mb-3 md:mb-4">HORAIRES</div>
              <div className="text-base md:text-lg">
                Lundi - Samedi
                <br />
                9h00 - 18h00
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm tracking-[0.2em] text-white/40 mb-3 md:mb-4">CONTACT</div>
              <div className="text-base md:text-lg">
                (418) 123-4567
                <br />
                contact@issoufcoiffure.com
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-white/10 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-wider">
              Chez Issouf
            </div>
            <div className="text-xs md:text-sm text-white/40">© 2026 • Tous droits réservés</div>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/4181234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all hover:scale-110 z-50 shadow-2xl"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
