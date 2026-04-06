'use client';
import React from 'react';
import Link from 'next/link';
import styles from './marketplace.module.css';

export default function Marketplace() {

  const partners = [
    {
      id: 1,
      name: 'Marcus Chen',
      role: 'Senior Product Manager',
      rating: '4.9',
      avatar: '👨🏻‍💻',
      giving: ['Agile Strategy', 'Roadmapping'],
      seeking: ['Data Visualization', 'D3.js']
    },
    {
      id: 2,
      name: 'Elena Rodriguez',
      role: 'Full Stack Developer',
      rating: '5.0',
      avatar: '👩🏽‍💻',
      giving: ['React/Node.js', 'AWS Arch'],
      seeking: ['Public Speaking', 'Copywriting']
    },
    {
      id: 3,
      name: 'Alex Sterling',
      role: 'UX Design Director',
      rating: '4.8',
      avatar: '🧑🏼‍💼',
      giving: ['Design Systems', 'UX Research'],
      seeking: ['Financial Analysis', 'Excel Expert']
    }
  ];

  return (
    <div className={styles.marketRoot}>
      
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
            <Link href="/catalog">Catalog</Link>
            <Link href="/marketplace" className={styles.activeLink}>Marketplace</Link>
            <Link href="#">Subscriptions</Link>
          </div>
        </div>
        <div className={styles.navRight}>
          <div className={styles.searchBarNav}>
            <span>🔍</span>
            <input type="text" placeholder="Search skills..." />
          </div>
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
          HERO SECTION
      ------------------------------------------- */}
      <main className={styles.container}>
        
        <div className={styles.heroGrid}>
          {/* Left Column (Text & Buttons) */}
          <div className={styles.heroLeft}>
            <span className={styles.subLabel}>PEER-TO-PEER NETWORK</span>
            <h1 className={styles.heroTitle}>
              Swap your Mastery <br/> for their <span>Genius.</span>
            </h1>
            <p className={styles.heroDesc}>
              SkillNet Marketplace is where professional growth transcends currency. Exchange your expertise in high-level domains for the skills you need to scale your impact.
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.btnPrimary}>Find a Partner</button>
              <button className={styles.btnSecondary}>How it Works</button>
            </div>

            {/* Mobile-only active swaps widget underneath hero text */}
            <div className={styles.activeSwapsMobile}>
              <div className={styles.activeSwapsHeader}>
                <h3>Active Swaps</h3>
                <span className={styles.badgeGray}>2 IN PROGRESS</span>
              </div>
              <div className={styles.activeSwapItem}>
                <div style={{fontSize: '2rem'}}>👩🏼‍💻</div>
                <div className={styles.activeSwapInfo}>
                  <p>Python for UI Design</p>
                  <span>Session scheduled for tomorrow</span>
                </div>
              </div>
            </div>

            {/* Mobile-only escrow card */}
            <div className={styles.mobileEscrowCard}>
              <div className={styles.escrowLabel}>
                <span>🛡️</span> ESCROW TRUST PROTOCOL
              </div>
              <h3 className={styles.escrowTitle}>Swap with Peace of Mind</h3>
              <p className={styles.escrowDesc}>
                Our unique session security holds "Skill-Credits" in escrow. You only release them once the learning session is confirmed successful by both partners.
              </p>
              <button className={styles.escrowBtn}>Learn How it Works</button>
            </div>
          </div>

          {/* Right Column (Desktop Image & Floating Widget) */}
          <div className={styles.heroRight}>
            <div className={styles.floatingWidget}>
              <div className={styles.floatingWidgetIcon}>💎</div>
              <div className={styles.floatingWidgetText}>
                <span>LATEST SWAP</span>
                <strong>Python Dev for UI Design</strong>
              </div>
            </div>
          </div>
        </div>


        {/* -------------------------------------------
            HOW IT WORKS (Desktop View predominantly in design)
        ------------------------------------------- */}
        <div className={styles.howItWorks}>
          <div>
            <div className={styles.stepNumber}>01.</div>
            <h4 className={styles.stepTitle}>Identify Your Edge</h4>
            <p className={styles.stepDesc}>List the core competencies you've mastered. Whether it's fiscal modeling, creative direction, or full-stack architecture.</p>
          </div>
          <div>
            <div className={styles.stepNumber}>02.</div>
            <h4 className={styles.stepTitle}>Bridge the Gap</h4>
            <p className={styles.stepDesc}>Browse the marketplace for partners whose "Giving" skills perfectly align with your "Seeking" requirements.</p>
          </div>
          <div>
            <div className={styles.stepNumber}>03.</div>
            <h4 className={styles.stepTitle}>Formalize the Swap</h4>
            <p className={styles.stepDesc}>Initiate a secure exchange proposal. Our platform ensures equitable time-value balance for both masters.</p>
          </div>
        </div>

        {/* -------------------------------------------
            STATS ROW
        ------------------------------------------- */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Swaps</span>
            <div className={styles.statValue}>1,284</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Pairs</span>
            <div className={`${styles.statValue} ${styles.green}`}>412</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Expertise Domains</span>
            <div className={styles.statValue}>54</div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Success Rate</span>
            <div className={`${styles.statValue} ${styles.green}`}>98.2%</div>
          </div>
        </div>

        {/* -------------------------------------------
            DISCOVERY HUB - PARTNER Grid
        ------------------------------------------- */}
        <div className={styles.discoveryHub}>
          <div className={styles.discHeader}>
            <div className={styles.discTitleArea}>
              <span className={styles.subLabel} style={{color: '#059669'}}>DISCOVERY HUB</span>
              <h2 className={styles.discTitle}>Find a Skill Partner</h2>
            </div>
            
            <div className={styles.discSearchArea}>
              <div className={styles.discSearchInput}>
                <span>🔍</span>
                <input type="text" placeholder="Search by skill or role..." />
              </div>
              <button className={styles.filterBtn}>
                <span>⚙️</span> <span className="hidden md:inline">Filters</span>
              </button>
            </div>
          </div>

          <div className={styles.partnerGrid}>
            {partners.map(partner => (
              <div key={partner.id} className={styles.partnerCard}>
                <div className={styles.partnerHeader}>
                  <div className={styles.partnerAvatarBox}>
                    <div className={styles.partnerAvatar}>{partner.avatar}</div>
                    <div className={styles.ratingBadge}>★ {partner.rating}</div>
                  </div>
                  <div className={styles.availabilityStatus}>
                    AVAILABLE NOW
                    <div className={`${styles.statusDot} ${styles.green}`}>✓</div>
                  </div>
                </div>

                <h3 className={styles.partnerName}>{partner.name}</h3>
                <p className={styles.partnerRole}>{partner.role}</p>

                <div className={styles.skillSection}>
                  <span className={styles.skillSectionLabel}>GIVING</span>
                  <div className={styles.skillsWrap}>
                    {partner.giving.map((skill, i) => (
                      <span key={i} className={`${styles.skillPill} ${styles.giving}`}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.skillSection}>
                  <span className={styles.skillSectionLabel}>SEEKING</span>
                  <div className={styles.skillsWrap}>
                    {partner.seeking.map((skill, i) => (
                      <span key={i} className={`${styles.skillPill} ${styles.seeking}`}>{skill}</span>
                    ))}
                  </div>
                </div>

                <button className={styles.requestBtn}>Request Swap</button>
              </div>
            ))}
          </div>
          
          <div className={styles.viewAllArea}>
            <Link href="#" className={styles.viewAllLink}>View All Partners &rarr;</Link>
          </div>
        </div>

        {/* -------------------------------------------
            PROMO BANNER
        ------------------------------------------- */}
        <div className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>Want to Swap with Industry Titans?</h2>
            <p className={styles.promoDesc}>
              Join the SkillNet Premium Tier and unlock access to vetted C-level mentors and high-stakes expertise exchange programs.
            </p>
            <div className={styles.promoActions}>
              <button className={styles.promoBtnPrimary}>Go Pro</button>
              <button className={styles.promoBtnSecondary}>Learn More</button>
            </div>
          </div>
          <div className={styles.promoIconBg}></div>
        </div>

      </main>

      {/* -------------------------------------------
          FOOTER
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
        <Link href="/catalog" className={styles.mobileBottomNavItem}>
          <span className={styles.mobileBottomNavIcon}>📚</span>
          Courses
        </Link>
        <Link href="/marketplace" className={`${styles.mobileBottomNavItem} ${styles.active}`}>
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
