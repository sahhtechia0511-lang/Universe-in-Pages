'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  X,
  SlidersHorizontal,
  RefreshCw,
  Grid,
  List,
  Sparkles,
  RotateCcw,
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Check,
  Disc3,
  ExternalLink,
  Heart,
  Wand2,
  Moon
} from 'lucide-react';
import { CURATED_BOOKS } from '@/lib/curated-books';
import { Book } from '@/lib/types';
import BookCard from '@/components/BookCard';

function ExploreBooksContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';
  const initialAtmosphere = searchParams.get('atmosphere') || '';

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialGenre || 'all');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [simulatedMode, setSimulatedMode] = useState<'results' | 'empty' | 'loading'>('results');

  const [selectedAtmospheres, setSelectedAtmospheres] = useState<string[]>(
    initialAtmosphere ? [initialAtmosphere] : []
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialGenre ? [initialGenre] : []
  );
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'title' | 'year'>('rating');
  const [viewLayout, setViewLayout] = useState<'grid' | 'linear'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Search or category fetch via Books API
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed && selectedCategory === 'all') {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const queryParam = trimmed ? `q=${encodeURIComponent(trimmed)}` : `genre=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(`/api/books/search?${queryParam}&maxResults=32`);
        if (res.ok) {
          const data = await res.json();
          if (data.books && data.books.length > 0) {
            setSearchResults(data.books);
          } else {
            // Local fallback
            const lower = (trimmed || selectedCategory).toLowerCase();
            const filtered = CURATED_BOOKS.filter(b => {
              if (lower === 'dark romance') return b.genre.toLowerCase() === 'dark romance';
              if (lower === 'romance') return b.genre.toLowerCase() === 'romance';
              if (lower === 'fantasia') return b.genre.toLowerCase() === 'fantasia';
              if (lower === 'suspense') return b.genre.toLowerCase().includes('suspense');
              return (
                b.title.toLowerCase().includes(lower) ||
                b.author.toLowerCase().includes(lower) ||
                b.genre.toLowerCase().includes(lower) ||
                b.atmosphere.some(a => a.toLowerCase().includes(lower))
              );
            });
            setSearchResults(filtered);
          }
        }
      } catch (err) {
        console.warn('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Robust immediate baseline + API enrichment
  const rawBooks = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    if (selectedCategory !== 'all') {
      if (searchResults.length > 0) {
        return searchResults;
      }
      const sel = selectedCategory.toLowerCase();
      return CURATED_BOOKS.filter(b => {
        const bGenre = b.genre.toLowerCase();
        if (sel === 'dark romance') return bGenre === 'dark romance';
        if (sel === 'romance') return bGenre === 'romance';
        if (sel === 'fantasia') return bGenre === 'fantasia';
        if (sel === 'suspense') return bGenre.includes('suspense');
        return bGenre.includes(sel);
      });
    }
    return CURATED_BOOKS;
  }, [searchQuery, selectedCategory, searchResults]);

  // Atmosphere toggle
  const toggleAtmosphere = (atmo: string) => {
    setSelectedAtmospheres(prev =>
      prev.includes(atmo) ? prev.filter(a => a !== atmo) : [...prev, atmo]
    );
    setCurrentPage(1);
  };

  // Genre toggle
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    let result = [...rawBooks];

    // Mood / Atmosphere filter
    if (selectedAtmospheres.length > 0 && !searchQuery) {
      result = result.filter(b =>
        b.atmosphere?.some(a => selectedAtmospheres.includes(a))
      );
    }

    // Category / Genre filter
    if (selectedCategory !== 'all' && !searchQuery) {
      const sel = selectedCategory.toLowerCase();
      result = result.filter(b => {
        const bGenre = (b.genre || '').toLowerCase();
        if (sel === 'dark romance') return bGenre.includes('dark romance');
        if (sel === 'romance') return bGenre === 'romance' || (bGenre.includes('romance') && !bGenre.includes('dark'));
        if (sel === 'fantasia') return bGenre.includes('fantasia') || bGenre.includes('fantasy');
        if (sel === 'suspense') return bGenre.includes('suspense') || bGenre.includes('mistério') || bGenre.includes('thriller');
        return bGenre.includes(sel);
      });
    }

    // Genre filter checkboxes from sidebar
    if (selectedGenres.length > 0 && !searchQuery) {
      result = result.filter(b => {
        const bGenre = (b.genre || '').toLowerCase();
        return selectedGenres.some(g => {
          const gLower = g.toLowerCase();
          if (gLower === 'dark romance') return bGenre.includes('dark romance');
          if (gLower === 'romance') return bGenre === 'romance' || (bGenre.includes('romance') && !bGenre.includes('dark'));
          if (gLower === 'fantasia') return bGenre.includes('fantasia') || bGenre.includes('fantasy');
          if (gLower === 'suspense') return bGenre.includes('suspense') || bGenre.includes('mistério') || bGenre.includes('thriller');
          return bGenre.includes(gLower);
        });
      });
    }

    // Page Length filter
    if (selectedLength && !searchQuery) {
      if (selectedLength === '<250') {
        result = result.filter(b => b.pageCount < 250);
      } else if (selectedLength === '250-450') {
        result = result.filter(b => b.pageCount >= 250 && b.pageCount <= 450);
      } else if (selectedLength === '450+') {
        result = result.filter(b => b.pageCount > 450);
      } else if (selectedLength === '700+') {
        result = result.filter(b => b.pageCount >= 700);
      }
    }

    // Min Rating filter
    if (selectedRating !== null) {
      result = result.filter(b => b.rating >= selectedRating);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => (b.readersCount || 0) - (a.readersCount || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'year') {
      result.sort((a, b) => Number(b.publishedYear || 0) - Number(a.publishedYear || 0));
    }

    return result;
  }, [rawBooks, selectedAtmospheres, selectedGenres, selectedCategory, selectedLength, selectedRating, sortBy, searchQuery]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchResults([]);
    setSelectedAtmospheres([]);
    setSelectedGenres([]);
    setSelectedLength(null);
    setSelectedRating(null);
    setSortBy('rating');
    setSimulatedMode('results');
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));
  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col w-full">
      
      {/* Top Atmospheric Header with Editorial Scale (Matching Image 1) */}
      <section className="relative w-full overflow-hidden bg-[#F8EDD9]/60 px-5 md:px-12 pt-12 pb-10 border-b border-[#ECE1CE]">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#FFD9DF]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 -bottom-16 w-80 h-80 rounded-full bg-[#F3E8D5] blur-2xl pointer-events-none"></div>

        <div className="max-w-[1360px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-[#4E0820] text-xs uppercase tracking-widest font-bold">
                <BookOpen className="w-4 h-4 text-[#6B2035]" />
                <span>Códice Arquivístico • Folio Universal</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#4E0820] font-bold tracking-tight">
                Explore o Cosmo Literário
              </h1>
              <p className="text-base text-[#544245] max-w-2xl leading-relaxed">
                Pesquise por milhares de títulos curados, filtre por atmosfera literária e descubra universos sob medida para o seu gosto.
              </p>
            </div>

            {/* Sync Notice Badge */}
            <div className="flex items-center gap-3 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-xs border border-[#ECE1CE] max-w-sm">
              <RefreshCw className="w-5 h-5 text-[#6B2035] shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#4E0820]">
                  Sincronização Google Books & Acervo Livre
                </span>
                <span className="text-[11px] text-[#544245]">
                  Acesso público e gratuito sem necessidade de cadastro.
                </span>
              </div>
            </div>
          </div>

          {/* Omnisearch Bar Layer */}
          <div className="mt-8 bg-[#FFFFFF] p-2 sm:p-3 rounded-2xl shadow-xl border border-[#ECE1CE] flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-1">
              <Search className="w-6 h-6 text-[#6B2035] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise por título, autor, tema celestial (ex: 'Borges labirinto', 'Piranesi', 'romance gótico')..."
                className="w-full bg-transparent border-0 outline-none text-sm sm:text-base text-[#201B10] placeholder:text-[#867275]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#867275] hover:text-[#4E0820] p-1"
                  title="Limpar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => {
                  if (simulatedMode === 'results') setSimulatedMode('loading');
                  else if (simulatedMode === 'loading') setSimulatedMode('empty');
                  else setSimulatedMode('results');
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8EDD9] text-[#201B10] text-xs font-semibold hover:bg-[#F2E7D4] transition-all"
                title="Alternar modo de demonstração"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#894C5A]" />
                <span className="hidden sm:inline">Modo Demonstração</span>
              </button>
            </div>

            {/* Live Query Hint Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-2 pb-1 border-t border-[#ECE1CE]/60 text-xs text-[#544245]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-[#867275] font-bold uppercase tracking-wider">
                  Atmosferas Sugeridas:
                </span>
                {['Melancólico', 'Instigante', 'Aconchegante Vintage', 'Filosófico'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-0.5 rounded-full bg-[#F8EDD9] hover:bg-[#6B2035] hover:text-white text-[#6B2035] transition-colors text-[11px] font-semibold"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#894C5A] font-semibold">
                3.482 Tomos Disponíveis Offline
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Discovery Canvas */}
      <div className="max-w-[1360px] mx-auto w-full px-5 md:px-12 py-8 flex flex-col gap-6">
        
        {/* Quick Category Filters Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Todos os Tomos', icon: BookOpen },
            { id: 'Romance', label: 'Romance', icon: Heart },
            { id: 'Fantasia', label: 'Fantasia', icon: Wand2 },
            { id: 'Suspense', label: 'Suspense & Mistério', icon: Search },
            { id: 'Dark Romance', label: 'Dark Romance', icon: Moon },
            { id: 'Ficção Literária', label: 'Ficção Literária', icon: BookOpen },
            { id: 'Ficção Histórica', label: 'Ficção Histórica', icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedGenres(cat.id === 'all' ? [] : [cat.id]);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#4E0820] text-white border-[#4E0820] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#544245] border-[#ECE1CE] hover:bg-[#F8EDD9] hover:text-[#201B10]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFD9DF]' : 'text-[#894C5A]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Toolbar & Global Quick Metrics */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-xl shadow-xs border border-[#ECE1CE]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-serif text-sm font-bold text-[#4E0820]">
              Ordenar Catálogo:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'rating', label: 'Mais Bem Avaliados' },
                { id: 'popularity', label: 'Mais Populares' },
                { id: 'title', label: 'Alfabética (Título)' },
                { id: 'year', label: 'Ano de Publicação' },
              ].map((sortItem) => {
                const isActive = sortBy === sortItem.id;
                return (
                  <button
                    key={sortItem.id}
                    onClick={() => setSortBy(sortItem.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#4E0820] text-white shadow-xs'
                        : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
                    }`}
                  >
                    {sortItem.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <span className="text-xs text-[#544245]">
              Exibindo <strong>{simulatedMode === 'empty' ? 0 : filteredBooks.length}</strong> volumes curados
            </span>
            <div className="h-4 w-px bg-[#ECE1CE]"></div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewLayout('grid')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewLayout === 'grid'
                    ? 'bg-[#4E0820] text-white'
                    : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
                }`}
                title="Visualização em Grade"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewLayout('linear')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewLayout === 'linear'
                    ? 'bg-[#4E0820] text-white'
                    : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
                }`}
                title="Visualização em Prateleira Linear"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Exploration Body (Sidebar + Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Asymmetric Filter Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 flex flex-col gap-5 bg-[#FFFFFF] p-5 rounded-2xl shadow-xs border border-[#ECE1CE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE1CE]">
              <div className="flex items-center gap-2 text-[#4E0820]">
                <SlidersHorizontal className="w-4 h-4 text-[#6B2035]" />
                <h2 className="font-serif text-base font-bold">Refinar Constelação</h2>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#894C5A] hover:text-[#4E0820] transition-colors underline underline-offset-4 font-semibold"
              >
                Redefinir Tudo
              </button>
            </div>

            {/* Filter Group: Reading Atmosphere / Mood */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4E0820] uppercase tracking-wide">
                Atmosfera • Humor
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Melancólico',
                  'Instigante',
                  'Romântico',
                  'Aconchegante',
                  'Filosófico',
                  'Sombrio'
                ].map((atmo) => {
                  const isChecked = selectedAtmospheres.includes(atmo);
                  return (
                    <button
                      key={atmo}
                      onClick={() => toggleAtmosphere(atmo)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                        isChecked
                          ? 'bg-[#4E0820] text-white'
                          : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
                      }`}
                    >
                      {atmo}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px w-full bg-[#ECE1CE]"></div>

            {/* Filter Group: Genre */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4E0820] uppercase tracking-wide">
                Gênero Literário
              </span>
              <div className="flex flex-col gap-2 pt-1 text-xs text-[#201B10]">
                {[
                  { name: 'Romance', count: '2.450' },
                  { name: 'Fantasia', count: '2.180' },
                  { name: 'Suspense', count: '1.940' },
                  { name: 'Dark Romance', count: '1.320' },
                  { name: 'Ficção Literária', count: '1.420' },
                  { name: 'Ficção Histórica', count: '980' },
                ].map((g) => {
                  const checked = selectedGenres.includes(g.name) || (selectedGenres.length === 0 && selectedCategory === g.name);
                  return (
                    <label key={g.name} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2 group-hover:text-[#6B2035] transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleGenre(g.name)}
                          className="rounded text-[#4E0820] focus:ring-0 accent-[#6B2035]"
                        />
                        <span>{g.name}</span>
                      </span>
                      <span className="text-[#867275] text-[11px] font-medium">{g.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="h-px w-full bg-[#ECE1CE]"></div>

            {/* Filter Group: Page Length */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4E0820] uppercase tracking-wide">
                Extensão de Páginas • Peso
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { key: '<250', label: '< 250 pp', sub: 'Noite Ágil' },
                  { key: '250-450', label: '250 – 450 pp', sub: 'Romance Padrão' },
                  { key: '450+', label: '450+ pp', sub: 'Imersão Profunda' },
                  { key: '700+', label: 'Épico 700+ pp', sub: 'Jornada Monumental' },
                ].map((len) => {
                  const isActive = selectedLength === len.key;
                  return (
                    <button
                      key={len.key}
                      onClick={() => setSelectedLength(isActive ? null : len.key)}
                      className={`p-2 rounded-lg text-left flex flex-col gap-0.5 transition-all text-xs ${
                        isActive
                          ? 'bg-[#6B2035] text-white shadow-xs'
                          : 'bg-[#F8EDD9] text-[#201B10] hover:bg-[#F2E7D4]'
                      }`}
                    >
                      <span className="font-bold">{len.label}</span>
                      <span className={`text-[10px] ${isActive ? 'text-[#FFD9DF]' : 'text-[#544245]'}`}>
                        {len.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px w-full bg-[#ECE1CE]"></div>

            {/* Filter Group: Reader Rating */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4E0820] uppercase tracking-wide">
                Aclamação da Comunidade
              </span>
              <div className="flex flex-col gap-1.5 pt-1 text-xs">
                {[
                  { val: 4.5, label: '4.5★ ou mais (Transcendental)' },
                  { val: 4.0, label: '4.0★ ou mais (Muito Apreciado)' },
                  { val: 3.5, label: '3.5★ ou mais (Seleção Curada)' },
                ].map((item) => (
                  <label key={item.val} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-[#F8EDD9] transition-colors">
                    <input
                      type="radio"
                      name="rating-filter"
                      checked={selectedRating === item.val}
                      onChange={() => setSelectedRating(item.val)}
                      className="text-[#4E0820] accent-[#6B2035]"
                    />
                    <span className="text-[#201B10] font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ambient Metadata Info Card */}
            <div className="p-3 bg-[#F8EDD9] rounded-xl flex items-start gap-2.5 mt-2 border border-[#ECE1CE]">
              <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-[#4E0820]">
                  Indexado via Google Books API
                </span>
                <p className="text-[11px] text-[#544245] leading-normal">
                  Capas de livros, edições e metadados obtidos de acervos bibliográficos abertos em tempo real.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Results Column (8 Columns) */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Interactive Mode View Switcher Bar */}
            <div className="bg-[#F8EDD9] p-1.5 rounded-xl flex items-center justify-between text-xs text-[#544245] border border-[#ECE1CE]">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setSimulatedMode('results')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    simulatedMode === 'results'
                      ? 'bg-[#FFFFFF] text-[#4E0820] shadow-xs'
                      : 'hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  Resultados em Tempo Real ({filteredBooks.length})
                </button>
                <button
                  onClick={() => setSimulatedMode('empty')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    simulatedMode === 'empty'
                      ? 'bg-[#FFFFFF] text-[#4E0820] shadow-xs'
                      : 'hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  Simular Estado Vazio
                </button>
                <button
                  onClick={() => setSimulatedMode('loading')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    simulatedMode === 'loading'
                      ? 'bg-[#FFFFFF] text-[#4E0820] shadow-xs'
                      : 'hover:bg-[#FFFFFF]/60'
                  }`}
                >
                  Simular Carregamento
                </button>
              </div>
              <span className="text-[11px] hidden sm:inline text-[#867275]">
                Reatividade Instantânea
              </span>
            </div>

            {/* 1. LOADING SKELETON STATE */}
            {(loading || simulatedMode === 'loading') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-[#FFFFFF] rounded-2xl p-5 shadow-xs border border-[#ECE1CE] flex flex-col justify-between h-56">
                    <div className="flex gap-4">
                      <div className="w-28 h-36 bg-[#ECE1CE] rounded-lg shrink-0"></div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-16 h-4 bg-[#ECE1CE] rounded"></div>
                        <div className="w-3/4 h-5 bg-[#ECE1CE] rounded"></div>
                        <div className="w-1/2 h-3 bg-[#ECE1CE] rounded"></div>
                      </div>
                    </div>
                    <div className="w-full h-8 bg-[#ECE1CE] rounded-lg mt-4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. EMPTY STATE */}
            {!loading && (simulatedMode === 'empty' || filteredBooks.length === 0) && (
              <div className="flex flex-col items-center justify-center p-12 bg-[#FFFFFF] rounded-2xl text-center shadow-xs border border-[#ECE1CE]">
                <div className="w-20 h-20 rounded-full bg-[#F8EDD9] flex items-center justify-center text-[#6B2035] mb-4">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4E0820] tracking-tight mb-2">
                  Nenhum tomo encontrado neste recanto cósmico
                </h3>
                <p className="text-sm text-[#544245] max-w-md mb-6 leading-relaxed">
                  Tente ajustar os filtros de atmosfera, ampliar o limite de páginas ou buscar por temas universais mais abrangentes.
                </p>
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#4E0820] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#6B2035] transition-all"
                  >
                    Restaurar Catálogo Padrão
                  </button>
                  <button
                    onClick={() => {
                      const randomBook = CURATED_BOOKS[Math.floor(Math.random() * CURATED_BOOKS.length)];
                      setSearchQuery(randomBook.title);
                      setSimulatedMode('results');
                    }}
                    className="px-5 py-2.5 bg-[#F8EDD9] text-[#201B10] rounded-lg text-xs font-bold hover:bg-[#F2E7D4] transition-all"
                  >
                    Inspirar-me com um Livro Aleatório
                  </button>
                </div>
              </div>
            )}

            {/* 3. LIVE RESULTS CONTAINER */}
            {!loading && simulatedMode === 'results' && filteredBooks.length > 0 && (
              <div className={viewLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
                {displayedBooks.map((book) => (
                  <BookCard key={book.id} book={book} layout={viewLayout} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && simulatedMode === 'results' && filteredBooks.length > itemsPerPage && (
              <div className="flex items-center justify-between p-4 bg-[#FFFFFF] rounded-2xl shadow-xs border border-[#ECE1CE] mt-2 text-xs">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-[#544245] font-semibold hover:text-[#4E0820] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prateleira Anterior</span>
                </button>

                <div className="flex items-center gap-1 font-semibold">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        currentPage === page
                          ? 'bg-[#4E0820] text-white font-bold'
                          : 'hover:bg-[#F8EDD9] text-[#201B10]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-[#544245] font-semibold hover:text-[#4E0820] disabled:opacity-40"
                >
                  <span>Próxima Prateleira</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>
        </div>

        {/* Ambient Literary Sanctuary Banner (Bottom Banner from Image 1) */}
        <section className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-[#4E0820] via-[#6B2035] to-[#4E0820] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#894C5A]/30 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col gap-1.5 relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#FFD9DF] font-bold">
              Sinergia Áudio-Textual
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Stories in Sound: Áudio Companheiro
            </h3>
            <p className="text-xs sm:text-sm text-[#D9C1C4] leading-relaxed">
              Cada livro é associado a uma paisagem sonora ambiente do Spotify e do acervo livre. Leia através da chuva em Lisboa, pátios de pedra antiga ou ressonâncias de violoncelo preparadas especificamente para o tom de cada capítulo.
            </p>
          </div>
          <div className="shrink-0 relative z-10">
            <Link
              href="/playlists"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FFFFFF] text-[#4E0820] text-xs font-bold hover:bg-[#F3E8D5] transition-all shadow-md"
            >
              <Volume2 className="w-4 h-4 text-[#4E0820]" />
              <span>Explorar Todas as Paisagens Sonoras</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

export default function ExploreBooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B2035] animate-spin" />
      </div>
    }>
      <ExploreBooksContent />
    </Suspense>
  );
}
