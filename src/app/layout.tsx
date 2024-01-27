import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import './globals.css';

const robotoFlex = Roboto_Flex({ subsets: ['latin'], axes: ['opsz', 'wdth'] });

export const metadata: Metadata = {
  title: 'Fallout 4 Perks',
  description: 'View and assign Fallout 4 stats and perks online with in-game interface',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={robotoFlex.className}>{children}</body>
    </html>
  );
}
