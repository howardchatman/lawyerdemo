'use client';

import { useState, useEffect } from 'react';
import { X, Scale, Phone, Mail, User, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

interface LeadCaptureProps {
  delay?: number; // delay in milliseconds before showing popup
}

export default function LeadCapture({ delay = 5000 }: LeadCaptureProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Check if user has already seen/submitted the popup
    const hasSeenPopup = localStorage.getItem('chatman_lead_captured');
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    // Set a shorter expiry so they see it again next visit
    localStorage.setItem('chatman_lead_captured', 'dismissed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClientComponentClient();
      if (supabase) {
        await supabase.from('lawyer_contact_submissions').insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          practice_area: 'general',
          message: 'Lead captured from popup',
          status: 'new',
        });
      }

      // Mark as captured
      localStorage.setItem('chatman_lead_captured', 'submitted');
      setIsSubmitted(true);

      // Close after showing success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-10"
        >
          <X size={24} />
        </button>

        {isSubmitted ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              One of our attorneys will contact you within 24 hours to discuss your legal needs.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield size={16} className="text-[#c9a961]" />
              <span>Your information is 100% confidential</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-black text-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale size={32} className="text-[#c9a961]" strokeWidth={1.5} />
                <div>
                  <span className="text-xl font-bold tracking-tight">CHATMAN</span>
                  <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium ml-2">LEGAL</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Get Your <span className="text-[#c9a961]">Free Consultation</span>
              </h2>
              <p className="text-gray-300 text-sm">
                Speak with an experienced attorney about your case. No obligation, 100% confidential.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c9a961] hover:bg-black text-black hover:text-white py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Claim My Free Consultation
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span>No Obligation</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield size={14} className="text-green-500" />
                  <span>Confidential</span>
                </div>
              </div>
            </form>

            {/* Trust Elements */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-xl font-bold text-black">40+</p>
                  <p className="text-xs text-gray-500">Years Experience</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-xl font-bold text-black">98%</p>
                  <p className="text-xs text-gray-500">Success Rate</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-xl font-bold text-black">$2.5B+</p>
                  <p className="text-xs text-gray-500">Recovered</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
