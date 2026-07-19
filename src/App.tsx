import { AnimatePresence } from 'framer-motion';
import { SessionProvider, useSession } from '@/context/SessionContext';
import BreathBackground from '@/components/BreathBackground';
import HomeScreen from '@/screens/HomeScreen';
import AnchorScreen from '@/screens/AnchorScreen';
import AllowScreen from '@/screens/AllowScreen';
import AcceptNarrativeScreen from '@/screens/AcceptNarrativeScreen';
import SparkScreen from '@/screens/SparkScreen';
import SparkBodyScreen from '@/screens/SparkBodyScreen';
import BreakdownScreen from '@/screens/BreakdownScreen';
import DoneScreen from '@/screens/DoneScreen';
import SocraticScreen from '@/screens/SocraticScreen';
import ExitScreen from '@/screens/ExitScreen';
import StayScreen from '@/screens/StayScreen';
import WordsWallScreen from '@/screens/WordsWallScreen';

function ScreenRouter() {
  const { state } = useSession();
  const { currentScreen, currentPath } = state;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen key="home" />;
      case 'anchor':
        return <AnchorScreen key="anchor" />;
      case 'allow':
        return <AllowScreen key="allow" />;
      case 'accept-narrative':
        return <AcceptNarrativeScreen key="accept-narrative" />;
      case 'spark':
        return <SparkScreen key="spark" />;
      case 'spark-body':
        return <SparkBodyScreen key="spark-body" />;
      case 'breakdown':
        return <BreakdownScreen key="breakdown" />;
      case 'done':
        return <DoneScreen key="done" />;
      case 'socratic':
        return <SocraticScreen key="socratic" />;
      case 'exit':
        return <ExitScreen key="exit" />;
      case 'stay':
        return <StayScreen key="stay" />;
      case 'words-wall':
        return <WordsWallScreen key="words-wall" />;
      default:
        return <HomeScreen key="home" />;
    }
  };

  return (
    <>
      <BreathBackground currentPath={currentPath} />
      <div className="container">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
    </>
  );
}

function App() {
  return (
    <SessionProvider>
      <ScreenRouter />
    </SessionProvider>
  );
}

export default App;
