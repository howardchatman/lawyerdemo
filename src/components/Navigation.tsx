'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Scale } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#practice-areas', label: 'Practice Areas' },
    { href: '#attorneys', label: 'Our Attorneys' },
    { href: '#about', label: 'About' },
    { href: '#results', label: 'Results' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white py-2 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-gray-300">Available 24/7 for Emergencies</span>
            <span className="text-[#c9a961]">|</span>
            <span className="text-gray-300">Free Initial Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#c9a961]" />
            <a href="tel:1-800-CHATMAN" className="hover:text-[#c9a961] transition-colors font-medium">
              1-800-CHATMAN
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg py-3'
            : 'bg-white py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Scale
                  size={40}
                  className="text-[#c9a961] group-hover:text-black transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-black tracking-tight">
                  CHATMAN
                </span>
                <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">
                  LEGAL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-black hover:text-[#c9a961] transition-colors font-medium text-sm tracking-wide uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="bg-[#c9a961] hover:bg-black text-white px-6 py-3 font-semibold text-sm tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
              >
                Schedule Consultation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-black p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-black hover:text-[#c9a961] transition-colors font-medium py-2 border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block bg-[#c9a961] hover:bg-black text-white px-6 py-3 font-semibold text-center text-sm tracking-wide uppercase transition-colors mt-4"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:1-800-CHATMAN"
              className="flex items-center justify-center gap-2 text-black font-semibold py-3"
            >
              <Phone size={18} className="text-[#c9a961]" />
              1-800-CHATMAN
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
