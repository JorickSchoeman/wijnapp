import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface MatchResultsProps {
  onSelect: (wine: any) => void;
  onDismiss: () => void;
  matches: any[];
}

const MatchResults: React.FC<MatchResultsProps> = ({ onSelect, onDismiss, matches }) => {
  const [deck, setDeck] = useState(matches);

  const handleNext = () => {
    if (deck.length > 1) {
      setDeck((prev: any[]) => prev.slice(1));
    } else {
      onDismiss();
    }
  };

  const currentMatch = deck[0];

  return (
    <div style={{ paddingBottom: '100px', minHeight: '100vh', background: 'var(--wine-soft-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'linear-gradient(160deg, #1A0008 0%, var(--wine-burgundy) 100%)',
        padding: '60px 24px 32px',
        borderRadius: '0 0 36px 36px',
        marginBottom: '40px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Jouw scan resultaten
        </p>
        <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '16px' }}>Is dit jouw wijn?</h1>
      </div>

      <div className="p-safe" style={{ paddingTop: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          {currentMatch && (
            <motion.div
              key={currentMatch.id}
              initial={{ x: 100, opacity: 0, rotate: 10 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -100, opacity: 0, rotate: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: '340px',
                background: currentMatch.bg,
                borderRadius: '28px',
                padding: '32px 24px',
                color: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Confidence Badge */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid #22c55e',
                color: '#4ade80',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700
              }}>
                {currentMatch.confidence} match
              </div>

              <div style={{ fontSize: '72px', textAlign: 'center', marginBottom: '24px' }}>
                {currentMatch.emoji}
              </div>

              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{currentMatch.type}</p>
              <h2 style={{ fontSize: '28px', marginBottom: '8px', lineHeight: 1.1 }}>{currentMatch.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--wine-gold)' }}>{currentMatch.year}</span>
                <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>{currentMatch.winery}</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Druif</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentMatch.grape}</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Regio</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentMatch.region}</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Winkel</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentMatch.store}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 'auto', width: '100%', maxWidth: '340px', display: 'flex', gap: '16px', paddingTop: '32px' }}>
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: '2px solid rgba(0,0,0,0.1)',
              background: 'white',
              color: 'var(--text-muted)',
              fontSize: '15px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <X size={20} /> Andere zoeken
          </button>
          <button
            onClick={() => onSelect(currentMatch)}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              background: 'var(--wine-burgundy)',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(128,0,32,0.3)'
            }}
          >
            <Check size={20} /> Dit is hem!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
