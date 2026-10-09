export interface Book {
  id: string;
  googleBooksId?: string;
  title: string;
  originalTitle?: string;
  author: string;
  authors?: string[];
  coverUrl: string;
  pageCount: number;
  publishedYear: number | string;
  publisher?: string;
  genre: string;
  atmosphere: string[];
  rating: number;
  readersCount: number;
  synopsis: string;
  quote?: string;
  isbn?: string;
  language?: string;
  spotifyPlaylistUrl?: string;
  soundscapeTheme?: string;
}

export interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  reviewerName: string;
  reviewerRole: string; // e.g. "Leitor da Comunidade", "Bibliófilo", "Crítico Literário"
  rating: number; // 1 to 5
  title: string;
  content: string;
  readingMinutes?: number;
  createdAt: string;
  verifiedReader?: boolean;
}

export interface Soundscape {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
  imageUrl: string;
  spotifyUrl: string;
  bookCompanion: string;
  audioToneType: 'rain' | 'fireplace' | 'cello-drone' | 'cyber-ambient' | 'library';
}

export interface FilterState {
  searchQuery: string;
  atmospheres: string[];
  genres: string[];
  pageLength: string | null; // '<250', '250-450', '450+', '700+'
  minRating: number | null; // 4.5, 4.0, 3.5
  sortBy: 'rating' | 'popularity' | 'title' | 'year';
  viewMode: 'grid' | 'list';
}
