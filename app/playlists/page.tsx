'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Headphones,
  Disc3,
  Play,
  Pause,
  ExternalLink,
  Volume2,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SOUNDSCAPES } from '@/lib/soundscapes';
import { useFolio } from '@/lib/folio-context';

export default function PlaylistsPage() {
  const { activeSoundscape, isPlayingAudio, playSoundscape, togglePlayAudio, audioVolume, setAudioVolume } = useFolio();

  return (
    <div className="w-full pb-20">
      
      {/* Editorial Header */}
      <section className="bg-[#4E0820] text-white border-b border-[#6B2035] px-5 md:px-12 py-16">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#FFD9DF] tracking-widest">
              <Disc3 className="w-4 h-4 text-[#FFB1C0]" />
              <span>Stories in Sound • Arquitetura Sonora Literária</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Trilhas Sonoras & Paisagens Ambientes
            </h1>
            <p className="text-sm sm:text-base text-[#D9C1C4] leading-relaxed">
              Cada obra literária respira em uma tonalidade particular. Criamos e selecionamos ambientes de áudio analógico, chuva binaural, violoncelo neoclássico e cafés silenciosos para dissolver o mundo exterior durante a sua leitura.
            </p>
          </div>

          <div className="bg-[#6B2035] p-5 rounded-2xl border border-[#894C5A] shadow-md flex items-center gap-4 shrink-0 text-xs">
            <Headphones className="w-8 h-8 text-[#FFD9DF]" />
            <div>
              <span className="font-bold text-white block">Áudio Web em Tempo Real</span>
              <span className="text-[#D9C1C4] text-[11px]">Sintetizador ambiente sem downloads ou anúncios</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Soundscape Catalog */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOUNDSCAPES.map((item) => {
            const isThisPlaying = isPlayingAudio && activeSoundscape?.id === item.id;

            return (
              <div
                key={item.id}
                className={`bg-[#FFFFFF] rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                  isThisPlaying
                    ? 'border-[#6B2035] ring-2 ring-[#6B2035]/30'
                    : 'border-[#ECE1CE]'
                }`}
                style={{ boxShadow: 'inset 3px 0 0 0 #6B2035' }}
              >
                <div>
                  {/* Image with Duration Badge */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#353023] shadow-xs">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#FFD9DF] flex items-center gap-1">
                      <Disc3 className="w-3 h-3 text-[#FFB1C0]" /> {item.duration}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#894C5A] tracking-wider">
                        {item.genre}
                      </span>
                      {isThisPlaying && (
                        <span className="text-[10px] bg-[#6B2035] text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                          Tocando Agora
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-serif text-lg font-bold text-[#4E0820] mt-1">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-[#544245] mt-1.5 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-[#F8EDD9]/80 border border-[#ECE1CE] text-[11px]">
                      <span className="text-[#867275] block font-semibold">Harmonização Literária:</span>
                      <span className="font-serif font-bold text-[#4E0820]">{item.bookCompanion}</span>
                    </div>
                  </div>
                </div>

                {/* Audio Controls & Spotify link */}
                <div className="mt-5 pt-3 border-t border-[#ECE1CE] flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (isThisPlaying) {
                        togglePlayAudio();
                      } else {
                        playSoundscape(item);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                      isThisPlaying
                        ? 'bg-[#6B2035] text-white'
                        : 'bg-[#4E0820] hover:bg-[#6B2035] text-white'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                        <span>Ouvir Prévia</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#894C5A] hover:text-[#4E0820] transition-colors"
                  >
                    <span>Abrir no Spotify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy of Atmospheric Reading */}
      <section className="max-w-[1360px] mx-auto px-5 md:px-12 mt-8">
        <div className="bg-[#F8EDD9] p-8 md:p-10 rounded-3xl border border-[#ECE1CE] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs uppercase font-bold text-[#894C5A] tracking-wider">
              A Arte da Leitura Sonora
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4E0820]">
              Por que combinamos livros com paisagens sonoras?
            </h2>
            <p className="text-xs sm:text-sm text-[#544245] leading-relaxed">
              Ouvir música ambiente sem letra sincronizada com a leitura reduz o ruído da mente e ancora o ritmo da atenção. Nosso gerador de áudio cria uma barreira sonora orgânica de frequências acolhedoras para que cada página se expanda em um cosmos vívido.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-[#4E0820] hover:bg-[#6B2035] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Disc3 className="w-4 h-4" />
              <span>Acessar Canal Spotify Universe in Pages</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
