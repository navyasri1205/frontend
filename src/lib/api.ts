const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface SchedulePayload {
  userId: string;
  userEmail?: string;
  userName?: string;
  subject: string;
  body: string;
  recipients: string[];
  startTime: string;
  delayBetweenMs: number;
  hourlyLimit: number;
}

export interface ScheduleResponse {
  campaignId: string;
  totalScheduled: number;
  startTime: string;
  jobs: { id: string; recipientEmail: string; scheduledAt: string }[];
}

export interface ScheduledEmailItem {
  id: string;
  email: string;
  subject: string;
  scheduledAt: string;
  status: string;
}

export interface SentEmailItem {
  id: string;
  email: string;
  subject: string;
  sentAt: string;
  status: string;
  errorMessage?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export async function scheduleEmails(payload: SchedulePayload): Promise<ScheduleResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? 'Failed to schedule');
    }
    return res.json();
  } catch (err) {
    if (err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('fetch'))) {
      throw new Error(
        `Cannot reach the backend. Is it running? Open ${API_BASE}/health in your browser to check.`
      );
    }
    throw err;
  }
}

export async function getScheduledEmails(userId?: string): Promise<ListResponse<ScheduledEmailItem>> {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  const res = await fetch(`${API_BASE}/api/emails/scheduled?${params}`);
  if (!res.ok) throw new Error('Failed to fetch scheduled emails');
  return res.json();
}

export async function getSentEmails(userId?: string): Promise<ListResponse<SentEmailItem>> {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  const res = await fetch(`${API_BASE}/api/emails/sent?${params}`);
  if (!res.ok) throw new Error('Failed to fetch sent emails');
  return res.json();
}
