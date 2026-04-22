'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useProgress } from '@/hooks/useProgress';
import { curriculum, getDay } from '@/data/curriculum';
import { getQuestsForRole, isDayUnlocked } from '@/lib/progress';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import type { Quest } from '@/types';

// Simple layout wrapper
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}

const difficultyColors: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
};

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const { completions, loading: progressLoading, isQuestCompleted } = useProgress();

  const dayId = Number(params.dayId);
  const day = getDay(dayId);

  const loading = authLoading || roleLoading || progressLoading;

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-text-muted">読み込み中...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Day not found
  if (!day) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">&#x1F50D;</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Day {dayId} が見つかりません
          </h1>
          <p className="text-text-muted mb-6">
            指定されたDayはまだ準備されていません。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Check if day is unlocked
  const unlocked = isDayUnlocked(dayId, completions, curriculum, role);

  if (!unlocked) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">&#x1F512;</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Day {dayId} はまだロックされています
          </h1>
          <p className="text-text-muted mb-6">
            前のDayのクエストを50%以上完了すると解放されます。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Filter quests for user's role
  const roleQuestIds = getQuestsForRole(day, role);
  const filteredQuests = day.quests.filter((q) =>
    roleQuestIds.includes(q.id)
  );

  // Calculate progress
  const completedCount = filteredQuests.filter((q) =>
    isQuestCompleted(q.id)
  ).length;
  const totalCount = filteredQuests.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <PageWrapper>
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/10 hover:text-primary md:text-base mb-6"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        ダッシュボードに戻る
      </Link>

      {/* Day header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{day.emoji}</span>
          <div>
            <p className="text-sm font-medium text-primary">Day {day.dayId}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              {day.title}
            </h1>
          </div>
        </div>
        <p className="text-text-secondary mt-2 leading-relaxed">
          {day.description}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-text-secondary">
              進捗: {completedCount} / {totalCount} クエスト完了
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {progressPercent}%
            </span>
          </div>
          <ProgressBar value={progressPercent} size="md" color="primary" />
        </div>
      </div>

      {/* No quests message */}
      {filteredQuests.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">&#x1F4DA;</p>
          <p className="text-text-muted">
            カリキュラムを準備中です。しばらくお待ちください。
          </p>
        </div>
      )}

      {/* Quest list */}
      <div className="space-y-4">
        {filteredQuests.map((quest: Quest, index: number) => {
          const completed = isQuestCompleted(quest.id);

          return (
            <Link
              key={quest.id}
              href={`/day/${dayId}/quest/${quest.id}`}
              className="block"
            >
              <Card hover className="relative overflow-hidden">
                {/* Completion indicator stripe */}
                {completed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                )}

                <div className="flex items-start gap-4">
                  {/* Quest number */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-primary-light/20 text-primary'
                    }`}
                  >
                    {completed ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Quest info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold mb-1 ${
                        completed
                          ? 'text-text-muted line-through'
                          : 'text-text-primary'
                      }`}
                    >
                      {quest.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-1">
                      {quest.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2">
                      {/* Difficulty dots */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`inline-block w-2 h-2 rounded-full ${
                              i < quest.difficulty
                                ? difficultyColors[quest.difficulty]
                                : 'bg-surface-hover'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Estimated time */}
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <svg
                          className="h-3.5 w-3.5"
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
                        {quest.estimatedMinutes}分
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 self-center">
                    <svg
                      className="h-5 w-5 text-text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageWrapper>
  );
}
