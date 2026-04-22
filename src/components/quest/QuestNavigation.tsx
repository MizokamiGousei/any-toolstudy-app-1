import Link from 'next/link';

interface QuestNavLink {
  id: string;
  title: string;
}

interface QuestNavigationProps {
  prevQuest: QuestNavLink | null;
  nextQuest: QuestNavLink | null;
  dayId: number;
}

export default function QuestNavigation({
  prevQuest,
  nextQuest,
  dayId,
}: QuestNavigationProps) {
  return (
    <div className="border-t border-border pt-8 mt-8">
      {/* Previous / Next links */}
      <div className="flex items-stretch justify-between gap-4 mb-6">
        {/* Previous quest */}
        {prevQuest ? (
          <Link
            href={`/day/${dayId}/quest/${prevQuest.id}`}
            className="flex-1 group flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary-light transition-all duration-200"
          >
            <svg
              className="h-5 w-5 text-text-muted group-hover:text-primary flex-shrink-0 transition-colors"
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
            <div className="min-w-0">
              <span className="block text-xs text-text-muted">
                前のクエスト
              </span>
              <span className="block text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {prevQuest.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {/* Next quest */}
        {nextQuest ? (
          <Link
            href={`/day/${dayId}/quest/${nextQuest.id}`}
            className="flex-1 group flex items-center justify-end gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary-light transition-all duration-200 text-right"
          >
            <div className="min-w-0">
              <span className="block text-xs text-text-muted">
                次のクエスト
              </span>
              <span className="block text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {nextQuest.title}
              </span>
            </div>
            <svg
              className="h-5 w-5 text-text-muted group-hover:text-primary flex-shrink-0 transition-colors"
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
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Back to day overview */}
      <div className="text-center">
        <Link
          href={`/day/${dayId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary shadow-sm transition-all duration-200 hover:border-slate-400/50 hover:bg-slate-100/60 hover:text-text-primary"
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
              d="M3 10h1l1-2h2l1 2h1M9 21V9m0 0L5 5m4 4l4-4"
            />
          </svg>
          Day一覧に戻る
        </Link>
      </div>
    </div>
  );
}
