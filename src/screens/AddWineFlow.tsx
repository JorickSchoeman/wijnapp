import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SelectionScreen from '../components/add-wine/SelectionScreen';
import SearchScreen from '../components/add-wine/SearchScreen';
import ScannerModal from '../components/add-wine/ScannerModal';
import MatchResults from '../components/add-wine/MatchResults';
import RateWine from './RateWine';
import { Loader2 } from 'lucide-react';

interface AddWineFlowProps {
  onComplete: () => void;
}

type Step = 'selection' | 'search' | 'scanner' | 'matches' | 'rating';

export interface WineDataPrefill {
  name?: string;
  winery?: string;
  grape?: string;
  region?: string;
  store?: string;
}

const AddWineFlow: React.FC<AddWineFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('selection');
  const [scanMode, setScanMode] = useState<'barcode' | 'label'>('label');
  const [prefill, setPrefill] = useState<WineDataPrefill>({});
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingRecognition, setLoadingRecognition] = useState(false);

  const handleSelection = (method: 'search' | 'barcode' | 'label' | 'manual') => {
    switch(method) {
      case 'search': setStep('search'); break;
      case 'barcode': setScanMode('barcode'); setStep('scanner'); break;
      case 'label': setScanMode('label'); setStep('scanner'); break;
      case 'manual': setPrefill({}); setStep('rating'); break;
    }
  };

  const handleScanComplete = async (rawResult: string) => {
    setLoadingRecognition(true);
    try {
      if (scanMode === 'label') {
        const response = await fetch('/api/wine/recognize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rawResult.startsWith('data:image') 
            ? { image: rawResult } 
            : { ocrText: rawResult }),
        });
        const data = await response.json();
        
        // Map backend results to match list
        const results = data.map((r: any) => ({
          ...r.wine,
          confidence: `${Math.round(r.score * 100)}%`,
          emoji: r.wine.type === 'Rood' ? '🍷' : r.wine.type === 'Wit' ? '🥂' : r.wine.type === 'Rosé' ? '🌸' : '🍾',
          bg: r.wine.type === 'Rood' ? 'linear-gradient(135deg, var(--wine-burgundy), #4a001a)' 
            : 'linear-gradient(135deg, var(--wine-dark-green), #0d1f03)'
        }));
        
        setMatches(results);
        setStep('matches');
      } else {
        // Barcode case - fetch exact or search
        const response = await fetch(`/api/wine/search?q=${encodeURIComponent(rawResult)}`);
        const data = await response.json();
        
        if (data.length > 0) {
          const matchedWine = data[0].wine;
          setPrefill(matchedWine);
          setStep('rating');
        } else {
          // Fallback to manual rating if no barcode match
          setPrefill({ name: 'Onbekende Barcode', store: 'Zelf ingevoerd' });
          setStep('rating');
        }
      }
    } catch (err) {
      console.error('Recognition error:', err);
      // Fallback
      if (scanMode === 'label') setStep('selection');
      else setStep('rating');
    } finally {
      setLoadingRecognition(false);
    }
  };

  const handleMatchSelect = (wine: any) => {
    setPrefill({
      name: wine.name,
      winery: wine.winery,
      grape: wine.grape,
      region: wine.region,
      store: wine.store,
    });
    setStep('rating');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ width: '100%', minHeight: '100vh', background: 'var(--wine-soft-bg)' }}
      >
        {step === 'selection' && <SelectionScreen onSelect={handleSelection} onClose={onComplete} />}
        {step === 'search' && (
          <SearchScreen 
            onBack={() => setStep('selection')} 
            onSelect={(wine) => handleMatchSelect(wine)} 
          />
        )}
        {step === 'scanner' && (
          <ScannerModal 
            mode={scanMode} 
            onClose={() => setStep('selection')} 
            onScanComplete={handleScanComplete} 
          />
        )}
        {step === 'matches' && (
          <MatchResults 
            matches={matches}
            onSelect={handleMatchSelect} 
            onDismiss={() => setStep('selection')} 
          />
        )}
        {step === 'rating' && (
          <RateWine 
            initialData={prefill}
            onSave={onComplete} 
          />
        )}

        {/* Global recognition loader */}
        {loadingRecognition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ marginBottom: '24px' }}>
              <Loader2 size={64} color="var(--wine-gold)" />
            </motion.div>
            <h2 style={{ color: 'white', fontSize: '28px', marginBottom: '8px' }}>Puntjes op de i...</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>We matchen je scan met Hamersma data</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AddWineFlow;
