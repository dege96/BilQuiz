import { useQuizReader } from "../useQuizReader";
import type { Question } from "../types";
import "../quiz-reader.css";

export interface QuizReaderProps {
  questions?: Question[];
  questionsPerRound?: number;
  title?: string;
  showAnswers?: boolean;
  startButtonLabel?: string;
  nextButtonLabel?: string;
  restartButtonLabel?: string;
  className?: string;
}

export const QuizReader = ({
  questions,
  questionsPerRound,
  title = "Quiz Uppläsaren",
  showAnswers = true,
  startButtonLabel = "🎯 STARTA QUIZ",
  nextButtonLabel = "🔄 NÄSTA UPPLÄSARE",
  restartButtonLabel = "Starta om från början",
  className,
}: QuizReaderProps) => {
  const {
    gameState,
    currentQuestions,
    currentRound,
    startGame,
    nextReader,
    restart,
  } = useQuizReader({ questions, questionsPerRound });

  if (gameState === 'start') {
    return (
      <div className={`qr-container ${className ?? ''}`.trim()}>
        <div className="qr-card qr-card-center">
          <h1 className="qr-title">{title}</h1>
          <p className="qr-subtitle">Välkommen! Klicka på STARTA för att börja med {questionsPerRound ?? 5} slumpmässiga frågor.</p>

          <div className="qr-info">
            <h3>Så här fungerar det:</h3>
            <ul>
              <li>Du får slumpmässiga frågor med svar</li>
              <li>Läs upp frågorna för gruppen</li>
              <li>Klicka på "NÄSTA UPPLÄSARE" för nya frågor</li>
            </ul>
          </div>

          <button className="qr-button qr-button-primary" onClick={startGame}>
            {startButtonLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`qr-container ${className ?? ''}`.trim()}>
      <div className="qr-inner">
        <div className="qr-header">
          <h1 className="qr-title">{title}</h1>
          <p className="qr-subtitle">Omgång {currentRound} • Läs upp frågorna och svaren</p>
        </div>

        <div className="qr-questions">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="qr-card">
              <div className="qr-row">
                <div className="qr-badge">{index + 1}</div>
                <div className="qr-question">
                  <h3>{question.question}</h3>
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="qr-options">
                      {question.options.map((option, i) => (
                        <div key={i} className="qr-option">{option}</div>
                      ))}
                    </div>
                  )}
                  {showAnswers && (
                    <div className="qr-answer">
                      <div className="qr-answer-label">✓ Svar:</div>
                      <div className="qr-answer-text">{question.answer}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="qr-actions">
          <button className="qr-button qr-button-primary" onClick={nextReader}>{nextButtonLabel}</button>
          <button className="qr-button qr-button-outline" onClick={restart}>{restartButtonLabel}</button>
        </div>
      </div>
    </div>
  );
};

