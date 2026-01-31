import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { GoogleOAuthSetupMessage } from '@/components/GoogleOAuthSetupMessage';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReachInbox – Email Scheduler',
  description: 'Schedule and send emails at scale',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '').trim();
  const isConfigured = clientId.length > 0 && !clientId.startsWith('your-');
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {isConfigured ? (
          <Providers clientId={clientId}>{children}</Providers>
        ) : (
          <GoogleOAuthSetupMessage />
        )}
      </body>
    </html>
  );
}
