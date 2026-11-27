'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import styles from './Footer.module.css';

const footerLinks = {
  Platform: [
    { label: 'Skill Marketplace', href: '/marketplace' },
    { label: 'Course Catalog', href: '/catalog' },
    { label: 'Post a Skill Offer', href: '/create-listing' },
    { label: 'Membership Plans', href: '/subscriptions' },
  ],
  Workspace: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Swap Requests & Escrow', href: '/escrow' },
    { label: 'Live Swap Rooms', href: '/chats' },
    { label: 'Member Profile', href: '/profile' },
  ],
  Account: [
    { label: 'Start Swapping', href: '/join' },
    { label: 'Log in', href: '/login' },
    { label: 'Account Settings', href: '/settings' },
    { label: 'How It Works', href: '/#how-it-works' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logo} aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
            <p className={styles.brandDesc}>
              A peer-to-peer professional exchange built for structured knowledge transfer,
              live mentoring sessions, and verified milestones.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={styles.columnTitle}>{category}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} SkillNet. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/#escrow" className={styles.legalLink}>
              Escrow Standard
            </Link>
            <Link href="/#pricing" className={styles.legalLink}>
              Membership
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
