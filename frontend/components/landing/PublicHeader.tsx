'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './PublicHeader.module.css';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#escrow', label: 'Escrow Trust' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function PublicHeader() {
  const { user, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label="SkillNet Home">
          <BrandLogo variant="dark" size="md" />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {!isLoading && user ? (
            <Link href="/dashboard" className={styles.cta}>
              Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>
                Log in
              </Link>
              <Link href="/join" className={styles.cta}>
                Start Swapping <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNav} aria-label="Mobile main navigation">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileActions}>
            {!isLoading && user ? (
              <Link
                href="/dashboard"
                className={styles.mobileCta}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.mobileSecondary}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/join"
                  className={styles.mobileCta}
                  onClick={() => setMenuOpen(false)}
                >
                  Start Swapping <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
