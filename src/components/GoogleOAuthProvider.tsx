'use client';

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';

export function GoogleOAuthProvider({
  clientId,
  children,
}: {
  clientId: string;
  children: React.ReactNode;
}) {
  if (!clientId) {
    return <>{children}</>;
  }
  return (
    <GoogleProvider clientId={clientId}>
      {children}
    </GoogleProvider>
  );
}
