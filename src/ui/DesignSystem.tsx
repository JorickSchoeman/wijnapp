import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const ElegantButton: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  fullWidth = false 
}) => {
  const baseStyles: React.CSSProperties = {
    padding: '16px 24px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--wine-burgundy)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(128, 0, 32, 0.2)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--wine-burgundy)',
      border: '1.5px solid var(--wine-burgundy)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-muted)',
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ ...baseStyles, ...variants[variant] }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  className?: string;
}

export const PremiumCard: React.FC<CardProps> = ({ children, padding = '20px', className }) => {
  return (
    <div 
      className={`premium-card ${className || ''}`}
      style={{ padding }}
    >
      {children}
    </div>
  );
};

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export const TasteChip: React.FC<ChipProps> = ({ label, selected, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: selected ? 'var(--wine-burgundy)' : 'white',
        color: selected ? 'white' : 'var(--text-main)',
        border: `1px solid ${selected ? 'var(--wine-burgundy)' : 'rgba(0,0,0,0.1)'}`,
        margin: '4px',
        boxShadow: selected ? '0 4px 8px rgba(128,0,32,0.15)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      {label}
    </motion.button>
  );
};
