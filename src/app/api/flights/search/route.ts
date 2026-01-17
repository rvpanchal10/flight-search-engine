
import { NextRequest, NextResponse } from 'next/server';
import { validateParsedSearchSchema } from '@/features/flight-search/schemas/searchSchema';
import { amadeusClient } from '@/app/lib/amadeus/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = validateParsedSearchSchema.parse(body);
    const amadeusResponse = await amadeusClient.searchFlights(validatedData);

    const flights = transformAmadeusData(amadeusResponse, validatedData);

    return NextResponse.json(flights);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function transformAmadeusData(amadeusResponse: any, searchParams: any): any[] {
  if (!amadeusResponse?.data || amadeusResponse.data.length === 0) {
    return [];
  }

  return amadeusResponse.data.map((offer: any) => {
    const itinerary = offer.itineraries?.[0];
    const segments = itinerary?.segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const pricing = offer.price;
    const travelerPricing = offer.travelerPricings?.[0];

    return {
      id: offer.id,
      airline: offer.validatingAirlineCodes?.[0] || firstSegment?.carrierCode || 'Unknown',
      flightNumber: `${firstSegment?.carrierCode || ''}${firstSegment?.number || ''}`,
      price: parseFloat(pricing?.total || '0'),
      currency: pricing?.currency || 'USD',
      stops: segments.length - 1,
      duration: itinerary?.duration?.replace('PT', '').replace('H', '.').replace('M', '') || '0',
      departTime: firstSegment?.departure?.at ? 
        new Date(firstSegment.departure.at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }) : '00:00',
      arriveTime: lastSegment?.arrival?.at ? 
        new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }) : '00:00',
      departDate: firstSegment?.departure?.at?.split('T')[0] || searchParams.departDate,
      arriveDate: lastSegment?.arrival?.at?.split('T')[0] || searchParams.departDate,
      cabinClass: travelerPricing?.fareDetailsBySegment?.[0]?.cabin || searchParams.cabinClass,
      seatsAvailable: offer.numberOfBookableSeats || 9,
      segments: segments.map((seg: any) => ({
        departure: {
          iataCode: seg.departure?.iataCode || '',
          terminal: seg.departure?.terminal,
          at: seg.departure?.at || '',
        },
        arrival: {
          iataCode: seg.arrival?.iataCode || '',
          terminal: seg.arrival?.terminal,
          at: seg.arrival?.at || '',
        },
        carrierCode: seg.carrierCode || '',
        flightNumber: seg.number || '',
        aircraft: seg.aircraft?.code || '',
        duration: seg.duration || '',
      })),
    };
  });
}
