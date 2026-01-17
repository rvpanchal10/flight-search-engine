import { SearchParams } from "@/app/types/global";

interface AmadeusTokenResponse {
  access_token: string;
  expires_in: number;
}

interface AmadeusAirportResponse {
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    iataCode: string;
    address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
      regionCode: string;
    };
    geoCode: {
      latitude: number;
      longitude: number;
    };
  }>;
}

class AmadeusClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.baseUrl = process.env.AMADEUS_API_URL || '';
    this.apiKey = process.env.AMADEUS_API_KEY || '';
    this.apiSecret = process.env.AMADEUS_API_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    console.log('Fetching new access token from Amadeus', this.baseUrl); 

    const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data: AmadeusTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

    return this.accessToken;
  }


  async searchAirports(keyword: string) {
    try {
      const token = await this.getAccessToken();

      const queryParams = new URLSearchParams({
        keyword: keyword,
        subType: 'AIRPORT,CITY',
        'page[limit]': '10',
      });

      const response = await fetch(
        `${this.baseUrl}/v1/reference-data/locations?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Amadeus airport search error:', errorData);
        throw new Error('Failed to search airports');
      }

      const data: AmadeusAirportResponse = await response.json();

      return data.data.map((location) => ({
        iataCode: location.iataCode,
        name: location.name,
        detailedName: location.detailedName,
        city: location.address?.cityName || '',
        country: location.address?.countryName || '',
        countryCode: location.address?.countryCode || '',
        type: location.subType as 'AIRPORT' | 'CITY',
        latitude: location.geoCode?.latitude,
        longitude: location.geoCode?.longitude,
      }));
    } catch (error) {
      console.error('Error in searchAirports:', error);
      throw error;
    }
  }

  async searchFlights(params: SearchParams) {
    const token = await this.getAccessToken();

    const queryParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departDate,
      adults: params.passengers.toString(),
      travelClass: params.cabinClass,
      max: '50',
    });

    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }

    const response = await fetch(
      `${this.baseUrl}/v2/shopping/flight-offers?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch flights');
    }

    return response.json();
  }
}

export const amadeusClient = new AmadeusClient();