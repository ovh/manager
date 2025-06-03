import { v2 } from '@ovh-ux/manager-core-api';

export type CardinalPoint =
  | 'CENTRAL'
  | 'EAST'
  | 'NORTH'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SOUTH'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'WEST';
export type SpecificType = 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
export type Type = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';

export type Location = {
  availabilityZones: string[];
  cardinalPoint: CardinalPoint;
  cityCode: string;
  cityLatitude: number;
  cityLongitude: number;
  cityName: string;
  code: string;
  countryCode: string;
  countryName: string;
  geographyCode: string;
  geographyName: string;
  location: string;
  name: string;
  openingYear: number;
  specificType: SpecificType;
  type: Type;
};

export interface ILocationPlugin {
  getLocations: () => Promise<Location[]>;
}

// TODO: remove this once we have a more generic Plugin class
export type TLocationPlugin = Record<
  string & keyof LocationPlugin,
  CallableFunction
>;

export class LocationPlugin implements ILocationPlugin {
  private locations: Location[] | null = null;

  async getLocations(): Promise<Location[]> {
    if (this.locations === null) {
      const { data } = await v2.get('/location');
      this.locations = data;
    }
    return this.locations;
  }
}
