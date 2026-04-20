'use client';

import { useState, useEffect } from 'react';
import type { CheckQuestion } from '@/types';

interface QuestCheckQuestionsProps {
  questions: CheckQuestion[];
  onAllCorrect: () => void;
}

interface AnswerState {
  selectedIndex: number | null;
  isCorrect: boolean | null;
}

export default function QuestCheckQuestions({
  questions,
  onAllCorrect,
}: QuestCheckQuestionsProps) {
  const [answers, setAnswers] = useState<AnswerState[]>(
    questions.map(() => ({ selectedIndex: null, isCorrect: null }))
  );

  const correctCount = answers.filter((a) => a.isCorrect === true).length;
  const allCorrect = correctCount === questions.length;

  useEffect(() => {
    if (allCorrect) {
      onAllCorrect();
    }
  }, [allCorrect, onAllCorrect]);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    // If already answered correctly, do not allow changes
    if (answers[questionIndex].isCorrect === true) return;

    const isCorrect = optionIndex === questions[questionIndex].correctIndex;

    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = {
        selectedIndex: optionIndex,
        isCorrect,
      };
      return next;
    });
  };

  if (questions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-2">
        &#x2705; 理解度チェック
      </h2>
      <p className="text-sm text-text-muted mb-6">
        {correctCount} / {questions.length} 問正解
      </p>

      <div className="space-y-8">
        {questions.map((q, qIndex) => {
          const answer = answers[qIndex];
          const hasAnswered = answer.selectedIndex !== null;

          return (
            <div key={qIndex} className="space-y-3">
              {/* Question */}
              <h3 className="font-medium text-text-primary">
                Q{qIndex + 1}. {q.question}
              </h3>

              {/* Options */}
              <div className="grid gap-2">
                {q.options.map((option, oIndex) => {
                  const isSelected = answer.selectedIndex === oIndex;
                  const isCorrectOption = oIndex === q.correctIndex;

                  let cardStyle =
                    'border border-border bg-surface text-text-primary hover:bg-surface-hover';

                  if (hasAnswered) {
                    if (isSelected && answer.isCorrect) {
                      // User selected this and it is correct
                      cardStyle =
                        'border-2 border-green-500 bg-green-50 text-green-900';
                    } else if (isSelected && !answer.isCorrect) {
                      // User selected this but it is wrong
                      cardStyle =
                        'border-2 border-red-500 bg-red-50 text-red-900';
                    } else if (
                      !answer.isCorrect &&
                      isCorrectOption
                    ) {
                      // Show the correct answer when user answered wrong
                      cardStyle =
                        'border-2 border-green-400 bg-green-50 text-green-900';
                    }
                  }

                  return (
                    <button
                      key={oIndex}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${cardStyle} ${
                        answer.isCorrect === true
                          ? 'cursor-default'
                          : ''
                      }`}
                      onClick={() => handleSelect(qIndex, oIndex)}
                      disabled={answer.isCorrect === true}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="text-sm">{option}</span>

                        {/* Correct/incorrect icon */}
                        {hasAnswered && isSelected && answer.isCorrect && (
                          <svg
                            className="ml-auto h-5 w-5 text-green-600 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {hasAnswered && isSelected && !answer.isCorrect && (
                          <svg
                            className="ml-auto h-5 w-5 text-red-600 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (shown after answering) */}
              {hasAnswered && (
                <div
                  className={`mt-2 px-4 py-3 rounded-lg text-sm ${
                    answer.isCorrect
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <span className="font-medium">
                    {answer.isCorrect ? '正解!' : '不正解...'}
                  </span>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All correct message */}
      {allCorrect && (
        <div className="mt-6 px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-center font-medium">
          全問正解! クエストを完了できます。
        </div>
      )}
    </div>
  );
}
