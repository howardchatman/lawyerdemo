'use client';

import Link from 'next/link';
import { Phone, ArrowRight, Clock, Shield } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Discuss
              <span className="block gold-text">Your Case?</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Don&apos;t face your legal challenges alone. Our experienced attorneys are
              ready to evaluate your situation and develop a winning strategy.
              Schedule your free, confidential consultation today.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c9a961]/10 border border-[#c9a961]/30 flex items-center justify-center">
                  <Clock size={24} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Available 24/7</p>
                  <p className="text-gray-400 text-sm">For urgent matters</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c9a961]/10 border border-[#c9a961]/30 flex items-center justify-center">
                  <Shield size={24} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="text-white font-semibold">100% Confidential</p>
                  <p className="text-gray-400 text-sm">Attorney-client privilege</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-[#c9a961] hover:bg-[#d4b87a] text-black px-8 py-4 font-semibold text-lg tracking-wide transition-all duration-300"
              >
                Schedule Consultation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:1-800-CHATMAN"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#c9a961] text-[#c9a961] hover:bg-[#c9a961] hover:text-black px-8 py-4 font-semibold text-lg tracking-wide transition-all duration-300"
              >
                <Phone size={20} />
                1-800-CHATMAN
              </a>
            </div>
          </div>

          {/* Right Content - Contact Card */}
          <div className="bg-white p-10">
            <h3 className="text-2xl font-bold text-black mb-6">
              Quick Contact
            </h3>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
              />
              <select
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors text-gray-500"
              >
                <option value="">Select Practice Area</option>
                <option value="corporate">Corporate Law</option>
                <option value="litigation">Litigation</option>
                <option value="criminal">Criminal Defense</option>
                <option value="employment">Employment Law</option>
                <option value="ip">Intellectual Property</option>
                <option value="realestate">Real Estate</option>
                <option value="injury">Personal Injury</option>
                <option value="family">Family Law</option>
                <option value="other">Other</option>
              </select>
              <textarea
                placeholder="Brief description of your legal matter"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full bg-black hover:bg-[#c9a961] text-white hover:text-black py-4 font-semibold tracking-wide transition-all duration-300"
              >
                Request Free Consultation
              </button>
            </form>
            <p className="text-gray-400 text-xs mt-4 text-center">
              By submitting, you agree to our privacy policy. We will never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
