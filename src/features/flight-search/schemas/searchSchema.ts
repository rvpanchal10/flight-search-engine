import { z } from 'zod';

const airportSchema = z.object({
  iataCode: z.string()
    .min(3, 'Airport code must be 3 characters')
    .max(3, 'Airport code must be 3 characters')
    .regex(/^[A-Z]{3}$/, 'Must be a valid IATA code'),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string(),
  detailedName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.enum(['CITY', 'AIRPORT']),
});

export const searchSchema = z.object({
  origin: airportSchema
    .nullable()
    .refine(Boolean, { message: 'Origin is required' }),
  destination: airportSchema
    .nullable()
    .refine(Boolean, { message: 'Destination is required' }),
  departDate: z.string()
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Departure date must be today or in the future',
    }),
  returnDate: z.string().optional(),
  passengers: z.number()
    .min(1, 'At least 1 passenger required')
    .max(9, 'Maximum 9 passengers allowed'),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
}).refine((data) => {
  if (data.returnDate) {
    return new Date(data.returnDate) >= new Date(data.departDate);
  }
  return true;
}, {
  message: 'Return date must be after departure date',
  path: ['returnDate'],
});

export const validateParsedSearchSchema = z.object({
  origin: z.string()
    .min(3, 'Airport code must be 3 characters')
    .max(3, 'Airport code must be 3 characters')
    .regex(/^[A-Z]{3}$/, 'Must be a valid IATA code'),
  destination: z.string()
    .min(3, 'Airport code must be 3 characters')
    .max(3, 'Airport code must be 3 characters')
    .regex(/^[A-Z]{3}$/, 'Must be a valid IATA code'),
  departDate: z.string()
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Departure date must be today or in the future',
    }),
  returnDate: z.string().optional(),
  passengers: z.number()
    .min(1, 'At least 1 passenger required')
    .max(9, 'Maximum 9 passengers allowed'),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
}).refine((data) => {
  if (data.returnDate) {
    return new Date(data.returnDate) >= new Date(data.departDate);
  }
  return true;
}, {
  message: 'Return date must be after departure date',
  path: ['returnDate'],
});