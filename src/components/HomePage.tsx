import { Car, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HomePageProps {
  onStartGame: () => void;
}

const HomePage = ({ onStartGame }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-glow to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 text-center shadow-2xl bg-card/95 backdrop-blur-sm">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            SPEL FÖR
            <br />
            <span className="text-primary">BILRESOR</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Kul quiz för hela familjen under resan!
          </p>
        </div>

        <Button 
          onClick={onStartGame}
          size="lg"
          className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
        >
          <Play className="w-6 h-6 mr-3" />
          SPELA NU
        </Button>

        <div className="mt-6 text-sm text-muted-foreground">
          Skapa lag och testa era kunskaper om världens huvudstäder
        </div>
      </Card>
    </div>
  );
};

export default HomePage;