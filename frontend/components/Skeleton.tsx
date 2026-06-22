import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'rectangular' | 'circular' | 'text';
  style?: React.CSSProperties;
}

export default function Skeleton({
  className = '',
  width,
  height,
  borderRadius,
  variant = 'rectangular',
  style = {}
}: SkeletonProps) {
  const baseStyle: React.CSSProperties = {
    ...style,
    width: width || style.width,
    height: height || style.height,
    borderRadius: borderRadius || style.borderRadius
  };

  const classes = [
    styles.skeleton,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} style={baseStyle} aria-hidden="true" />;
}
