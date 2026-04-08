export default function CTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl orb pointer-events-none" />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-emerald-400/8 blur-3xl orb pointer-events-none"
        style={{ animationDelay: '4s' }}
      />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="tag-label inline-flex mb-8">Join 12,482+ professionals</div>

        <h2
          className="text-5xl md:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
        >
          Ready to architect
          <br />
          <span className="gradient-text text-glow">your expertise?</span>
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          Join 12,001+ professionals currently exchanging high-value skillsets. Your next knowledge exchange is waiting.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-primary rounded-sm px-8 py-4 text-sm font-semibold w-full sm:w-auto">
            <span>Join the Network</span>
          </button>
          <button className="btn-outline rounded-sm px-8 py-4 text-sm font-semibold w-full sm:w-auto">
            View Skill Taxonomy
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
          {[
            { val: '12,482+', label: 'Active Members' },
            { val: '98.4%', label: 'Exchange Success' },
            { val: '4.9/5', label: 'Trust Score' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="text-2xl md:text-3xl font-black gradient-text mb-1"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
              >
                {s.val}
              </div>
              <div className="text-slate-600 text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
