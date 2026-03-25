import type { Metadata, Viewport } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';
import TermsGate from '@/components/ui/TermsGate';
import './globals.css';

export const metadata: Metadata = {
  title: 'MadAi — Strategic Marketing Intelligence',
  description: 'Turn any value proposition into better revenue, positioning, and execution. Deep strategy system combining business fundamentals, psychological insight, market research, and platform-power awareness.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MadAi',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-surface text-text antialiased">
        <SessionProvider>
          <TermsGate>
            {children}
          </TermsGate>
        </SessionProvider>
      </body>
    </html>
  );
}
