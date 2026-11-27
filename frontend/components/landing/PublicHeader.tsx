'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './PublicHeader.module.css';

interface PublicHeaderProps {
  forceGuestActions?: boolean;
}

export default function PublicHeader({ forceGuestActions = false }: PublicHeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brandLink} aria-label="SkillNet Home">
          <BrandLogo variant="dark" size="md" />
        </Link>

        <div className={styles.actions}>
          {!forceGuestActions && !isLoading && user ? (
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
      </div>
    </header>
  );
}
