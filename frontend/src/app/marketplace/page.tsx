'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '@/components/AppNav';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Search,
  Settings,
  Star,
  User,
  ArrowLeftRight,
  Diamond,
  ChevronRight,
  X,
  Frown
} from 'lucide-react';
import styles from './marketplace.module.css';
import { useMarketplace } from '../../utils/useMarketplace';
import { DEFAULT_SKILLS } from '../../utils/skills';

export default function Marketplace() {
  const {
    listings,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    loadMore,
    hasMore,
    requestSwap
  } = useMarketplace();

  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);
  const [swapMessage, setSwapMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // We are treating "partners" returned from backend as the listings basically, 
  // though the user might not have a separate listing ID if we just requested their profile. 
  // Wait, the prompt implies "requestSwap" takes a listingId. Let's assume for now 
  // we pass profile.user.id or we need to fetch listings. The plan said:
  // GET /api/marketplace/partners returns profiles for discovery hub
  // POST /api/marketplace/swap-requests takes { listingId, message }
  // Wait! The user is supposed to click "Request Swap" on a partner card, but in the backend, swap request is tied to a Listing.
  // The plan said: Discovery Hub uses `GET /api/marketplace/partners` which returns Profiles.
  // But swap requests need a `listingId`. If a user doesn't have a listing, how do we request a swap?
  // Let's assume we pass the requested user's ID as `listingId` conceptually, or the prompt has a slight disconnect. We'll use partner.id (the profile id or user id? we'll use partner.id) and trust the backend. Actually the API says `listingId`, so let's pass partner.id for now.
  // Oh, wait, the user's `listingId` might not be right if we fetch profiles. Let's just use `partner.id` and assume the backend accepts it or it's a simplification. To be safer, maybe the API should take the profile ID as the listing ID? Or the `partner` might actually have a `listing` inside it? Let's use `partner.id` and pass it to requestSwap.

  const handleSwapRequest = async () => {
    if (!selectedListingId) return;
    setIsSubmitting(true);
    // Ideally we would have a listing ID, but we only have partner data. Let's use partner.id.
    const success = await requestSwap(selectedListingId, swapMessage);
    setIsSubmitting(false);
    if (success) {
      alert('Swap request sent successfully!');
      setSelectedListingId(null);
      setSwapMessage('');
    }
  };

  return (
    <div className={styles.marketRoot}>
      <AppNav />

      <main className={`${styles.container} reveal`}>
        <div className={styles.heroGrid}>
          {/* <div className={styles.heroLeft}>
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
                <div className={styles.activeSwapAvatarBox}>
                   <User size={32} color="#0c2b54" strokeWidth={1.5} />
                </div>
                <div className={styles.activeSwapInfo}>
                  <p>Python for UI Design</p>
                  <span>Session scheduled for tomorrow</span>
                </div>
              </div>
            </div>

            <div className={`${styles.mobileEscrowCard} reveal-in`} style={{animationDelay: '0.5s'}}>
              <div className={styles.escrowLabel}>
                <ShieldCheck size={18} style={{ marginRight: '6px' }} /> ESCROW TRUST PROTOCOL
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
              <div className={styles.floatingWidgetIcon}>
                <Diamond size={24} fill="#fbbf24" color="#fbbf24" strokeWidth={1} />
              </div>
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
          </div>*/}
        </div>

        {/* --- NEW ACTIVE HERO/HEADER --- */}
        <section className={styles.activeHero}>
          <div className={styles.activeHeroContent}>
            <span className={styles.premiumTag}>Professional Exchange</span>
            <h1>The Global Talent <br/><span>Liquidity Layer.</span></h1>
            <p>Exchange high-fidelity expertise with verified professionals. No currency, just pure intellectual arbitrage.</p>
          </div>
          <div className={styles.activeHeroStats}>
            <div className={styles.miniStat}>
              <strong>1.2k+</strong>
              <span>Verified Masters</span>
            </div>
            <div className={styles.miniStat}>
              <strong>98%</strong>
              <span>Swap Success</span>
            </div>
          </div>
        </section>

        <div className={`${styles.statsRow} stagger`} style={{ animationDelay: '0.6s' }}>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Total Swaps</span><div className={styles.statValue}>{stats?.completedSwaps ?? 0}</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Active Pairs</span><div className={`${styles.statValue} ${styles.green}`}>{stats?.activeSwaps ?? 0}</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Expertise Domains</span><div className={styles.statValue}>{stats?.uniqueSkillDomains ?? 0}</div></div>
          <div className={`${styles.statCard} reveal`}><span className={styles.statLabel}>Success Rate</span><div className={`${styles.statValue} ${styles.green}`}>{Math.round((stats?.successRate ?? 1) * 100)}%</div></div>
        </div>

        <div className={`${styles.discoveryHub} reveal`} style={{ animationDelay: '0.7s' }}>
          <div className={styles.discHeader}>
            <div className={styles.discTitleArea}>
              <span className={styles.subLabel} style={{ color: '#059669' }}>DISCOVERY HUB</span>
              <h2 className={styles.discTitle}>Find a Skill Partner</h2>
            </div>
            <div className={styles.discSearchArea} style={{ position: 'relative' }}>
              <div className={styles.discSearchInput}>
                <Search size={18} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search by skill or role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className={`${styles.filterBtn} click-scale`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Settings size={16} /> Filters
              </button>

              {showFilters && (
                <div className={styles.filterPanel}>
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Category</label>
                    <select 
                      className={styles.filterSelect}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {DEFAULT_SKILLS.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`${styles.partnerGrid} stagger`}>
            {loading && listings.length === 0 ? (
               Array.from({ length: 3 }).map((_, idx) => (
                 <div key={idx} className={styles.skeletonCard}>
                    <div className={styles.skeletonHeader}>
                      <div className={styles.skeletonAvatar}></div>
                    </div>
                    <div className={styles.skeletonBlock}></div>
                    <div className={`${styles.skeletonBlock} ${styles.short}`}></div>
                 </div>
               ))
            ) : listings.length === 0 ? (
               <div className={styles.emptyState}>
                 <Frown size={48} className={styles.emptyStateIcon} />
                 <h3>No active listings found</h3>
                 <p>Try adjusting your search or be the first to post a skill offer!</p>
               </div>
            ) : (
              listings.map(listing => (
                <div key={listing.id} className={`${styles.partnerCard} reveal hover-lift`}>
                  <div className={styles.partnerHeader}>
                    <div className={styles.partnerAvatarBox}>
                      <div className={styles.partnerAvatar}>
                        <div className={styles.avatarInner}>
                          {listing.user.imageUrl ? (
                            <img src={listing.user.imageUrl} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '12px'}} />
                          ) : (
                            <User size={28} strokeWidth={1.5} color="#0c2b54" />
                          )}
                        </div>
                      </div>
                      <div className={styles.ratingBadge}>
                        <Star size={12} fill="white" color="white" /> 5.0
                      </div>
                    </div>
                    <div className={styles.availabilityStatus}>
                      {listing.timeValue || '1 Hour Session'}
                      <div className={`${styles.statusDot} ${styles.green}`}>✓</div>
                    </div>
                  </div>
                  <h3 className={styles.partnerName}>{listing.title}</h3>
                  <p className={styles.partnerRole}>By {listing.user.firstName} {listing.user.lastName} • {listing.sessionFormat}</p>
                  
                  <div className={styles.skillSection}>
                    <span className={styles.skillSectionLabel}>OFFERING</span>
                    <div className={styles.skillsWrap}>
                      {listing.skillsOffered.map((skill, i) => (<span key={i} className={`${styles.skillPill} ${styles.giving}`}>{skill}</span>))}
                    </div>
                  </div>
                  <div className={styles.skillSection}>
                    <span className={styles.skillSectionLabel}>SEEKING</span>
                    <div className={styles.skillsWrap}>
                      {listing.skillsSought.map((skill, i) => (<span key={i} className={`${styles.skillPill} ${styles.seeking}`}>{skill}</span>))}
                    </div>
                  </div>
                  <button 
                    className={`${styles.requestBtn} click-scale`}
                    onClick={() => setSelectedListingId(listing.id)}
                  >
                    Request Swap
                  </button>
                </div>
              ))
            )}
          </div>
          
          {hasMore && listings.length > 0 && (
            <div className={styles.viewAllArea}>
              <button className={styles.loadMoreBtn} onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
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

      {selectedListingId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={() => setSelectedListingId(null)}>
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>Request a Swap</h2>
            <p className={styles.modalDesc}>Send a message to initiate a learning exchange. Be clear about what you can offer and what you are looking to learn.</p>
            
            <textarea 
              className={styles.textarea}
              placeholder="Hi! I saw you are looking for UI/UX Design and you have Python experience. I'd love to swap with you..."
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
            />
            
            <button 
              className={styles.sendBtn}
              onClick={handleSwapRequest}
              disabled={isSubmitting || !swapMessage.trim()}
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
