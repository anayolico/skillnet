'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import { User, Send, Shield, Lock, ChevronLeft } from 'lucide-react';
import styles from './chats.module.css';
import { createClient } from '../../utils/supabase/client';

export default function Chats() {
  const [swaps, setSwaps] = useState<any[]>([]);
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSwaps = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Get me
      const meRes = await fetch(`${apiUrl}/api/me`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const meData = await meRes.json();
      if (meData.success) setCurrentUser(meData.user);

      // Get swaps
      const res = await fetch(`${apiUrl}/api/swaps`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.success) {
        const fetchedSwaps = data.data || [];
        setSwaps(fetchedSwaps);
        
        // Handle swapId from query param
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const swapIdParam = params.get('swapId');
          if (swapIdParam) {
            const matchedSwap = fetchedSwaps.find((s: any) => s.id === swapIdParam);
            if (matchedSwap) {
              setSelectedSwap(matchedSwap);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch swaps', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (swapId: string) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/swaps/${swapId}/messages`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
        markMessagesRead(swapId);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const markMessagesRead = async (swapId: string) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/notifications/mark-messages-read/${swapId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
    } catch (err) {}
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  useEffect(() => {
    if (selectedSwap && currentUser) {
      fetchMessages(selectedSwap.id);

      // Setup WebSocket
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        console.log('[ws]: Connected');
        socket.send(JSON.stringify({
          type: 'join',
          swapId: selectedSwap.id,
          userId: currentUser.id
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages(prev => [...prev, data]);
          if (data.swapId === selectedSwap.id) {
            markMessagesRead(selectedSwap.id);
          }
        }
      };

      socket.onclose = () => {
        console.log('[ws]: Disconnected');
      };

      return () => {
        socket.close();
      };
    }
  }, [selectedSwap, currentUser]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !ws.current || !selectedSwap || !currentUser) return;

    const payload = {
      type: 'chat',
      swapId: selectedSwap.id,
      userId: currentUser.id,
      content: inputText
    };

    ws.current.send(JSON.stringify(payload));
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (loading) return <div className={styles.messagesRoot}><AppNav /></div>;

  return (
    <div className={`${styles.messagesRoot} animate-fade-in`}>
      <AppNav />

      <div className={styles.chatContainer}>
        {/* Sidebar: Swap List */}
        <div className={`${styles.sidebar} ${selectedSwap ? styles.mobileHidden : ''}`}>
          <div className={`${styles.sidebarHeader} reveal`}>
            <h1 className={styles.sidebarTitle}>Secure Channels</h1>
          </div>
          <ul className={`${styles.chatList} stagger`}>
            {swaps.length === 0 ? (
              <div className={styles.emptySwaps}>
                <p>No active swaps found. Establish a protocol to start chatting.</p>
              </div>
            ) : (
              swaps.map(swap => {
                const partner = swap.participantAId === currentUser?.id ? swap.participantB : swap.participantA;
                return (
                  <li 
                    key={swap.id} 
                    className={`${styles.chatItem} ${selectedSwap?.id === swap.id ? styles.active : ''} reveal`}
                    onClick={() => setSelectedSwap(swap)}
                  >
                    <div className={styles.chatAvatar}>
                      {partner.imageUrl ? (
                        <img src={partner.imageUrl} alt="Avatar" className={styles.avatarImg} />
                      ) : (
                        <User size={20} color="#0c2b54" />
                      )}
                    </div>
                    <div className={styles.chatDetails}>
                      <div className={styles.chatName}>
                        {partner.firstName} {partner.lastName}
                      </div>
                      <div className={styles.chatSnippet}>{swap.swapRequest.listing.title}</div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Main: Chat Room */}
        <div className={`${styles.chatMain} ${!selectedSwap ? styles.mobileHidden : ''}`}>
          {selectedSwap ? (
            <>
              <div className={`${styles.chatHeader} reveal`}>
                <div className={styles.chatHeaderInfo}>
                  <button className={styles.backBtn} onClick={() => setSelectedSwap(null)}>
                    <ChevronLeft size={24} />
                  </button>
                  <div className={styles.chatAvatar}>
                    { (selectedSwap.participantAId === currentUser?.id ? selectedSwap.participantB : selectedSwap.participantA).imageUrl ? (
                       <img src={(selectedSwap.participantAId === currentUser?.id ? selectedSwap.participantB : selectedSwap.participantA).imageUrl} alt="Avatar" className={styles.avatarImg} />
                    ) : (
                       <User size={20} color="#0c2b54" />
                    )}
                  </div>
                  <div>
                    <div className={styles.chatHeaderName}>
                      {(selectedSwap.participantAId === currentUser?.id ? selectedSwap.participantB : selectedSwap.participantA).firstName}
                    </div>
                    <div className={styles.chatHeaderStatus}>
                      <Lock size={12} style={{marginRight: '4px'}} /> End-to-End Secure
                    </div>
                  </div>
                </div>
                <Link href="/escrow" className={`${styles.proposeBtn} click-scale`}>Verify Milestone</Link>
              </div>

              <div className={`${styles.chatsArea} reveal`}>
                <div className={styles.systemNote}>
                  <Shield size={14} style={{marginRight: '6px'}} /> 
                  Protocol established for "{selectedSwap.swapRequest.listing.title}".
                </div>
                
                {messages.map((msg, idx) => (
                  <div 
                    key={msg.id || idx} 
                    className={`${styles.messageWrapper} ${msg.senderId === currentUser?.id ? styles.sentWrapper : styles.receivedWrapper}`}
                  >
                    <div className={`${styles.message} ${msg.senderId === currentUser?.id ? styles.sent : styles.received}`}>
                      {msg.content}
                      <span className={styles.msgTime}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className={`${styles.inputArea} reveal`}>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="Type a secure message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className={`${styles.sendBtn} click-scale`}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noSelected}>
              <Shield size={48} opacity={0.2} />
              <h3>Select a Secure Channel</h3>
              <p>Pick a partner from the sidebar to begin your exchange.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
