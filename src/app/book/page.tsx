'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Shield,
  Award,
  Users,
  ArrowRight,
  Star,
  Bot,
  PhoneCall,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import AIVAChat from '@/components/AIVAChat';

const RETELL_PHONE = '713-999-2094';

const practiceAreas = [
  'Corporate Law',
  'Litigation',
  'Criminal Defense',
  'Employment Law',
  'Intellectual Property',
  'Real Estate',
  'Personal Injury',
  'Family Law',
  'Other',
];

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceArea: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClientComponentClient();
      if (supabase) {
        await supabase.from('lawyer_contact_submissions').insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          practice_area: formData.practiceArea,
          message: `Preferred Date: ${formData.preferredDate}\nPreferred Time: ${formData.preferredTime}\n\n${formData.message}`,
          status: 'new',
        });
      }
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/" className="flex items-center gap-3">
              <Scale size={32} className="text-[#c9a961]" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">CHATMAN</span>
                <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">LEGAL</span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="max-w-md w-full bg-white p-8 border border-gray-200 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-4">Consultation Booked!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for scheduling a consultation with Chatman Legal. One of our attorneys
              will contact you within 24 hours to confirm your appointment.
            </p>
            <div className="bg-gray-50 p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Preferred Date & Time:</p>
              <p className="font-semibold text-black">
                {formData.preferredDate} at {formData.preferredTime}
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-black hover:bg-[#c9a961] text-white hover:text-black py-3 font-semibold transition-colors"
              >
                Return to Homepage
              </Link>
              <a
                href={`tel:${RETELL_PHONE}`}
                className="block w-full border border-gray-200 hover:border-[#c9a961] py-3 font-semibold text-gray-700 hover:text-[#c9a961] transition-colors"
              >
                Call AIVA: {RETELL_PHONE}
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Scale size={32} className="text-[#c9a961]" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">CHATMAN</span>
              <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">LEGAL</span>
            </div>
          </Link>
          <a
            href={`tel:${RETELL_PHONE}`}
            className="hidden md:flex items-center gap-2 text-white hover:text-[#c9a961] transition-colors"
          >
            <PhoneCall size={18} />
            <span className="font-medium">{RETELL_PHONE}</span>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div>
            <h1 className="text-4xl font-bold text-black mb-4">
              Schedule Your <span className="text-[#c9a961]">Free Consultation</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Take the first step towards resolving your legal matter. Our experienced
              attorneys are ready to listen and provide expert guidance.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#c9a961]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="font-semibold text-black">100% Free Consultation</p>
                  <p className="text-sm text-gray-600">No cost, no obligation to evaluate your case</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#c9a961]/10 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="font-semibold text-black">Completely Confidential</p>
                  <p className="text-sm text-gray-600">Protected by attorney-client privilege</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#c9a961]/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="font-semibold text-black">Response Within 24 Hours</p>
                  <p className="text-sm text-gray-600">We&apos;ll contact you to confirm your appointment</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black p-6 text-white">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#c9a961]">40+</p>
                  <p className="text-xs text-gray-400">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a961]">98%</p>
                  <p className="text-xs text-gray-400">Success Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a961]">$2.5B+</p>
                  <p className="text-xs text-gray-400">Recovered</p>
                </div>
              </div>
            </div>

            {/* Talk to AIVA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#c9a961] to-[#d4b76a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-[#c9a961]" />
                </div>
                <div>
                  <p className="font-bold text-black">Prefer to Talk?</p>
                  <p className="text-sm text-black/70">Speak with our AI assistant</p>
                </div>
              </div>
              <a
                href={`tel:${RETELL_PHONE}`}
                className="flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-white hover:text-black transition-colors"
              >
                <PhoneCall size={20} />
                Call {RETELL_PHONE}
              </a>
              <p className="text-xs text-black/60 text-center mt-2">Available 24/7</p>
            </div>

            {/* Testimonial */}
            <div className="mt-6 p-6 bg-white border border-gray-200">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#c9a961] text-[#c9a961]" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                &quot;Chatman Legal exceeded all my expectations. They handled my case with
                professionalism and achieved an outcome I never thought possible.&quot;
              </p>
              <p className="font-semibold text-black">— Michael T., Personal Injury Client</p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black mb-2">Book Your Consultation</h2>
              <p className="text-gray-600 text-sm">Fill out the form below and we&apos;ll be in touch.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area *</label>
                <select
                  name="practiceArea"
                  value={formData.practiceArea}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                >
                  <option value="">Select a practice area</option>
                  {practiceAreas.map((area) => (
                    <option key={area} value={area.toLowerCase()}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Description (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none resize-none"
                  placeholder="Tell us briefly about your legal matter..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c9a961] hover:bg-black text-black hover:text-white py-4 font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Book Free Consultation
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our privacy policy. All consultations are confidential.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Chatman Legal. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AIVA Chat Widget */}
      <AIVAChat />
    </div>
  );
}
