import { getApiUrl } from '@/src/utils/config';
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import AppNav from '../../../components/AppNav';
import styles from './subscriptions.module.css';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Subscriptions() {
  const tiers = [
    {
      name: 'Essential',
      price: '0',
      description: 'Ideal for those just starting their professional knowledge exchange journey.',
      features: [
        '1 swap request',
        'Messaging only who you swap with',
        'Access to Public Marketplace',
        'Standard Search Visibility',
        'Email Support'
      ],
      cta: 'Get Started',
      featured: false
    },
    {
      name: 'Professional',
      price: '49',
      description: 'Designed for architects and executives scaling their technical mastery.',
      features: [
        'Unlimited swap requests',
        'Unlimited messaging',
        'Priority Partner Matching',
        'Verified "Expert" Badge',
        '24/7 Priority Support'
      ],
      cta: 'Go Professional',
      featured: true
    }
  ];

  const { user, getToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const API_URL = getApiUrl();

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-placeholder',
    amount: 49,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'SkillNet User',
    },
    customizations: {
      title: 'SkillNet Professional',
      description: 'Upgrade to Professional Tier',
      logo: 'https://cdn-icons-png.flaticon.com/512/1000/1000100.png',
    },
  };

  const handleUpgradeClick = async () => {
    if (!user) {
      alert("Please log in first to upgrade.");
      router.push('/login');
      return;
    }
    if (user.subscriptionTier === 'professional') {
      alert("You are already on the Professional tier!");
      return;
    }

    setIsProcessing(true);
    try {
      // Dynamically load Flutterwave script
      const loadFlutterwave = () => new Promise((resolve) => {
        if ((window as any).FlutterwaveCheckout) {
          resolve(true);
        } else {
          const script = document.createElement('script');
          script.src = 'https://checkout.flutterwave.com/v3.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        }
      });

      const loaded = await loadFlutterwave();
      if (!loaded) {
        alert("Failed to load payment gateway. Please check your network connection.");
        setIsProcessing(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/subscriptions/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      
      if (!data.success) {
        alert(data.error || "Failed to initiate payment");
        setIsProcessing(false);
        return;
      }

      // Launch Flutterwave checkout with the real tx_ref
      const FlutterwaveCheckout = (window as any).FlutterwaveCheckout;
      if (FlutterwaveCheckout) {
        FlutterwaveCheckout({
          ...config,
          tx_ref: data.txRef,
          callback: (response: any) => {
             console.log("Payment response:", response);
             alert("Payment successful! Your account is being upgraded. Please wait a moment.");
             setIsProcessing(false);
             window.location.href = '/dashboard';
          },
          onclose: () => {
             setIsProcessing(false);
          }
        });
      } else {
        alert("Payment gateway is still loading. Please try again.");
        setIsProcessing(false);
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.subscriptionsRoot}>
      <AppNav />

      <main className={styles.container}>
        <section className={`${styles.hero} reveal`}>
          <span className={styles.tag}>Network Access Protocol</span>
          <h1 className={styles.title}>Refine your Edge. <br /> Architect your Future.</h1>
          <p className={styles.subtitle}>
            Choose the tier that aligns with your professional velocity. 
            All exchanges are secured by our institutional-grade Escrow Protocol.
          </p>
        </section>

        <div className={`${styles.pricingGrid} stagger`}>
          {tiers.map((tier, idx) => (
            <div 
              key={tier.name} 
              className={`${styles.priceCard} ${tier.featured ? styles.featuredCard : ''} reveal hover-lift`}
              style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
            >
              {tier.featured && <div className={styles.featuredBadge}>Most Popular</div>}
              <h3 className={styles.tierName}>{tier.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{tier.price}</span>
                <span className={styles.period}>/mo</span>
              </div>
              <p className={styles.description} style={{ marginBottom: '2rem', opacity: 0.8, fontSize: '0.9rem' }}>
                {tier.description}
              </p>
              
              <ul className={styles.featureList}>
                {tier.features.map(feature => (
                  <li key={feature} className={styles.featureItem}>
                    <Check className={styles.checkIcon} size={16} strokeWidth={3} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.name === 'Professional' ? (
                <button 
                  onClick={handleUpgradeClick}
                  disabled={isProcessing}
                  className={`${styles.ctaBtn} ${tier.featured ? styles.ctaBtnWhite : styles.ctaBtnPrimary} click-scale`}
                >
                  {isProcessing ? 'Processing...' : tier.cta}
                </button>
              ) : (
                <Link href="/join">
                  <button className={`${styles.ctaBtn} ${tier.featured ? styles.ctaBtnWhite : styles.ctaBtnPrimary} click-scale`}>
                    {tier.cta}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <section className={`${styles.trustSection} reveal`} style={{ animationDelay: '0.6s' }}>
          <h3 className={styles.trustTitle}>The SkillNet Security Standard</h3>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><ShieldCheck size={26} strokeWidth={2.4} aria-hidden="true" /></div>
              <h4>Identity Governance</h4>
              <p>Every member is professionally vetted to maintain network integrity.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><Scale size={26} strokeWidth={2.4} aria-hidden="true" /></div>
              <h4>Equity Arbitrage</h4>
              <p>Our ledger ensures equitable time-value exchange for both partners.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}><LockKeyhole size={26} strokeWidth={2.4} aria-hidden="true" /></div>
              <h4>Ledger Stability</h4>
              <p>Skill credits are held in trust until outcomes are verified.</p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
