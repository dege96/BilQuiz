# Quiz Reader (Portabel modul)

En fristående modul som kan dras-och-släppas in i valfri React-app utan externa UI-beroenden.

## Snabbstart

1. Kopiera hela mappen `src/portable/quiz-reader` till din applikation.
2. Importera komponenten och (valfritt) standardfrågor i din sida/komponent:

```tsx
import { QuizReader, defaultQuestions } from "./src/portable/quiz-reader";
import "./src/portable/quiz-reader/quiz-reader.css";

export default function Page() {
  return (
    <QuizReader questions={defaultQuestions} questionsPerRound={5} />
  );
}
```

Modulen fungerar även utan att skicka in `questions` – då används inbyggda `defaultQuestions` från mappen.

## API

- `QuizReader` (komponent)
  - `questions?: Question[]` – egna frågor (valfritt)
  - `questionsPerRound?: number` – antal frågor per omgång (default 5)
  - `title?: string` – titeltext
  - `showAnswers?: boolean` – om svaren visas direkt (default true)
  - `startButtonLabel?: string` – text på startknappen
  - `nextButtonLabel?: string` – text på knappen för nästa uppläsare
  - `restartButtonLabel?: string` – text på återställningsknappen
  - `className?: string` – valfri extra klass på rotcontainern

- `useQuizReader` (hook)
  - `questionsPerRound?: number`
  - `initialState?: 'start' | 'playing'`
  - `questions?: Question[]`

- `defaultQuestions: Question[]`

- `Question` (typ)
  ```ts
  interface Question {
    id: number;
    question: string;
    answer: string;
    type: 'open' | 'multiple-choice';
    options?: string[];
  }
  ```

## Stil

- Importera `quiz-reader.css` för grundläggande styling. Alla klasser är prefixade med `qr-` för att undvika kollisioner.
- Du kan skriva över stilarna genom att lägga egen CSS efter importen, eller via `className`-prop på komponenten.

## Inga externa beroenden

- Modulen använder endast React. Ingen Tailwind, shadcn eller Router krävs.

## Tips vid migrering

- Om du redan har ett frågebibliotek: transformera det till `Question[]` och skicka via prop `questions`.
- Vill du dölja svaren för deltagare? Sätt `showAnswers={false}` och lägg t.ex. en knapp för att toggla.
