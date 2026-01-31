'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

type NavTab = 'scheduled' | 'sent';

interface DashboardSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  scheduledCount: number;
  sentCount: number;
  onComposeClick: () => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  scheduledCount,
  sentCount,
  onComposeClick,
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <img
              src={user.picture}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.name ?? 'User'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
            aria-label="Account menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <button
          type="button"
          onClick={onComposeClick}
          className="w-full py-2.5 px-4 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        >
          Compose
        </button>
      </div>
      <nav className="flex-1 px-2">
        <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Core</p>
        <button
          type="button"
          onClick={() => onTabChange('scheduled')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
            activeTab === 'scheduled'
              ? 'bg-sidebar-active text-gray-900'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Scheduled
          </span>
          <span className="text-gray-500 tabular-nums">{scheduledCount}</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange('sent')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-sidebar-active text-gray-900'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 2 9 18zm0 0v-8" />
            </svg>
            Sent
          </span>
          <span className="text-gray-500 tabular-nums">{sentCount}</span>
        </button>
      </nav>
    </aside>
  );
}
