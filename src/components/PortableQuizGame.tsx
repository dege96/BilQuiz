import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Users, Plus } from "lucide-react";
import { useQuizReader } from "@/components/portable/quiz-reader/useQuizReader";
import { defaultQuestions } from "@/components/portable/quiz-reader/questions";
import "@/components/portable/quiz-reader/quiz-reader.css";

interface Team {
  id: string;
  name: string;
  score: number;
}

interface PortableQuizGameProps {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  onBack: () => void;
  onHome: () => void;
}

const PortableQuizGame = ({ teams, setTeams, onHome }: PortableQuizGameProps) => {
  const [readerIndex, setReaderIndex] = useState(0);
  const [showReaderAnnouncement, setShowReaderAnnouncement] = useState(true);
  const [pendingAction, setPendingAction] = useState<'start' | 'next'>('start');

  const {
    currentQuestions,
    currentRound,
    startGame,
    nextReader,
    restart,
  } = useQuizReader({ questions: defaultQuestions, questionsPerRound: 5 });

  // memoized current reader to avoid undefined
  const currentReader = useMemo(() => teams[readerIndex], [teams, readerIndex]);

  useEffect(() => {
    // when coming into the game, show announcement for the first reader
    setShowReaderAnnouncement(true);
    setPendingAction('start');
    restart();
  }, [restart]);

  const handleContinueAfterAnnouncement = () => {
    setShowReaderAnnouncement(false);
    if (pendingAction === 'start') {
      startGame();
    } else {
      nextReader();
    }
  };

  const handleNextReader = () => {
    // move to next team and show announcement
    setReaderIndex((prev) => (prev + 1) % teams.length);
    setPendingAction('next');
    setShowReaderAnnouncement(true);
  };

  const givePointToTeam = (teamId: string) => {
    const updated = teams.map((t) => (t.id === teamId ? { ...t, score: t.score + 1 } : t));
    setTeams(updated);
  };

  if (showReaderAnnouncement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
        <div className="max-w-4xl mx-auto pt-8 flex items-center justify-center min-h-[80vh]">
          <Card className="p-8 sm:p-12 bg-card/95 backdrop-blur-sm shadow-2xl text-center w-full">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6">
              {currentReader?.name} är läsare
            </h2>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">
              {pendingAction === 'start' ? 'Tryck för att starta omgången med 5 slumpfrågor.' : 'Tryck för att visa nästa 5 slumpfrågor.'}
            </p>
            <Button
              onClick={handleContinueAfterAnnouncement}
              className="h-14 sm:h-16 w-full sm:w-auto px-10 text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary font-semibold"
            >
              Fortsätt
            </Button>
            <div className="mt-4">
              <Button variant="outline" onClick={onHome} className="h-12 w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Hem
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
      <div className="max-w-4xl mx-auto pt-6 sm:pt-8">
        {/* Scoreboard */}
        <Card className="p-4 mb-4 sm:mb-6 bg-card/95 backdrop-blur-sm shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-foreground">Poäng</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className={`px-4 py-2 rounded-lg border-2 relative ${
                  index === readerIndex
                    ? 'bg-muted border-accent text-foreground'
                    : 'bg-gradient-to-r from-muted to-muted/50 border-border text-foreground'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-base sm:text-lg">{team.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-xl sm:text-2xl font-bold text-primary">{team.score}</div>
                    <Button
                      size="sm"
                      onClick={() => givePointToTeam(team.id)}
                      className="w-8 h-8 p-0 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/80 hover:to-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {index === readerIndex && (
                    <div className="text-xs text-muted-foreground">LÄSARE</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {currentQuestions.map((q, idx) => (
            <Card key={q.id} className="p-4 sm:p-6 bg-card/95 backdrop-blur-sm shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{q.question}</h3>
                  <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3">
                    <div className="text-green-400 text-sm font-semibold mb-1">✓ Svar</div>
                    <div className="text-green-400 font-semibold">{q.answer}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="p-4 sm:p-6 bg-card/95 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={handleNextReader} className="h-12 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary font-semibold w-full">
              Nästa uppläsare
            </Button>
            <Button variant="outline" onClick={onHome} className="h-12 w-full">
              <Home className="w-5 h-5 mr-2" />
              Hem
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PortableQuizGame;
