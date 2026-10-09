import fs from 'fs';
import path from 'path';
import { Review } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'reviews.json');

// Initial seed reviews matching the Stitch design and authentic literary critics
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookId: 'sombra-do-vento',
    bookTitle: 'A Sombra do Vento',
    bookAuthor: 'Carlos Ruiz Zafón',
    reviewerName: 'Elena Laurent',
    reviewerRole: 'Colaboradora do Salão Literário',
    rating: 5,
    title: 'Uma obra-prima labiríntica com cheiro de papel velho, segredos e chuva parisiense.',
    content: 'Zafón constrói uma carta de amor inesquecível aos livros físicos e à tragédia do esquecimento. Barcelona não é meramente um cenário aqui, mas um espectro vivo envolto em fumaça de cigarro e mistério, onde cada livraria de esquina guarda um segredo devastador. A prosa é lírica, urgente e profundamente romântica.',
    readingMinutes: 6,
    createdAt: '2026-10-07T14:20:00Z',
    verifiedReader: true
  },
  {
    id: 'rev-2',
    bookId: 'piranesi',
    bookTitle: 'Piranesi',
    bookAuthor: 'Susanna Clarke',
    reviewerName: 'Marcus Sterling',
    reviewerRole: 'Bibliógrafo Sênior',
    rating: 5,
    title: 'A solidão tornada sagrada; Susanna Clarke construiu um antídoto para o cinismo contemporâneo.',
    content: 'A devoção incondicional de Piranesi à Casa — mesmo quando as marés oceânicas invadem os corredores de mármore e as estátuas murmuram o vento — nos ensina como a reverência transforma o confinamento em um santuário divino. O leitor sai dessa obra com a sensação física de ter sido purificado pelas águas de um oceano sagrado.',
    readingMinutes: 4,
    createdAt: '2026-10-04T09:15:00Z',
    verifiedReader: true
  },
  {
    id: 'rev-3',
    bookId: 'o-livro-do-desassossego',
    bookTitle: 'O Livro do Desassossego',
    bookAuthor: 'Fernando Pessoa',
    reviewerName: 'Beatriz Vasconcelos',
    reviewerRole: 'Ensaísta e Tradutora',
    rating: 5,
    title: 'A catedral do tédio sublime e da clarividência metafísica.',
    content: 'Ler Bernardo Soares não é uma atividade para ser concluída, mas um estado de espírito no qual se ingressa ao cair da tarde. Cada fragmento é como uma chuva suave batendo no vidro de uma janela em Lisboa. Uma companhia eterna para almas inquietas.',
    readingMinutes: 5,
    createdAt: '2026-10-02T18:40:00Z',
    verifiedReader: true
  },
  {
    id: 'rev-4',
    bookId: 'circe',
    bookTitle: 'Circe',
    bookAuthor: 'Madeline Miller',
    reviewerName: 'Clarice Mendes',
    reviewerRole: 'Leitora da Comunidade',
    rating: 5,
    title: 'Uma reinvenção mitológica potente e indomável.',
    content: 'Madeline Miller tem o dom de conferir carne, lágrimas e fogo antigo a figuras que a tradição reduziu a notas de rodapé. Circe encontra em sua solidão na ilha de Ea a plenitude que nenhuma corte divina jamais foi capaz de conceder-lhe.',
    readingMinutes: 4,
    createdAt: '2026-09-28T11:10:00Z',
    verifiedReader: true
  },
  {
    id: 'rev-5',
    bookId: 'a-historia-secreta',
    bookTitle: 'A História Secreta',
    bookAuthor: 'Donna Tartt',
    reviewerName: 'Thiago Nogueira',
    reviewerRole: 'Bibliófilo',
    rating: 5,
    title: 'A sedução estética do trágico e o peso indelével da culpa.',
    content: 'Donna Tartt tece a anatomia perfeita do fascínio acadêmico que descamba para a podridão moral. A atmosfera de inverno na Nova Inglaterra e as aulas de grego clássico tornam cada página magneticamente perturbadora.',
    readingMinutes: 7,
    createdAt: '2026-09-25T16:00:00Z',
    verifiedReader: true
  },
  {
    id: 'rev-6',
    bookId: 'um-cavalheiro-em-moscou',
    bookTitle: 'Um Cavalheiro em Moscou',
    bookAuthor: 'Amor Towles',
    reviewerName: 'Gabriel Siqueira',
    reviewerRole: 'Leitor da Comunidade',
    rating: 5,
    title: 'Puro conforto, nobreza de espírito e celebração da vida cotidiana.',
    content: 'O conde Rostov nos ensina que quando o destino nos retira a posse do mundo exterior, nossa nobreza reside em dominar o universo interior de nossa gentileza e atenção aos outros. Um dos livros mais calorosos que já li.',
    readingMinutes: 5,
    createdAt: '2026-09-20T10:30:00Z',
    verifiedReader: true
  }
];

// In-memory cache for fast response and robustness
let memoryReviews: Review[] = [...INITIAL_REVIEWS];
let isLoaded = false;

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn('Could not create data dir:', e);
    }
  }
}

function loadReviewsFromFile(): Review[] {
  if (isLoaded) return memoryReviews;
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryReviews = parsed;
        isLoaded = true;
        return memoryReviews;
      }
    }
    // Write initial
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_REVIEWS, null, 2), 'utf-8');
    memoryReviews = [...INITIAL_REVIEWS];
    isLoaded = true;
  } catch (err) {
    console.warn('Error reading reviews file, using in-memory store:', err);
  }
  return memoryReviews;
}

function saveReviewsToFile(reviews: Review[]): boolean {
  memoryReviews = reviews;
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Error saving reviews to file:', err);
    return false;
  }
}

export function getAllReviews(): Review[] {
  return loadReviewsFromFile();
}

export function getReviewsByBookId(bookId: string): Review[] {
  const all = loadReviewsFromFile();
  return all.filter(r => r.bookId === bookId || r.bookId.toLowerCase() === bookId.toLowerCase());
}

export function getBookRatingSummary(bookId: string, initialRating = 4.8, initialCount = 100) {
  const reviews = getReviewsByBookId(bookId);
  if (reviews.length === 0) {
    return {
      averageRating: initialRating,
      totalCount: initialCount,
      reviewsCount: 0
    };
  }
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avg = Number((sum / reviews.length).toFixed(1));
  return {
    averageRating: avg,
    totalCount: initialCount + reviews.length,
    reviewsCount: reviews.length
  };
}

export interface NewReviewInput {
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  reviewerName: string;
  reviewerRole?: string;
  rating: number;
  title: string;
  content: string;
}

export function addReview(input: NewReviewInput): { success: boolean; review?: Review; error?: string } {
  // Validation
  if (!input.bookId || !input.bookTitle) {
    return { success: false, error: 'O livro precisa ser especificado.' };
  }
  if (!input.reviewerName || input.reviewerName.trim().length < 2) {
    return { success: false, error: 'Por favor, informe seu nome (mínimo de 2 caracteres).' };
  }
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { success: false, error: 'A nota deve ser entre 1 e 5 estrelas.' };
  }
  if (!input.title || input.title.trim().length < 3) {
    return { success: false, error: 'O título da resenha deve ter no mínimo 3 caracteres.' };
  }
  if (!input.content || input.content.trim().length < 15) {
    return { success: false, error: 'A resenha deve conter pelo menos 15 caracteres com suas impressões.' };
  }

  // Calculate approximate reading time (200 words/min)
  const wordCount = input.content.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bookId: input.bookId,
    bookTitle: input.bookTitle.trim(),
    bookAuthor: input.bookAuthor?.trim() || 'Autor não informado',
    reviewerName: input.reviewerName.trim(),
    reviewerRole: input.reviewerRole?.trim() || 'Leitor da Comunidade',
    rating: Number(input.rating),
    title: input.title.trim(),
    content: input.content.trim(),
    readingMinutes,
    createdAt: new Date().toISOString(),
    verifiedReader: true
  };

  const current = loadReviewsFromFile();
  const updated = [newReview, ...current];
  saveReviewsToFile(updated);

  return { success: true, review: newReview };
}
