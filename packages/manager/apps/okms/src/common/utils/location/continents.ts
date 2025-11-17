import { GeographyCode } from '@/common/types/location.type';
import { ContinentCode } from '@/common/types/continents.type';

const GEOGRAPHY_CODE_TO_CONTINENT_CODE: Record<GeographyCode, ContinentCode> = {
  eu: 'EUROPE',
  ca: 'NORTH_AMERICA',
  us: 'NORTH_AMERICA',
  ap: 'ASIA',
  af: 'AFRICA',
};

export const getContinentCodeFromGeographyCode = (
  geographyCode: GeographyCode,
): ContinentCode => {
  if (Object.keys(GEOGRAPHY_CODE_TO_CONTINENT_CODE).includes(geographyCode)) {
    return GEOGRAPHY_CODE_TO_CONTINENT_CODE[geographyCode];
  }
  return 'OTHERS';
};
