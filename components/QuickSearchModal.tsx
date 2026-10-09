'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Star, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { useFolio } from '@/lib/folio-context';
import { Book } from '@/lib/types';
import { CURATED_BOOKS } from '@/lib/curated-books';

export default function QuickSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useFolio();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(trimmed)}&maxResults=6`);
        if (res.ok) {
          const data = await res.json();
          if (data.books && data.books.length > 0) {
            setResults(data.books);
          } else {
            const filtered = CURATED_BOOKS.filter(b =>
              b.title.toLowerCase().includes(trimmed.toLowerCase()) ||
              b.author.toLowerCase().includes(trimmed.toLowerCase()) ||
              b.genre.toLowerCase().includes(trimmed.toLowerCase())
            );
            setResults(filtered);
          }
        }
      } catch (err) {
        console.warn('Search modal error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const activeResults = query.trim() ? results : CURATED_BOOKS.slice(0, 5);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    setIsSearchOpen(false);
  };

  if (!isSearchOpen) return null;

  const handleSelectBook = (bookId: string) => {
    handleClose();
    router.push(`/book/${bookId}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const q = query.trim();
      handleClose();
      router.push(`/explore-books?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#ECE1CE] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center gap-3 px-5 py-4 border-b border-[#ECE1CE] bg-[#FBF7F0]/60">
          <Search className="w-5 h-5 text-[#894C5A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor, atmosfera (ex: 'Zafón', 'Piranesi', 'Borges')..."
            className="w-full bg-transparent border-0 outline-none text-[#201B10] placeholder:text-[#867275] text-base"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#6B2035] animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#867275] hover:text-[#201B10]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-[#867275] hover:text-[#201B10] text-xs font-semibold px-2 py-1 rounded bg-[#F2E7D4]"
          >
            ESC
          </button>
        </form>

        {/* Quick Filter Tag Suggestions */}
        <div className="px-5 py-2.5 bg-[#F8EDD9]/50 border-b border-[#ECE1CE] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#867275] font-semibold uppercase text-[10px]">Sugestões:</span>
          {['A Sombra do Vento', 'Piranesi', 'Gótico', 'Filosófico', 'Romance'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF] hover:bg-[#6B2035] hover:text-white text-[#6B2035] border border-[#ECE1CE] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-2 flex-1">
          {activeResults.length === 0 ? (
            <div className="py-12 text-center text-[#544245]">
              <BookOpen className="w-10 h-10 mx-auto text-[#867275] mb-2 opacity-50" />
              <p className="font-serif text-lg font-bold text-[#4E0820]">Nenhum tomo encontrado</p>
              <p className="text-xs text-[#867275] mt-1">Tente buscar por termos mais amplos ou verificar a grafia.</p>
            </div>
          ) : (
            activeResults.map((book) => (
              <div
                key={book.id}
                onClick={() => handleSelectBook(book.id)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8EDD9] cursor-pointer transition-colors group"
              >
                <div className="relative w-12 h-16 rounded overflow-hidden bg-[#ECE1CE] shrink-0 shadow-xs">
                  <Image
                    src={book.coverUrl || 'https://picsum.photos/seed/vintage/100/150'}
                    alt={book.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#4E0820] group-hover:text-[#6B2035] truncate">
                      {book.title}
                    </span>
                    <span className="text-[11px] text-[#867275] shrink-0">({book.publishedYear})</span>
                  </div>
                  <p className="text-xs text-[#894C5A] truncate">{book.author}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#544245]">
                    <span className="bg-[#FFFFFF] px-1.5 py-0.2 rounded text-[10px] text-[#6B2035] font-semibold border border-[#ECE1CE]">
                      {book.genre}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-700">
                      <Star className="w-3 h-3 fill-amber-700" /> {book.rating}
                    </span>
                    <span className="text-[#867275]">{book.pageCount} pp</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#867275] group-hover:text-[#6B2035] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {query && (
          <div className="p-3 bg-[#FBF7F0] border-t border-[#ECE1CE] flex items-center justify-between text-xs text-[#544245]">
            <span>Pressione Enter para ver todos os resultados na página de exploração</span>
            <button
              onClick={handleFullSearch}
              className="text-[#6B2035] font-bold hover:underline flex items-center gap-1"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
