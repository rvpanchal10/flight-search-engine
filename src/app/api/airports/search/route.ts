
import { amadeusClient } from '@/app/lib/amadeus/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const airports = await amadeusClient.searchAirports(query);

    return NextResponse.json(airports);
  } catch (error) {
    console.error('Airport search error:', error);
    return NextResponse.json(
      { error: 'Failed to search airports' },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;