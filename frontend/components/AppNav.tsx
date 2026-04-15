'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  PlusSquare
} from 'lucide-react';
import styles from './AppNav.module.css';


const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalog', label: 'Learning', icon: BookOpen },
  { href: '/marketplace', label: 'Market', icon: ArrowLeftRight },
  { href: '/escrow', label: 'Trust', icon: ShieldCheck },
  { href: '/messages', label: 'Inbox', icon: MessageSquare, notification: true },
  { href: '/profile', label: 'Profile', icon: User },
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
  const active = activePage ?? pathname;
  const isApp = mode === 'app';
  const currentItems = isApp ? appNavItems : publicNavItems;

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
              <Link href="/messages" className={styles.iconBtn} aria-label="Inbox">
                <MessageSquare size={20} strokeWidth={2.5} />
              </Link>
              <Link href="/create-listing" className={styles.iconBtn} aria-label="Post skill">
                <Plus size={20} strokeWidth={2.5} />
              </Link>
              <Link href="/profile" className={styles.avatarBtn} aria-label="Profile">A</Link>
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
              <Link href="/messages" className={styles.notifBtn} aria-label="Messages">
                <MessageSquare size={18} strokeWidth={2.5} />
              </Link>
              <button className={styles.notifBtn} aria-label="Notifications">
                <Bell size={18} strokeWidth={2.5} />
              </button>
              <Link href="/profile" className={styles.avatarDesktop} aria-label="Profile">A</Link>
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
