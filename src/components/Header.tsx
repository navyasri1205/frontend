'use client';

import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-slate-200">
      <h1 className="text-lg font-semibold text-slate-800">ReachInbox</h1>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end text-sm">
          <span className="font-medium text-slate-800">{user?.name ?? 'User'}</span>
          <span className="text-slate-500 text-xs">{user?.email}</span>
        </div>
        {user?.picture ? (
          <img
            src={user.picture}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
            {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className="text-sm text-slate-600 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
