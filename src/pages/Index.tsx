import { useState } from "react";
import HomePage from "@/components/HomePage";
import CreateTeams from "@/components/CreateTeams";
import GameMenu from "@/components/GameMenu";
import CapitalsGame from "@/components/CapitalsGame";
import PortableQuizGame from "@/components/PortableQuizGame";

interface Team {
  id: string;
  name: string;
  score: number;
}

type GameState = 'home' | 'teams' | 'menu' | 'capitals' | 'portable-quiz';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [teams, setTeams] = useState<Team[]>([]);

  const handleStartGame = () => {
    setGameState('teams');
  };

  const handleTeamsContinue = () => {
    setGameState('menu');
  };

  const handleSelectGame = (gameType: string) => {
    if (gameType === 'capitals') {
      setGameState('capitals');
    }
    if (gameType === 'portable-quiz') {
      setGameState('portable-quiz');
    }
  };

  const handleBackToHome = () => {
    setGameState('home');
    setTeams([]);
  };

  const handleBackToTeams = () => {
    setGameState('teams');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const handleResetScores = () => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
  };

  switch (gameState) {
    case 'home':
      return <HomePage onStartGame={handleStartGame} />;
    
    case 'teams':
      return (
        <CreateTeams
          teams={teams}
          setTeams={setTeams}
          onContinue={handleTeamsContinue}
          onBack={handleBackToHome}
        />
      );
    
    case 'menu':
      return (
        <GameMenu
          teams={teams}
          onSelectGame={handleSelectGame}
          onBack={handleBackToTeams}
          onResetScores={handleResetScores}
        />
      );
    
    case 'capitals':
      return (
        <CapitalsGame
          teams={teams}
          setTeams={setTeams}
          onBack={handleBackToMenu}
          onHome={handleBackToMenu}
        />
      );

    case 'portable-quiz':
      return (
        <PortableQuizGame
          teams={teams}
          setTeams={setTeams}
          onBack={handleBackToMenu}
          onHome={handleBackToMenu}
        />
      );
    
    default:
      return <HomePage onStartGame={handleStartGame} />;
  }
};

export default Index;
