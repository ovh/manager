import { GeographyCode, Location } from '@/common/types/location.type';

export const CONTINENT_CODES = {
  EUROPE: 'EUROPE',
  NORTH_AMERICA: 'NORTH_AMERICA',
  ASIA: 'ASIA',
  AFRICA: 'AFRICA',
  OTHERS: 'OTHERS',
} as const;

export type ContinentCode = keyof typeof CONTINENT_CODES;

const GEOGRAPHY_CODE_TO_CONTINENT_CODE: Record<GeographyCode, ContinentCode> = {
  eu: 'EUROPE',
  ca: 'NORTH_AMERICA',
  us: 'NORTH_AMERICA',
  ap: 'ASIA',
  af: 'AFRICA',
};

export const getContinentCodeFromGeographyCode = (geographyCode: GeographyCode): ContinentCode => {
  return GEOGRAPHY_CODE_TO_CONTINENT_CODE[geographyCode] ?? CONTINENT_CODES.OTHERS;
};

export type LocationsByContinent = Partial<Record<ContinentCode, Location[]>>;

export const groupLocationsByContinent = (locations: Location[]) => {
  const locationsByContinent: LocationsByContinent = {};
  const continents: ContinentCode[] = [];
  for (const location of locations) {
    const continentCode = getContinentCodeFromGeographyCode(location.geographyCode);

    if (!locationsByContinent[continentCode]) {
      locationsByContinent[continentCode] = [];
      continents.push(continentCode);
    }
    locationsByContinent[continentCode]?.push(location);
  }
  return { locationsByContinent, continents };
};
