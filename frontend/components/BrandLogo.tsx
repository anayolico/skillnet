import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

const sizes = {
  sm: { box: 26, font: '1.05rem', radius: 7 },
  md: { box: 30, font: '1.2rem', radius: 8 },
  lg: { box: 36, font: '1.45rem', radius: 10 },
};

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showWordmark = true,
}: BrandLogoProps) {
  const dim = sizes[size];
  const isLight = variant === 'light';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontFamily: 'var(--font-display), var(--font-sans), sans-serif',
        fontWeight: 800,
        fontSize: dim.font,
        letterSpacing: '-0.03em',
        color: isLight ? '#FFFFFF' : '#0A1F3C',
        lineHeight: 1,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: dim.box,
          height: dim.box,
          borderRadius: dim.radius,
          background: isLight ? '#10B981' : '#0A1F3C',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={Math.round(dim.box * 0.6)}
          height={Math.round(dim.box * 0.6)}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7.5H15.5M15.5 7.5L12 4M15.5 7.5L12 11"
            stroke={isLight ? '#061428' : '#FFFFFF'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 12.5H4.5M4.5 12.5L8 9M4.5 12.5L8 16"
            stroke={isLight ? '#061428' : '#34D399'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && <span>SkillNet</span>}
    </span>
  );
}
