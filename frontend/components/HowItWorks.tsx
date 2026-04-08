const steps = [
  {
    number: '01',
    title: 'Learn',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="#2DD4BF" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 14l6.16-3.422A12.083 12.083 0 0 1 21 20.25a12.083 12.083 0 0 0-9 0 12.083 12.083 0 0 0-9 0 12.083 12.083 0 0 1 2.84-9.672L12 14z" stroke="#2DD4BF" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    description:
      'Access a curriculum designed by industry architects. Deep-dive into technical taxonomies and professional methodologies.',
    cta: 'Explore Curriculum',
  },
  {
    number: '02',
    title: 'Swap',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0l-4.5-4.5M21 7.5H7.5" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    description:
      'Engage in direct peer-to-peer knowledge arbitrage. Trade your technical mastery for another professional\'s expertise in a secure sandbox.',
    cta: 'Find a Partner',
  },
  {
    number: '03',
    title: 'Grow',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    description:
      'Validate your growth through our architectural ledger. Build a portfolio of verified skills backed by real professional exchanges.',
    cta: 'View Taxonomy',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-28 relative">
      {/* Background accent */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <div className="tag-label mb-6">Our Framework</div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
          >
            How SkillNet
            <br />
            <span className="gradient-text">Operates</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="glass card-hover rounded-sm p-8 relative group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-teal-500/15 to-emerald-500/5 border border-teal-400/15 flex items-center justify-center group-hover:border-teal-400/30 transition-colors">
                  {step.icon}
                </div>
                <span
                  className="text-slate-700 font-bold text-4xl leading-none select-none"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                >
                  {step.number}
                </span>
              </div>

              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
              >
                {step.number.replace('0', '')}. {step.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                {step.description}
              </p>

              <a
                href="#"
                className="flex items-center gap-2 text-teal-400 text-sm hover:gap-3 transition-all group-hover:text-teal-300"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                {step.cta}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-teal-400/30 via-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
