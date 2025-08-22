-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create capitals table with Swedish data
CREATE TABLE public.capitals (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  capital TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capitals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for this game)
CREATE POLICY "Games are publicly accessible" 
ON public.games 
FOR ALL 
USING (true);

CREATE POLICY "Teams are publicly accessible" 
ON public.teams 
FOR ALL 
USING (true);

CREATE POLICY "Capital cities are publicly readable" 
ON public.capitals 
FOR SELECT 
USING (true);

-- Insert sample capital cities data
INSERT INTO public.capitals (country, capital) VALUES
('Sverige', 'Stockholm'),
('Norge', 'Oslo'),
('Danmark', 'Köpenhamn'),
('Finland', 'Helsingfors'),
('Island', 'Reykjavik'),
('Tyskland', 'Berlin'),
('Frankrike', 'Paris'),
('Italien', 'Rom'),
('Spanien', 'Madrid'),
('Storbritannien', 'London'),
('Nederländerna', 'Amsterdam'),
('Belgien', 'Bryssel'),
('Schweiz', 'Bern'),
('Österrike', 'Wien'),
('Polen', 'Warszawa'),
('Tjeckien', 'Prag'),
('Ungern', 'Budapest'),
('Kroatien', 'Zagreb'),
('Grekland', 'Aten'),
('Portugal', 'Lissabon'),
('Irland', 'Dublin'),
('Ryssland', 'Moskva'),
('Ukraina', 'Kiev'),
('Turkiet', 'Ankara'),
('Japan', 'Tokyo'),
('Kina', 'Peking'),
('Indien', 'New Delhi'),
('Australien', 'Canberra'),
('Kanada', 'Ottawa'),
('USA', 'Washington D.C.'),
('Brasilien', 'Brasília'),
('Argentina', 'Buenos Aires'),
('Chile', 'Santiago'),
('Peru', 'Lima'),
('Colombia', 'Bogotá'),
('Mexiko', 'Mexico City'),
('Egypten', 'Kairo'),
('Sydafrika', 'Kapstaden'),
('Marocko', 'Rabat'),
('Kenya', 'Nairobi'),
('Nigeria', 'Abuja'),
('Etiopien', 'Addis Abeba'),
('Thailand', 'Bangkok'),
('Vietnam', 'Hanoi'),
('Sydkorea', 'Seoul'),
('Nordkorea', 'Pyongyang'),
('Malaysia', 'Kuala Lumpur'),
('Singapore', 'Singapore'),
('Indonesien', 'Jakarta'),
('Filippinerna', 'Manila'),
('Nya Zeeland', 'Wellington'),
('Israel', 'Jerusalem'),
('Iran', 'Teheran'),
('Irak', 'Bagdad'),
('Saudiarabien', 'Riyadh'),
('Förenade Arabemiraten', 'Abu Dhabi'),
('Kazakstan', 'Nur-Sultan'),
('Uzbekistan', 'Tasjkent'),
('Afghanistan', 'Kabul'),
('Pakistan', 'Islamabad'),
('Bangladesh', 'Dhaka'),
('Nepal', 'Katmandu'),
('Sri Lanka', 'Colombo'),
('Myanmar', 'Naypyidaw'),
('Laos', 'Vientiane'),
('Kambodja', 'Phnom Penh'),
('Mongoliet', 'Ulaanbaatar'),
('Azerbajdzjan', 'Baku'),
('Armenien', 'Jerevan'),
('Georgien', 'Tbilisi'),
('Belarus', 'Minsk'),
('Litauen', 'Vilnius'),
('Lettland', 'Riga'),
('Estland', 'Tallinn'),
('Rumänien', 'Bukarest'),
('Bulgarien', 'Sofia'),
('Serbien', 'Belgrad'),
('Montenegro', 'Podgorica'),
('Bosnien och Hercegovina', 'Sarajevo'),
('Nordmakedonien', 'Skopje'),
('Albanien', 'Tirana'),
('Moldavien', 'Chisinau'),
('Slovakien', 'Bratislava'),
('Slovenien', 'Ljubljana'),
('Malta', 'Valletta'),
('Cypern', 'Nicosia'),
('Luxemburg', 'Luxemburg'),
('Monaco', 'Monaco'),
('Andorra', 'Andorra la Vella'),
('San Marino', 'San Marino'),
('Vatikanstaten', 'Vatikanstaten'),
('Liechtenstein', 'Vaduz');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;