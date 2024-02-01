import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import MessageProvider from '@/context/MessageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mars Photos App',
  description: 'Check out the pretty pictures by your favorite Mars rover!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <MessageProvider>{children}</MessageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
