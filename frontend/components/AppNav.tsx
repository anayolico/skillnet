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
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from './Toast';
import BrandLogo from './BrandLogo';
import { getApiUrl, getWsUrl } from '@/src/utils/config';
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
  { href: '/create-listing', label: 'Post Skill Offer', mobileLabel: 'Post', icon: PlusSquare },
];

const desktopAppNavItems: NavItem[] = [
  ...appNavItems,
  { href: '/subscriptions', label: 'Subscription', mobileLabel: 'Plan', icon: CreditCard },
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
  const isPro = user?.subscriptionTier === 'professional';

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/notifications/counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.counts) {
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setCounts((prev) => ({ ...prev, swapRequests: 0 }));
    } catch {}
  };

  useEffect(() => {
    if (isApp) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 15000);

      let socket: WebSocket | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let unmounted = false;

      async function setupWS() {
        if (unmounted) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const apiUrl = getApiUrl();
          const meRes = await fetch(`${apiUrl}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const meData = await meRes.json();
          if (!meData.success || unmounted) return;

          const wsUrl = getWsUrl();
          socket = new WebSocket(wsUrl);

          socket.onopen = () => {
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
            if (!unmounted) {
              reconnectTimer = setTimeout(setupWS, 5000);
            }
          };
        } catch {}
      }

      setupWS();

      return () => {
        unmounted = true;
        clearInterval(interval);
        if (reconnectTimer) clearTimeout(reconnectTimer);
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
      return (
        <span className={styles.countBadge} key={type}>
          {count > 9 ? '9+' : count}
        </span>
      );
    }
    return null;
  };

  if (isLoading) return null;

  return (
    <>
      {/* MOBILE: sticky top bar */}
      <header className={styles.mobileTopBar}>
        <Link href="/" className={styles.logo} aria-label="SkillNet Home">
          <BrandLogo variant="dark" size="sm" />
        </Link>
        <div className={styles.mobileTopActions}>
          {isApp || user ? (
            <>
              {isApp && (
                <Link href="/chats" className={styles.iconBtn} aria-label="Messages">
                  <MessageSquare size={18} strokeWidth={2} />
                </Link>
              )}

              <div className={styles.profileDropdownWrapper}>
                <button
                  className={styles.avatarBtn}
                  aria-label="Profile actions"
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                >
                  {(user?.firstName?.[0] || user?.email?.[0] || 'S').toUpperCase()}
                </button>

                {isMobileProfileOpen && (
                  <>
                    <div
                      className={styles.dropdownOverlay}
                      onClick={() => setIsMobileProfileOpen(false)}
                    />
                    <div className={styles.profileDropdown}>
                      <div className={styles.dropdownHeader}>
                        <p>{user?.firstName || user?.email || 'Account'}</p>
                        <span className={styles.dropdownTier}>
                          {isPro ? 'Professional' : 'Essential · Free'}
                        </span>
                      </div>
                      <Link
                        href="/profile"
                        className={styles.dropdownItem}
                        onClick={() => setIsMobileProfileOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link
                        href="/subscriptions"
                        className={styles.dropdownItem}
                        onClick={() => setIsMobileProfileOpen(false)}
                      >
                        <CreditCard size={16} /> Subscription
                      </Link>
                      <Link
                        href="/settings"
                        className={styles.dropdownItem}
                        onClick={() => setIsMobileProfileOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      <button
                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                        onClick={() => {
                          setIsMobileProfileOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className={styles.postBtn} style={{ padding: '0.45rem 1rem' }}>
              Log in
            </Link>
          )}
        </div>
      </header>

      {/* MOBILE: fixed bottom bar */}
      <nav
        className={styles.mobileBottomNav}
        aria-label="Mobile navigation"
        style={{
          gridTemplateColumns: `repeat(${currentItems.length + (!isApp ? 1 : 0)}, minmax(0, 1fr))`,
        }}
      >
        {currentItems.map(({ href, label, mobileLabel, icon: Icon, type }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${
              active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href))
                ? styles.active
                : ''
            }`}
            aria-label={label}
          >
            <span className={styles.navIcon}>
              <Icon size={19} strokeWidth={2} />
              {type && renderBadge(type)}
            </span>
            <span className={styles.navLabel}>{mobileLabel ?? label}</span>
          </Link>
        ))}
        {!isApp && (
          <Link href="/join" className={styles.navItem} aria-label="Start Swapping">
            <span className={styles.navIcon}>
              <Sparkles size={19} strokeWidth={2} />
            </span>
            <span className={styles.navLabel}>Join</span>
          </Link>
        )}
      </nav>

      {/* DESKTOP */}
      {isApp ? (
        <aside
          className={`${styles.desktopNav} ${styles.desktopAppNav}`}
          aria-label="App sidebar navigation"
        >
          <div className={styles.sidebarTop}>
            <div className={styles.sidebarHeader}>
              <Link href="/" className={styles.sidebarBrand} aria-label="SkillNet Home">
                <BrandLogo variant="dark" size="sm" />
              </Link>

              <Link href="/subscriptions" className={styles.tierLine}>
                <span className={`${styles.tierDot} ${isPro ? styles.tierDotPro : ''}`} />
                <span className={styles.tierName}>{isPro ? 'Professional' : 'Essential'}</span>
                {!isPro && <span className={styles.tierFreeTag}>Free</span>}
              </Link>
            </div>

            <div className={styles.sideLinks}>
              {desktopAppNavItems.map(({ href, label, icon: Icon, type }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.sideLink} ${
                    active === href ||
                    (href !== '/' && href !== '/dashboard' && active.startsWith(href))
                      ? styles.active
                      : ''
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{label}</span>
                  {type && renderBadge(type)}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.sidebarBottom}>
            <div className={styles.bottomActions}>
              <Link
                href="/profile"
                className={`${styles.sideLink} ${active.startsWith('/profile') ? styles.active : ''}`}
              >
                <User size={18} strokeWidth={2} /> <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className={`${styles.sideLink} ${active === '/settings' ? styles.active : ''}`}
              >
                <Settings size={18} strokeWidth={2} /> <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className={`${styles.sideLink} ${styles.logoutSideBtn}`}>
                <LogOut size={18} strokeWidth={2} /> <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      ) : (
        <nav
          className={`${styles.desktopNav} ${styles.desktopPublicNav}`}
          aria-label="Public desktop navigation"
        >
          <div className={styles.desktopLeft}>
            <Link href="/" className={styles.logo} aria-label="SkillNet Home">
              <BrandLogo variant="dark" size="md" />
            </Link>
            <div className={styles.desktopLinks}>
              {currentItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.desktopLink} ${
                    active === href || (href !== '/' && active.startsWith(href)) ? styles.active : ''
                  }`}
                >
                  <span className={styles.desktopLinkIcon}>
                    <Icon size={17} strokeWidth={2} />
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
                  {(user.firstName?.[0] || user.email?.[0] || 'S').toUpperCase()}
                </button>

                {isDesktopProfileOpen && (
                  <>
                    <div
                      className={styles.dropdownOverlay}
                      onClick={() => setIsDesktopProfileOpen(false)}
                    />
                    <div className={`${styles.profileDropdown} ${styles.desktopDropdown}`}>
                      <div className={styles.dropdownHeader}>
                        <p>{user.firstName || user.email || 'Account'}</p>
                      </div>
                      <Link
                        href="/profile"
                        className={styles.dropdownItem}
                        onClick={() => setIsDesktopProfileOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link
                        href="/subscriptions"
                        className={styles.dropdownItem}
                        onClick={() => setIsDesktopProfileOpen(false)}
                      >
                        <CreditCard size={16} /> Subscription
                      </Link>
                      <Link
                        href="/settings"
                        className={styles.dropdownItem}
                        onClick={() => setIsDesktopProfileOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      <button
                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                        onClick={() => {
                          setIsDesktopProfileOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.desktopLink}>
                  Log in
                </Link>
                <Link href="/join" className={styles.postBtn}>
                  Start Swapping
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
