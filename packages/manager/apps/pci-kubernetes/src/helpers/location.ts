import { COUNTRY_CODES, TCountryCode } from '@/domain/entities/regions';

export const isCountryCode = (input: string): input is TCountryCode =>
  (COUNTRY_CODES as ReadonlyArray<string>).includes(input);
