'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './PublicHeader.module.css';

interface PublicHeaderProps {
  forceGuestActions?: boolean;
}

export default function PublicHeader({ forceGuestActions = false }: PublicHeaderProps) {
  const { user, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const showDashboard = !forceGuestActions && !isLoading && Boolean(user);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label="SkillNet Home">
          <BrandLogo variant="dark" size="md" />
        </Link>

        {/* Desktop / Tablet Actions */}
        <div className={styles.actions}>
          {showDashboard ? (
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

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <>
          <div
            className={styles.mobileBackdrop}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.mobileDropdown}>
            {showDashboard ? (
              <Link
                href="/dashboard"
                className={styles.mobileCta}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard <ArrowRight size={15} />
              </Link>
            ) : (
              <div className={styles.mobileActions}>
                <Link
                  href="/login"
                  className={styles.mobileLogin}
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
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
