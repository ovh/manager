import { Location } from '@secret-manager/types/location.type';

export const findLocationByRegion = (
  locations: Location[],
  region: string,
): Location | undefined => {
  return locations.find((location) => location.name === region);
};
