import { Globe, Users, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Team {
  id: string;
  name: string;
  score: number;
}

interface GameMenuProps {
  teams: Team[];
  onSelectGame: (gameType: string) => void;
  onBack: () => void;
  onResetScores?: () => Promise<void> | void;
}

const GameMenu = ({ teams, onSelectGame, onBack, onResetScores }: GameMenuProps) => {
  const games = [
    {
      id: "capitals",
      name: "HUVUDSTÄDER",
      description: "Gissa världens huvudstäder",
      icon: Globe,
      color: "from-primary to-primary-glow",
      available: true,
    },
    {
      id: "portable-quiz",
      name: "ALLMÄNT QUIZ",
      description: "5 slumpfrågor med facit, nästa uppläsare roterar",
      icon: Users,
      color: "from-accent to-accent/80",
      available: true,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
      <div className="max-w-4xl mx-auto pt-6 sm:pt-8">
        <Card className="p-4 sm:p-6 bg-card/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Välj Spel</h1>
            <div className="flex flex-wrap justify-center gap-2 mb-2 sm:mb-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-gradient-to-r from-muted to-muted/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border"
                >
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {team.name}: {team.score} poäng
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <Card
                  key={game.id}
                  className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 sm:hover:scale-105 border-0 bg-gradient-to-r from-card to-card/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center shadow-lg mx-auto sm:mx-0`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">{game.name}</h3>
                      <p className="text-muted-foreground text-base sm:text-lg">{game.description}</p>
                    </div>
                    <Button
                      onClick={() => onSelectGame(game.id)}
                      disabled={!game.available}
                      className={`w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 text-base sm:text-lg font-semibold bg-gradient-to-r ${game.color} hover:shadow-glow transition-all duration-300`}
                    >
                      Starta
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:flex sm:items-center sm:justify-between gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka till lag
            </Button>
            <Button
              variant="outline"
              onClick={onResetScores}
              className="w-full sm:w-auto px-6 py-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Återställ poäng
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameMenu;