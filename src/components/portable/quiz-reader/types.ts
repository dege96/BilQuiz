export interface Question {
  id: number;
  question: string;
  answer: string;
  type: 'open' | 'multiple-choice';
  options?: string[];
}

export interface QuizReaderOptions {
  questionsPerRound?: number;
  initialState?: 'start' | 'playing';
}

