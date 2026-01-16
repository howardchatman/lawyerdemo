'use client';

const caseResults = [
  {
    amount: '$450M',
    type: 'Class Action Settlement',
    description: 'Securities fraud case against major financial institution',
    year: '2024',
  },
  {
    amount: '$125M',
    type: 'Jury Verdict',
    description: 'Pharmaceutical product liability litigation',
    year: '2024',
  },
  {
    amount: '$89M',
    type: 'Settlement',
    description: 'Employment discrimination class action',
    year: '2023',
  },
  {
    amount: '$67M',
    type: 'Arbitration Award',
    description: 'International commercial dispute resolution',
    year: '2023',
  },
  {
    amount: '$52M',
    type: 'Jury Verdict',
    description: 'Medical malpractice wrongful death case',
    year: '2023',
  },
  {
    amount: '$38M',
    type: 'Settlement',
    description: 'Intellectual property infringement case',
    year: '2022',
  },
];

const accolades = [
  'Chambers USA - Band 1 Ranking',
  'American Lawyer - Top 50 Law Firms',
  'Best Lawyers - Firm of the Year',
  'Super Lawyers - Top Rated Attorneys',
  'Martindale-Hubbell - AV Preeminent',
  'Law360 - Practice Group of the Year',
];

export default function Results() {
  return (
    <section id="results" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#c9a961] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Proven Results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Case Results & Recognition
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our track record speaks for itself. These representative results demonstrate
            our commitment to achieving exceptional outcomes for our clients.
          </p>
        </div>

        {/* Case Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {caseResults.map((result, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-50 hover:bg-black transition-all duration-300 cursor-pointer border border-transparent hover:border-[#c9a961]"
            >
              <span className="text-xs text-gray-400 group-hover:text-gray-500 uppercase tracking-wide">
                {result.year}
              </span>
              <div className="text-4xl font-bold text-black group-hover:text-[#c9a961] mt-2 mb-3 transition-colors">
                {result.amount}
              </div>
              <div className="text-[#c9a961] font-semibold mb-2">
                {result.type}
              </div>
              <p className="text-gray-600 group-hover:text-gray-300 text-sm transition-colors">
                {result.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-400 text-xs mb-16 max-w-3xl mx-auto">
          *Past results do not guarantee future outcomes. Each case is unique and must be
          evaluated on its own merits. Results depend on the specific facts and circumstances.
        </p>

        {/* Accolades */}
        <div className="bg-black p-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Industry Recognition
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {accolades.map((accolade) => (
              <div
                key={accolade}
                className="text-center p-4 border border-[#c9a961]/20 hover:border-[#c9a961] transition-colors"
              >
                <p className="text-gray-300 text-sm font-medium">{accolade}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
