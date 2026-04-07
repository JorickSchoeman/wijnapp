import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ElegantButton, TasteChip } from '../ui/DesignSystem';
import { Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const Onboarding: React.FC<Props> = ({ onStart }) => {
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const preferences = [
    'Rood', 'Wit', 'Rosé', 'Mousserend', 
    'Droog', 'Zoet', 'Fruitig', 'Vol'
  ];

  const togglePref = (pref: string) => {
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter(p => p !== pref));
    } else {
      setSelectedPrefs([...selectedPrefs, pref]);
    }
  };

  return (
    <div className="p-safe flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      <header className="text-center m-b-lg">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: 'var(--wine-burgundy)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <Sparkles color="white" size={40} />
        </motion.div>
        
        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--wine-burgundy)' }}>
          Ontdek jouw unieke wijnsmaak
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '300px', margin: '0 auto' }}>
          Beantwoord een paar vragen en wij bouwen jouw persoonlijke profiel.
        </p>
      </header>

      <div style={{ width: '100%', marginBottom: '40px' }}>
        <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
          Wat drink je graag?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {preferences.map(pref => (
            <TasteChip 
              key={pref} 
              label={pref} 
              selected={selectedPrefs.includes(pref)} 
              onClick={() => togglePref(pref)}
            />
          ))}
        </div>
      </div>

      <div style={{ width: '100%', marginTop: 'auto' }}>
        <ElegantButton fullWidth onClick={onStart}>
          Start mijn smaakprofiel
        </ElegantButton>
      </div>
    </div>
  );
};

export default Onboarding;
