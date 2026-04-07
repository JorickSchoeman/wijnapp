import React from 'react';
import { motion } from 'framer-motion';
import { Search, Barcode, ScanLine, ChevronRight, PenLine, X } from 'lucide-react';

interface SelectionScreenProps {
  onSelect: (method: 'search' | 'barcode' | 'label' | 'manual') => void;
  onClose: () => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const options = [
    { id: 'search', title: 'Zoek wijn', subtitle: 'Typ de naam of het wijnhuis', icon: Search, bg: 'linear-gradient(135deg, var(--wine-burgundy), #4a001a)' },
    { id: 'barcode', title: 'Scan barcode', subtitle: 'Snelle herkenning via de streepjescode', icon: Barcode, bg: 'linear-gradient(135deg, var(--wine-dark-green), #0d1f03)' },
    { id: 'label', title: 'Scan etiket', subtitle: 'AI herkenning van de voorkant', icon: ScanLine, bg: 'linear-gradient(135deg, #8B7355, #5a4a30)' },
  ] as const;

  return (
    <div style={{ paddingBottom: '100px', position: 'relative' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0008 0%, var(--wine-burgundy) 100%)',
        padding: '64px 24px 36px',
        borderRadius: '0 0 40px 40px',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: 20, left: 24, 
            background: 'rgba(255,255,255,0.1)', border: 'none', 
            borderRadius: '50%', width: '40px', height: '40px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}
        >
          <X size={20} />
        </button>

        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '8px', lineHeight: 1.2 }}>Nieuwe wijn</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontWeight: 500 }}>
          Voeg je wijn in minder dan 30 seconden toe
        </p>
      </div>

      <motion.div
        className="p-safe"
        style={{ paddingTop: 0 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {options.map(({ id, title, subtitle, icon: Icon, bg }) => (
            <motion.div
              key={id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(id as any)}
              style={{
                background: bg,
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  borderRadius: '16px', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={28} color="white" />
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{subtitle}</p>
                </div>
              </div>
              <ChevronRight color="rgba(255,255,255,0.5)" size={24} />
            </motion.div>
          ))}
        </div>

        {/* Manual Fallback */}
        <motion.div 
          variants={itemVariants} 
          style={{ textAlign: 'center' }}
        >
          <button 
            onClick={() => onSelect('manual')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <PenLine size={16} /> Handmatig toevoegen
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SelectionScreen;
