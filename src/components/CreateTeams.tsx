import { useState } from "react";
import { Plus, Trash2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  score: number;
}

interface CreateTeamsProps {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CreateTeams = ({ teams, setTeams, onContinue, onBack }: CreateTeamsProps) => {
  const [teamName, setTeamName] = useState("");

  const addTeam = () => {
    if (!teamName.trim()) {
      toast({
        title: "Ogiltigt lagnamn",
        description: "Vänligen ange ett lagnamn",
        variant: "destructive",
      });
      return;
    }

    if (teams.some(team => team.name.toLowerCase() === teamName.toLowerCase())) {
      toast({
        title: "Lagnamnet finns redan",
        description: "Välj ett annat lagnamn",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName.trim(),
      score: 0,
    };

    setTeams([...teams, newTeam]);
    setTeamName("");
    
    toast({
      title: "Lag tillagt!",
      description: `${newTeam.name} har lagts till`,
    });
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  const canContinue = teams.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Skapa Lag</h1>
            <p className="text-muted-foreground">Lägg till minst 2 lag för att spela</p>
          </div>

          {/* Add Team Form */}
          <div className="flex gap-3 mb-8">
            <Input
              placeholder="Ange lagnamn..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeam()}
              className="flex-1 h-12 text-lg"
            />
            <Button
              onClick={addTeam}
              className="h-12 px-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/80 hover:to-accent"
            >
              <Plus className="w-5 h-5 mr-2" />
              Lägg till
            </Button>
          </div>

          {/* Teams List */}
          <div className="space-y-3 mb-8">
            {teams.map((team, index) => (
              <Card key={team.id} className="p-4 bg-gradient-to-r from-muted to-muted/50 border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-lg text-foreground">{team.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeam(team.id)}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {teams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Inga lag tillagda än</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 h-12"
            >
              Tillbaka
            </Button>
            <Button
              onClick={onContinue}
              disabled={!canContinue}
              className="flex-1 h-12 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary disabled:opacity-50"
            >
              Fortsätt
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {!canContinue && teams.length > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-3">
              Lägg till minst {2 - teams.length} till lag för att fortsätta
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateTeams;