import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard } from '../ui/DesignSystem';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Grape } from 'lucide-react';
import { useWines } from '../context/WineContext';

const TasteProfile: React.FC = () => {
  const { wines } = useWines();

  // Calculate radar data based on averages
  const calculateRadarData = () => {
    if (wines.length === 0) return [
      { subject: 'Fruitig', A: 0 }, { subject: 'Droog', A: 0 }, { subject: 'Vol', A: 0 },
      { subject: 'Kruidig', A: 0 }, { subject: 'Houtgerijpt', A: 0 }, { subject: 'Zacht', A: 0 }
    ];

    const sums = { fruitig: 0, droog: 0, vol: 0, kruidig: 0, hout: 0, zacht: 0 };
    wines.forEach(w => {
      sums.fruitig += w.sliders.fruitigheid;
      sums.droog += (11 - w.sliders.zoetheid); // Droog is inverse of Zoet
      sums.vol += w.sliders.body;
      sums.kruidig += w.sliders.kruidigheid;
      sums.hout += w.sliders.houtigheid;
      sums.zacht += (11 - w.sliders.tannine); // Zacht is inverse of Tannine
    });

    const count = wines.length;
    return [
      { subject: 'Fruitig', A: sums.fruitig / count },
      { subject: 'Droog', A: sums.droog / count },
      { subject: 'Vol', A: sums.vol / count },
      { subject: 'Kruidig', A: sums.kruidig / count },
      { subject: 'Houtgerijpt', A: sums.hout / count },
      { subject: 'Zacht', A: sums.zacht / count },
    ];
  };

  const radarData = calculateRadarData();

  // Calculate top grapes
  const getTopGrapes = () => {
    const counts: Record<string, number> = {};
    wines.forEach(w => counts[w.grape] = (counts[w.grape] || 0) + 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / wines.length) * 100),
        color: name.toLowerCase().includes('wit') ? 'var(--wine-dark-green)' : 'var(--wine-burgundy)'
      }));
  };

  const topGrapes = wines.length > 0 ? getTopGrapes() : [];
  
  // Natural language summary
  const getSummary = () => {
    if (wines.length === 0) return "Begin met het beoordelen van wijnen om je profiel op te bouwen.";
    const topTrait = [...radarData].sort((a, b) => b.A - a.A)[0].subject.toLowerCase();
    return `Je houdt vooral van ${topTrait}e wijnen. Op basis van je ${wines.length} beoordelingen zien we een sterke voorkeur voor ${topGrapes[0]?.name || 'specifieke'} druiven.`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, var(--wine-dark-green) 0%, #2d5c0e 100%)',
        padding: '60px 24px 32px',
        borderRadius: '0 0 36px 36px',
        marginBottom: '24px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>Jouw unieke stijl</p>
        <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '16px' }}>Smaakprofiel</h1>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <p style={{ color: 'white', fontSize: '15px', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{getSummary()}"
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
        {/* Radar Chart */}
        <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
          <PremiumCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '16px' }}>Smaakwiel</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gebaseerd op {wines.length} beoordelingen</p>
              </div>
              <TrendingUp size={20} color="var(--wine-dark-green)" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'Inter' }}
                />
                <Radar
                  name="Jouw profiel"
                  dataKey="A"
                  stroke="var(--wine-burgundy)"
                  fill="var(--wine-burgundy)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </PremiumCard>
        </motion.div>

        {/* Dynamic Grapes */}
        {topGrapes.length > 0 && (
          <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
            <PremiumCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ fontWeight: 700, fontSize: '16px' }}>Favoriete druiven</p>
                <Grape size={18} color="var(--wine-burgundy)" />
              </div>
              {topGrapes.map(({ name, percentage, color }) => (
                <div key={name} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{percentage}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ height: '100%', background: color, borderRadius: '4px' }}
                    />
                  </div>
                </div>
              ))}
            </PremiumCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TasteProfile;
