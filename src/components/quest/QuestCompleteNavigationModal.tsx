import Link from 'next/link';
import Modal from '@/components/ui/Modal';

interface QuestNavLink {
  id: string;
  title: string;
}

interface QuestCompleteNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextQuest: QuestNavLink | null;
  prevQuest: QuestNavLink | null;
  dayId: number;
}

export default function QuestCompleteNavigationModal({
  isOpen,
  onClose,
  nextQuest,
  prevQuest,
  dayId,
}: QuestCompleteNavigationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="クエスト完了！">
      <div className="flex flex-col gap-6 py-2">
        <p className="text-center text-text-secondary text-sm">
          お疲れ様でした！次のアクションを選択してください。
        </p>
        
        <div className="flex flex-col gap-3">
          {nextQuest && (
            <Link
              href={`/day/${dayId}/quest/${nextQuest.id}`}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 transition-all duration-200"
              onClick={onClose}
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-text-muted">次のクエスト</span>
                <span className="font-medium text-text-primary truncate">
                  {nextQuest.title}
                </span>
              </div>
              <svg className="h-5 w-5 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {prevQuest && (
            <Link
              href={`/day/${dayId}/quest/${prevQuest.id}`}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-all duration-200"
              onClick={onClose}
            >
              <svg className="h-5 w-5 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <div className="flex flex-col items-end min-w-0">
                <span className="text-xs text-text-muted">前のクエスト</span>
                <span className="font-medium text-text-primary truncate">
                  {prevQuest.title}
                </span>
              </div>
            </Link>
          )}
          
          <Link
            href={`/day/${dayId}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-all duration-200 text-sm font-medium text-text-secondary mt-2"
            onClick={onClose}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l1-2h2l1 2h1M9 21V9m0 0L5 5m4 4l4-4" />
            </svg>
            Day一覧に戻る
          </Link>
        </div>
      </div>
    </Modal>
  );
}
