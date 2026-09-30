import { getApiUrl } from '@/src/utils/config';
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Skeleton from '../../../components/Skeleton';
import { User, FileText, Check, X, Clock, ArrowRight } from 'lucide-react';
import styles from './escrow.module.css';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/components/Toast';

export default function Escrow() {
  const { user, getToken } = useAuth();
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchRequests = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/marketplace/swap-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSentRequests(data.sent || []);
        setReceivedRequests(data.received || []);
      }
    } catch (err) {
      console.error('Failed to fetch swap requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchRequests();
    }

    const handleNotif = () => {
      console.log('[Escrow] New notification received, refreshing list...');
      // Small delay to ensure DB write is finalized before re-fetching
      setTimeout(fetchRequests, 1000);
    };

    window.addEventListener('new-notification', handleNotif);
    return () => window.removeEventListener('new-notification', handleNotif);
  }, [user, activeTab]);

  const handleUpdateStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    const actionKey = `${requestId}-${status}`;
    setProcessingAction(actionKey);
    try {
      const token = getToken();
      if (!token) return;

      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/marketplace/swap-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await res.json();
      if (data.success) {
        showToast(`Request ${status} successfully`, 'success');
        // Refresh the list
        fetchRequests();
      } else {
        showToast(data.error || `Failed to ${status} request`, 'error');
      }
    } catch (err) {
      console.error(`Failed to ${status} request`, err);
    } finally {
      setProcessingAction(null);
    }
  };


  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className={`${styles.escrowRoot}`}>
      <AppNav />

      <main className={`${styles.container} animate-fade-in`}>
        <div className={`${styles.pageHeader} reveal`}>
          <h1 className={styles.pageTitle}>Swap Requests</h1>
          <p className={styles.pageSubtitle}>
            Manage your peer-to-peer knowledge swaps and verify intellectual releases via the secure ledger.
          </p>
        </div>

        <div className={`${styles.statsRow} stagger`}>
          <div className={`${styles.statCard} reveal`}>
            <span className={styles.statLabel}>Active Contracts</span>
            <span className={styles.statValue}>{receivedRequests.filter(r => r.status === 'accepted').length + sentRequests.filter(r => r.status === 'accepted').length}</span>
          </div>
          <div className={`${styles.statCard} ${styles.light} reveal`}>
            <span className={styles.statLabel}>Pending Requests</span>
            <span className={`${styles.statValue} ${styles.green}`}>
              {receivedRequests.filter(r => r.status === 'pending').length + sentRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>
          <div className={`${styles.statCard} ${styles.light} reveal`}>
            <span className={styles.statLabel}>Architectural Rating</span>
            <span className={styles.statValue}>A++</span>
          </div>
        </div>

        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'received' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Received ({receivedRequests.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'sent' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent ({sentRequests.length})
            </button>
          </div>
          <button className={styles.secondaryBtn} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} /> Download Ledger PDF
          </button>
        </div>

        {loading ? (
          <div className={styles.contractList}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.contractCard} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Skeleton width="48px" height="48px" borderRadius="50%" variant="circular" />
                  <div>
                    <Skeleton width="150px" height="20px" variant="text" />
                    <Skeleton width="200px" height="14px" variant="text" style={{ marginTop: '0.5rem' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Skeleton width="100px" height="36px" borderRadius="6px" variant="rectangular" />
                  <Skeleton width="100px" height="36px" borderRadius="6px" variant="rectangular" />
                </div>
              </div>
            ))}
          </div>
        ) : currentRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No {activeTab} requests found in the current cycle.</p>
            <Link href="/marketplace" className={styles.actionBtn} style={{ marginTop: '1rem', display: 'inline-block' }}>
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className={`${styles.contractList} stagger`}>
            {currentRequests.map((req: any) => {
              const partner = activeTab === 'received' ? req.requester : req.recipient;
              const isPending = req.status === 'pending';
              const isAccepted = req.status === 'accepted';
              const isDeclined = req.status === 'declined';

              return (
                <div key={req.id} className={`${styles.contractCard} reveal hover-lift`}>
                  <div className={styles.contractHeader}>
                    <div className={styles.contractPartner}>
                      <div className={styles.partnerAvatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {partner?.imageUrl ? (
                          <img src={partner.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={20} color="#0c2b54" />
                        )}
                      </div>
                      <div>
                        <div className={styles.partnerName}>{partner?.firstName} {partner?.lastName}</div>
                        <div className={styles.partnerRole}>{activeTab === 'received' ? 'Requester' : 'Recipient'}</div>
                      </div>
                    </div>
                    <span className={`${styles.badge} ${isAccepted ? styles.active : isPending ? styles.pending : styles.declined}`}>
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className={styles.contractBody}>
                    <div className={styles.swapDetails}>
                      <div className={styles.swapListingTitle}>
                        <strong>Listing:</strong> {req.listing?.title}
                      </div>
                      <p className={styles.swapMessage}>"{req.message}"</p>
                    </div>
                  </div>

                  <div className={styles.contractFooter}>
                    {activeTab === 'received' && isPending ? (
                      <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                        <button 
                          className={`${styles.secondaryBtn} click-scale`} 
                          style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}
                          onClick={() => handleUpdateStatus(req.id, 'declined')}
                          disabled={!!processingAction}
                        >
                          {processingAction === `${req.id}-declined` ? 'Processing...' : <><X size={16} /> Decline</>}
                        </button>
                        <button 
                          className={`${styles.actionBtn} click-scale`} 
                          style={{ flex: 1, background: '#4ade80', color: '#0c2b54' }}
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          disabled={!!processingAction}
                        >
                          {processingAction === `${req.id}-accepted` ? 'Processing...' : <><Check size={16} /> Accept Swap</>}
                        </button>
                      </div>
                    ) : isAccepted ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                         <span style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <Check size={14} /> Protocol Established
                         </span>
                         <Link href={req.swap?.id ? `/chats?swapId=${req.swap.id}` : "/chats"}>
                           <button className={`${styles.actionBtn} click-scale`}>Enter Secure Room</button>
                         </Link>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                        <Clock size={14} /> 
                        <span>{isPending ? 'Awaiting confirmation from partner.' : 'Protocol terminated.'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
