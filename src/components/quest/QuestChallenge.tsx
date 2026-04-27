import { withWindowsShortcuts } from '@/lib/shortcut-display';

interface QuestChallengeProps {
  challenge: string;
}

export default function QuestChallenge({ challenge }: QuestChallengeProps) {
  return (
    <div className="mb-8">
      <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-6">
        <h2 className="text-lg font-bold text-amber-800 mb-3">
          &#x1F3AF; チャレンジ
        </h2>
        <p className="text-lg text-amber-900 leading-relaxed">
          {withWindowsShortcuts(challenge)}
        </p>
      </div>
    </div>
  );
}
