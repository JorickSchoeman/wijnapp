import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Info } from 'lucide-react';

interface Wine {
  id: number;
  name: string;
  winery: string;
  region: string;
  type: string;
  score: number;
  price: string;
  emoji: string;
  reason: string;
  gradient: string;
  tags: string[];
}

const wines: Wine[] = [
  {
    id: 1,
    name: 'Gevrey-Chambertin',
    winery: 'Rossignol-Trapet',
    region: 'Bourgogne, Frankrijk',
    type: 'Rood • Pinot Noir',
    score: 94,
    price: '€ 48',
    emoji: '🍷',
    reason: 'Aanbevolen omdat je fruitige Pinot Noir hoog beoordeelt',
    gradient: 'linear-gradient(160deg, #3a0010 0%, var(--wine-burgundy) 100%)',
    tags: ['Fruitig', 'Elegant', 'Droog'],
  },
  {
    id: 2,
    name: 'Barolo Classico',
    winery: 'Giacomo Conterno',
    region: 'Piemonte, Italië',
    type: 'Rood • Nebbiolo',
    score: 96,
    price: '€ 89',
    emoji: '🍾',
    reason: 'Jouw voorkeur voor volle, complexe rode wijnen',
    gradient: 'linear-gradient(160deg, #1a120a 0%, #8B4513 100%)',
    tags: ['Vol', 'Krachtig', 'Houtgerijpt'],
  },
  {
    id: 3,
    name: 'Chablis Premier Cru',
    winery: 'William Fèvre',
    region: 'Bourgogne, Frankrijk',
    type: 'Wit • Chardonnay',
    score: 92,
    price: '€ 36',
    emoji: '🥂',
    reason: 'Past bij jouw liefde voor minerale, droge wijnen',
    gradient: 'linear-gradient(160deg, var(--wine-dark-green) 0%, #2d5c0e 100%)',
    tags: ['Droog', 'Fris', 'Mineraal'],
  },
  {
    id: 4,
    name: 'Rioja Reserva',
    winery: 'Marqués de Riscal',
    region: 'La Rioja, Spanje',
    type: 'Rood • Tempranillo',
    score: 91,
    price: '€ 22',
    emoji: '🍇',
    reason: 'Fruitig en elegant, net als jouw favoriet Château Margaux',
    gradient: 'linear-gradient(160deg, #2a0a2e 0%, #6B1E6B 100%)',
    tags: ['Fruitig', 'Zacht', 'Elegant'],
  },
];

const SwipeCard: React.FC<{
  wine: Wine;
  onSwipe: (dir: 'left' | 'right') => void;
  isTop: boolean;
  index: number;
}> = ({ wine, onSwipe, isTop, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: never, info: { offset: { x: number } }) => {
    if (info.offset.x > 80) onSwipe('right');
    else if (info.offset.x < -80) onSwipe('left');
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      style={{
        x,
        rotate,
        position: 'absolute',
        width: '100%',
        scale: 1 - index * 0.04,
        y: index * 12,
        zIndex: 10 - index,
        cursor: isTop ? 'grab' : 'default',
      }}
      dragConstraints={{ left: -200, right: 200 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Like / Nope overlays */}
      {isTop && (
        <>
          <motion.div style={{
            position: 'absolute', top: 24, left: 24, zIndex: 20, opacity: likeOpacity,
            background: 'rgba(34, 197, 94, 0.9)', borderRadius: '12px', padding: '8px 16px',
            border: '2px solid #22c55e', transform: 'rotate(-5deg)',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>BEWAAR</span>
          </motion.div>
          <motion.div style={{
            position: 'absolute', top: 24, right: 24, zIndex: 20, opacity: nopeOpacity,
            background: 'rgba(239, 68, 68, 0.9)', borderRadius: '12px', padding: '8px 16px',
            border: '2px solid #ef4444', transform: 'rotate(5deg)',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>SKIP</span>
          </motion.div>
        </>
      )}

      {/* Card */}
      <div style={{
        background: wine.gradient,
        borderRadius: '28px',
        padding: '32px 24px 24px',
        minHeight: '380px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isTop ? '0 20px 60px rgba(0,0,0,0.25)' : 'none',
      }}>
        {/* Score badge */}
        <div style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          borderRadius: '14px', padding: '8px 14px', textAlign: 'center',
        }}>
          <span style={{ color: 'var(--wine-gold)', fontWeight: 800, fontSize: '20px' }}>{wine.score}</span>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>punten</p>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>{wine.emoji}</div>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '4px' }}>{wine.type}</p>
        <h2 style={{ color: 'white', fontSize: '26px', marginBottom: '4px' }}>{wine.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '4px' }}>{wine.winery}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>{wine.region}</p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {wine.tags.map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.12)', borderRadius: '20px',
              padding: '6px 14px', fontSize: '12px', color: 'white', fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>

        {/* Reason */}
        <div style={{
          background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <Info size={16} color="rgba(255,255,255,0.6)" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.5 }}>
            {wine.reason}
          </p>
        </div>

        {/* Price */}
        <div style={{ position: 'absolute', bottom: 24, right: 24 }}>
          <span style={{ color: 'var(--wine-gold)', fontWeight: 700, fontSize: '18px' }}>{wine.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Recommendations: React.FC = () => {
  const [deck, setDeck] = useState(wines);
  const [saved, setSaved] = useState<Wine[]>([]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (dir === 'right') setSaved(prev => [deck[0], ...prev]);
    setDeck(prev => prev.slice(1));
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0a00 0%, #8B7355 100%)',
        padding: '60px 24px 32px',
        borderRadius: '0 0 36px 36px',
        marginBottom: '32px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>Op maat gemaakt</p>
        <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '4px' }}>Aanbevelingen</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Swipe → om te bewaren • ← om te skippen</p>
      </div>

      <div className="p-safe" style={{ paddingTop: 0 }}>
        {deck.length > 0 ? (
          <>
            {/* Swipe Stack */}
            <div style={{ position: 'relative', height: '420px', marginBottom: '36px' }}>
              <AnimatePresence>
                {deck.slice(0, 3).map((wine, index) => (
                  <SwipeCard
                    key={wine.id}
                    wine={wine}
                    onSwipe={handleSwipe}
                    isTop={index === 0}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('left')}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid rgba(0,0,0,0.06)',
                }}
              >
                <X size={28} color="#ef4444" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('right')}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--wine-burgundy)', boxShadow: '0 4px 16px rgba(128,0,32,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Heart size={28} color="white" fill="white" />
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white', borderRadius: '28px', padding: '40px 24px',
              textAlign: 'center', boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ marginBottom: '8px', color: 'var(--wine-burgundy)' }}>Dat was hem!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Kom morgen terug voor nieuwe aanbevelingen op basis van je profiel.
            </p>
          </motion.div>
        )}

        {/* Saved wines */}
        {saved.length > 0 && (
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Bewaard ({saved.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {saved.map(wine => (
                <motion.div
                  key={wine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: 'white', borderRadius: '20px', padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: wine.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                  }}>{wine.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '14px' }}>{wine.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{wine.region}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: 'var(--wine-burgundy)', fontSize: '13px' }}>{wine.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
