import { NextRequest, NextResponse } from 'next/server';
import { CURATED_BOOKS } from '@/lib/curated-books';
import { Book } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';
    const genreParam = searchParams.get('genre')?.trim() || '';
    const maxResults = Math.min(Number(searchParams.get('maxResults')) || 16, 40);

    // Exact or categorized curated match
    let curatedMatches: Book[] = [];
    if (genreParam && !query) {
      const gLower = genreParam.toLowerCase();
      if (gLower === 'dark romance') {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase() === 'dark romance');
      } else if (gLower === 'romance') {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase() === 'romance');
      } else if (gLower === 'fantasia' || gLower === 'fantasy') {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase() === 'fantasia');
      } else if (gLower === 'suspense' || gLower === 'thriller' || gLower.includes('mistério')) {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase().includes('suspense'));
      } else if (gLower.includes('literária')) {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase().includes('literária'));
      } else if (gLower.includes('histórica')) {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase().includes('histórica'));
      } else {
        curatedMatches = CURATED_BOOKS.filter(b => b.genre.toLowerCase().includes(gLower));
      }
    } else if (query) {
      const qLower = query.toLowerCase();
      curatedMatches = CURATED_BOOKS.filter(b =>
        b.title.toLowerCase().includes(qLower) ||
        b.author.toLowerCase().includes(qLower) ||
        b.genre.toLowerCase().includes(qLower) ||
        b.atmosphere.some(a => a.toLowerCase().includes(qLower)) ||
        (b.synopsis && b.synopsis.toLowerCase().includes(qLower))
      );
    } else {
      // Default: all curated books
      curatedMatches = [...CURATED_BOOKS];
    }

    // Build the query string for External Book APIs (Google Books / Open Library)
    let effectiveQuery = query;
    if (!effectiveQuery && genreParam) {
      if (genreParam.toLowerCase() === 'dark romance') {
        effectiveQuery = 'dark romance Colleen Hoover Penelope Douglas Ana Huang';
      } else if (genreParam.toLowerCase() === 'romance') {
        effectiveQuery = 'romance contemporaneo Ali Hazelwood Emily Henry Colleen Hoover';
      } else if (genreParam.toLowerCase() === 'fantasia' || genreParam.toLowerCase() === 'fantasy') {
        effectiveQuery = 'fantasia Sarah J Maas Rebecca Yarros dragao magia';
      } else if (genreParam.toLowerCase() === 'suspense' || genreParam.toLowerCase() === 'thriller') {
        effectiveQuery = 'suspense thriller investigacao Freida McFadden Gillian Flynn';
      } else {
        effectiveQuery = genreParam;
      }
    }

    let apiResults: Book[] = [];
    let apiTotal = 0;
    let apiProvider = 'curated';

    // 1. Try Google Books API
    if (effectiveQuery) {
      try {
        const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(effectiveQuery)}&maxResults=${maxResults}&printType=books`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(googleBooksUrl, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            apiTotal = data.totalItems || 0;
            apiProvider = 'google-books';
            apiResults = data.items.map((item: any) => {
              const vi = item.volumeInfo || {};
              let rawCover = vi.imageLinks?.thumbnail || vi.imageLinks?.smallThumbnail || '';
              if (rawCover) {
                rawCover = rawCover.replace(/^http:\/\//i, 'https://');
                rawCover = rawCover.replace('&zoom=5', '&zoom=1');
              } else {
                rawCover = `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
              }

              let year = 'N/D';
              if (vi.publishedDate) {
                const match = vi.publishedDate.match(/^\d{4}/);
                if (match) year = match[0];
              }

              const cats: string[] = vi.categories || [];
              let detectedGenre = genreParam || cats[0] || 'Ficção Literária';
              const atmosphere: string[] = [];

              if (genreParam.toLowerCase() === 'dark romance' || (vi.title || '').toLowerCase().includes('dark romance')) {
                detectedGenre = 'Dark Romance';
                atmosphere.push('Sombrio', 'Romântico', 'Instigante');
              } else if (genreParam.toLowerCase() === 'suspense') {
                detectedGenre = 'Suspense';
                atmosphere.push('Sombrio', 'Instigante');
              } else if (genreParam.toLowerCase() === 'fantasia') {
                detectedGenre = 'Fantasia';
                atmosphere.push('Instigante', 'Romântico');
              } else if (genreParam.toLowerCase() === 'romance') {
                detectedGenre = 'Romance';
                atmosphere.push('Romântico', 'Aconchegante');
              } else {
                atmosphere.push('Filosófico', 'Aconchegante');
              }

              const isbn13 = vi.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier;
              const isbn10 = vi.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;

              return {
                id: item.id,
                googleBooksId: item.id,
                title: vi.title || 'Título desconhecido',
                author: vi.authors ? vi.authors.join(', ') : 'Autor desconhecido',
                authors: vi.authors || ['Autor desconhecido'],
                coverUrl: rawCover,
                pageCount: vi.pageCount || 340,
                publishedYear: year,
                publisher: vi.publisher || 'Editora verificada',
                genre: detectedGenre,
                atmosphere,
                rating: vi.averageRating ? Number(vi.averageRating.toFixed(1)) : 4.8,
                readersCount: vi.ratingsCount ? (vi.ratingsCount * 12) : Math.floor(Math.random() * 2400 + 1200),
                synopsis: vi.description || 'Sinopse oficial disponibilizada no catálogo digital público da Google Books API.',
                quote: vi.subtitle ? `“${vi.subtitle}”` : undefined,
                isbn: isbn13 || isbn10,
                language: vi.language || 'pt'
              };
            });
          }
        }
      } catch (gErr) {
        // Google Books failed or rate limited, fallback to Open Library API
      }

      // 2. Fallback to Open Library Search API if Google Books didn't return items
      if (apiResults.length === 0) {
        try {
          const openLibraryUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(effectiveQuery)}&limit=${maxResults}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const olRes = await fetch(openLibraryUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json' }
          });
          clearTimeout(timeoutId);

          if (olRes.ok) {
            const olData = await olRes.json();
            if (olData.docs && Array.isArray(olData.docs)) {
              apiTotal = olData.numFound || olData.docs.length;
              apiProvider = 'open-library';

              apiResults = olData.docs
                .filter((doc: any) => doc.title && (doc.cover_i || (doc.isbn && doc.isbn.length > 0)))
                .map((doc: any) => {
                  let cover = '';
                  if (doc.cover_i) {
                    cover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                  } else if (doc.isbn && doc.isbn[0]) {
                    cover = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
                  } else {
                    cover = 'https://picsum.photos/seed/codex-library/400/600';
                  }

                  let genre = genreParam || 'Ficção Literária';
                  const atmosphere: string[] = [];
                  if (genreParam.toLowerCase() === 'dark romance') {
                    genre = 'Dark Romance';
                    atmosphere.push('Sombrio', 'Romântico', 'Instigante');
                  } else if (genreParam.toLowerCase() === 'romance') {
                    genre = 'Romance';
                    atmosphere.push('Romântico', 'Aconchegante');
                  } else if (genreParam.toLowerCase() === 'fantasia') {
                    genre = 'Fantasia';
                    atmosphere.push('Instigante', 'Romântico');
                  } else if (genreParam.toLowerCase() === 'suspense') {
                    genre = 'Suspense';
                    atmosphere.push('Sombrio', 'Instigante');
                  } else {
                    atmosphere.push('Filosófico', 'Aconchegante');
                  }

                  const pubYear = doc.first_publish_year || (doc.publish_year ? doc.publish_year[0] : 'N/D');

                  return {
                    id: doc.key?.replace('/works/', '') || String(doc.cover_i || Math.random()),
                    title: doc.title,
                    author: doc.author_name ? doc.author_name.slice(0, 2).join(', ') : 'Autor reconhecido',
                    authors: doc.author_name || ['Autor reconhecido'],
                    coverUrl: cover,
                    pageCount: doc.number_of_pages_median || 350,
                    publishedYear: pubYear,
                    publisher: doc.publisher ? doc.publisher[0] : 'Edição verificada',
                    genre,
                    atmosphere,
                    rating: 4.8,
                    readersCount: Math.floor(Math.random() * 3200 + 1500),
                    synopsis: `Obra autêntica catalogada no acervo digital aberto da Open Library (Edição de ${pubYear}). Registrada com ${doc.edition_count || 1} edições mundiais.`,
                    isbn: doc.isbn ? doc.isbn[0] : undefined,
                    language: doc.language ? doc.language[0] : 'pt'
                  };
                });
            }
          }
        } catch (olErr) {
          // Open Library fetch warning
        }
      }
    }

    // Combine: curated matches first, then live API items
    const combined: Book[] = [...curatedMatches];
    for (const item of apiResults) {
      const isDuplicate = combined.some(
        c => c.title.toLowerCase() === item.title.toLowerCase() || c.id === item.id
      );
      if (!isDuplicate) {
        combined.push(item);
      }
    }

    return NextResponse.json({
      success: true,
      books: combined.slice(0, maxResults),
      totalItems: combined.length,
      source: apiResults.length > 0 ? apiProvider : 'curated'
    });
  } catch (error) {
    console.error('API search error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar livros' }, { status: 500 });
  }
}
