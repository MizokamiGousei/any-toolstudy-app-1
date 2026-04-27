import ExpandableSection from '@/components/ui/ExpandableSection';
import { withWindowsShortcuts } from '@/lib/shortcut-display';

interface QuestHintsProps {
  hints: string[];
}

export default function QuestHints({ hints }: QuestHintsProps) {
  if (hints.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        &#x1F4A1; ヒント
      </h2>

      <div className="space-y-3">
        {hints.map((hint, index) => (
          <ExpandableSection
            key={index}
            title={`ヒント ${index + 1}`}
            defaultOpen={false}
            className="bg-yellow-50 border-yellow-200"
          >
            <p className="text-text-secondary leading-relaxed">
              {withWindowsShortcuts(hint)}
            </p>
          </ExpandableSection>
        ))}
      </div>
    </div>
  );
}
