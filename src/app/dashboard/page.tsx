'use client';
import React from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.dashboardRoot}>
      
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
          DESKTOP OVERLAY NAV
      ------------------------------------------- */}
      <nav className={styles.desktopNav}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logoArea}>SkillNet</Link>
          <div className={styles.mainLinks}>
            <Link href="/" className={styles.activeLink}>Home</Link>
            <Link href="#">Catalog</Link>
            <Link href="#">Marketplace</Link>
            <Link href="#">Subscriptions</Link>
          </div>
        </div>
        <div className={styles.navRight}>
          <div className={styles.searchBar}>
            <span>🔍</span>
            <input type="text" placeholder="Search skills..." />
          </div>
          <div className={styles.navIcons}>
            <span>🔔</span>
            <span>🛒</span>
            <div className={styles.avatar}>👨‍💻</div>
          </div>
        </div>
      </nav>

      <div className={styles.dashboardContainer}>
        {/* -------------------------------------------
            DESKTOP SIDEBAR
        ------------------------------------------- */}
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.hubLabel}>Instructor Hub</div>
            <div className={styles.hubTier}>Premium Tier</div>
            <div className={styles.sideLinks}>
              <Link href="#" className={`${styles.sideLink} ${styles.active}`}>
                <span>⊞</span> Dashboard
              </Link>
              <Link href="#" className={styles.sideLink}>
                <span>🎓</span> My Learning
              </Link>
              <Link href="#" className={styles.sideLink}>
                <span>📊</span> Analytics
              </Link>
              <Link href="#" className={styles.sideLink}>
                <span>💰</span> Earnings
              </Link>
              <Link href="#" className={styles.sideLink}>
                <span>⚙️</span> Settings
              </Link>
            </div>
          </div>

          <div className={styles.sidebarBottom}>
            <div className={styles.upgradeBox}>
              <div className={styles.upgradeTitle}>UPGRADE ACCOUNT</div>
              <div className={styles.upgradeText}>Get unlimited access to expert networks.</div>
              <button className={styles.upgradeBtn}>Go Pro</button>
            </div>
            <Link href="#" className={styles.sideLink} style={{padding: '0 1rem'}}>
              <span>❔</span> Help Center
            </Link>
            <Link href="#" className={styles.sideLink} style={{padding: '0 1rem'}}>
              <span>🚪</span> Logout
            </Link>
          </div>
        </aside>

        {/* -------------------------------------------
            MAIN CONTENT
        ------------------------------------------- */}
        <main className={styles.mainContent}>
          
          <div className={styles.welcomeSection}>
            <div>
              <span className={styles.welcomeSubtitle}>DASHBOARD</span>
              <h1 className={styles.welcomeTitle}>Welcome back, Alex!</h1>
              <p className={styles.welcomeText}>You've mastered 3 new skills this month. Your next goal is within reach.</p>
            </div>
            <button className={styles.ctaBtn}>
              Explore Marketplace →
            </button>
          </div>

          <div className={styles.statGrid}>
            {/* Desktop Wide Momentum Card / Mobile uses standalone items */}
            <div className={`${styles.card} ${styles.momentumCard}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.momentumHeader}>
                <div className={styles.momentumTitleGroup}>
                  <h3 className={styles.kpiTitle} style={{ fontSize: '1.2rem', textTransform: 'none' }}>Learning Momentum</h3>
                  <span className={styles.swapRole}>Active Progress across 4 domains</span>
                </div>
                <div className={styles.swapBadge} style={{background: '#d1fae5', color: '#065f46'}}>Top 5% Student</div>
              </div>
              <div className={styles.progressList}>
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span>Advanced React Patterns</span>
                    <span>82%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span>Financial Analysis 101</span>
                    <span style={{color: '#059669'}}>45%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={`${styles.progressBarFill} ${styles.green}`} style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.kpiCard}`}>
              <span className={styles.kpiTitle}>TOTAL HOURS</span>
              <span className={styles.kpiValue}>124.5</span>
              <span className={styles.kpiSubtext}>↗ +12% from last week</span>
            </div>

            <div className={`${styles.card} ${styles.kpiCard}`}>
              <span className={styles.kpiTitle}>ACTIVE SWAPS</span>
              <span className={styles.kpiValue}>06</span>
              <span className={styles.swapRole}>2 sessions pending approval</span>
            </div>
          </div>

          {/* Active Swaps Section */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Active Skill-Swaps</h2>
              <Link href="#" className={styles.viewAllLink}>View All Matches</Link>
            </div>
            <div className={styles.swapsGrid}>
              <div className={`${styles.card} ${styles.swapCard}`}>
                <div className={styles.swapHeader}>
                  <div className={styles.swapUser}>
                    <div className={styles.swapAvatar}>👧🏻</div>
                    <div>
                      <div className={styles.swapName}>Elena Vance</div>
                      <div className={styles.swapRole}>Senior Product Designer</div>
                    </div>
                  </div>
                  <span className={`${styles.swapBadge} ${styles.swapBadgeBlue}`}>ONGOING CHAT</span>
                </div>
                <div className={styles.swapData}>
                  <div className={styles.swapCol}>
                    <span className={styles.swapLabel}>YOU GIVE</span>
                    <span className={styles.swapValue}>Technical SEO</span>
                  </div>
                  <div style={{color: '#cbd5e1'}}>⇄</div>
                  <div className={styles.swapCol} style={{textAlign: 'right'}}>
                    <span className={styles.swapLabel}>YOU GET</span>
                    <span className={`${styles.swapValue} ${styles.green}`}>React Native</span>
                  </div>
                </div>
                <div className={styles.swapActions}>
                  <button className={styles.btnSecondary}>Message</button>
                  <button className={styles.btnPrimary}>Schedule Session</button>
                </div>
              </div>

              <div className={`${styles.card} ${styles.swapCard}`}>
                <div className={styles.swapHeader}>
                  <div className={styles.swapUser}>
                    <div className={styles.swapAvatar}>👨🏽‍💻</div>
                    <div>
                      <div className={styles.swapName}>Marcus Chen</div>
                      <div className={styles.swapRole}>Full Stack Dev</div>
                    </div>
                  </div>
                  <span className={`${styles.swapBadge} ${styles.swapBadgeGreen}`}>PENDING SESSION</span>
                </div>
                <div className={styles.swapData}>
                  <div className={styles.swapCol}>
                    <span className={styles.swapLabel}>YOU GIVE</span>
                    <span className={styles.swapValue}>UI Design Systems</span>
                  </div>
                  <div style={{color: '#cbd5e1'}}>⇄</div>
                  <div className={styles.swapCol} style={{textAlign: 'right'}}>
                    <span className={styles.swapLabel}>YOU GET</span>
                    <span className={`${styles.swapValue} ${styles.green}`}>Python Core</span>
                  </div>
                </div>
                <div className={styles.swapActions}>
                  <button className={styles.btnSecondary}>Review Details</button>
                  <button className={styles.btnPrimary}>Approve Time</button>
                </div>
              </div>
            </div>
          </section>

          {/* Top Rated Section */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Top-Rated for You</h2>
            </div>
            <div className={styles.coursesGrid}>
              
              <div className={styles.courseCard}>
                <div className={styles.courseVisual} style={{background: '#334155'}}>
                  <span className={styles.courseTag}>DATA SCIENCE</span>
                  📊
                </div>
                <div className={styles.courseContent}>
                  <div className={styles.courseRating}>★ 4.9 <span style={{fontWeight: 400, color: '#94a3b8'}}>(2.4k reviews)</span></div>
                  <h3 className={styles.courseTitle}>Visualizing Complexity: Modern Data Storytelling</h3>
                  <div className={styles.courseFooter}>
                    <span className={styles.coursePrice}>$129.00</span>
                    <button className={styles.courseCart}>🛒</button>
                  </div>
                </div>
              </div>

              <div className={styles.courseCard}>
                <div className={styles.courseVisual} style={{background: '#0f172a'}}>
                  <span className={styles.courseTag}>ARCHITECTURE</span>
                  🏢
                </div>
                <div className={styles.courseContent}>
                  <div className={styles.courseRating}>★ 4.8 <span style={{fontWeight: 400, color: '#94a3b8'}}>(1.1k reviews)</span></div>
                  <h3 className={styles.courseTitle}>The Architect's Edge: Advanced Digital Modeling</h3>
                  <div className={styles.courseFooter}>
                    <span className={styles.coursePrice}>$199.00</span>
                    <button className={styles.courseCart}>🛒</button>
                  </div>
                </div>
              </div>

              <div className={styles.courseCard}>
                <div className={styles.courseVisual} style={{background: '#f8fafc', color: '#1e293b'}}>
                  <span className={styles.courseTag}>LEADERSHIP</span>
                  👔
                </div>
                <div className={styles.courseContent}>
                  <div className={styles.courseRating}>★ 5.0 <span style={{fontWeight: 400, color: '#94a3b8'}}>(850 reviews)</span></div>
                  <h3 className={styles.courseTitle}>Global Executive Presence: The Modern Standards</h3>
                  <div className={styles.courseFooter}>
                    <span className={styles.coursePrice}>$299.00</span>
                    <button className={styles.courseCart}>🛒</button>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>

      {/* -------------------------------------------
          MOBILE BOTTOM NAV
      ------------------------------------------- */}
      <nav className={styles.mobileBottomNav}>
        <div className={`${styles.navItem} ${styles.active}`}>
          <span className={styles.navIcon}>⊞</span>
          Home
        </div>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>📚</span>
          Courses
        </div>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>⇄</span>
          Swap
        </div>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>👤</span>
          Profile
        </div>
      </nav>
      
    </div>
  );
}
