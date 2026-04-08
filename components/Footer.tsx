'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = {
  'Global Network': [
    { label: 'Partner Directory', href: '#' },
    { label: 'Regional Nodes', href: '#' },
    { label: 'Exchange Marketplace', href: '/marketplace' },
    { label: 'Corporate Access', href: '#' },
  ],
  Protocol: [
    { label: 'Trust & Safety', href: '#' },
    { label: 'Skill Taxonomy', href: '#' },
    { label: 'Privacy Protocol', href: '#' },
    { label: 'Security Audit', href: '#' },
  ],
  Company: [
    { label: 'About the Ledger', href: '#' },
    { label: 'Architecture Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoShield} />
              SkillNet
            </Link>
            <p className={styles.brandDesc}>
              Designing the future of professional knowledge exchange through architectural precision and peer-to-peer trust.
            </p>
            <div className={styles.socialRow}>
              {['𝕏', 'in', 'gh'].map(s => (
                <button key={s} className={styles.socialBtn} aria-label={`Follow on ${s}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={styles.columnTitle}>{category}</h4>
              <ul className={styles.linkList}>
                {links.map(link => (
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

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} SkillNet Architectural Ledger. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>Legal Notice</Link>
            <Link href="#" className={styles.legalLink}>Expertise Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
