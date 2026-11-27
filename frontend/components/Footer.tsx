'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import styles from './Footer.module.css';

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Trust & Safety', href: '/trust' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const [year, setYear] = useState<number>(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerRow}>
          <div className={styles.brandMeta}>
            <Link href="/" className={styles.logo} aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="sm" />
            </Link>
            <span className={styles.divider} aria-hidden="true" />
            <p className={styles.copyright} suppressHydrationWarning>
              © {year} SkillNet. All rights reserved.
            </p>
          </div>

          <nav className={styles.legalLinks} aria-label="Legal and policy navigation">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
