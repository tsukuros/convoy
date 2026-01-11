import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Convoy - Real-Time Logistics Tracking',
  description: 'Production-ready military logistics tracking system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
