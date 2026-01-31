"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getScheduledEmails, getSentEmails, type ScheduledEmailItem, type SentEmailItem } from '@/lib/api';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { EmailListRow } from '@/components/EmailListRow';
import { ComposeModal } from '@/components/ComposeModal';

type Tab = 'scheduled' | 'sent';

export default function DashboardClient() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('scheduled');
  const [scheduled, setScheduled] = useState<ScheduledEmailItem[]>([]);
  const [sent, setSent] = useState<SentEmailItem[]>([]);
  const [scheduledLoading, setScheduledLoading] = useState(true);
  const [sentLoading, setSentLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);

  const fetchScheduled = useCallback(async () => {
    if (!user) return;
    setScheduledLoading(true);
    try {
      const res = await getScheduledEmails(user.id);
      setScheduled(res.items);
    } catch {
      setScheduled([]);
    } finally {
      setScheduledLoading(false);
    }
  }, [user]);

  const fetchSent = useCallback(async () => {
    if (!user) return;
    setSentLoading(true);
    try {
      const res = await getSentEmails(user.id);
      setSent(res.items);
    } catch {
      setSent([]);
    } finally {
      setSentLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScheduled();
  }, [fetchScheduled]);

  useEffect(() => {
    fetchSent();
  }, [fetchSent]);

  const refresh = useCallback(() => {
    fetchScheduled();
    fetchSent();
  }, [fetchScheduled, fetchSent]);

  const items = tab === 'scheduled' ? scheduled : sent;
  const loading = tab === 'scheduled' ? scheduledLoading : sentLoading;

  return (
    <>
      <DashboardSidebar
        activeTab={tab}
        onTabChange={setTab}
        scheduledCount={scheduled.length}
        sentCount={sent.length}
        onComposeClick={() => setComposeOpen(true)}
      />
      <main className="flex-1 flex flex-col bg-white overflow-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <span className="animate-pulse">Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-8 text-center">
            {tab === 'scheduled'
              ? 'No scheduled emails. Click Compose to schedule.'
              : 'No sent emails yet.'}
          </div>
        ) : (
          <div className="flex-1">
            {tab === 'scheduled' &&
              scheduled.map((row) => (
                <EmailListRow
                  key={row.id}
                  to={row.email}
                  subject={row.subject}
                  snippet={new Date(row.scheduledAt).toLocaleString()}
                  status={row.status}
                  statusVariant={row.status === 'delayed' ? 'delayed' : 'pending'}
                />
              ))}
            {tab === 'sent' &&
              sent.map((row) => (
                <EmailListRow
                  key={row.id}
                  to={row.email}
                  subject={row.subject}
                  snippet={row.errorMessage}
                  status={row.status}
                  statusVariant={row.status === 'failed' ? 'failed' : 'sent'}
                />
              ))}
          </div>
        )}
      </main>

      <ComposeModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        onScheduled={refresh}
      />
    </>
  );
}
