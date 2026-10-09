'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  BookOpen,
  Headphones,
  Star,
  Bookmark,
  Sparkles,
  Heart,
  Coffee,
  Hourglass,
  Wand2,
  Mountain,
  Mail,
  Check,
  Disc3,
  ExternalLink,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { CURATED_BOOKS, GENRE_CATEGORIES } from '@/lib/curated-books';
import { SOUNDSCAPES } from '@/lib/soundscapes';
import { useFolio } from '@/lib/folio-context';
import BookCard from '@/components/BookCard';

export default function HomePage() {
  const router = useRouter();
  const { playSoundscape } = useFolio();
  const [heroSearch, setHeroSearch] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Read by Mood state
  const [activeMood, setActiveMood] = useState<'romance' | 'misterio' | 'conforto' | 'nostalgia' | 'fantasia' | 'superacao'>('romance');

  const moodDatabase = {
    romance: {
      tag: 'Intimidade & Devoção',
      heading: 'Desejos ardentes, ternura e conexões profundas.',
      text: 'Seja em salões de chá do século XIX ou nos metrôs de cidades modernas, estas páginas capturam a fragilidade elétrica e transformadora do amor.',
      shelfUrl: '/explore-books?genre=Romance',
      book1: {
        id: 'pessoas-normais',
        title: 'Pessoas Normais',
        author: 'Sally Rooney',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVb3OULGiVH-AWsgfYCeYDA6t8i8cEpNLPr3g-iOf8JYv2tc6s1-QPHqvKmWwx-9OuYrHZAAGny1L5529fcrHNcpQ2rnhAgymQjowW_eGiBoWswmnPSG8ZrGmiA6qThPDbQqkjIPRSsy8oObejFIjUNdSra1Iwzs-pj6EkWdPFfpB-sXdwGy3tpcC-E2PJcXGB9n1RmoUhd6EIvbGDwDrUm6XFO8zo32Tfv6A25z5kgTm21z4abWEt1A',
        tag: '4.6★ • Conexão Complexa'
      },
      book2: {
        id: 'orgulho-e-preconceito',
        title: 'Orgulho e Preconceito',
        author: 'Jane Austen',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7lIHRDgbwdUKe8P6ibgKTYyOFEGCq_yS4dXlB8K7HBmcwTtiVgZtN2TnXDQ3O-ArEXhDdbDqX8BO59P3_BFHPSxEkPsHJYk__TPRqdJqSSlvnCApDCrueKydijQAfIet17oiT2thIAy7FoBI_oO7YrUai7vtQQRer1S9_yRjeov-E-fCg2lhkpjnhILOfG3Bq4FQD5mea1uPFGe4EHJRZ8zEJheV0NnRWA0-46ks-JZPkTa1cFyCMSw',
        tag: '4.9★ • Ironia Atemporal'
      }
    },
    misterio: {
      tag: 'Intriga & Enigma',
      heading: 'Sombras noturnas, portas trancadas e sussurros no sótão.',
      text: 'Quebra-cabeças tecidos em névoa e pistas sutis. Histórias que exigem sua vigília absoluta até a última vela apagar.',
      shelfUrl: '/explore-books?genre=Mistério',
      book1: {
        id: 'sombra-do-vento',
        title: 'A Sombra do Vento',
        author: 'Carlos Ruiz Zafón',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkAilvbpT3SMsJQa2NKJpe3QLGNbxQOGroSfvKvb9QtN0jH7AzDg5hf9Oce1kiM6Xmhx2CF1mHMamWk77lflYlw3oMxa7OVTh-FLqcShR7foHfZYky7L4376U3qyPA-zDhWnErGQXHkaCjBLywqhmuLq9WWq8jwo-Wxtn63yvsvXG06zAEKCC7litMpyt49SHRsz5IIwSUkxIlmzMqaWhAFr1hV05g37WU06WscJMiM-HVA4nxM9oOuw',
        tag: '4.9★ • Mistério Gótico'
      },
      book2: {
        id: 'a-historia-secreta',
        title: 'A História Secreta',
        author: 'Donna Tartt',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj6CVIkioejCZuwIKiSCraWnVfbNFY758_aPcVvp9nwcmLLWwDUgGosIFMcHBhErsi1LzVMysPpmsniTZkj8EYw6xRpU6jU4ZQ0V8S9yedxLlJupz8qqLkY8nolKmyuD9FMjC4rOKtbvwdyiHaj0zYHA5GtsFHsOo9s1X2doTL-tTtut0ZAMsO1MJzF3dt9c3SWH3hrwII75wj4U9q9bsUPvfYH84X3amvavDK7iHT1CcrYrbm5u2Hg',
        tag: '4.8★ • Dark Academia'
      }
    },
    conforto: {
      tag: 'Santuário & Aconchego',
      heading: 'Uma xícara de chá quente para a alma cansada.',
      text: 'Calor sereno, vilarejos acolhedores, amizades despretensiosas e humor delicado para abrandar uma mente sobrecarregada.',
      shelfUrl: '/explore-books?atmosphere=Aconchegante',
      book1: {
        id: 'um-cavalheiro-em-moscou',
        title: 'Um Cavalheiro em Moscou',
        author: 'Amor Towles',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSYXLkIxFYXCnqIiuLjPn5cyff6N2BsWW9YNYrSS7fzAs93CMO_ZUueA3CLYCNKIjwR6l2s_5m0W_x2gFAEarexni_CPZjvV_AkTE6_ZhEnbtuG6tpqXPQMkaOv-uxZJESvi2acNBAIRZIOZFWcy5ft21MPIn_zAVQ6pFT-FJPqrptNdtqD6PBRuelM0XcTaEAwOoFxKymsBpPnLFyX-W-akWpOFtjs-voSAPx_2HSUWrq5oIUzFvb7A',
        tag: '4.9★ • Puro Conforto'
      },
      book2: {
        id: 'se-um-viajante-numa-noite-de-inverno',
        title: 'Se um viajante numa noite de inverno',
        author: 'Italo Calvino',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1V7CgCBYP_bfgZ-ZzbIcJa9DmclvMkclxd_jqo0u4_yugZsPZqJ4PZHv5X3SbeeusMfhUPhLlVU7brNMToCXbrV2eIqTtJlmKx1TBaErlJgh_E0u-QamiDgRwMx6650XeHcUkGDN5nX8d2CD3xlZKdDOxW5DhH81bYW7t-hzTcZZBoXnHTfKtgaZbmE6LIkZLSSx846wQGL9KZ-ePeMMcG-mt2c1lBI3Gig2I_xWfMsn9F8bBzFmlYw',
        tag: '4.8★ • Sala de Leitura'
      }
    },
    nostalgia: {
      tag: 'Tons Dourados & Melancolia',
      heading: 'Ecos de estações passadas e verões perdidos.',
      text: 'Reflexões poéticas, juventude agridoce e a lembrança silenciosa de instantes que se dissolveram no tempo.',
      shelfUrl: '/explore-books?atmosphere=Melancólico',
      book1: {
        id: 'o-livro-do-desassossego',
        title: 'O Livro do Desassossego',
        author: 'Fernando Pessoa',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7DzfcECpWpAgmqs34n_a_c65yS7GggOP5gKxLP7imRNLbQA6__8q8CzvmYleFkTSiKb5vi6Y5Rp-8pF_ksnNUmKwroXLZ98KFAcezijLBEMZyOsDiE4qJWpZXZvkDkSB0eqfi_Sx-NwYlFbA8RsBZ-xxV0dKpWMgwkpb1GZjNUSLQVV5eEDv5_uWoCcRvlir42bKTkLzOlZgA4RxBgJXyfkJFEsgvm7TlY9noDMhaqYa7gdsB2doOwQ',
        tag: '4.7★ • Lisboa Chuvosa'
      },
      book2: {
        id: 'amanha-amanha-e-mais-um-amanha',
        title: 'Amanhã, Amanhã, e Mais um Amanhã',
        author: 'Gabrielle Zevin',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2tZuwIOconD8UcmqcYiFLnTqbspuJLz3jMe6173pJ64SWiy3ICgO0CQfxWK0e85HOJAkzjas2eXKpRRAgiZWtDh_tzoP6zf7g6NZVIC_K4higYUhrECz-7_v8-FDnZ4zseDzS8jMZIK7ij9kKIq1CWP3LPZbUoBtY3LiCMl5Ru2pLiai2cXZS8uyGKVAD-5XeFO7pmwJflwSU54RBaHlQPhLErgtBISO5uxrI1WO7OhaeYmI387SRGA',
        tag: '4.7★ • Amizade & Anos 90'
      }
    },
    fantasia: {
      tag: 'Deslumbramento Sobrenatural',
      heading: 'Reinos desatados das limitações terrenas.',
      text: 'Magia ancestral, marés sob salões de mármore, deuses vingativos e construções de mundo de deslumbrante densidade.',
      shelfUrl: '/explore-books?genre=Fantasia',
      book1: {
        id: 'piranesi',
        title: 'Piranesi',
        author: 'Susanna Clarke',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT14HaBgzcsUa7sLyr2InRm8Geqs_IH55fPA7IbNwCIpX-k4PE0xNCKVqaouLxNOmx2ab3wu85dt0UDnHBlr4c-bT1l_yyAbp1_Ut3oL4m3f1Yb1PC8D1lPpWGsBLvDCpqeyAYJ6Q8lGa1OnQ60fS7QRopWvorjz6FpNEyxvRMrDzZJFxZXDfr7nSkzovvl7xqykNXyPFszD-vCodYyPrMbUrtZDPrP1GURZFfJBpSXRcmdG8MemS9JQ',
        tag: '4.8★ • Marés & Estátuas'
      },
      book2: {
        id: 'circe',
        title: 'Circe',
        author: 'Madeline Miller',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5FMFTBNnhIba6JOSVbWGLGnr6YQfzW_JLU4ysJMh30VHrGQ6paEQB0Chx_9zl2-nPf_9qtZu4QBdVgcmJS3G6bMo1dz2Gxg6UV29H65yFBPQpkrghfH0FYUBZ9yhuPwfpXs-64ar6Qnr6h7b5cvBkCP3vLXPJjfVaRqYJcnsou0Rf2jPjtvVSeisxDhKCtXytgkfyx34g18zAvkVCKtAyqaBV0AGZsljV4kDzPQb5o8lhyxAXHxKPA',
        tag: '4.9★ • Fogo & Mito Antigo'
      }
    },
    superacao: {
      tag: 'Resiliência & Triunfo',
      heading: 'A luz indomável da coragem humana.',
      text: 'Atravessando invernos rigorosos, regimes opressores e provas espirituais com serenidade e dignidade inquebrantável.',
      shelfUrl: '/explore-books?atmosphere=Filosófico',
      book1: {
        id: 'klara-e-o-sol',
        title: 'Klara e o Sol',
        author: 'Kazuo Ishiguro',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0N-Bc37GEJ5Tu-gN5EuKnN4-aKPH9y9m-JdPkrUuu67uLvfZBkTUEpLsGqySh7hEyTxZ5hsxKsH4ntf0A416PoIwE01GwUs1rLmlAwEWVzBjIH9RgPRIRm_C4m6OzUdUXNKwYWIyy_MbGenJej8-ToDQZJQRbTUEuP3JI_LpmXX1-dHsSlJVdjgGry5yUAcjKj8_81NAwsRVaaR8AoOsDya_NRIQKnCoCm39O5DzcXy7gIBCRRm3_QA',
        tag: '4.6★ • Empatia Pura'
      },
      book2: {
        id: 'as-cidades-invisiveis',
        title: 'As Cidades Invisíveis',
        author: 'Italo Calvino',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaIoTmZeMKfqLGUtQ3n4PdommrogjJ0sdyL7g5mgfRbU9RFmuqklG-Ye9iFLH9pgH1Dmy3lhqIH970fdz-cSmDr3m3qzovP8JM0zO7SntChxspoBXjbDcarQszS-bxAmP50WRgnBuzsDNOtatvo8CvOiJkxxdxJS7QwDwJw60SEjkYghuVXmFbkghW-zHWL_ZGTDmq1dUVil_3OAP1LH3VVVyGiK1h80AzF_ONy-Pbp3izClhwlsg4fg',
        tag: '4.9★ • Alegoria Cósmica'
      }
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/explore-books?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/explore-books');
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    }
  };

  // Four featured books representing each primary genre (Romance, Fantasia, Suspense, Dark Romance)
  const featuredBooks = [
    CURATED_BOOKS.find(b => b.genre === 'Romance') || CURATED_BOOKS[0],
    CURATED_BOOKS.find(b => b.genre === 'Fantasia') || CURATED_BOOKS[1],
    CURATED_BOOKS.find(b => b.genre === 'Suspense') || CURATED_BOOKS[2],
    CURATED_BOOKS.find(b => b.genre === 'Dark Romance') || CURATED_BOOKS[3],
  ];

  return (
    <div className="flex flex-col w-full">
      
      {/* =========================================================================
          HERO SECTION (Matching Image 3 & Stitch layout)
         ========================================================================= */}
      <section className="relative w-full pt-10 pb-16 px-5 md:px-12 max-w-[1360px] mx-auto overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[680px] h-[360px] bg-[#FFD9DF]/30 rounded-full blur-[110px] pointer-events-none -z-10"></div>
        <div className="absolute -left-20 top-40 w-72 h-72 bg-[#F3E8D5]/60 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Left Column: Manifesto & Prompt Engine (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5 z-10">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F2E7D4] text-[#6B2035] px-3.5 py-1 rounded-full w-fit shadow-xs">
              <BookOpen className="w-4 h-4 text-[#6B2035]" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Santuário Literário Curado
              </span>
              <span className="text-[#867275]">•</span>
              <span className="text-[11px] text-[#544245]">Edição Arquivística No. 42</span>
            </div>

            {/* Headline & Subhead */}
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4E0820] font-bold tracking-tight leading-[1.1]">
                Every page, a new universe.
              </h1>
              <p className="text-base sm:text-lg text-[#544245] max-w-xl leading-relaxed font-sans">
                Descubra seu próximo livro favorito, explore resenhas honestas e encontre a trilha sonora perfeita para cada história. Um arquivo público e contemplativo celebrando a palavra impressa e o som atmosférico.
              </p>
            </div>

            {/* Central Search System */}
            <form onSubmit={handleHeroSearch} className="flex flex-col gap-2.5 mt-1">
              <div className="relative flex items-center bg-[#FFFFFF] rounded-xl shadow-md p-1.5 border border-[#ECE1CE] focus-within:border-[#6B2035] focus-within:shadow-xl transition-all duration-300">
                <Search className="w-5 h-5 text-[#894C5A] ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Pesquise por título de livro, autor ou gênero..."
                  className="w-full bg-transparent px-3 py-2.5 text-[#201B10] placeholder:text-[#867275] text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shrink-0 shadow-xs"
                >
                  <span>Explorar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Filter Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-[#544245] font-semibold text-[11px] mr-1">Atmosfera & Aura:</span>
                {[
                  { label: 'Dark Academia', q: 'Dark Academia' },
                  { label: 'Realismo Mágico', q: 'Realismo Mágico' },
                  { label: 'Romance Gótico', q: 'Romance Gótico' },
                  { label: 'Space Opera', q: 'Ficção Científica' },
                  { label: 'Thriller Psicológico', q: 'Mistério' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setHeroSearch(tag.q);
                      router.push(`/explore-books?q=${encodeURIComponent(tag.q)}`);
                    }}
                    className="bg-[#F8EDD9] hover:bg-[#F2E7D4] text-[#6B2035] font-semibold text-[11px] px-3 py-1 rounded-full transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </form>

            {/* Action CTA Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/explore-books"
                className="bg-[#4E0820] hover:bg-[#6B2035] text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Livros</span>
              </Link>
              <Link
                href="#stories-in-sound"
                className="bg-[#F8EDD9] hover:bg-[#F2E7D4] text-[#4E0820] text-sm font-semibold px-6 py-3 rounded-lg shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-[#ECE1CE]"
              >
                <Headphones className="w-4 h-4 text-[#6B2035]" />
                <span>Ouvir Playlists Literárias</span>
              </Link>
            </div>

            {/* Micro Metric Proof */}
            <div className="flex items-center gap-6 pt-4 text-[#544245]">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-[#4E0820]">12.800+</span>
                <span className="text-[11px] leading-tight text-[#867275]">Volumes<br />Arquivados</span>
              </div>
              <div className="h-8 w-px bg-[#ECE1CE]"></div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-[#4E0820]">340+</span>
                <span className="text-[11px] leading-tight text-[#867275]">Paisagens Sonoras<br />Originais</span>
              </div>
              <div className="h-8 w-px bg-[#ECE1CE]"></div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-[#4E0820]">100%</span>
                <span className="text-[11px] leading-tight text-[#867275]">Santuário Aberto<br />Zero Login</span>
              </div>
            </div>
          </div>

          {/* Right Column: Asymmetrical Floating Book Art Triptych (5 Cols) */}
          <div className="lg:col-span-5 relative h-[500px] w-full flex items-center justify-center">
            
            {/* Book Card 1: Rear Tilt Left (Susanna Clarke - Piranesi) */}
            <div 
              onClick={() => router.push('/book/piranesi')}
              className="absolute -left-2 top-8 w-48 bg-[#FFFFFF] rounded-xl shadow-lg p-2.5 -rotate-6 hover:rotate-0 transition-all duration-500 z-10 cursor-pointer border border-[#ECE1CE]"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-[#F8EDD9]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT14HaBgzcsUa7sLyr2InRm8Geqs_IH55fPA7IbNwCIpX-k4PE0xNCKVqaouLxNOmx2ab3wu85dt0UDnHBlr4c-bT1l_yyAbp1_Ut3oL4m3f1Yb1PC8D1lPpWGsBLvDCpqeyAYJ6Q8lGa1OnQ60fS7QRopWvorjz6FpNEyxvRMrDzZJFxZXDfr7nSkzovvl7xqykNXyPFszD-vCodYyPrMbUrtZDPrP1GURZFfJBpSXRcmdG8MemS9JQ"
                  alt="Piranesi"
                  fill
                  sizes="192px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-[#4E0820]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.8
                </div>
              </div>
              <div className="pt-2 px-1">
                <h4 className="font-serif text-sm font-bold text-[#4E0820] truncate">Piranesi</h4>
                <p className="text-xs text-[#894C5A] truncate">Susanna Clarke</p>
              </div>
            </div>

            {/* Book Card 2: Center Featured Elevated (The Shadow of the Wind) */}
            <div 
              onClick={() => router.push('/book/sombra-do-vento')}
              className="absolute w-56 bg-[#FFFFFF] rounded-xl shadow-2xl p-3 z-20 cursor-pointer hover:scale-105 transition-all duration-500 border border-[#ECE1CE]"
              style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-[#F2E7D4]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkAilvbpT3SMsJQa2NKJpe3QLGNbxQOGroSfvKvb9QtN0jH7AzDg5hf9Oce1kiM6Xmhx2CF1mHMamWk77lflYlw3oMxa7OVTh-FLqcShR7foHfZYky7L4376U3qyPA-zDhWnErGQXHkaCjBLywqhmuLq9WWq8jwo-Wxtn63yvsvXG06zAEKCC7litMpyt49SHRsz5IIwSUkxIlmzMqaWhAFr1hV05g37WU06WscJMiM-HVA4nxM9oOuw"
                  alt="A Sombra do Vento"
                  fill
                  sizes="224px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-[#4E0820] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Volume do Mês
                </span>
              </div>
              <div className="pt-2.5 px-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#894C5A] uppercase">Mistério Gótico</span>
                  <span className="flex items-center text-amber-700 text-xs font-bold gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-700" /> 4.9
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#4E0820] truncate mt-0.5">A Sombra do Vento</h3>
                <p className="text-xs text-[#544245] truncate">Carlos Ruiz Zafón</p>
              </div>
            </div>

            {/* Book Card 3: Tilt Right Offset (Tomorrow, and Tomorrow, and Tomorrow) */}
            <div 
              onClick={() => router.push('/book/amanha-amanha-e-mais-um-amanha')}
              className="absolute -right-2 bottom-6 w-48 bg-[#FFFFFF] rounded-xl shadow-lg p-2.5 rotate-6 hover:rotate-0 transition-all duration-500 z-10 cursor-pointer border border-[#ECE1CE]"
            >
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-[#F8EDD9]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tZuwIOconD8UcmqcYiFLnTqbspuJLz3jMe6173pJ64SWiy3ICgO0CQfxWK0e85HOJAkzjas2eXKpRRAgiZWtDh_tzoP6zf7g6NZVIC_K4higYUhrECz-7_v8-FDnZ4zseDzS8jMZIK7ij9kKIq1CWP3LPZbUoBtY3LiCMl5Ru2pLiai2cXZS8uyGKVAD-5XeFO7pmwJflwSU54RBaHlQPhLErgtBISO5uxrI1WO7OhaeYmI387SRGA"
                  alt="Amanhã, Amanhã, e Mais um Amanhã"
                  fill
                  sizes="192px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-[#4E0820]/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.7
                </div>
              </div>
              <div className="pt-2 px-1">
                <h4 className="font-serif text-sm font-bold text-[#4E0820] truncate">Amanhã, Amanhã...</h4>
                <p className="text-xs text-[#894C5A] truncate">Gabrielle Zevin</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: LIVROS EM DESTAQUE (The Editor's Lectern)
         ========================================================================= */}
      <section className="w-full py-16 bg-[#F8EDD9]/40 border-y border-[#ECE1CE] px-5 md:px-12">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#894C5A] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>O Atril do Editor</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#4E0820]">Livros em Destaque</h2>
              <p className="text-sm text-[#544245] max-w-lg">
                Obras fundamentais selecionadas à mão, iluminadas por ensaios aprofundados e harmonizações sonoras.
              </p>
            </div>
            
            <Link
              href="/explore-books"
              className="text-[#6B2035] hover:text-[#481725] text-sm font-bold flex items-center gap-1 group"
            >
              <span>Ver Todo o Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-Column Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FAVORITOS DOS LEITORES (Readers' Favorites)
         ========================================================================= */}
      <section className="w-full py-16 px-5 md:px-12 max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#894C5A] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-[#6B2035]" />
              <span>Constelações dos Leitores</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#4E0820]">Favoritos da Comunidade</h2>
            <p className="text-sm text-[#544245] max-w-xl">
              Livros com a mais alta ressonância coletiva, profundidade sentimental duradoura e múltiplas releituras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Favorite Item 1: Circe */}
            <div 
              onClick={() => router.push('/book/circe')}
              className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all border border-[#ECE1CE] flex flex-col justify-between cursor-pointer"
              style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
            >
              <div className="flex gap-4">
                <div className="w-24 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#ECE1CE] shadow-xs relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq5FMFTBNnhIba6JOSVbWGLGnr6YQfzW_JLU4ysJMh30VHrGQ6paEQB0Chx_9zl2-nPf_9qtZu4QBdVgcmJS3G6bMo1dz2Gxg6UV29H65yFBPQpkrghfH0FYUBZ9yhuPwfpXs-64ar6Qnr6h7b5cvBkCP3vLXPJjfVaRqYJcnsou0Rf2jPjtvVSeisxDhKCtXytgkfyx34g18zAvkVCKtAyqaBV0AGZsljV4kDzPQb5o8lhyxAXHxKPA"
                    alt="Circe"
                    fill
                    sizes="96px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="bg-[#F2E7D4] text-[#6B2035] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      98% de Adoração
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#4E0820] mt-1 truncate">Circe</h3>
                    <p className="text-xs text-[#894C5A]">Madeline Miller</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                    <span className="font-bold text-[#201B10]">4.9</span>
                    <span className="text-[#867275]">• 4.120 leitores</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#544245] italic mt-3 line-clamp-2 leading-relaxed">
                “Uma releitura lírica e feminista do mito clássico que ressoa como água do mar e aroma de cedro queimado.”
              </p>
              <div className="mt-3 pt-2 border-t border-[#ECE1CE] flex items-center justify-between text-[11px] text-[#867275]">
                <span>393 pp • Retelling Mítico</span>
                <span className="text-[#6B2035] font-semibold">Cura Ressaca</span>
              </div>
            </div>

            {/* Favorite Item 2: The Secret History */}
            <div 
              onClick={() => router.push('/book/a-historia-secreta')}
              className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all border border-[#ECE1CE] flex flex-col justify-between cursor-pointer"
              style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
            >
              <div className="flex gap-4">
                <div className="w-24 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#ECE1CE] shadow-xs relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTj6CVIkioejCZuwIKiSCraWnVfbNFY758_aPcVvp9nwcmLLWwDUgGosIFMcHBhErsi1LzVMysPpmsniTZkj8EYw6xRpU6jU4ZQ0V8S9yedxLlJupz8qqLkY8nolKmyuD9FMjC4rOKtbvwdyiHaj0zYHA5GtsFHsOo9s1X2doTL-tTtut0ZAMsO1MJzF3dt9c3SWH3hrwII75wj4U9q9bsUPvfYH84X3amvavDK7iHT1CcrYrbm5u2Hg"
                    alt="A História Secreta"
                    fill
                    sizes="96px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="bg-[#F2E7D4] text-[#6B2035] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      Clássico Cult
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#4E0820] mt-1 truncate">A História Secreta</h3>
                    <p className="text-xs text-[#894C5A]">Donna Tartt</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                    <span className="font-bold text-[#201B10]">4.8</span>
                    <span className="text-[#867275]">• 8.940 leitores</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#544245] italic mt-3 line-clamp-2 leading-relaxed">
                “O marco definitivo do Dark Academia: intelecto obsessivo, podridão moral e a beleza fatal da tragédia grega.”
              </p>
              <div className="mt-3 pt-2 border-t border-[#ECE1CE] flex items-center justify-between text-[11px] text-[#867275]">
                <span>559 pp • Dark Academia</span>
                <span className="text-[#6B2035] font-semibold">Leitura de Outono</span>
              </div>
            </div>

            {/* Favorite Item 3: A Gentleman in Moscow */}
            <div 
              onClick={() => router.push('/book/um-cavalheiro-em-moscou')}
              className="bg-[#FFFFFF] rounded-xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all border border-[#ECE1CE] flex flex-col justify-between cursor-pointer"
              style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
            >
              <div className="flex gap-4">
                <div className="w-24 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#ECE1CE] shadow-xs relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSYXLkIxFYXCnqIiuLjPn5cyff6N2BsWW9YNYrSS7fzAs93CMO_ZUueA3CLYCNKIjwR6l2s_5m0W_x2gFAEarexni_CPZjvV_AkTE6_ZhEnbtuG6tpqXPQMkaOv-uxZJESvi2acNBAIRZIOZFWcy5ft21MPIn_zAVQ6pFT-FJPqrptNdtqD6PBRuelM0XcTaEAwOoFxKymsBpPnLFyX-W-akWpOFtjs-voSAPx_2HSUWrq5oIUzFvb7A"
                    alt="Um Cavalheiro em Moscou"
                    fill
                    sizes="96px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="bg-[#F2E7D4] text-[#6B2035] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                      Conforto & Graça
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#4E0820] mt-1 truncate">Um Cavalheiro em Moscou</h3>
                    <p className="text-xs text-[#894C5A]">Amor Towles</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                    <span className="font-bold text-[#201B10]">4.9</span>
                    <span className="text-[#867275]">• 6.150 leitores</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#544245] italic mt-3 line-clamp-2 leading-relaxed">
                “Um retrato caloroso, refinado e profundamente humano sobre encontrar universos inteiros no confinamento de um hotel.”
              </p>
              <div className="mt-3 pt-2 border-t border-[#ECE1CE] flex items-center justify-between text-[11px] text-[#867275]">
                <span>462 pp • Solidão Histórica</span>
                <span className="text-[#6B2035] font-semibold">Puro Conforto</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CLASSIFICAÇÕES BIBLIÓFILAS (Find Your Next Read)
         ========================================================================= */}
      <section className="w-full py-16 bg-[#F8EDD9]/40 border-y border-[#ECE1CE] px-5 md:px-12">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#894C5A] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#6B2035]" />
                <span>Classificações Bibliófilas</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#4E0820]">Encontre Sua Próxima Leitura</h2>
              <p className="text-sm text-[#544245] max-w-lg">
                Percorra territórios literários curados, encadernados em pergaminho, curiosidade e esmero estético.
              </p>
            </div>
            <span className="text-xs text-[#867275] font-semibold">6 Arquivos Temáticos Abrangentes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENRE_CATEGORIES.map((genre) => (
              <Link
                key={genre.name}
                href={`/explore-books?genre=${encodeURIComponent(genre.slug)}`}
                className="bg-[#FFFFFF] p-6 rounded-xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all border border-[#ECE1CE] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#F8EDD9] flex items-center justify-center text-[#6B2035] group-hover:bg-[#4E0820] group-hover:text-white transition-colors">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-[#867275] font-medium">{genre.count}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4E0820] group-hover:text-[#6B2035] transition-colors mt-4">
                    {genre.name}
                  </h3>
                  <p className="text-xs text-[#544245] mt-1.5 leading-relaxed">
                    {genre.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#ECE1CE] flex items-center gap-1 text-[#6B2035] text-xs font-bold">
                  <span>Explorar Coleção</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ÚLTIMAS RESENHAS (Latest Reviews / Critical Appraisals)
         ========================================================================= */}
      <section className="w-full py-16 px-5 md:px-12 max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#894C5A] text-xs font-bold uppercase tracking-wider">
                <Star className="w-4 h-4 text-[#C5A059]" />
                <span>Avaliações Críticas Comunitárias</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#4E0820]">Últimas Resenhas</h2>
              <p className="text-sm text-[#544245] max-w-lg">
                Avaliações honestas, literárias e sinceras escritas com profundidade, sem algoritmos opacos.
              </p>
            </div>
            
            <Link
              href="/reviews"
              className="text-[#6B2035] hover:text-[#481725] text-sm font-bold flex items-center gap-1 group"
            >
              <span>Ver Todos os Ensaios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Review Card 1 */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 shadow-sm border border-[#ECE1CE] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2E7D4] flex items-center justify-center font-serif text-[#4E0820] font-bold">
                      EL
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#4E0820]">Elena Laurent</h4>
                      <p className="text-[11px] text-[#867275]">Colaboradora do Salão • há 2 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-700">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-700" />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] uppercase font-bold text-[#894C5A] tracking-wider">
                    Resenha para: A Sombra do Vento
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4E0820] italic mt-1 leading-snug">
                    “Uma obra-prima labiríntica com cheiro de papel velho, segredos e chuva parisiense.”
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544245] mt-2 leading-relaxed">
                    Zafón constrói uma carta de amor inesquecível aos livros físicos e à tragédia do esquecimento. Barcelona não é meramente um cenário aqui, mas um espectro vivo onde cada livraria de esquina guarda um segredo devastador.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#ECE1CE] flex items-center justify-between">
                <span className="text-xs text-[#867275]">6 min de leitura de ensaio</span>
                <Link
                  href="/book/sombra-do-vento"
                  className="px-3.5 py-1.5 rounded-lg bg-[#F8EDD9] text-[#6B2035] hover:bg-[#F2E7D4] text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Ler no Livro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-[#FFFFFF] rounded-2xl p-6 shadow-sm border border-[#ECE1CE] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2E7D4] flex items-center justify-center font-serif text-[#4E0820] font-bold">
                      MS
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#4E0820]">Marcus Sterling</h4>
                      <p className="text-[11px] text-[#867275]">Bibliógrafo Sênior • há 5 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-700">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-700" />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] uppercase font-bold text-[#894C5A] tracking-wider">
                    Resenha para: Piranesi
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#4E0820] italic mt-1 leading-snug">
                    “A solidão tornada sagrada; Susanna Clarke construiu um antídoto para o cinismo.”
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544245] mt-2 leading-relaxed">
                    A devoção incondicional de Piranesi à Casa nos lembra de como a reverência transforma o isolamento em santuário divino. O leitor sai dessa obra com a sensação física de ter sido banhado pelas marés sagradas.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#ECE1CE] flex items-center justify-between">
                <span className="text-xs text-[#867275]">4 min de leitura de ensaio</span>
                <Link
                  href="/book/piranesi"
                  className="px-3.5 py-1.5 rounded-lg bg-[#F8EDD9] text-[#6B2035] hover:bg-[#F2E7D4] text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Ler no Livro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: STORIES IN SOUND (Companion Auditory Rooms)
         ========================================================================= */}
      <section className="w-full py-16 bg-[#4E0820] text-[#FFF8F1] px-5 md:px-12" id="stories-in-sound">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#FFB1C0] text-xs font-bold uppercase tracking-wider">
                <Disc3 className="w-4 h-4 text-[#FFD9DF]" />
                <span>Sinergia Áudio-Textual</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">Stories in Sound</h2>
              <p className="text-sm text-[#D9C1C4] max-w-xl">
                Paisagens sonoras imersivas e composições neoclássicas mapeadas para as atmosferas das páginas.
              </p>
            </div>
            
            <Link
              href="/playlists"
              className="text-[#FFD9DF] hover:text-white text-sm font-bold flex items-center gap-1.5 group"
            >
              <span>Explorar Todas as Trilhas</span>
              <Headphones className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOUNDSCAPES.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-[#6B2035]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-[#894C5A] flex flex-col justify-between hover:bg-[#6B2035] transition-all group"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#353023]">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#4E0820]/30"></div>
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#FFD9DF] flex items-center gap-1">
                      <Disc3 className="w-3 h-3 text-[#FFB1C0]" /> {item.duration}
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-[11px] uppercase font-bold text-[#FFD9DF] tracking-wider">
                      {item.genre}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mt-0.5">{item.title}</h3>
                    <p className="text-xs text-[#D9C1C4] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[11px] text-[#FFB1C0] mt-2 block font-medium">
                      Harmonização: {item.bookCompanion}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#894C5A] flex items-center justify-between">
                  <button
                    onClick={() => playSoundscape(item)}
                    className="bg-[#FFF8F1] hover:bg-[#F3E8D5] text-[#4E0820] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
                  >
                    <Volume2 className="w-4 h-4 text-[#4E0820]" />
                    <span>Ouvir Ambiente</span>
                  </button>

                  <a
                    href={item.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFD9DF] hover:text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LEIA PELO HUMOR (Read by Mood Interactive)
         ========================================================================= */}
      <section className="w-full py-16 px-5 md:px-12 max-w-[1360px] mx-auto">
        <div className="flex flex-col gap-8">
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#894C5A] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Alinhamento Emocional</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#4E0820]">Leia pelo Seu Humor</h2>
            <p className="text-sm text-[#544245] max-w-xl">
              Escolha como deseja se sentir esta noite. Obras literárias agrupadas com base em sua ressonância interna.
            </p>
          </div>

          {/* Mood Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'romance', label: 'Romance', icon: Heart },
              { id: 'misterio', label: 'Mistério', icon: Search },
              { id: 'conforto', label: 'Conforto (Cozy)', icon: Coffee },
              { id: 'nostalgia', label: 'Nostalgia', icon: Hourglass },
              { id: 'fantasia', label: 'Fantasia', icon: Wand2 },
              { id: 'superacao', label: 'Superação', icon: Mountain },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeMood === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMood(tab.id as any)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-xs ${
                    isSelected
                      ? 'bg-[#4E0820] text-white shadow-md'
                      : 'bg-[#F8EDD9] text-[#544245] hover:bg-[#F2E7D4] hover:text-[#201B10]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Mood Card Panel */}
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#ECE1CE] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="bg-[#F2E7D4] text-[#6B2035] text-xs font-bold px-3 py-1 rounded-full w-fit">
                  {moodDatabase[activeMood].tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#4E0820]">
                  {moodDatabase[activeMood].heading}
                </h3>
                <p className="text-sm text-[#544245] leading-relaxed">
                  {moodDatabase[activeMood].text}
                </p>
                <div className="pt-2">
                  <Link
                    href={moodDatabase[activeMood].shelfUrl}
                    className="bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Explorar Estante Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Book 1 */}
                <div 
                  onClick={() => router.push(`/book/${moodDatabase[activeMood].book1.id}`)}
                  className="flex gap-3 bg-[#FBF7F0] p-3 rounded-xl border border-[#ECE1CE] shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="w-20 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#ECE1CE] relative shadow-2xs">
                    <Image
                      src={moodDatabase[activeMood].book1.coverUrl}
                      alt={moodDatabase[activeMood].book1.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#4E0820] truncate">
                        {moodDatabase[activeMood].book1.title}
                      </h4>
                      <p className="text-xs text-[#894C5A] truncate">{moodDatabase[activeMood].book1.author}</p>
                    </div>
                    <span className="text-[11px] text-[#867275] font-semibold">{moodDatabase[activeMood].book1.tag}</span>
                  </div>
                </div>

                {/* Book 2 */}
                <div 
                  onClick={() => router.push(`/book/${moodDatabase[activeMood].book2.id}`)}
                  className="flex gap-3 bg-[#FBF7F0] p-3 rounded-xl border border-[#ECE1CE] shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="w-20 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#ECE1CE] relative shadow-2xs">
                    <Image
                      src={moodDatabase[activeMood].book2.coverUrl}
                      alt={moodDatabase[activeMood].book2.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#4E0820] truncate">
                        {moodDatabase[activeMood].book2.title}
                      </h4>
                      <p className="text-xs text-[#894C5A] truncate">{moodDatabase[activeMood].book2.author}</p>
                    </div>
                    <span className="text-[11px] text-[#867275] font-semibold">{moodDatabase[activeMood].book2.tag}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DESPACHO SEMANAL DE PÁGINAS (Newsletter)
         ========================================================================= */}
      <section className="w-full py-16 bg-[#F8EDD9] px-5 md:px-12 max-w-[1360px] mx-auto rounded-3xl shadow-xs my-8 border border-[#ECE1CE]">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] flex items-center justify-center text-[#6B2035] shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-3xl font-bold text-[#4E0820]">O Despacho Semanal de Páginas</h2>
            <p className="text-sm text-[#544245] leading-relaxed">
              Uma carta lenta entregue a cada domingo pela manhã: um clássico esquecido, uma recomendação de áudio ambiente e um ensaio sobre o fascínio dos mundos impressos. Zero spam, sempre.
            </p>
          </div>

          {newsletterSubmitted ? (
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#ECE1CE] text-[#4E0820] text-sm flex items-center gap-2 shadow-xs">
              <Check className="w-5 h-5 text-green-700" />
              <span>Bem-vindo(a) ao salão! Você receberá nosso próximo despacho no domingo.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Insira seu e-mail de leitura..."
                className="w-full bg-[#FFFFFF] text-[#201B10] placeholder:text-[#867275] px-4 py-3 rounded-lg shadow-xs text-sm border border-[#ECE1CE] focus:outline-none focus:border-[#6B2035]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#4E0820] hover:bg-[#6B2035] text-white text-sm font-bold px-6 py-3 rounded-lg shrink-0 transition-transform active:scale-95 shadow-md"
              >
                Assinar
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#867275]">
            Junte-se a mais de 28.400 leitores em 45 países. Cancele a inscrição a qualquer momento com um clique.
          </p>
        </div>
      </section>

    </div>
  );
}
