'use client';

import { Scale, Building2, Users, FileText, Shield, Landmark, Briefcase, Gavel } from 'lucide-react';

const practiceAreas = [
  {
    icon: Building2,
    title: 'Corporate Law',
    description: 'Comprehensive legal counsel for mergers, acquisitions, securities, and corporate governance matters.',
  },
  {
    icon: Gavel,
    title: 'Litigation',
    description: 'Aggressive representation in complex commercial disputes, class actions, and appellate matters.',
  },
  {
    icon: Shield,
    title: 'Criminal Defense',
    description: 'Vigorous defense strategies for white-collar crimes, federal investigations, and regulatory matters.',
  },
  {
    icon: Users,
    title: 'Employment Law',
    description: 'Expert guidance on workplace disputes, discrimination claims, and executive compensation.',
  },
  {
    icon: FileText,
    title: 'Intellectual Property',
    description: 'Protection and enforcement of patents, trademarks, copyrights, and trade secrets.',
  },
  {
    icon: Landmark,
    title: 'Real Estate',
    description: 'Strategic counsel for commercial transactions, development projects, and property disputes.',
  },
  {
    icon: Briefcase,
    title: 'Personal Injury',
    description: 'Dedicated advocacy for victims of negligence, securing maximum compensation for injuries.',
  },
  {
    icon: Scale,
    title: 'Family Law',
    description: 'Compassionate representation in divorce, custody, and complex asset division matters.',
  },
];

export default function PracticeAreas() {
  return (
    <section id="practice-areas" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Practice Areas
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our attorneys bring decades of experience across a comprehensive range
            of legal disciplines, delivering sophisticated solutions for complex challenges.
          </p>
        </div>

        {/* Practice Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceAreas.map((area, index) => (
            <div
              key={area.title}
              className="group p-8 bg-white border border-gray-100 hover:border-[#c9a961] transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              <div className="w-14 h-14 bg-black group-hover:bg-[#c9a961] flex items-center justify-center mb-6 transition-colors duration-300">
                <area.icon size={28} className="text-[#c9a961] group-hover:text-black transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#c9a961] transition-colors">
                {area.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Don&apos;t see your specific legal need? We handle a wide range of matters.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-[#c9a961] hover:text-black font-semibold transition-colors"
          >
            Contact us to discuss your case
            <span className="text-xl">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
