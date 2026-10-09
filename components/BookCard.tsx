'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Headphones, Bookmark, Check } from 'lucide-react';
import { Book } from '@/lib/types';
import { useFolio } from '@/lib/folio-context';
import { SOUNDSCAPES } from '@/lib/soundscapes';

interface BookCardProps {
  book: Book;
  layout?: 'grid' | 'linear';
}

export default function BookCard({ book, layout = 'grid' }: BookCardProps) {
  const { isSaved, toggleSaveBook, playSoundscape } = useFolio();
  const saved = isSaved(book.id);

  const handleAudioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Find matching or relevant soundscape
    const match = SOUNDSCAPES.find(s => 
      s.bookCompanion.toLowerCase().includes(book.title.toLowerCase()) ||
      book.atmosphere.some(a => s.genre.toLowerCase().includes(a.toLowerCase()))
    ) || SOUNDSCAPES[0];
    playSoundscape(match);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveBook(book);
  };

  if (layout === 'linear') {
    return (
      <article 
        className="group relative flex flex-col md:flex-row items-stretch justify-between bg-[#FFFFFF] rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border border-[#ECE1CE]/60"
        style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
      >
        <div className="flex gap-5 flex-1 min-w-0">
          {/* Book Cover */}
          <Link href={`/book/${book.id}`} className="relative w-28 h-40 shrink-0 rounded-lg overflow-hidden shadow-md bg-[#ECE1CE]">
            <Image
              src={book.coverUrl || 'https://picsum.photos/seed/codex/300/450'}
              alt={book.title}
              fill
              sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-1.5 left-1.5 bg-[#4E0820]/90 backdrop-blur-xs text-[10px] text-white font-semibold px-1.5 py-0.5 rounded shadow-xs">
              {book.pageCount} pp
            </span>
          </Link>

          {/* Details */}
          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="bg-[#F8EDD9] text-[#6B2035] font-semibold px-2 py-0.5 rounded">
                  {book.genre || 'Ficção Literária'}
                </span>
                <span className="text-[#867275]">{book.publishedYear}</span>
                {book.atmosphere && book.atmosphere[0] && (
                  <span className="text-[#894C5A] hidden sm:inline bg-[#F2E7D4]/60 px-2 py-0.5 rounded text-[11px]">
                    {book.atmosphere[0]}
                  </span>
                )}
              </div>

              <Link href={`/book/${book.id}`}>
                <h3 className="font-serif text-lg font-bold text-[#4E0820] tracking-tight hover:text-[#6B2035] transition-colors truncate">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm font-medium text-[#894C5A]">{book.author}</p>
              
              <p className="text-xs text-[#544245] italic line-clamp-2 mt-1 leading-relaxed">
                {book.quote || (book.synopsis ? `“${book.synopsis.slice(0, 160)}...”` : '')}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#544245] mt-2">
              <Star className="w-4 h-4 fill-amber-700 text-amber-700" />
              <span className="font-bold text-[#201B10]">{book.rating || 4.8}</span>
              <span className="text-[#867275]">• {book.readersCount?.toLocaleString('pt-BR') || '2.400'} leitores</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 md:mt-0 md:ml-4 flex md:flex-col items-center justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-[#ECE1CE] pt-3 md:pt-0 md:pl-4 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={handleAudioClick}
              className="p-2 rounded-full hover:bg-[#F8EDD9] text-[#6B2035] transition-colors"
              title="Ouvir trilha sonora ambiente companheira"
            >
              <Headphones className="w-5 h-5" />
            </button>
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full transition-colors ${
                saved ? 'text-[#6B2035] bg-[#F8EDD9]' : 'text-[#6B2035] hover:bg-[#F8EDD9]'
              }`}
              title={saved ? 'Salvo no Folio' : 'Salvar no Folio'}
            >
              {saved ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>

          <Link
            href={`/book/${book.id}`}
            className="px-4 py-2 rounded-lg bg-[#4E0820] text-white text-xs font-semibold hover:bg-[#6B2035] transition-all shadow-xs"
          >
            Ver Detalhes
          </Link>
        </div>
      </article>
    );
  }

  // Grid layout (matching Stitch cards in Image 1 and 3)
  return (
    <article
      className="group relative flex flex-col justify-between bg-[#FFFFFF] rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-[#ECE1CE]/60"
      style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
    >
      <div>
        <div className="flex gap-4">
          {/* Book Cover with 3:4 aspect and page badge */}
          <Link href={`/book/${book.id}`} className="relative w-28 h-40 shrink-0 rounded-lg overflow-hidden shadow-md bg-[#ECE1CE]">
            <Image
              src={book.coverUrl || 'https://picsum.photos/seed/codex/300/450'}
              alt={book.title}
              fill
              sizes="112px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-1.5 left-1.5 bg-[#4E0820]/90 backdrop-blur-xs text-[10px] text-white font-semibold px-1.5 py-0.5 rounded shadow-xs">
              {book.pageCount} pp
            </span>
          </Link>

          {/* Book Headers */}
          <div className="flex flex-col justify-between min-w-0 flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold bg-[#F8EDD9] text-[#6B2035] px-2 py-0.5 rounded truncate max-w-[130px]">
                  {book.genre || 'Ficção Literária'}
                </span>
                <span className="text-[11px] text-[#867275]">{book.publishedYear}</span>
              </div>
              <Link href={`/book/${book.id}`}>
                <h3 className="font-serif text-lg font-bold text-[#4E0820] tracking-tight line-clamp-1 group-hover:text-[#6B2035] transition-colors mt-0.5">
                  {book.title}
                </h3>
              </Link>
              <p className="text-xs text-[#894C5A] font-medium truncate">{book.author}</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#544245] pt-1">
              <Star className="w-4 h-4 fill-amber-700 text-amber-700" />
              <span className="font-bold text-[#201B10]">{book.rating || 4.8}</span>
              <span className="text-[#867275]">• {book.readersCount?.toLocaleString('pt-BR') || '2.400'} leitores</span>
            </div>
          </div>
        </div>

        {/* Excerpt / Quote */}
        <p className="text-xs text-[#544245] mt-4 line-clamp-2 italic leading-relaxed">
          {book.quote || (book.synopsis ? `“${book.synopsis.slice(0, 160)}...”` : '')}
        </p>
      </div>

      {/* Card Footer Bar */}
      <div className="mt-4 pt-3 border-t border-[#ECE1CE] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleAudioClick}
            className="p-2 rounded-full hover:bg-[#F8EDD9] text-[#6B2035] transition-colors"
            title="Ouvir trilha sonora ambiente"
          >
            <Headphones className="w-5 h-5" />
          </button>
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full transition-colors ${
              saved ? 'text-[#6B2035] bg-[#F8EDD9]' : 'text-[#6B2035] hover:bg-[#F8EDD9]'
            }`}
            title={saved ? 'Remover do Folio' : 'Salvar no Folio'}
          >
            {saved ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>

        <Link
          href={`/book/${book.id}`}
          className="px-3.5 py-1.5 rounded-lg bg-[#4E0820] text-white text-xs font-semibold hover:bg-[#6B2035] transition-colors shadow-xs"
        >
          Ver Detalhes
        </Link>
      </div>
    </article>
  );
}
