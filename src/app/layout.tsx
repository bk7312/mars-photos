import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import MessageProvider from '@/context/MessageContext';
import { combineClassNames } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/api/auth/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessageList from '@/components/MessageList';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mars Photos App',
  description: 'Check out the pretty pictures by your favorite Mars rover!',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang='en'>
      <body
        className={combineClassNames(
          inter.className,
          'bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
          'flex min-h-screen flex-col items-center justify-between gap-2'
        )}
      >
        <SessionProvider session={session}>
          <MessageProvider>
            <Header />
            {children}
            <Footer />
            <MessageList />
          </MessageProvider>
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
