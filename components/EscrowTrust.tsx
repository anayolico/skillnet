const features = [
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Identity Verification',
    description: 'Every network member undergoes a multi-layer professional vetting process to ensure network integrity.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Milestone-based Release',
    description: 'Credits and certifications are released proportionally as specific learning outcomes are documented.',
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Conflict Resolution',
    description: 'Our dedicated architectural board provides mediation for any discrepancies in knowledge transfer quality.',
  },
]

export default function EscrowTrust() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-navy-900" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="tag-label mb-8">Secure Exchange Protocol</div>

            <h2
              className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
            >
              The Escrow Trust
              <br />
              <span className="gradient-text">Protocol</span>
            </h2>

            <p className="text-slate-400 leading-relaxed mb-12" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              We prioritize institutional-grade security for every intellectual exchange. Our ledger ensures that value is transferred only when professional milestones are met.
            </p>

            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-sm bg-teal-500/10 border border-teal-400/15 flex items-center justify-center flex-shrink-0 group-hover:border-teal-400/30 transition-colors mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                      {f.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button className="btn-primary rounded-sm px-7 py-3.5 text-sm font-semibold">
                <span>Learn About Our Security</span>
              </button>
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-lg border border-teal-400/10 bg-gradient-to-br from-navy-800/80 to-navy-950/80 backdrop-blur-sm overflow-hidden">
                {/* Scan line */}
                <div className="scan-line" />

                {/* Code background */}
                <div className="absolute inset-0 p-6 overflow-hidden">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-3 mb-2"
                      style={{ opacity: Math.random() * 0.4 + 0.1 }}
                    >
                      <span className="text-teal-600 text-xs" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-teal-400/40 text-xs" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
                        {['const verify =', 'await escrow.lock(', 'release.when(', 'milestone.complete', 'transfer.secure(', 'ledger.record(', 'hash.validate(', 'sign.protocol('][i % 8]}
                        {' '}
                        <span className="text-emerald-400/50">{Math.random().toString(36).substring(2, 10)}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Center badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass rounded-sm px-6 py-5 text-center glow-teal">
                    <div className="text-3xl font-black gradient-text mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                      100%
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                      Secure Delivery
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6`}>
                  <div className={`absolute ${i % 2 === 0 ? 'left-0' : 'right-0'} top-0 w-4 h-px bg-teal-400/60`} />
                  <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-px h-4 bg-teal-400/60`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
