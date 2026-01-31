'use client';

export function GoogleOAuthSetupMessage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-amber-50 border border-amber-200 p-6">
        <h1 className="text-lg font-semibold text-amber-900 mb-2">
          Google Sign-In not configured
        </h1>
        <p className="text-amber-800 text-sm mb-4">
          Add your Google OAuth Client ID to <code className="bg-amber-100 px-1 rounded">frontend\.env.local</code>:
        </p>
        <pre className="bg-slate-800 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto mb-4">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
          NEXT_PUBLIC_API_URL=http://localhost:4000
        </pre>
        <p className="text-amber-800 text-sm">
          See <strong>GOOGLE-OAUTH-SETUP.md</strong> in the project root for step-by-step instructions (Google Cloud Console → Credentials → OAuth client ID → add <code className="bg-amber-100 px-1 rounded">http://localhost:3000</code> as authorized origin).
        </p>
      </div>
    </div>
  );
}
