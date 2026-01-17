export interface Airport {
  iataCode: string;
  name: string;
  detailedName?: string;
  city: string;
  country: string;
  countryCode?: string;
  type?: 'AIRPORT' | 'CITY';
  latitude?: number;
  longitude?: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  price: number;
  currency: string;
  stops: number;
  duration: string;
  departTime: string;
  arriveTime: string;
  departDate: string;
  arriveDate: string;
  cabinClass: string;
  seatsAvailable: number;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: AirportInfo;
  arrival: AirportInfo;
  carrierCode: string;
  flightNumber: string;
  aircraft: string;
  duration: string;
}

export interface AirportInfo {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface FilterState {
  maxPrice: number;
  stops: 'any' | '0' | '1' | '2+';
  airlines: string[];
  departTimeRange: [number, number];
  duration: number;
}

export type AirportType = 'CITY' | 'AIRPORT';

export interface SearchFormUIData {
  origin: Airport | null;
  destination: Airport | null;
  departDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}


export interface CheapestDateData {
  departureDate: string;
  returnDate?: string;
  price: number;
}

export interface PriceCalendarData {
  date: string;
  price: number;
  isSelected: boolean;
  isToday: boolean;
}

export interface AirlineDistribution {
  airline: string;
  count: number;
  avgPrice: number;
  minPrice: number;
}

export interface StopsDistribution {
  stops: number;
  count: number;
  avgPrice: number;
  percentage: number;
}

export interface TimeDistribution {
  timeSlot: string;
  count: number;
  avgPrice: number;
  label: string;
}
