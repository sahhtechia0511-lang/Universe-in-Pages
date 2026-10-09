'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Compass,
  Heart,
  Coffee,
  Moon,
  Star,
  Check,
  Bookmark
} from 'lucide-react';
import { CURATED_BOOKS } from '@/lib/curated-books';
import { useFolio } from '@/lib/folio-context';

export default function RecommendationsPage() {
  const { isSaved, toggleSaveBook } = useFolio();

  const themes = [
    {
      id: 'romance',
      title: 'Romance & Encontros Transformadores',
      subtitle: 'Comédias românticas contemporâneas, faíscas irresistíveis e romances que aquecem o coração.',
      icon: Heart,
      books: [
        {
          book: CURATED_BOOKS.find(b => b.id === 'e-assim-que-acaba') || CURATED_BOOKS[0],
          whyRead: 'Um fenômeno emocional poderoso sobre força, escolhas difíceis e a coragem de quebrar ciclos.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'a-hipotese-do-amor') || CURATED_BOOKS[2],
          whyRead: 'Namoro de mentira na academia com diálogos afiados e uma química científica adorável.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'vermelho-branco-sangue-azul') || CURATED_BOOKS[6],
          whyRead: 'Carisma transbordante, diplomacia caótica e um amor secreto entre palácios de tirar o fôlego.'
        }
      ]
    },
    {
      id: 'fantasia',
      title: 'Cortes Feéricas, Magia & Voo de Dragões',
      subtitle: 'Mundos fascinantes onde a sobrevivência depende de pactos ancestrais, poder arcanos e coragem.',
      icon: Sparkles,
      books: [
        {
          book: CURATED_BOOKS.find(b => b.id === 'quarta-asa') || CURATED_BOOKS[14],
          whyRead: 'Dragões impiedosos, treinamento militar letal e uma das protagonistas mais resilientes da fantasia atual.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'corte-de-espinhos-e-rosas') || CURATED_BOOKS[12],
          whyRead: 'A porta de entrada definitiva para o universo feérico de Prythian e suas cortes mágicas.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'o-principe-cruel') || CURATED_BOOKS[16],
          whyRead: 'Intrigas políticas mortíferas na Alta Corte de Elfhame com uma protagonista que não teme ser implacável.'
        }
      ]
    },
    {
      id: 'suspense',
      title: 'Suspense Psicológico & Quartos Fechados',
      subtitle: 'Reviravoltas de tirar o fôlego, segredos de família ocultos e narradores nada confiáveis.',
      icon: Moon,
      books: [
        {
          book: CURATED_BOOKS.find(b => b.id === 'a-empregada') || CURATED_BOOKS[26],
          whyRead: 'Ritmo alucinante onde nada é o que parece e o perigo espreita atrás de portas trancadas por fora.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'a-paciente-silenciosa') || CURATED_BOOKS[25],
          whyRead: 'Um mistério forense hipnótico inspirado na tragédia grega de Alceste com final estarrecedor.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'verity') || CURATED_BOOKS[28],
          whyRead: 'Manuscritos perturbadores, atmosfera asfixiante e reviravolta final que divide leitores até hoje.'
        }
      ]
    },
    {
      id: 'dark-romance',
      title: 'Dark Romance & Paixões Proibidas',
      subtitle: 'Tensão máxima, moralidades cinzentas e romances intensos com estética sombria e gótica.',
      icon: Coffee,
      books: [
        {
          book: CURATED_BOOKS.find(b => b.id === 'haunting-adeline') || CURATED_BOOKS[35],
          whyRead: 'Casarão gótico, herança misteriosa e um jogo claustrofóbico entre predador e presa.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'punk-57') || CURATED_BOOKS[37],
          whyRead: 'Cartas anônimas com as verdades mais cruas que se transformam em uma batalha cara a cara.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'twisted-love') || CURATED_BOOKS[41],
          whyRead: 'Um bilionário de gelo forçado a proteger a irmã do melhor amigo, desencadeando segredos letais.'
        }
      ]
    },
    {
      id: 'ressaca',
      title: 'Curas para a Ressaca Literária',
      subtitle: 'Narrativas acolhedoras e magnéticas perfeitas para resgatar o prazer de ler sem esforço.',
      icon: Compass,
      books: [
        {
          book: CURATED_BOOKS.find(b => b.id === 'melhor-do-que-nos-filmes') || CURATED_BOOKS[5],
          whyRead: 'Homenagem deliciosa a comédias românticas dos anos 90 com humor leve e vizinhos que se implicam.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'um-cavalheiro-em-moscou') || CURATED_BOOKS[44],
          whyRead: 'Elegância, amizades calorosas e a descoberta de universos inteiros entre as paredes de um hotel.'
        },
        {
          book: CURATED_BOOKS.find(b => b.id === 'piranesi') || CURATED_BOOKS[18],
          whyRead: 'Maravilhado, conciso e poético sobre um homem em paz com um oceano dentro de casa.'
        }
      ]
    }
  ];

  const [activeThemeId, setActiveThemeId] = useState(themes[0].id);
  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  return (
    <div className="w-full pb-20">
      
      {/* Header */}
      <section className="bg-[#F8EDD9]/60 border-b border-[#ECE1CE] px-5 md:px-12 py-14">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#6B2035] tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Itinerários de Descoberta Curada</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#4E0820] tracking-tight">
              Recomendações Literárias
            </h1>
            <p className="text-sm sm:text-base text-[#544245] leading-relaxed">
              Guias de leitura cuidadosamente desenhados para cada estado de espírito, momento de vida e horizonte imaginativo.
            </p>
          </div>
        </div>
      </section>

      {/* Theme Selector Tabs */}
      <div className="max-w-[1360px] mx-auto px-5 md:px-12 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = t.id === activeThemeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveThemeId(t.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#4E0820] text-white shadow-xs'
                    : 'bg-[#F8EDD9] text-[#544245] hover:bg-[#F2E7D4] hover:text-[#201B10]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Theme Showcase */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 mt-8">
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#ECE1CE] shadow-xs flex flex-col gap-8">
          
          <div className="flex flex-col gap-1 pb-4 border-b border-[#ECE1CE]">
            <span className="text-[11px] uppercase font-bold text-[#894C5A] tracking-wider">
              Coleção em Destaque
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E0820]">
              {activeTheme.title}
            </h2>
            <p className="text-sm text-[#544245] max-w-2xl leading-relaxed">
              {activeTheme.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTheme.books.map(({ book, whyRead }) => {
              const saved = isSaved(book.id);
              return (
                <div
                  key={book.id}
                  className="bg-[#FBF7F0] rounded-2xl p-5 border border-[#ECE1CE] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
                >
                  <div>
                    {/* Cover & Title */}
                    <div className="flex gap-4">
                      <Link href={`/book/${book.id}`} className="relative w-24 h-36 rounded-lg overflow-hidden bg-[#ECE1CE] shrink-0 shadow-xs">
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </Link>

                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <span className="bg-[#F8EDD9] text-[#6B2035] text-[10px] font-bold px-2 py-0.5 rounded">
                            {book.genre}
                          </span>
                          <Link href={`/book/${book.id}`}>
                            <h3 className="font-serif font-bold text-base text-[#4E0820] hover:text-[#6B2035] transition-colors mt-1 line-clamp-2">
                              {book.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#894C5A] font-medium">{book.author}</p>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-700" />
                          <span className="font-bold text-[#201B10]">{book.rating}</span>
                          <span className="text-[#867275]">• {book.pageCount} pp</span>
                        </div>
                      </div>
                    </div>

                    {/* Why Read Curatorial Note */}
                    <div className="mt-4 p-3 rounded-xl bg-[#FFFFFF] border border-[#ECE1CE] text-xs">
                      <span className="font-bold text-[#4E0820] block mb-0.5">
                        Por que ler nesta ocasião:
                      </span>
                      <p className="text-[#544245] leading-relaxed italic">
                        “{whyRead}”
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-[#ECE1CE] flex items-center justify-between">
                    <button
                      onClick={() => toggleSaveBook(book)}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        saved ? 'text-[#6B2035] bg-[#F8EDD9]' : 'text-[#544245] hover:bg-[#F8EDD9]'
                      }`}
                      title={saved ? 'Salvo no Folio' : 'Salvar no Folio'}
                    >
                      {saved ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{saved ? 'No Folio' : 'Guardar'}</span>
                    </button>

                    <Link
                      href={`/book/${book.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Ver Obra Completa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Atmospheric Quote Section */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 mt-16">
        <div className="p-8 md:p-12 rounded-3xl bg-[#4E0820] text-white text-center flex flex-col items-center gap-4 border border-[#6B2035] shadow-xl">
          <span className="text-xs uppercase tracking-widest text-[#FFD9DF] font-bold">
            Reflexão Arquivística
          </span>
          <p className="font-serif italic text-xl sm:text-2xl max-w-2xl text-[#FFF8F1] leading-relaxed">
            “Um livro é uma máquina para recriar o mundo; abrir suas páginas é inaugurar um tempo que não pertencerá à pressa das horas mundanas.”
          </p>
          <span className="text-xs text-[#FFB1C0] font-medium">— Bernardo Soares, O Livro do Desassossego</span>
        </div>
      </section>

    </div>
  );
}
