import { ContinentCode } from '@/common/types/continents.type';
import { GeographyCode } from '@/common/types/location.type';

const GEOGRAPHY_CODE_TO_CONTINENT_CODE: Record<GeographyCode, ContinentCode> = {
  eu: 'EUROPE',
  ca: 'NORTH_AMERICA',
  us: 'NORTH_AMERICA',
  ap: 'ASIA',
  af: 'AFRICA',
};

export const getContinentCodeFromGeographyCode = (geographyCode: GeographyCode): ContinentCode => {
  return GEOGRAPHY_CODE_TO_CONTINENT_CODE[geographyCode] ?? 'OTHERS';
};
