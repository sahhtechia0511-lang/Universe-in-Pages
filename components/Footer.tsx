'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#4E0820] text-[#FFF8F1] pt-14 pb-10 border-t border-[#6B2035]">
      <div className="max-w-[1360px] mx-auto px-5 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 flex flex-col gap-3 pr-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6B2035] flex items-center justify-center text-[#FFF8F1] shadow-xs">
                <BookOpen className="w-5 h-5 text-[#FFF8F1]" />
              </div>
              <span className="font-serif text-2xl text-[#FFF8F1] font-bold tracking-tight">
                Universe in Pages
              </span>
            </div>
            
            <p className="font-serif text-lg italic text-[#FFD9DF]">
              Every page, a new universe.
            </p>
            
            <p className="text-sm text-[#D9C1C4] max-w-md leading-relaxed font-sans">
              Um santuário literário público e imprensa digital contemplativa dedicada à leitura lenta,
              à imersão sonora e ao deslumbramento arquivístico através dos mundos impressos.
            </p>

            <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B2035]/60 text-[#FFD9DF] text-xs font-semibold w-fit">
              <Globe className="w-3.5 h-3.5 text-[#FFB1C0]" />
              <span>Folio Público • Sem necessidade de cadastro ou rastreamento</span>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-base text-[#FFF8F1] font-semibold tracking-wide">
              Explorar
            </span>
            <ul className="flex flex-col gap-2 text-sm text-[#D9C1C4]">
              <li>
                <Link href="/" className="hover:text-[#FFF8F1] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/explore-books" className="hover:text-[#FFF8F1] transition-colors">
                  Explorar Livros
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#FFF8F1] transition-colors">
                  Resenhas
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-[#FFF8F1] transition-colors">
                  Recomendações
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="hover:text-[#FFF8F1] transition-colors">
                  Trilhas Sonoras
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-base text-[#FFF8F1] font-semibold tracking-wide">
              Coleções Literárias
            </span>
            <ul className="flex flex-col gap-2 text-sm text-[#D9C1C4]">
              <li>
                <Link href="/explore-books?genre=Romance" className="hover:text-[#FFF8F1] transition-colors">
                  Romance & Afetos
                </Link>
              </li>
              <li>
                <Link href="/explore-books?genre=Mistério" className="hover:text-[#FFF8F1] transition-colors">
                  Thrillers & Mistério
                </Link>
              </li>
              <li>
                <Link href="/explore-books?genre=Ficção+Científica" className="hover:text-[#FFF8F1] transition-colors">
                  Sci-Fi & Fantasia
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-[#FFF8F1] transition-colors">
                  Curas para Ressaca Literária
                </Link>
              </li>
              <li>
                <Link href="/explore-books?sort=rating" className="hover:text-[#FFF8F1] transition-colors">
                  Clássicos Atemporais
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div className="flex flex-col gap-3">
            <span className="font-serif text-base text-[#FFF8F1] font-semibold tracking-wide">
              Sons & Santuários
            </span>
            <ul className="flex flex-col gap-2 text-sm text-[#D9C1C4]">
              <li>
                <Link href="/playlists" className="hover:text-[#FFF8F1] transition-colors">
                  Stories in Sound
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="hover:text-[#FFF8F1] transition-colors">
                  Salas de Leitura Ambientes
                </Link>
              </li>
              <li>
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFF8F1] transition-colors"
                >
                  Spotify Companion Playlists
                </a>
              </li>
              <li>
                <Link href="/explore-books" className="hover:text-[#FFF8F1] transition-colors">
                  Metadados Google Books
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#FFF8F1] transition-colors">
                  Diretrizes da Comunidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#6B2035] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#D9C1C4]">
          <p className="text-center md:text-left">
            Um santuário livre e público para leitores de todo o mundo. Nenhum cadastro ou rastreamento é necessário.
          </p>
          <p className="text-center md:text-right font-medium">
            © 2025 Universe in Pages. Archival Book Arts & Soundscapes.
          </p>
        </div>
      </div>
    </footer>
  );
}
