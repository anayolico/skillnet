'use client';
import React from 'react';
import Link from 'next/link';
import AppNav from '../../../components/AppNav';
import Footer from '../../../components/Footer';
import { Search, ChevronDown, ShieldCheck, User, Star, ArrowRight } from 'lucide-react';
import styles from './catalog.module.css';

export default function Catalog() {
  const courses = [
    { id: 1, tag: 'Verified Expert', title: 'Fintech Architecture', desc: 'Structural principles for high-scale financial ledgers and escrow systems.', instructor: 'Marcus Thorne, PhD', rating: '4.9', reviews: '2k', price: '$249', bgType: 'blue', avatar: '👨‍💼' },
    { id: 2, tag: 'Verified Expert', title: 'System Governance', desc: 'Scale your design operations without losing creative soul or brand integrity.', instructor: 'Elena Rodriguez', rating: '4.8', reviews: '1.2k', price: '$189', bgType: 'dark', avatar: '👩‍💻' },
    { id: 3, tag: 'Verified Expert', title: 'Business Logic', desc: 'Deconstructing enterprise revenue models through the lens of architectural logic.', instructor: 'Sarah Chen', rating: '5.0', reviews: '3.4k', price: '$320', bgType: 'gray', avatar: '👩🏻‍💼' },
    { id: 4, tag: 'Development', title: 'Cloud Infrastructure for Modern DevOps', desc: 'Building resilient deployment pipelines for enterprise architecture.', instructor: 'Alex Rivera', rating: '4.9', reviews: '890', price: '$215.00', bgType: 'darkBlue', avatar: '🧑🏽‍💻' },
  ];

  const getBgStyle = (type: string) => {
    switch (type) {
      case 'blue': return { background: 'linear-gradient(135deg, #1e3b8a, #3b82f6)' };
      case 'dark': return { background: 'linear-gradient(135deg, #0f172a, #334155)' };
      case 'gray': return { background: 'linear-gradient(135deg, #334155, #64748b)' };
      case 'darkBlue': return { background: 'linear-gradient(135deg, #172554, #1e3a8a)' };
      default: return { background: '#1e3a8a' };
    }
  };

  return (
    <div className={styles.catalogRoot}>
      <AppNav />

      <main className={`${styles.container} reveal`} style={{ paddingBottom: '6rem' }}>
        <p className={styles.catalogSub}>THE CATALOG</p>
        <h1 className={styles.heroTitle}>
          Master the Architectural
          <br />
          <span className={styles.heroTitleItalic}>Logic of Business</span>
        </h1>
        <p className={styles.heroDesc}>
          Curated learning paths designed for high-performance professionals. Secure your next skill through our verified expert network.
        </p>

        <div className={`${styles.searchFilterArea} reveal`} style={{animationDelay: '0.2s'}}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Explore architectural strategy, design systems, or fintech..." />
          </div>
          <button className={`${styles.sortDropdown} click-scale`}>
            Sort by: Featured <ChevronDown size={14} />
          </button>
        </div>

        <div className={`${styles.filterPills} reveal stagger`} style={{animationDelay: '0.3s'}}>
          <button className={`${styles.pill} ${styles.activePill} click-scale`}>All Tutorials</button>
          <button className={`${styles.pill} click-scale`}>Development</button>
          <button className={`${styles.pill} click-scale`}>Design</button>
          <button className={`${styles.pill} click-scale`}>Business</button>
          <button className={`${styles.pill} click-scale`}>Marketing</button>
        </div>

        <div className={`${styles.coursesGrid} stagger`} style={{animationDelay: '0.4s'}}>
          {courses.slice(0, 2).map(course => (
            <div key={course.id} className={`${styles.courseCard} reveal hover-lift`}>
              <div className={styles.courseThumbnail} style={getBgStyle(course.bgType)}>
                {course.tag && (
                  <div className={styles.thumbnailOverlay}>
                    <ShieldCheck size={14} style={{ marginRight: '4px' }} /> {course.tag}
                  </div>
                )}
                <div style={{ opacity: 0.15 }}>
                  <User size={100} strokeWidth={1} color="white" />
                </div>
              </div>
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>
                <div className={styles.instructorRow}>
                  <div className={styles.instructorAvatar}>
                     <User size={20} color="white" />
                  </div>
                  <div className={styles.instructorStats}>
                    <span className={styles.instructorName}>{course.instructor}</span>
                    <div className={styles.instructorRating}>
                      <Star size={12} fill="#fbbf24" color="#fbbf24" style={{ marginRight: '4px' }} />
                      {course.rating} <span>({course.reviews} students)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>{course.price}</span>
                  <button className={`${styles.syllabusBtn} click-scale`}>View Syllabus</button>
                </div>
              </div>
            </div>
          ))}

          <div className={`${styles.promoCard} reveal-in`}>
            <h3 className={styles.promoTitle}>Can't find what you're looking for?</h3>
            <p className={styles.promoDesc}>Request a specific online behavior from our network. We add 10+ professional courses weekly.</p>
            <Link href="/create-listing"><button className={`${styles.promoBtn} click-scale`}>Request a Course</button></Link>
          </div>

          {courses.slice(2).map(course => (
            <div key={course.id} className={`${styles.courseCard} reveal hover-lift`}>
              <div className={styles.courseThumbnail} style={getBgStyle(course.bgType)}>
                {course.tag && (
                  <div className={styles.thumbnailOverlay}>
                    <ShieldCheck size={14} style={{ marginRight: '4px' }} /> {course.tag}
                  </div>
                )}
                <div style={{ opacity: 0.15 }}>
                  <User size={100} strokeWidth={1} color="white" />
                </div>
              </div>
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>
                <div className={styles.instructorRow}>
                  <div className={styles.instructorAvatar}>
                    <User size={20} color="white" />
                  </div>
                  <div className={styles.instructorStats}>
                    <span className={styles.instructorName}>{course.instructor}</span>
                    <div className={styles.instructorRating}>
                      <Star size={12} fill="#fbbf24" color="#fbbf24" style={{ marginRight: '4px' }} />
                      {course.rating} <span>({course.reviews} students)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>{course.price}</span>
                  <button className={`${styles.syllabusBtn} click-scale`}>View Syllabus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.bottomCtaArea} reveal`}>
          <button className={`${styles.exploreBtn} click-scale`}>
            Discover 128 + More Courses <ArrowRight size={18} />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
