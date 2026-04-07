import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from '../ui/DesignSystem';
import { Wine, Grape, Award, Clock, ChevronRight } from 'lucide-react';
import { useWines } from '../context/WineContext';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { wines } = useWines();

  // Calculate stats
  const totalWines = wines.length;
  
  // Find favorite grape (most frequent among wines with rating >= 8)
  const getFavoriteGrape = () => {
    if (totalWines === 0) return 'Geen';
    const grapeCounts: Record<string, number> = {};
    wines.forEach(w => {
      if (w.rating >= 7) {
        grapeCounts[w.grape] = (grapeCounts[w.grape] || 0) + 1;
      }
    });
    const sorted = Object.entries(grapeCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : wines[0].grape;
  };

  const favoriteGrape = getFavoriteGrape();
  const favoriteStyle = totalWines > 0 ? (wines[0].sliders.body > 6 ? 'Vol & Krachtig' : 'Licht & Fruitig') : 'N.v.t.';

  const stats = [
    { label: 'Beoordeeld', value: totalWines.toString(), icon: Wine, color: 'var(--wine-burgundy)' },
    { label: 'Favoriete druif', value: favoriteGrape, icon: Grape, color: 'var(--wine-dark-green)' },
    { label: 'Stijl', value: favoriteStyle, icon: Award, color: 'var(--wine-gold)' },
  ];

  const lastWine = wines.length > 0 ? wines[0] : null;

  const ctaCards = [
    { title: 'Nieuwe wijn beoordelen', subtitle: 'Deel je mening', icon: '🍾', screen: 'rate', bg: 'linear-gradient(135deg, var(--wine-burgundy), #4a001a)' },
    { title: 'Bekijk smaakprofiel', subtitle: 'Jouw insights', icon: '🎯', screen: 'profile', bg: 'linear-gradient(135deg, var(--wine-dark-green), #0d1f03)' },
    { title: 'Aanbevelingen', subtitle: 'Op maat gemaakt', icon: '✨', screen: 'recommendations', bg: 'linear-gradient(135deg, #8B7355, #5a4a30)' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Progress logic
  const progressPercent = Math.min(Math.round((totalWines / 20) * 100), 100);

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--wine-deep-red) 0%, var(--wine-burgundy) 100%)',
        padding: '60px 24px 32px',
        borderRadius: '0 0 36px 36px',
        marginBottom: '24px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>Welkom terug,</p>
        <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '24px' }}>Jouw wijnjourney</h1>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 500 }}>Profiel opbouw</span>
            <span style={{ color: 'var(--wine-gold)', fontSize: '13px', fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', background: 'var(--wine-gold)', borderRadius: '3px' }}
            />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '6px' }}>
            {totalWines < 20 ? `Nog ${20 - totalWines} wijnen om je profiel te voltooien` : 'Profiel voltooid! 🎉'}
          </p>
        </div>
      </div>

      <motion.div
        className="p-safe"
        style={{ paddingTop: 0 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Row */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <PremiumCard key={label} padding="12px">
              <div style={{ marginBottom: '8px' }}>
                <Icon size={20} color={color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </PremiumCard>
          ))}
        </motion.div>

        {/* Last Rating */}
        {lastWine && (
          <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Laatste beoordeling
            </p>
            <PremiumCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--wine-burgundy), #4a001a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px'
                  }}>🍷</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lastWine.date}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '15px' }}>{lastWine.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lastWine.winery || lastWine.grape}</p>
                  </div>
                </div>
                <div style={{
                  background: 'var(--wine-soft-bg)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--wine-burgundy)' }}>{lastWine.rating}</span>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/10</p>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* CTA Cards */}
        <motion.div variants={itemVariants}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Snelle acties
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ctaCards.map(({ title, subtitle, icon, bg, screen }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(screen)}
                style={{
                  background: bg,
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>{icon}</div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{subtitle}</p>
                  </div>
                </div>
                <ChevronRight color="rgba(255,255,255,0.5)" size={20} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
