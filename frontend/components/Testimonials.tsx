const testimonials = [
  {
    name: 'Elena Vance',
    role: 'Senior Financial Architect',
    avatar: 'EV',
    color: 'from-teal-500 to-teal-700',
    quote:
      'SkillNet allowed me to trade my quantitative analysis mastery for expert-level Python automation. The structured exchange made it feel like a professional collaboration rather than a simple course.',
  },
  {
    name: 'Marcus Thorne',
    role: 'Cloud Infrastructure Lead',
    avatar: 'MT',
    color: 'from-emerald-500 to-emerald-700',
    quote:
      'Finding a swap partner who actually understands the nuances of enterprise-grade DevOps was a game changer. The Escrow Protocol gives me peace of mind.',
  },
  {
    name: 'Julian Rossi',
    role: 'Head of Product Strategy',
    avatar: 'JR',
    color: 'from-slate-500 to-slate-700',
    quote:
      "The knowledge taxonomy here is unprecedented. I've architected a completely new skillset in strategic operations through high-fidelity swaps that actually stick.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="tag-label inline-flex mb-6">Professional Outcomes</div>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
          >
            Professional
            <br />
            <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-slate-500 mt-4 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            Real outcomes from real communities of experts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass testimonial-card card-hover rounded-sm p-8"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="14" height="14" fill="#2DD4BF" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"/>
                  </svg>
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
