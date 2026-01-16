'use client';

import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Chatman Legal's team demonstrated exceptional skill and dedication in handling our complex merger. Their strategic insight was invaluable.",
    author: 'Robert Mitchell',
    title: 'CEO, Tech Industries Inc.',
    rating: 5,
  },
  {
    quote: 'When we faced a critical lawsuit, Chatman Legal delivered a victory that exceeded our expectations. Their litigation team is truly world-class.',
    author: 'Jennifer Adams',
    title: 'General Counsel, Global Manufacturing Co.',
    rating: 5,
  },
  {
    quote: 'The personal attention and legal expertise I received during my case was remarkable. They treated me like family while fighting like warriors.',
    author: 'Michael Thompson',
    title: 'Private Client',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Client Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our clients&apos; success is our greatest reward. Here&apos;s what they have to say
            about working with Chatman Legal.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 border border-gray-100 hover:border-[#c9a961] transition-all duration-300 hover:shadow-xl"
            >
              {/* Quote Icon */}
              <Quote size={40} className="text-[#c9a961] mb-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#c9a961] text-[#c9a961]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-6 border-t border-gray-100">
                <p className="font-bold text-black">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
