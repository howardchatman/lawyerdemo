'use client';

import Link from 'next/link';
import { Scale, MapPin, Phone, Mail, Linkedin, Twitter, Facebook } from 'lucide-react';

const practiceAreas = [
  'Corporate Law',
  'Litigation',
  'Criminal Defense',
  'Employment Law',
  'Intellectual Property',
  'Real Estate',
  'Personal Injury',
  'Family Law',
];

const offices = [
  { city: 'New York', address: '350 Fifth Avenue, 65th Floor' },
  { city: 'Los Angeles', address: '2029 Century Park East, Suite 400' },
  { city: 'Chicago', address: '233 S. Wacker Drive, Suite 6400' },
  { city: 'Washington D.C.', address: '1100 15th Street NW, Suite 400' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Scale size={36} className="text-[#c9a961]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">
                  CHATMAN
                </span>
                <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">
                  LEGAL
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A premier full-service law firm committed to achieving exceptional
              outcomes for our clients through innovative legal strategies and
              unwavering dedication.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-[#c9a961]/30 hover:border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all group"
              >
                <Linkedin size={18} className="text-gray-400 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-[#c9a961]/30 hover:border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all group"
              >
                <Twitter size={18} className="text-gray-400 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-[#c9a961]/30 hover:border-[#c9a961] hover:bg-[#c9a961] flex items-center justify-center transition-all group"
              >
                <Facebook size={18} className="text-gray-400 group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Practice Areas</h4>
            <ul className="space-y-3">
              {practiceAreas.map((area) => (
                <li key={area}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#c9a961] text-sm transition-colors"
                  >
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Our Offices</h4>
            <ul className="space-y-4">
              {offices.map((office) => (
                <li key={office.city} className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#c9a961] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-medium text-sm">{office.city}</p>
                    <p className="text-gray-400 text-xs">{office.address}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#c9a961]" />
                <a href="tel:1-800-CHATMAN" className="text-gray-400 hover:text-[#c9a961] text-sm transition-colors">
                  1-800-CHATMAN
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#c9a961]" />
                <a href="mailto:info@chatmanlegal.com" className="text-gray-400 hover:text-[#c9a961] text-sm transition-colors">
                  info@chatmanlegal.com
                </a>
              </li>
            </ul>

            <div className="mt-8 p-6 border border-[#c9a961]/20">
              <p className="text-[#c9a961] font-semibold mb-2">24/7 Emergency Line</p>
              <a href="tel:1-800-CHATMAN" className="text-2xl font-bold text-white hover:text-[#c9a961] transition-colors">
                1-800-CHATMAN
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Chatman Legal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-[#c9a961] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-[#c9a961] text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-[#c9a961] text-sm transition-colors">
                Attorney Advertising
              </a>
              <a href="#" className="text-gray-500 hover:text-[#c9a961] text-sm transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-4 text-center">
            Attorney Advertising. Prior results do not guarantee a similar outcome. This website is designed
            for general information only. The information presented at this site should not be construed as
            formal legal advice nor the formation of a lawyer/client relationship.
          </p>
        </div>
      </div>
    </footer>
  );
}
