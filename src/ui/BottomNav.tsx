import React from 'react';
import { motion } from 'framer-motion';
import { Home, User, Star, Sparkles } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'rate', label: 'Beoordeel', icon: Star },
    { id: 'profile', label: 'Profiel', icon: User },
    { id: 'recommendations', label: 'Tips', icon: Sparkles },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '500px',
      height: '84px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: '16px',
      zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
    }}>
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <motion.button
            key={id}
            onClick={() => onNavigate(id)}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--wine-burgundy)' : 'var(--text-muted)',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '4px',
                  backgroundColor: 'var(--wine-burgundy)',
                  borderRadius: '4px',
                  top: '0',
                }}
              />
            )}
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
