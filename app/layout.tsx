import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { FolioProvider } from '@/lib/folio-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickSearchModal from '@/components/QuickSearchModal';
import FolioDrawer from '@/components/FolioDrawer';
import SoundPlayerFloating from '@/components/SoundPlayerFloating';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Universe in Pages | Every page, a new universe.',
  description: 'Sanctuário literário público e digital. Pesquisa real de livros via Google Books, resenhas comunitárias abertas, recomendações curadas e trilhas sonoras ambientais no conceito Stories in Sound.',
  openGraph: {
    title: 'Universe in Pages | Every page, a new universe.',
    description: 'Sanctuário literário público e digital. Pesquisa real de livros via Google Books, resenhas comunitárias abertas, recomendações curadas e trilhas sonoras ambientais no conceito Stories in Sound.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universe in Pages | Every page, a new universe.',
    description: 'Sanctuário literário público e digital. Pesquisa real de livros via Google Books, resenhas comunitárias abertas, recomendações curadas e trilhas sonoras ambientais no conceito Stories in Sound.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FBF7F0] text-[#201B10] font-sans antialiased flex flex-col selection:bg-[#6B2035] selection:text-[#FBF7F0]" suppressHydrationWarning>
        <FolioProvider>
          <Navbar />
          <main className="flex-1 w-full pt-20">
            {children}
          </main>
          <Footer />
          <QuickSearchModal />
          <FolioDrawer />
          <SoundPlayerFloating />
        </FolioProvider>
      </body>
    </html>
  );
}
