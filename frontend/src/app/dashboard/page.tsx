'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  PlusSquare, 
  Settings, 
  LogOut,
  Star,
  TrendingUp,
  Briefcase,
  Building2,
  BarChart3
} from 'lucide-react';
import styles from './dashboard.module.css';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!session) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: {
            'Authorization': `Bearer ${(session as any).accessToken || ''}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    if (session) {
      fetchUserData();
    } else {
      // If no session after some time, could redirect to login
    }
  }, [session]);


  if (loading) return <div className={styles.dashboardRoot}><AppNav /></div>;

  const displayName = userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}` : 'SkillNet Expert';
  const displayHeadline = userData?.profile?.headline || 'Expertise Arbitrageur';
  const displayLevel = userData?.profile?.experienceLevel || 'Expert';

  return (
    <div className={styles.dashboardRoot}>
      <AppNav />

      <div className={`${styles.dashboardContainer} animate-fade-in`}>
        {/* DESKTOP SIDEBAR: Fixed and Architected */}
        <aside className={styles.sidebar}>
          <div className="reveal stagger">
            <div className={styles.hubLabel}>Professional Ledger</div>
            <div className={styles.hubTier}>{displayLevel} Tier</div>
            <div className={styles.sideLinks}>
              <Link href="/dashboard" className={`${styles.sideLink} ${styles.active}`}>
                <LayoutDashboard size={18} strokeWidth={2.5} /> Dashboard
              </Link>
              <Link href="/marketplace" className={styles.sideLink}>
                <ArrowLeftRight size={18} strokeWidth={2.5} /> Marketplace
              </Link>
              <Link href="/escrow" className={styles.sideLink}>
                <ShieldCheck size={18} strokeWidth={2.5} /> Swap Requests
              </Link>
              <Link href="/chats" className={styles.sideLink}>
                <MessageSquare size={18} strokeWidth={2.5} /> Messages
              </Link>
              <Link href="/catalog" className={styles.sideLink}>
                <BookOpen size={18} strokeWidth={2.5} /> Learning Hub
              </Link>
              <Link href="/create-listing" className={styles.sideLink}>
                <PlusSquare size={18} strokeWidth={2.5} /> Post Expert Skill
              </Link>
            </div>
          </div>

          <div className={`${styles.sidebarBottom} reveal`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.upgradeBox}>
              <div className={styles.upgradeTitle}>PREMIUM NETWORK</div>
              <div className={styles.upgradeText}>Unlock the Titan's exchange and C-level mentoring.</div>
              <Link href="/subscriptions"><button className={`${styles.upgradeBtn} click-scale`}>View Plans</button></Link>
            </div>
            <Link href="/settings" className={styles.sideLink}>
              <Settings size={18} strokeWidth={2.5} /> Settings
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.sideLink} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              <LogOut size={18} strokeWidth={2.5} /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN COMMAND CENTER */}
        <main className={styles.mainContent}>
          
          <div className={`${styles.welcomeSection} reveal`}>
            <div>
              <span className={styles.welcomeSubtitle}>SYSTEM OVERVIEW</span>
              <h1 className={styles.welcomeTitle}>Welcome, {displayName}.</h1>
              <p className={styles.welcomeText}>Your trust rating is in the Top 5%. 2 active swaps require your attention.</p>
            </div>
            <Link href="/marketplace" className={`${styles.ctaBtn} click-scale`}>
              Open Discovery Hub →
            </Link>
          </div>

          <div className={`${styles.statGrid} stagger`}>
            {/* Momentum Tracker */}
            <div className={`${styles.card} ${styles.momentumCard} reveal`}>
              <div className={styles.momentumHeader} style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem' }}>Learning Momentum</h3>
                  <span className={styles.swapRole}>Active Progress across 4 domains</span>
                </div>
                <div className={styles.swapBadge} style={{ background: '#d1fae5', color: '#065f46' }}>TOP 5%</div>
              </div>
              <div className={styles.progressList}>
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span>Advanced Architecture Patterns</span>
                    <span>82%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span>Quantitative Risk Arbitrage</span>
                    <span style={{ color: '#059669' }}>45%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={`${styles.progressBarFill}`} style={{ width: '45%', background: '#4ade80' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI: Ledger Hours */}
            <div className={`${styles.card} ${styles.kpiCard} reveal`}>
              <span className={styles.kpiTitle}>LEDGER HOURS</span>
              <span className={styles.kpiValue}>124.5</span>
              <span className={styles.kpiSubtext} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} /> +12% Efficiency
              </span>
            </div>

            {/* KPI: Trust Score */}
            <div className={`${styles.card} ${styles.kpiCard} reveal`}>
              <span className={styles.kpiTitle}>TRUST SCORE</span>
              <span className={styles.kpiValue}>998</span>
              <span className={styles.swapRole}>Near-perfect exchange record</span>
            </div>
          </div>

          {/* ACTIVE SWAPS */}
          <section className="reveal" style={{ animationDelay: '0.3s' }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Active Skill Exchanges</h2>
              <Link href="/escrow" className={styles.viewAllLink}>Manage Swaps</Link>
            </div>
            <div className={`${styles.swapsGrid} stagger`}>
              <div className={`${styles.card} ${styles.swapCard} reveal hover-lift`}>
                <div className={styles.swapHeader}>
                  <div className={styles.swapUser}>
                    <div className={styles.swapAvatar}>
                      <User size={20} color="white" />
                    </div>
                    <div>
                      <div className={styles.swapName}>Elena Vance</div>
                      <div className={styles.swapRole}>Senior Financial Architect</div>
                    </div>
                  </div>
                  <span className={`${styles.swapBadge} ${styles.swapBadgeBlue}`}>PROTOCOL ACTIVE</span>
                </div>
                <div className={styles.swapData}>
                  <div className={styles.swapCol}>
                    <span className={styles.swapLabel}>OFFERING</span>
                    <span className={styles.swapValue}>System Architecture</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>⇄</div>
                  <div className={styles.swapCol} style={{ textAlign: 'right' }}>
                    <span className={styles.swapLabel}>RECEIVING</span>
                    <span className={styles.swapValue} style={{ color: '#4ade80' }}>Risk Analysis</span>
                  </div>
                </div>
                <div className={styles.swapActions}>
                  <Link href="/chats" className={`${styles.btnSecondary} click-scale`}>Secure Inbox</Link>
                  <button className={`${styles.btnPrimary} click-scale`}>Release Milestone</button>
                </div>
              </div>

              <div className={`${styles.card} ${styles.swapCard} reveal hover-lift`}>
                <div className={styles.swapHeader}>
                  <div className={styles.swapUser}>
                    <div className={styles.swapAvatar}>
                      <User size={20} color="white" />
                    </div>
                    <div>
                      <div className={styles.swapName}>Marcus Chen</div>
                      <div className={styles.swapRole}>DevOps Lead</div>
                    </div>
                  </div>
                  <span className={`${styles.swapBadge} ${styles.swapBadgeGreen}`}>PENDING SIG</span>
                </div>
                <div className={styles.swapData}>
                  <div className={styles.swapCol}>
                    <span className={styles.swapLabel}>OFFERING</span>
                    <span className={styles.swapValue}>UI Systems</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>⇄</div>
                  <div className={styles.swapCol} style={{ textAlign: 'right' }}>
                    <span className={styles.swapLabel}>RECEIVING</span>
                    <span className={styles.swapValue} style={{ color: '#4ade80' }}>Kubernetes Core</span>
                  </div>
                </div>
                <div className={styles.swapActions}>
                  <button className={`${styles.btnSecondary} click-scale`}>Edit Contract</button>
                  <Link href="/escrow" className={`${styles.btnPrimary} click-scale`}>Sign Protocol</Link>
                </div>
              </div>
            </div>
          </section>

          {/* RECOMMENDED FOR YOU */}
          <section className="reveal" style={{ animationDelay: '0.4s', marginTop: '4rem' }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Priority Partner Matches</h2>
              <Link href="/catalog" className={styles.viewAllLink}>View All</Link>
            </div>
            <div className={`${styles.coursesGrid} stagger`}>
              {[
                { title: 'Global Executive Presence', tag: 'LEADERSHIP', icon: Briefcase, color: '#0c2b54', val: '$500/hr Equiv' },
                { title: 'Advanced Digital Modeling', tag: 'ARCHITECTURE', icon: Building2, color: '#1e293b', val: '$420/hr Equiv' },
                { title: 'Visualizing Complexity', tag: 'DATA SCIENCE', icon: BarChart3, color: '#334155', val: '$380/hr Equiv' }
              ].map((c, i) => (
                <div key={i} className={`${styles.courseCard} reveal hover-lift`}>
                  <div className={styles.courseVisual} style={{ background: c.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className={styles.courseTag}>{c.tag}</span>
                    <c.icon size={48} strokeWidth={1.5} opacity={0.8} />
                  </div>
                  <div className={styles.courseContent}>
                    <div className={styles.courseRating}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ marginRight: '4px' }} /> 
                      5.0 <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Verified)</span>
                    </div>
                    <h3 className={styles.courseTitle}>{c.title}</h3>
                    <div className={styles.courseFooter}>
                      <span className={styles.coursePrice} style={{ fontSize: '0.75rem', opacity: 0.6 }}>{c.val}</span>
                      <button className={`${styles.courseCart} click-scale`}>
                        <ArrowLeftRight size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
