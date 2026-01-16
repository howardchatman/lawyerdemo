'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AIVAChat from '@/components/AIVAChat';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Bot, PhoneCall } from 'lucide-react';
import { submitContactForm } from '@/lib/supabase';

const RETELL_PHONE = '713-999-2094';

const offices = [
  {
    city: 'New York',
    address: '350 Fifth Avenue, 65th Floor',
    phone: '(212) 555-0100',
    email: 'newyork@chatmanlegal.com',
  },
  {
    city: 'Los Angeles',
    address: '2029 Century Park East, Suite 400',
    phone: '(310) 555-0200',
    email: 'losangeles@chatmanlegal.com',
  },
  {
    city: 'Chicago',
    address: '233 S. Wacker Drive, Suite 6400',
    phone: '(312) 555-0300',
    email: 'chicago@chatmanlegal.com',
  },
  {
    city: 'Washington D.C.',
    address: '1100 15th Street NW, Suite 400',
    phone: '(202) 555-0400',
    email: 'dc@chatmanlegal.com',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    practice_area: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        practice_area: '',
        message: '',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage('There was an error submitting your request. Please try again or call us directly.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact <span className="gold-text">Chatman Legal</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ready to discuss your legal needs? Our team is standing by to provide
            the expert guidance you deserve. Reach out today for a confidential consultation.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                Request a Consultation
              </h2>
              <p className="text-gray-600 mb-8">
                Complete the form below and one of our attorneys will contact you
                within 24 hours to discuss your case.
              </p>

              {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 p-8 text-center">
                  <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Thank You for Contacting Us
                  </h3>
                  <p className="text-green-700">
                    Your message has been received. A member of our team will contact
                    you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 p-4 flex items-center gap-3">
                      <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Practice Area *
                    </label>
                    <select
                      name="practice_area"
                      value={formData.practice_area}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors"
                    >
                      <option value="">Select a practice area</option>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Legal Matter *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none transition-colors resize-none"
                      placeholder="Please provide a brief description of your legal matter. All information is kept strictly confidential."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-black hover:bg-[#c9a961] text-white hover:text-black py-4 font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Request
                      </>
                    )}
                  </button>

                  <p className="text-gray-400 text-xs text-center">
                    By submitting this form, you agree to our privacy policy. All information
                    is protected by attorney-client privilege.
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              {/* AI Voice Assistant Banner */}
              <div className="bg-gradient-to-r from-[#c9a961] to-[#d4b76a] p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                    <Bot size={28} className="text-[#c9a961]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black">Talk to AIVA</h3>
                    <p className="text-black/70 text-sm">Our AI Voice Assistant</p>
                  </div>
                </div>
                <p className="text-black/80 text-sm mb-4">
                  Speak directly with our AI assistant for immediate help with scheduling,
                  case inquiries, and connecting with an attorney.
                </p>
                <a
                  href={`tel:${RETELL_PHONE}`}
                  className="flex items-center justify-center gap-3 bg-black text-white py-4 px-6 font-bold text-lg hover:bg-white hover:text-black transition-colors w-full"
                >
                  <PhoneCall size={24} />
                  <span>{RETELL_PHONE}</span>
                </a>
                <p className="text-black/60 text-xs text-center mt-2">
                  Available 24/7 • Powered by Retell AI
                </p>
              </div>

              {/* Quick Contact */}
              <div className="bg-black p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Immediate Assistance
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c9a961]/10 border border-[#c9a961]/30 flex items-center justify-center flex-shrink-0">
                      <Phone size={24} className="text-[#c9a961]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">AI Voice Line</p>
                      <a href={`tel:${RETELL_PHONE}`} className="text-2xl font-bold text-white hover:text-[#c9a961] transition-colors">
                        {RETELL_PHONE}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c9a961]/10 border border-[#c9a961]/30 flex items-center justify-center flex-shrink-0">
                      <Mail size={24} className="text-[#c9a961]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email Us</p>
                      <a href="mailto:info@chatmanlegal.com" className="text-lg font-semibold text-white hover:text-[#c9a961] transition-colors">
                        info@chatmanlegal.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c9a961]/10 border border-[#c9a961]/30 flex items-center justify-center flex-shrink-0">
                      <Clock size={24} className="text-[#c9a961]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Office Hours</p>
                      <p className="text-white font-semibold">Mon - Fri: 8:00 AM - 7:00 PM</p>
                      <p className="text-gray-400 text-sm">Emergency line available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div>
                <h3 className="text-2xl font-bold text-black mb-6">
                  Our Offices
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {offices.map((office) => (
                    <div
                      key={office.city}
                      className="border border-gray-200 hover:border-[#c9a961] p-6 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin size={18} className="text-[#c9a961] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-black">{office.city}</h4>
                          <p className="text-gray-500 text-sm">{office.address}</p>
                        </div>
                      </div>
                      <div className="space-y-1 pl-7">
                        <a href={`tel:${office.phone}`} className="text-sm text-gray-600 hover:text-[#c9a961] block transition-colors">
                          {office.phone}
                        </a>
                        <a href={`mailto:${office.email}`} className="text-sm text-gray-600 hover:text-[#c9a961] block transition-colors">
                          {office.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <MapPin size={48} className="text-[#c9a961] mx-auto mb-4" />
            <p className="text-white text-xl font-semibold">Interactive Map</p>
            <p className="text-gray-400">25 Office Locations Nationwide</p>
          </div>
        </div>
      </section>

      <Footer />

      {/* AIVA Chat Widget */}
      <AIVAChat />
    </main>
  );
}
