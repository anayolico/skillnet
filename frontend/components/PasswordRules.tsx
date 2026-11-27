'use client';

import { getPasswordChecks } from '@/src/utils/validation';
import styles from './PasswordRules.module.css';

interface PasswordRulesProps {
  password: string;
  compact?: boolean;
}

export default function PasswordRules({ password, compact = false }: PasswordRulesProps) {
  const checks = getPasswordChecks(password);
  const hasInput = password.length > 0;

  const missing: string[] = [];
  if (!checks.minLength) missing.push('8+ chars');
  if (!checks.maxBytes) missing.push('under 72 chars');
  if (!checks.hasUppercase) missing.push('uppercase');
  if (!checks.hasLowercase) missing.push('lowercase');
  if (!checks.hasNumber) missing.push('number');
  if (!checks.hasSpecial) missing.push('symbol');

  const metCount = [
    checks.minLength && checks.maxBytes,
    checks.hasUppercase,
    checks.hasLowercase,
    checks.hasNumber,
    checks.hasSpecial,
  ].filter(Boolean).length;

  let tone: 'empty' | 'weak' | 'fair' | 'strong' = 'empty';
  let widthPercent = 0;
  let strengthLabel = '';
  let helperText = '8+ chars with uppercase, lowercase, number & symbol';

  if (hasInput) {
    if (!checks.maxBytes || metCount <= 2) {
      tone = 'weak';
      widthPercent = metCount === 0 ? 12 : metCount === 1 ? 24 : 38;
      strengthLabel = 'Weak';
      helperText = `Add ${missing.join(', ')}`;
    } else if (metCount <= 4) {
      tone = 'fair';
      widthPercent = metCount === 3 ? 64 : 82;
      strengthLabel = 'Fair';
      helperText = `Add ${missing.join(', ')}`;
    } else {
      tone = 'strong';
      widthPercent = 100;
      strengthLabel = 'Strong';
      helperText = 'Strong password';
    }
  }

  return (
    <div
      className={`${styles.wrapper} ${compact ? styles.compact : ''}`}
      aria-label="Password strength"
    >
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={widthPercent}
        aria-valuetext={strengthLabel || 'Not entered'}
      >
        <div
          className={`${styles.fill} ${styles[tone]}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      <div className={styles.metaRow}>
        <span className={styles.hint}>{helperText}</span>
        {strengthLabel && (
          <span className={`${styles.strengthText} ${styles[`text_${tone}`]}`}>
            {strengthLabel}
          </span>
        )}
      </div>
    </div>
  );
}
