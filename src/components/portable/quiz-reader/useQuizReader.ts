import { useCallback, useState } from "react";
import type { Question, QuizReaderOptions } from "./types";
import { defaultQuestions as builtinQuestions } from "./questions";

interface UseQuizReaderArgs extends QuizReaderOptions {
  questions?: Question[];
}

export const useQuizReader = (args: UseQuizReaderArgs = {}) => {
  const {
    questionsPerRound = 5,
    initialState = 'start',
    questions = builtinQuestions,
  } = args;

  const [gameState, setGameState] = useState<'start' | 'playing'>(initialState);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [currentRound, setCurrentRound] = useState(1);

  const getRandomQuestions = useCallback((count: number, excludeIds: Set<number>): Question[] => {
    const availableQuestions = questions.filter(question => !excludeIds.has(question.id));

    if (availableQuestions.length < count) {
      const shuffledAll = [...questions].sort(() => Math.random() - 0.5);
      return shuffledAll.slice(0, count);
    }

    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [questions]);

  const startGame = useCallback(() => {
    const nextQuestions = getRandomQuestions(questionsPerRound, new Set());
    const nextUsedIds = new Set(nextQuestions.map(q => q.id));

    setCurrentQuestions(nextQuestions);
    setUsedQuestionIds(nextUsedIds);
    setGameState('playing');
    setCurrentRound(1);
  }, [getRandomQuestions, questionsPerRound]);

  const nextReader = useCallback(() => {
    const nextQuestions = getRandomQuestions(questionsPerRound, usedQuestionIds);
    const nextUsedIds = new Set([...usedQuestionIds, ...nextQuestions.map(q => q.id)]);

    if (nextUsedIds.size >= questions.length) {
      setUsedQuestionIds(new Set(nextQuestions.map(q => q.id)));
    } else {
      setUsedQuestionIds(nextUsedIds);
    }

    setCurrentQuestions(nextQuestions);
    setCurrentRound(previous => previous + 1);
  }, [getRandomQuestions, questionsPerRound, usedQuestionIds, questions.length]);

  const restart = useCallback(() => {
    setGameState('start');
    setCurrentQuestions([]);
    setUsedQuestionIds(new Set());
    setCurrentRound(1);
  }, []);

  return {
    gameState,
    currentQuestions,
    currentRound,
    startGame,
    nextReader,
    restart,
  };
};

