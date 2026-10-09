'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquareQuote,
  Star,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  PlusCircle,
  Loader2
} from 'lucide-react';
import { Review } from '@/lib/types';
import { CURATED_BOOKS } from '@/lib/curated-books';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    async function loadAllReviews() {
      setLoading(true);
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.warn('Reviews page fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      !searchFilter ||
      r.bookTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.reviewerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.content.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesRating = ratingFilter === null || r.rating === ratingFilter;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="w-full pb-20">
      
      {/* Editorial Header */}
      <section className="bg-[#F8EDD9]/60 border-b border-[#ECE1CE] px-5 md:px-12 py-14">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#6B2035] tracking-widest">
              <MessageSquareQuote className="w-4 h-4" />
              <span>Avaliações Críticas & Ensaios Abertos</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#4E0820] tracking-tight">
              Resenhas Literárias
            </h1>
            <p className="text-sm sm:text-base text-[#544245] leading-relaxed">
              Avaliações ponderadas de leitores, bibliófilos e ensaístas. Um espaço comunitário para celebrar nuances, desconstruir narrativas e compartilhar impressões sem intermediários.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#ECE1CE] shadow-xs flex items-center gap-6 shrink-0">
            <div>
              <span className="font-serif text-2xl font-bold text-[#4E0820]">{reviews.length}</span>
              <p className="text-[11px] text-[#867275]">Ensaios Publicados</p>
            </div>
            <div className="h-8 w-px bg-[#ECE1CE]"></div>
            <div>
              <span className="font-serif text-2xl font-bold text-amber-700">4.9★</span>
              <p className="text-[11px] text-[#867275]">Média Geral</p>
            </div>
            <div className="h-8 w-px bg-[#ECE1CE]"></div>
            <div>
              <span className="font-serif text-2xl font-bold text-[#6B2035]">100%</span>
              <p className="text-[11px] text-[#867275]">Acesso Livre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Rating Filter */}
      <div className="max-w-[1360px] mx-auto px-5 md:px-12 py-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#894C5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar por livro, autor ou resenhista..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ECE1CE] bg-[#FFFFFF] text-xs sm:text-sm text-[#201B10] placeholder:text-[#867275] focus:outline-none focus:border-[#6B2035] shadow-2xs"
          />
        </div>

        {/* Rating filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#867275] font-semibold">Nota:</span>
          <button
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              ratingFilter === null
                ? 'bg-[#4E0820] text-white shadow-xs'
                : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
            }`}
          >
            Todas
          </button>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                ratingFilter === r
                  ? 'bg-[#4E0820] text-white shadow-xs'
                  : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
              }`}
            >
              <span>{r}</span>
              <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-[1360px] mx-auto px-5 md:px-12">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#6B2035] animate-spin" />
            <span className="text-xs text-[#867275]">Carregando arquivos de ensaios...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center bg-[#FFFFFF] rounded-2xl border border-[#ECE1CE]">
            <BookOpen className="w-10 h-10 text-[#867275] mx-auto mb-2 opacity-50" />
            <h3 className="font-serif text-lg font-bold text-[#4E0820]">Nenhuma resenha encontrada</h3>
            <p className="text-xs text-[#544245] mt-1 mb-4">Tente ajustar seus termos de pesquisa.</p>
            <button
              onClick={() => { setSearchFilter(''); setRatingFilter(null); }}
              className="px-4 py-2 rounded-lg bg-[#4E0820] text-white text-xs font-bold"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <article
                key={review.id}
                className="bg-[#FFFFFF] rounded-2xl p-6 shadow-xs border border-[#ECE1CE] hover:shadow-md transition-all flex flex-col justify-between"
                style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECE1CE]/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F2E7D4] flex items-center justify-center font-serif text-[#4E0820] text-xs font-bold">
                        {review.reviewerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-[#4E0820]">
                          {review.reviewerName}
                        </h4>
                        <p className="text-[11px] text-[#867275]">
                          {review.reviewerRole} • {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-700">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-amber-700' : 'text-[#ECE1CE]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Book Citation */}
                  <div className="mt-3.5">
                    <Link
                      href={`/book/${review.bookId}`}
                      className="text-[11px] uppercase font-bold text-[#894C5A] hover:text-[#6B2035] tracking-wider transition-colors inline-block"
                    >
                      Obra: {review.bookTitle}
                    </Link>
                    <h3 className="font-serif text-lg font-bold text-[#4E0820] italic mt-1 leading-snug">
                      “{review.title}”
                    </h3>
                    <p className="text-xs sm:text-sm text-[#544245] mt-2 leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-5 pt-3 border-t border-[#ECE1CE] flex items-center justify-between">
                  <span className="text-[11px] text-[#867275] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{review.readingMinutes || 5} min de leitura</span>
                  </span>

                  <Link
                    href={`/book/${review.bookId}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F8EDD9] hover:bg-[#F2E7D4] text-[#6B2035] text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Ver no Livro</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Call to action: Write a review */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 mt-16">
        <div className="bg-[#F8EDD9] p-8 rounded-3xl border border-[#ECE1CE] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl flex flex-col gap-1.5">
            <h3 className="font-serif text-2xl font-bold text-[#4E0820]">
              Quer compartilhar suas impressões sobre uma obra?
            </h3>
            <p className="text-xs sm:text-sm text-[#544245]">
              Navegue até qualquer livro do acervo público e registre sua resenha diretamente. Sem tela de login ou aprovação burocrática.
            </p>
          </div>
          <Link
            href="/explore-books"
            className="px-6 py-3 rounded-lg bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Escolher Livro para Resenhar</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
