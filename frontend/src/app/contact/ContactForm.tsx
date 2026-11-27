'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, ShieldCheck, CreditCard } from 'lucide-react';
import styles from './contact.module.css';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.channels}>
        <div className={styles.channelCard}>
          <div className={styles.channelIcon}>
            <Mail size={18} />
          </div>
          <h3>Account &amp; Platform Support</h3>
          <p>Questions about onboarding, skill listings, or profile visibility.</p>
          <span className={styles.channelMeta}>support@skillnet.app</span>
        </div>

        <div className={styles.channelCard}>
          <div className={styles.channelIcon}>
            <ShieldCheck size={18} />
          </div>
          <h3>Swap &amp; Trust Mediation</h3>
          <p>Report conduct issues or request review on an active exchange milestone.</p>
          <span className={styles.channelMeta}>trust@skillnet.app</span>
        </div>

        <div className={styles.channelCard}>
          <div className={styles.channelIcon}>
            <CreditCard size={18} />
          </div>
          <h3>Billing &amp; Professional Tier</h3>
          <p>Assistance with Flutterwave receipts, plan upgrades, or team access.</p>
          <span className={styles.channelMeta}>billing@skillnet.app</span>
        </div>
      </div>

      <div className={styles.formBox}>
        {submitted ? (
          <div className={styles.successBox}>
            <CheckCircle2 size={28} className={styles.successIcon} />
            <h3>Message received</h3>
            <p>
              Thanks, {name}. We logged your inquiry under <strong>{topic}</strong> and will reply
              to <strong>{email}</strong> shortly.
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className={styles.input}
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-topic" className={styles.label}>
                Topic
              </label>
              <select
                id="contact-topic"
                className={styles.input}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="General Support">General Support</option>
                <option value="Trust & Swap Mediation">Trust &amp; Swap Mediation</option>
                <option value="Professional Membership & Billing">
                  Professional Membership &amp; Billing
                </option>
                <option value="Privacy & Data Request">Privacy &amp; Data Request</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message" className={styles.label}>
                How can we help?
              </label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                placeholder="Share context, listing title, or account details so we can help quickly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
