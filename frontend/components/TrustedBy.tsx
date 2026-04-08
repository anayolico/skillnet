const logos = [
  'FINTECH_CORP',
  'NEXUS_ARCH',
  'GLOBAL_LEDGER',
  'TECH_MINT',
  'VALUATION_PRO',
  'CIPHER_LABS',
  'ARBOR_CAPITAL',
  'SYNTH_VENTURES',
]

export default function TrustedBy() {
  const doubled = [...logos, ...logos]

  return (
    <section className="py-16 border-y border-white/5 overflow-hidden">
      <div className="text-center mb-10">
        <p
          className="text-xs text-slate-600 uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Trusted by professionals from global leaders
        </p>
      </div>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

        <div className="ticker-track">
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="mx-10 flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500/40 group-hover:bg-teal-400/70 transition-colors" />
              <span
                className="text-sm font-medium tracking-widest whitespace-nowrap"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em' }}
              >
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
