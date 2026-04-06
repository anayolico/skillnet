'use client';
import React from 'react';
import Link from 'next/link';
import styles from './catalog.module.css';

export default function Catalog() {
  const courses = [
    {
      id: 1,
      tag: 'Verified Expert',
      title: 'Fintech Architecture',
      desc: 'Structural principles for high-scale financial ledgers and escrow systems.',
      instructor: 'Marcus Thorne, PhD',
      rating: '4.9',
      reviews: '2k',
      price: '$249',
      bgType: 'blue',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      tag: 'Verified Expert',
      title: 'System Governance',
      desc: 'Scale your design operations without losing creative soul or brand integrity.',
      instructor: 'Elena Rodriguez',
      rating: '4.8',
      reviews: '1.2k',
      price: '$189',
      bgType: 'dark',
      avatar: '👩‍💻',
    },
    {
      id: 3,
      tag: 'Verified Expert',
      title: 'Business Logic',
      desc: 'Deconstructing enterprise revenue models through the lens of architectural logic.',
      instructor: 'Sarah Chen',
      rating: '5.0',
      reviews: '3.4k',
      price: '$320',
      bgType: 'gray',
      avatar: '👩🏻‍💼',
    },
    {
      id: 4,
      tag: 'Development',
      title: 'Cloud Infrastructure for Modern DevOps',
      desc: 'Building resilient deployment pipelines for enterprise architecture.',
      instructor: 'Alex Rivera',
      rating: '4.9',
      reviews: '890',
      price: '$215.00',
      bgType: 'darkBlue',
      avatar: '🧑🏽‍💻',
    }
  ];

  const getBgStyle = (type: string) => {
    switch (type) {
      case 'blue': return { background: 'linear-gradient(135deg, #1e3b8a, #3b82f6)' };
      case 'dark': return { background: 'linear-gradient(135deg, #0f172a, #334155)' };
      case 'gray': return { background: 'linear-gradient(135deg, #334155, #64748b)' };
      case 'darkBlue': return { background: 'linear-gradient(135deg, #172554, #1e3a8a)' };
      default: return { background: '#1e3a8a' };
    }
  };

  return (
    <div className={styles.catalogRoot}>

      {/* -------------------------------------------
          DESKTOP OVERLAY NAV
      ------------------------------------------- */}
      <nav className={styles.desktopNav}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logoArea}>
            <div className={styles.mobileHeaderLogoShield}></div>
            SkillNet
          </Link>
          <div className={styles.mainLinks}>
            <Link href="/dashboard">Home</Link>
            <Link href="/catalog" className={styles.activeLink}>Catalog</Link>
            <Link href="#">Marketplace</Link>
            <Link href="#">Subscriptions</Link>
          </div>
        </div>
        <div className={styles.navRight}>
          <div className={styles.navIcons}>
            <span>🔔</span>
            <span>🛒</span>
            <button className={styles.createCourseBtn}>Create Course</button>
            <div className={styles.avatar}>🧑🏻‍💼</div>
          </div>
        </div>
      </nav>

      {/* -------------------------------------------
          MOBILE TOP HEADER
      ------------------------------------------- */}
      <header className={styles.mobileHeader}>
        <Link href="/" className={styles.mobileHeaderLogo}>
          <div className={styles.mobileHeaderLogoShield}></div>
          SkillNet
        </Link>
        <div className={styles.mobileHeaderActions}>
          <span>🔔</span>
          <div className={styles.avatar}>A</div>
        </div>
      </header>

      {/* -------------------------------------------
          MAIN CONTENT HERO & FILTERS
      ------------------------------------------- */}
      <main className={styles.container}>
        <p className={styles.catalogSub}>THE CATALOG</p>
        <h1 className={styles.heroTitle}>
          Master the Architectural
          <br className="hidden md:block" />
          <span className={styles.heroTitleItalic}>Logic of Business</span>
        </h1>
        <p className={styles.heroDesc}>
          Curated learning paths designed for high-performance professionals. Secure your next skill through our verified expert network.
        </p>

        <div className={styles.searchFilterArea}>
          <div className={styles.searchInputWrapper}>
            <span>🔍</span>
            <input type="text" placeholder="Explore architectural strategy, design systems, or fintech..." />
          </div>
          <button className={styles.sortDropdown}>
            Sort by: Featured <span>&darr;</span>
          </button>
        </div>

        <div className={styles.filterPills}>
          <button className={`${styles.pill} ${styles.activePill}`}>All Tutorials</button>
          <button className={styles.pill}>Development</button>
          <button className={styles.pill}>Design</button>
          <button className={styles.pill}>Business</button>
          <button className={styles.pill}>Marketing</button>
        </div>

        {/* -------------------------------------------
            COURSES GRID
        ------------------------------------------- */}
        <div className={styles.coursesGrid}>
          {courses.slice(0, 2).map(course => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseThumbnail} style={getBgStyle(course.bgType)}>
                {course.tag && (
                  <div className={styles.thumbnailOverlay}>
                    <span>🛡️</span> {course.tag}
                  </div>
                )}
                {/* Visual placeholder for course graphics */}
                <div style={{ fontSize: '4rem', opacity: 0.2 }}>{course.avatar}</div>
              </div>
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>

                <div className={styles.instructorRow}>
                  <div className={styles.instructorAvatar}>{course.avatar}</div>
                  <div className={styles.instructorStats}>
                    <span className={styles.instructorName}>{course.instructor}</span>
                    <div className={styles.instructorRating}>
                      ★ {course.rating} <span>({course.reviews} students)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.price}>{course.price}</span>
                  <button className={styles.syllabusBtn}>View Syllabus</button>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Card injected in the grid sequence */}
          <div className={styles.promoCard}>
            <h3 className={styles.promoTitle}>Can't find what you're looking for?</h3>
            <p className={styles.promoDesc}>Request a specific online behavior from our network. We add 10+ professional courses weekly.</p>
            <button className={styles.promoBtn}>Request a Course</button>
          </div>

          {courses.slice(2).map(course => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseThumbnail} style={getBgStyle(course.bgType)}>
                {course.tag && (
                  <div className={styles.thumbnailOverlay}>
                    <span>🛡️</span> {course.tag}
                  </div>
                )}
                <div style={{ fontSize: '4rem', opacity: 0.2 }}>{course.avatar}</div>
              </div>
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>

                <div className={styles.instructorRow}>
                  <div className={styles.instructorAvatar}>{course.avatar}</div>
                  <div className={styles.instructorStats}>
                    <span className={styles.instructorName}>{course.instructor}</span>
                    <div className={styles.instructorRating}>
                      ★ {course.rating} <span>({course.reviews} students)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.price}>{course.price}</span>
                  <button className={styles.syllabusBtn}>View Syllabus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bottomCtaArea}>
          <button className={styles.exploreBtn}>
            Discover 128 + More Courses <span>&rarr;</span>
          </button>
        </div>
      </main>

      {/* -------------------------------------------
          DESKTOP & MOBILE FOOTER
      ------------------------------------------- */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            <div className={styles.mobileHeaderLogoShield}></div>
            SkillNet
          </div>
          <p className={styles.footerDesc}>
            The premium editorial marketplace for professional skills. Elevating the standard of online education through curated expertise and architectural precision.
          </p>
          <div className={styles.footerIcons}>
            <a href="#" className={styles.footerIcon}>tw</a>
            <a href="#" className={styles.footerIcon}>in</a>
          </div>
        </div>

        <div>
          <h4 className={styles.footerLinksTitle}>Platform</h4>
          <div className={styles.footerLinks}>
            <a href="#">Course Catalog</a>
            <a href="#">Skill Swapping</a>
            <a href="#">Verified Teachers</a>
            <a href="#">Enterprise</a>
          </div>
        </div>

        <div>
          <h4 className={styles.footerLinksTitle}>Legal</h4>
          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Escrow Protection</a>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------
          MOBILE BOTTOM NAV
      ------------------------------------------- */}
      <nav className={styles.mobileBottomNav}>
        <Link href="/dashboard" className={styles.mobileBottomNavItem}>
          <span className={styles.mobileBottomNavIcon}>⊞</span>
          Home
        </Link>
        <Link href="/catalog" className={`${styles.mobileBottomNavItem} ${styles.active}`}>
          <span className={styles.mobileBottomNavIcon}>📚</span>
          Courses
        </Link>
        <Link href="#" className={styles.mobileBottomNavItem}>
          <span className={styles.mobileBottomNavIcon}>⇄</span>
          Swap
        </Link>
        <Link href="#" className={styles.mobileBottomNavItem}>
          <span className={styles.mobileBottomNavIcon}>👤</span>
          Profile
        </Link>
      </nav>

    </div>
  );
}
