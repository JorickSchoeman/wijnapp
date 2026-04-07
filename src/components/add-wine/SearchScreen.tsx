import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Store, ChevronLeft, Grape } from 'lucide-react';

interface SearchScreenProps {
  onBack: () => void;
  onSelect: (wine: { name: string; winery: string; grape: string; region: string; store: string; type: string }) => void;
}

const filters = ['Rood', 'Wit', 'Rosé', 'Mousserend', 'Albert Heijn', 'Jumbo', 'Gall & Gall'];

const SearchScreen: React.FC<SearchScreenProps> = ({ onBack, onSelect }) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  React.useEffect(() => {
    const fetchResults = async () => {
      // If query is empty and no filters, clear results
      if (!query && activeFilters.length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        if (aiMode) {
          const response = await fetch('/api/wine/ai-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
          const data = await response.json();
          setResults(data);
        } else {
          const params = new URLSearchParams();
          params.append('q', query || ' ');
          activeFilters.forEach(f => {
            if (['Rood', 'Wit', 'Rosé', 'Mousserend'].includes(f)) params.append('type', f);
            if (['Albert Heijn', 'Jumbo', 'Gall & Gall'].includes(f)) params.append('store', f);
          });
          const response = await fetch(`/api/wine/search?${params.toString()}`);
          const data = await response.json();
          setResults(data.map((r: any) => ({
            ...r.wine,
            confidence: r.score,
            emoji: r.wine.type === 'Rood' ? '🍷' : r.wine.type === 'Wit' ? '🥂' : r.wine.type === 'Rosé' ? '🌸' : '🍾'
          })));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeout);
  }, [query, activeFilters]);

  return (
    <div style={{ paddingBottom: '100px', minHeight: '100vh', background: 'var(--wine-soft-bg)' }}>
      {/* Header & Search Bar */}
      <div style={{
        background: 'linear-gradient(160deg, #1A0008 0%, var(--wine-burgundy) 100%)',
        padding: '60px 24px 24px',
        borderRadius: '0 0 36px 36px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={28} />
          </button>
          <h1 style={{ color: 'white', fontSize: '24px', margin: 0 }}>Zoek wijn</h1>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={aiMode ? "Vraag de AI vinoloog: bijv. 'een frisse witte voor bij sushi'..." : "Bijv. Chardonnay Jumbo of Pinot..."}
            style={{
              width: '100%',
              padding: '16px 20px 16px 48px',
              borderRadius: '24px',
              border: aiMode ? '2px solid var(--wine-gold)' : 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              boxShadow: aiMode ? '0 0 20px rgba(212, 175, 55, 0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
              outline: 'none',
              background: 'white',
              color: 'var(--text-main)',
              transition: 'all 0.3s ease'
            }}
          />
          <Search size={20} color={aiMode ? "var(--wine-gold)" : "var(--text-muted)"} style={{ position: 'absolute', left: 16, top: 18 }} />
          
          <button 
            onClick={() => setAiMode(!aiMode)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              background: aiMode ? 'var(--wine-gold)' : 'rgba(128,0,32,0.1)',
              color: aiMode ? 'black' : 'var(--wine-burgundy)',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {aiMode ? '⚡ AI AAN' : 'AI MODUS'}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '16px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: activeFilters.includes(f) ? 'var(--wine-gold)' : 'rgba(255,255,255,0.15)',
                color: activeFilters.includes(f) ? '#1f1a0e' : 'white',
                border: `1px solid ${activeFilters.includes(f) ? 'var(--wine-gold)' : 'rgba(255,255,255,0.2)'}`,
                transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-safe" style={{ paddingTop: '24px' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}
            >
              <div className="wine-spinner" style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid rgba(128,0,32,0.1)', 
                borderTopColor: 'var(--wine-burgundy)', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Wijnen ophalen uit Hamersma...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {results.length} resultaten
              </p>
              {results.map((wine, index) => (
                <motion.div
                  key={wine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(wine)}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{
                    minWidth: '64px', height: '64px', borderRadius: '16px',
                    background: wine.type === 'Rood' ? 'linear-gradient(135deg, var(--wine-burgundy), #4a001a)' 
                              : wine.type === 'Wit' ? 'linear-gradient(135deg, var(--wine-dark-green), #0d1f03)'
                              : 'linear-gradient(135deg, #FFB6C1, #e895a6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {wine.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)', lineHeight: 1.2 }}>{wine.name}</p>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--wine-gold)', display: 'block' }}>{wine.year}</span>
                        {wine.score && (
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>★ {wine.score}</span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{wine.winery}</p>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--wine-burgundy)', fontWeight: 600, background: 'rgba(128,0,32,0.06)', padding: '2px 8px', borderRadius: '10px' }}>
                        <Grape size={12} /> {wine.grape}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.06)', padding: '2px 8px', borderRadius: '10px' }}>
                        <Store size={12} /> {wine.store}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : query.length > 0 || activeFilters.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🍷</div>
              <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>Geen wijnen gevonden</p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Probeer een andere zoekterm of voeg de wijn handmatig toe.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchScreen;
