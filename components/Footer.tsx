const footerLinks = {
  'Global Network': ['Partner Directory', 'Regional Notes', 'Exchange Marketplace', 'Corporate Access'],
  Protocol: ['Trust & Safety', 'Skill Taxonomy', 'Privacy Protocol', 'Security Audit'],
  Company: ['About the Ledger', 'Architecture Blog', 'Careers', 'Contact'],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-teal-400 to-emerald-500 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.8"/>
                  </svg>
                </div>
              </div>
              <span className="font-display font-bold text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                SkillNet
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Designing the future of professional knowledge exchange through architectural precision and peer-to-peer trust.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {['twitter', 'github', 'linkedin'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 glass-light rounded-sm flex items-center justify-center text-slate-500 hover:text-teal-400 transition-colors"
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-600 text-sm hover:text-slate-300 transition-colors"
                      style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-700 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            © 2024 SkillNet Architectural Ledger. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Legal Notice', 'Expertise Policy'].map(link => (
              <a
                key={link}
                href="#"
                className="text-slate-700 text-xs hover:text-slate-500 transition-colors"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
