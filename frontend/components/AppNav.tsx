'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  ArrowLeftRight, 
  ShieldCheck, 
  MessageSquare, 
  User, 
  Search, 
  Bell, 
  Plus, 
  Sparkles,
  LogOut,
  Settings,
  PlusSquare,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from './Toast';
import styles from './AppNav.module.css';

const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Learning', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Swap Requests', icon: ShieldCheck, type: 'swaps' },
  { href: '/chats', label: 'Inbox', icon: MessageSquare, type: 'messages' },
];

const publicNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Learning', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Swap Requests', icon: ShieldCheck },
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

      const getApiUrl = () => {
        if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
        if (typeof window !== 'undefined') {
          return `${window.location.protocol}//${window.location.hostname}:3001`;
        }
        return 'http://localhost:3001';
      };

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
      const getApiUrl = () => {
        if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
        if (typeof window !== 'undefined') {
          return `${window.location.protocol}//${window.location.hostname}:3001`;
        }
        return 'http://localhost:3001';
      };

      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/api/notifications/mark-swaps-viewed`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCounts(prev => ({ ...prev, swapRequests: 0 }));
    } catch (err) {}
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const meRes = await fetch(`${apiUrl}/api/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (!meData.success) return;

        const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:3001` : 'ws://localhost:3001');
        const wsUrl = baseWsUrl.replace('http:', 'ws:').replace('https:', 'wss:');
        
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
  }, [isApp]);

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
      <nav className={styles.mobileBottomNav} aria-label="Mobile navigation">
        {currentItems.map(({ href, label, icon: Icon, type }: any) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href)) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>
              <Icon size={20} strokeWidth={2.5} />
              {type && renderBadge(type)}
            </span>
            {label}
          </Link>
        ))}
        {!isApp && (
          <Link href="/join" className={styles.navItem}>
            <span className={styles.navIcon}>
              <Sparkles size={20} strokeWidth={2.5} />
            </span>
            Join
          </Link>
        )}
      </nav>

      {/* -------- DESKTOP: sticky top bar -------- */}
      <nav className={`${styles.desktopNav} ${isApp ? styles.desktopAppNav : styles.desktopPublicNav}`} aria-label="Desktop navigation">
        <div className={styles.desktopLeft}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoShield} />
            SkillNet
          </Link>
          <div className={styles.desktopLinks}>
            {currentItems.map(({ href, label, icon: Icon, type }: any) => (
              <Link
                key={href}
                href={href}
                className={`${styles.desktopLink} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href)) ? styles.active : ''}`}
              >
                <span className={styles.desktopLinkIcon}>
                  <Icon size={18} strokeWidth={2.5} />
                  {type && renderBadge(type)}
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {isApp && pathname === '/marketplace' && (
          <div className={styles.desktopCenter}>
            <div className={styles.searchBar}>
              <Search size={16} strokeWidth={2.5} color="#94a3b8" />
              <input type="text" placeholder="Search skills, partners…" />
            </div>
          </div>
        )}

        <div className={styles.desktopRight}>
          {(isApp || user) ? (
            <>
              {isApp && (
                <Link href="/chats" className={styles.notifBtn} aria-label="Messages">
                  <MessageSquare size={18} strokeWidth={2.5} />
                </Link>
              )}
              <div className={styles.profileDropdownWrapper}>
                <button 
                  className={styles.avatarDesktop} 
                  aria-label="View Profile"
                  onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
                >
                  {user?.firstName?.[0] || user?.email?.[0] || 'A'}
                </button>
                
                {isDesktopProfileOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setIsDesktopProfileOpen(false)} />
                    <div className={`${styles.profileDropdown} ${styles.desktopDropdown}`}>
                      <div className={styles.dropdownHeader}>
                        <p className="font-bold">{user?.firstName || user?.email || 'Account'}</p>
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
            </>
          ) : (
            <>
              <Link href="/login" className={styles.desktopLink}>Login</Link>
              <Link href="/join" className={styles.postBtn}>Join Network</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
