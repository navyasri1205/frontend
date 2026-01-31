'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { scheduleEmails, type SchedulePayload } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduled: () => void;
}

function parseCSVForEmails(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
      const emails: string[] = [];
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const line of lines) {
        const parts = line.split(/[,\t;]/).map((p) => p.trim());
        for (const p of parts) {
          if (emailRe.test(p)) emails.push(p);
        }
      }
      resolve([...new Set(emails)]);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

const SUGGESTED_TIMES = [
  { label: 'Tomorrow', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; } },
  { label: 'Tomorrow, 10:00 AM', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; } },
  { label: 'Tomorrow, 11:00 AM', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(11, 0, 0, 0); return d; } },
  { label: 'Tomorrow, 3:00 PM', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(15, 0, 0, 0); return d; } },
];

export function ComposeModal({ isOpen, onClose, onScheduled }: ComposeModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [delayBetweenMs, setDelayBetweenMs] = useState(2000);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [showSendLater, setShowSendLater] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCSVForEmails(file).then(setRecipients).catch(() => setRecipients([]));
  }, []);

  const defaultStartTime = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    return d.toISOString().slice(0, 16);
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('You must be logged in');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!body.trim()) {
      setError('Body is required');
      return;
    }
    if (recipients.length === 0) {
      setError('Upload a list with at least one email address');
      return;
    }
    const start = new Date(startTime || defaultStartTime);
    if (isNaN(start.getTime()) || start.getTime() < Date.now()) {
      setError('Start time must be in the future');
      return;
    }
    if (delayBetweenMs < 0 || hourlyLimit < 1) {
      setError('Delay and hourly limit must be valid');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: SchedulePayload = {
        userId: user.id,
        userEmail: user.email,
        userName: user.name ?? undefined,
        subject: subject.trim(),
        body: body.trim(),
        recipients,
        startTime: start.toISOString(),
        delayBetweenMs,
        hourlyLimit,
      };
      await scheduleEmails(payload);
      onScheduled();
      onClose();
      setSubject('');
      setBody('');
      setRecipients([]);
      setStartTime('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickSuggested = (getValue: () => Date) => {
    const d = getValue();
    setStartTime(d.toISOString().slice(0, 16));
    setShowSendLater(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} className="p-2 rounded hover:bg-gray-100 text-gray-600" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Compose New Email</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Attach"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={onFileChange} />
          <button
            type="button"
            onClick={() => setShowSendLater(true)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Schedule"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <Button type="submit" form="compose-form" size="lg">
            Send Later
          </Button>
        </div>
      </div>

      <form id="compose-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-auto">
        <div className="p-4 space-y-4 max-w-3xl">
          <div className="flex items-start gap-4">
            <label className="w-12 pt-2.5 text-sm font-medium text-gray-700 shrink-0">From</label>
            <div className="flex-1 flex items-center rounded-lg border border-gray-200 bg-[#f7f7f7] px-3 py-2">
              <span className="text-gray-800 text-sm">{user?.email ?? '—'}</span>
              <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-12 pt-2.5 text-sm font-medium text-gray-700 shrink-0">To</label>
            <div className="flex-1 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 min-h-[42px]">
              {recipients.length === 0 ? (
                <input
                  type="text"
                  placeholder="recipient@example.com"
                  className="flex-1 min-w-[200px] text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  readOnly
                />
              ) : (
                recipients.slice(0, 5).map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center px-2 py-1 rounded bg-primary-50 text-primary-800 text-sm"
                  >
                    {email}
                  </span>
                ))
              )}
              {recipients.length > 5 && (
                <span className="text-sm font-medium text-primary-600">+{recipients.length - 5}</span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload List
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-12 text-sm font-medium text-gray-700 shrink-0">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="flex-1 rounded-lg border border-gray-200 bg-[#f7f7f7] px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Delay between 2 emails</label>
              <input
                type="number"
                min={0}
                value={Math.round(delayBetweenMs / 1000)}
                onChange={(e) => setDelayBetweenMs(Number(e.target.value) * 1000)}
                className="w-16 rounded border border-gray-200 bg-[#f7f7f7] px-2 py-1.5 text-sm text-gray-800 text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Hourly Limit</label>
              <input
                type="number"
                min={1}
                value={hourlyLimit}
                onChange={(e) => setHourlyLimit(Number(e.target.value))}
                className="w-16 rounded border border-gray-200 bg-[#f7f7f7] px-2 py-1.5 text-sm text-gray-800 text-center"
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-12 pt-3 text-sm font-medium text-gray-700 shrink-0" />
            <div className="flex-1 rounded-lg border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-100 bg-gray-50 flex-wrap">
                <button type="button" className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Bold">B</button>
                <button type="button" className="p-1.5 rounded hover:bg-gray-200 text-gray-600 italic" title="Italic">I</button>
                <button type="button" className="p-1.5 rounded hover:bg-gray-200 text-gray-600 underline" title="Underline">U</button>
                <span className="w-px h-4 bg-gray-200 mx-1" />
                <button type="button" className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="List">≡</button>
                <button type="button" className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Link">🔗</button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type Your Reply..."
                rows={10}
                className="w-full px-3 py-3 text-gray-800 placeholder-gray-400 focus:outline-none resize-y min-h-[200px]"
              />
            </div>
          </div>
          <input type="hidden" name="startTime" value={startTime || defaultStartTime} />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Start time</label>
            <input
              type="datetime-local"
              value={startTime || defaultStartTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={defaultStartTime}
              className="rounded border border-gray-200 bg-[#f7f7f7] px-3 py-2 text-sm text-gray-800"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>
      </form>

      {/* Send Later popup */}
      {showSendLater && (
        <div className="absolute inset-0 z-10 flex items-start justify-end pt-14 pr-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-72">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Send Later</h3>
            <div className="flex items-center rounded-lg border border-gray-200 bg-[#f7f7f7] px-3 py-2 mb-3">
              <input
                type="datetime-local"
                value={startTime || defaultStartTime}
                onChange={(e) => setStartTime(e.target.value)}
                min={defaultStartTime}
                className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
              />
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-2">Suggested</p>
            <ul className="space-y-1 mb-4">
              {SUGGESTED_TIMES.map((opt) => (
                <li key={opt.label}>
                  <button
                    type="button"
                    onClick={() => pickSuggested(opt.getValue)}
                    className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSendLater(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowSendLater(false)}
                className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
