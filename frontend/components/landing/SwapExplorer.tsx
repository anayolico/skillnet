'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  Video,
  Code2,
} from 'lucide-react';
import styles from './SwapExplorer.module.css';

interface SwapTrack {
  id: string;
  label: string;
  listingTitle: string;
  partnerName: string;
  partnerRole: string;
  offering: string[];
  seeking: string[];
  format: string;
  duration: string;
  milestones: [string, string];
  completedMilestones: number;
  roomNote: string;
}

const SWAP_TRACKS: SwapTrack[] = [
  {
    id: 'eng-design',
    label: 'Engineering & Design',
    listingTitle: 'Production Next.js Architecture for Design Systems Audit',
    partnerName: 'Nadia Okafor',
    partnerRole: 'Staff Frontend Architect',
    offering: ['Next.js', 'TypeScript', 'React'],
    seeking: ['Design Systems', 'Figma'],
    format: 'Code & Design Review',
    duration: '2 Hour Deep Dive',
    milestones: ['Architecture & component audit delivered', 'Design token handoff reviewed'],
    completedMilestones: 2,
    roomNote: 'Live workspace room active with shared review notes',
  },
  {
    id: 'cloud-finance',
    label: 'Cloud & Finance',
    listingTitle: 'Kubernetes Scaling Playbook for SaaS Financial Modeling',
    partnerName: 'Daniel Mensah',
    partnerRole: 'Cloud Infrastructure Lead',
    offering: ['Kubernetes', 'AWS', 'Terraform'],
    seeking: ['Financial Analysis', 'Venture Capital'],
    format: 'Live Video Call',
    duration: '5 Hour Mini-Course',
    milestones: ['Cluster resilience workshop complete', 'Unit economics model walkthrough'],
    completedMilestones: 1,
    roomNote: 'Escrow milestone 1 confirmed by both partners',
  },
  {
    id: 'ai-product',
    label: 'AI & Product',
    listingTitle: 'Applied AI Engineering for Enterprise Product Strategy',
    partnerName: 'Priya Subramanian',
    partnerRole: 'Applied ML Engineer',
    offering: ['AI Engineering', 'Python', 'Machine Learning'],
    seeking: ['Product Management', 'Strategic Planning'],
    format: 'Live Video Call',
    duration: '2 Hour Deep Dive',
    milestones: ['Evaluation pipeline session complete', 'Roadmap prioritization review'],
    completedMilestones: 1,
    roomNote: 'Direct WebSocket channel unlocked after acceptance',
  },
  {
    id: 'growth-systems',
    label: 'Growth & Systems',
    listingTitle: 'B2B Growth Funnels for Backend API Performance',
    partnerName: 'Lucas Lindqvist',
    partnerRole: 'Head of Growth',
    offering: ['Growth Marketing', 'SEO/SEM', 'Content Strategy'],
    seeking: ['Node.js', 'PostgreSQL'],
    format: 'Ongoing Mentorship',
    duration: '1 Hour Session',
    milestones: ['Acquisition funnel tear-down', 'Database indexing walkthrough'],
    completedMilestones: 2,
    roomNote: 'Verified swap logged in both member profiles',
  },
];

export default function SwapExplorer() {
  const [activeId, setActiveId] = useState<string>(SWAP_TRACKS[0].id);
  const track = SWAP_TRACKS.find((t) => t.id === activeId) ?? SWAP_TRACKS[0];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabRow} role="tablist" aria-label="Sample skill swap tracks">
        {SWAP_TRACKS.map((item) => {
          const isActive = item.id === track.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className={styles.card} role="tabpanel">
        <div className={styles.cardTop}>
          <div className={styles.partnerRow}>
            <div className={styles.avatar}>
              {track.partnerName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className={styles.partnerName}>{track.partnerName}</div>
              <div className={styles.partnerRole}>{track.partnerRole}</div>
            </div>
          </div>

          <span className={styles.statusPill}>
            <ShieldCheck size={14} />
            Escrow Protected
          </span>
        </div>

        <h3 className={styles.listingTitle}>{track.listingTitle}</h3>

        <div className={styles.metaStrip}>
          <span className={styles.metaItem}>
            {track.format.includes('Video') ? <Video size={14} /> : <Code2 size={14} />}
            {track.format}
          </span>
          <span className={styles.metaItem}>
            <Clock size={14} />
            {track.duration}
          </span>
        </div>

        <div className={styles.exchangeGrid}>
          <div className={styles.exchangeCol}>
            <span className={styles.colLabel}>Offering</span>
            <div className={styles.pillGroup}>
              {track.offering.map((skill) => (
                <span key={skill} className={`${styles.skillPill} ${styles.pillOffering}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.exchangeDivider} aria-hidden="true">
            <ArrowLeftRight size={16} />
          </div>

          <div className={styles.exchangeCol}>
            <span className={styles.colLabel}>Seeking</span>
            <div className={styles.pillGroup}>
              {track.seeking.map((skill) => (
                <span key={skill} className={`${styles.skillPill} ${styles.pillSeeking}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.milestoneBox}>
          <div className={styles.milestoneHeader}>
            <span className={styles.colLabel}>Escrow Milestones</span>
            <span className={styles.milestoneCount}>
              {track.completedMilestones} of {track.milestones.length} verified
            </span>
          </div>

          <ul className={styles.milestoneList}>
            {track.milestones.map((step, index) => {
              const done = index < track.completedMilestones;
              return (
                <li
                  key={step}
                  className={`${styles.milestoneItem} ${done ? styles.milestoneDone : ''}`}
                >
                  <CheckCircle2 size={15} className={styles.milestoneIcon} />
                  <span>{step}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.cardFooter}>
          <span className={styles.roomNote}>
            <MessageSquare size={14} />
            {track.roomNote}
          </span>
          <Link href="/marketplace" className={styles.footerLink}>
            Browse similar swaps <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
