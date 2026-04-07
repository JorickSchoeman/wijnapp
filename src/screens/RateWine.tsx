import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TasteChip, ElegantButton } from '../ui/DesignSystem';
import { Star, Sparkles } from 'lucide-react';
import { useWines } from '../context/WineContext';

interface RateWineProps {
  onSave: () => void;
  initialData?: any;
}

const TasteSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void; low: string; high: string; autoFill?: boolean }> = 
  ({ label, value, onChange, low, high, autoFill }) => (
  <div style={{ marginBottom: '20px', position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {label}
        {autoFill && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Sparkles size={12} color="var(--wine-gold)" /></motion.div>}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--wine-burgundy)', background: 'rgba(128,0,32,0.06)', padding: '2px 8px', borderRadius: '12px' }}>{value}</span>
    </div>
    <input
      type="range" min={1} max={10} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--wine-burgundy)' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{low}</span>
      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{high}</span>
    </div>
  </div>
);

const RateWine: React.FC<RateWineProps> = ({ onSave, initialData }) => {
  const { addWine } = useWines();

  const [wineData, setWineData] = useState({ 
    name: initialData?.name || '', 
    winery: initialData?.winery || '', 
    grape: initialData?.grape || '', 
    region: initialData?.region || '',
    store: initialData?.store || ''
  });
  const [rating, setRating] = useState(7);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [sliders, setSliders] = useState({ zoetheid: 3, zuurgraad: 5, tannine: 6, body: 7, fruitigheid: 7, kruidigheid: 4, houtigheid: 3 });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const tags = ['Fris', 'Zacht', 'Krachtig', 'Elegant', 'Kruidig', 'Fruitig', 'Droog'];

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const updateSlider = (key: string, value: number) => setSliders(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!wineData.name || !wineData.grape) return alert('Vul a.u.b. de naam en druif in.');
    addWine({ ...wineData, rating, sliders, tags: selectedTags, note });
    onSave();
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div style={{ background: 'linear-gradient(160deg, #1A0008 0%, var(--wine-burgundy) 100%)', padding: '56px 24px 36px', borderRadius: '0 0 36px 36px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Wijn Details</p>
            {initialData?.name && <span style={{ color: 'var(--wine-gold)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={14} /> AI Pre-filled</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                placeholder="Naam van de wijn..." value={wineData.name} onChange={(e) => setWineData({...wineData, name: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 16px', color: 'white', outline: 'none', transition: 'border-color 0.3s' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Druif" value={wineData.grape} onChange={(e) => setWineData({...wineData, grape: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px 14px', color: 'white', outline: 'none' }} />
              <input placeholder="Wijnhuis" value={wineData.winery} onChange={(e) => setWineData({...wineData, winery: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px 14px', color: 'white', outline: 'none' }} />
              <input placeholder="Regio" value={wineData.region} onChange={(e) => setWineData({...wineData, region: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px 14px', color: 'white', outline: 'none' }} />
              <input placeholder="Winkel" value={wineData.store} onChange={(e) => setWineData({...wineData, store: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px 14px', color: 'white', outline: 'none' }} />
            </div>
          </div>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Jouw beoordeling</p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[...Array(10)].map((_, i) => (
              <motion.button 
                key={i} 
                whileTap={{ scale: 0.8 }} 
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(i + 1)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <Star size={22} fill={(hoveredStar || rating) >= i + 1 ? 'var(--wine-gold)' : 'transparent'} color={(hoveredStar || rating) >= i + 1 ? 'var(--wine-gold)' : 'rgba(255,255,255,0.4)'} strokeWidth={1.5} />
              </motion.button>
            ))}
            <span style={{ color: 'var(--wine-gold)', fontWeight: 700, fontSize: '18px', marginLeft: '6px' }}>{rating}</span>
          </div>
        </div>
      </div>

      <div className="p-safe" style={{ paddingTop: 0 }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '20px' }}>Geanalyseerd Smaakprofiel</p>
          {[
            { k: 'zoetheid', l: 'Zoetheid', lo: 'Droog', hi: 'Zoet' },
            { k: 'zuurgraad', l: 'Zuurgraad', lo: 'Laag', hi: 'Hoog' },
            { k: 'tannine', l: 'Tannine', lo: 'Zacht', hi: 'Krachtig' },
            { k: 'body', l: 'Body', lo: 'Licht', hi: 'Vol' },
            { k: 'fruitigheid', l: 'Fruitigheid', lo: 'Weinig', hi: 'Veel' },
            { k: 'kruidigheid', l: 'Kruidigheid', lo: 'Mild', hi: 'Kruidig' },
            { k: 'houtigheid', l: 'Houtigheid', lo: 'Fris', hi: 'Hout' },
          ].map(({ k, l, lo, hi }) => (
            <TasteSlider key={k} label={l} value={sliders[k as keyof typeof sliders]} onChange={(v) => updateSlider(k, v)} low={lo} high={hi} />
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>Kenmerken</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(tag => <TasteChip key={tag} label={tag} selected={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} />)}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>Notitie</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Wat vond je ervan?" style={{ width: '100%', minHeight: '80px', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '14px', fontSize: '14px', outline: 'none', background: 'var(--wine-soft-bg)' }} />
        </div>

        <ElegantButton fullWidth onClick={handleSave}>Opslaan</ElegantButton>
      </div>
    </div>
  );
};

export default RateWine;
