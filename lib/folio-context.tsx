'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Book, Soundscape } from './types';
import { CURATED_BOOKS } from './curated-books';
import { SOUNDSCAPES } from './soundscapes';

interface FolioContextType {
  savedBooks: Book[];
  isSaved: (bookId: string) => boolean;
  toggleSaveBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  activeSoundscape: Soundscape | null;
  isPlayingAudio: boolean;
  playSoundscape: (soundscape: Soundscape) => void;
  togglePlayAudio: () => void;
  stopAudio: () => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  isFolioOpen: boolean;
  setIsFolioOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const FolioContext = createContext<FolioContextType | undefined>(undefined);

function createRainBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    data[i] = (b0 + b1 + b2) * 0.12;
  }
  return buffer;
}

export function FolioProvider({ children }: { children: React.ReactNode }) {
  const [savedBooks, setSavedBooks] = useState<Book[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('uip_folio_books');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('LocalStorage initial load error:', e);
      }
    }
    return CURATED_BOOKS.slice(0, 2);
  });

  const [activeSoundscape, setActiveSoundscape] = useState<Soundscape | null>(SOUNDSCAPES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.4);
  const [isFolioOpen, setIsFolioOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; noise?: AudioBufferSourceNode; gain?: GainNode } | null>(null);

  const saveToStorage = (books: Book[]) => {
    setSavedBooks(books);
    try {
      localStorage.setItem('uip_folio_books', JSON.stringify(books));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const isSaved = (bookId: string) => {
    return savedBooks.some(b => b.id === bookId || b.googleBooksId === bookId);
  };

  const toggleSaveBook = (book: Book) => {
    if (isSaved(book.id)) {
      saveToStorage(savedBooks.filter(b => b.id !== book.id && b.googleBooksId !== book.id));
    } else {
      saveToStorage([book, ...savedBooks]);
    }
  };

  const removeBook = (bookId: string) => {
    saveToStorage(savedBooks.filter(b => b.id !== bookId && b.googleBooksId !== bookId));
  };

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsFolioOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stopAmbientTone = useCallback(() => {
    if (nodesRef.current) {
      try {
        if (nodesRef.current.osc1) nodesRef.current.osc1.stop();
        if (nodesRef.current.osc2) nodesRef.current.osc2.stop();
        if (nodesRef.current.noise) nodesRef.current.noise.stop();
      } catch (e) {
        // ignore
      }
      nodesRef.current = null;
    }
  }, []);

  const startAmbientTone = useCallback((sound: Soundscape, vol: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      stopAmbientTone();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (sound.audioToneType === 'rain' || sound.audioToneType === 'library') {
        const buffer = createRainBuffer(ctx);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        nodesRef.current = { noise, gain: masterGain };
      } else {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(65.4, ctx.currentTime);
        osc2.frequency.setValueAtTime(98.0, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        nodesRef.current = { osc1, osc2, gain: masterGain };
      }
    } catch (err) {
      console.warn('Ambient tone synthesis error:', err);
    }
  }, [stopAmbientTone]);

  const playSoundscape = (soundscape: Soundscape) => {
    setActiveSoundscape(soundscape);
    setIsPlayingAudio(true);
    startAmbientTone(soundscape, audioVolume);
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      stopAmbientTone();
      setIsPlayingAudio(false);
    } else {
      if (activeSoundscape) {
        startAmbientTone(activeSoundscape, audioVolume);
      }
      setIsPlayingAudio(true);
    }
  };

  const stopAudio = () => {
    stopAmbientTone();
    setIsPlayingAudio(false);
  };

  const handleSetVolume = (vol: number) => {
    setAudioVolume(vol);
    if (nodesRef.current?.gain && audioCtxRef.current) {
      nodesRef.current.gain.gain.setValueAtTime(vol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  return (
    <FolioContext.Provider
      value={{
        savedBooks,
        isSaved,
        toggleSaveBook,
        removeBook,
        activeSoundscape,
        isPlayingAudio,
        playSoundscape,
        togglePlayAudio,
        stopAudio,
        audioVolume,
        setAudioVolume: handleSetVolume,
        isFolioOpen,
        setIsFolioOpen,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </FolioContext.Provider>
  );
}

export function useFolio() {
  const context = useContext(FolioContext);
  if (!context) {
    throw new Error('useFolio must be used within a FolioProvider');
  }
  return context;
}
