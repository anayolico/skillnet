'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  ArrowLeftRight, 
  ShieldCheck, 
  MessageSquare, 
  User, 
  Home, 
  Search, 
  Bell, 
  Plus, 
  Sparkles,
  LogOut,
  Settings,
  PlusSquare,
  ChevronDown
} from 'lucide-react';
import { createClient } from '../src/utils/supabase/client';
import styles from './AppNav.module.css';


const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Learning', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Trust', icon: ShieldCheck },
  { href: '/chats', label: 'Inbox', icon: MessageSquare, notification: true },
  // { href: '/profile', label: 'Profile', icon: User },
];

const publicNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Learning', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Trust', icon: ShieldCheck },
];

interface AppNavProps {
  /** Optional – defaults to current pathname */
  activePage?: string;
  /** 'app' for logged-in users, 'public' for visitors */
  mode?: 'app' | 'public';
}

export default function AppNav({ activePage, mode = 'app' }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const active = activePage ?? pathname;
  const isApp = mode === 'app';
  const currentItems = isApp ? appNavItems : publicNavItems;
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* -------- MOBILE: sticky top bar -------- */}
      <header className={styles.mobileTopBar}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoShield} />
          SkillNet
        </Link>
        <div className={styles.mobileTopActions}>
          {isApp ? (
            <>
              <Link href="/chats" className={styles.iconBtn} aria-label="Inbox">
                <MessageSquare size={20} strokeWidth={2.5} />
              </Link>
              <Link href="/create-listing" className={styles.iconBtn} aria-label="Post skill">
                <Plus size={20} strokeWidth={2.5} />
              </Link>
              
              <div className={styles.profileDropdownWrapper}>
                <button 
                  className={styles.avatarBtn} 
                  aria-label="Profile actions"
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                >
                  A
                </button>
                
                {isMobileProfileOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setIsMobileProfileOpen(false)} />
                    <div className={styles.profileDropdown}>
                      <div className={styles.dropdownHeader}>
                        <p className="font-bold">Account</p>
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
        {currentItems.map(({ href, label, icon: Icon, notification }: any) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navItem} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href)) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>
              <Icon size={20} strokeWidth={2.5} />
              {notification && <span className={styles.notificationDot} />}
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
      <nav className={styles.desktopNav} aria-label="Desktop navigation">
        {/* Left: Logo + Links */}
        <div className={styles.desktopLeft}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoShield} />
            SkillNet
          </Link>
          <div className={styles.desktopLinks}>
            {currentItems.map(({ href, label, icon: Icon, notification }: any) => (
              <Link
                key={href}
                href={href}
                className={`${styles.desktopLink} ${active === href || (href !== '/' && href !== '/dashboard' && active.startsWith(href)) ? styles.active : ''}`}
              >
                <span className={styles.desktopLinkIcon}>
                  <Icon size={18} strokeWidth={2.5} />
                  {notification && <span className={styles.notificationDot} />}
                </span>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Search (Hidden in Public) */}
        {isApp && (
          <div className={styles.desktopCenter}>
            <div className={styles.searchBar}>
              <Search size={16} strokeWidth={2.5} color="#94a3b8" />
              <input type="text" placeholder="Search skills, partners…" />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className={styles.desktopRight}>
          {isApp ? (
            <>
              <Link href="/create-listing" className={styles.postBtn}>
                <Plus size={16} strokeWidth={3} /> Post a Skill
              </Link>
              <Link href="/chats" className={styles.notifBtn} aria-label="Messages">
                <MessageSquare size={18} strokeWidth={2.5} />
              </Link>
              <button className={styles.notifBtn} aria-label="Notifications">
                <Bell size={18} strokeWidth={2.5} />
              </button>
              <div className={styles.profileDropdownWrapper}>
                <button 
                  className={styles.avatarDesktop} 
                  aria-label="Profile actions"
                  onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
                >
                  A
                </button>
                
                {isDesktopProfileOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setIsDesktopProfileOpen(false)} />
                    <div className={styles.profileDropdown}>
                      <div className={styles.dropdownHeader}>
                        <p className="font-bold">Account</p>
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
              <Link href="/join" className={styles.postBtn}>
                Join Network
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
