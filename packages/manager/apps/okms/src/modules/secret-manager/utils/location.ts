import { Location } from '@/common/types/location.type';

export const findLocationByRegion = (
  locations: Location[],
  region: string,
): Location | undefined => {
  return locations.find((location) => location.name === region);
};
