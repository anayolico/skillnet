'use client'

import { useState, useEffect } from 'react'

const navLinks = ['Home', 'Catalog', 'Marketplace', 'Subscriptions']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-teal-400 to-emerald-500 opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fillOpacity="0.8"/>
              </svg>
            </div>
          </div>
          <span
            className="font-display font-700 text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            SkillNet
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`text-sm transition-colors duration-200 hover:text-teal-400 ${
                i === 0 ? 'text-white font-500 border-b border-teal-400 pb-0.5' : 'text-slate-400'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </button>
          <button className="btn-primary rounded-sm px-5 py-2.5 text-sm font-semibold">
            <span>Join Network</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass mt-2 mx-6 rounded-sm p-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <a key={link} href="#" className="text-sm text-slate-300 hover:text-teal-400 transition-colors py-1">
              {link}
            </a>
          ))}
          <button className="btn-primary rounded-sm px-5 py-2.5 text-sm font-semibold text-center mt-2">
            <span>Join Network</span>
          </button>
        </div>
      )}
    </nav>
  )
}
