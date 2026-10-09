'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Bookmark,
  Check,
  Headphones,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Send,
  Loader2,
  Share2,
  Clock,
  ShieldCheck,
  MessageSquareQuote
} from 'lucide-react';
import { Book, Review } from '@/lib/types';
import { CURATED_BOOKS } from '@/lib/curated-books';
import { SOUNDSCAPES } from '@/lib/soundscapes';
import { useFolio } from '@/lib/folio-context';
import BookCard from '@/components/BookCard';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isSaved, toggleSaveBook, playSoundscape } = useFolio();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('Leitor da Comunidade');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewHoneypot, setReviewHoneypot] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');
  const [reviewErrorMessage, setReviewErrorMessage] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Load Book details
  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.book) {
            setBook(data.book);
          }
        } else {
          // Curated fallback
          const found = CURATED_BOOKS.find(b => b.id === resolvedParams.id);
          if (found) setBook(found);
        }
      } catch (err) {
        console.warn('Error loading book:', err);
        const found = CURATED_BOOKS.find(b => b.id === resolvedParams.id);
        if (found) setBook(found);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [resolvedParams.id]);

  // Load reviews for this book
  useEffect(() => {
    if (!book) return;
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews?bookId=${encodeURIComponent(book?.id || '')}`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.warn('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [book]);

  // Handle Review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    setSubmittingReview(true);
    setReviewErrorMessage('');
    setReviewSuccessMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          reviewerName: reviewName,
          reviewerRole: reviewRole,
          rating: reviewRating,
          title: reviewTitle,
          content: reviewContent,
          website_trap: reviewHoneypot, // Honeypot spam trap
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSuccessMessage('Sua resenha foi publicada com sucesso no acervo público!');
        if (data.review) {
          setReviews(prev => [data.review, ...prev]);
        }
        setReviewName('');
        setReviewTitle('');
        setReviewContent('');
      } else {
        setReviewErrorMessage(data.error || 'Erro ao publicar a resenha. Verifique os campos.');
      }
    } catch (err) {
      setReviewErrorMessage('Falha na comunicação com o servidor de resenhas.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B2035] animate-spin" />
        <span className="font-serif text-sm text-[#544245]">Consultando os arquivos universais...</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-[#4E0820]">Livro não encontrado</h2>
        <p className="text-sm text-[#544245] mt-1 mb-4">O volume solicitado não pôde ser recuperado do arquivo.</p>
        <Link
          href="/explore-books"
          className="px-5 py-2.5 bg-[#4E0820] text-white rounded-lg text-xs font-bold hover:bg-[#6B2035]"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const saved = isSaved(book.id);
  const companionSoundscape = SOUNDSCAPES.find(s =>
    s.bookCompanion.toLowerCase().includes(book.title.toLowerCase()) ||
    book.atmosphere.some(a => s.genre.toLowerCase().includes(a.toLowerCase()))
  ) || SOUNDSCAPES[0];

  // Related books
  const relatedBooks = CURATED_BOOKS.filter(b => b.id !== book.id && (b.genre === book.genre || b.atmosphere.some(a => book.atmosphere.includes(a)))).slice(0, 3);

  // Calculate review score
  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
    : book.rating || 4.8;

  return (
    <div className="w-full pb-20">
      
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-[#F8EDD9]/60 border-b border-[#ECE1CE] py-3.5 px-5 md:px-12">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <Link
            href="/explore-books"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E0820] hover:text-[#6B2035] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Cosmo Literário</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-[#FFFFFF] text-[#544245] hover:text-[#4E0820] border border-[#ECE1CE] text-xs font-medium flex items-center gap-1 shadow-2xs"
              title="Copiar link do livro"
            >
              <Share2 className="w-3.5 h-3.5 text-[#6B2035]" />
              <span className="hidden sm:inline">{shareCopied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Book Presentation Canvas */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Book Spine Artwork & Direct Actions (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5 sticky top-24">
            <div 
              className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-[#ECE1CE] border border-[#ECE1CE]"
              style={{ boxShadow: 'inset 4px 0 0 0 #6B2035, 0 16px 36px -4px rgba(72, 23, 37, 0.14)' }}
            >
              <Image
                src={book.coverUrl || 'https://picsum.photos/seed/vintage/400/600'}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-[#4E0820]/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                {book.pageCount} páginas
              </span>
            </div>

            {/* Quick Action Ribbon */}
            <div className="flex flex-col gap-2.5 max-w-sm mx-auto w-full">
              <button
                onClick={() => toggleSaveBook(book)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                  saved
                    ? 'bg-[#F8EDD9] text-[#6B2035] border border-[#6B2035]'
                    : 'bg-[#4E0820] hover:bg-[#6B2035] text-white'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Arquivado em seu Folio Pessoal</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Salvar no Folio (Offline)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => playSoundscape(companionSoundscape)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#FFFFFF] hover:bg-[#F8EDD9] text-[#4E0820] border border-[#ECE1CE] flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Headphones className="w-4 h-4 text-[#6B2035]" />
                <span>Ouvir Trilha Sonora ({companionSoundscape.genre})</span>
              </button>
            </div>

            {/* Quick Bibliographic Metadata Box */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#ECE1CE] shadow-xs max-w-sm mx-auto w-full text-xs flex flex-col gap-2.5">
              <h4 className="font-serif font-bold text-sm text-[#4E0820] pb-2 border-b border-[#ECE1CE]">
                Ficha Catalográfica
              </h4>
              <div className="flex justify-between py-1 border-b border-[#ECE1CE]/60">
                <span className="text-[#867275]">Ano de Publicação:</span>
                <span className="font-semibold text-[#201B10]">{book.publishedYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ECE1CE]/60">
                <span className="text-[#867275]">Editora:</span>
                <span className="font-semibold text-[#201B10]">{book.publisher || 'Acervo Aberto'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ECE1CE]/60">
                <span className="text-[#867275]">Gênero:</span>
                <span className="font-semibold text-[#6B2035]">{book.genre}</span>
              </div>
              {book.isbn && (
                <div className="flex justify-between py-1 border-b border-[#ECE1CE]/60">
                  <span className="text-[#867275]">ISBN:</span>
                  <span className="font-mono text-[#201B10]">{book.isbn}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-[#867275]">Status no Acervo:</span>
                <span className="text-green-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-700" /> Público & Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Literary Essay & Information (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header Titles & Rating */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#F8EDD9] text-[#6B2035] font-semibold text-xs px-2.5 py-1 rounded-md">
                  {book.genre}
                </span>
                {book.atmosphere?.map((a) => (
                  <span key={a} className="bg-[#F2E7D4] text-[#544245] text-xs px-2.5 py-1 rounded-md">
                    {a}
                  </span>
                ))}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4E0820] tracking-tight mt-1">
                {book.title}
              </h1>

              {book.originalTitle && book.originalTitle !== book.title && (
                <p className="text-xs text-[#867275] italic">Título original: {book.originalTitle}</p>
              )}

              <p className="text-lg font-medium text-[#894C5A]">Por {book.author}</p>

              {/* Acclaim Banner */}
              <div className="flex items-center gap-3 mt-2 bg-[#FFFFFF] p-3 rounded-xl border border-[#ECE1CE] w-fit shadow-xs">
                <div className="flex items-center gap-1 text-amber-700">
                  <Star className="w-5 h-5 fill-amber-700" />
                  <span className="font-serif font-bold text-lg text-[#201B10]">{averageRating}</span>
                </div>
                <div className="h-4 w-px bg-[#ECE1CE]"></div>
                <span className="text-xs text-[#544245]">
                  Baseado em <strong>{book.readersCount?.toLocaleString('pt-BR') || '2.400'}</strong> leituras arquivadas
                </span>
              </div>
            </div>

            {/* Epigraph / Quote */}
            {book.quote && (
              <blockquote className="p-5 rounded-2xl bg-[#F8EDD9]/80 border-l-4 border-[#6B2035] font-serif italic text-base text-[#4E0820] leading-relaxed shadow-xs">
                {book.quote}
              </blockquote>
            )}

            {/* Comprehensive Synopsis */}
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-2xl font-bold text-[#4E0820] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6B2035]" />
                <span>Sinopse & Contexto Literário</span>
              </h2>
              <div className="text-sm sm:text-base text-[#544245] leading-relaxed space-y-4 font-sans bg-[#FFFFFF] p-6 rounded-2xl border border-[#ECE1CE] shadow-xs">
                {book.synopsis ? (
                  book.synopsis.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>Uma obra consagrada que desafia os limites da imaginação e mergulha nas complexidades do espírito humano.</p>
                )}
              </div>
            </div>

            {/* Stories in Sound Companion Box */}
            <div className="bg-[#4E0820] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#6B2035]">
              <div className="flex flex-col gap-1.5 max-w-md">
                <div className="flex items-center gap-1.5 text-xs text-[#FFD9DF] font-bold uppercase tracking-wider">
                  <Headphones className="w-4 h-4 text-[#FFB1C0]" />
                  <span>Stories in Sound: Trilha Recomendada</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {companionSoundscape.title}
                </h3>
                <p className="text-xs text-[#D9C1C4] leading-relaxed">
                  {companionSoundscape.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => playSoundscape(companionSoundscape)}
                  className="px-4 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F3E8D5] text-[#4E0820] text-xs font-bold transition-all shadow-md"
                >
                  Ouvir no Site
                </button>
                <a
                  href={companionSoundscape.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-[#6B2035] hover:bg-[#894C5A] text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Spotify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* =========================================================================
                AVALIAÇÕES & RESENHAS COMUNITÁRIAS (Persistent Reviews System)
               ========================================================================= */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE1CE]">
                <div className="flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-[#6B2035]" />
                  <h2 className="font-serif text-2xl font-bold text-[#4E0820]">
                    Avaliações & Resenhas dos Leitores
                  </h2>
                </div>
                <span className="text-xs text-[#867275] font-semibold">
                  {reviews.length} resenha(s) publicada(s)
                </span>
              </div>

              {/* Form to submit review without login */}
              <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#ECE1CE] shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#4E0820] mb-1">
                  Escrever uma Resenha Pública
                </h3>
                <p className="text-xs text-[#544245] mb-5">
                  Compartilhe suas reflexões com outros leitores. Não é necessário criar conta.
                </p>

                {reviewSuccessMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-700" />
                    <span>{reviewSuccessMessage}</span>
                  </div>
                )}

                {reviewErrorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                    {reviewErrorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  {/* Honeypot hidden input against spam bots */}
                  <input
                    type="text"
                    name="website_trap"
                    value={reviewHoneypot}
                    onChange={(e) => setReviewHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Rating Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#4E0820]">
                      Sua Nota de 1 a 5 Estrelas:
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                          title={`${star} Estrela(s)`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'fill-amber-700 text-amber-700'
                                : 'text-[#ECE1CE]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-[#4E0820]">
                        {reviewRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#544245]">
                        Seu Nome ou Pseudônimo: *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Ex: Clarice M."
                        className="p-2.5 rounded-lg border border-[#ECE1CE] bg-[#FBF7F0] text-sm focus:outline-none focus:border-[#6B2035]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#544245]">
                        Identificação / Papel:
                      </label>
                      <input
                        type="text"
                        value={reviewRole}
                        onChange={(e) => setReviewRole(e.target.value)}
                        placeholder="Ex: Leitor da Comunidade, Ensaísta..."
                        className="p-2.5 rounded-lg border border-[#ECE1CE] bg-[#FBF7F0] text-sm focus:outline-none focus:border-[#6B2035]"
                      />
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#544245]">
                      Título da Resenha: *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Ex: Uma reflexão tocante sobre tempo e solidão"
                      className="p-2.5 rounded-lg border border-[#ECE1CE] bg-[#FBF7F0] text-sm focus:outline-none focus:border-[#6B2035]"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#544245]">
                      Suas Impressões e Crítica: *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Descreva o impacto da obra, ritmo da narrativa, sentimentos despertados e recomendações..."
                      className="p-3 rounded-lg border border-[#ECE1CE] bg-[#FBF7F0] text-sm focus:outline-none focus:border-[#6B2035] leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-fit self-start px-6 py-2.5 rounded-lg bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Publicar Resenha no Acervo</span>
                  </button>
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="flex flex-col gap-4">
                {reviewsLoading ? (
                  <div className="py-8 text-center text-xs text-[#867275]">
                    Carregando resenhas dos leitores...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-8 bg-[#FFFFFF] rounded-2xl border border-[#ECE1CE] text-center text-xs text-[#544245]">
                    Seja o primeiro a enviar uma resenha para esta obra!
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#ECE1CE] shadow-xs flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#F2E7D4] flex items-center justify-center font-serif text-[#4E0820] text-xs font-bold">
                            {r.reviewerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-[#4E0820]">
                              {r.reviewerName}
                            </h4>
                            <span className="text-[10px] text-[#867275]">
                              {r.reviewerRole} • {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-amber-700">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating ? 'fill-amber-700' : 'text-[#ECE1CE]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-serif font-bold text-sm text-[#4E0820] mt-0.5">
                          {r.title}
                        </h5>
                        <p className="text-xs text-[#544245] mt-1.5 leading-relaxed">
                          {r.content}
                        </p>
                      </div>

                      {r.readingMinutes && (
                        <div className="pt-2 border-t border-[#ECE1CE]/60 flex items-center gap-1 text-[10px] text-[#867275]">
                          <Clock className="w-3 h-3" />
                          <span>{r.readingMinutes} min de leitura de ensaio</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Recommendations */}
            {relatedBooks.length > 0 && (
              <div className="flex flex-col gap-4 pt-6 border-t border-[#ECE1CE]">
                <h3 className="font-serif text-xl font-bold text-[#4E0820]">
                  Obras de Atmosfera Conexa
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedBooks.map((relBook) => (
                    <BookCard key={relBook.id} book={relBook} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

    </div>
  );
}
