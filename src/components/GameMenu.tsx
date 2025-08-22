import { Globe, Users, ArrowLeft } from "lucide-react";
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
}

const GameMenu = ({ teams, onSelectGame, onBack }: GameMenuProps) => {
  const games = [
    {
      id: "capitals",
      name: "HUVUDSTÄDER",
      description: "Gissa världens huvudstäder",
      icon: Globe,
      color: "from-primary to-primary-glow",
      available: true,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Välj Spel</h1>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="bg-gradient-to-r from-muted to-muted/50 px-4 py-2 rounded-full border"
                >
                  <span className="text-sm font-medium text-foreground">
                    {team.name}: {team.score} poäng
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            {games.map((game) => {
              const IconComponent = game.icon;
              return (
                <Card
                  key={game.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-r from-card to-card/50"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{game.name}</h3>
                      <p className="text-muted-foreground text-lg">{game.description}</p>
                    </div>
                    <Button
                      onClick={() => onSelectGame(game.id)}
                      disabled={!game.available}
                      className={`px-8 py-3 text-lg font-semibold bg-gradient-to-r ${game.color} hover:shadow-glow transition-all duration-300`}
                    >
                      Starta
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka till lag
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameMenu;