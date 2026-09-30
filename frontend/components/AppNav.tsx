import { getApiUrl, getWsUrl } from '@/src/utils/config';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  MessageSquare,
  User,
  Sparkles,
  LogOut,
  Settings,
  PlusSquare,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from './Toast';
import styles from './AppNav.module.css';

type NavItem = {
  href: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  type?: 'swaps' | 'messages';
};

const appNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', mobileLabel: 'Home', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Marketplace', mobileLabel: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Swap Requests', mobileLabel: 'Swaps', icon: ShieldCheck, type: 'swaps' },
  { href: '/chats', label: 'Messages', mobileLabel: 'Messages', icon: MessageSquare, type: 'messages' },
  { href: '/create-listing', label: 'Post Expert Skill', mobileLabel: 'Post', icon: PlusSquare },
];

const publicNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', mobileLabel: 'Home', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Marketplace', mobileLabel: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Swap Requests', mobileLabel: 'Swaps', icon: ShieldCheck },
];

interface AppNavProps {
  activePage?: string;
  mode?: 'app' | 'public';
}

export default function AppNav({ activePage, mode = 'app' }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [counts, setCounts] = useState({ swapRequests: 0, messages: 0 });
  const { showToast } = useToast();
  const active = activePage ?? pathname;
  const isApp = mode === 'app';
  const currentItems = isApp ? appNavItems : publicNavItems;

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/notifications/counts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.counts) {
        console.log('[AppNav] Notifications updated:', data.counts);
        setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to fetch counts', err);
    }
  };

  const markSwapsViewed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      

      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/notifications/mark-swaps-viewed`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCounts(prev => ({ ...prev, swapRequests: 0 }));
    } catch { }
  };

  useEffect(() => {
    if (isApp) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 15000); // Slower polling as fallback

      // Setup Real-time Notifications via WebSocket
      let socket: WebSocket | null = null;

      async function setupWS() {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Need our DB userId
        const apiUrl = getApiUrl();
        const meRes = await fetch(`${apiUrl}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (!meData.success) return;

        const baseWsUrl = getWsUrl();
        const wsUrl = getWsUrl();

        console.log('[AppNav] Connecting to WebSocket:', wsUrl);
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('[AppNav] WebSocket Connected');
          socket?.send(JSON.stringify({ type: 'subscribe', userId: meData.user.id }));
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'notification') {
              fetchCounts();

              if (msg.subType === 'swap_request_received') {
                showToast('New swap request received!', 'info');
              } else if (msg.subType === 'swap_request_sent') {
                showToast('Swap request sent successfully!', 'success');
              }

              window.dispatchEvent(new CustomEvent('new-notification', { detail: msg }));
            }
          } catch (err) {
            console.error('[ws] Message error:', err);
          }
        };

        socket.onclose = () => {
          // Attempt reconnect after delay
          setTimeout(setupWS, 5000);
        };
      }

      setupWS();

      return () => {
        clearInterval(interval);
        socket?.close();
      };
    }
  }, [isApp, showToast]);

  useEffect(() => {
    if (pathname === '/escrow') {
      markSwapsViewed();
    }
  }, [pathname]);

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  const renderBadge = (type: string) => {
    const rawCount = type === 'swaps' ? counts.swapRequests : counts.messages;
    const count = Number(rawCount) || 0;
    if (count > 0) {
      return <span className={styles.countBadge} key={type}>{count > 9 ? '9+' : count}</span>;
    }
    return null;
  };

  if (isLoading) return null;

  return (
    <>
      {/* -------- MOBILE: sticky top bar -------- */}
      <header className={styles.mobileTopBar}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoShield} />
          SkillNet
        </Link>
        <div className={styles.mobileTopActions}>
          {(isApp || user) ? (
            <>
              {isApp && (
                <Link href="/chats" className={styles.iconBtn} aria-label="Inbox">
                  <MessageSquare size={20} strokeWidth={2.5} />
                </Link>
              )}


              <div className={styles.profileDropdownWrapper}>
                <button
                  className={styles.avatarBtn}
                  aria-label="Profile actions"
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                >
                  {user?.firstName?.[0] || user?.email?.[0] || 'A'}
                </button>

                {isMobileProfileOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setIsMobileProfileOpen(false)} />
                    <div className={styles.profileDropdown}>
                      <div className={styles.dropdownHeader}>
                        <p className="font-bold">{user?.firstName || user?.email || 'Account'}</p>
                      </div>
                      <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsMobileProfileOpen(false)}>
                        <User size={18} /> Profile
                      </Link>
                      <Link href="/settings" className={styles.dropdownItem} onClick={() => setIsMobileProfileOpen(false)}>
                        <Settings size={18} /> Settings
                      </Link>
                      <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={() => { setIsMobileProfileOpen(false); handleLogout(); }}>
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.postBtn} style={{ padding: '0.4rem 1rem' }}>Login</Link>
          )}
        </div>
      </header>

      {/* -------- MOBILE: fixed bottom bar -------- */}
      <nav
        className={styles.mobileBottomNav}
        aria-label="Mobile navigation"
        style={{ gridTemplateColumns: `repeat(${currentItems.length + (!isApp ? 1 : 0)}, minmax(0, 1fr))` }}
      >
        {currentItems.map(({ href, label, mobileLabel, icon: Icon, type }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href)) ? styles.active : ''}`}
            aria-label={label}
          >
            <span className={styles.navIcon}>
              <Icon size={20} strokeWidth={2.5} />
              {type && renderBadge(type)}
            </span>
            <span className={styles.navLabel}>{mobileLabel ?? label}</span>
          </Link>
        ))}
        {!isApp && (
          <Link href="/join" className={styles.navItem} aria-label="Join Network">
            <span className={styles.navIcon}>
              <Sparkles size={20} strokeWidth={2.5} />
            </span>
            <span className={styles.navLabel}>Join</span>
          </Link>
        )}
      </nav>

      {/* -------- DESKTOP -------- */}
      {isApp ? (
        /* -------- DESKTOP: App Sidebar (Vertical) -------- */
        <aside className={`${styles.desktopNav} ${styles.desktopAppNav}`} aria-label="App sidebar navigation">
          <div className="reveal stagger">
            <div className={styles.hubLabel}>Professional Ledger</div>
            <div className={styles.hubTier}>
              {user?.subscriptionTier ? user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1) : 'Essential'} Tier
              {user?.subscriptionTier !== 'professional' ? (
                <Link href="/subscriptions" className={styles.freeBadge}>FREE</Link>
              ) : (
                <span className={styles.proBadge}>PRO</span>
              )}
            </div>

            <div className={styles.sideLinks}>
              {currentItems.map(({ href, label, icon: Icon, type }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.sideLink} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href))
                      ? styles.active
                      : ''
                    }`}
                >
                  <Icon size={18} strokeWidth={2.5} />
                  <span>{label}</span>
                  {type && renderBadge(type)}
                </Link>
              ))}
            </div>
          </div>

          <div className={`${styles.sidebarBottom} reveal`} style={{ animationDelay: '0.4s' }}>
            <div className={styles.upgradeBox}>
              <div className={styles.upgradeTitle}>PREMIUM NETWORK</div>
              <div className={styles.upgradeText}>Unlock the Titan&apos;s exchange and C-level mentoring.</div>
              <Link href="/subscriptions">
                <button className={`${styles.upgradeBtn} click-scale`}>View Plans</button>
              </Link>
            </div>

            <Link href="/settings" className={styles.sideLink}>
              <Settings size={18} strokeWidth={2.5} /> <span>Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className={styles.sideLink}
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
            >
              <LogOut size={18} strokeWidth={2.5} /> <span>Logout</span>
            </button>
          </div>
        </aside>
      ) : (
        /* -------- DESKTOP: Public Top Nav (Horizontal) -------- */
        <nav className={`${styles.desktopNav} ${styles.desktopPublicNav}`} aria-label="Public desktop navigation">
          <div className={styles.desktopLeft}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoShield} />
              SkillNet
            </Link>
            <div className={styles.desktopLinks}>
              {currentItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.desktopLink} ${active === href || (href !== '/' && active.startsWith(href)) ? styles.active : ''}`}
                >
                  <span className={styles.desktopLinkIcon}>
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.desktopRight}>
            {user ? (
              <div className={styles.profileDropdownWrapper}>
                <button
                  className={styles.avatarDesktop}
                  aria-label="View Profile"
                  onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
                >
                  {user.firstName?.[0] || user.email?.[0] || 'A'}
                </button>

                {isDesktopProfileOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setIsDesktopProfileOpen(false)} />
                    <div className={`${styles.profileDropdown} ${styles.desktopDropdown}`}>
                      <div className={styles.dropdownHeader}>
                        <p className="font-bold">{user.firstName || user.email || 'Account'}</p>
                      </div>
                      <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsDesktopProfileOpen(false)}>
                        <User size={18} /> Profile
                      </Link>
                      <Link href="/settings" className={styles.dropdownItem} onClick={() => setIsDesktopProfileOpen(false)}>
                        <Settings size={18} /> Settings
                      </Link>
                      <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={() => { setIsDesktopProfileOpen(false); handleLogout(); }}>
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.desktopLink}>Login</Link>
                <Link href="/join" className={styles.postBtn}>Join Network</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
