'use client';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No data',
  isLoading,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="p-8 flex items-center justify-center text-slate-500">
          <svg
            className="animate-spin h-8 w-8 text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="p-12 text-center text-slate-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-800">
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
