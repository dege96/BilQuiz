import { useState, useEffect } from "react";
import { ArrowRight, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  score: number;
}

interface Capital {
  id: number;
  country: string;
  capital: string;
}

interface CapitalsGameProps {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  onBack: () => void;
  onHome: () => void;
}

const CapitalsGame = ({ teams, setTeams, onBack, onHome }: CapitalsGameProps) => {
  const [capitals, setCapitals] = useState<Capital[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Capital | null>(null);
  const [readerIndex, setReaderIndex] = useState(0);
  const [gameId, setGameId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [showReaderAnnouncement, setShowReaderAnnouncement] = useState(true);

  // Load capitals and initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Load capitals from database
        const { data: capitalsData, error: capitalsError } = await supabase
          .from('capitals')
          .select('*');

        if (capitalsError) throw capitalsError;
        
        setCapitals(capitalsData || []);

        // Create game session
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .insert({ name: 'Huvudstäder' })
          .select()
          .single();

        if (gameError) throw gameError;
        
        const newGameId = gameData.id;
        setGameId(newGameId);

        // Save teams to database
        const teamsData = teams.map(team => ({
          game_id: newGameId,
          name: team.name,
          score: team.score,
        }));

        const { error: teamsError } = await supabase
          .from('teams')
          .insert(teamsData);

        if (teamsError) throw teamsError;

        // Set first question
        if (capitalsData && capitalsData.length > 0) {
          const randomCapital = capitalsData[Math.floor(Math.random() * capitalsData.length)];
          setCurrentQuestion(randomCapital);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing game:', error);
        toast({
          title: "Fel vid spelstart",
          description: "Kunde inte ladda spelet. Försök igen.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    // Only initialize once when game starts
    if (!gameId) {
      initializeGame();
    }
  }, []);

  const givePointToTeam = async (teamId: string) => {
    const updatedTeams = teams.map(team => 
      team.id === teamId 
        ? { ...team, score: team.score + 1 }
        : team
    );
    
    setTeams(updatedTeams);

    // Update score in database
    const team = teams.find(t => t.id === teamId);
    if (team && gameId) {
      try {
        const { error } = await supabase
          .from('teams')
          .update({ score: team.score + 1 })
          .eq('game_id', gameId)
          .eq('name', team.name);

        if (error) throw error;

        toast({
          title: "Poäng till " + team.name + "!",
          description: `${team.name} har nu ${team.score + 1} poäng`,
        });
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }

    // Advance question counter and handle reader changes like nextQuestion
    if (capitals.length === 0) return;
    
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // Check if we need to change reader (every 3 questions)
    if (newQuestionCount % 3 === 0) {
      setReaderIndex((prev) => (prev + 1) % teams.length);
      setShowReaderAnnouncement(true);
      return;
    }
    
    // Get next random question
    const randomCapital = capitals[Math.floor(Math.random() * capitals.length)];
    setCurrentQuestion(randomCapital);
  };

  const nextQuestion = () => {
    if (capitals.length === 0) return;
    
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // Check if we need to change reader (every 3 questions)
    if (newQuestionCount % 3 === 0) {
      setReaderIndex((prev) => (prev + 1) % teams.length);
      setShowReaderAnnouncement(true);
      return;
    }
    
    // Get next random question
    const randomCapital = capitals[Math.floor(Math.random() * capitals.length)];
    setCurrentQuestion(randomCapital);
  };

  const continueAfterAnnouncement = () => {
    setShowReaderAnnouncement(false);
    // Get next random question
    const randomCapital = capitals[Math.floor(Math.random() * capitals.length)];
    setCurrentQuestion(randomCapital);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary flex items-center justify-center">
        <Card className="p-8 bg-card/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground">Laddar spelet...</p>
          </div>
        </Card>
      </div>
    );
  }

  const currentReader = teams[readerIndex];

  // Show reader announcement screen
  if (showReaderAnnouncement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
        <div className="max-w-4xl mx-auto pt-8 flex items-center justify-center min-h-[80vh]">
          <Card className="p-12 bg-card/95 backdrop-blur-sm shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-foreground mb-8">
              {currentReader.name} är läsare
            </h2>
            <Button
              onClick={continueAfterAnnouncement}
              className="h-16 px-12 text-xl bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary font-semibold"
            >
              Fortsätt
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Scoreboard */}
        <Card className="p-4 mb-6 bg-card/95 backdrop-blur-sm shadow-lg">
          <h3 className="text-xl font-bold text-center mb-4 text-foreground">Poäng</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`px-4 py-2 rounded-lg border-2 relative ${
                  team.id === currentReader.id
                    ? 'bg-muted border-accent text-foreground'
                    : 'bg-gradient-to-r from-muted to-muted/50 border-border text-foreground'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">{team.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-2xl font-bold text-primary">{team.score}</div>
                    <Button
                      size="sm"
                      onClick={() => givePointToTeam(team.id)}
                      className="w-8 h-8 p-0 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {team.id === currentReader.id && (
                    <div className="text-xs text-muted-foreground">LÄSARE</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Current Reader */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent">
          <div className="text-center">
            <p className="text-lg text-foreground">
              <strong>Läsare:</strong> {currentReader.name} 
              <span className="text-muted-foreground ml-2">(kan ej få poäng denna runda)</span>
            </p>
          </div>
        </Card>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="p-8 mb-6 bg-card/95 backdrop-blur-sm shadow-2xl text-center">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-foreground mb-2">
                {currentQuestion.country}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mb-4"></div>
              <p className="text-2xl text-primary-glow font-semibold">
                {currentQuestion.capital}
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={nextQuestion}
              className="h-12 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary font-semibold"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Nästa fråga
            </Button>
            
            <Button
              variant="outline"
              onClick={onHome}
              className="h-12"
            >
              <Home className="w-5 h-5 mr-2" />
              Hem
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CapitalsGame;