'use client';

interface EmailListRowProps {
  to: string;
  subject: string;
  snippet?: string;
  status: string;
  statusVariant?: 'sent' | 'failed' | 'pending' | 'delayed';
}

export function EmailListRow({ to, subject, snippet, status, statusVariant = 'sent' }: EmailListRowProps) {
  const statusClass =
    statusVariant === 'failed'
      ? 'border-red-200 bg-red-50 text-red-700'
      : statusVariant === 'delayed'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-gray-200 bg-gray-50 text-gray-700';

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
        <span className="text-gray-500 text-sm shrink-0">To:</span>
        <span className="text-gray-900 font-medium truncate">{to}</span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shrink-0 ${statusClass}`}
        >
          {status}
        </span>
        <span className="text-gray-900 font-semibold truncate">{subject}</span>
        {snippet && (
          <>
            <span className="text-gray-400">-</span>
            <span className="text-gray-500 text-sm truncate">{snippet}</span>
          </>
        )}
      </div>
      <button
        type="button"
        className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-amber-500 shrink-0"
        aria-label="Star"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>
    </div>
  );
}
