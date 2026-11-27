import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PublicHeader from './landing/PublicHeader';
import Footer from './Footer';
import styles from './LegalPageLayout.module.css';

interface LegalSectionLink {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  category?: string;
  title: string;
  summary?: string;
  sections?: LegalSectionLink[];
  children: ReactNode;
}

export default function LegalPageLayout({
  category,
  title,
  summary,
  sections = [],
  children,
}: LegalPageLayoutProps) {
  return (
    <div className={styles.page}>
      <PublicHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} /> Back to SkillNet
          </Link>

          <header className={styles.header}>
            {category && <span className={styles.category}>{category}</span>}
            <h1 className={styles.title}>{title}</h1>
            {summary && <p className={styles.summary}>{summary}</p>}
          </header>

          <div className={styles.stack}>
            {sections.length > 0 && (
              <nav className={styles.tocCard} aria-label="On this page">
                <span className={styles.tocTitle}>Contents</span>
                <div className={styles.tocRow}>
                  {sections.map((sec) => (
                    <a key={sec.id} href={`#${sec.id}`} className={styles.tocLink}>
                      {sec.label}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <article className={styles.content}>{children}</article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
