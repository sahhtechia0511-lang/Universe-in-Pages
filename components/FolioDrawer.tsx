'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Bookmark, Trash2, ExternalLink, Headphones, Sparkles, BookOpen } from 'lucide-react';
import { useFolio } from '@/lib/folio-context';
import { SOUNDSCAPES } from '@/lib/soundscapes';

export default function FolioDrawer() {
  const { isFolioOpen, setIsFolioOpen, savedBooks, removeBook, playSoundscape } = useFolio();

  if (!isFolioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FBF7F0] h-full shadow-2xl border-l border-[#ECE1CE] flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#ECE1CE] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6B2035] flex items-center justify-center text-white">
              <Bookmark className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#4E0820]">
                Folio Pessoal
              </h2>
              <p className="text-[11px] text-[#867275]">
                {savedBooks.length} volume(s) arquivado(s) localmente
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFolioOpen(false)}
            className="p-1.5 rounded-lg text-[#867275] hover:text-[#201B10] hover:bg-[#F8EDD9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline notice badge */}
        <div className="px-5 py-3 bg-[#F8EDD9]/80 border-b border-[#ECE1CE] flex items-center gap-2 text-xs text-[#544245]">
          <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>Salvo no seu navegador via armazenamento local seguro. Disponível sem necessidade de login.</span>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {savedBooks.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <BookOpen className="w-12 h-12 text-[#867275] opacity-40 mb-3" />
              <h3 className="font-serif text-base font-bold text-[#4E0820]">Seu Folio está vazio</h3>
              <p className="text-xs text-[#544245] max-w-xs mt-1">
                Explore os livros e clique no ícone de marcador para guardá-los em sua estante pessoal.
              </p>
              <Link
                href="/explore-books"
                onClick={() => setIsFolioOpen(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#6B2035] text-white text-xs font-semibold hover:bg-[#481725] transition-all"
              >
                Explorar Acervo
              </Link>
            </div>
          ) : (
            savedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#ECE1CE] shadow-2xs hover:shadow-sm transition-all"
                style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
              >
                <div className="relative w-14 h-20 rounded overflow-hidden bg-[#ECE1CE] shrink-0">
                  <Image
                    src={book.coverUrl || 'https://picsum.photos/seed/vintage/100/150'}
                    alt={book.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/book/${book.id}`}
                    onClick={() => setIsFolioOpen(false)}
                    className="font-serif font-bold text-sm text-[#4E0820] hover:text-[#6B2035] transition-colors line-clamp-1 block"
                  >
                    {book.title}
                  </Link>
                  <p className="text-xs text-[#894C5A] truncate">{book.author}</p>
                  <span className="text-[11px] text-[#867275] mt-1 block">
                    {book.pageCount} pp • {book.genre}
                  </span>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => {
                        const match = SOUNDSCAPES.find(s => 
                          s.bookCompanion.toLowerCase().includes(book.title.toLowerCase())
                        ) || SOUNDSCAPES[0];
                        playSoundscape(match);
                      }}
                      className="text-[11px] text-[#6B2035] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Headphones className="w-3 h-3" />
                      <span>Ouvir trilha</span>
                    </button>

                    <Link
                      href={`/book/${book.id}`}
                      onClick={() => setIsFolioOpen(false)}
                      className="text-[11px] text-[#544245] hover:text-[#201B10] flex items-center gap-0.5"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => removeBook(book.id)}
                  className="p-1.5 text-[#867275] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover do Folio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {savedBooks.length > 0 && (
          <div className="p-4 border-t border-[#ECE1CE] bg-[#FFFFFF] flex items-center justify-between">
            <span className="text-xs text-[#867275]">
              Disponível em qualquer dispositivo
            </span>
            <Link
              href="/explore-books"
              onClick={() => setIsFolioOpen(false)}
              className="text-xs text-[#6B2035] font-bold hover:underline"
            >
              Adicionar mais livros
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
