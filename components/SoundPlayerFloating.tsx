'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Disc3, ExternalLink, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useFolio } from '@/lib/folio-context';

export default function SoundPlayerFloating() {
  const { activeSoundscape, isPlayingAudio, togglePlayAudio, stopAudio, audioVolume, setAudioVolume } = useFolio();
  const [minimized, setMinimized] = useState(false);

  if (!activeSoundscape) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 transition-all duration-300 max-w-sm w-[calc(100vw-2rem)] ${
        isPlayingAudio ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-95'
      }`}
    >
      <div className="bg-[#481725] text-[#FFF8F1] rounded-2xl shadow-2xl border border-[#6B2035] overflow-hidden backdrop-blur-md">
        
        {/* Top Header Row */}
        <div className="px-4 py-2 bg-[#3A101C] flex items-center justify-between text-[11px] text-[#FFD9DF]">
          <div className="flex items-center gap-1.5 font-medium">
            <Disc3 className={`w-3.5 h-3.5 text-[#FFB1C0] ${isPlayingAudio ? 'animate-spin' : ''}`} />
            <span>Stories in Sound • Áudio Ambiente</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 hover:text-white"
              title={minimized ? 'Expandir' : 'Minimizar'}
            >
              {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={stopAudio}
              className="p-1 hover:text-white"
              title="Fechar player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Player Body */}
        {!minimized && (
          <div className="p-3.5 flex items-center gap-3">
            {/* Album artwork */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#201B10] shrink-0 shadow-xs border border-[#6B2035]">
              <Image
                src={activeSoundscape.imageUrl}
                alt={activeSoundscape.title}
                fill
                sizes="48px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-xs text-[#FFF8F1] truncate">
                {activeSoundscape.title}
              </h4>
              <p className="text-[10px] text-[#FFD9DF] truncate">
                {activeSoundscape.genre} • {activeSoundscape.duration}
              </p>
              <p className="text-[10px] text-[#D9C1C4] truncate italic mt-0.5">
                Para: {activeSoundscape.bookCompanion}
              </p>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayAudio}
              className="w-10 h-10 rounded-full bg-[#FFF8F1] text-[#4E0820] flex items-center justify-center hover:bg-[#F3E8D5] transition-transform active:scale-95 shadow-md shrink-0"
              title={isPlayingAudio ? 'Pausar áudio ambiente' : 'Reproduzir áudio ambiente'}
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-[#4E0820]" />
              ) : (
                <Play className="w-5 h-5 fill-[#4E0820] ml-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Volume & Spotify Bar */}
        {!minimized && (
          <div className="px-3.5 pb-3 pt-1 border-t border-[#6B2035]/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setAudioVolume(audioVolume > 0 ? 0 : 0.4)}
                className="text-[#FFD9DF] hover:text-white"
              >
                {audioVolume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#6B2035] rounded-lg appearance-none cursor-pointer accent-[#FFB1C0]"
              />
            </div>

            <a
              href={activeSoundscape.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#FFB1C0] hover:text-[#FFF8F1] transition-colors shrink-0 font-medium"
              title="Abrir no Spotify oficial"
            >
              <span>Spotify</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Minimized Bar */}
        {minimized && (
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-[#FFF8F1] truncate max-w-[180px]">
              {activeSoundscape.title}
            </span>
            <button
              onClick={togglePlayAudio}
              className="p-1 text-[#FFF8F1] hover:text-[#FFB1C0]"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
