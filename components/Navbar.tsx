'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Music, Menu, X, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { useFolio } from '@/lib/folio-context';

export default function Navbar() {
  const pathname = usePathname();
  const { savedBooks, setIsFolioOpen, setIsSearchOpen, isPlayingAudio, togglePlayAudio, activeSoundscape } = useFolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/explore-books', label: 'Explorar Livros' },
    { href: '/reviews', label: 'Resenhas' },
    { href: '/recommendations', label: 'Recomendações' },
    { href: '/playlists', label: 'Trilhas Sonoras' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF7F0]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(72,23,37,0.06)] border-b border-[#F3E8D5]">
      <div className="h-20 max-w-[1360px] mx-auto px-5 md:px-12 flex items-center justify-between gap-6">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6B2035] flex items-center justify-center text-[#FBF7F0] shadow-sm group-hover:bg-[#481725] transition-colors">
              <BookOpen className="w-5 h-5 text-[#FBF7F0]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-[#4E0820] tracking-tight group-hover:text-[#6B2035] transition-colors">
                Universe in Pages
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#544245] font-semibold">
                Every page, a new universe
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#F2E7D4] text-[#6B2035] shadow-xs'
                    : 'text-[#544245] hover:text-[#201B10] hover:bg-[#F8EDD9]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Search Button (⌘K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#FFFFFF] text-[#544245] hover:text-[#201B10] px-4 py-1.5 rounded-full shadow-[0_2px_6px_rgba(72,23,37,0.04)] border border-[#ECE1CE] hover:border-[#6B2035]/30 cursor-pointer transition-all"
            title="Pesquisa rápida por título, autor, gênero..."
          >
            <Search className="w-4 h-4 text-[#894C5A]" />
            <span className="text-xs font-medium">Buscar livro, autor, gênero...</span>
            <kbd className="bg-[#F2E7D4] text-[#544245] text-[10px] font-semibold px-1.5 py-0.5 rounded ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Soundscape Ambient Indicator */}
          {activeSoundscape && (
            <button
              onClick={togglePlayAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                isPlayingAudio
                  ? 'bg-[#6B2035] text-[#FFFFFF] animate-pulse'
                  : 'bg-[#F8EDD9] text-[#6B2035] hover:bg-[#F2E7D4]'
              }`}
              title={isPlayingAudio ? 'Pausar áudio ambiente' : 'Ouvir atmosfera de leitura'}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <Music className="w-3.5 h-3.5" />
              )}
              <span className="hidden lg:inline">
                {isPlayingAudio ? 'Tocando Som' : 'Som Ambiente'}
              </span>
            </button>
          )}

          {/* Folio (Offline Bookmarks) */}
          <button
            onClick={() => setIsFolioOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8EDD9] hover:bg-[#F2E7D4] text-[#544245] hover:text-[#6B2035] transition-colors border border-[#ECE1CE]/60 text-xs font-semibold relative"
            title="Ver livros salvos no Folio"
          >
            <Bookmark className="w-4 h-4 text-[#6B2035]" />
            <span className="hidden sm:inline">Folio</span>
            {savedBooks.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#6B2035] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center">
                {savedBooks.length}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#544245] hover:bg-[#F8EDD9] hover:text-[#6B2035]"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FBF7F0] border-b border-[#ECE1CE] px-6 py-4 flex flex-col gap-2 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="flex items-center justify-between w-full bg-[#FFFFFF] px-4 py-2.5 rounded-xl border border-[#ECE1CE] text-[#544245] text-sm mb-2"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#894C5A]" />
              <span>Pesquisar no acervo...</span>
            </span>
            <kbd className="bg-[#F2E7D4] text-[10px] px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-[#6B2035] text-[#FFFFFF]'
                  : 'text-[#544245] hover:bg-[#F8EDD9] hover:text-[#201B10]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#ECE1CE] flex items-center justify-between text-xs text-[#544245]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Acesso livre • Sem login</span>
            </span>
            <span>{savedBooks.length} livro(s) no Folio</span>
          </div>
        </div>
      )}
    </header>
  );
}
