'use client';

import { CheckCircle2 } from 'lucide-react';

const values = [
  'Uncompromising integrity in every engagement',
  'Client-first approach to legal strategy',
  'Proven track record of landmark victories',
  'Collaborative culture fostering innovation',
  'Commitment to diversity and inclusion',
  'Pro bono dedication to community service',
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
              About Our Firm
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              A Legacy of
              <span className="block gold-text">Legal Excellence</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Founded in 1984, Chatman Legal has grown from a boutique practice into
              one of the nation&apos;s most respected full-service law firms. Our journey
              has been defined by a relentless pursuit of justice and an unwavering
              commitment to our clients&apos; success.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Today, with offices in major cities across the United States, we continue
              to set the standard for legal excellence. Our attorneys have argued before
              the Supreme Court, negotiated billion-dollar transactions, and defended
              clients in the most complex matters imaginable.
            </p>

            {/* Values List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#c9a961] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Stats & Image */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute -inset-4 border border-[#c9a961]/20" />
            <div className="absolute -inset-8 border border-[#c9a961]/10" />

            <div className="relative bg-gradient-to-br from-gray-900 to-black p-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 border border-[#c9a961]/30">
                  <span className="block text-5xl font-bold gold-text mb-2">40+</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wide">Years in Practice</span>
                </div>
                <div className="text-center p-6 border border-[#c9a961]/30">
                  <span className="block text-5xl font-bold gold-text mb-2">25</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wide">Office Locations</span>
                </div>
                <div className="text-center p-6 border border-[#c9a961]/30">
                  <span className="block text-5xl font-bold gold-text mb-2">500+</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wide">Legal Professionals</span>
                </div>
                <div className="text-center p-6 border border-[#c9a961]/30">
                  <span className="block text-5xl font-bold gold-text mb-2">50K+</span>
                  <span className="text-gray-400 text-sm uppercase tracking-wide">Cases Won</span>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-12 pt-8 border-t border-[#c9a961]/20">
                <blockquote className="text-xl italic text-gray-300 mb-4">
                  &ldquo;Excellence is not a destination but a continuous journey. At Chatman Legal,
                  we never stop striving to be better for our clients.&rdquo;
                </blockquote>
                <cite className="text-[#c9a961] font-semibold not-italic">
                  — Victoria Chatman, Founding Partner
                </cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
