'use client';

export function DashboardHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-[#374151] text-white shrink-0">
      <h1 className="text-lg font-bold tracking-tight">ReachInbox</h1>
      <div className="flex-1 max-w-xl mx-4 flex items-center">
        <div className="w-full flex items-center rounded-lg bg-gray-600/50 px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="p-2 rounded hover:bg-gray-600/50 text-gray-300" aria-label="Filter">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button type="button" className="p-2 rounded hover:bg-gray-600/50 text-gray-300" aria-label="Refresh">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </header>
  );
}
