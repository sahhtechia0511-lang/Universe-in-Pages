import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, getReviewsByBookId, addReview, getBookRatingSummary } from '@/lib/reviews-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');

    if (bookId) {
      const reviews = getReviewsByBookId(bookId);
      const summary = getBookRatingSummary(bookId);
      return NextResponse.json({ success: true, reviews, summary });
    }

    const all = getAllReviews();
    return NextResponse.json({ success: true, reviews: all });
  } catch (error) {
    console.error('API reviews GET error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao carregar resenhas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Spam honeypot check: bot field 'website_trap' or 'fax_number'
    if (body.website_trap || body.fax_number) {
      // Silently discard spam bot
      return NextResponse.json({ success: true, message: 'Resenha recebida' });
    }

    const result = addReview({
      bookId: body.bookId,
      bookTitle: body.bookTitle,
      bookAuthor: body.bookAuthor,
      reviewerName: body.reviewerName,
      reviewerRole: body.reviewerRole,
      rating: body.rating,
      title: body.title,
      content: body.content,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: result.review }, { status: 201 });
  } catch (error) {
    console.error('API reviews POST error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao processar envio da resenha' }, { status: 500 });
  }
}
