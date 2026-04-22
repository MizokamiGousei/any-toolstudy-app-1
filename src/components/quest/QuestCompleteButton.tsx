'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { triggerCelebration } from '@/components/ui/Confetti';
import { getXPForDifficulty, getLevelForXP } from '@/lib/gamification';
import XPGainPopup from '@/components/gamification/XPGainPopup';
import LevelUpModal from '@/components/gamification/LevelUpModal';
import QuestCompleteNavigationModal from './QuestCompleteNavigationModal';

interface QuestCompleteButtonProps {
  questId: string;
  isCompleted: boolean;
  onComplete: () => void;
  difficulty?: number;
  currentXP?: number;
  nextQuest?: { id: string; title: string } | null;
  prevQuest?: { id: string; title: string } | null;
  dayId?: number;
}

export default function QuestCompleteButton({
  questId,
  isCompleted,
  onComplete,
  difficulty = 1,
  currentXP = 0,
  nextQuest,
  prevQuest,
  dayId,
}: QuestCompleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [gainedXP, setGainedXP] = useState(0);
  const [newLevel, setNewLevel] = useState<ReturnType<typeof getLevelForXP> | null>(null);

  const xpReward = getXPForDifficulty(difficulty as 1 | 2 | 3 | 4 | 5);

  const handleComplete = async () => {
    if (isCompleted || loading) return;

    setLoading(true);
    try {
      // Check level before completion
      const levelBefore = getLevelForXP(currentXP);

      await onComplete();

      // Fire confetti celebration after successful completion
      triggerCelebration();

      // Show XP gain popup
      setGainedXP(xpReward);
      setShowXPPopup(true);

      // Check if leveled up
      const levelAfter = getLevelForXP(currentXP + xpReward);
      if (levelAfter.level > levelBefore.level) {
        setNewLevel(levelAfter);
        // Show level up modal after XP popup completes
        setTimeout(() => {
          setShowLevelUp(true);
        }, 1500);
      } else {
        // Show navigation modal after XP popup completes
        setTimeout(() => {
          setShowNavModal(true);
        }, 2000);
      }
    } catch {
      // Error handling: silently fail for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isCompleted ? (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 text-yellow-700 text-lg font-medium shadow-sm">
            <svg
              className="h-6 w-6 text-yellow-500"
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
            <span>完了済み</span>
            <span className="text-yellow-500">&#x2728;</span>
          </div>
        </div>
      ) : (
        <div className="mb-8 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={handleComplete}
            className="!bg-green-600 hover:!bg-green-700 !px-12 !py-4 !text-lg !rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            クエスト完了！
            <span className="ml-2 text-yellow-300 font-bold">+{xpReward} XP</span>
          </Button>
        </div>
      )}

      {/* XP Gain Popup */}
      <XPGainPopup
        xp={gainedXP}
        show={showXPPopup}
        onDone={() => setShowXPPopup(false)}
      />

      {/* Level Up Modal */}
      {newLevel && (
        <LevelUpModal
          level={newLevel}
          isOpen={showLevelUp}
          onClose={() => {
            setShowLevelUp(false);
            setShowNavModal(true);
          }}
        />
      )}

      {/* Navigation Modal */}
      {dayId !== undefined && (
        <QuestCompleteNavigationModal
          isOpen={showNavModal}
          onClose={() => setShowNavModal(false)}
          nextQuest={nextQuest ?? null}
          prevQuest={prevQuest ?? null}
          dayId={dayId}
        />
      )}
    </>
  );
}
