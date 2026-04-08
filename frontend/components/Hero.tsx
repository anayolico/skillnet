'use client'

import { useEffect, useRef, useState } from 'react'

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = Date.now()
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Orbs */}
      <div className="orb absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div
        className="orb absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none"
        style={{ animationDelay: '3s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="relative z-10">
          <div className="tag-label mb-8" style={{ animationDelay: '0s' }}>
            The Knowledge Exchange Protocol
          </div>

          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
          >
            <span className="block text-white">Master the</span>
            <span className="block text-white">Art of the</span>
            <span className="block gradient-text text-glow">Exchange</span>
          </h1>

          <p
            className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            A sophisticated peer-to-peer ecosystem designed for professionals to architect their expertise through high-fidelity knowledge transfer.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-primary rounded-sm px-7 py-3.5 text-sm font-semibold">
              <span>Explore Courses</span>
            </button>
            <button className="btn-outline rounded-sm px-7 py-3.5 text-sm font-semibold flex items-center gap-2">
              Find a Swap Partner
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
            <span
              className="text-xs text-slate-600 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Trusted by professionals
            </span>
          </div>
        </div>

        {/* Right — floating card */}
        <div className="relative flex justify-center items-center">
          {/* Main monitor visual */}
          <div className="relative w-full max-w-md">
            {/* Decorative lines */}
            <div className="absolute -inset-8 pointer-events-none">
              <div className="absolute top-0 left-8 w-px h-20 bg-gradient-to-b from-teal-400/40 to-transparent" />
              <div className="absolute top-0 right-12 w-px h-16 bg-gradient-to-b from-emerald-400/30 to-transparent" />
              <div className="absolute bottom-0 left-16 w-px h-24 bg-gradient-to-t from-teal-400/20 to-transparent" />
            </div>

            {/* Screen */}
            <div className="glass rounded-lg overflow-hidden glow-teal" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <div className="bg-navy-800 h-8 flex items-center px-4 gap-2 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-4 bg-white/5 rounded-sm flex items-center px-2">
                  <span className="text-xs text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>
                    skillnet.io/dashboard
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Chart bars */}
                <div className="flex items-end gap-2 h-24">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-teal-600/40 to-teal-400/60" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Exchanges', val: '1,284' },
                    { label: 'Skills', val: '387' },
                    { label: 'Score', val: '98.4%' },
                  ].map(s => (
                    <div key={s.label} className="glass-light rounded-sm p-3">
                      <div className="text-teal-400 font-semibold text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{s.val}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Activity feed */}
                <div className="space-y-2">
                  {[
                    { color: 'bg-teal-400', text: 'Python → Financial Modelling swap confirmed' },
                    { color: 'bg-emerald-400', text: 'Escrow released: $2,400 value transferred' },
                    { color: 'bg-slate-500', text: 'New partner match: Infrastructure Lead' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color} flex-shrink-0`} />
                      <span className="text-xs text-slate-500" style={{ fontFamily: 'var(--font-mono)' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-6 -left-8 glass rounded-sm px-5 py-4 glow-teal"
              style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-sm bg-gradient-to-br from-teal-400/20 to-teal-600/10 flex items-center justify-center border border-teal-400/20">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#2DD4BF" strokeWidth="1.5"/>
                    <circle cx="9" cy="7" r="4" stroke="#2DD4BF" strokeWidth="1.5"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">
                    <AnimatedCounter target={12482} />+
                  </div>
                  <div className="text-slate-500 text-xs">Active Nodes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  )
}
