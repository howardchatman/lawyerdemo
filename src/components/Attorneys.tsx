'use client';

import { Linkedin, Mail } from 'lucide-react';

const attorneys = [
  {
    name: 'Victoria Chatman',
    title: 'Founding Partner',
    specialty: 'Corporate Law & M&A',
    education: 'Harvard Law School',
    image: 'VC',
    bio: 'With over 30 years of experience, Victoria has led some of the largest corporate transactions in the nation.',
  },
  {
    name: 'Marcus Chen',
    title: 'Senior Partner',
    specialty: 'Complex Litigation',
    education: 'Yale Law School',
    image: 'MC',
    bio: 'Marcus has secured over $500 million in verdicts and settlements for clients in high-stakes litigation.',
  },
  {
    name: 'Sarah Williams',
    title: 'Partner',
    specialty: 'Criminal Defense',
    education: 'Stanford Law School',
    image: 'SW',
    bio: 'A former federal prosecutor, Sarah brings unparalleled insight to criminal defense matters.',
  },
  {
    name: 'David Rodriguez',
    title: 'Partner',
    specialty: 'Intellectual Property',
    education: 'Columbia Law School',
    image: 'DR',
    bio: 'David has protected IP portfolios for Fortune 100 companies and emerging tech startups alike.',
  },
];

export default function Attorneys() {
  return (
    <section id="attorneys" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Leadership
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Our Attorneys
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the legal minds behind Chatman Legal. Our partners bring decades of
            combined experience and an unwavering commitment to client success.
          </p>
        </div>

        {/* Attorneys Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {attorneys.map((attorney) => (
            <div
              key={attorney.name}
              className="group bg-white border border-gray-100 hover:border-[#c9a961] transition-all duration-300 hover:shadow-xl overflow-hidden"
            >
              {/* Photo Placeholder */}
              <div className="relative h-72 bg-gradient-to-br from-black to-gray-800 flex items-center justify-center overflow-hidden">
                <span className="text-6xl font-bold text-[#c9a961]/30 group-hover:text-[#c9a961]/50 transition-colors">
                  {attorney.image}
                </span>
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#c9a961] flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Linkedin size={20} className="text-black" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#c9a961] flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Mail size={20} className="text-black" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-1">
                  {attorney.name}
                </h3>
                <p className="text-[#c9a961] font-medium text-sm mb-2">
                  {attorney.title}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {attorney.specialty}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {attorney.bio}
                </p>
                <p className="text-gray-400 text-xs italic">
                  {attorney.education}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-black hover:bg-[#c9a961] text-white px-8 py-4 font-semibold tracking-wide transition-colors duration-300"
          >
            View All Attorneys
          </a>
        </div>
      </div>
    </section>
  );
}
