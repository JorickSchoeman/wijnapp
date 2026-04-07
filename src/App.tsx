import { useState } from 'react';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import AddWineFlow from './screens/AddWineFlow';
import TasteProfile from './screens/TasteProfile';
import Recommendations from './screens/Recommendations';
import BottomNav from './ui/BottomNav';
import { AnimatePresence, motion } from 'framer-motion';
import { WineProvider } from './context/WineContext';

type Screen = 'onboarding' | 'dashboard' | 'rate' | 'profile' | 'recommendations';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onStart={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <Dashboard onNavigate={(s) => setCurrentScreen(s as Screen)} />;
      case 'rate':
        return <AddWineFlow onComplete={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <TasteProfile />;
      case 'recommendations':
        return <Recommendations />;
      default:
        return <Dashboard onNavigate={(s) => setCurrentScreen(s as Screen)} />;
    }
  };

  return (
    <WineProvider>
      <div className="app-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {currentScreen !== 'onboarding' && (
          <BottomNav 
            active={currentScreen} 
            onNavigate={(screen) => setCurrentScreen(screen as Screen)} 
          />
        )}
      </div>
    </WineProvider>
  );
}

export default App;
