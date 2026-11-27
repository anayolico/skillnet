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
  category: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections?: LegalSectionLink[];
  children: ReactNode;
}

export default function LegalPageLayout({
  category,
  title,
  summary,
  lastUpdated,
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
            <span className={styles.category}>{category}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.summary}>{summary}</p>
            <p className={styles.updated}>Last updated: {lastUpdated}</p>
          </header>

          <div className={sections.length > 0 ? styles.bodyGrid : styles.bodySingle}>
            {sections.length > 0 && (
              <aside className={styles.toc} aria-label="On this page">
                <div className={styles.tocInner}>
                  <div className={styles.tocTitle}>Contents</div>
                  <nav className={styles.tocList}>
                    {sections.map((sec) => (
                      <a key={sec.id} href={`#${sec.id}`} className={styles.tocLink}>
                        {sec.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            <article className={styles.content}>{children}</article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
