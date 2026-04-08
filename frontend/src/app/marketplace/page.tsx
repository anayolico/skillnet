'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Footer from '../../../components/Footer';
import styles from './marketplace.module.css';

export default function Marketplace() {
  const partners = [
    { id: 1, name: 'Marcus Chen', role: 'Senior Product Manager', rating: '4.9', avatar: '👨🏻‍💻', giving: ['Agile Strategy', 'Roadmapping'], seeking: ['Data Visualization', 'D3.js'] },
    { id: 2, name: 'Elena Rodriguez', role: 'Full Stack Developer', rating: '5.0', avatar: '👩🏽‍💻', giving: ['React/Node.js', 'AWS Arch'], seeking: ['Public Speaking', 'Copywriting'] },
    { id: 3, name: 'Alex Sterling', role: 'UX Design Director', rating: '4.8', avatar: '🧑🏼‍💼', giving: ['Design Systems', 'UX Research'], seeking: ['Financial Analysis', 'Excel Expert'] },
  ];

  return (
    <div className={styles.marketRoot}>
      <AppNav />

      <main className={`${styles.container} reveal`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <span className={`${styles.subLabel} reveal`}>PEER-TO-PEER NETWORK</span>
            <h1 className={`${styles.heroTitle} reveal`} style={{animationDelay: '0.1s'}}>
              Swap your Mastery <br/> for their <span>Genius.</span>
            </h1>
            <p className={`${styles.heroDesc} reveal`} style={{animationDelay: '0.2s'}}>
              SkillNet Marketplace is where professional growth transcends currency. Exchange your expertise in high-level domains for the skills you need to scale your impact.
            </p>
            <div className={`${styles.heroButtons} reveal stagger`} style={{animationDelay: '0.3s'}}>
              <button className={`${styles.btnPrimary} click-scale`}>Find a Partner</button>
              <Link href="/escrow" className={`${styles.btnSecondary} click-scale`}>How it Works</Link>
            </div>

            <div className={`${styles.activeSwapsMobile} reveal`} style={{animationDelay: '0.4s'}}>
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

            <div className={`${styles.mobileEscrowCard} reveal-in`} style={{animationDelay: '0.5s'}}>
              <div className={styles.escrowLabel}>
                <span>🛡️</span> ESCROW TRUST PROTOCOL
              </div>
              <h3 className={styles.escrowTitle}>Swap with Peace of Mind</h3>
              <p className={styles.escrowDesc}>
                Our unique session security holds "Skill-Credits" in escrow. You only release them once the learning session is confirmed successful by both partners.
              </p>
              <Link href="/escrow"><button className={`${styles.escrowBtn} click-scale`}>Learn How it Works</button></Link>
            </div>
          </div>

          <div className={`${styles.heroRight} reveal-in`} style={{animationDelay: '0.3s'}}>
            <div className={`${styles.floatingWidget} animate-float`}>
              <div className={styles.floatingWidgetIcon}>💎</div>
              <div className={styles.floatingWidgetText}>
                <span>LATEST SWAP</span>
                <strong>Python Dev for UI Design</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.howItWorks} reveal stagger`} style={{animationDelay: '0.5s'}}>
          <div className="reveal">
            <div className={styles.stepNumber}>01.</div>
            <h4 className={styles.stepTitle}>Identify Your Edge</h4>
            <p className={styles.stepDesc}>List the core competencies you've mastered.</p>
          </div>
          <div className="reveal">
            <div className={styles.stepNumber}>02.</div>
            <h4 className={styles.stepTitle}>Bridge the Gap</h4>
            <p className={styles.stepDesc}>Browse for partners whose "Giving" skills align with your "Seeking" requirements.</p>
          </div>
          <div className="reveal">
            <div className={styles.stepNumber}>03.</div>
            <h4 className={styles.stepTitle}>Formalize the Swap</h4>
            <p className={styles.stepDesc}>Initiate a secure exchange proposal with equitable time-value balance for both masters.</p>
          </div>
        </div>

        <div className={`${styles.statsRow} stagger`} style={{animationDelay: '0.6s'}}>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Total Swaps</span><div className={styles.statValue}>1,284</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Active Pairs</span><div className={`${styles.statValue} ${styles.green}`}>412</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Expertise Domains</span><div className={styles.statValue}>54</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Success Rate</span><div className={`${styles.statValue} ${styles.green}`}>98.2%</div></div>
        </div>

        <div className={`${styles.discoveryHub} reveal`} style={{animationDelay: '0.7s'}}>
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
              <button className={`${styles.filterBtn} click-scale`}><span>⚙️</span> Filters</button>
            </div>
          </div>

          <div className={`${styles.partnerGrid} stagger`}>
            {partners.map(partner => (
              <div key={partner.id} className={`${styles.partnerCard} reveal hover-lift`}>
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
                    {partner.giving.map((skill, i) => (<span key={i} className={`${styles.skillPill} ${styles.giving}`}>{skill}</span>))}
                  </div>
                </div>
                <div className={styles.skillSection}>
                  <span className={styles.skillSectionLabel}>SEEKING</span>
                  <div className={styles.skillsWrap}>
                    {partner.seeking.map((skill, i) => (<span key={i} className={`${styles.skillPill} ${styles.seeking}`}>{skill}</span>))}
                  </div>
                </div>
                <Link href="/messages"><button className={`${styles.requestBtn} click-scale`}>Request Swap</button></Link>
              </div>
            ))}
          </div>
          <div className={styles.viewAllArea}>
            <Link href="/profile" className={styles.viewAllLink}>View All Partners &rarr;</Link>
          </div>
        </div>

        <div className={`${styles.promoBanner} reveal-in`}>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>Want to Swap with Industry Titans?</h2>
            <p className={styles.promoDesc}>Join the SkillNet Premium Tier and unlock access to vetted C-level mentors.</p>
            <div className={styles.promoActions}>
              <Link href="/subscriptions"><button className={`${styles.promoBtnPrimary} click-scale`}>Go Pro</button></Link>
              <Link href="/escrow"><button className={`${styles.promoBtnSecondary} click-scale`}>Learn More</button></Link>
            </div>
          </div>
          <div className={styles.promoIconBg}></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
