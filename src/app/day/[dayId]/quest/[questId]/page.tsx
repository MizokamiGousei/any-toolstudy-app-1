'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useProgress } from '@/hooks/useProgress';
import { useBadges } from '@/hooks/useBadges';
import { curriculum, getQuest, getDay } from '@/data/curriculum';
import { getBadgeById } from '@/data/badges';
import { isDayUnlocked, getQuestsForRole } from '@/lib/progress';
import { calculateTotalXP } from '@/lib/gamification';
import { checkBadgeEligibility } from '@/lib/badges';
import QuestHeader from '@/components/quest/QuestHeader';
import QuestSteps from '@/components/quest/QuestSteps';
import QuestChallenge from '@/components/quest/QuestChallenge';
import QuestHints from '@/components/quest/QuestHints';
import QuestCheckQuestions from '@/components/quest/QuestCheckQuestions';
import QuestCompleteButton from '@/components/quest/QuestCompleteButton';
import QuestNavigation from '@/components/quest/QuestNavigation';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import BadgeUnlockModal from '@/components/badges/BadgeUnlockModal';

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

export default function QuestPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const {
    completions,
    loading: progressLoading,
    completeQuest,
    isQuestCompleted,
  } = useProgress();

  const { earnedBadges, earnBadge } = useBadges();
  const [allQuestionsCorrect, setAllQuestionsCorrect] = useState(false);
  const [unlockedBadgeId, setUnlockedBadgeId] = useState<string | null>(null);

  const dayId = Number(params.dayId);
  const questId = params.questId as string;

  const loading = authLoading || roleLoading || progressLoading;

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const handleAllCorrect = useCallback(() => {
    setAllQuestionsCorrect(true);
  }, []);

  const handleComplete = useCallback(async () => {
    await completeQuest(questId);
    // Check badge eligibility after completion
    const updatedCompletions = [...completions, questId];
    const newBadges = checkBadgeEligibility(updatedCompletions, earnedBadges, curriculum, role);
    if (newBadges.length > 0) {
      // Earn the first new badge and show modal
      await earnBadge(newBadges[0]);
      setUnlockedBadgeId(newBadges[0]);
    }
  }, [completeQuest, questId, completions, earnedBadges, role, earnBadge]);

  // Calculate current XP for gamification
  const currentXP = !progressLoading ? calculateTotalXP(completions, curriculum) : 0;

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

  // Handle empty curriculum
  if (curriculum.length === 0) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">&#x1F4DA;</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            カリキュラムを準備中です
          </h1>
          <p className="text-text-muted mb-6">
            コンテンツは間もなく公開されます。しばらくお待ちください。
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

  // Get quest and day data
  const questResult = getQuest(questId);
  const day = getDay(dayId);

  // Quest not found or does not belong to this day
  if (!questResult || !day || questResult.day.dayId !== dayId) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">&#x1F50D;</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            クエストが見つかりません
          </h1>
          <p className="text-text-muted mb-6">
            指定されたクエストは存在しないか、このDayに属していません。
          </p>
          <Link
            href={`/day/${dayId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Day {dayId} に戻る
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const { quest } = questResult;

  // Check if day is unlocked
  const unlocked = isDayUnlocked(dayId, completions, curriculum, role);

  if (!unlocked) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <p className="text-6xl mb-4">&#x1F512;</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            このクエストはまだロックされています
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

  // Build prev/next quest links from role-filtered quests
  const roleQuestIds = getQuestsForRole(day, role);
  const dayQuests = day.quests.filter((q) => roleQuestIds.includes(q.id));
  const currentIndex = dayQuests.findIndex((q) => q.id === questId);

  const prevQuest =
    currentIndex > 0
      ? { id: dayQuests[currentIndex - 1].id, title: dayQuests[currentIndex - 1].title }
      : null;

  const nextQuest =
    currentIndex >= 0 && currentIndex < dayQuests.length - 1
      ? { id: dayQuests[currentIndex + 1].id, title: dayQuests[currentIndex + 1].title }
      : null;

  const completed = isQuestCompleted(questId);

  // Determine if the complete button should be enabled
  // If there are check questions, user must answer all correctly first
  const canComplete =
    quest.checkQuestions.length === 0 || allQuestionsCorrect || completed;

  return (
    <PageWrapper>
      {/* Quest Header */}
      <QuestHeader quest={quest} dayTitle={day.title} />

      {/* Divider */}
      <hr className="border-border mb-8" />

      {/* Steps */}
      {quest.steps.length > 0 && <QuestSteps steps={quest.steps} />}

      {/* Challenge */}
      {quest.challenge && <QuestChallenge challenge={quest.challenge} />}

      {/* Hints */}
      {quest.hints.length > 0 && <QuestHints hints={quest.hints} />}

      {/* Check Questions */}
      {quest.checkQuestions.length > 0 && (
        <QuestCheckQuestions
          questions={quest.checkQuestions}
          onAllCorrect={handleAllCorrect}
        />
      )}

      {/* Complete Button */}
      {canComplete && (
        <QuestCompleteButton
          questId={questId}
          isCompleted={completed}
          onComplete={handleComplete}
          difficulty={quest.difficulty}
          currentXP={currentXP}
          nextQuest={nextQuest}
          prevQuest={prevQuest}
          dayId={dayId}
        />
      )}

      {/* Cannot complete message */}
      {!canComplete && !completed && (
        <div className="mb-8 text-center">
          <p className="text-sm text-text-muted">
            理解度チェックに全問正解するとクエストを完了できます。
          </p>
        </div>
      )}

      {/* Feedback Button */}
      <div className="mb-8 flex justify-center">
        <FeedbackButton questId={questId} questTitle={quest.title} />
      </div>

      {/* Navigation */}
      <QuestNavigation
        prevQuest={prevQuest}
        nextQuest={nextQuest}
        dayId={dayId}
      />

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        badge={unlockedBadgeId ? getBadgeById(unlockedBadgeId) ?? null : null}
        isOpen={!!unlockedBadgeId}
        onClose={() => setUnlockedBadgeId(null)}
      />
    </PageWrapper>
  );
}
