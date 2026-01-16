'use client';

import Link from 'next/link';
import { ArrowRight, Award, Users, Clock, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#c9a961]/10 border border-[#c9a961]/30 px-4 py-2 mb-8 animate-fade-in">
            <Award size={16} className="text-[#c9a961]" />
            <span className="text-[#c9a961] text-sm font-medium tracking-wide uppercase">
              Trusted by Fortune 500 Companies
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
            Elite Legal
            <span className="block gold-text">Representation</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl animate-fade-in-up animation-delay-200">
            For over four decades, Chatman Legal has delivered exceptional outcomes
            for clients facing complex legal challenges. Our unwavering commitment
            to excellence sets us apart.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up animation-delay-400">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-[#c9a961] hover:bg-[#d4b87a] text-black px-8 py-4 font-semibold text-lg tracking-wide transition-all duration-300"
            >
              Free Consultation
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#practice-areas"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-[#c9a961] text-white hover:text-[#c9a961] px-8 py-4 font-semibold text-lg tracking-wide transition-all duration-300"
            >
              Explore Our Practice
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 animate-fade-in-up animation-delay-600">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Award size={20} className="text-[#c9a961]" />
                <span className="text-3xl font-bold text-white">$2.5B+</span>
              </div>
              <p className="text-gray-400 text-sm">Recovered for Clients</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Users size={20} className="text-[#c9a961]" />
                <span className="text-3xl font-bold text-white">500+</span>
              </div>
              <p className="text-gray-400 text-sm">Attorneys Nationwide</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Clock size={20} className="text-[#c9a961]" />
                <span className="text-3xl font-bold text-white">40+</span>
              </div>
              <p className="text-gray-400 text-sm">Years of Excellence</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Shield size={20} className="text-[#c9a961]" />
                <span className="text-3xl font-bold text-white">98%</span>
              </div>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
