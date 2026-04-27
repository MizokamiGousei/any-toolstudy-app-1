import Link from 'next/link';
import type { Quest } from '@/types';
import { withWindowsShortcuts } from '@/lib/shortcut-display';

interface QuestHeaderProps {
  quest: Quest;
  dayTitle: string;
}

const difficultyColors: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
};

const difficultyLabels: Record<number, string> = {
  1: 'かんたん',
  2: 'ふつう',
  3: 'ちょいムズ',
  4: 'むずかしい',
  5: '超むずかしい',
};

export default function QuestHeader({ quest, dayTitle }: QuestHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span aria-hidden="true">🏠</span>
          ダッシュボード
        </Link>
        <span>&gt;</span>
        <Link
          href={`/day/${quest.dayId}`}
          className="hover:text-primary transition-colors"
        >
          Day {quest.dayId}
        </Link>
        <span>&gt;</span>
        <span className="text-text-secondary">{quest.title}</span>
      </nav>

      {/* Day label */}
      <p className="text-sm font-medium text-primary mb-1">
        Day {quest.dayId} - {dayTitle}
      </p>

      {/* Quest title */}
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
        {quest.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">難易度:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  i < quest.difficulty
                    ? difficultyColors[quest.difficulty]
                    : 'bg-surface-hover'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">
            {difficultyLabels[quest.difficulty]}
          </span>
        </div>

        {/* Estimated time */}
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>約{quest.estimatedMinutes}分</span>
        </div>
      </div>

      {/* Description */}
      {quest.description && (
        <p className="mt-4 text-text-secondary leading-relaxed">
          {withWindowsShortcuts(quest.description)}
        </p>
      )}
    </div>
  );
}
